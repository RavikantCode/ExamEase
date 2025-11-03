

// 'use client'
// import React, { useState } from 'react';
// import { Download, Upload, Play, AlertCircle, CheckCircle, Settings } from 'lucide-react';

// import SmartSeatingApp from "./components/SmartSeatingApp"

// interface BranchGroup {
//   branch: string;
//   students: number[];
// }

// interface Block {
//   no: number;
//   block: string;
//   branches: string[];
//   total: number;
// }

// interface SeatingData {
//   date: string;
//   time: string[];
//   seatingPlan: Block[];
// }

// interface Room {
//   roomNumber: string;
//   capacity: number;
// }

// interface StudentData {
//   branch: string;
//   totalStudents: number;
// }

// const SmartSeatingApp = () => {
//   const [inputMode, setInputMode] = useState<'json' | 'manual'>('manual');
//   const [jsonInput, setJsonInput] = useState('');
//   const [date, setDate] = useState('18/08/2025');
//   const [timeSlots, setTimeSlots] = useState(['10:30 to 11:30 AM', '1:30 to 2:30 PM']);
//   const [students, setStudents] = useState<StudentData[]>([
//     { branch: 'SE COMP A', totalStudents: 75 },
//     { branch: 'SE COMP B', totalStudents: 200 },
//     { branch: 'SE COMP C', totalStudents: 150 },
//     { branch: 'BE IT C', totalStudents: 79 },
//     { branch: 'SE CIVIL A', totalStudents: 34 },
//     { branch: 'TE CIVIL A', totalStudents: 65 },
//   ]);
//   const [rooms, setRooms] = useState<Room[]>([
//     { roomNumber: '004', capacity: 40 },
//     { roomNumber: '005', capacity: 40 },
//     { roomNumber: '101', capacity: 40 },
//     { roomNumber: '102', capacity: 40 },
//     { roomNumber: '103', capacity: 40 },
//     { roomNumber: '104', capacity: 40 },
//     { roomNumber: '201', capacity: 40 },
//     { roomNumber: '202', capacity: 40 },
//     { roomNumber: '203', capacity: 40 },
//     { roomNumber: '204', capacity: 40 },
//     { roomNumber: '205', capacity: 40 },
//     { roomNumber: '206', capacity: 40 },
//     { roomNumber: '207', capacity: 40 },
//     { roomNumber: '209', capacity: 40 },
//     { roomNumber: '210', capacity: 40 },
//     { roomNumber: '211', capacity: 40 },
//     { roomNumber: '212', capacity: 40 },
//     { roomNumber: '213', capacity: 40 },
//   ]);
//   const [output, setOutput] = useState<SeatingData | null>(null);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Parse branch string like "SE COMP A (1-40=40)"
//   const parseBranch = (branchStr: string): BranchGroup | null => {
//     const match = branchStr.match(/^(.+?)\s*\((\d+)-(\d+)=(\d+)\)$/);
//     if (!match) return null;
    
//     const branch = match[1].trim();
//     const start = parseInt(match[2]);
//     const end = parseInt(match[3]);
//     const students = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    
//     return { branch, students };
//   };

//   // Format branch for output
//   const formatBranch = (branch: string, students: number[]): string => {
//     if (students.length === 0) return '';
//     const start = Math.min(...students);
//     const end = Math.max(...students);
//     return `${branch} (${start}-${end}=${students.length})`;
//   };

//   // Smart seating algorithm - fills rooms with alternating subjects
//   const generateSeatingArrangement = () => {
//     setLoading(true);
//     setError('');
    
//     try {
//       let branchQueues: BranchGroup[];

//       if (inputMode === 'json') {
//         const data = JSON.parse(jsonInput);
//         const branchMap: { [key: string]: number[] } = {};
        
//         data.seatingPlan.forEach((block: Block) => {
//           block.branches.forEach((branchStr: string) => {
//             const parsed = parseBranch(branchStr);
//             if (parsed) {
//               if (!branchMap[parsed.branch]) {
//                 branchMap[parsed.branch] = [];
//               }
//               branchMap[parsed.branch].push(...parsed.students);
//             }
//           });
//         });

//         branchQueues = Object.entries(branchMap).map(([branch, students]) => ({
//           branch,
//           students: [...students],
//         }));
//       } else {
//         // Manual mode - create students with roll numbers
//         branchQueues = students
//           .filter(s => s.totalStudents > 0)
//           .map(s => ({
//             branch: s.branch,
//             students: Array.from({ length: s.totalStudents }, (_, i) => i + 1),
//           }));
//       }

//       const result: Block[] = [];
//       let blockNo = 1;
//       let roomIndex = 0;

//       while (branchQueues.some(b => b.students.length > 0)) {
//         const room = rooms[roomIndex];
//         if (!room) {
//           setError('Not enough rooms to accommodate all students!');
//           setLoading(false);
//           return;
//         }

//         const roomCapacity = room.capacity;
//         const blockBranches: { [key: string]: number[] } = {};
//         let seatsAllocated = 0;

//         // Find branches with students remaining
//         const availableBranches = branchQueues.filter(b => b.students.length > 0);

//         if (availableBranches.length === 0) break;

//         if (availableBranches.length === 1) {
//           // Only one branch left - fill the room with it
//           const branch = availableBranches[0];
//           const studentsToTake = Math.min(roomCapacity, branch.students.length);
//           blockBranches[branch.branch] = branch.students.splice(0, studentsToTake);
//           seatsAllocated = studentsToTake;
//         } else {
//           // Multiple branches - alternate them
//           // Strategy: pair different branches on benches
//           // Each bench has 2 students from different branches

//           // Take pairs from different branches
//           let branchIndex = 0;
//           while (seatsAllocated < roomCapacity && availableBranches.some(b => b.students.length > 0)) {
//             const currentBranches = availableBranches.filter(b => b.students.length > 0);
            
//             if (currentBranches.length === 0) break;

//             // Take students from current branch
//             if (branchIndex >= currentBranches.length) {
//               branchIndex = 0;
//             }

//             const branch = currentBranches[branchIndex];
//             if (branch.students.length > 0) {
//               const student = branch.students.shift()!;
//               if (!blockBranches[branch.branch]) {
//                 blockBranches[branch.branch] = [];
//               }
//               blockBranches[branch.branch].push(student);
//               seatsAllocated++;
//             }

//             branchIndex++;

//             // If we have only one branch left with students, fill remaining seats
//             const remainingBranches = availableBranches.filter(b => b.students.length > 0);
//             if (remainingBranches.length === 1 && seatsAllocated < roomCapacity) {
//               const lastBranch = remainingBranches[0];
//               const remainingSeats = roomCapacity - seatsAllocated;
//               const studentsToTake = Math.min(remainingSeats, lastBranch.students.length);
              
//               if (!blockBranches[lastBranch.branch]) {
//                 blockBranches[lastBranch.branch] = [];
//               }
//               blockBranches[lastBranch.branch].push(...lastBranch.students.splice(0, studentsToTake));
//               seatsAllocated += studentsToTake;
//               break;
//             }
//           }
//         }

//         // Format the block
//         const branches = Object.entries(blockBranches)
//           .filter(([_, students]) => students.length > 0)
//           .map(([branch, students]) => formatBranch(branch, students));

//         const total = Object.values(blockBranches).reduce((sum, students) => sum + students.length, 0);

//         result.push({
//           no: blockNo++,
//           block: room.roomNumber,
//           branches,
//           total,
//         });

//         roomIndex++;
//       }

//       const outputData: SeatingData = {
//         date: inputMode === 'json' ? JSON.parse(jsonInput).date : date,
//         time: inputMode === 'json' ? JSON.parse(jsonInput).time : timeSlots,
//         seatingPlan: result,
//       };

//       setOutput(outputData);
//     } catch (err) {
//       setError('Invalid input. Please check your data.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Load sample data
//   const loadSampleData = () => {
//     const sampleData = {
//       date: "18/08/2025",
//       time: ["10:30 to 11:30 AM", "1:30 to 2:30 PM"],
//       seatingPlan: [
//         {
//           no: 1,
//           block: "004",
//           branches: ["SE COMP A (1-40=40)", "BE IT C (41-79=39)"],
//           total: 79
//         },
//         {
//           no: 2,
//           block: "005",
//           branches: ["SE COMP A (41-75=35)", "SE CIVIL A (1-34=34)", "TE CIVIL A (1-6=6)"],
//           total: 75
//         }
//       ]
//     };
//     setJsonInput(JSON.stringify(sampleData, null, 2));
//   };

//   const exportOutput = () => {
//     if (!output) return;
//     const blob = new Blob([JSON.stringify(output, null, 2)], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `seating-arrangement-${Date.now()}.json`;
//     a.click();
//   };

