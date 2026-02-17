// lib/academic-timetable/types.ts

export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY'
}

export enum SlotType {
  REGULAR = 'REGULAR',
  SHORT_BREAK = 'SHORT_BREAK',
  LONG_BREAK = 'LONG_BREAK',
  MENTORING = 'MENTORING',
  PROJECT = 'PROJECT'
}

export interface TimeSlot {
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  slotType: SlotType;
}

export interface RoomData {
  roomNumber: string;
  seatingCapacity: number;
}

export interface InstructorData {
  uid: string;
  name: string;
  abbreviation?: string;
  maxHoursPerWeek?: number;
}

export interface CourseData {
  courseCode: string;
  courseName: string;
  maxStudents: number;
  lectureHours: number;
  practicalHours: number;
  instructorIds: string[];
}

export interface WorkloadData {
  instructorUid: string;
  courseCode: string;
  subjectName: string;
  theoryHours: number;
  practicalHours: number;
  totalHours: number;
}

export interface ClassData {
  id: string;
  sectionId: string;
  courseId: string;
  instructorId: string;
  roomId: string;
  meetingTimeId: string;
  course: {
    courseCode: string;
    courseName: string;
  };
  instructor: {
    uid: string;
    name: string;
    abbreviation?: string;
  };
  room: {
    roomNumber: string;
    seatingCapacity: number;
  };
  meetingTime: {
    day: DayOfWeek;
    startTime: string;
    endTime: string;
    slotType: SlotType;
  };
}

export interface ScheduleClass {
  classId: string;
  sectionId: string;
  courseId: string;
  instructorId: string;
  roomId: string;
  meetingTimeId: string;
  
  // For easy access
  course?: CourseData;
  instructor?: InstructorData;
  room?: RoomData;
  meetingTime?: TimeSlot;
}

export interface Schedule {
  classes: ScheduleClass[];
  fitness: number;
  conflicts: number;
}

export interface GeneticAlgorithmConfig {
  populationSize: number;
  eliteSize: number;
  tournamentSize: number;
  mutationRate: number;
  maxGenerations: number;
  targetFitness: number;
}

export interface TimetableConstraints {
  // Hard constraints (must be satisfied)
  noInstructorConflict: boolean;  // Instructor can't teach in two places at same time
  noRoomConflict: boolean;        // Room can't host two classes at same time
  noSectionConflict: boolean;     // Section can't have two classes at same time
  roomCapacity: boolean;          // Room must fit all students
  instructorWorkload: boolean;    // Instructor can't exceed max hours
  
  // Soft constraints (prefer to satisfy)
  minimizeGaps: boolean;          // Minimize gaps in schedule
  spreadCourses: boolean;         // Spread same course across different days
  preferredTimeSlots: boolean;    // Some instructors prefer certain times
}

export interface ConflictReport {
  type: 'INSTRUCTOR_CONFLICT' | 'ROOM_CONFLICT' | 'SECTION_CONFLICT' | 'CAPACITY_CONFLICT' | 'WORKLOAD_CONFLICT';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  affectedClasses: string[];
}

export interface TimetableGenerationResult {
  success: boolean;
  timetableId?: string;
  schedule?: Schedule;
  conflicts?: ConflictReport[];
  generationStats: {
    generations: number;
    finalFitness: number;
    timeTaken: number;
  };
}

export interface CSVUploadResult {
  success: boolean;
  recordsProcessed: number;
  errors?: string[];
}
