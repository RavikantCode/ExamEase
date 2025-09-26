// // app/dashboard/remuneration/types/faculty.ts
// export interface FacultyInfo {
//     name: string;
//     employeeId: string;
//     department: string;
//     date: string;
//     examination: string;
//     scheme: string;
//     branch: string;
//     semester: string;
//     class: string;
//   }
  
//   export const defaultFacultyInfo: FacultyInfo = {
//     name: '',
//     employeeId: '',
//     department: 'Computer Engineering',
//     date: new Date().toISOString().split('T')[0],
//     examination: '1st Half',
//     scheme: 'C-Scheme(R-19)',
//     branch: 'COMP',
//     semester: 'I',
//     class: 'FE'
//   };
  
//==================================CORRECT======================================
// export interface FacultyInfo {
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

// export const defaultFacultyInfo: FacultyInfo = {
//   name: '',
//   employeeId: '',
//   department: 'Computer Engineering',
//   date: new Date().toISOString().split('T')[0],
//   examination: '1st Half',
//   scheme: 'C-Scheme(R-19)',
//   branch: 'COMP',
//   semester: 'I',
//   class: 'FE'
// };

// // Helper functions for suggestions
// export const getExaminationOptions = (): string[] => [
//   '1st Half',
//   '2nd Half', 
// ];

// export const getSchemeOptions = (): string[] => [
//   'C-Scheme(R-19)',
//   'G-Scheme(R-22)',
// ];

// export const getSemesterOptions = (): string[] => [
//   'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'
// ];

// export const getClassOptions = (): string[] => [
//   'FE', 'SE', 'TE', 'BE'
// ];


export interface FacultyInfo {
  name: string;
  employeeId: string;
  department: string;
  branch: string;
  examination: string;
  scheme: string;
  semester: string;
  class: string;
  date: string;
}

export interface FacultyFormProps {
  facultyInfo: FacultyInfo;
  onChange: (patch: Partial<FacultyInfo>) => void;
  getExaminationSuggestions?: () => string[];
  getSchemeSuggestions?: () => string[];
  getSemesterSuggestions?: () => string[];
  getClassSuggestions?: () => string[];
}