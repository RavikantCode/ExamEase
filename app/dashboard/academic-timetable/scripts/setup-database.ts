// scripts/setup-database.ts
// Run with: npx tsx scripts/setup-database.ts

import { PrismaClient, DayOfWeek, SlotType } from '@prisma/client';

const prisma = new PrismaClient();

const TIME_SLOTS = [
  { startTime: '08:10', endTime: '09:05', slotType: SlotType.REGULAR },
  { startTime: '09:05', endTime: '10:00', slotType: SlotType.REGULAR },
  { startTime: '10:00', endTime: '10:20', slotType: SlotType.SHORT_BREAK },
  { startTime: '10:20', endTime: '11:15', slotType: SlotType.REGULAR },
  { startTime: '11:15', endTime: '12:10', slotType: SlotType.REGULAR },
  { startTime: '12:10', endTime: '12:50', slotType: SlotType.LONG_BREAK },
  { startTime: '12:50', endTime: '13:45', slotType: SlotType.REGULAR },
  { startTime: '13:45', endTime: '14:40', slotType: SlotType.REGULAR },
  { startTime: '14:40', endTime: '15:35', slotType: SlotType.REGULAR },
  { startTime: '15:35', endTime: '16:30', slotType: SlotType.REGULAR },
];

const DAYS = [
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.WEDNESDAY,
  DayOfWeek.THURSDAY,
  DayOfWeek.FRIDAY
];

async function main() {
  console.log('🚀 Starting database setup...\n');

  // 1. Create meeting times
  console.log('📅 Creating meeting times...');
  let meetingTimeCount = 0;
  
  for (const day of DAYS) {
    for (const slot of TIME_SLOTS) {
      await prisma.meetingTime.upsert({
        where: {
          day_startTime_endTime: {
            day: day,
            startTime: slot.startTime,
            endTime: slot.endTime
          }
        },
        update: {
          slotType: slot.slotType
        },
        create: {
          day: day,
          startTime: slot.startTime,
          endTime: slot.endTime,
          slotType: slot.slotType
        }
      });
      meetingTimeCount++;
    }
  }
  console.log(`✅ Created ${meetingTimeCount} time slots (${DAYS.length} days × ${TIME_SLOTS.length} slots)\n`);

  // 2. Create/Get IT Department
  console.log('🏢 Creating IT Department...');
  const department = await prisma.department.upsert({
    where: { name: 'Information Technology' },
    update: {
      abbreviation: 'IT'
    },
    create: {
      name: 'Information Technology',
      abbreviation: 'IT'
    }
  });
  console.log(`✅ Department: ${department.name} (ID: ${department.id})\n`);

  // 3. Create BE-C-VIII Section
  console.log('📚 Creating BE-C-VIII Section...');
  const section = await prisma.section.upsert({
    where: {
      sectionName_departmentId: {
        sectionName: 'BE-C-VIII',
        departmentId: department.id
      }
    },
    update: {
      semester: 8,
      division: 'C',
      numStudents: 60,
      classesPerWeek: 30
    },
    create: {
      sectionName: 'BE-C-VIII',
      departmentId: department.id,
      semester: 8,
      division: 'C',
      numStudents: 60,
      classesPerWeek: 30
    }
  });
  console.log(`✅ Section: ${section.sectionName} (Semester ${section.semester}, Division ${section.division})\n`);

  // 4. Show summary
  console.log('📊 Database Summary:');
  const [rooms, instructors, courses, workload] = await Promise.all([
    prisma.room.count(),
    prisma.instructor.count(),
    prisma.course.count(),
    prisma.workload.count()
  ]);

  console.log(`   • Rooms: ${rooms}`);
  console.log(`   • Instructors: ${instructors}`);
  console.log(`   • Courses: ${courses}`);
  console.log(`   • Workload Assignments: ${workload}`);
  console.log(`   • Meeting Times: ${meetingTimeCount}`);
  console.log(`   • Departments: 1`);
  console.log(`   • Sections: 1\n`);

  if (rooms === 0 || instructors === 0 || courses === 0) {
    console.log('⚠️  Warning: Please upload CSV data before generating timetables!');
    console.log('   1. Navigate to http://localhost:3000/admin');
    console.log('   2. Upload rooms.csv, instructors.csv, courses.csv, workload.csv\n');
  } else {
    console.log('🎉 All set! You can now generate timetables!');
    console.log('   Navigate to http://localhost:3000/generate\n');
  }
}

main()
  .catch((e) => {
    console.error('❌ Error during setup:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
