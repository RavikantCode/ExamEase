// lib/academic-timetable/utils/csv-parser.ts

import { parse } from 'csv-parse/sync';
import { PrismaClient } from '@/app/generated/prisma';
import { CSVUploadResult } from '../types';

// Use a single shared PrismaClient instance
const prisma = new PrismaClient();

// Type alias for CSV row
type CsvRow = Record<string, string>;

export async function parseRoomsCSV(csvContent: string): Promise<CSVUploadResult> {
  try {
    const records: CsvRow[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    const errors: string[] = [];
    let processed = 0;

    for (const record of records) {
      try {
        const roomNumber = record.roomNumber || record.room_number;
        const capacity = parseInt(record.seatingCapacity || record.capacity || record.seating_capacity || '60');

        if (!roomNumber) {
          errors.push('Missing room number in row');
          continue;
        }

        await prisma.room.upsert({
          where: { roomNumber },
          update: { seatingCapacity: capacity },
          create: { roomNumber, seatingCapacity: capacity }
        });
        processed++;
      } catch (error: any) {
        errors.push(`Error processing room ${record.roomNumber}: ${error.message}`);
      }
    }

    return {
      success: errors.length === 0,
      recordsProcessed: processed,
      errors: errors.length > 0 ? errors : undefined
    };
  } catch (error: any) {
    return {
      success: false,
      recordsProcessed: 0,
      errors: [error.message]
    };
  }
}

export async function parseInstructorsCSV(csvContent: string): Promise<CSVUploadResult> {
  try {
    const records: CsvRow[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    const errors: string[] = [];
    let processed = 0;

    for (const record of records) {
      try {
        const uid = record.uid || record.id || record.instructor_id;
        const name = record.name || record.instructor_name;
        const abbreviation = record.abbreviation || record.abbr || undefined;
        const maxHoursPerWeek = parseInt(record.maxHoursPerWeek || record.max_hours || '16');

        if (!uid || !name) {
          errors.push(`Missing uid or name in row: ${JSON.stringify(record)}`);
          continue;
        }

        await prisma.instructor.upsert({
          where: { uid },
          update: { name, abbreviation, maxHoursPerWeek },
          create: { uid, name, abbreviation, maxHoursPerWeek }
        });
        processed++;
      } catch (error: any) {
        errors.push(`Error processing instructor ${record.name}: ${error.message}`);
      }
    }

    return {
      success: errors.length === 0,
      recordsProcessed: processed,
      errors: errors.length > 0 ? errors : undefined
    };
  } catch (error: any) {
    return {
      success: false,
      recordsProcessed: 0,
      errors: [error.message]
    };
  }
}

export async function parseWorkloadCSV(
  csvContent: string,
  academicYear: string,
  semester: string
): Promise<CSVUploadResult> {
  try {
    const records: CsvRow[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    const errors: string[] = [];
    let processed = 0;

    // Get IT department (or create if doesn't exist)
    let department = await prisma.department.findFirst({
      where: { name: 'Information Technology' }
    });

    if (!department) {
      department = await prisma.department.create({
        data: {
          name: 'Information Technology',
          abbreviation: 'IT'
        }
      });
    }

    for (const record of records) {
      try {
        const instructorName = record.instructor_name || record.name || record.faculty;
        const instructorUid = record.instructor_uid || record.uid;

        // Find instructor by name or UID
        const instructor = await prisma.instructor.findFirst({
          where: {
            OR: [
              ...(instructorName ? [{ name: instructorName }] : []),
              ...(instructorUid ? [{ uid: instructorUid }] : [])
            ]
          }
        });

        if (!instructor) {
          errors.push(`Instructor not found: ${instructorName || instructorUid}`);
          continue;
        }

        // Find course
        const courseCode = record.course_code || record.subject_code;
        if (!courseCode) {
          errors.push(`Missing course_code in row: ${JSON.stringify(record)}`);
          continue;
        }

        const course = await prisma.course.findUnique({
          where: { courseCode }
        });

        if (!course) {
          errors.push(`Course not found: ${courseCode}. Please upload courses.csv first.`);
          continue;
        }

        const theoryHours = parseInt(record.theory_hours || record.th || record.theory || '0');
        const practicalHours = parseInt(record.practical_hours || record.pr || record.practical || '0');
        const subjectName = record.subject_name || record.subject || record.course || course.courseName;

        // Create workload record
        await prisma.workload.upsert({
          where: {
            instructorId_courseCode_academicYear_semester: {
              instructorId: instructor.id,
              courseCode,
              academicYear,
              semester
            }
          },
          update: {
            subjectName,
            theoryHours,
            practicalHours,
            totalHours: theoryHours + practicalHours
          },
          create: {
            instructorId: instructor.id,
            courseCode,
            subjectName,
            theoryHours,
            practicalHours,
            totalHours: theoryHours + practicalHours,
            academicYear,
            semester
          }
        });

        // Automatically create course-instructor relationship
        await prisma.courseInstructor.upsert({
          where: {
            courseId_instructorId: {
              courseId: course.id,
              instructorId: instructor.id
            }
          },
          update: {},
          create: {
            courseId: course.id,
            instructorId: instructor.id
          }
        });

        // Automatically create department-course relationship
        await prisma.departmentCourse.upsert({
          where: {
            departmentId_courseId: {
              departmentId: department.id,
              courseId: course.id
            }
          },
          update: {},
          create: {
            departmentId: department.id,
            courseId: course.id
          }
        });

        processed++;
      } catch (error: any) {
        errors.push(`Error processing workload record: ${error.message}`);
      }
    }

    return {
      success: errors.length === 0,
      recordsProcessed: processed,
      errors: errors.length > 0 ? errors : undefined
    };
  } catch (error: any) {
    return {
      success: false,
      recordsProcessed: 0,
      errors: [error.message]
    };
  }
}

export async function parseCoursesCSV(csvContent: string): Promise<CSVUploadResult> {
  try {
    const records: CsvRow[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    const errors: string[] = [];
    let processed = 0;

    for (const record of records) {
      try {
        const courseCode = record.course_code || record.courseCode;
        const courseName = record.course_name || record.courseName || record.name;

        if (!courseCode || !courseName) {
          errors.push(`Missing courseCode or courseName in row: ${JSON.stringify(record)}`);
          continue;
        }

        await prisma.course.upsert({
          where: { courseCode },
          update: {
            courseName,
            maxStudents: parseInt(record.max_students || record.maxStudents || '60'),
            lectureHours: parseInt(record.lecture_hours || record.lectureHours || record.theory_hours || record.th || '0'),
            practicalHours: parseInt(record.practical_hours || record.practicalHours || record.lab_hours || record.pr || '0')
          },
          create: {
            courseCode,
            courseName,
            maxStudents: parseInt(record.max_students || record.maxStudents || '60'),
            lectureHours: parseInt(record.lecture_hours || record.lectureHours || record.theory_hours || record.th || '0'),
            practicalHours: parseInt(record.practical_hours || record.practicalHours || record.lab_hours || record.pr || '0')
          }
        });
        processed++;
      } catch (error: any) {
        errors.push(`Error processing course ${record.courseCode || record.course_code}: ${error.message}`);
      }
    }

    return {
      success: errors.length === 0,
      recordsProcessed: processed,
      errors: errors.length > 0 ? errors : undefined
    };
  } catch (error: any) {
    return {
      success: false,
      recordsProcessed: 0,
      errors: [error.message]
    };
  }
}
