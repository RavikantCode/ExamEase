import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const pageSize = Math.min(Math.max(parseInt(searchParams.get("pageSize") || "10", 10), 1), 100);
    const q = (searchParams.get("q") || "").trim();

    // Users with FACULTY role who don't have a Faculty submission record
    // Get all moodleIds that have submitted (from Faculty table) - normalize them
    const submittedFaculties = await prisma.faculty.findMany({ 
      select: { moodleId: true },
      where: { moodleId: { not: null } }
    });
    const submittedMoodleIds = submittedFaculties
      .map((f) => f.moodleId?.trim().toLowerCase())
      .filter((id): id is string => id !== null && id !== undefined && id !== '');

    // Build where clause: FACULTY role users NOT in submitted list
    // Exclude users whose moodle_id matches any submitted moodleId (case-insensitive)
    let submittedUserIds: string[] = [];
    if (submittedMoodleIds.length > 0) {
      // Get all users to check their moodle_ids
      const allFacultyUsers = await prisma.user.findMany({
        where: { role: "FACULTY" },
        select: { id: true, moodle_id: true }
      });
      
      // Find users whose normalized moodle_id matches any submitted moodleId
      submittedUserIds = allFacultyUsers
        .filter(u => submittedMoodleIds.includes(u.moodle_id.trim().toLowerCase()))
        .map(u => u.id);
    }

    // Build the where clause
    const whereUser: Prisma.UserWhereInput = {
      role: "FACULTY",
      ...(submittedUserIds.length > 0 && {
        NOT: { id: { in: submittedUserIds } }
      }),
      ...(q && {
        AND: [
          {
            OR: [
              { name: { contains: q, mode: Prisma.QueryMode.insensitive } },
              { moodle_id: { contains: q, mode: Prisma.QueryMode.insensitive } },
            ],
          },
        ],
      }),
    };

    const [total, users] = await Promise.all([
      prisma.user.count({ where: whereUser }),
      prisma.user.findMany({
        where: whereUser,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const data = users.map((u) => ({
      id: u.id, // Include user id for React keys
      employeeId: u.moodle_id,
      name: u.name,
      department: "",
      status: "Not Received",
    }));

    return NextResponse.json({ total, page, pageSize, data });
  } catch (err) {
    console.error("/api/remuneration/pending error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


