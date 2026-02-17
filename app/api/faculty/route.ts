import { NextResponse } from "next/server";
import { PrismaClient, SubmissionStatus } from "@/app/generated/prisma";
const prisma = new PrismaClient();
export async function POST(req: Request) {
    try {
      const body = await req.json();
      const { facultyInfo, activities } = body;
  
      // Calculate claimed amount from activities
      const claimedAmount = activities
        .filter((a: any) => a.count > 0)
        .reduce((sum: number, a: any) => sum + (a.count * a.rate), 0);
  
      const faculty = await prisma.faculty.create({
        data: {
          name: facultyInfo.name,
          department: facultyInfo.department,
          semester: facultyInfo.semester,
          email: facultyInfo.email || null,
          moodleId: facultyInfo.employeeId || null, // Save employeeId as moodleId
          claimedAmount: claimedAmount,
          submittedAt: new Date(),
          status: SubmissionStatus.SUBMITTED,
          activities: {
            create: activities.map((a: any) => ({
              type: a.type,
              category: a.category,
              difficulty: a.difficulty,
              semester: a.semester,
              subject: a.subject,
              count: a.count,
              rate: a.rate,
            })),
          },
        },
        include: { activities: true },
      });
  
      return NextResponse.json({ success: true, faculty });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ success: false, error }, { status: 500 });
    }
  }