//   const printPDF = () => {
//     window.print();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-6">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-4xl font-bold text-center mb-8 print:text-3xl">
//           Smart Seating Arrangement System
//         </h1>

//         {/* Input Mode Toggle */}
//         <div className="flex justify-center gap-4 mb-6 print:hidden">
//           <button
//             onClick={() => setInputMode('manual')}
//             className={`px-6 py-2 rounded-lg font-semibold ${
//               inputMode === 'manual' ? 'bg-purple-600' : 'bg-gray-700'
//             }`}
//           >
//             Manual Input
//           </button>
//           <button
//             onClick={() => setInputMode('json')}
//             className={`px-6 py-2 rounded-lg font-semibold ${
//               inputMode === 'json' ? 'bg-purple-600' : 'bg-gray-700'
//             }`}
//           >
//             JSON Input
//           </button>
//         </div>

//         {/* Manual Input Mode */}
//         {inputMode === 'manual' && (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 print:hidden">
//             {/* Student Data */}
//             <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
//               <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
//                 <Settings size={24} />
//                 Student Data
//               </h2>
//               <div className="space-y-2 mb-4">
//                 <input
//                   type="text"
//                   value={date}
//                   onChange={(e) => setDate(e.target.value)}
//                   className="w-full bg-gray-700 text-white px-3 py-2 rounded"
//                   placeholder="Date (DD/MM/YYYY)"
//                 />
//               </div>
//               <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
//                 {students.map((student, idx) => (
//                   <div key={idx} className="flex gap-2 items-center bg-gray-700 p-2 rounded">
//                     <input
//                       type="text"
//                       value={student.branch}
//                       onChange={(e) => {
//                         const newStudents = [...students];
//                         newStudents[idx].branch = e.target.value;
//                         setStudents(newStudents);
//                       }}
//                       className="flex-1 bg-gray-600 text-white px-3 py-1 rounded"
//                       placeholder="Branch Name"
//                     />
//                     <input
//                       type="number"
//                       value={student.totalStudents}
//                       onChange={(e) => {
//                         const newStudents = [...students];
//                         newStudents[idx].totalStudents = parseInt(e.target.value) || 0;
//                         setStudents(newStudents);
//                       }}
//                       className="w-24 bg-gray-600 text-white px-3 py-1 rounded"
//                       placeholder="Count"
//                     />
//                     <button
//                       onClick={() => setStudents(students.filter((_, i) => i !== idx))}
//                       className="text-red-400 hover:text-red-300 px-2"
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 ))}
//               </div>
//               <button
//                 onClick={() => setStudents([...students, { branch: '', totalStudents: 0 }])}
//                 className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
//               >
//                 Add Branch
//               </button>
//             </div>

//             {/* Room Configuration */}
//             <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
//               <h2 className="text-xl font-bold mb-4">Room Configuration</h2>
//               <div className="space-y-2 h-80 overflow-y-auto">
//                 {rooms.map((room, idx) => (
//                   <div key={idx} className="flex gap-2 items-center bg-gray-700 p-2 rounded">
//                     <input
//                       type="text"
//                       value={room.roomNumber}
//                       onChange={(e) => {
//                         const newRooms = [...rooms];
//                         newRooms[idx].roomNumber = e.target.value;
//                         setRooms(newRooms);
//                       }}
//                       className="flex-1 bg-gray-600 text-white px-3 py-1 rounded"
//                       placeholder="Room Number"
//                     />
//                     <input
//                       type="number"
//                       value={room.capacity}
//                       onChange={(e) => {
//                         const newRooms = [...rooms];
//                         newRooms[idx].capacity = parseInt(e.target.value) || 0;
//                         setRooms(newRooms);
//                       }}
//                       className="w-20 bg-gray-600 text-white px-3 py-1 rounded"
//                       placeholder="Cap"
//                     />
//                     <span className="text-xs text-gray-400 w-12">seats</span>
//                     <button
//                       onClick={() => setRooms(rooms.filter((_, i) => i !== idx))}
//                       className="text-red-400 hover:text-red-300 px-2"
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 ))}
//               </div>
//               <button
//                 onClick={() => setRooms([...rooms, { roomNumber: '', capacity: 40 }])}
//                 className="mt-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
//               >
//                 Add Room
//               </button>
//             </div>
//           </div>
//         )}

//         {/* JSON Input Mode */}
//         {inputMode === 'json' && (
//           <div className="mb-6 print:hidden">
//             <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
//               <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
//                 <Upload size={24} />
//                 Student Data (JSON)
//               </h2>
//               <textarea
//                 value={jsonInput}
//                 onChange={(e) => setJsonInput(e.target.value)}
//                 className="w-full h-64 bg-gray-700 text-white p-4 rounded font-mono text-sm"
//                 placeholder="Paste your JSON data here..."
//               />
//               <button
//                 onClick={loadSampleData}
//                 className="mt-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
//               >
//                 Load Sample Data
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Action Buttons */}
//         <div className="flex justify-center gap-4 mb-6 print:hidden">
//           <button
//             onClick={generateSeatingArrangement}
//             disabled={loading}
//             className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-lg font-semibold disabled:opacity-50"
//           >
//             <Play size={24} />
//             {loading ? 'Processing...' : 'Generate Seating Plan'}
//           </button>
//           {output && (
//             <>
//               <button
//                 onClick={exportOutput}
//                 className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg"
//               >
//                 <Download size={24} />
//                 Export JSON
//               </button>
//               <button
//                 onClick={printPDF}
//                 className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg"
//               >
//                 <Download size={24} />
//                 Print PDF
//               </button>
//             </>
//           )}
//         </div>

//         {/* Error/Success Messages */}
//         {error && (
//           <div className="bg-red-900 bg-opacity-50 border border-red-500 rounded-lg p-4 mb-6 flex items-center gap-2 print:hidden">
//             <AlertCircle size={24} />
//             <span>{error}</span>
//           </div>
//         )}

//         {output && !error && (
//           <div className="bg-green-900 bg-opacity-50 border border-green-500 rounded-lg p-4 mb-6 flex items-center gap-2 print:hidden">
//             <CheckCircle size={24} />
//             <span>Seating arrangement generated! Students are distributed with different subjects alternating on benches.</span>
//           </div>
//         )}

//         {/* Output Display */}
//         {output && (
//           <div className="bg-gray-800 rounded-lg p-6 shadow-xl print:bg-white print:text-black">
//             <div className="text-center mb-6">
//               <h2 className="text-2xl font-bold mb-2">
//                 SEATING PLAN FOR UNIVERSITY TEST-I, AUGUST 2025
//               </h2>
//               <p className="text-lg font-semibold">{output.date}</p>
//               <p className="text-gray-400 print:text-gray-700">
//                 TIME: {output.time.join(' & ')}
//               </p>
//             </div>

//             <table className="w-full border-collapse border border-gray-600 print:border-black">
//               <thead>
//                 <tr className="bg-gray-700 print:bg-gray-200">
//                   <th className="border border-gray-600 print:border-black p-3 text-left">No.</th>
//                   <th className="border border-gray-600 print:border-black p-3 text-left">BLOCK</th>
//                   <th className="border border-gray-600 print:border-black p-3 text-left">BRANCH</th>
//                   <th className="border border-gray-600 print:border-black p-3 text-left">TOTAL</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {output.seatingPlan.map((block) => (
//                   <tr key={block.no} className="hover:bg-gray-700 hover:bg-opacity-30 print:hover:bg-transparent">
//                     <td className="border border-gray-600 print:border-black p-3">{block.no}</td>
//                     <td className="border border-gray-600 print:border-black p-3 font-bold">{block.block}</td>
//                     <td className="border border-gray-600 print:border-black p-3">
//                       {block.branches.map((branch, idx) => (
//                         <div key={idx} className="text-sm">
//                           {branch}
//                         </div>
//                       ))}
//                     </td>
//                     <td className="border border-gray-600 print:border-black p-3 font-bold text-center">{block.total}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {/* JSON Output */}
//             <div className="mt-6 print:hidden">
//               <h3 className="text-lg font-bold mb-2">JSON Output:</h3>
//               <pre className="bg-gray-900 p-4 rounded text-xs overflow-x-auto">
//                 {JSON.stringify(output, null, 2)}
//               </pre>
//             </div>
//           </div>
//         )}

