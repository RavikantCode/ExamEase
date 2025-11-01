"use client";
import React from "react";
import VTTimeTableForm from "./VTTimeTableForm";
import SemesterUpload from "./SemesterUpload";
import GenerateTimetableForm from "./GenerateTimeTableForm";

const TimetableDashboard: React.FC = () => {
  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 text-center">
        Academic Timetable Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VTTimeTableForm />
        <SemesterUpload />
      </div>

      <GenerateTimeTableForm
  startDate={entries[0]?.date || ""}
  morningTime={entries[0]?.morningShift || ""}
  eveningTime={entries[0]?.eveningShift || ""}
/>

    </div>
  );
};

export default TimetableDashboard;
