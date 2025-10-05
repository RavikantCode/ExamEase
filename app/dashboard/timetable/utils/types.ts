export interface Course {
    id: string;
    code: string;
    name: string;
    semester: string;
    subject: string;
  }
  
  export interface Teacher {
    id: string;
    name: string;
    branch: string;
    maxHoursPerDay: number;
  }
  
  export interface Room {
    id: string;
    name: string;
    capacity: number;
  }
  
  export interface TimeSlot {
    startTime: string;
    endTime: string;
  }
  
  export interface ExamAssignment {
    course: Course;
    teacher: Teacher;
    room: Room;
  }
  
  export interface Config {
    startTime: string;
    examDurationHours: number;
    breakTimeMinutes: number;
    shiftsPerDay: number;
  }
  
  export interface GeneratedTimetable {
    schedule: Record<string, Record<string, ExamAssignment[]>>;
    unscheduled: Course[];
    timeSlots: TimeSlot[];
    stats: {
      totalCourses: number;
      scheduledCourses: number;
      unscheduledCourses: number;
    };
  }
  