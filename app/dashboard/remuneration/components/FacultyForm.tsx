
'use client';
import React from 'react';
import { User } from 'lucide-react';
import { FacultyFormProps } from '../types/faculty';
import { createFormSections } from '../utils/formConfig';
import FormField from './FormField';
import SummaryCard from './SummaryCard';

export default function FacultyForm({ 
  facultyInfo, 
  onChange,
  getExaminationSuggestions,
  getSchemeSuggestions,
  getSemesterSuggestions,
  getClassSuggestions
}: FacultyFormProps) {

  const formSections = createFormSections(
    getExaminationSuggestions,
    getSchemeSuggestions,
    getSemesterSuggestions,
    getClassSuggestions
  );
  // from-[#8B5CF6] via-[#3B0764] to-[#0B0B0B] this was the original color of header to use 
  return (
    <div className="bg-[#000000] shadow-[0_0_20px_rgba(139,92,246,0.15)] backdrop-blur-xl border border-gray-800  rounded-2xl overflow-hidden">
      
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#0B0B0B] via-[#3B0764] to-[#0B0B0B] p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-400/20 rounded-xl">
            <User className="text-cyan-400" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Faculty Information</h3>
            <p className="text-cyan-100 text-sm">
              Configure your profile and examination details
            </p>
          </div>
        </div>
      </div>

      {/* Form Content Section */}
      <div className="p-6 bg-[#000000] space-y-8">
        {formSections.map((section) => (
          <div key={section.title} className="space-y-4">
            
            {/* Section Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-gray-800">
              {section.icon}
              <h4 className="text-lg font-semibold text-white">{section.title}</h4>
            </div>

            {/* Section Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <label className="block text-sm font-medium text-white">
                    {field.label}
                    {field.required && (
                      <span className="text-red-400 ml-1">*</span>
                    )}
                  </label>
                  <FormField 
                    field={field} 
                    facultyInfo={facultyInfo} 
                    onChange={onChange} 
                  />
                  {field.key === 'name' && facultyInfo.name && (
                    <div className="text-xs text-[#9D9D9D] mt-1">
                      Welcome, {facultyInfo.name.split(' ')[0]}! 👋
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Summary Card Section */}
        <SummaryCard facultyInfo={facultyInfo} />
      </div>
    </div>
  );
}