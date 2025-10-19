
// 'use client';
// import React, { useState, useRef, useEffect } from 'react';
// import { Activity } from '../types/activity';
// import { BookOpen, Trash2, Star, Calendar, BookMarked, ChevronDown, Check } from 'lucide-react';

// type Props = {
//   activities: Activity[];
//   onUpdate: (id: number, field: keyof Activity, value: any) => void;
//   onDelete: (id: number) => void;
//   getSubjectSuggestions: (semester: string) => string[];
//   getSemesterSuggestions?: () => string[];
//   isAnimating: boolean;
// };

// const semesters = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];


// const CustomDropdown = ({
//   value,
//   options,
//   onChange,
//   placeholder,
//   className = "",
// }: {
//   value: string;
//   options: string[];
//   onChange: (value: string) => void;
//   placeholder: string;
//   className?: string;
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className={`relative ${className}`} ref={dropdownRef}>
//       <button
//         type="button"
//         onClick={() => setIsOpen(!isOpen)}
//         className="w-full px-4 py-3 bg-gray-900/80 border border-purple-500/20 text-white rounded-xl 
//                    focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none 
//                    hover:border-purple-400/40 hover:bg-gray-800/80 transition-all duration-300
//                    flex items-center justify-between backdrop-blur-sm"
//       >
//         <span className={value ? "text-white" : "text-gray-400"}>
//           {value || placeholder}
//         </span>
//         <ChevronDown
//           size={16}
//           className={`text-purple-400 transition-transform duration-200 ${
//             isOpen ? "rotate-180" : ""
//           }`}
//         />
//       </button>

//       {isOpen && (
//         <div className="absolute z-50 w-full mt-2 bg-gray-900/95 border border-purple-500/30 rounded-xl shadow-2xl backdrop-blur-xl max-h-48 overflow-y-auto">
//           {options.map((option) => (
//             <button
//               key={option}
//               type="button"
//               onClick={() => {
//                 onChange(option);
//                 setIsOpen(false);
//               }}
//               className="w-full px-4 py-3 text-left text-white hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-cyan-500/20 
//                          flex items-center justify-between group transition-all duration-200 first:rounded-t-xl last:rounded-b-xl"
//             >
//               <span>{option}</span>
//               {value === option && <Check size={16} className="text-cyan-400" />}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default function ActivitiesTable({
//   activities,
//   onUpdate,
//   onDelete,
//   getSubjectSuggestions,
//   getSemesterSuggestions,
//   isAnimating,
// }: Props) {
//   const getDifficultyColor = (difficulty: string) => {
//     switch (difficulty) {
//       case "easy":
//         return "text-green-400 bg-green-500/20 border-green-500/30";
//       case "medium":
//         return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
//       case "hard":
//         return "text-red-400 bg-red-500/20 border-red-500/30";
//       default:
//         return "text-gray-400 bg-gray-500/20 border-gray-500/30";
//     }
//   };

//   const getCategoryIcon = (category: string) => {
//     switch (category) {
//       case "assessment":
//         return <BookOpen size={14} className="text-cyan-400" />;
//       case "practical":
//         return <Star size={14} className="text-purple-400" />;
//       case "project":
//         return <BookMarked size={14} className="text-green-400" />;
//       case "duty":
//         return <Calendar size={14} className="text-orange-400" />;
//       default:
//         return <BookOpen size={14} className="text-gray-400" />;
//     }
//   };

//   const handleSemesterChange = (activityId: number, semester: string) => {
//     onUpdate(activityId, "semester", semester);
//     onUpdate(activityId, "subject", ""); // reset subject
//   };

//   return (
//     <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl border border-purple-500/20 shadow-2xl rounded-2xl overflow-hidden">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 p-6 relative overflow-hidden">
//         <div className="relative z-10 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
//               <BookOpen className="text-white" size={28} />
//             </div>
//             <div>
//               <h3 className="text-2xl font-bold text-white drop-shadow-sm">Activity Portfolio</h3>
//               <p className="text-white/90 text-sm">
//                 {activities.filter((a) => a.count > 0).length} active activities • {activities.length} total configured
//               </p>
//             </div>
//           </div>
//           <div className="text-right">
//             <div className="text-3xl font-bold text-white drop-shadow-sm">
//               ₹{activities.reduce((sum, a) => sum + a.count * a.rate, 0).toLocaleString()}
//             </div>
//             <div className="text-white/80 text-sm">Total Earnings</div>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead className="bg-gray-900/80 border-b border-purple-500/20">
//             <tr>
//               {[
//                 { label: "Activity Details", width: "w-80" },
//                 { label: "Semester", width: "w-28" },
//                 { label: "Subject", width: "w-48" },
//                 { label: "Count", width: "w-24" },
//                 { label: "Rate (₹)", width: "w-28" },
//                 { label: "Total", width: "w-32" },
//                 { label: "Actions", width: "w-20" },
//               ].map((head) => (
//                 <th
//                   key={head.label}
//                   className={`${head.width} px-6 py-4 text-left text-sm font-bold text-white tracking-wide`}
//                 >
//                   {head.label}
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           <tbody className="bg-gray-900/50 divide-y divide-purple-500/10">
//             {activities.map((activity) => (
//               <tr key={activity.id} className="group hover:bg-gradient-to-r hover:from-purple-500/5 hover:to-cyan-500/5 transition-all duration-300">
//                 {/* Activity Details */}
//                 <td className="px-6 py-5">
//                   <div className="flex items-start gap-3">
//                     <div className="flex-shrink-0 mt-1 p-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg backdrop-blur-sm">
//                       {getCategoryIcon(activity.category)}
//                     </div>
//                     <div className="min-w-0 flex-1">
//                       <div className="font-semibold text-white text-base mb-2">{activity.type}</div>
//                       <div className="flex items-center gap-3">
//                         <span className="px-3 py-1 text-xs font-medium text-purple-300 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-lg capitalize backdrop-blur-sm">
//                           {activity.category}
//                         </span>
//                         <span className={`px-3 py-1 text-xs font-medium rounded-lg capitalize border ${getDifficultyColor(activity.difficulty)} backdrop-blur-sm`}>
//                           {activity.difficulty}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </td>

