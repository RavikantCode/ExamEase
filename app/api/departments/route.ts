// app/api/departments/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(departments);
  } catch (error: any) {
    console.error('Error fetching departments:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch departments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, abbreviation } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Department name is required' },
        { status: 400 }
      );
    }

    const department = await prisma.department.upsert({
      where: { name },
      update: { abbreviation },
      create: { name, abbreviation }
    });

    return NextResponse.json(department);
  } catch (error: any) {
    console.error('Error creating department:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create department' },
      { status: 500 }
    );
  }
}
