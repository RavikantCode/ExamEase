// 'use client';
// import React from "react";
// // import { useSeating } from "@/hooks/useSeating";
// import { useSeating } from "../hooks/useSeating";
// import StudentForm from "./StudentForm";
// // import RoomForm from "./RoomForm";
// import RoomForm from "../../timetable/rooms/RoomForm";
// // import SeatingTable from "../../timetable/SeatingTable";
// // import SeatingTable
// import SeatingTable from "./SeatingTable";
// // import OutputActions from "./OutputActions";
// import OutputActions from "./OutputActions";
// // import Alerts from "./Alerts";
// import Alerts from "./Alerts";
// // import InfoBox from "./InfoBox";
// import InfoBox from "./InfoBox";

// const SmartSeatingApp = () => {
//   const seating = useSeating();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-6">
//       <h1 className="text-4xl font-bold text-center mb-8">Smart Seating Arrangement</h1>

//       <InfoBox />
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <StudentForm students={seating.students} setStudents={seating.setStudents} />
//         <RoomForm rooms={seating.rooms} setRooms={seating.setRooms} />
//       </div>

//       <OutputActions generate={seating.generate} output={seating.output} loading={seating.loading} />
//       <Alerts error={seating.error} output={seating.output} />

//       {seating.output && <SeatingTable output={seating.output} />}
//     </div>
//   );
// };

// export default SmartSeatingApp;


'use client';
import React from "react";
import { useSeating } from "../hooks/useSeating";
import StudentForm from "./StudentForm";
import RoomForms from "./RoomForms"; // Updated import
import SeatingTable from "./SeatingTable";
import OutputActions from "./OutputActions";
import Alerts from "./Alerts";
import InfoBox from "./InfoBox";

const SmartSeatingApp = () => {
  const seating = useSeating();

  const exportOutput = () => {
    if (!seating.output) return;
    const blob = new Blob([JSON.stringify(seating.output, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `seating-arrangement-${Date.now()}.json`;
    a.click();
  };

  const printPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Smart Seating Arrangement</h1>

      <InfoBox />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StudentForm students={seating.students} setStudents={seating.setStudents} />
        <RoomForms rooms={seating.rooms} setRooms={seating.setRooms} /> {/* Updated usage */}
      </div>

      <OutputActions
        generate={seating.generate}
        exportOutput={exportOutput}
        printPDF={printPDF}
        output={seating.output}
        loading={seating.loading}
      />
      <Alerts error={seating.error} output={seating.output} />

      {seating.output && <SeatingTable output={seating.output} />}
    </div>
  );
};

export default SmartSeatingApp;