//                 {/* Semester */}
//                 <td className="px-6 py-5">
//                   <CustomDropdown
//                     value={activity.semester || ""}
//                     options={semesters}
//                     onChange={(value) => handleSemesterChange(activity.id, value)}
//                     placeholder="Sem"
//                   />
//                 </td>

//                 {/* Subject */}
//                 <td className="px-6 py-5">
//                   <CustomDropdown
//                     value={activity.subject}
//                     options={getSubjectSuggestions(activity.semester)}
//                     onChange={(value) => onUpdate(activity.id, "subject", value)}
//                     placeholder="Select subject..."
//                   />
//                 </td>

//                 {/* Count */}
//                 <td className="px-6 py-5">
//                   {/* <input
//                     type="number"
//                     min={0}
//                     value={activity.count || ""}
//                     onChange={(e) => onUpdate(activity.id, "count", Number(e.target.value))}
//                     className="w-full px-3 py-3 bg-gray-900/80 border border-purple-500/20 text-white rounded-xl focus:ring-2 focus:ring-purple-500 text-center font-medium"
//                   /> */}
//                   <input
//   type="number"
//   min={0}
//   value={activity.count || ''}
//   onChange={(e) => onUpdate(activity.id, 'count', e.target.value)}
//   className="w-20 p-2 border border-gray-300 rounded"
// />
//                 </td>

//                 {/* Rate */}
//                 <td className="px-6 py-5">
//                   <input
//                     type="number"
//                     min={0}
//                     value={activity.rate || ""}
//                     onChange={(e) => onUpdate(activity.id, "rate", Number(e.target.value))}
//                     className="w-full px-3 py-3 bg-gray-900/80 border border-purple-500/20 text-white rounded-xl focus:ring-2 focus:ring-purple-500 font-medium"
//                   />
//                 </td>

//                 {/* Total */}
//                 <td className="px-6 py-5 text-lg font-bold text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text">
//                   ₹{(activity.count * activity.rate).toLocaleString()}
//                 </td>

//                 {/* Actions */}
//                 <td className="px-6 py-5">
//                   <button
//                     onClick={() => onDelete(activity.id)}
//                     className="p-3 text-red-400 hover:bg-red-500/20 rounded-xl transition-all duration-300"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Empty State */}
//         {activities.length === 0 && (
//           <div className="text-center py-16 bg-gray-900/50">
//             <div className="text-6xl mb-4">📚</div>
//             <div className="text-white text-lg font-semibold mb-2">No Activities Yet</div>
//             <div className="text-gray-400 text-sm">Add your first activity to get started</div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


//best - till - now - changes - may - be -apply - later

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Activity } from '../types/activity';
import { BookOpen, Trash2, Star, Calendar, BookMarked, ChevronDown, Check } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

type Props = {
  activities: Activity[];
  onUpdate: (id: number, field: keyof Activity, value: any) => void;
  onDelete: (id: number) => void;
  getSubjectSuggestions: (semester: string) => string[];
  getSemesterSuggestions?: () => string[];
  isAnimating: boolean;
};

const semesters = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

