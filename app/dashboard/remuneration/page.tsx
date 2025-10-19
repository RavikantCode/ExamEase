// 'use client'
// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   Download, Plus, Trash2, Save, FileText, Calculator, 
//   Sparkles, Clock, TrendingUp, Award, ChevronRight,
//   User, Calendar, BookOpen, DollarSign, Zap
// } from 'lucide-react';

// // Types for better structure
// interface FacultyInfo {
//   name: string;
//   employeeId: string;
//   department: string;
//   date: string;
//   examination: string;
//   scheme: string;
//   branch: string;
//   semester: string;
//   class: string;
// }

// interface Activity {
//   id: number;
//   type: string;
//   category: 'assessment' | 'practical' | 'project' | 'duty';
//   sem: string;
//   subject: string;
//   count: number;
//   rate: number;
//   total: number;
//   isCustom: boolean;
//   difficulty: 'easy' | 'medium' | 'hard';
// }

// const RemunerationSystem = () => {
//   // State with better structure
//   const [currentStep, setCurrentStep] = useState(0);
//   const [facultyInfo, setFacultyInfo] = useState<FacultyInfo>({
//     name: '',
//     employeeId: '',
//     department: 'Computer Engineering',
//     date: new Date().toISOString().split('T')[0],
//     examination: '1st Half',
//     scheme: 'C-Scheme(R-19)',
//     branch: 'COMP',
//     semester: 'I',
//     class: 'FE'
//   });

//   const [activities, setActivities] = useState<Activity[]>([]);
//   const [grandTotal, setGrandTotal] = useState(0);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [savedDrafts, setSavedDrafts] = useState(0);
//   const [estimatedTime, setEstimatedTime] = useState(0);

//   // Creative: Smart activity templates based on common patterns
//   const activityTemplates = {
//     assessment: [
//       { type: 'Theory Paper Assessment', rate: 15, category: 'assessment', difficulty: 'medium' },
//       { type: 'Unit Test Paper Assessment', rate: 10, category: 'assessment', difficulty: 'easy' },
//       { type: 'Term Work Submission', rate: 8, category: 'assessment', difficulty: 'easy' }
//     ],
//     practical: [
//       { type: 'Practical Exam', rate: 25, category: 'practical', difficulty: 'medium' },
//       { type: 'Oral Exam', rate: 20, category: 'practical', difficulty: 'medium' },
//       { type: 'Lab Assessment', rate: 18, category: 'practical', difficulty: 'medium' }
//     ],
//     project: [
//       { type: 'Mini Project', rate: 30, category: 'project', difficulty: 'hard' },
//       { type: 'BE Project', rate: 50, category: 'project', difficulty: 'hard' },
//       { type: 'Seminar Evaluation', rate: 22, category: 'project', difficulty: 'medium' }
//     ],
//     duty: [
//       { type: 'Exam Duty', rate: 200, category: 'duty', difficulty: 'easy' },
//       { type: 'Invigilation', rate: 150, category: 'duty', difficulty: 'easy' },
//       { type: 'Paper Setting', rate: 300, category: 'duty', difficulty: 'hard' }
//     ]
//   };

//   // Creative: Smart subjects based on branch and semester
//   const subjectSuggestions = {
//     'COMP': {
//       'I': ['Basic Programming', 'Mathematics-I', 'Physics', 'Chemistry'],
//       'II': ['Data Structures', 'Mathematics-II', 'Digital Logic'],
//       'III': ['OOP', 'Database Systems', 'Computer Networks'],
//       'IV': ['Software Engineering', 'Operating Systems', 'Theory of Computation']
//     },
//     'IT': {
//       'I': ['Programming Fundamentals', 'Mathematics-I', 'Physics'],
//       'II': ['Web Technology', 'Database Management', 'Software Engineering'],
//     }
//   };

//   const steps = [
//     { title: 'Faculty Info', icon: User, description: 'Basic details' },
//     { title: 'Activities', icon: BookOpen, description: 'Add your work' },
//     { title: 'Review & Export', icon: Download, description: 'Generate report' }
//   ];

