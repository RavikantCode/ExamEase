import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    if (!q) return NextResponse.json({ results: [] });

    const results = await prisma.faculty.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: Prisma.QueryMode.insensitive } },
          { moodleId: { contains: q } },
        ],
      },
      include: { activities: true },
      take: 20,
    });

    const mapped = results.map((f) => ({
      id: f.id,
      name: f.name,
      moodleId: f.moodleId,
      department: f.department,
      semester: f.semester,
      submittedAt: f.submittedAt,
      claimedAmount: f.claimedAmount ?? f.activities.reduce((s, a) => s + a.count * a.rate, 0),
      verifiedAmount: f.verifiedAmount ?? 0,
      status: f.status,
    }));

    return NextResponse.json({ results: mapped });
  } catch (err) {
    console.error("/api/remuneration/search error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


