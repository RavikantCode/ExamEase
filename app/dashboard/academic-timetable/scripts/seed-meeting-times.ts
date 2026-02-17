// scripts/seed-meeting-times.ts
// Run with: npx tsx scripts/seed-meeting-times.ts

import { PrismaClient, DayOfWeek, SlotType } from '@prisma/client';

const prisma = new PrismaClient();

const TIME_SLOTS = [
  { day: DayOfWeek.MONDAY, startTime: '08:10', endTime: '09:05', slotType: SlotType.REGULAR },
  { day: DayOfWeek.MONDAY, startTime: '09:05', endTime: '10:00', slotType: SlotType.REGULAR },
  { day: DayOfWeek.MONDAY, startTime: '10:00', endTime: '10:20', slotType: SlotType.SHORT_BREAK },
  { day: DayOfWeek.MONDAY, startTime: '10:20', endTime: '11:15', slotType: SlotType.REGULAR },
  { day: DayOfWeek.MONDAY, startTime: '11:15', endTime: '12:10', slotType: SlotType.REGULAR },
  { day: DayOfWeek.MONDAY, startTime: '12:10', endTime: '12:50', slotType: SlotType.LONG_BREAK },
  { day: DayOfWeek.MONDAY, startTime: '12:50', endTime: '13:45', slotType: SlotType.REGULAR },
  { day: DayOfWeek.MONDAY, startTime: '13:45', endTime: '14:40', slotType: SlotType.REGULAR },
  { day: DayOfWeek.MONDAY, startTime: '14:40', endTime: '15:35', slotType: SlotType.REGULAR },
  { day: DayOfWeek.MONDAY, startTime: '15:35', endTime: '16:30', slotType: SlotType.REGULAR },
];

const DAYS = [
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.WEDNESDAY,
  DayOfWeek.THURSDAY,
  DayOfWeek.FRIDAY
];

async function main() {
  console.log('Seeding meeting times...');

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
    }
    console.log(`✓ Created time slots for ${day}`);
  }

  console.log('✓ Meeting times seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding meeting times:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
