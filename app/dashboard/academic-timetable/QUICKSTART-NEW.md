# Quick Start Guide - UPDATED

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 2. Setup Environment
```bash
# Copy environment template
cp .env.example .env
```

Edit `.env` and add your database URL:
```
DATABASE_URL="postgresql://username:password@localhost:5432/timetable_db"
```

### 3. Initialize Database
```bash
# Generate Prisma Client
npm run db:generate

# Create database tables
npm run db:push

# Setup meeting times and create section
npm run db:setup
```

This will create:
- ✅ 50 time slots (5 days × 10 slots per day)
- ✅ IT Department  
- ✅ BE-C-VIII Section

### 4. Upload CSV Data

Start the development server:
```bash
npm run dev
```

Navigate to `http://localhost:3000/admin` and upload your CSV files **in this order**:

1. **rooms.csv** (from `csv-data/` folder)
2. **instructors.csv**
3. **courses.csv**  
4. **workload.csv** (make sure to set Academic Year and Semester first!)

### 5. Generate Timetable

Once all data is uploaded (you'll see the counts update), navigate to:
```
http://localhost:3000/generate
```

Select "BE-C-VIII" section and click "Generate Timetable"!

## Important Notes

### Data Persistence
✅ **Your uploaded data is now persistent!** Once uploaded to the database, it stays there even when you:
- Switch tabs
- Refresh the page
- Restart the server

The admin page shows live counts of uploaded records at the top.

### If Upload Fails
1. Check the console for errors
2. Verify your database connection
3. Make sure CSV format matches the examples
4. Try running `npm run db:push` again

### If Generation Fails
1. Verify all 4 CSV files are uploaded (check the counts)
2. Make sure section exists (created by `db:setup`)
3. Check that instructor names in workload.csv match instructors.csv exactly
4. Ensure course codes in workload.csv match courses.csv

## Quick Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:generate     # Generate Prisma Client
npm run db:push         # Create/update tables
npm run db:setup        # Initialize time slots + section
npm run db:studio       # Open database GUI

# Troubleshooting
npm run lint            # Check code
```

## Folder Structure

```
timetable-system/
├── csv-data/               ← Your CSV files are here!
│   ├── rooms.csv
│   ├── instructors.csv
│   ├── courses.csv
│   ├── workload.csv
│   └── README.md
├── app/
│   ├── admin/             ← Upload CSVs here
│   ├── generate/          ← Generate timetables here
│   └── api/
├── components/
├── lib/
├── prisma/
└── scripts/
```

## Troubleshooting

### "Cannot find section"
Run: `npm run db:setup` to create the BE-C-VIII section

### "No data uploaded"
Your uploads are stored in the database. Check counts on admin page.
If counts show 0, your uploads didn't save - check database connection.

### "ERR_INVALID_THIS" during install
See INSTALLATION_TROUBLESHOOTING.md or just use npm instead of pnpm.

### Database connection error
1. Make sure PostgreSQL is running
2. Verify DATABASE_URL in .env
3. Create the database if it doesn't exist:
   ```sql
   CREATE DATABASE timetable_db;
   ```

### Uploads disappear when switching tabs
This is FIXED now! Data persists in the database. The admin page fetches and displays current counts on load.

## Success Checklist

Before generating a timetable, verify:
- ✅ Database is running
- ✅ `npm run db:setup` completed successfully
- ✅ All 4 CSV files uploaded (check counts on admin page)
- ✅ Counts show: Rooms > 0, Instructors > 0, Courses > 0, Workload > 0
- ✅ Section "BE-C-VIII" exists

If all checked, you're ready to generate! 🎉

---

**Having issues?** Check:
- README.md (full documentation)
- INSTALLATION_TROUBLESHOOTING.md (install problems)
- csv-data/README.md (CSV format guide)
