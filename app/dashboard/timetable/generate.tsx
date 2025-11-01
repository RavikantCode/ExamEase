// "use client";
// import React, { useState } from "react";
// import Papa from "papaparse";

// interface SubjectData {
//   name: string;
// }

// const TimetableGenerator: React.FC = () => {
//   const [seSubjects, setSeSubjects] = useState<string[]>([]);
//   const [teSubjects, setTeSubjects] = useState<string[]>([]);
//   const [beSubjects, setBeSubjects] = useState<string[]>([]);
//   const [startDate, setStartDate] = useState<string>("");
//   const [morningTime, setMorningTime] = useState<string>("10:30 am - 11:30 am");
//   const [eveningTime, setEveningTime] = useState<string>("1:30 pm - 2:30 pm");

//   // CSV file handlers
//   const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: any) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     Papa.parse(file, {
//       header: false,
//       complete: (result:any) => {
//         const parsed = result.data.flat().filter((s: any) => s && typeof s === "string");
//         setter(parsed);
//       },
//     });
//   };

//   const handleGenerate = async () => {
//     const payload = {
//       startDate,
//       morningTime,
//       eveningTime,
//       seSubjects,
//       teSubjects,
//       beSubjects,
//     };

//     const res = await fetch("/api/generate-pdfs", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     const blob = await res.blob();
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "timetables.zip";
//     a.click();
//   };

//   return (
//     <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-10 space-y-6">
//       <h1 className="text-2xl font-bold">Exam Timetable Generator</h1>

//       <div className="grid grid-cols-1 gap-4">
//         <label className="font-medium">Start Date</label>
//         <input
//           type="date"
//           value={startDate}
//           onChange={(e) => setStartDate(e.target.value)}
//           className="border p-2 rounded"
//         />

//         <label className="font-medium">Morning Session Time</label>
//         <input
//           type="text"
//           value={morningTime}
//           onChange={(e) => setMorningTime(e.target.value)}
//           className="border p-2 rounded"
//         />

//         <label className="font-medium">Evening Session Time</label>
//         <input
//           type="text"
//           value={eveningTime}
//           onChange={(e) => setEveningTime(e.target.value)}
//           className="border p-2 rounded"
//         />
//       </div>

//       <div className="grid grid-cols-3 gap-4 mt-6">
//         <div>
//           <p className="font-semibold mb-2">Upload SE CSV</p>
//           <input type="file" accept=".csv" onChange={(e) => handleCSVUpload(e, setSeSubjects)} />
//         </div>
//         <div>
//           <p className="font-semibold mb-2">Upload TE CSV</p>
//           <input type="file" accept=".csv" onChange={(e) => handleCSVUpload(e, setTeSubjects)} />
//         </div>
//         <div>
//           <p className="font-semibold mb-2">Upload BE CSV</p>
//           <input type="file" accept=".csv" onChange={(e) => handleCSVUpload(e, setBeSubjects)} />
//         </div>
//       </div>

//       <button
//         onClick={handleGenerate}
//         className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
//       >
//         Generate Timetables (PDF)
//       </button>
//     </div>
//   );
// };

// export default TimetableGenerator;
