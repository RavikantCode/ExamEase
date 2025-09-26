// utils/formConfig.ts
import { User, Calendar, Building, Hash, GraduationCap, BookOpen, Users, FileText } from 'lucide-react';
import { FacultyInfo } from '../types/faculty';
import { DEPARTMENTS, BRANCH_CODES, EXAMINATION_TYPES, SCHEMES, SEMESTERS, CLASSES } from '../constants/facultyOptions';

export interface FormField {
  key: keyof FacultyInfo;
  label: string;
  type: 'text' | 'select' | 'date';
  placeholder?: string;
  icon: React.ReactNode;
  required?: boolean;
  options?: readonly string[];
  suggestions?: () => string[];
}

export interface FormSection {
  title: string;
  icon: React.ReactNode;
  fields: FormField[];
}

export const createFormSections = (
  getExaminationSuggestions?: () => string[],
  getSchemeSuggestions?: () => string[],
  getSemesterSuggestions?: () => string[],
  getClassSuggestions?: () => string[]
): FormSection[] => [
  {
    title: 'Personal Information',
    icon: <User size={20} className="text-cyan-400" />,
    fields: [
      {
        key: 'name',
        label: 'Full Name',
        type: 'text',
        placeholder: 'Prof. Geetanjali Kalme',
        icon: <User size={18} className="text-gray-400" />,
        required: true
      },
      {
        key: 'employeeId',
        label: 'Employee ID',
        type: 'text',
        placeholder: 'EMP001',
        icon: <Hash size={18} className="text-gray-400" />,
        required: true
      }
    ]
  },
  {
    title: 'Academic Details',
    icon: <GraduationCap size={20} className="text-purple-400" />,
    fields: [
      {
        key: 'department',
        label: 'Department',
        type: 'select',
        icon: <Building size={18} className="text-gray-400" />,
        options: DEPARTMENTS
      },
      {
        key: 'branch',
        label: 'Branch Code',
        type: 'select',
        icon: <BookOpen size={18} className="text-gray-400" />,
        options: BRANCH_CODES
      }
    ]
  },
  {
    title: 'Examination Configuration',
    icon: <FileText size={20} className="text-green-400" />,
    fields: [
      {
        key: 'examination',
        label: 'Examination Type',
        type: 'select',
        icon: <FileText size={18} className="text-gray-400" />,
        options: EXAMINATION_TYPES,
        suggestions: getExaminationSuggestions
      },
      {
        key: 'scheme',
        label: 'Scheme',
        type: 'select',
        icon: <BookOpen size={18} className="text-gray-400" />,
        options: SCHEMES,
        suggestions: getSchemeSuggestions
      }
    ]
  },
  {
    title: 'Class Information',
    icon: <Users size={20} className="text-orange-400" />,
    fields: [
      {
        key: 'semester',
        label: 'Semester',
        type: 'select',
        icon: <GraduationCap size={18} className="text-gray-400" />,
        options: SEMESTERS,
        suggestions: getSemesterSuggestions
      },
      {
        key: 'class',
        label: 'Class',
        type: 'select',
        icon: <Users size={18} className="text-gray-400" />,
        options: CLASSES,
        suggestions: getClassSuggestions
      },
      {
        key: 'date',
        label: 'Date',
        type: 'date',
        icon: <Calendar size={18} className="text-gray-400" />,
        required: true
      }
    ]
  }
];