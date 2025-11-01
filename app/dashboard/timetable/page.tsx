// "use client";

// import React, { useState } from "react";
// import { Course, Teacher, Room, Config, GeneratedTimetable } from "./utils/types";
// import { generateTimetable } from "./utils/timetableUtils";

// import ConfigPanel from "./config/ConfigPanel";
// import ExamDatesPanel from "./dates/ExamDatesPanel";
// import CourseForm from "./courses/CourseForm";
// import CourseList from "./courses/CourseList";
// import TeacherForm from "./teachers/TeacherForm";
// import TeacherList from "./teachers/TeacherList";
// import RoomForm from "./rooms/RoomForm";
// import RoomList from "./rooms/RoomList";
// import TimetableView from "./timetable/TableView";
// import UnscheduledCourses from "./timetable/UnScheduledCourses";

// const CustomTimetableGenerator: React.FC = () => {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [teachers, setTeachers] = useState<Teacher[]>([]);
//   const [rooms, setRooms] = useState<Room[]>([]);
// const [newRoom, setNewRoom] = useState<{ name: string; capacity: number }>({
//     name: "",
//     capacity: 0,
//   });
//   const [examDates, setExamDates] = useState<string[]>([]);

  
//   const [config, setConfig] = useState<Config>({
//     startTime: "09:00",
//     examDurationHours: 2,
//     breakTimeMinutes: 30,
//     shiftsPerDay: 2,
//   });

//   const addRoom = () => {
//     if (newRoom.name && newRoom.capacity > 0) {                     //this one added recently at friday 3:00 pm
//       setRooms((prev) => [
//         ...prev,
//         { ...newRoom, id: Date.now().toString() },
//       ]);
//       setNewRoom({ name: "", capacity: 0 });
//     }
//   };

//   const [timetable, setTimetable] = useState<GeneratedTimetable | null>(null);

//   const handleGenerate = () => {
//     const result = generateTimetable(courses, teachers, rooms, examDates, config);
//     setTimetable(result);
//   };

//   return (
//     <div className="space-y-6 p-4">
//       <ConfigPanel config={config} setConfig={setConfig} />

//       <ExamDatesPanel examDates={examDates} setExamDates={setExamDates} />

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <CourseForm setCourses={setCourses} />
//         <CourseList courses={courses} setCourses={setCourses} />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <TeacherForm setTeachers={setTeachers} />
//         <TeacherList teachers={teachers} setTeachers={setTeachers} />
//       </div>

// <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       <RoomForm newRoom={newRoom} setNewRoom={setNewRoom} addRoom={addRoom} />
//       <RoomList rooms={rooms} removeRoom={(id) => setRooms((prev) => prev.filter((room) => room.id !== id))} />
//     </div>

//       <div className="text-center">
//         <button
//           onClick={handleGenerate}
//           className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
//         >
//           Generate Timetable
//         </button>
//       </div>

//       {timetable && (
//         <div className="space-y-6">
//           <TimetableView timetable={timetable} />
//           <UnscheduledCourses unscheduled={timetable.unscheduled} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomTimetableGenerator;

import TimetableDashboard from "./TimetableDashboard";

export default function Page() {
  return <TimetableDashboard />;
}