//   // Creative: Auto-calculate time estimation
//   useEffect(() => {
//     const timePerActivity = activities.reduce((acc, activity) => {
//       const difficultyMultiplier = { easy: 1, medium: 1.5, hard: 2.5 };
//       return acc + (activity.count * difficultyMultiplier[activity.difficulty] * 0.5);
//     }, 0);
//     setEstimatedTime(Math.ceil(timePerActivity));
//   }, [activities]);

//   // Creative: Smooth animations for totals
//   useEffect(() => {
//     setIsAnimating(true);
//     const timer = setTimeout(() => setIsAnimating(false), 300);
    
//     const total = activities.reduce((sum, activity) => sum + (activity.count * activity.rate), 0);
//     setGrandTotal(total);
    
//     return () => clearTimeout(timer);
//   }, [activities]);

//   // Creative: Smart activity builder
//   const addActivityFromTemplate = (template: any, category: string) => {
//     const newId = activities.length > 0 ? Math.max(...activities.map(a => a.id)) + 1 : 1;
//     const newActivity: Activity = {
//       id: newId,
//       ...template,
//       sem: facultyInfo.semester,
//       subject: '',
//       count: 0,
//       total: 0,
//       isCustom: false
//     };
//     setActivities(prev => [...prev, newActivity]);
//   };

//   // Creative: Quick-fill suggestions
//   const getSubjectSuggestions = () => {
//     return subjectSuggestions[facultyInfo.branch as keyof typeof subjectSuggestions]?.[facultyInfo.semester as keyof typeof subjectSuggestions[keyof typeof subjectSuggestions]] || [];
//   };

//   const updateActivity = (id: number, field: keyof Activity, value: any) => {
//     setActivities(prev => prev.map(activity => 
//       activity.id === id 
//         ? { 
//             ...activity, 
//             [field]: ['count', 'rate'].includes(field) ? Number(value) || 0 : value,
//             total: field === 'count' || field === 'rate' 
//               ? (field === 'count' ? Number(value) || 0 : activity.count) * 
//                 (field === 'rate' ? Number(value) || 0 : activity.rate)
//               : activity.total
//           }
//         : activity
//     ));
//   };

//   // Creative: Smart export with insights
//   const exportWithInsights = () => {
//     const insights = {
//       totalHours: estimatedTime,
//       mostCommonActivity: activities.reduce((acc, curr) => 
//         acc.count > curr.count ? acc : curr, activities[0])?.type || 'N/A',
//       averageRate: activities.length ? (grandTotal / activities.reduce((sum, a) => sum + a.count, 0)).toFixed(2) : 0,
//       productivity: grandTotal / estimatedTime || 0
//     };

//     const reportData = {
//       faculty: facultyInfo,
//       activities: activities.filter(a => a.count > 0),
//       totals: { grandTotal, insights },
//       metadata: {
//         generatedAt: new Date().toISOString(),
//         version: '2.0',
//         systemId: 'APSIT-REM-SYS'
//       }
//     };

//     // Simulate export
//     const csvContent = [
//       ['A.P. Shah Institute of Technology - Faculty Remuneration Report'],
//       [''],
//       [`Faculty: ${facultyInfo.name}`, `Date: ${facultyInfo.date}`],
//       [`Department: ${facultyInfo.department}`, `Examination: ${facultyInfo.examination}`],
//       [''],
//       ['Sr.No', 'Activity', 'Semester', 'Subject', 'Count', 'Rate', 'Total'],
//       ...activities.filter(a => a.count > 0).map((a, i) => [
//         i + 1, a.type, a.sem, a.subject, a.count, a.rate, a.total
//       ]),
//       [''],
//       ['', '', '', '', '', 'Grand Total:', grandTotal],
//       [''],
//       ['INSIGHTS'],
//       [`Estimated Hours: ${estimatedTime}h`],
//       [`Most Common Activity: ${insights.mostCommonActivity}`],
//       [`Average Rate: ₹${insights.averageRate}`],
//       [`Productivity: ₹${insights.productivity.toFixed(2)}/hour`]
//     ].map(row => row.join(',')).join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `${facultyInfo.name.replace(/\s+/g, '_')}_remuneration_${facultyInfo.date}.csv`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   // Creative: Step-by-step wizard interface
//   const renderStepContent = () => {
//     switch (currentStep) {
//       case 0:
//         return (
//           <div className="space-y-6">
//             <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
//               <h3 className="text-lg font-semibold mb-4 flex items-center text-blue-800">
//                 <User className="mr-2" size={20} />
//                 Faculty Information
//               </h3>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
//                   <input
//                     type="text"
//                     value={facultyInfo.name}
//                     onChange={(e) => setFacultyInfo(prev => ({...prev, name: e.target.value}))}
//                     className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                     placeholder="Dr. John Doe"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
//                   <input
//                     type="text"
//                     value={facultyInfo.employeeId}
//                     onChange={(e) => setFacultyInfo(prev => ({...prev, employeeId: e.target.value}))}
//                     className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                     placeholder="EMP001"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
//                   <select
//                     value={facultyInfo.department}
//                     onChange={(e) => setFacultyInfo(prev => ({...prev, department: e.target.value}))}
//                     className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   >
//                     <option value="Computer Engineering">Computer Engineering</option>
//                     <option value="Information Technology">Information Technology</option>
//                     <option value="Electronics & Telecomm">Electronics & Telecomm</option>
//                     <option value="Civil Engineering">Civil Engineering</option>
//                     <option value="Mechanical Engineering">Mechanical Engineering</option>
//                   </select>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
//                   <input
//                     type="date"
//                     value={facultyInfo.date}
//                     onChange={(e) => setFacultyInfo(prev => ({...prev, date: e.target.value}))}
//                     className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         );

