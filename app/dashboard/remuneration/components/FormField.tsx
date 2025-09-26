
'use client';
import React from 'react';
import { FacultyInfo } from '../types/faculty';
import { FormField as FormFieldType } from '../utils/formConfig';

interface FormFieldProps {
  field: FormFieldType;
  facultyInfo: FacultyInfo;
  onChange: (patch: Partial<FacultyInfo>) => void;
}

export default function FormField({ field, facultyInfo, onChange }: FormFieldProps) {
  const baseClasses = "w-full pl-10 pr-4 py-3 bg-[#111111] border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all duration-200 hover:border-gray-600";
  const datePickerClasses = "w-full pl-10 pr-4 py-3 bg-[#111111] border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all duration-200 hover:border-gray-600 cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:invert";
  
  // Handle Select Fields
  if (field.type === 'select') {
    // Get options from field.options or suggestions
    let options = [...(field.options || [])];
    if (field.suggestions) {
      const suggestionOptions = field.suggestions();
      // Combine default options with suggestions, removing duplicates
      options = [...new Set([...options, ...suggestionOptions])];
    }

    return (
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
          {field.icon}
        </div>
        <select
          value={facultyInfo[field.key]}
          onChange={(e) => onChange({ [field.key]: e.target.value })}
          className={baseClasses + " appearance-none cursor-pointer"}
          required={field.required}
        >
          <option value="" className="bg-[#111111] text-gray-400">
            Select {field.label}
          </option>
          {options.map((option: string) => (
            <option key={option} value={option} className="bg-[#111111] text-white">
              {option}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  }

  // Handle Date Fields
  if (field.type === 'date') {
    return (
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
          {field.icon}
        </div>
        <input
          type="date"
          value={facultyInfo[field.key]}
          onChange={(e) => onChange({ [field.key]: e.target.value })}
          className={datePickerClasses}
          required={field.required}
        />
      </div>
    );
  }

  // Handle Text Fields
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {field.icon}
      </div>
      <input
        type={field.type}
        value={facultyInfo[field.key]}
        onChange={(e) => onChange({ [field.key]: e.target.value })}
        className={baseClasses + " placeholder-[#9D9D9D]"}
        placeholder={field.placeholder}
        required={field.required}
      />
    </div>
  );
}