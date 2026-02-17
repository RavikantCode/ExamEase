# Quick Start Guide

## Prerequisites Checklist
- [ ] Node.js 18+ installed (`node --version`)
- [ ] PostgreSQL installed and running
- [ ] pnpm installed (`pnpm --version`) - If not: `npm install -g pnpm`
- [ ] Git (optional, for version control)

## Setup Steps

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Setup Database

#### Option A: Local PostgreSQL
1. Create a new database:
```sql
CREATE DATABASE timetable_db;
```

2. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

3. Update DATABASE_URL in `.env`:
```
DATABASE_URL="postgresql://username:password@localhost:5432/timetable_db?schema=public"
```

#### Option B: Cloud Database (e.g., Supabase, Neon)
1. Create a new PostgreSQL database on your chosen platform
2. Copy the connection string
3. Update DATABASE_URL in `.env`

### 3. Initialize Database Schema
```bash
# Generate Prisma Client
pnpm db:generate

# Push schema to database (creates tables)
pnpm db:push
```

### 4. Run Development Server
```bash
pnpm dev
```

Visit `http://localhost:3000`

## Initial Data Setup

### Step 1: Upload Rooms
1. Navigate to Admin page (`/admin`)
2. Click on "Rooms" tab
3. Upload `examples/rooms.csv`

### Step 2: Upload Instructors
1. Click on "Instructors" tab
2. Upload `examples/instructors.csv`

### Step 3: Upload Courses
1. Click on "Courses" tab
2. Upload `examples/courses.csv`

### Step 4: Upload Workload
1. Click on "Workload Distribution" tab
2. Select Academic Year (e.g., "2025-26")
3. Select Semester ("EVEN")
4. Upload `examples/workload.csv`

### Step 5: Create a Section

Using Prisma Studio (recommended for initial setup):
```bash
npm run db:studio
```

Or via API:
```bash
curl -X POST http://localhost:3000/api/sections \
  -H "Content-Type: application/json" \
  -d '{
    "sectionName": "BE-C-VIII",
    "departmentId": "<department_id>",
    "semester": 8,
    "division": "C",
    "numStudents": 60,
    "classesPerWeek": 30
  }'
```

### Step 6: Generate Timetable
1. Navigate to Generate page (`/generate`)
2. Select your section
3. Adjust parameters if needed
4. Click "Generate Timetable"

## Troubleshooting

### Database Connection Error
```
Error: Can't reach database server
```
**Solution**: Ensure PostgreSQL is running
```bash
# Check if PostgreSQL is running
sudo service postgresql status

# Start PostgreSQL
sudo service postgresql start
```

### Module Not Found Error
```
Error: Cannot find module '@prisma/client'
```
**Solution**: Generate Prisma Client
```bash
pnpm db:generate
```

### CSV Upload Fails
**Solution**: Check CSV format matches examples exactly
- Ensure column headers are correct
- No extra spaces or special characters
- UTF-8 encoding

### Generation Takes Too Long
**Solution**: Adjust parameters
- Reduce `maxGenerations` to 500
- Reduce `populationSize` to 5
- Lower `targetFitness` to 0.95

## Common Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build           # Build for production
pnpm start           # Start production server

# Database
pnpm db:push         # Push schema changes
pnpm db:studio       # Open Prisma Studio
pnpm db:generate     # Generate Prisma Client

# Utilities
pnpm lint            # Run linter
```

## Next Steps

1. **Customize Time Slots**: Edit `components/TimetableDisplay.tsx`
2. **Add More Constraints**: Modify `lib/algorithms/genetic-algorithm.ts`
3. **Export to PDF**: Add PDF generation functionality
4. **Add Authentication**: Implement NextAuth.js
5. **Deploy**: Deploy to Vercel, Railway, or your preferred platform

## Project Structure
```
timetable-system/
├── app/
│   ├── admin/          # Data management page
│   ├── generate/       # Timetable generation page
│   ├── api/            # API routes
│   └── page.tsx        # Home page
├── components/         # React components
├── lib/
│   ├── algorithms/     # Genetic algorithm
│   ├── types/          # TypeScript types
│   └── utils/          # Utility functions
├── prisma/
│   └── schema.prisma   # Database schema
└── examples/           # Sample CSV files
```

## Support Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Getting Help

If you encounter issues:
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure database is accessible
4. Check CSV file formats
5. Review the README.md for detailed information

---

Happy scheduling! 🎓
