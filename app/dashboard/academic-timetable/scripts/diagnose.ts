// scripts/diagnose.ts
// Run with: npx tsx scripts/diagnose.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function diagnose() {
  console.log('🔍 Running Diagnostics...\n');

  try {
    // Check basic data
    const [rooms, instructors, courses, meetingTimes, sections, workloads] = await Promise.all([
      prisma.room.findMany(),
      prisma.instructor.findMany(),
      prisma.course.findMany(),
      prisma.meetingTime.findMany({ where: { slotType: 'REGULAR' } }),
      prisma.section.findMany({ include: { department: true } }),
      prisma.workload.findMany({ include: { instructor: true } })
    ]);

    console.log('📊 Database Counts:');
    console.log(`   Rooms: ${rooms.length}`);
    console.log(`   Instructors: ${instructors.length}`);
    console.log(`   Courses: ${courses.length}`);
    console.log(`   Meeting Times (Regular): ${meetingTimes.length}`);
    console.log(`   Sections: ${sections.length}`);
    console.log(`   Workload Assignments: ${workloads.length}\n`);

    if (sections.length === 0) {
      console.log('❌ ERROR: No sections found!');
      console.log('   Run: npm run db:setup\n');
      return;
    }

    const section = sections[0];
    console.log(`📚 Section Details:`);
    console.log(`   Name: ${section.sectionName}`);
    console.log(`   Department: ${section.department.name}`);
    console.log(`   Semester: ${section.semester}`);
    console.log(`   Students: ${section.numStudents}\n`);

    // Check course-instructor relationships
    console.log('🔗 Checking Course-Instructor Relationships...');
    const coursesWithInstructors = await prisma.course.findMany({
      include: {
        instructors: {
          include: {
            instructor: true
          }
        }
      }
    });

    let coursesWithNoInstructors = 0;
    coursesWithInstructors.forEach(course => {
      if (course.instructors.length === 0) {
        coursesWithNoInstructors++;
        console.log(`   ⚠️  ${course.courseCode} has NO instructors assigned`);
      }
    });

    if (coursesWithNoInstructors > 0) {
      console.log(`\n❌ ERROR: ${coursesWithNoInstructors} courses have no instructors!`);
      console.log('   This is the problem! Courses need instructor relationships.\n');
      console.log('💡 Solution: We need to link courses to instructors via workload data.\n');
    } else {
      console.log('   ✅ All courses have instructors assigned\n');
    }

    // Check department-course relationships
    console.log('🔗 Checking Department-Course Relationships...');
    const deptWithCourses = await prisma.department.findMany({
      include: {
        courses: {
          include: {
            course: true
          }
        }
      }
    });

    deptWithCourses.forEach(dept => {
      console.log(`   ${dept.name}: ${dept.courses.length} courses`);
      if (dept.courses.length === 0) {
        console.log(`   ❌ ${dept.name} has NO courses!`);
      }
    });

    console.log('\n💡 Next Steps:');
    console.log('   1. Link courses to instructors based on workload');
    console.log('   2. Link courses to departments');
    console.log('   3. Then try generating again\n');

  } catch (error) {
    console.error('Error during diagnosis:', error);
  } finally {
    await prisma.$disconnect();
  }
}

diagnose();