//         {/* Algorithm Explanation */}
//         <div className="mt-8 bg-gray-800 rounded-lg p-6 print:hidden">
//           <h3 className="text-xl font-bold mb-4">How the Algorithm Works:</h3>
//           <ul className="space-y-2 text-gray-300">
//             <li>✓ <strong>Sequential Room Filling:</strong> Fills one room completely before moving to the next</li>
//             <li>✓ <strong>Branch Alternation:</strong> When multiple branches available, students alternate (SE COMP, BE IT, SE COMP, BE IT...)</li>
//             <li>✓ <strong>Single Branch Completion:</strong> If only one branch remains, it fills the rest of the room</li>
//             <li>✓ <strong>Example:</strong> 69 SE COMP students → First room gets 40 SE COMP, Second room gets 29 SE COMP + 11 from another branch</li>
//             <li>✓ <strong>Bench Pairing:</strong> Different subjects sit together on benches (2 students per bench)</li>
//           </ul>
//         </div>
//       </div>

//       <style>{`
//         @media print {
//           body { background: white !important; }
//           .print\\:hidden { display: none !important; }
//           .print\\:text-black { color: black !important; }
//           .print\\:bg-white { background-color: white !important; }
//           .print\\:border-black { border-color: black !important; }
//           table { page-break-inside: auto; }
//           tr { page-break-inside: avoid; page-break-after: auto; }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default SmartSeatingApp;

///////////////////////////////======================CORECT======================////////////////////////////////////

'use client'
import React, { useState } from 'react';
import { Download, Upload, Play, AlertCircle, CheckCircle, Settings, Info, Building, ClockArrowUp, FileText } from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType } from "docx";

interface BranchGroup {
  branch: string;
  students: number[];
  examGroup: string;
}

interface Block {
  no: number;
  block: string;
  branches: string[];
  total: number;
}

interface SeatingData {
  date: string;
  time: string[];
  seatingPlan: Block[];
}

interface Room {
  roomNumber: string;
  benches: number;
}

interface StudentData {
  branch: string;
  totalStudents: number;
  examGroup: string;
}

