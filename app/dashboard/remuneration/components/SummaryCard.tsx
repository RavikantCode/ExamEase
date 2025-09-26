// components/SummaryCard.tsx
'use client';
import React from 'react';
import { FacultyInfo } from '../types/faculty';

interface SummaryCardProps {
  facultyInfo: FacultyInfo;
}

export default function SummaryCard({ facultyInfo }: SummaryCardProps) {
  if (!facultyInfo.name) return null;

  return (
    <div className="mt-8 p-4 bg-[#111111] border border-gray-700 rounded-xl">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">
            {facultyInfo.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </span>
        </div>
        <div>
          <div className="text-white font-semibold">{facultyInfo.name}</div>
          <div className="text-[#9D9D9D] text-sm">{facultyInfo.employeeId}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <div>
          <div className="text-[#9D9D9D] text-xs uppercase tracking-wide mb-1">Department</div>
          <div className="text-white truncate">{facultyInfo.department}</div>
        </div>
        <div>
          <div className="text-[#9D9D9D] text-xs uppercase tracking-wide mb-1">Branch</div>
          <div className="text-white truncate">{facultyInfo.branch}</div>
        </div>
        <div>
          <div className="text-[#9D9D9D] text-xs uppercase tracking-wide mb-1">Examination</div>
          <div className="text-white truncate">{facultyInfo.examination}</div>
        </div>
        <div>
          <div className="text-[#9D9D9D] text-xs uppercase tracking-wide mb-1">Scheme</div>
          <div className="text-white truncate">{facultyInfo.scheme}</div>
        </div>
        <div>
          <div className="text-[#9D9D9D] text-xs uppercase tracking-wide mb-1">Semester</div>
          <div className="text-white truncate">{facultyInfo.semester}</div>
        </div>
        <div>
          <div className="text-[#9D9D9D] text-xs uppercase tracking-wide mb-1">Class</div>
          <div className="text-white truncate">{facultyInfo.class}</div>
        </div>
        <div>
          <div className="text-[#9D9D9D] text-xs uppercase tracking-wide mb-1">Date</div>
          <div className="text-white truncate">{facultyInfo.date}</div>
        </div>
      </div>
    </div>
  );
}