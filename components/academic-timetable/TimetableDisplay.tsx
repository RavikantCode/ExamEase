// components/academic-timetable/TimetableDisplay.tsx

'use client';

import { ClassData, DayOfWeek } from '@/lib/academic-timetable/types';

interface TimetableDisplayProps {
  classes: ClassData[];
  sectionName: string;
}

const TIME_SLOTS = [
  { start: '08:10', end: '09:05', label: '8:10 - 9:05' },
  { start: '09:05', end: '10:00', label: '9:05 - 10:00' },
  { start: '10:00', end: '10:20', label: '10:00 - 10:20', isBreak: true },
  { start: '10:20', end: '11:15', label: '10:20 - 11:15' },
  { start: '11:15', end: '12:10', label: '11:15 - 12:10' },
  { start: '12:10', end: '12:50', label: '12:10 - 12:50', isBreak: true },
  { start: '12:50', end: '13:45', label: '12:50 - 1:45' },
  { start: '13:45', end: '14:40', label: '1:45 - 2:40' },
  { start: '14:40', end: '15:35', label: '2:40 - 3:35' },
  { start: '15:35', end: '16:30', label: '3:35 - 4:30' }
];

const DAYS: DayOfWeek[] = [
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.WEDNESDAY,
  DayOfWeek.THURSDAY,
  DayOfWeek.FRIDAY
];

export default function TimetableDisplay({ classes, sectionName }: TimetableDisplayProps) {
  // Create a map of classes by day and time
  const scheduleMap = new Map<string, ClassData>();
  
  classes.forEach(cls => {
    const key = `${cls.meetingTime.day}-${cls.meetingTime.startTime}`;
    scheduleMap.set(key, cls);
  });

  const getClassForSlot = (day: DayOfWeek, timeSlot: typeof TIME_SLOTS[0]): ClassData | null => {
    const key = `${day}-${timeSlot.start}`;
    return scheduleMap.get(key) || null;
  };

  const renderClassCell = (cls: ClassData | null, timeSlot: typeof TIME_SLOTS[0]) => {
    if (timeSlot.isBreak) {
      return (
        <td key={timeSlot.start} className="border border-gray-300 bg-gray-100 text-center text-xs font-medium">
          {timeSlot.label.includes('10:00') ? 'SHORT BREAK' : 'LONG BREAK'}
        </td>
      );
    }

    if (!cls) {
      return (
        <td key={timeSlot.start} className="border border-gray-300 bg-white p-2">
          <div className="text-xs text-gray-400 text-center">-</div>
        </td>
      );
    }

    return (
      <td key={timeSlot.start} className="border border-gray-300 bg-blue-50 p-2">
        <div className="space-y-1">
          <div className="font-semibold text-sm text-blue-900">
            {cls.course.courseName}
          </div>
          <div className="text-xs text-gray-700">
            ({cls.course.courseCode})
          </div>
          <div className="text-xs text-gray-600">
            {cls.instructor.abbreviation || cls.instructor.name}
          </div>
          <div className="text-xs text-gray-500">
            Room: {cls.room.roomNumber}
          </div>
        </div>
      </td>
    );
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {sectionName} - Timetable
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Academic Year: 2025-26 (Even Semester)
        </p>
      </div>

      <table className="w-full border-collapse border border-gray-400 bg-white shadow-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-400 p-2 text-sm font-bold">Time/Day</th>
            {TIME_SLOTS.map(slot => (
              <th
                key={slot.start}
                className={`border border-gray-400 p-2 text-xs font-semibold ${
                  slot.isBreak ? 'bg-gray-300' : ''
                }`}
              >
                {slot.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DAYS.map(day => (
            <tr key={day}>
              <td className="border border-gray-400 bg-green-100 p-3 font-bold text-sm">
                {day}
              </td>
              {TIME_SLOTS.map(slot => 
                renderClassCell(getClassForSlot(day, slot), slot)
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      <div className="mt-4 flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-50 border border-gray-300"></div>
          <span>Regular Class</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 border border-gray-300"></div>
          <span>Break</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border border-gray-300"></div>
          <span>Free Slot</span>
        </div>
      </div>
    </div>
  );
}
