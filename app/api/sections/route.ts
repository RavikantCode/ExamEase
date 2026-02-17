// app/api/sections/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const sections = await prisma.section.findMany({
      include: {
        department: true
      },
      orderBy: [
        { semester: 'desc' },
        { division: 'asc' }
      ]
    });

    return NextResponse.json(sections);
  } catch (error: any) {
    console.error('Error fetching sections:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch sections' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sectionName,
      departmentId,
      semester,
      division,
      numStudents,
      classesPerWeek
    } = body;

    if (!sectionName || !departmentId || !semester || !division) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const section = await prisma.section.create({
      data: {
        sectionName,
        departmentId,
        semester: parseInt(semester),
        division,
        numStudents: parseInt(numStudents) || 60,
        classesPerWeek: parseInt(classesPerWeek) || 30
      },
      include: {
        department: true
      }
    });

    return NextResponse.json(section);
  } catch (error: any) {
    console.error('Error creating section:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create section' },
      { status: 500 }
    );
  }
}
