import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const faculty = await prisma.faculty.findUnique({
      where: { id },
      include: { activities: true },
    });
    if (!faculty) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(faculty);
  } catch (err) {
    console.error("GET /api/faculty/[id] error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


