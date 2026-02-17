import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const faculties = await prisma.faculty.findMany({ include: { activities: true } });

    const rows: string[][] = [];
    rows.push(["ExamEase - Remuneration Report (All Faculty)"]); rows.push([""]);
    rows.push(["Name","Moodle ID","Department","Semester","Submitted On","Claimed Amount","Verified Amount","Status"]);

    for (const f of faculties) {
      const claimed = f.claimedAmount ?? f.activities.reduce((s, a) => s + a.count * a.rate, 0);
      rows.push([
        f.name,
        f.moodleId || "",
        f.department,
        f.semester,
        f.submittedAt ? new Date(f.submittedAt).toISOString() : "",
        String(claimed),
        String(f.verifiedAmount ?? ""),
        f.status,
      ]);
    }

    rows.push([""]); rows.push(["Activities Breakdown"]);
    rows.push(["Faculty","Activity","Category","Difficulty","Semester","Subject","Count","Rate","Total"]);
    faculties.forEach((f) => {
      f.activities.forEach((a) => {
        rows.push([
          f.name,
          a.type,
          a.category,
          a.difficulty,
          a.semester,
          a.subject,
          String(a.count),
          String(a.rate),
          String(a.count * a.rate),
        ]);
      });
    });

    const csvContent = rows.map((r) => r.join(",")).join("\n");
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv;charset=utf-8",
        "Content-Disposition": `attachment; filename="ExamEase_Remuneration_Report.csv"`,
      },
    });
  } catch (err) {
    console.error("/api/remuneration/export error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


