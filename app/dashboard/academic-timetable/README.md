# Timetable Generation System

A comprehensive timetable generation system using Genetic Algorithm, built with Next.js, TypeScript, PostgreSQL (Prisma), and Tailwind CSS.

## Features

- **Genetic Algorithm-based scheduling** - Automatically generates optimal timetables
- **Constraint satisfaction** - Respects all hard constraints (no conflicts)
- **CSV Import** - Easy bulk upload of rooms, instructors, courses, and workload data
- **Workload management** - Tracks instructor teaching loads
- **Conflict detection** - Identifies and reports scheduling conflicts
- **Responsive UI** - Modern, clean interface with Tailwind CSS

## System Architecture

### Core Components

1. **Genetic Algorithm Engine** (`lib/algorithms/genetic-algorithm.ts`)
   - Population-based evolution
   - Tournament selection
   - Crossover and mutation operations
   - Fitness calculation based on constraints

2. **Database Schema** (Prisma)
   - Rooms, Instructors, Courses
   - Sections, MeetingTimes
   - Classes, Timetables, Workload

3. **API Routes**
   - `/api/timetable/generate` - Generate timetables
   - `/api/upload` - CSV data uploads
   - `/api/sections` - Section management

4. **Frontend Components**
   - `TimetableGenerator` - Main generation interface
   - `TimetableDisplay` - Visual timetable grid
   - `CSVUploader` - Data import interface

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- npm or yarn package manager

### Installation

1. **Clone and setup**
```bash
cd timetable-system
pnpm install
```

2. **Configure Database**

Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/timetable_db?schema=public"
```

3. **Initialize Database**
```bash
# Generate Prisma Client
pnpm db:generate

# Push schema to database
pnpm db:push
```

4. **Run Development Server**
```bash
pnpm dev
```

Access the application at `http://localhost:3000`

## Usage Workflow

### 1. Setup Base Data (Admin Page)

Navigate to `/admin` and upload CSV files:

#### Rooms CSV
```csv
roomNumber,seatingCapacity
101,60
102,80
206,70
```

#### Instructors CSV
```csv
uid,name,abbreviation,maxHoursPerWeek
T001,Prof. Geetanjali Kalme,GK,16
T002,Prof. Snehal Mali,SRM,16
T003,Prof. Ganesh Gourshete,GG,15
```

#### Courses CSV
```csv
courseCode,courseName,maxStudents,lectureHours,practicalHours
ITC801,Blockchain & DLT,60,3,0
ITL801,Blockchain Lab,60,0,6
ILO8011,Project Management,60,3,0
```

#### Workload CSV
```csv
instructor_name,course_code,subject_name,theory_hours,practical_hours
Prof. Geetanjali Kalme,ITC801,Blockchain & DLT,3,0
Prof. Geetanjali Kalme,ITL601,Business Intelligence Lab,0,8
Prof. Snehal Mali,ITDO8011,Big Data Analysis,3,0
```

### 2. Create Sections

Use the API or database to create sections:
```typescript
POST /api/sections
{
  "sectionName": "BE-C-VIII",
  "departmentId": "dept_id",
  "semester": 8,
  "division": "C",
  "numStudents": 60,
  "classesPerWeek": 30
}
```

### 3. Generate Timetable

Navigate to `/generate` and:
1. Select the section
2. Adjust genetic algorithm parameters if needed
3. Click "Generate Timetable"
4. Review conflicts and statistics
5. View the generated timetable

## Genetic Algorithm Parameters

- **Population Size** (default: 9): Number of candidate solutions
- **Elite Size** (default: 1): Best solutions preserved each generation
- **Tournament Size** (default: 3): Solutions competing in selection
- **Mutation Rate** (default: 0.05): Probability of random changes
- **Max Generations** (default: 1000): Maximum iterations
- **Target Fitness** (default: 1.0): Desired quality (1.0 = no conflicts)

## Constraints Enforced

### Hard Constraints (Must be satisfied)
- ✅ No instructor teaches multiple classes simultaneously
- ✅ No room double-booked at the same time
- ✅ No section has overlapping classes
- ✅ Room capacity accommodates student count
- ✅ Instructor workload within limits

### Soft Constraints (Optimized)
- Minimize gaps in schedules
- Distribute courses across days
- Balance instructor workload

## Database Schema Highlights

### Key Models

**Room**
- roomNumber, seatingCapacity

**Instructor**
- uid, name, abbreviation, maxHoursPerWeek

**Course**
- courseCode, courseName, maxStudents
- lectureHours, practicalHours

**MeetingTime**
- day (MONDAY-FRIDAY), startTime, endTime, slotType

**Class**
- Links section, course, instructor, room, meetingTime
- Represents a single scheduled class

**Timetable**
- Container for a complete schedule
- Tracks fitness score and conflicts
- Can be activated/deactivated

**Workload**
- Instructor course assignments
- Theory and practical hour tracking

## API Documentation

### Generate Timetable
```typescript
POST /api/timetable/generate
Body: {
  sectionId: string,
  academicYear: string,
  semester: string,
  config?: {
    populationSize?: number,
    eliteSize?: number,
    tournamentSize?: number,
    mutationRate?: number,
    maxGenerations?: number,
    targetFitness?: number
  }
}
```

### Upload CSV
```typescript
POST /api/upload
FormData: {
  file: File,
  type: 'rooms' | 'instructors' | 'courses' | 'workload',
  academicYear?: string,  // Required for workload
  semester?: string       // Required for workload
}
```

### Get Timetable
```typescript
GET /api/timetable/generate?id={timetableId}
GET /api/timetable/generate?sectionId={sectionId}
```

## Customization

### Adding Custom Constraints

Edit `lib/algorithms/genetic-algorithm.ts`:

```typescript
private calculateFitness(): number {
  this.numberOfConflicts = 0;
  
  // Add your custom constraint checks here
  // Example: Prefer morning slots for certain courses
  
  return 1 / (1.0 * this.numberOfConflicts + 1);
}
```

### Modifying Time Slots

Edit `components/TimetableDisplay.tsx`:

```typescript
const TIME_SLOTS = [
  { start: '08:10', end: '09:05', label: '8:10 - 9:05' },
  // Add/modify time slots as needed
];
```

### Adjusting Days

Change the `DAYS` array in `TimetableDisplay.tsx` to include/exclude days.

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists

### CSV Upload Failures
- Check CSV format matches examples
- Ensure column headers are correct
- Verify data types (numbers vs strings)

### Generation Takes Too Long
- Reduce maxGenerations
- Decrease populationSize
- Lower targetFitness requirement

### High Conflict Count
- Verify sufficient rooms available
- Check instructor availability
- Ensure realistic workload distribution

## Performance Optimization

For large datasets:
- Increase populationSize for better solutions
- Adjust mutationRate based on convergence
- Use eliteSize to preserve good solutions
- Monitor generation statistics

## Future Enhancements

- [ ] Multi-section optimization
- [ ] Instructor preference system
- [ ] PDF export functionality
- [ ] Email notifications
- [ ] Schedule comparison tool
- [ ] Historical analytics
- [ ] Mobile app version

## Technologies Used

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Algorithm**: Custom Genetic Algorithm implementation
- **File Processing**: csv-parse library

## License

This project is for educational purposes.

## Support

For issues or questions, please refer to the documentation or create an issue in the repository.

---

Built with ❤️ using Next.js and TypeScript
