# 📚 CORRECT WORKFLOW - CSV Upload Order

## ✅ The Right Way (Automatic Relationship Creation)

### Step 1: Setup Database
```bash
npm install
npm run db:generate
npm run db:push
npm run db:setup
```

This creates:
- Database tables
- Time slots (50 slots for Mon-Fri)
- IT Department
- BE-C-VIII Section

### Step 2: Upload CSVs in THIS Order

Go to `http://localhost:3000/admin` and upload:

#### 1️⃣ First: rooms.csv
```csv
roomNumber,seatingCapacity
101,60
102,80
```

#### 2️⃣ Second: instructors.csv
```csv
uid,name,abbreviation,maxHoursPerWeek
T001,Prof. Geetanjali Kalme,GK,16
T002,Prof. Snehal Mali,SRM,16
```

#### 3️⃣ Third: courses.csv
```csv
courseCode,courseName,maxStudents,lectureHours,practicalHours
ITC801,Blockchain & DLT,60,3,0
ITL802,Cloud Computing Lab,60,0,12
```

#### 4️⃣ Fourth: workload.csv ⭐ **MOST IMPORTANT**
```csv
instructor_name,course_code,subject_name,theory_hours,practical_hours
Prof. Geetanjali Kalme,ITC801,Blockchain & DLT,3,0
Prof. Snehal Mali,ITC604,AIDS-I,3,0
```

**✨ Magic Happens Here:**
When you upload workload.csv, the system automatically:
- ✅ Links each course to its instructor(s)
- ✅ Links all courses to the IT department
- ✅ Creates all relationships needed for timetable generation

No extra steps needed! 🎉

### Step 3: Generate Timetable
Go to `http://localhost:3000/generate`
- Select "BE-C-VIII"
- Click "Generate Timetable"
- Done!

---

## ⚠️ Common Mistakes

### ❌ Wrong Order
```
Uploading workload.csv before courses.csv or instructors.csv
→ Will fail! The system needs courses and instructors to exist first.
```

### ❌ Mismatched Names
```
workload.csv has: "Prof. Geetanjali Kalme"
instructors.csv has: "Geetanjali Kalme"
→ Won't match! Names must be EXACTLY the same.
```

### ❌ Wrong Course Codes
```
workload.csv has: "ITC-801"
courses.csv has: "ITC801"
→ Won't match! Course codes must be EXACTLY the same.
```

---

## 🔍 How to Verify It Worked

### Check 1: Upload Counts
On the admin page, you should see:
- Rooms: 14
- Instructors: 30
- Courses: 32
- Workload: 74

### Check 2: Success Message
When uploading workload.csv, you should see:
```
✓ Success
Successfully processed 74 records and created course-instructor relationships
```

### Check 3: Generate Works
When you click "Generate Timetable", you should see:
- Generation progress
- Final schedule with classes filled in
- Not an empty timetable!

---

## 🐛 If You Already Uploaded in Wrong Order

### Option 1: Re-upload workload.csv
Just upload workload.csv again. It will create the missing relationships.

### Option 2: Run the link script
```bash
npm run db:link
```

### Option 3: Fresh Start
```bash
# Clear database and start over
npm run db:push -- --force-reset
npm run db:setup
# Then upload all CSVs again in correct order
```

---

## 💡 Key Points

1. **Order Matters**: Rooms → Instructors → Courses → Workload
2. **Workload is Magic**: It creates all the relationships automatically
3. **Names Must Match**: Instructor names and course codes must be EXACTLY the same
4. **One-Time Setup**: After uploading once, data persists in database

---

## 📝 Your CSV Files Location

Your CSV files are in:
```
timetable-system/csv-data/
├── rooms.csv           ← Upload 1st
├── instructors.csv     ← Upload 2nd
├── courses.csv         ← Upload 3rd
└── workload.csv        ← Upload 4th (creates relationships!)
```

---

## 🎯 TL;DR

1. Run `npm run db:setup`
2. Upload CSVs in order: rooms → instructors → courses → workload
3. Workload upload automatically creates all relationships
4. Generate timetable - it just works! ✨

No manual linking needed!
