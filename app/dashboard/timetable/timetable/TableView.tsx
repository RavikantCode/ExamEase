// 'use client';

// import React from 'react';

// interface TimetableViewProps {
//   generatedTimetable: any; // can create proper type from types.ts
// }

// const TimetableView: React.FC<TimetableViewProps> = ({ generatedTimetable }) => {
//   return (
//     <>
//       {Object.entries(generatedTimetable.schedule).map(([date, daySchedule]) => (
//         <div key={date} className="mb-6">
//           <h3 className="text-lg font-semibold mb-3 text-blue-700">
//             {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
//           </h3>
//           <div className="grid gap-4">
//             {generatedTimetable.timeSlots.map((slot:any) => (
//               <div key={slot.startTime} className="border rounded-lg p-4">
//                 <h4 className="font-medium mb-2 text-gray-700">{slot.startTime} - {slot.endTime}</h4>
//                 <div className="grid gap-2">
//                   {daySchedule[slot.startTime]?.length > 0 ? (
//                     daySchedule[slot.startTime].map((exam: any, index: number) => (
//                       <div key={index} className="bg-gray-50 p-3 rounded border-l-4 border-blue-400">
//                         <div className="font-medium">{exam.course.code} - {exam.course.name}</div>
//                         <div className="text-sm text-gray-600">
//                           Room: {exam.room.name} | Teacher: {exam.teacher.name} | Students: {exam.course.students}
//                         </div>
//                         <div className="text-xs text-gray-500">{exam.course.semester} - {exam.course.subject}</div>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="text-gray-400 text-center py-2">No exams scheduled</div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//     </>
//   );
// };

// export default TimetableView;


'use client';

import React from 'react';
import { GeneratedTimetable, ExamAssignment } from '../utils/types';

interface TimetableViewProps {
  timetable: GeneratedTimetable;
}

const TimetableView: React.FC<TimetableViewProps> = ({ timetable }) => {
  return (
    <>
      {Object.entries(timetable.schedule).map(([date, daySchedule]) => (
        <div key={date} className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-blue-700">
            {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </h3>
          <div className="grid gap-4">
            {timetable.timeSlots.map((slot) => (
              <div key={slot.startTime} className="border rounded-lg p-4">
                <h4 className="font-medium mb-2 text-gray-700">{slot.startTime} - {slot.endTime}</h4>
                <div className="grid gap-2">
                  {daySchedule[`${slot.startTime}-${slot.endTime}`]?.length > 0 ? (
                    daySchedule[`${slot.startTime}-${slot.endTime}`].map((exam: ExamAssignment, index: number) => (
                      <div key={index} className="bg-gray-50 p-3 rounded border-l-4 border-blue-400">
                        <div className="font-medium">{exam.course.code} - {exam.course.name}</div>
                        <div className="text-sm text-gray-600">
                          Room: {exam.room.name} | Teacher: {exam.teacher.name} | Students: {exam.course.students}
                        </div>
                        <div className="text-xs text-gray-500">{exam.course.semester} - {exam.course.subject}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-center py-2">No exams scheduled</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default TimetableView;