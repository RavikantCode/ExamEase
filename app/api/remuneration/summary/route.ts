import { NextResponse } from "next/server";
import { PrismaClient, SubmissionStatus } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Total faculty = number of users with FACULTY role
    const totalFaculty = await prisma.user.count({ where: { role: "FACULTY" } });

    // Get unique moodleIds that have submitted (from Faculty table) - normalize for case-insensitive matching
    const submittedFaculties = await prisma.faculty.findMany({ 
      select: { moodleId: true },
      where: { moodleId: { not: null } }
    });
    const submittedMoodleIdsNormalized = submittedFaculties
      .map((f) => f.moodleId?.trim().toLowerCase())
      .filter((id): id is string => id !== null && id !== undefined && id !== '');
    
    // Get all faculty users and match by normalized moodle_id
    const allFacultyUsers = await prisma.user.findMany({
      where: { role: "FACULTY" },
      select: { moodle_id: true }
    });
    
    // Count unique submitted users (case-insensitive matching)
    const submittedUserMoodleIds = new Set(
      allFacultyUsers
        .filter(u => submittedMoodleIdsNormalized.includes(u.moodle_id.trim().toLowerCase()))
        .map(u => u.moodle_id.trim().toLowerCase())
    );
    const submitted = submittedUserMoodleIds.size;
    const pending = Math.max(totalFaculty - submitted, 0);

    const verifiedAmountsAgg = await prisma.faculty.aggregate({
      _sum: { verifiedAmount: true },
      where: { status: SubmissionStatus.VERIFIED },
    });

    return NextResponse.json({
      totalFaculty,
      submitted,
      pending,
      verifiedAmountTotal: verifiedAmountsAgg._sum.verifiedAmount || 0,
    });
  } catch (err) {
    console.error("/api/remuneration/summary error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


