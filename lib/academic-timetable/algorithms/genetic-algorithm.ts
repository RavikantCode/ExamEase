// lib/academic-timetable/algorithms/genetic-algorithm.ts

import { PrismaClient } from '@/app/generated/prisma';
import {
  Schedule,
  ScheduleClass,
  GeneticAlgorithmConfig,
  ConflictReport,
  DayOfWeek
} from '../types';

const prisma = new PrismaClient();

// ── Locked bookings from previously generated timetables ──────────────
// These represent instructor-time and room-time pairs that are already
// committed and MUST NOT be double-booked by a new schedule.
export interface ExistingBookings {
  // Set of "instructorId::meetingTimeId" keys already occupied
  instructorSlots: Set<string>;
  // Set of "roomId::meetingTimeId" keys already occupied
  roomSlots: Set<string>;
  // For better error messages: map key → section name
  instructorSlotDetails: Map<string, string>;
  roomSlotDetails: Map<string, string>;
}

export class TimetableData {
  rooms: any[] = [];
  instructors: any[] = [];
  courses: any[] = [];
  meetingTimes: any[] = [];
  sections: any[] = [];
  workloads: Map<string, any[]> = new Map();
  existingBookings: ExistingBookings = {
    instructorSlots: new Set(),
    roomSlots: new Set(),
    instructorSlotDetails: new Map(),
    roomSlotDetails: new Map()
  };

