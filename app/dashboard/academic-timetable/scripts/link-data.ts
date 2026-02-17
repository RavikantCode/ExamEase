// scripts/link-data.ts
// Run with: npx tsx scripts/link-data.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function linkData() {
  console.log('🔗 Linking Courses to Instructors and Departments...\n');

  try {
    // Get all workload assignments
    const workloads = await prisma.workload.findMany({
      include: {
        instructor: true
      }
    });

    if (workloads.length === 0) {
      console.log('❌ No workload data found! Please upload workload.csv first.\n');
      return;
    }

    console.log(`Found ${workloads.length} workload assignments\n`);

    // Get IT department
    const department = await prisma.department.findFirst({
      where: { name: 'Information Technology' }
    });

    if (!department) {
      console.log('❌ IT Department not found! Run: npm run db:setup\n');
      return;
    }

    console.log(`Department: ${department.name} (ID: ${department.id})\n`);

    // Group workloads by course
    const courseCodes = new Set(workloads.map(w => w.courseCode));
    console.log(`Processing ${courseCodes.size} unique courses...\n`);

    let linked = 0;
    let errors = 0;

    for (const courseCode of courseCodes) {
      try {
        // Find the course
        const course = await prisma.course.findUnique({
          where: { courseCode }
        });

        if (!course) {
          console.log(`⚠️  Course ${courseCode} not found in database, skipping...`);
          errors++;
          continue;
        }

        // Find all instructors for this course
        const instructorsForCourse = workloads
          .filter(w => w.courseCode === courseCode)
          .map(w => w.instructorId);

        const uniqueInstructors = [...new Set(instructorsForCourse)];

        // Link course to instructors
        for (const instructorId of uniqueInstructors) {
          await prisma.courseInstructor.upsert({
            where: {
              courseId_instructorId: {
                courseId: course.id,
                instructorId: instructorId
              }
            },
            update: {},
            create: {
              courseId: course.id,
              instructorId: instructorId
            }
          });
        }

        // Link course to department
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

        console.log(`✅ ${courseCode}: Linked to ${uniqueInstructors.length} instructor(s)`);
        linked++;

      } catch (error: any) {
        console.log(`❌ Error linking ${courseCode}: ${error.message}`);
        errors++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Successfully linked: ${linked} courses`);
    console.log(`   ❌ Errors: ${errors}\n`);

    // Verify
    const coursesWithInstructors = await prisma.course.findMany({
      include: {
        instructors: true
      }
    });

    const coursesWithNoInstructors = coursesWithInstructors.filter(c => c.instructors.length === 0);
    
    if (coursesWithNoInstructors.length > 0) {
      console.log(`⚠️  ${coursesWithNoInstructors.length} courses still have no instructors:`);
      coursesWithNoInstructors.forEach(c => {
        console.log(`   - ${c.courseCode}: ${c.courseName}`);
      });
      console.log();
    } else {
      console.log('🎉 All courses are now linked to instructors!\n');
      console.log('You can now generate timetables at http://localhost:3000/generate\n');
    }

  } catch (error) {
    console.error('Error linking data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

linkData();
