# 🎓 ExamEase –  AI-Powered Platform for Streamlined Exam Management and Transparent Academic Remuneration


[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?logo=next.js)](https://nextjs.org/)  
[![Node.js](https://img.shields.io/badge/Node.js-16+-green?logo=node.js)](https://nodejs.org/)  

**ExamEase** is a **Next.js project** bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) for **managing college exam scheduling, seating arrangements, and faculty remuneration**.  
It automates complex administrative tasks, making exam management efficient and error-free.

---

## 🛠 System Overview

ExamEase handles:

- **🗓 Exam Timetable Generation** – Dynamically generates timetables based on courses, departments, faculty availability, and exam duration.  
- **🪑 Seating Arrangement** – Assigns students to rooms while ensuring no conflicts (e.g., same-subject students not seated together).  
- **💰 Remuneration Management** – Calculates faculty payment based on invigilation hours and assigned exams.

---

## ✨ Features

### 📌 Dynamic Exam Timetable
- Configurable **maximum exams per day**  
- **Exam time gaps**  
- **Working hours & holidays**  

### 📌 Intelligent Seating Arrangement
- Split large batches into **multiple rooms**  
- Assign **multiple invigilators** based on student count  

### 📌 Faculty Management
- Track **invigilation hours per day**  
- Auto-calculate **remuneration**  

### 📌 Data Management
- CSV upload for **courses, faculty, and room data**  
- **Interactive admin dashboard** (Next.js frontend)

---

## 💻 Tech Stack

- **Frontend:** Next.js, TypeScript, React  
- **Backend:** Node.js, Express  
- **Database:** SupaBase ,Prisma ORM 
- **State Management:** Redux  
- **Styling:** Tailwind CSS  
- **Deployment:** Docker ,AWS 

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/ExamEase.git
cd ExamEase
```
### 2.Install the Dependencies
```bash
pnpm install
```
### 3.Generate Auto-generated clients
```bash
pnpx prisma generate
```
### 4.Run the Server
```bash
pnpm run dev
```
## 🗂 Project Structure

- Pages & Components: app/ src
- API Endpoints: app/src/api
- Database Models: prisma/schema.prisma

## 🎯 Future Enhancements

- Role-based authentication for admin/faculty
- PDF export of timetables and seating charts
- Email notifications for students and faculty
- Analytics dashboard for exam & invigilation data
- Integration with college ERP systems
