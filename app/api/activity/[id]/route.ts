import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const body = await req.json();
    const { count, rate, subject, type, category, difficulty } = body;

    const updated = await prisma.activity.update({
      where: { id },
      data: {
        ...(count !== undefined && { count }),
        ...(rate !== undefined && { rate }),
        ...(subject !== undefined && { subject }),
        ...(type !== undefined && { type }),
        ...(category !== undefined && { category }),
        ...(difficulty !== undefined && { difficulty }),
      },
    });

    return NextResponse.json({ success: true, activity: updated });
  } catch (err) {
    console.error("PATCH /api/activity/[id] error", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