  async initialize(sectionId: string, academicYear: string, semester: string) {
    // Load all necessary data
    this.rooms = await prisma.room.findMany();
    this.instructors = await prisma.instructor.findMany();
    this.meetingTimes = await prisma.meetingTime.findMany({
      where: {
        slotType: 'REGULAR' // Only regular time slots for classes
      },
      orderBy: [
        { day: 'asc' },
        { startTime: 'asc' }
      ]
    });

    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      include: {
        department: {
          include: {
            courses: {
              include: {
                course: {
                  include: {
                    instructors: {
                      include: {
                        instructor: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!section) {
      throw new Error('Section not found');
    }

    this.sections = [section];
    this.courses = section.department.courses.map(dc => dc.course);

    // Load workloads for all instructors
    const workloads = await prisma.workload.findMany({
      where: {
        academicYear,
        semester
      }
    });

    workloads.forEach(wl => {
      const existing = this.workloads.get(wl.instructorId) || [];
      existing.push(wl);
      this.workloads.set(wl.instructorId, existing);
    });

    // ── Load existing bookings from all OTHER timetables ──────────────
    // Find all classes from timetables that belong to a DIFFERENT section
    // for the same academic year & semester (those are the real conflicts).
    const existingClasses = await prisma.class.findMany({
      where: {
        timetable: {
          academicYear,
          semester,
          sectionId: { not: sectionId } // only other sections
        }
      },
      include: {
        instructor: true,
        room: true,
        meetingTime: true,
        section: true
      }
    });

    for (const cls of existingClasses) {
      const instrKey = `${cls.instructorId}::${cls.meetingTimeId}`;
      const roomKey = `${cls.roomId}::${cls.meetingTimeId}`;
      const label = cls.section?.sectionName || 'unknown section';

      this.existingBookings.instructorSlots.add(instrKey);
      this.existingBookings.roomSlots.add(roomKey);
      this.existingBookings.instructorSlotDetails.set(instrKey, `${cls.instructor?.name} already teaching ${label}`);
      this.existingBookings.roomSlotDetails.set(roomKey, `Room ${cls.room?.roomNumber} used by ${label}`);
    }

    console.log(`Loaded ${existingClasses.length} existing bookings from other timetables`);

    // Also count how many hours each instructor is already committed
    // across other sections (for workload cap checking)
    const existingHours = new Map<string, number>();
    for (const cls of existingClasses) {
      existingHours.set(cls.instructorId, (existingHours.get(cls.instructorId) || 0) + 1);
    }
    this.existingInstructorHours = existingHours;

    // ---- Validate data completeness ----
    if (this.rooms.length === 0) throw new Error('No rooms found. Upload rooms CSV first.');
    if (this.instructors.length === 0) throw new Error('No instructors found. Upload instructors CSV first.');
    if (this.meetingTimes.length === 0) throw new Error('No meeting time slots found. Ensure the MeetingTime table is seeded.');
    if (this.courses.length === 0) throw new Error('No courses linked to this section\'s department. Upload workload CSV to create department-course links.');
    if (workloads.length === 0) throw new Error('No workload records found for the selected academic year and semester. Upload workload CSV first.');
  }

  // Hours already committed by each instructor in other timetables
  existingInstructorHours: Map<string, number> = new Map();

  getRooms() { return this.rooms; }
  getInstructors() { return this.instructors; }
  getCourses() { return this.courses; }
  getMeetingTimes() { return this.meetingTimes; }
  getSections() { return this.sections; }
  getWorkloads(instructorId: string) { return this.workloads.get(instructorId) || []; }
  getExistingBookings() { return this.existingBookings; }
  getExistingInstructorHours(instructorId: string) { return this.existingInstructorHours.get(instructorId) || 0; }
}

export class TimetableSchedule {
  private data: TimetableData;
  private classes: ScheduleClass[] = [];
  private numberOfConflicts: number = 0;
  private fitness: number = -1;
  private isFitnessChanged: boolean = true;

  constructor(data: TimetableData) {
    this.data = data;
  }

  getClasses(): ScheduleClass[] {
    this.isFitnessChanged = true;
    return this.classes;
  }

  getNumberOfConflicts(): number {
    return this.numberOfConflicts;
  }

  getFitness(): number {
    if (this.isFitnessChanged) {
      this.fitness = this.calculateFitness();
      this.isFitnessChanged = false;
    }
    return this.fitness;
  }

  async initialize(): Promise<TimetableSchedule> {
    const sections = this.data.getSections();
    const courses = this.data.getCourses();
    const meetingTimes = this.data.getMeetingTimes();
    const rooms = this.data.getRooms();
    const bookings = this.data.getExistingBookings();

    let classId = 0;

    for (const section of sections) {
      for (const course of courses) {
        // Get instructors who can teach this course
        const courseInstructors = course.instructors
          .map((ci: any) => ci.instructor)
          .filter((inst: any) => {
            const workloads = this.data.getWorkloads(inst.id);
            return workloads.some((wl: any) => wl.courseCode === course.courseCode);
          });

        if (courseInstructors.length === 0) continue;

        // Calculate total hours needed for this course
        const totalHours = course.lectureHours + course.practicalHours;
        
        // Create classes for this course
        for (let i = 0; i < totalHours; i++) {
          const randomInstructor = courseInstructors[
            Math.floor(Math.random() * courseInstructors.length)
          ];

          // Try to pick a meeting time that doesn't clash with existing bookings
          let randomMeetingTime = meetingTimes[Math.floor(Math.random() * meetingTimes.length)];
          let randomRoom = rooms[Math.floor(Math.random() * rooms.length)];

          // Attempt up to 10 tries to find a non-conflicting slot
          for (let attempt = 0; attempt < 10; attempt++) {
            const instrKey = `${randomInstructor.id}::${randomMeetingTime.id}`;
            const roomKey = `${randomRoom.id}::${randomMeetingTime.id}`;
            if (!bookings.instructorSlots.has(instrKey) && !bookings.roomSlots.has(roomKey)) {
              break; // found a free combination
            }
            randomMeetingTime = meetingTimes[Math.floor(Math.random() * meetingTimes.length)];
            randomRoom = rooms[Math.floor(Math.random() * rooms.length)];
          }

          const newClass: ScheduleClass = {
            classId: `class_${classId++}`,
            sectionId: section.id,
            courseId: course.id,
            instructorId: randomInstructor.id,
            roomId: randomRoom.id,
            meetingTimeId: randomMeetingTime.id,
            course: {
              courseCode: course.courseCode,
              courseName: course.courseName,
              maxStudents: course.maxStudents,
              lectureHours: course.lectureHours,
              practicalHours: course.practicalHours,
              instructorIds: courseInstructors.map((i: any) => i.id)
            },
            instructor: {
              uid: randomInstructor.uid,
              name: randomInstructor.name,
              abbreviation: randomInstructor.abbreviation,
              maxHoursPerWeek: randomInstructor.maxHoursPerWeek
            },
            room: {
              roomNumber: randomRoom.roomNumber,
              seatingCapacity: randomRoom.seatingCapacity
            },
            meetingTime: {
              day: randomMeetingTime.day,
              startTime: randomMeetingTime.startTime,
              endTime: randomMeetingTime.endTime,
              slotType: randomMeetingTime.slotType
            }
          };

          this.classes.push(newClass);
        }
      }
    }

    return this;
  }

  private calculateFitness(): number {
    this.numberOfConflicts = 0;
    const classes = this.getClasses();
    const bookings = this.data.getExistingBookings();

    // ── HARD CONSTRAINT 1: Cross-section conflicts (existing timetables) ──
    for (const cls of classes) {
      const instrKey = `${cls.instructorId}::${cls.meetingTimeId}`;
      const roomKey = `${cls.roomId}::${cls.meetingTimeId}`;

      // Instructor already teaching another section at this time
      if (bookings.instructorSlots.has(instrKey)) {
        this.numberOfConflicts += 3; // heavy penalty — this is a hard clash
      }

      // Room already occupied by another section at this time
      if (bookings.roomSlots.has(roomKey)) {
        this.numberOfConflicts += 3; // heavy penalty
      }
    }

    // ── HARD CONSTRAINT 2: Intra-schedule conflicts ──
    for (let i = 0; i < classes.length; i++) {
      const class1 = classes[i];

      // Room capacity constraint
      if (class1.room && class1.course) {
        if (class1.room.seatingCapacity < class1.course.maxStudents) {
          this.numberOfConflicts++;
        }
      }

      // Check conflicts with other classes in THIS schedule
      for (let j = i + 1; j < classes.length; j++) {
        const class2 = classes[j];

        // Same time slot
        if (class1.meetingTimeId === class2.meetingTimeId) {
          // Instructor conflict
          if (class1.instructorId === class2.instructorId) {
            this.numberOfConflicts++;
          }

          // Room conflict
          if (class1.roomId === class2.roomId) {
            this.numberOfConflicts++;
          }

          // Section conflict (same section can't have two classes at same time)
          if (class1.sectionId === class2.sectionId) {
            this.numberOfConflicts++;
          }
        }
      }
    }

    // ── HARD CONSTRAINT 3: Instructor total workload (across ALL sections) ──
    const instructorHours = new Map<string, number>();
    classes.forEach(cls => {
      const current = instructorHours.get(cls.instructorId) || 0;
      instructorHours.set(cls.instructorId, current + 1);
    });

    instructorHours.forEach((newHours, instructorId) => {
      const existingHours = this.data.getExistingInstructorHours(instructorId);
      const totalHours = newHours + existingHours;
      const instructor = this.data.getInstructors().find(i => i.id === instructorId);
      if (instructor && totalHours > instructor.maxHoursPerWeek) {
        this.numberOfConflicts += (totalHours - instructor.maxHoursPerWeek);
      }
    });

    // Fitness is inversely proportional to conflicts
    return 1 / (1.0 * this.numberOfConflicts + 1);
  }

  toSchedule(): Schedule {
    return {
      classes: this.classes,
      fitness: this.getFitness(),
      conflicts: this.getNumberOfConflicts()
    };
  }
}

export class Population {
  private schedules: TimetableSchedule[] = [];
  private data: TimetableData;

  constructor(size: number, data: TimetableData) {
    this.data = data;
    this.schedules = [];
  }

  async initialize(size: number): Promise<Population> {
    for (let i = 0; i < size; i++) {
      const schedule = new TimetableSchedule(this.data);
      await schedule.initialize();
      this.schedules.push(schedule);
    }
    return this;
  }

  getSchedules(): TimetableSchedule[] {
    return this.schedules;
  }

  addSchedule(schedule: TimetableSchedule) {
    this.schedules.push(schedule);
  }
}

export class GeneticAlgorithm {
  private config: GeneticAlgorithmConfig;
  private data: TimetableData;

  constructor(config: GeneticAlgorithmConfig, data: TimetableData) {
    this.config = config;
    this.data = data;
  }

  evolve(population: Population): Population {
    return this.mutatePopulation(this.crossoverPopulation(population));
  }

  private crossoverPopulation(population: Population): Population {
    const crossoverPop = new Population(0, this.data);
    const schedules = population.getSchedules();

    // Sort by fitness
    schedules.sort((a, b) => b.getFitness() - a.getFitness());

    // Keep elite schedules
    for (let i = 0; i < this.config.eliteSize; i++) {
      crossoverPop.addSchedule(schedules[i]);
    }

    // Create new schedules through crossover
    for (let i = this.config.eliteSize; i < this.config.populationSize; i++) {
      const parent1 = this.selectTournament(population).getSchedules()[0];
      const parent2 = this.selectTournament(population).getSchedules()[0];
      crossoverPop.addSchedule(this.crossoverSchedule(parent1, parent2));
    }

    return crossoverPop;
  }

  private mutatePopulation(population: Population): Population {
    const schedules = population.getSchedules();
    
    for (let i = this.config.eliteSize; i < schedules.length; i++) {
      this.mutateSchedule(schedules[i]);
    }

    return population;
  }

  private crossoverSchedule(parent1: TimetableSchedule, parent2: TimetableSchedule): TimetableSchedule {
    const child = new TimetableSchedule(this.data);
    const classes1 = parent1.getClasses();
    const classes2 = parent2.getClasses();
    const childClasses: ScheduleClass[] = [];

    for (let i = 0; i < classes1.length; i++) {
      if (Math.random() > 0.5) {
        childClasses.push({ ...classes1[i] });
      } else if (i < classes2.length) {
        childClasses.push({ ...classes2[i] });
      } else {
        childClasses.push({ ...classes1[i] });
      }
    }

    // Manually set classes (accessing private property through getClasses)
    child.getClasses().length = 0;
    child.getClasses().push(...childClasses);

    return child;
  }

  private mutateSchedule(schedule: TimetableSchedule): TimetableSchedule {
    const classes = schedule.getClasses();
    const meetingTimes = this.data.getMeetingTimes();
    const rooms = this.data.getRooms();
    const instructors = this.data.getInstructors();
    const bookings = this.data.getExistingBookings();

    for (let i = 0; i < classes.length; i++) {
      if (Math.random() < this.config.mutationRate) {
        const cls = classes[i];
        
        // Randomly mutate one aspect of the class
        const mutationType = Math.floor(Math.random() * 3);
        
        switch (mutationType) {
          case 0: { // Change meeting time — prefer non-conflicting slot
            let best = meetingTimes[Math.floor(Math.random() * meetingTimes.length)];
            for (let t = 0; t < 5; t++) {
              const candidate = meetingTimes[Math.floor(Math.random() * meetingTimes.length)];
              const instrKey = `${cls.instructorId}::${candidate.id}`;
              const roomKey = `${cls.roomId}::${candidate.id}`;
              if (!bookings.instructorSlots.has(instrKey) && !bookings.roomSlots.has(roomKey)) {
                best = candidate;
                break;
              }
            }
            cls.meetingTimeId = best.id;
            cls.meetingTime = {
              day: best.day,
              startTime: best.startTime,
              endTime: best.endTime,
              slotType: best.slotType
            };
            break;
          }
            
          case 1: { // Change room — prefer non-conflicting room
            let best = rooms[Math.floor(Math.random() * rooms.length)];
            for (let t = 0; t < 5; t++) {
              const candidate = rooms[Math.floor(Math.random() * rooms.length)];
              const roomKey = `${candidate.id}::${cls.meetingTimeId}`;
              if (!bookings.roomSlots.has(roomKey)) {
                best = candidate;
                break;
              }
            }
            cls.roomId = best.id;
            cls.room = {
              roomNumber: best.roomNumber,
              seatingCapacity: best.seatingCapacity
            };
            break;
          }
            
          case 2: { // Change instructor (if multiple are available)
            if (cls.course && cls.course.instructorIds.length > 1) {
              const availableInstructors = instructors.filter((inst: any) =>
                cls.course!.instructorIds.includes(inst.id)
              );
              if (availableInstructors.length > 0) {
                // Prefer instructor who doesn't conflict at this time
                let best = availableInstructors[Math.floor(Math.random() * availableInstructors.length)];
                for (let t = 0; t < 5; t++) {
                  const candidate = availableInstructors[Math.floor(Math.random() * availableInstructors.length)];
                  const instrKey = `${candidate.id}::${cls.meetingTimeId}`;
                  if (!bookings.instructorSlots.has(instrKey)) {
                    best = candidate;
                    break;
                  }
                }
                cls.instructorId = best.id;
                cls.instructor = {
                  uid: best.uid,
                  name: best.name,
                  abbreviation: best.abbreviation,
                  maxHoursPerWeek: best.maxHoursPerWeek
                };
              }
            }
            break;
          }
        }
      }
    }

    return schedule;
  }

  private selectTournament(population: Population): Population {
    const tournament = new Population(0, this.data);
    const schedules = population.getSchedules();

    for (let i = 0; i < this.config.tournamentSize; i++) {
      const randomIndex = Math.floor(Math.random() * schedules.length);
      tournament.addSchedule(schedules[randomIndex]);
    }

    tournament.getSchedules().sort((a, b) => b.getFitness() - a.getFitness());
    
    return tournament;
  }

  getConflictReport(schedule: TimetableSchedule): ConflictReport[] {
    const conflicts: ConflictReport[] = [];
    const classes = schedule.getClasses();
    const bookings = this.data.getExistingBookings();

    // ── Cross-section conflicts (from already-saved timetables) ──
    classes.forEach(cls => {
      const instrKey = `${cls.instructorId}::${cls.meetingTimeId}`;
      const roomKey = `${cls.roomId}::${cls.meetingTimeId}`;

      if (bookings.instructorSlots.has(instrKey)) {
        const detail = bookings.instructorSlotDetails.get(instrKey) || '';
        conflicts.push({
          type: 'INSTRUCTOR_CONFLICT',
          severity: 'HIGH',
          message: `Cross-section: ${cls.instructor?.name} clashes — ${detail}`,
          affectedClasses: [cls.classId]
        });
      }

      if (bookings.roomSlots.has(roomKey)) {
        const detail = bookings.roomSlotDetails.get(roomKey) || '';
        conflicts.push({
          type: 'ROOM_CONFLICT',
          severity: 'HIGH',
          message: `Cross-section: ${detail}`,
          affectedClasses: [cls.classId]
        });
      }
    });

    // Check room capacity
    classes.forEach(cls => {
      if (cls.room && cls.course && cls.room.seatingCapacity < cls.course.maxStudents) {
        conflicts.push({
          type: 'CAPACITY_CONFLICT',
          severity: 'HIGH',
          message: `Room ${cls.room.roomNumber} (capacity: ${cls.room.seatingCapacity}) is too small for ${cls.course.courseName} (${cls.course.maxStudents} students)`,
          affectedClasses: [cls.classId]
        });
      }
    });

    // Check time conflicts
    for (let i = 0; i < classes.length; i++) {
      for (let j = i + 1; j < classes.length; j++) {
        const cls1 = classes[i];
        const cls2 = classes[j];

        if (cls1.meetingTimeId === cls2.meetingTimeId) {
          // Instructor conflict
          if (cls1.instructorId === cls2.instructorId) {
            conflicts.push({
              type: 'INSTRUCTOR_CONFLICT',
              severity: 'HIGH',
              message: `${cls1.instructor?.name} is assigned to two classes at the same time`,
              affectedClasses: [cls1.classId, cls2.classId]
            });
          }

          // Room conflict
          if (cls1.roomId === cls2.roomId && cls1.sectionId !== cls2.sectionId) {
            conflicts.push({
              type: 'ROOM_CONFLICT',
              severity: 'HIGH',
              message: `Room ${cls1.room?.roomNumber} is double-booked`,
              affectedClasses: [cls1.classId, cls2.classId]
            });
          }

          // Section conflict
          if (cls1.sectionId === cls2.sectionId) {
            conflicts.push({
              type: 'SECTION_CONFLICT',
              severity: 'HIGH',
              message: `Section has two classes scheduled at the same time`,
              affectedClasses: [cls1.classId, cls2.classId]
            });
          }
        }
      }
    }

    return conflicts;
  }
}

export async function generateTimetable(
  sectionId: string,
  academicYear: string,
  semester: string,
  config?: Partial<GeneticAlgorithmConfig>
): Promise<{
  schedule: Schedule;
  conflicts: ConflictReport[];
  stats: {
    generations: number;
    finalFitness: number;
    timeTaken: number;
  };
}> {
  const defaultConfig: GeneticAlgorithmConfig = {
    populationSize: 9,
    eliteSize: 1,
    tournamentSize: 3,
    mutationRate: 0.05,
    maxGenerations: 1000,
    targetFitness: 1.0,
    ...config
  };

  const startTime = Date.now();
  const data = new TimetableData();
  await data.initialize(sectionId, academicYear, semester);

  const ga = new GeneticAlgorithm(defaultConfig, data);
  let population = await new Population(defaultConfig.populationSize, data).initialize(defaultConfig.populationSize);

  let generation = 0;
  let bestSchedule = population.getSchedules()[0];

  while (generation < defaultConfig.maxGenerations && bestSchedule.getFitness() < defaultConfig.targetFitness) {
    generation++;
    population = ga.evolve(population);
    population.getSchedules().sort((a, b) => b.getFitness() - a.getFitness());
    bestSchedule = population.getSchedules()[0];

    if (generation % 50 === 0) {
      console.log(`Generation ${generation}: Fitness = ${bestSchedule.getFitness()}, Conflicts = ${bestSchedule.getNumberOfConflicts()}`);
    }
  }

  const endTime = Date.now();
  const conflicts = ga.getConflictReport(bestSchedule);

  return {
    schedule: bestSchedule.toSchedule(),
    conflicts,
    stats: {
      generations: generation,
      finalFitness: bestSchedule.getFitness(),
      timeTaken: endTime - startTime
    }
  };
}