const CustomDropdown = ({
  value,
  options,
  onChange,
  placeholder,
  className = "",
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-gray-900/80 border border-purple-500/20 text-white rounded-xl 
                   focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none 
                   hover:border-purple-400/40 hover:bg-gray-800/80 transition-all duration-300
                   flex items-center justify-between backdrop-blur-sm"
      >
        <span className={value ? "text-white" : "text-gray-400"}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-purple-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <ScrollArea className="absolute z-50 w-full mt-2 h-48 bg-gray-900/95 border border-purple-500/30 rounded-xl shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-white hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-cyan-500/20 
                           flex items-center justify-between group transition-all duration-200 first:rounded-t-xl last:rounded-b-xl"
              >
                <span>{option}</span>
                {value === option && <Check size={16} className="text-cyan-400" />}
              </button>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default function ActivitiesTable({
  activities,
  onUpdate,
  onDelete,
  getSubjectSuggestions,
  getSemesterSuggestions,
  isAnimating,
}: Props) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-400 bg-green-500/20 border-green-500/30";
      case "medium": return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      case "hard": return "text-red-400 bg-red-500/20 border-red-500/30";
      default: return "text-gray-400 bg-gray-500/20 border-gray-500/30";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "assessment": return <BookOpen size={14} className="text-cyan-400" />;
      case "practical": return <Star size={14} className="text-purple-400" />;
      case "project": return <BookMarked size={14} className="text-green-400" />;
      case "duty": return <Calendar size={14} className="text-orange-400" />;
      default: return <BookOpen size={14} className="text-gray-400" />;
    }
  };

  const handleSemesterChange = (activityId: number, semester: string) => {
    onUpdate(activityId, "semester", semester);
    onUpdate(activityId, "subject", ""); // reset subject
  };

  return (
    <div className="bg-gradient-to-br shadow-[0_0_20px_rgba(139,92,246,0.15)] from-gray-900/95 to-gray-800/95 backdrop-blur-xl border border-purple-500/20  rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B0B0B] via-[#3B0764] to-[#0B0B0B] p-6 relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <BookOpen className="text-white" size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white drop-shadow-sm">Activity Portfolio</h3>
              <p className="text-white/90 text-sm">
                {activities.filter((a) => a.count > 0).length} active activities • {activities.length} total configured
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white drop-shadow-sm">
              ₹{activities.reduce((sum, a) => sum + a.count * a.rate, 0).toLocaleString()}
            </div>
            <div className="text-white/80 text-sm">Total Earnings</div>
          </div>
        </div>
      </div>

      {/* Table with ScrollArea */}
      <ScrollArea className="h-[450px]">
        <table className="w-full">
          <thead className="bg-gray-900/80 border-b border-purple-500/20">
            <tr>
              {[
                { label: "Activity Details", width: "w-80" },
                { label: "Semester", width: "w-28" },
                { label: "Subject", width: "w-48" },
                { label: "Count", width: "w-24" },
                { label: "Rate (₹)", width: "w-28" },
                { label: "Total", width: "w-32" },
                { label: "Actions", width: "w-20" },
              ].map((head) => (
                <th key={head.label} className={`${head.width} px-6 py-4 text-left text-sm font-bold text-white tracking-wide`}>
                  {head.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-gray-900/50 divide-y divide-purple-500/10">
            {activities.map((activity) => (
              <tr key={activity.id} className="group hover:bg-gradient-to-r hover:from-purple-500/5 hover:to-cyan-500/5 transition-all duration-300">
                {/* Activity Details */}
                <td className="px-6 py-5">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1 p-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg backdrop-blur-sm">
                      {getCategoryIcon(activity.category)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-white text-base mb-2">{activity.type}</div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 text-xs font-medium text-purple-300 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-lg capitalize backdrop-blur-sm">
                          {activity.category}
                        </span>
                        <span className={`px-3 py-1 text-xs font-medium rounded-lg capitalize border ${getDifficultyColor(activity.difficulty)} backdrop-blur-sm`}>
                          {activity.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Semester */}
                <td className="px-6 py-5">
                  <CustomDropdown
                    value={activity.semester || ""}
                    options={semesters}
                    onChange={(value) => handleSemesterChange(activity.id, value)}
                    placeholder="Sem"
                  />
                </td>

                {/* Subject */}
                <td className="px-6 py-5">
                  <CustomDropdown
                    value={activity.subject}
                    options={getSubjectSuggestions(activity.semester)}
                    onChange={(value) => onUpdate(activity.id, "subject", value)}
                    placeholder="Select subject..."
                  />
                </td>

                {/* Count */}
                <td className="px-6 py-5">
                  <input
                    type="number"
                    min={0}
                    value={activity.count || ''}
                    onChange={(e) => onUpdate(activity.id, 'count', e.target.value)}
                    className="w-20 p-2 border border-gray-300 rounded text-white bg-gray-900/80"
                  />
                </td>

                {/* Rate */}
                <td className="px-6 py-5">
                  <input
                    type="number"
                    min={0}
                    value={activity.rate || ""}
                    onChange={(e) => onUpdate(activity.id, "rate", Number(e.target.value))}
                    className="w-full px-3 py-3 bg-gray-900/80 border border-purple-500/20 text-white rounded-xl focus:ring-2 focus:ring-purple-500 font-medium"
                  />
                </td>

                {/* Total */}
                <td className="px-6 py-5 text-lg font-bold text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text">
                  ₹{(activity.count * activity.rate).toLocaleString()}
                </td>

                {/* Actions */}
                <td className="px-6 py-5">
                  <button
                    onClick={() => onDelete(activity.id)}
                    className="p-3 text-red-400 hover:bg-red-500/20 rounded-xl transition-all duration-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {activities.length === 0 && (
          <div className="text-center py-16 bg-gray-900/50">
            <div className="text-6xl mb-4">📚</div>
            <div className="text-white text-lg font-semibold mb-2">No Activities Yet</div>
            <div className="text-gray-400 text-sm">Add your first activity to get started</div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
