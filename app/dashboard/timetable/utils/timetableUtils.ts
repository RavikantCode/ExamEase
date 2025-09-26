import {
    Course,
    Teacher,
    Room,
    TimeSlot,
    Config,
    ExamAssignment,
    GeneratedTimetable,
  } from "./types";
  
  /**
   * Generate all time slots for a day based on configuration.
   */
  export const calculateTimeSlots = (config: Config): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const [startHour, startMinute] = config.startTime.split(":").map(Number);
  
    for (let shift = 0; shift < config.shiftsPerDay; shift++) {
      const shiftStartMinutes =
        startHour * 60 +
        startMinute +
        shift * (config.examDurationHours * 60 + config.breakTimeMinutes);
  
      const startTime = `${Math.floor(shiftStartMinutes / 60)
        .toString()
        .padStart(2, "0")}:${(shiftStartMinutes % 60).toString().padStart(2, "0")}`;
  
      const endMinutes = shiftStartMinutes + config.examDurationHours * 60;
      const endTime = `${Math.floor(endMinutes / 60)
        .toString()
        .padStart(2, "0")}:${(endMinutes % 60).toString().padStart(2, "0")}`;
  
      slots.push({ startTime, endTime });
    }
  
    return slots;
  };
  
  /**
   * Generate an exam timetable.
   * Assigns courses into available slots, rooms, and teachers.
   */
  export const generateTimetable = (
    courses: Course[],
    teachers: Teacher[],
    rooms: Room[],
    examDates: string[],
    config: Config
  ): GeneratedTimetable => {
    const timeSlots = calculateTimeSlots(config);
  
    const schedule: Record<string, Record<string, ExamAssignment[]>> = {};
    const unscheduled: Course[] = [];
  
    const teacherLoad: Record<string, number> = {};
    teachers.forEach((t) => (teacherLoad[t.id] = 0));
  
    let teacherIndex = 0;
    let roomIndex = 0;
  
    courses.forEach((course) => {
      let assigned = false;

      if (teachers.length === 0 || rooms.length === 0) {
        unscheduled.push(course);
        return;                             // Skip further processing for this course -- change krna baaki  
      }
    
  
      for (const date of examDates) {
        if (!schedule[date]) schedule[date] = {};
  
        for (const slot of timeSlots) {
          const slotKey = `${slot.startTime}-${slot.endTime}`;
          if (!schedule[date][slotKey]) schedule[date][slotKey] = [];
  
          const teacher = teachers[teacherIndex];
          const room = rooms[roomIndex];
  
          if (!teacher || !room) continue;
  
          if (
            teacherLoad[teacher.id] + config.examDurationHours <=
            teacher.maxHoursPerDay
          ) {
            schedule[date][slotKey].push({ course, teacher, room });
            teacherLoad[teacher.id] += config.examDurationHours;
  
            teacherIndex = (teacherIndex + 1) % teachers.length;
            roomIndex = (roomIndex + 1) % rooms.length;
  
            assigned = true;
            break;
          }
        }
  
        if (assigned) break;
      }
  
      if (!assigned) unscheduled.push(course);
    });
  
    return {
      schedule,
      unscheduled,
      timeSlots,
      stats: {
        totalCourses: courses.length,
        scheduledCourses: courses.length - unscheduled.length,
        unscheduledCourses: unscheduled.length,
      },
    };
  };
  