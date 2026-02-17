import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const pageSize = Math.min(Math.max(parseInt(searchParams.get("pageSize") || "10", 10), 1), 100);
    const q = (searchParams.get("q") || "").trim();

    const where = q
      ? {
          OR: [
            { name: { contains: q, mode: Prisma.QueryMode.insensitive } },
            { moodleId: { contains: q, mode: Prisma.QueryMode.insensitive } },
          ],
        }
      : {};

    const [total, items] = await Promise.all([
      prisma.faculty.count({ where }),
      prisma.faculty.findMany({
        where,
        include: { activities: true },
        orderBy: { submittedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const data = items.map((f) => ({
      id: f.id,
      employeeId: f.moodleId,
      name: f.name,
      department: f.department,
      amount: f.claimedAmount ?? f.activities.reduce((s, a) => s + a.count * a.rate, 0),
      submittedOn: f.submittedAt,
    }));

    return NextResponse.json({ total, page, pageSize, data });
  } catch (err) {
    console.error("/api/remuneration/submitted error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


