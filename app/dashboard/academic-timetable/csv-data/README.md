# CSV Data Files - BE IT Division C (Academic Year 2025-26, Even Semester)

This folder contains the actual data extracted from your timetable and load distribution PDFs.

## Files Included

### 1. rooms.csv
Contains all classroom information with seating capacities.

**Columns:**
- `roomNumber`: Room identifier (e.g., 101, 206, B2-422, C1)
- `seatingCapacity`: Maximum number of students the room can accommodate

**Total Rooms:** 14

### 2. instructors.csv
Contains all faculty member information.

**Columns:**
- `uid`: Unique instructor ID (T001, T002, etc.)
- `name`: Full name of the instructor
- `abbreviation`: Short code used in timetable (GK, SRM, JJ, etc.)
- `maxHoursPerWeek`: Maximum teaching hours allowed per week

**Total Instructors:** 30

### 3. courses.csv
Contains all course/subject information.

**Columns:**
- `courseCode`: Unique course code (e.g., ITC801, ITL602)
- `courseName`: Full name of the course
- `maxStudents`: Maximum students who can enroll (typically 60)
- `lectureHours`: Theory/lecture hours per week
- `practicalHours`: Lab/practical hours per week

**Total Courses:** 32

**Course Types:**
- Theory courses: lectureHours > 0, practicalHours = 0
- Lab courses: lectureHours = 0, practicalHours > 0
- Combined courses: Both lectureHours and practicalHours > 0

### 4. workload.csv
Contains the workload distribution showing which instructor teaches which course.

**Columns:**
- `instructor_name`: Full name of the instructor (must match instructors.csv)
- `course_code`: Course code (must match courses.csv)
- `subject_name`: Subject/course name
- `theory_hours`: Theory hours this instructor teaches for this course
- `practical_hours`: Practical hours this instructor teaches for this course

**Total Records:** 74 (instructor-course assignments)

## Key Information

### Section Details
- **Section Name:** BE-C-VIII
- **Department:** Information Technology
- **Semester:** 8 (Final Year)
- **Division:** C
- **Academic Year:** 2025-26 (Even Semester)
- **Number of Students:** ~60

### Time Slots (Monday to Friday)
```
08:10 - 09:05  Regular Class
09:05 - 10:00  Regular Class
10:00 - 10:20  Short Break
10:20 - 11:15  Regular Class
11:15 - 12:10  Regular Class
12:10 - 12:50  Long Break
12:50 - 13:45  Regular Class
13:45 - 14:40  Regular Class
14:40 - 15:35  Regular Class
15:35 - 16:30  Regular Class
```

### Special Classes
- **Major Project:** Fridays (multiple slots in room 304C and 422)
- **Mentoring:** Thursday 15:35-16:30
- **Honors Classes:** 
  - Cyber Security Honors (Prof. Sneha Dalvi - SD)
  - AI-ML Honors (Prof. Hemanth Bansode - HB)

### Faculty Abbreviations Reference
```
KBD  - Dr. Kiran Deshpande
GG   - Prof. Ganesh Gourshete  
SJ   - Prof. Sonal Jain
SA   - Dr. Sonia Aneesh
ATM  - Prof. Apeksha Mohite
GK   - Prof. Geetanjali Kalme
VY   - Dr. Vaibhav Yavalkar
SB   - Prof. Sonal Balpande
CS   - Prof. Charul Singh
JJ   - Prof. Jayshree Jha
SYA  - Prof. Shital Agrawal
MG   - Prof. Mandar Ganjapurkar
MK   - Prof. Manjusha Kashilkar
SD   - Prof. Sneha Dalvi
SK   - Prof. Sachin Kasare
RRK  - Prof. Randeep Kahlon
UP   - Prof. Urjashree Patil
RS   - Prof. Roshna Sangale
VB   - Prof. Vishal Badgujar
SO   - Prof. Sujata Oak
SMJ  - Prof. Seema Jadhav
SL   - Prof. Saylee Lapalikar
SRM  - Prof. Snehal Mali
ANS  - Prof. Anupama Singh
PV   - Prof. Pranali Vhora
NJ   - Prof. Nisha Jamkar
HB   - Prof. Hemanth Bansode (AI-ML Honors)
RC   - Prof. Rujata Chaudhari
RK   - Prof. Rucha Kulkarni
SS   - Prof. Shafaque Syed
```

## How to Use

### Option 1: Upload via Admin Interface
1. Start your application: `npm run dev`
2. Navigate to http://localhost:3000/admin
3. Upload each CSV file in order:
   - rooms.csv
   - instructors.csv
   - courses.csv
   - workload.csv (with Academic Year: 2025-26, Semester: EVEN)

### Option 2: Direct Database Import (Advanced)
```bash
# Using Prisma Studio
npm run db:studio

# Or write a seed script to import all CSVs at once
```

## Data Validation

Before uploading, ensure:
- ✅ All instructor names in workload.csv match instructors.csv
- ✅ All course codes in workload.csv match courses.csv
- ✅ Theory + practical hours equal the total teaching load
- ✅ Room capacities accommodate section size (60 students)
- ✅ Instructor max hours aren't exceeded by their workload

## Notes

1. **Multiple Entries:** Some instructors teach the same course for different groups or batches, hence multiple entries in workload.csv

2. **Lab Hours:** Lab courses typically have higher practical hours (6, 8, 10, or 12 hours per week)

3. **Theory Hours:** Most theory courses have 3 hours per week

4. **Combined Courses:** Mini Project and Workshop courses have both theory and practical components

5. **Special Courses:**
   - Honors courses (Cyber Security, AI-ML) run parallel to regular classes
   - Major Project runs on Fridays
   - Electives have fewer hours

## Troubleshooting

**If upload fails:**
1. Check CSV format (no extra spaces, proper encoding)
2. Ensure column names match exactly
3. Verify no special characters in names
4. Check that instructor/course references exist

**If timetable generation has conflicts:**
1. Verify instructor workload doesn't exceed maxHoursPerWeek
2. Ensure enough rooms are available
3. Check that course hour requirements are realistic
4. Confirm all instructors teaching a course are listed in workload

---

**Data Source:** 
- Timetable: BE-C_IT_MASTER_EVEN_25-26.pdf
- Workload: Load_Distribution_Sheet_25-26__EVEN_SEM_IT.pdf
- Institution: A.P. Shah Institute of Technology, Department of Information Technology
