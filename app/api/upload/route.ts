// app/api/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import {
  parseRoomsCSV,
  parseInstructorsCSV,
  parseWorkloadCSV,
  parseCoursesCSV
} from '@/lib/academic-timetable/utils/csv-parser';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    const academicYear = formData.get('academicYear') as string;
    const semester = formData.get('semester') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    if (!type) {
      return NextResponse.json(
        { error: 'Upload type not specified' },
        { status: 400 }
      );
    }

    const content = await file.text();
    let result;

    switch (type) {
      case 'rooms':
        result = await parseRoomsCSV(content);
        break;

      case 'instructors':
        result = await parseInstructorsCSV(content);
        break;

      case 'workload':
        if (!academicYear || !semester) {
          return NextResponse.json(
            { error: 'Academic year and semester required for workload upload' },
            { status: 400 }
          );
        }
        result = await parseWorkloadCSV(content, academicYear, semester);
        break;

      case 'courses':
        result = await parseCoursesCSV(content);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid upload type' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Upload failed'
      },
      { status: 500 }
    );
  }
}
