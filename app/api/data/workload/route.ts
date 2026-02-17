// app/api/data/workload/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const workload = await prisma.workload.findMany({
      include: {
        instructor: true
      },
      orderBy: { instructorId: 'asc' }
    });

    return NextResponse.json(workload);
  } catch (error: any) {
    console.error('Error fetching workload:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch workload' },
      { status: 500 }
    );
  }
}
