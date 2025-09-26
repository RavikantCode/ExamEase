// // constants/facultyOptions.ts
// export const BRANCH_CODES = [
//     'CIVIL',
//     'COMP',
//     'EXTC',
//     'IT',
//     'MECH',
//     'AIML',
//     'DS'
//   ] as const;
  
//   export const EXAMINATION_TYPES = [
//     '1st Half',
//     '2nd Half'
//   ] as const;
  
//   export const SCHEMES = [
//     'C-Scheme(R-19)',
//     'CBCGS(R-16)'
//   ] as const;
  
//   export const SEMESTERS = [
//     'I',
//     'II',
//     'III',
//     'IV',
//     'V',
//     'VI',
//     'VII',
//     'VIII'
//   ] as const;
  
//   export const CLASSES = [
//     'FE',
//     'SE',
//     'TE',
//     'BE'
//   ] as const;
  
//   export const DEPARTMENTS = [
//     'Computer Engineering',
//     'Information Technology',
//     'Electronics & Telecomm',
//     'Civil Engineering',
//     'Mechanical Engineering',
//     'Electrical Engineering',
//     'Instrumentation Engineering'
//   ] as const;


// constants/facultyOptions.ts
import { FacultyInfo } from '../types/faculty';

export const BRANCH_CODES = [
  'CIVIL',
  'COMP',
  'EXTC',
  'IT',
  'MECH',
  'AIML',
  'DS'
] as const;

export const EXAMINATION_TYPES = [
  '1st Half',
  '2nd Half'
] as const;

export const SCHEMES = [
  'C-Scheme(R-19)',
  'CBCGS(R-16)'
] as const;

export const SEMESTERS = [
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII'
] as const;

export const CLASSES = [
  'FE',
  'SE',
  'TE',
  'BE'
] as const;

export const DEPARTMENTS = [
  'Computer Engineering',
  'Information Technology',
  'Electronics & Telecomm',
  'Civil Engineering',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Instrumentation Engineering'
] as const;

// Default faculty info object
export const defaultFacultyInfo: FacultyInfo = {
  name: '',
  employeeId: '',
  department: '',
  branch: '',
  examination: '',
  scheme: '',
  semester: '',
  class: '',
  date: ''
};

// Getter functions for dropdown options
export const getExaminationOptions = (): string[] => [...EXAMINATION_TYPES];
export const getSchemeOptions = (): string[] => [...SCHEMES];
export const getSemesterOptions = (): string[] => [...SEMESTERS];
export const getClassOptions = (): string[] => [...CLASSES];
export const getBranchOptions = (): string[] => [...BRANCH_CODES];
export const getDepartmentOptions = (): string[] => [...DEPARTMENTS];