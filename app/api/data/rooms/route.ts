// app/api/data/rooms/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: { roomNumber: 'asc' }
    });

    return NextResponse.json(rooms);
  } catch (error: any) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}