const SmartSeatingApp = () => {
  const [date, setDate] = useState('18/08/2025');
  const [timeSlots, setTimeSlots] = useState(['10:30 to 11:30 AM', '1:30 to 2:30 PM']);
  const [students, setStudents] = useState<StudentData[]>([
    // { branch: 'SE COMP A', totalStudents: 75, examGroup: 'SE_COMP' },
    // { branch: 'BE IT C', totalStudents: 79, examGroup: 'BE_IT' },
    // { branch: 'SE COMP B', totalStudents: 200, examGroup: 'SE_COMP' },
    // { branch: 'SE COMP C', totalStudents: 150, examGroup: 'SE_COMP' },
    // { branch: 'SE CIVIL A', totalStudents: 34, examGroup: 'SE_CIVIL' },
    // { branch: 'TE CIVIL A', totalStudents: 65, examGroup: 'TE_CIVIL' },
    // { branch: 'BE CIVIL A', totalStudents: 60, examGroup: 'BE_CIVIL' },
  ]);
  const [rooms, setRooms] = useState<Room[]>([
    // { roomNumber: '004', benches: 40 },
    // { roomNumber: '005', benches: 40 },
    // { roomNumber: '101', benches: 40 },
    // { roomNumber: '102', benches: 40 },
    // { roomNumber: '103', benches: 40 },
    // { roomNumber: '104', benches: 40 },
    // { roomNumber: '201', benches: 40 },
    // { roomNumber: '202', benches: 40 },
    // { roomNumber: '203', benches: 40 },
    // { roomNumber: '204', benches: 40 },
    // { roomNumber: '205', benches: 40 },
    // { roomNumber: '206', benches: 40 },
    // { roomNumber: '207', benches: 40 },
    // { roomNumber: '209', benches: 40 },
    // { roomNumber: '210', benches: 40 },
    // { roomNumber: '211', benches: 40 },
    // { roomNumber: '212', benches: 40 },
    // { roomNumber: '213', benches: 40 },
  ]);

  const parseCsvFile = async (file: File): Promise<string[][]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          const rows = text
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter((line) => line.length > 0)
            .map((line) => line.split(',').map((cell) => cell.trim()));
          resolve(rows);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  // Validate Student Data
  const validateStudentData = (rows: string[][]): boolean => {
    if (rows.length < 2) return false; // At least header and one data row
    const header = rows[0];
    if (
      header.length !== 3 ||
      header[0] !== 'Branch' ||
      header[1] !== 'Total Students' ||
      header[2] !== 'Exam Group'
    ) {
      return false;
    }
    const dataRows = rows.slice(1);
    for (const row of dataRows) {
      if (row.length !== 3 || !row[0] || !row[1] || !row[2]) return false;
      if (isNaN(Number(row[1])) || Number(row[1]) <= 0) return false;
    }
    return true;
  };

  // Validate Room Data
  const validateRoomData = (rows: string[][]): boolean => {
    if (rows.length < 2) return false; 
    const header = rows[0];
    if (
      header.length !== 2 ||
      header[0] !== 'Room Number' ||
      header[1] !== 'Benches'
    ) {
      return false;
    }
    const dataRows = rows.slice(1);
    for (const row of dataRows) {
      if (row.length !== 2 || !row[0] || !row[1]) return false;
      if (isNaN(Number(row[1])) || Number(row[1]) <= 0) return false;
    }
    return true;
  };

  // Handle Student CSV Upload
  const handleStudentCsvUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parseCsvFile(file);
      if (!validateStudentData(rows)) {
        setError('Invalid Student CSV format');
        return;
      }
      const parsedStudents = rows.slice(1).map((row) => ({
        branch: row[0],
        totalStudents: Number(row[1]),
        examGroup: row[2],
      }));
      setStudents(parsedStudents);
      setError('');
    } catch (err) {
      setError('Failed to parse Student CSV');
    }
  };

  // Handle Room CSV Upload
  const handleRoomCsvUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parseCsvFile(file);
      if (!validateRoomData(rows)) {
        setError('Invalid Room CSV format');
        return;
      }
      const parsedRooms = rows.slice(1).map((row) => ({
        roomNumber: row[0],
        benches: Number(row[1]),
      }));
      setRooms(parsedRooms);
      setError('');
    } catch (err) {
      setError('Failed to parse Room CSV');
    }
  };

  const [output, setOutput] = useState<SeatingData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formatBranch = (branch: string, students: number[]): string => {
    if (students.length === 0) return '';
    const start = Math.min(...students);
    const end = Math.max(...students);
    return `${branch} (${start}-${end}=${students.length})`;
  };
  //===========must accurate=================
  
  const generateSeatingArrangement = () => {
    setLoading(true);
    setError('');
    
    try {
      const branchQueues: BranchGroup[] = students
        .filter(s => s.totalStudents > 0)
        .map(s => ({
          branch: s.branch,
          students: Array.from({ length: s.totalStudents }, (_, i) => i + 1),
          examGroup: s.examGroup,
        }));

      const result: Block[] = [];
      let blockNo = 1;
      let roomIndex = 0;
      let currentBranchIndex = 0;

      while (branchQueues.some(b => b.students.length > 0)) {
        const room = rooms[roomIndex];
        if (!room) {
          setError('Not enough rooms to accommodate all students!');
          setLoading(false);
          return;
        }

        const studentsPerBranch = room.benches; // Each branch gets benches count students
        const blockBranches: { [key: string]: number[] } = {};
        let seatsAllocated = 0;
        const usedExamGroups = new Set<string>();

        // Find current branch with students
        while (currentBranchIndex < branchQueues.length && branchQueues[currentBranchIndex].students.length === 0) {
          currentBranchIndex++;
        }

        if (currentBranchIndex >= branchQueues.length) break;

        const currentBranch = branchQueues[currentBranchIndex];
        
        // Take exactly studentsPerBranch students from current branch (or all remaining)
        const studentsToTake = Math.min(studentsPerBranch, currentBranch.students.length);
        const takenStudents = currentBranch.students.splice(0, studentsToTake);
        blockBranches[currentBranch.branch] = takenStudents;
        seatsAllocated += studentsToTake;
        usedExamGroups.add(currentBranch.examGroup);

        // If we took less than studentsPerBranch, current branch is exhausted
        if (studentsToTake < studentsPerBranch) {
          currentBranchIndex++;
        }

        // Now find a DIFFERENT exam group to fill the other half
        let foundPair = false;
        for (let i = currentBranchIndex; i < branchQueues.length; i++) {
          const nextBranch = branchQueues[i];
          
          if (nextBranch.students.length > 0 && !usedExamGroups.has(nextBranch.examGroup)) {
            // Take students from this branch to fill remaining capacity
            const remainingCapacity = room.benches * 2 - seatsAllocated;
            const studentsFromNext = Math.min(remainingCapacity, nextBranch.students.length);
            const takenFromNext = nextBranch.students.splice(0, studentsFromNext);
            
            if (!blockBranches[nextBranch.branch]) {
              blockBranches[nextBranch.branch] = [];
            }
            blockBranches[nextBranch.branch].push(...takenFromNext);
            seatsAllocated += studentsFromNext;
            usedExamGroups.add(nextBranch.examGroup);
            foundPair = true;
            break;
          }
        }

        // If we didn't find a pair with different exam group, try to fill with more branches
        if (!foundPair || seatsAllocated < room.benches * 2) {
          for (let i = currentBranchIndex; i < branchQueues.length; i++) {
            const nextBranch = branchQueues[i];
            
            if (nextBranch.students.length > 0 && !usedExamGroups.has(nextBranch.examGroup)) {
              const remainingCapacity = room.benches * 2 - seatsAllocated;
              const studentsFromNext = Math.min(remainingCapacity, nextBranch.students.length);
              const takenFromNext = nextBranch.students.splice(0, studentsFromNext);
              
              if (!blockBranches[nextBranch.branch]) {
                blockBranches[nextBranch.branch] = [];
              }
              blockBranches[nextBranch.branch].push(...takenFromNext);
              seatsAllocated += studentsFromNext;
              usedExamGroups.add(nextBranch.examGroup);
              
              if (seatsAllocated >= room.benches * 2) break;
            }
          }
        }

        // Format the block
        const branches = Object.entries(blockBranches)
          .filter(([_, students]) => students.length > 0)
          .map(([branch, students]) => formatBranch(branch, students));

        const total = Object.values(blockBranches).reduce((sum, students) => sum + students.length, 0);

        if (total > 0) {
          result.push({
            no: blockNo++,
            block: room.roomNumber,
            branches,
            total,
          });
        }

        roomIndex++;

        if (roomIndex > rooms.length * 3) {
          setError('Algorithm error: Not enough rooms');
          break;
        }
      }

      const outputData: SeatingData = {
        date: date,
        time: timeSlots,
        seatingPlan: result,
      };

      setOutput(outputData);
    } catch (err) {
      setError('Error: ' + err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportOutput = () => {
    if (!output) return;
    const blob = new Blob([JSON.stringify(output, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seating-arrangement-${Date.now()}.json`;
    a.click();
  };

  // const printPDF = () => {
  //   window.print();
  // };


const exportToDocx = () => {
  if (!output) return;

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Seating Plan for University Test-I, August 2025",
                bold: true,
                size: 32,
              }),
            ],
            alignment: "center",
          }),
          new Paragraph({
            text: `Date: ${output.date}`,
            spacing: { before: 200 },
          }),
          new Paragraph({
            text: `Time: ${output.time.join(" & ")}`,
            spacing: { after: 200 },
          }),
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("No.")],
                    width: { size: 10, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph("Block")],
                    width: { size: 30, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph("Branch")],
                    width: { size: 40, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph("Total")],
                    width: { size: 20, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
              ...output.seatingPlan.map((block) =>
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph(block.no.toString())],
                    }),
                    new TableCell({
                      children: [new Paragraph(block.block)],
                    }),
                    new TableCell({
                      children: block.branches.map(
                        (branch) => new Paragraph(branch)
                      ),
                    }),
                    new TableCell({
                      children: [new Paragraph(block.total.toString())],
                    }),
                  ],
                })
              ),
            ],
          }),
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `seating-arrangement-${Date.now()}.docx`;
    a.click();
    window.URL.revokeObjectURL(url);
  });
};

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-black via-black-900 to-black text-white p-6">
//       <div className="max-w-7xl mx-auto">
//       <div className="text-center mb-10">
//           <h1 className="text-4xl font-extrabold tracking-wide mb-2">
//             Smart{' '}
//             <span className="relative bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
//               Seating
//             </span>{' '}
//             Arrangement <span className="text-white">System</span>
//           </h1>
//           <div className="flex items-center justify-center mt-4 space-x-6 text-sm text-gray-500">
//             <span className="px-3 py-1 rounded-full bg-gray-800/60 border border-gray-700">
//               Efficient & Organized
//             </span>
//             <span className="px-3 py-1 rounded-full bg-gray-800/60 border border-gray-700">
//               Quick Setup
//             </span>
//             <span className="px-3 py-1 rounded-full bg-gray-800/60 border border-gray-700">
//               Analytics Included
//             </span>
//           </div>
//         </div>

//         <div className="bg-blue-900 bg-opacity-50 border border-blue-500 rounded-lg p-4 mb-6 print:hidden">
//           <div className="flex items-start gap-2">
//             <Info size={24} className="flex-shrink-0" />
//             <div>
//               <p className="font-semibold mb-1">Upload CSV File</p>
//               <ul>

//              <li>• <small>Upload the Students Data CSV File</small></li> 
//             <li>• <small>Upload Room Data CSV File</small></li>  
//             </ul>
//               </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 print:hidden">
//           <div className="bg-gray-800 rounded-lg p-6 shadow-xl">


//             <h2 className="text-xl font-bold mb-4 flex items-center gap-2">

//               <Settings size={24} />
//               Student Data
//             </h2>
//             <div className="space-y-2 mb-4">
//               <input
//                 type="text"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//                 className="w-full bg-gray-700 text-white px-3 py-2 rounded"
//                 placeholder="Date"
//               />
//             </div>

            
//             <div className="space-y-2 max-h-96 overflow-y-auto mb-4">
//               {students.map((student, idx) => (
//                 <div key={idx} className="bg-gray-700 p-2 rounded space-y-2">
//                   <div className="flex gap-2 items-center">
//                     <input
//                       type="text"
//                       value={student.branch}
//                       onChange={(e) => {
//                         const newStudents = [...students];
//                         newStudents[idx].branch = e.target.value;
//                         setStudents(newStudents);
//                       }}
//                       className="flex-1 bg-gray-600 text-white px-3 py-1 rounded text-sm"
//                       placeholder="Branch Name"
//                     />
//                     <input
//                       type="number"
//                       value={student.totalStudents}
//                       onChange={(e) => {
//                         const newStudents = [...students];
//                         newStudents[idx].totalStudents = parseInt(e.target.value) || 0;
//                         setStudents(newStudents);
//                       }}
//                       className="w-20 bg-gray-600 text-white px-2 py-1 rounded text-sm"
//                       placeholder="Count"
//                     />
//                     <button
//                       onClick={() => setStudents(students.filter((_, i) => i !== idx))}
//                       className="text-red-400 hover:text-red-300 px-2"
//                     >
//                       ✕
//                     </button>
//                   </div>
//                   <input
//                     type="text"
//                     value={student.examGroup}
//                     onChange={(e) => {
//                       const newStudents = [...students];
//                       newStudents[idx].examGroup = e.target.value;
//                       setStudents(newStudents);
//                     }}
//                     className="w-full bg-gray-600 text-white px-3 py-1 rounded text-sm"
//                     placeholder="Exam Group"
//                   />
//                 </div>
//               ))}
//             </div>
//             <button
//               onClick={() => setStudents([...students, { branch: '', totalStudents: 0, examGroup: '' }])}
//               className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
//             >
//               Add Branch
//             </button>
//           </div>

//           <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
//             <h2 className="text-xl font-bold mb-4">Rooms ({rooms.length} total)</h2>
//             <div className="space-y-2 h-96 overflow-y-auto">
//               {rooms.map((room, idx) => (
//                 <div key={idx} className="flex gap-2 items-center bg-gray-700 p-2 rounded">
//                   <input
//                     type="text"
//                     value={room.roomNumber}
//                     onChange={(e) => {
//                       const newRooms = [...rooms];
//                       newRooms[idx].roomNumber = e.target.value;
//                       setRooms(newRooms);
//                     }}
//                     className="flex-1 bg-gray-600 text-white px-3 py-1 rounded"
//                     placeholder="Room"
//                   />
//                   <input
//                     type="number"
//                     value={room.benches}
//                     onChange={(e) => {
//                       const newRooms = [...rooms];
//                       newRooms[idx].benches = parseInt(e.target.value) || 0;
//                       setRooms(newRooms);
//                     }}
//                     className="w-20 bg-gray-600 text-white px-3 py-1 rounded"
//                     placeholder="Benches"
//                   />
//                   <span className="text-xs text-gray-400 w-20">{room.benches * 2} seats</span>
//                   <button
//                     onClick={() => setRooms(rooms.filter((_, i) => i !== idx))}
//                     className="text-red-400 hover:text-red-300 px-2"
//                   >
//                     ✕
//                   </button>
//                 </div>
//               ))}
//             </div>
//             <button
//               onClick={() => setRooms([...rooms, { roomNumber: '', benches: 40 }])}
//               className="mt-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
//             >
//               Add Room
//             </button>
//           </div>
//         </div>

//         <div className="flex justify-center gap-4 mb-6 print:hidden">
//           <button
//             onClick={generateSeatingArrangement}
//             disabled={loading}
//             className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-lg font-semibold disabled:opacity-50"
//           >
//             <Play size={24} />
//             {loading ? 'Processing...' : 'Generate Seating Plan'}
//           </button>
//           {output && (
//             <>
//               <button
//                 onClick={exportOutput}
//                 className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg"
//               >
//                 <Download size={24} />
//                 Export JSON
//               </button>
//               <button
//                 onClick={printPDF}
//                 className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg"
//               >
//                 <Download size={24} />
//                 Print PDF
//               </button>
//             </>
//           )}
//         </div>

//         {error && (
//           <div className="bg-red-900 bg-opacity-50 border border-red-500 rounded-lg p-4 mb-6 flex items-center gap-2 print:hidden">
//             <AlertCircle size={24} />
//             <span>{error}</span>
//           </div>
//         )}

//         {output && !error && (
//           <div className="bg-green-900 bg-opacity-50 border border-green-500 rounded-lg p-4 mb-6 flex items-center gap-2 print:hidden">
//             <CheckCircle size={24} />
//             <span>Done! Each branch takes room_capacity/2 students, paired with different exam groups.</span>
//           </div>
//         )}

//         {/* {output && (
//           <div className="bg-gray-800 rounded-lg p-6 shadow-xl print:bg-white print:text-black">
//             <div className="text-center mb-6">
//               <h2 className="text-2xl font-bold mb-2">
//                 SEATING PLAN FOR UNIVERSITY TEST-I, AUGUST 2025
//               </h2>
//               <p className="text-lg font-semibold">{output.date}</p>
//               <p className="text-gray-400 print:text-gray-700">
//                 TIME: {output.time.join(' & ')}
//               </p>
//             </div>

//             <table className="w-full border-collapse border border-gray-600 print:border-black">
//               <thead>
//                 <tr className="bg-gray-700 print:bg-gray-200">
//                   <th className="border border-gray-600 print:border-black p-3 text-left">No.</th>
//                   <th className="border border-gray-600 print:border-black p-3 text-left">BLOCK</th>
//                   <th className="border border-gray-600 print:border-black p-3 text-left">BRANCH</th>
//                   <th className="border border-gray-600 print:border-black p-3 text-left">TOTAL</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {output.seatingPlan.map((block) => (
//                   <tr key={block.no} className="hover:bg-gray-700 hover:bg-opacity-30 print:hover:bg-transparent">
//                     <td className="border border-gray-600 print:border-black p-3">{block.no}</td>
//                     <td className="border border-gray-600 print:border-black p-3 font-bold">{block.block}</td>
//                     <td className="border border-gray-600 print:border-black p-3">
//                       {block.branches.map((branch, idx) => (
//                         <div key={idx} className="text-sm">
//                           {branch}
//                         </div>
//                       ))}
//                     </td>
//                     <td className="border border-gray-600 print:border-black p-3 font-bold text-center">{block.total}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//           </div>
//         )} */}
//         {output && (
//   <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl print:bg-white print:text-black">
//     {/* Output Header */}
//     <div className="text-center mb-8">
//       <h2 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">
//         SEATING PLAN FOR UNIVERSITY TEST-I, AUGUST 2025
//       </h2>
//       <p className="text-lg font-semibold text-gray-300">{output.date}</p>
//       <p className="text-sm text-gray-400 print:text-gray-700">
//         TIME: {output.time.join(' & ')}
//       </p>
//     </div>

//     {/* Output Table */}
//     <div className="overflow-x-auto">
//       <table className="w-full border-collapse border border-gray-700 rounded-lg overflow-hidden print:border-black">
//         <thead>
//           <tr className="bg-gradient-to-r from-gray-800 to-gray-700 text-gray-300 print:bg-gray-200">
//             <th className="border border-gray-700 print:border-black p-4 text-left text-sm font-semibold">
//               No.
//             </th>
//             <th className="border border-gray-700 print:border-black p-4 text-left text-sm font-semibold">
//               Block
//             </th>
//             <th className="border border-gray-700 print:border-black p-4 text-left text-sm font-semibold">
//               Branch
//             </th>
//             <th className="border border-gray-700 print:border-black p-4 text-center text-sm font-semibold">
//               Total
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {output.seatingPlan.map((block) => (
//             <tr
//               key={block.no}
//               className="hover:bg-gray-800 hover:bg-opacity-50 transition-colors duration-200 print:hover:bg-transparent"
//             >
//               <td className="border border-gray-700 print:border-black p-4 text-gray-300 text-sm">
//                 {block.no}
//               </td>
//               <td className="border border-gray-700 print:border-black p-4 text-gray-300 text-sm font-bold">
//                 {block.block}
//               </td>
//               <td className="border border-gray-700 print:border-black p-4 text-gray-300 text-sm">
//                 {block.branches.map((branch, idx) => (
//                   <div key={idx} className="text-sm">
//                     {branch}
//                   </div>
//                 ))}
//               </td>
//               <td className="border border-gray-700 print:border-black p-4 text-gray-300 text-sm font-bold text-center">
//                 {block.total}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>

//     {/* JSON Output (Optional) */}
   
//   </div>
// )}

       
//       </div>

//       <style>{`
//         @media print {
//           body { background: white !important; }
//           .print\\:hidden { display: none !important; }
//           .print\\:text-black { color: black !important; }
//           .print\\:bg-white { background-color: white !important; }
//           .print\\:border-black { border-color: black !important; }
//         }
//       `}</style>
//     </div>
//   );

// ================================sahi hain yeh revert kr dena ====================================
// return (
//   <div className="min-h-screen bg-gradient-to-br from-black via-black-900 to-black text-white p-6">
//     <div className="max-w-7xl mx-auto">
//       <div className="text-center mb-10">
//         <h1 className="text-4xl font-extrabold tracking-wide mb-2">
//           Smart <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">Seating</span> Arrangement <span className="text-white">System</span>
//         </h1>
//         <div className="flex items-center justify-center mt-4 space-x-6 text-sm text-gray-500">
//           <span className="px-3 py-1 rounded-full bg-gray-800/60 border border-gray-700">Efficient & Organized</span>
//           <span className="px-3 py-1 rounded-full bg-gray-800/60 border border-gray-700">Quick Setup</span>
//           <span className="px-3 py-1 rounded-full bg-gray-800/60 border border-gray-700">Analytics Included</span>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 print:hidden">
//         {/* Student CSV Upload */}
//         <div className="bg-gray-800 rounded-lg p-6 shadow-xl flex flex-col items-center justify-center gap-4">
//           <ClockArrowUp size={48} className="text-purple-500" />
//           <h2 className="text-xl font-bold">Upload Student CSV</h2>
//           <input
//             type="file"
//             accept=".csv"
//             onChange={handleStudentCsvUpload}
//             className="cursor-pointer text-gray-300"
//           />
//           <p className="text-sm text-gray-400">Format: Branch, Total Students, Exam Group</p>
//         </div>

//         {/* Room CSV Upload */}
//         <div className="bg-gray-800 rounded-lg p-6 shadow-xl flex flex-col items-center justify-center gap-4">
//           <Building size={48} className="text-indigo-500" />
//           <h2 className="text-xl font-bold">Upload Room CSV</h2>
//           <input
//             type="file"
//             accept=".csv"
//             onChange={handleRoomCsvUpload}
//             className="cursor-pointer text-gray-300"
//           />
//           <p className="text-sm text-gray-400">Format: Room Number, Benches</p>
//         </div>
//       </div>

//       <div className="mb-6">
//         <input
//           type="text"
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//           className="w-full max-w-xs bg-gray-700 text-white px-3 py-2 rounded mb-4"
//           placeholder="Date"
//         />
//       </div>

//       <div className="flex justify-center gap-4 mb-6 print:hidden">
//         <button
//           onClick={generateSeatingArrangement}
//           disabled={loading}
//           className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-lg font-semibold disabled:opacity-50"
//         >
//           <Play size={24} />
//           {loading ? 'Processing...' : 'Generate Seating Plan'}
//         </button>
//         {output && (
//           <>
//             <button
//               onClick={exportOutput}
//               className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg"
//             >
//               <Download size={24} />
//               Export JSON
//             </button>
//             {/* <button
//               onClick={printPDF}
//               className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg"
//             >
//               <Download size={24} />
//               Print PDF
//             </button> */}
//             <button
//   onClick={exportToDocx}
//   className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg"
// >
//   <Download size={24} />
//   Export DOCX
// </button>
//           </>
//         )}
//       </div>

//       {error && (
//         <div className="bg-red-900 bg-opacity-50 border border-red-500 rounded-lg p-4 mb-6 flex items-center gap-2 print:hidden">
//           <AlertCircle size={24} />
//           <span>{error}</span>
//         </div>
//       )}

//       {output && !error && (
//         <div className="bg-green-900 bg-opacity-50 border border-green-500 rounded-lg p-4 mb-6 flex items-center gap-2 print:hidden">
//           <CheckCircle size={24} />
//           <span>Done! Each branch takes room_capacity/2 students, paired with different exam groups.</span>
//         </div>
//       )}

//       {/* Seating Plan Output */}
//       {output && (
//         <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl print:bg-white print:text-black">
//           <div className="text-center mb-8">
//             <h2 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">
//               SEATING PLAN FOR UNIVERSITY TEST-I, AUGUST 2025
//             </h2>
//             <p className="text-lg font-semibold text-gray-300">{output.date}</p>
//             <p className="text-sm text-gray-400 print:text-gray-700">
//               TIME: {output.time.join(' & ')}
//             </p>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse border border-gray-700 rounded-lg overflow-hidden print:border-black">
//               <thead>
//                 <tr className="bg-gradient-to-r from-gray-800 to-gray-700 text-gray-300 print:bg-gray-200">
//                   <th className="border border-gray-700 print:border-black p-4 text-left text-sm font-semibold">No.</th>
//                   <th className="border border-gray-700 print:border-black p-4 text-left text-sm font-semibold">Block</th>
//                   <th className="border border-gray-700 print:border-black p-4 text-left text-sm font-semibold">Branch</th>
//                   <th className="border border-gray-700 print:border-black p-4 text-center text-sm font-semibold">Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {output.seatingPlan.map((block) => (
//                   <tr key={block.no} className="hover:bg-gray-800 hover:bg-opacity-50 transition-colors duration-200 print:hover:bg-transparent">
//                     <td className="border border-gray-700 print:border-black p-4 text-gray-300 text-sm">{block.no}</td>
//                     <td className="border border-gray-700 print:border-black p-4 text-gray-300 text-sm font-bold">{block.block}</td>
//                     <td className="border border-gray-700 print:border-black p-4 text-gray-300 text-sm">
//                       {block.branches.map((branch: string, idx: number) => <div key={idx}>{branch}</div>)}
//                     </td>
//                     <td className="border border-gray-700 print:border-black p-4 text-gray-300 text-sm font-bold text-center">{block.total}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   </div>
// );

// Keep all your existing state, handlers, and logic above this return statement

return (
  <div className="min-h-screen bg-[#0B0B0B] text-white">
    {/* Header */}
    <div className="bg-[#000000] border-b border-neutral-800 p-6">
      <div className="max-w-[1800px] mx-auto">
        <h1 className="text-3xl font-bold">
          <span className="text-2xl md:text-2xl font-semibold text-white">
            E
            <span className="text-2xl md:text-4xl relative top-1 bg-gradient-to-r from-[#8B5CF6] to-[#0B0B0B] bg-clip-text text-transparent">
              X
            </span>
            amEase
          </span>
          <span className="ml-3 text-lg font-normal text-neutral-400">Seating Arrangement</span>
        </h1>
      </div>
    </div>

    <div className="max-w-[1800px] mx-auto p-6">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3">
          Smart <span className="bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] bg-clip-text text-transparent">Seating</span> Arrangement System
        </h2>
        <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
          <span className="px-4 py-1.5 rounded-full bg-[#111111] border border-neutral-800 text-sm text-neutral-400">
            Efficient & Organized
          </span>
          <span className="px-4 py-1.5 rounded-full bg-[#111111] border border-neutral-800 text-sm text-neutral-400">
            Quick Setup
          </span>
          <span className="px-4 py-1.5 rounded-full bg-[#111111] border border-neutral-800 text-sm text-neutral-400">
            Analytics Included
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Input Section */}
        <div className="space-y-4 print:hidden">
          {/* Student CSV Upload */}
          <div className="bg-[#111111] border border-neutral-800 rounded-xl p-6">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#8B5CF6]/20 to-[#6D28D9]/20 rounded-xl flex items-center justify-center border border-[#8B5CF6]/30">
                <ClockArrowUp className="text-[#8B5CF6]" size={32} />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-1">Upload Student CSV</h3>
                <p className="text-xs text-neutral-400">Format: Branch, Total Students, Exam Group</p>
              </div>
              <input
                type="file"
                accept=".csv"
                onChange={handleStudentCsvUpload}
                className="w-full bg-[#1D1D1D] border border-neutral-700 rounded-lg p-2.5 text-sm text-white file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:bg-[#8B5CF6] file:text-white hover:file:bg-[#7C3AED] cursor-pointer"
              />
            </div>
          </div>

          {/* Room CSV Upload */}
          <div className="bg-[#111111] border border-neutral-800 rounded-xl p-6">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                <Building className="text-blue-400" size={32} />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-1">Upload Room CSV</h3>
                <p className="text-xs text-neutral-400">Format: Room Number, Benches</p>
              </div>
              <input
                type="file"
                accept=".csv"
                onChange={handleRoomCsvUpload}
                className="w-full bg-[#1D1D1D] border border-neutral-700 rounded-lg p-2.5 text-sm text-white file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:bg-blue-500 file:text-white hover:file:bg-blue-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Date Input */}
          <div className="bg-[#111111] border border-neutral-800 rounded-xl p-5">
            <label className="text-xs text-neutral-400 mb-2 block">Exam Date</label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#1D1D1D] border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#8B5CF6]"
              placeholder="Enter date"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={generateSeatingArrangement}
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#10B981] to-[#059669] text-white px-6 py-4 rounded-xl hover:from-[#059669] hover:to-[#047857] text-base font-semibold flex items-center justify-center gap-3 shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Play size={20} />
            {loading ? 'Processing...' : 'Generate Seating Plan'}
          </button>

          {/* Export Buttons */}
          {output && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={exportOutput}
                className="bg-[#1D1D1D] border border-neutral-700 text-white px-4 py-3 rounded-lg hover:bg-[#2D2D2D] text-sm font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Download size={16} />
                Export JSON
              </button>
              <button
                onClick={exportToDocx}
                className="bg-[#1D1D1D] border border-neutral-700 text-white px-4 py-3 rounded-lg hover:bg-[#2D2D2D] text-sm font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Download size={16} />
                Export DOCX
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
              <span className="text-sm text-red-400">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {output && !error && (
            <div className="bg-[#10B981]/10 border border-[#10B981]/30 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="text-[#10B981] flex-shrink-0" size={20} />
              <span className="text-sm text-[#10B981]">
                Done! Each branch takes room_capacity/2 students, paired with different exam groups.
              </span>
            </div>
          )}
        </div>

        {/* Right Column - Output Section */}
        <div className="bg-[#111111] border border-neutral-800 rounded-xl p-5 h-fit sticky top-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="text-[#8B5CF6]" size={20} />
            <h2 className="text-lg font-semibold">Seating Plan Output</h2>
          </div>

          {!output ? (
            <div className="text-center py-16 text-neutral-500">
              <FileText size={48} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm">Click "Generate Seating Plan" to create your arrangement</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Header Card */}
              <div className="bg-gradient-to-r from-[#1D1D1D] to-[#2D2D2D] border border-neutral-800 rounded-lg p-4">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] bg-clip-text text-transparent">
                    SEATING PLAN FOR UNIVERSITY TEST-I, AUGUST 2025
                  </h3>
                  <p className="text-base font-semibold">{output.date}</p>
                  <p className="text-xs text-neutral-400">
                    TIME: {output.time.join(' & ')}
                  </p>
                </div>
              </div>

              {/* Seating Table */}
              <div className="bg-[#0a0a0a] border border-neutral-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-[#1D1D1D] border-b border-neutral-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                          No.
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                          Block
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                          Branch
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {output.seatingPlan.map((block) => (
                        <tr key={block.no} className="hover:bg-[#1D1D1D]/50 transition-colors">
                          <td className="px-4 py-3 text-sm">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] rounded-lg flex items-center justify-center font-bold text-xs">
                              {block.no}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold">{block.block}</td>
                          <td className="px-4 py-3 text-sm">
                            <div className="space-y-1">
                              {block.branches.map((branch: string, idx: number) => (
                                <div key={idx} className="text-neutral-300">
                                  {branch}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center px-3 py-1 bg-[#10B981]/20 text-[#10B981] rounded-full text-xs font-semibold border border-[#10B981]/30">
                              {block.total}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

};

export default SmartSeatingApp;

//==================================TESTING====================================
// 'use client'
// import React, { useState } from 'react';
// import { Download, Upload, Play, AlertCircle, CheckCircle, Settings } from 'lucide-react';

// interface BranchGroup {
//   branch: string;
//   students: number[];
// }

// interface Block {
//   no: number;
//   block: string;
//   branches: string[];
//   total: number;
// }

// interface SeatingData {
//   date: string;
//   time: string[];
//   seatingPlan: Block[];
// }

// interface Room {
//   roomNumber: string;
//   capacity: number;
// }

// interface StudentData {
//   branch: string;
//   totalStudents: number;
// }

// const SmartSeatingApp = () => {
//   const [inputMode, setInputMode] = useState<'json' | 'manual'>('manual');
//   const [jsonInput, setJsonInput] = useState('');
//   const [date, setDate] = useState('18/08/2025');
//   const [timeSlots, setTimeSlots] = useState(['10:30 to 11:30 AM', '1:30 to 2:30 PM']);
//   const [students, setStudents] = useState<StudentData[]>([
//     { branch: 'SE COMP A', totalStudents: 75 },
//     { branch: 'SE COMP B', totalStudents: 200 },
//     { branch: 'SE COMP C', totalStudents: 150 },
//     { branch: 'BE IT C', totalStudents: 79 },
//     { branch: 'SE CIVIL A', totalStudents: 34 },
//     { branch: 'TE CIVIL A', totalStudents: 65 },
//   ]);
//   const [rooms, setRooms] = useState<Room[]>([
//     { roomNumber: '004', capacity: 40 },
//     { roomNumber: '005', capacity: 40 },
//     { roomNumber: '101', capacity: 40 },
//     { roomNumber: '102', capacity: 40 },
//     { roomNumber: '103', capacity: 40 },
//     { roomNumber: '104', capacity: 40 },
//     { roomNumber: '201', capacity: 40 },
//     { roomNumber: '202', capacity: 40 },
//     { roomNumber: '203', capacity: 40 },
//     { roomNumber: '204', capacity: 40 },
//     { roomNumber: '205', capacity: 40 },
//     { roomNumber: '206', capacity: 40 },
//     { roomNumber: '207', capacity: 40 },
//     { roomNumber: '209', capacity: 40 },
//     { roomNumber: '210', capacity: 40 },
//     { roomNumber: '211', capacity: 40 },
//     { roomNumber: '212', capacity: 40 },
//     { roomNumber: '213', capacity: 40 },
//   ]);
//   const [output, setOutput] = useState<SeatingData | null>(null);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const parseBranch = (branchStr: string): BranchGroup | null => {
//     const match = branchStr.match(/^(.+?)\s*\((\d+)-(\d+)=(\d+)\)$/);
//     if (!match) return null;
    
//     const branch = match[1].trim();
//     const start = parseInt(match[2]);
//     const end = parseInt(match[3]);
//     const students = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    
//     return { branch, students };
//   };

//   const formatBranch = (branch: string, students: number[]): string => {
//     if (students.length === 0) return '';
//     const start = Math.min(...students);
//     const end = Math.max(...students);
//     return `${branch} (${start}-${end}=${students.length})`;
//   };

//   const generateSeatingArrangement = () => {
//     setLoading(true);
//     setError('');
    
//     try {
//       let branchQueues: BranchGroup[];

//       if (inputMode === 'json') {
//         const data = JSON.parse(jsonInput);
//         const branchMap: { [key: string]: number[] } = {};
        
//         data.seatingPlan.forEach((block: Block) => {
//           block.branches.forEach((branchStr: string) => {
//             const parsed = parseBranch(branchStr);
//             if (parsed) {
//               if (!branchMap[parsed.branch]) {
//                 branchMap[parsed.branch] = [];
//               }
//               branchMap[parsed.branch].push(...parsed.students);
//             }
//           });
//         });

//         branchQueues = Object.entries(branchMap).map(([branch, students]) => ({
//           branch,
//           students: [...students],
//         }));
//       } else {
//         branchQueues = students
//           .filter(s => s.totalStudents > 0)
//           .map(s => ({
//             branch: s.branch,
//             students: Array.from({ length: s.totalStudents }, (_, i) => i + 1),
//           }));
//       }

//       const result: Block[] = [];
//       let blockNo = 1;
//       let roomIndex = 0;

//       while (branchQueues.some(b => b.students.length > 0)) {
//         const room = rooms[roomIndex];
//         if (!room) {
//           setError('Not enough rooms to accommodate all students!');
//           setLoading(false);
//           return;
//         }

//         const roomCapacity = room.capacity;
//         const blockBranches: { [key: string]: number[] } = {};
//         let seatsAllocated = 0;

//         const availableBranches = branchQueues.filter(b => b.students.length > 0);

//         if (availableBranches.length === 0) break;

//         if (availableBranches.length === 1) {
//           const branch = availableBranches[0];
//           const studentsToTake = Math.min(roomCapacity, branch.students.length);
//           blockBranches[branch.branch] = branch.students.splice(0, studentsToTake);
//           seatsAllocated = studentsToTake;
//         } else {
//           let branchIndex = 0;
//           while (seatsAllocated < roomCapacity && availableBranches.some(b => b.students.length > 0)) {
//             const currentBranches = availableBranches.filter(b => b.students.length > 0);
            
//             if (currentBranches.length === 0) break;

//             if (branchIndex >= currentBranches.length) {
//               branchIndex = 0;
//             }

//             const branch = currentBranches[branchIndex];
//             if (branch.students.length > 0) {
//               const student = branch.students.shift()!;
//               if (!blockBranches[branch.branch]) {
//                 blockBranches[branch.branch] = [];
//               }
//               blockBranches[branch.branch].push(student);
//               seatsAllocated++;
//             }

//             branchIndex++;

//             const remainingBranches = availableBranches.filter(b => b.students.length > 0);
//             if (remainingBranches.length === 1 && seatsAllocated < roomCapacity) {
//               const lastBranch = remainingBranches[0];
//               const remainingSeats = roomCapacity - seatsAllocated;
//               const studentsToTake = Math.min(remainingSeats, lastBranch.students.length);
              
//               if (!blockBranches[lastBranch.branch]) {
//                 blockBranches[lastBranch.branch] = [];
//               }
//               blockBranches[lastBranch.branch].push(...lastBranch.students.splice(0, studentsToTake));
//               seatsAllocated += studentsToTake;
//               break;
//             }
//           }
//         }

//         const branches = Object.entries(blockBranches)
//           .filter(([_, students]) => students.length > 0)
//           .map(([branch, students]) => formatBranch(branch, students));

//         const total = Object.values(blockBranches).reduce((sum, students) => sum + students.length, 0);

//         result.push({
//           no: blockNo++,
//           block: room.roomNumber,
//           branches,
//           total,
//         });

//         roomIndex++;
//       }

//       const outputData: SeatingData = {
//         date: inputMode === 'json' ? JSON.parse(jsonInput).date : date,
//         time: inputMode === 'json' ? JSON.parse(jsonInput).time : timeSlots,
//         seatingPlan: result,
//       };

//       setOutput(outputData);
//     } catch (err) {
//       setError('Invalid input. Please check your data.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadSampleData = () => {
//     const sampleData = {
//       date: "18/08/2025",
//       time: ["10:30 to 11:30 AM", "1:30 to 2:30 PM"],
//       seatingPlan: [
//         {
//           no: 1,
//           block: "004",
//           branches: ["SE COMP A (1-40=40)", "BE IT C (41-79=39)"],
//           total: 79
//         }
//       ]
//     };
//     setJsonInput(JSON.stringify(sampleData, null, 2));
//   };

//   const exportOutput = () => {
//     if (!output) return;
//     const blob = new Blob([JSON.stringify(output, null, 2)], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `seating-arrangement-${Date.now()}.json`;
//     a.click();
//   };

//   const printPDF = () => {
//     window.print();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-6">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-4xl font-bold text-center mb-8 print:text-3xl">
//           Smart Seating Arrangement System
//         </h1>

//         <div className="flex justify-center gap-4 mb-6 print:hidden">
//           <button
//             onClick={() => setInputMode('manual')}
//             className={`px-6 py-2 rounded-lg font-semibold ${
//               inputMode === 'manual' ? 'bg-purple-600' : 'bg-gray-700'
//             }`}
//           >
//             Manual Input
//           </button>
//           <button
//             onClick={() => setInputMode('json')}
//             className={`px-6 py-2 rounded-lg font-semibold ${
//               inputMode === 'json' ? 'bg-purple-600' : 'bg-gray-700'
//             }`}
//           >
//             JSON Input
//           </button>
//         </div>

//         {inputMode === 'manual' && (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 print:hidden">
//             <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
//               <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
//                 <Settings size={24} />
//                 Student Data
//               </h2>
//               <div className="space-y-2 mb-4">
//                 <input
//                   type="text"
//                   value={date}
//                   onChange={(e) => setDate(e.target.value)}
//                   className="w-full bg-gray-700 text-white px-3 py-2 rounded"
//                   placeholder="Date (DD/MM/YYYY)"
//                 />
//               </div>
//               <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
//                 {students.map((student, idx) => (
//                   <div key={idx} className="flex gap-2 items-center bg-gray-700 p-2 rounded">
//                     <input
//                       type="text"
//                       value={student.branch}
//                       onChange={(e) => {
//                         const newStudents = [...students];
//                         newStudents[idx].branch = e.target.value;
//                         setStudents(newStudents);
//                       }}
//                       className="flex-1 bg-gray-600 text-white px-3 py-1 rounded"
//                       placeholder="Branch Name"
//                     />
//                     <input
//                       type="number"
//                       value={student.totalStudents}
//                       onChange={(e) => {
//                         const newStudents = [...students];
//                         newStudents[idx].totalStudents = parseInt(e.target.value) || 0;
//                         setStudents(newStudents);
//                       }}
//                       className="w-24 bg-gray-600 text-white px-3 py-1 rounded"
//                       placeholder="Count"
//                     />
//                     <button
//                       onClick={() => setStudents(students.filter((_, i) => i !== idx))}
//                       className="text-red-400 hover:text-red-300 px-2"
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 ))}
//               </div>
//               <button
//                 onClick={() => setStudents([...students, { branch: '', totalStudents: 0 }])}
//                 className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
//               >
//                 Add Branch
//               </button>
//             </div>

//             <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
//               <h2 className="text-xl font-bold mb-4">Room Configuration</h2>
//               <div className="space-y-2 h-80 overflow-y-auto">
//                 {rooms.map((room, idx) => (
//                   <div key={idx} className="flex gap-2 items-center bg-gray-700 p-2 rounded">
//                     <input
//                       type="text"
//                       value={room.roomNumber}
//                       onChange={(e) => {
//                         const newRooms = [...rooms];
//                         newRooms[idx].roomNumber = e.target.value;
//                         setRooms(newRooms);
//                       }}
//                       className="flex-1 bg-gray-600 text-white px-3 py-1 rounded"
//                       placeholder="Room Number"
//                     />
//                     <input
//                       type="number"
//                       value={room.capacity}
//                       onChange={(e) => {
//                         const newRooms = [...rooms];
//                         newRooms[idx].capacity = parseInt(e.target.value) || 0;
//                         setRooms(newRooms);
//                       }}
//                       className="w-20 bg-gray-600 text-white px-3 py-1 rounded"
//                       placeholder="Cap"
//                     />
//                     <span className="text-xs text-gray-400 w-12">seats</span>
//                     <button
//                       onClick={() => setRooms(rooms.filter((_, i) => i !== idx))}
//                       className="text-red-400 hover:text-red-300 px-2"
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 ))}
//               </div>
//               <button
//                 onClick={() => setRooms([...rooms, { roomNumber: '', capacity: 40 }])}
//                 className="mt-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
//               >
//                 Add Room
//               </button>
//             </div>
//           </div>
//         )}

//         {inputMode === 'json' && (
//           <div className="mb-6 print:hidden">
//             <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
//               <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
//                 <Upload size={24} />
//                 Student Data (JSON)
//               </h2>
//               <textarea
//                 value={jsonInput}
//                 onChange={(e) => setJsonInput(e.target.value)}
//                 className="w-full h-64 bg-gray-700 text-white p-4 rounded font-mono text-sm"
//                 placeholder="Paste your JSON data here..."
//               />
//               <button
//                 onClick={loadSampleData}
//                 className="mt-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
//               >
//                 Load Sample Data
//               </button>
//             </div>
//           </div>
//         )}

//         <div className="flex justify-center gap-4 mb-6 print:hidden">
//           <button
//             onClick={generateSeatingArrangement}
//             disabled={loading}
//             className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-lg font-semibold disabled:opacity-50"
//           >
//             <Play size={24} />
//             {loading ? 'Processing...' : 'Generate Seating Plan'}
//           </button>
//           {output && (
//             <>
//               <button
//                 onClick={exportOutput}
//                 className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg"
//               >
//                 <Download size={24} />
//                 Export JSON
//               </button>
//               <button
//                 onClick={printPDF}
//                 className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg"
//               >
//                 <Download size={24} />
//                 Print PDF
//               </button>
//             </>
//           )}
//         </div>

//         {error && (
//           <div className="bg-red-900 bg-opacity-50 border border-red-500 rounded-lg p-4 mb-6 flex items-center gap-2 print:hidden">
//             <AlertCircle size={24} />
//             <span>{error}</span>
//           </div>
//         )}

//         {output && !error && (
//           <div className="bg-green-900 bg-opacity-50 border border-green-500 rounded-lg p-4 mb-6 flex items-center gap-2 print:hidden">
//             <CheckCircle size={24} />
//             <span>Seating arrangement generated! Students from different branches alternate on benches.</span>
//           </div>
//         )}

//         {output && (
//           <div className="bg-gray-800 rounded-lg p-6 shadow-xl print:bg-white print:text-black">
//             <div className="text-center mb-6">
//               <h2 className="text-2xl font-bold mb-2">
//                 SEATING PLAN FOR UNIVERSITY TEST-I, AUGUST 2025
//               </h2>
//               <p className="text-lg font-semibold">{output.date}</p>
//               <p className="text-gray-400 print:text-gray-700">
//                 TIME: {output.time.join(' & ')}
//               </p>
//             </div>

//             <table className="w-full border-collapse border border-gray-600 print:border-black">
//               <thead>
//                 <tr className="bg-gray-700 print:bg-gray-200">
//                   <th className="border border-gray-600 print:border-black p-3 text-left">No.</th>
//                   <th className="border border-gray-600 print:border-black p-3 text-left">BLOCK</th>
//                   <th className="border border-gray-600 print:border-black p-3 text-left">BRANCH</th>
//                   <th className="border border-gray-600 print:border-black p-3 text-left">TOTAL</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {output.seatingPlan.map((block) => (
//                   <tr key={block.no} className="hover:bg-gray-700 hover:bg-opacity-30 print:hover:bg-transparent">
//                     <td className="border border-gray-600 print:border-black p-3">{block.no}</td>
//                     <td className="border border-gray-600 print:border-black p-3 font-bold">{block.block}</td>
//                     <td className="border border-gray-600 print:border-black p-3">
//                       {block.branches.map((branch, idx) => (
//                         <div key={idx} className="text-sm">
//                           {branch}
//                         </div>
//                       ))}
//                     </td>
//                     <td className="border border-gray-600 print:border-black p-3 font-bold text-center">{block.total}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             <div className="mt-6 print:hidden">
//               <h3 className="text-lg font-bold mb-2">JSON Output:</h3>
//               <pre className="bg-gray-900 p-4 rounded text-xs overflow-x-auto">
//                 {JSON.stringify(output, null, 2)}
//               </pre>
//             </div>
//           </div>
//         )}

//         <div className="mt-8 bg-gray-800 rounded-lg p-6 print:hidden">
//           <h3 className="text-xl font-bold mb-4">How the Algorithm Works:</h3>
//           <ul className="space-y-2 text-gray-300">
//             <li>✓ <strong>Sequential Room Filling:</strong> Fills one room completely before moving to the next</li>
//             <li>✓ <strong>Branch Alternation:</strong> Students alternate (SE COMP A, BE IT C, SE COMP B, SE COMP C...)</li>
//             <li>✓ <strong>Single Branch Completion:</strong> If only one branch remains, it fills the rest of the room</li>
//             <li>✓ <strong>Individual Divisions:</strong> Each division (A, B, C) is treated separately</li>
//           </ul>
//         </div>
//       </div>

//       <style>{`
//         @media print {
//           body { background: white !important; }
//           .print\\:hidden { display: none !important; }
//           .print\\:text-black { color: black !important; }
//           .print\\:bg-white { background-color: white !important; }
//           .print\\:border-black { border-color: black !important; }
//           table { page-break-inside: auto; }
//           tr { page-break-inside: avoid; page-break-after: auto; }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default SmartSeatingApp;

// const page =() =>{
//   return <div>
//     <SmartSeatingApp></SmartSeatingApp>
//   </div>

// } 
// export default page