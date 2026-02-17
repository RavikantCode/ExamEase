import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { scope, moodleId } = body as { scope: "all" | "one"; moodleId?: string };

    let recipients: { name: string; email?: string; moodleId?: string }[] = [];
    if (scope === "one" && moodleId) {
      const user = await prisma.user.findFirst({ where: { moodle_id: moodleId } });
      if (user) recipients.push({ name: user.name, moodleId: user.moodle_id });
    } else {
      const submittedMoodleIds = (await prisma.faculty.findMany({ select: { moodleId: true } }))
        .map((f) => f.moodleId)
        .filter(Boolean) as string[];
      recipients = await prisma.user.findMany({
        where: { role: "FACULTY", NOT: submittedMoodleIds.length ? { moodle_id: { in: submittedMoodleIds } } : undefined },
        select: { name: true, moodle_id: true },
      }).then((arr) => arr.map((u) => ({ name: u.name, moodleId: u.moodle_id })));
    }

    return NextResponse.json({ success: true, count: recipients.length, recipients });
  } catch (err) {
    console.error("/api/remuneration/remind error", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}


