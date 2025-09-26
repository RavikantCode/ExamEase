'use client';

import React from 'react';
import { Course } from '../utils/types';

interface UnscheduledCoursesProps {
  unscheduled: Course[]; 
}

const UnscheduledCourses: React.FC<UnscheduledCoursesProps> = ({ unscheduled }) => {
  if (unscheduled.length === 0) return null;

  return (
    <div className="mt-6 p-4 bg-red-50 rounded-lg">
      <h3 className="text-lg font-semibold text-red-700 mb-2">Unscheduled Courses</h3>
      <div className="space-y-2">
        {unscheduled.map((course, index) => (
          <div key={index} className="text-sm text-red-600">
            {course.code} - {course.name} ({course.students} students)
          </div>
        ))}
      </div>
      <p className="text-sm text-red-600 mt-2">
        These courses couldn't be scheduled due to capacity or teacher availability constraints.
      </p>
    </div>
  );
};

export default UnscheduledCourses;