//       case 1:
//         return (
//           <div className="space-y-6">
//             {/* Creative: Quick Add Templates */}
//             <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
//               <h3 className="text-lg font-semibold mb-4 flex items-center text-green-800">
//                 <Zap className="mr-2" size={20} />
//                 Quick Add Activities
//               </h3>
              
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                 {Object.entries(activityTemplates).map(([category, templates]) => (
//                   <div key={category} className="space-y-2">
//                     <h4 className="font-medium text-gray-700 capitalize">{category}</h4>
//                     {templates.map((template, idx) => (
//                       <button
//                         key={idx}
//                         onClick={() => addActivityFromTemplate(template, category)}
//                         className="w-full text-left p-2 text-sm bg-white border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all"
//                       >
//                         <div className="font-medium">{template.type}</div>
//                         <div className="text-gray-500">₹{template.rate}</div>
//                       </button>
//                     ))}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Activities Table */}
//             {activities.length > 0 && (
//               <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
//                 <div className="bg-gray-50 p-4 border-b border-gray-200">
//                   <h3 className="text-lg font-semibold flex items-center">
//                     <BookOpen className="mr-2" size={20} />
//                     Your Activities ({activities.filter(a => a.count > 0).length})
//                   </h3>
//                 </div>
                
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead className="bg-gray-100">
//                       <tr>
//                         <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Activity</th>
//                         <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Subject</th>
//                         <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Count</th>
//                         <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Rate</th>
//                         <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total</th>
//                         <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {activities.map((activity, index) => (
//                         <tr key={activity.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
//                           <td className="px-4 py-3">
//                             <div className="font-medium">{activity.type}</div>
//                             <div className="text-xs text-gray-500 capitalize">{activity.category} • {activity.difficulty}</div>
//                           </td>
//                           <td className="px-4 py-3">
//                             <input
//                               type="text"
//                               value={activity.subject}
//                               onChange={(e) => updateActivity(activity.id, 'subject', e.target.value)}
//                               className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                               placeholder="Subject name"
//                               list={`subjects-${activity.id}`}
//                             />
//                             <datalist id={`subjects-${activity.id}`}>
//                               {getSubjectSuggestions().map((subject:any) => (
//                                 <option key={subject} value={subject} />
//                               ))}
//                             </datalist>
//                           </td>
//                           <td className="px-4 py-3">
//                             <input
//                               type="number"
//                               min="0"
//                               value={activity.count || ''}
//                               onChange={(e) => updateActivity(activity.id, 'count', e.target.value)}
//                               className="w-20 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             />
//                           </td>
//                           <td className="px-4 py-3">
//                             <div className="flex items-center">
//                               <span className="text-gray-500 mr-1">₹</span>
//                               <input
//                                 type="number"
//                                 min="0"
//                                 value={activity.rate || ''}
//                                 onChange={(e) => updateActivity(activity.id, 'rate', e.target.value)}
//                                 className="w-20 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                               />
//                             </div>
//                           </td>
//                           <td className="px-4 py-3">
//                             <div className={`font-bold text-green-600 transition-all duration-300 ${isAnimating ? 'scale-110' : ''}`}>
//                               ₹{(activity.count * activity.rate).toLocaleString()}
//                             </div>
//                           </td>
//                           <td className="px-4 py-3">
//                             <button
//                               onClick={() => setActivities(prev => prev.filter(a => a.id !== activity.id))}
//                               className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
//                             >
//                               <Trash2 size={16} />
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}
//           </div>
//         );

//       case 2:
//         return (
//           <div className="space-y-6">
//             {/* Creative: Summary Dashboard */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-blue-100">Total Amount</p>
//                     <p className="text-2xl font-bold">₹{grandTotal.toLocaleString()}</p>
//                   </div>
//                   <DollarSign className="h-8 w-8 text-blue-200" />
//                 </div>
//               </div>
              
//               <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-green-100">Activities</p>
//                     <p className="text-2xl font-bold">{activities.filter(a => a.count > 0).length}</p>
//                   </div>
//                   <Award className="h-8 w-8 text-green-200" />
//                 </div>
//               </div>
              
//               <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-purple-100">Est. Hours</p>
//                     <p className="text-2xl font-bold">{estimatedTime}h</p>
//                   </div>
//                   <Clock className="h-8 w-8 text-purple-200" />
//                 </div>
//               </div>
              
//               <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-orange-100">Rate/Hour</p>
//                     <p className="text-2xl font-bold">₹{estimatedTime ? Math.round(grandTotal / estimatedTime) : 0}</p>
//                   </div>
//                   <TrendingUp className="h-8 w-8 text-orange-200" />
//                 </div>
//               </div>
//             </div>

//             {/* Export Options */}
//             <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
//               <h3 className="text-lg font-semibold mb-4 flex items-center text-indigo-800">
//                 <Sparkles className="mr-2" size={20} />
//                 Export Your Report
//               </h3>
              
//               <div className="space-y-4">
//                 <button
//                   onClick={exportWithInsights}
//                   disabled={activities.filter(a => a.count > 0).length === 0}
//                   className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
//                 >
//                   <Download size={20} />
//                   <span>Export Detailed Report with Insights</span>
//                 </button>
                
//                 <div className="text-sm text-gray-600 bg-white p-4 rounded-lg border">
//                   <p><strong>Your report will include:</strong></p>
//                   <ul className="list-disc list-inside mt-2 space-y-1">
//                     <li>Detailed breakdown of all activities</li>
//                     <li>Performance insights and analytics</li>
//                     <li>Time estimation and productivity metrics</li>
//                     <li>Ready for submission to accounts department</li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
//       <div className="max-w-7xl mx-auto p-6">
//         {/* Creative Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-800 mb-2">
//             Faculty Remuneration System
//           </h1>
//           <p className="text-gray-600">A.P. Shah Institute of Technology</p>
//           <div className="flex items-center justify-center mt-4 space-x-4 text-sm text-gray-500">
//             <div className="flex items-center">
//               <Sparkles className="mr-1" size={16} />
//               Smart & Intuitive
//             </div>
//             <div className="flex items-center">
//               <Clock className="mr-1" size={16} />
//               Quick Setup
//             </div>
//             <div className="flex items-center">
//               <TrendingUp className="mr-1" size={16} />
//               Analytics Included
//             </div>
//           </div>
//         </div>

//         {/* Creative Step Progress */}
//         <div className="mb-8">
//           <div className="flex items-center justify-center space-x-4">
//             {steps.map((step, index) => (
//               <div key={index} className="flex items-center">
//                 <div className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
//                   index === currentStep 
//                     ? 'bg-blue-500 text-white shadow-lg scale-105' 
//                     : index < currentStep
//                     ? 'bg-green-500 text-white'
//                     : 'bg-gray-200 text-gray-600'
//                 }`}>
//                   <step.icon size={20} />
//                   <div>
//                     <div className="font-medium">{step.title}</div>
//                     <div className="text-xs opacity-80">{step.description}</div>
//                   </div>
//                 </div>
//                 {index < steps.length - 1 && (
//                   <ChevronRight className="mx-2 text-gray-400" size={20} />
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
//           {renderStepContent()}
//         </div>

//         {/* Navigation */}
//         <div className="flex justify-between items-center">
//           <button
//             onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
//             disabled={currentStep === 0}
//             className="px-6 py-3 bg-gray-200 text-gray-600 rounded-xl hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Previous
//           </button>
          
//           <div className="text-sm text-gray-500">
//             Step {currentStep + 1} of {steps.length}
//           </div>
          
//           <button
//             onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
//             disabled={currentStep === steps.length - 1}
//             className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
//           >
//             <span>Next</span>
//             <ChevronRight size={16} />
//           </button>
//         </div>

//         {/* Creative: Grand Total Display */}
//         {grandTotal > 0 && (
//           <div className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-xl shadow-2xl">
//             <div className="text-sm opacity-90">Total Amount</div>
//             <div className={`text-2xl font-bold transition-all duration-300 ${isAnimating ? 'scale-110' : ''}`}>
//               ₹{grandTotal.toLocaleString()}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RemunerationSystem;
//=====================================================================================================================================================================
// // app/dashboard/remuneration/RemunerationSystem.tsx
// 'use client';
// import React from 'react';
// // import useRemuneration from './hooks/useRemuneration';
// import useRemuneration from './hooks/useRenumeration';
// // import FacultyForm from './components/FacultyForm';
// import FacultyForm from './components/FacultyForm';
// // import ActivityTemplates from './components/ActivityTemplates';
// import ActivityTemplates from './components/ActivityTemplates';
// // import ActivitiesTable from './components/ActivitiesTable';
// import ActivitiesTable from './components/ActivitiesTable';
// // import SummaryDashboard from './components/SummaryDashboard';
// import SummaryDashboard from './components/SummaryDashboard';
// // import Stepper from './components/Stepper';
// import Stepper from './components/Stepper';
// // import Navigation from './components/Navigation';
// import Navigation from './components/Navigation';
// import { activityTemplates } from './services/suggestion';

// export default function RemunerationSystem() {
//   const {
//     currentStep,
//     steps,
//     facultyInfo,
//     setFacultyPartial,
//     activities,
//     addFromTemplate,
//     updateActivity,
//     deleteActivity,
//     grandTotal,
//     isAnimating,
//     estimatedTime,
//     nextStep,
//     prevStep,
//     exportReport,
//     getSubjectSuggestions
//   } = useRemuneration();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
//       <div className="max-w-7xl mx-auto p-6">
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-800 mb-2">Faculty Remuneration System</h1>
//           <p className="text-gray-600">A.P. Shah Institute of Technology</p>
//           <div className="flex items-center justify-center mt-4 space-x-4 text-sm text-gray-500">
//             <div className="flex items-center">Smart & Intuitive</div>
//             <div className="flex items-center">Quick Setup</div>
//             <div className="flex items-center">Analytics Included</div>
//           </div>
//         </div>

//         <div className="mb-8">
//           <Stepper steps={steps} currentStep={currentStep} />
//         </div>

//         <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
//           {currentStep === 0 && (
//             <FacultyForm facultyInfo={facultyInfo} onChange={setFacultyPartial} />
//           )}
//           {currentStep === 1 && (
//             <div className="space-y-6">
//               <ActivityTemplates templates={activityTemplates} onAdd={addFromTemplate} />
//               {activities.length > 0 && (
//                 <ActivitiesTable
//                   activities={activities}
//                   onUpdate={updateActivity}
//                   onDelete={deleteActivity}
//                   getSubjectSuggestions={getSubjectSuggestions}
//                   isAnimating={isAnimating}
//                 />
//               )}
//             </div>
//           )}
//           {currentStep === 2 && (
//             <SummaryDashboard
//               grandTotal={grandTotal}
//               activitiesCount={activities.filter(a => a.count > 0).length}
//               estimatedTime={estimatedTime}
//               ratePerHour={estimatedTime ? Math.round(grandTotal / estimatedTime) : 0}
//               onExport={exportReport}
//               disabledExport={activities.filter(a => a.count > 0).length === 0}
//             />
//           )}
//         </div>

//         <Navigation
//           onPrev={prevStep}
//           onNext={nextStep}
//           currentStep={currentStep}
//           stepsLength={steps.length}
//         />

//         {grandTotal > 0 && (
//           <div className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-xl shadow-2xl">
//             <div className="text-sm opacity-90">Total Amount</div>
//             <div className={`text-2xl font-bold transition-all duration-300 ${isAnimating ? 'scale-110' : ''}`}>
//               ₹{grandTotal.toLocaleString()}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


'use client';
import React from 'react';
import useRemuneration from './hooks/useRenumeration';
import FacultyForm from './components/FacultyForm';
import ActivityTemplates from './components/ActivityTemplates';
import ActivitiesTable from './components/ActivitiesTable';
import SummaryDashboard from './components/SummaryDashboard';
import Stepper from './components/Stepper';
import Navigation from './components/Navigation';
import { activityTemplates } from './services/suggestion';

export default function RemunerationSystem() {
  const {
    currentStep,
    steps,
    facultyInfo,
    setFacultyPartial,
    activities,
    addFromTemplate,
    updateActivity,
    deleteActivity,
    grandTotal,
    isAnimating,
    estimatedTime,
    nextStep,
    prevStep,
    exportReport,
    getSubjectSuggestions
  } = useRemuneration();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-gray-950 text-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        {/* <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-white tracking-wide mb-2">
            Faculty <span className="text-purple-500">Remuneration</span> System
          </h1>
          <p className="text-gray-400">A.P. Shah Institute of Technology</p>
          <div className="flex items-center justify-center mt-4 space-x-6 text-sm text-gray-500">
            <span className="px-3 py-1 rounded-full bg-gray-800/60 border border-gray-700">Smart & Intuitive</span>
            <span className="px-3 py-1 rounded-full bg-gray-800/60 border border-gray-700">Quick Setup</span>
            <span className="px-3 py-1 rounded-full bg-gray-800/60 border border-gray-700">Analytics Included</span>
          </div>
        </div> */}
        {/* Header */}
<div className="text-center mb-10">
  <h1 className="text-4xl font-extrabold tracking-wide mb-2">
    Faculty{" "}
    <span className="relative bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
      R
    </span>
    emuneration <span className="text-white">System</span>
  </h1>
 
  <div className="flex items-center justify-center mt-4 space-x-6 text-sm text-gray-500">
    <span className="px-3 py-1 rounded-full bg-gray-800/60 border border-gray-700">Smart & Intuitive</span>
    <span className="px-3 py-1 rounded-full bg-gray-800/60 border border-gray-700">Quick Setup</span>
    <span className="px-3 py-1 rounded-full bg-gray-800/60 border border-gray-700">Analytics Included</span>
  </div>
</div>


        {/* Stepper */}
        <div className="mb-8">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>

        {/* Main Content */}
        <div className="bg-gray-900/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-800 p-8 mb-6">
          {currentStep === 0 && (
            <FacultyForm facultyInfo={facultyInfo} onChange={setFacultyPartial} />
          )}
          {currentStep === 1 && (
            <div className="space-y-6">
              <ActivityTemplates templates={activityTemplates} onAdd={addFromTemplate} />
              {activities.length > 0 && (
                <ActivitiesTable
                  activities={activities}
                  onUpdate={updateActivity}
                  onDelete={deleteActivity}
                  getSubjectSuggestions={getSubjectSuggestions}
                  isAnimating={isAnimating}
                />
              )}
            </div>
          )}
          {currentStep === 2 && (
            <SummaryDashboard
              grandTotal={grandTotal}
              activitiesCount={activities.filter(a => a.count > 0).length}
              estimatedTime={estimatedTime}
              ratePerHour={estimatedTime ? Math.round(grandTotal / estimatedTime) : 0}
              onExport={exportReport}
              disabledExport={activities.filter(a => a.count > 0).length === 0}
              facultyInfo={facultyInfo}        
              activities={activities}      
            />
          )}
        </div>

        {/* Navigation */}
        <Navigation
          onPrev={prevStep}
          onNext={nextStep}
          currentStep={currentStep}
          stepsLength={steps.length}
        />

        {/* Floating Grand Total */}
        {grandTotal > 0 && (
          <div className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-5 rounded-2xl shadow-2xl">
            <div className="text-sm opacity-80">Total Amount</div>
            <div
              className={`text-3xl font-extrabold transition-all duration-300 ${
                isAnimating ? 'scale-110' : ''
              }`}
            >
              ₹{grandTotal.toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
