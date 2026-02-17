// app/api/timetable/generate/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';
import { generateTimetable } from '@/lib/academic-timetable/algorithms/genetic-algorithm';
import { TimetableGenerationResult } from '@/lib/academic-timetable/types';

const prisma = new PrismaClient();

// Default time-slot definitions (Mon-Fri × 8 regular slots per day = 40 slots)
const DEFAULT_TIME_SLOTS = [
  { startTime: '08:10', endTime: '09:05', slotType: 'REGULAR' as const },
  { startTime: '09:05', endTime: '10:00', slotType: 'REGULAR' as const },
  // 10:00 – 10:20 short break (not scheduled)
  { startTime: '10:20', endTime: '11:15', slotType: 'REGULAR' as const },
  { startTime: '11:15', endTime: '12:10', slotType: 'REGULAR' as const },
  // 12:10 – 12:50 long break (not scheduled)
  { startTime: '12:50', endTime: '13:45', slotType: 'REGULAR' as const },
  { startTime: '13:45', endTime: '14:40', slotType: 'REGULAR' as const },
  { startTime: '14:40', endTime: '15:35', slotType: 'REGULAR' as const },
  { startTime: '15:35', endTime: '16:30', slotType: 'REGULAR' as const },
];
const WEEK_DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'] as const;

async function ensureMeetingTimes() {
  const count = await prisma.meetingTime.count();
  if (count > 0) return; // already seeded

  const data = WEEK_DAYS.flatMap(day =>
    DEFAULT_TIME_SLOTS.map(slot => ({
      day: day as any,
      startTime: slot.startTime,
      endTime: slot.endTime,
      slotType: slot.slotType as any,
    }))
  );

  // Use createMany to bulk insert, skipDuplicates in case of race
  await prisma.meetingTime.createMany({ data, skipDuplicates: true });
  console.log(`Seeded ${data.length} meeting time slots`);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sectionId, academicYear, semester, config } = body;

    if (!sectionId || !academicYear || !semester) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: sectionId, academicYear, semester',
          generationStats: { generations: 0, finalFitness: 0, timeTaken: 0 }
        },
        { status: 400 }
      );
    }

    // Check if section exists
    const section = await prisma.section.findUnique({
      where: { id: sectionId }
    });

    if (!section) {
      return NextResponse.json(
        {
          success: false,
          error: 'Section not found',
          generationStats: { generations: 0, finalFitness: 0, timeTaken: 0 }
        },
        { status: 404 }
      );
    }

    // ---- auto-seed meeting times if empty ----
    await ensureMeetingTimes();

    console.log(`Starting timetable generation for section ${sectionId}`);

    // Generate timetable using genetic algorithm
    const result = await generateTimetable(sectionId, academicYear, semester, config);

    // Save to database
    const timetable = await prisma.timetable.create({
      data: {
        sectionId,
        academicYear,
        semester,
        fitness: result.schedule.fitness,
        conflicts: result.schedule.conflicts,
        isActive: false // Set to true manually after review
      }
    });

    // Save all classes
    const classCreationPromises = result.schedule.classes.map(cls =>
      prisma.class.create({
        data: {
          sectionId: cls.sectionId,
          courseId: cls.courseId,
          instructorId: cls.instructorId,
          roomId: cls.roomId,
          meetingTimeId: cls.meetingTimeId,
          timetableId: timetable.id,
          isLocked: false
        }
      })
    );

    await Promise.all(classCreationPromises);

    const response: TimetableGenerationResult = {
      success: true,
      timetableId: timetable.id,
      schedule: result.schedule,
      conflicts: result.conflicts,
      generationStats: result.stats
    };

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('Error generating timetable:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate timetable',
        generationStats: { generations: 0, finalFitness: 0, timeTaken: 0 }
      },
      { status: 500 }
    );
  }
}

// Get timetable by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timetableId = searchParams.get('id');
    const sectionId = searchParams.get('sectionId');

    if (timetableId) {
      const timetable = await prisma.timetable.findUnique({
        where: { id: timetableId },
        include: {
          section: true,
          classes: {
            include: {
              course: true,
              instructor: true,
              room: true,
              meetingTime: true
            }
          }
        }
      });

      if (!timetable) {
        return NextResponse.json(
          { error: 'Timetable not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(timetable);
    }

    if (sectionId) {
      const timetables = await prisma.timetable.findMany({
        where: { sectionId },
        include: {
          section: true,
          classes: {
            include: {
              course: true,
              instructor: true,
              room: true,
              meetingTime: true
            }
          }
        },
        orderBy: { generatedAt: 'desc' }
      });

      return NextResponse.json(timetables);
    }

    return NextResponse.json(
      { error: 'Missing required parameter: id or sectionId' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('Error fetching timetable:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch timetable' },
      { status: 500 }
    );
  }
}
