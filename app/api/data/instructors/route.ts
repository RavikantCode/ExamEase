// app/api/data/instructors/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const instructors = await prisma.instructor.findMany({
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(instructors);
  } catch (error: any) {
    console.error('Error fetching instructors:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch instructors' },
      { status: 500 }
    );
  }
}
