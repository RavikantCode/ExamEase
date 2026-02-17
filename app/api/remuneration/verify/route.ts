import { NextResponse } from "next/server";
import { PrismaClient, SubmissionStatus } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { facultyId, verifiedAmount, remark, decision } = body as {
      facultyId: number;
      verifiedAmount: number;
      remark?: string;
      decision: "approve" | "reject";
    };

    const status = decision === "approve" ? SubmissionStatus.VERIFIED : SubmissionStatus.REJECTED;

    const updated = await prisma.faculty.update({
      where: { id: facultyId },
      data: {
        verifiedAmount,
        remark,
        status,
      },
      include: { activities: true },
    });

    return NextResponse.json({ success: true, faculty: updated });
  } catch (err) {
    console.error("/api/remuneration/verify error", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}


