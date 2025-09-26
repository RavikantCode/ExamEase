// // app/dashboard/remuneration/hooks/useRemuneration.tsx
// 'use client';
// import { useState, useEffect } from 'react';
// import { Activity } from '../types/activity';
// import { FacultyInfo, defaultFacultyInfo } from '../types/faculty';
// import * as calc from '../services/calculations';
// // import * as suggestions from '../services/suggestions';
// import * as suggestions from '../services/suggestion'
// import { exportWithInsights } from '../services/exporter';

// export default function useRemuneration() {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [facultyInfo, setFacultyInfo] = useState<FacultyInfo>(defaultFacultyInfo);
//   const [activities, setActivities] = useState<Activity[]>([]);
//   const [grandTotal, setGrandTotal] = useState(0);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [estimatedTime, setEstimatedTime] = useState(0);

//   useEffect(() => {
//     const t = calc.calculateEstimatedTime(activities);
//     setEstimatedTime(t);
//   }, [activities]);

//   useEffect(() => {
//     setIsAnimating(true);
//     const timer = setTimeout(() => setIsAnimating(false), 300);
//     const total = calc.calculateGrandTotal(activities);
//     setGrandTotal(total);
//     return () => clearTimeout(timer);
//   }, [activities]);

//   const setFacultyPartial = (patch: Partial<FacultyInfo>) => {
//     setFacultyInfo(prev => ({ ...prev, ...patch }));
//   };

//   const addFromTemplate = (template: any) => {
//     setActivities(prev => calc.addActivityFromTemplate(prev, template, facultyInfo.semester));
//   };

//   const updateActivity = (id: number, field: keyof Activity, value: any) => {
//     setActivities(prev => calc.updateActivityArray(prev, id, field, value));
//   };

//   const deleteActivity = (id: number) => {
//     setActivities(prev => prev.filter(a => a.id !== id));
//   };

//   const nextStep = () => setCurrentStep(s => Math.min(s + 1, suggestions.steps.length - 1));
//   const prevStep = () => setCurrentStep(s => Math.max(s - 1, 0));

//   const exportReport = () => {
//     exportWithInsights(facultyInfo, activities.filter(a => a.count > 0), grandTotal, estimatedTime);
//   };

//   const getSubjectSuggestions = () => {
//     const branch = facultyInfo.branch as keyof typeof suggestions.subjectSuggestions;
//     const semester = facultyInfo.semester as keyof (typeof suggestions.subjectSuggestions)[keyof typeof suggestions.subjectSuggestions];
//     return suggestions.subjectSuggestions[branch]?.[semester] || [];
//   };

//   return {
//     currentStep,
//     steps: suggestions.steps,
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
//   };
// }

//================================================correct ===========================================================

// // app/dashboard/remuneration/hooks/useRemuneration.tsx
// 'use client';
// import { useState, useEffect } from 'react';
// import { Activity } from '../types/activity';
// // import { FacultyInfo, defaultFacultyInfo, getExaminationOptions, getSchemeOptions, getSemesterOptions, getClassOptions } from '../types/faculty';
// import { FacultyInfo} from '../types/faculty';
// import {defaultFacultyInfo, getExaminationOptions, getSchemeOptions, getSemesterOptions, getClassOptions } from '../constants/facultyOptions'
// import * as calc from '../services/calculations';
// import * as suggestions from '../services/suggestion';
// import { exportWithInsights } from '../services/exporter';

// export default function useRemuneration() {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [facultyInfo, setFacultyInfo] = useState<FacultyInfo>(defaultFacultyInfo);
//   const [activities, setActivities] = useState<Activity[]>([]);
//   const [grandTotal, setGrandTotal] = useState(0);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [estimatedTime, setEstimatedTime] = useState(0);
//   const [insights, setInsights] = useState<any>(null);

//   useEffect(() => {
//     const t = calc.calculateEstimatedTime(activities);
//     setEstimatedTime(t);
//   }, [activities]);

//   useEffect(() => {
//     setIsAnimating(true);
//     const timer = setTimeout(() => setIsAnimating(false), 300);
//     const total = calc.calculateGrandTotal(activities);
//     setGrandTotal(total);
    
//     // Calculate insights for enhanced analytics
//     const calculatedInsights = calc.calculateInsights(activities, total, estimatedTime);
//     setInsights(calculatedInsights);
    
//     return () => clearTimeout(timer);
//   }, [activities, estimatedTime]);

//   const setFacultyPartial = (patch: Partial<FacultyInfo>) => {
//     setFacultyInfo(prev => ({ ...prev, ...patch }));
//   };

//   const addFromTemplate = (template: any) => {
//     setActivities(prev => calc.addActivityFromTemplate(
//       prev, 
//       template, 
//       facultyInfo.semester,
//       facultyInfo.examination,
//       facultyInfo.scheme,
//       facultyInfo.class
//     ));
//   };

//   const addCustomActivity = (
//     type: string,
//     category: Activity['category'],
//     difficulty: Activity['difficulty'],
//     rate: number
//   ) => {
//     setActivities(prev => calc.createCustomActivity(
//       prev,
//       type,
//       category,
//       difficulty,
//       rate,
//       facultyInfo.semester,
//       facultyInfo.examination,
//       facultyInfo.scheme,
//       facultyInfo.class
//     ));
//   };

//   const updateActivity = (id: number, field: keyof Activity, value: any) => {
//     setActivities(prev => calc.updateActivityArray(prev, id, field, value));
//   };

//   const deleteActivity = (id: number) => {
//     setActivities(prev => prev.filter(a => a.id !== id));
//   };

//   const nextStep = () => setCurrentStep(s => Math.min(s + 1, suggestions.steps.length - 1));
//   const prevStep = () => setCurrentStep(s => Math.max(s - 1, 0));

//   const exportReport = () => {
//     exportWithInsights(facultyInfo, activities.filter(a => a.count > 0), grandTotal, estimatedTime);
//   };

//   // Enhanced suggestion functions
//   const getSubjectSuggestions = () => {
//     const branch = facultyInfo.branch as keyof typeof suggestions.subjectSuggestions;
//     const semester = facultyInfo.semester as keyof (typeof suggestions.subjectSuggestions)[keyof typeof suggestions.subjectSuggestions];
//     return suggestions.subjectSuggestions[branch]?.[semester] || [];
//   };

//   const getSemesterSuggestions = () => {
//     return getSemesterOptions();
//   };

//   const getExaminationSuggestions = () => {
//     return getExaminationOptions();
//   };

//   const getSchemeSuggestions = () => {
//     return getSchemeOptions();
//   };

//   const getClassSuggestions = () => {
//     return getClassOptions();
//   };

//   // Analytics functions
//   const getSemesterWiseSummary = () => {
//     return calc.getSemesterWiseSummary(activities);
//   };

//   const getActivityEfficiencyScore = (activity: Activity) => {
//     return calc.getActivityEfficiencyScore(activity);
//   };

//   // Bulk operations
//   const clearAllActivities = () => {
//     setActivities([]);
//   };

//   const duplicateActivity = (id: number) => {
//     const activity = activities.find(a => a.id === id);
//     if (activity) {
//       const newActivity = {
//         ...activity,
//         id: Math.max(...activities.map(a => a.id)) + 1,
//         count: 0,
//         total: 0,
//         subject: `${activity.subject} (Copy)`
//       };
//       setActivities(prev => [...prev, newActivity]);
//     }
//   };

//   const resetActivityCounts = () => {
//     setActivities(prev => prev.map(a => ({ ...a, count: 0, total: 0 })));
//   };

//   return {
//     // Step management
//     currentStep,
//     steps: suggestions.steps,
//     nextStep,
//     prevStep,
    
//     // Faculty info
//     facultyInfo,
//     setFacultyPartial,
    
//     // Activities management
//     activities,
//     addFromTemplate,
//     addCustomActivity,
//     updateActivity,
//     deleteActivity,
//     clearAllActivities,
//     duplicateActivity,
//     resetActivityCounts,
    
//     // Calculations
//     grandTotal,
//     isAnimating,
//     estimatedTime,
//     insights,
    
//     // Export
//     exportReport,
    
//     // Suggestions
//     getSubjectSuggestions,
//     getSemesterSuggestions,
//     getExaminationSuggestions,
//     getSchemeSuggestions,
//     getClassSuggestions,
    
//     // Analytics
//     getSemesterWiseSummary,
//     getActivityEfficiencyScore
//   };
// }


// app/dashboard/remuneration/hooks/useRemuneration.tsx
'use client';
import { useState, useEffect } from 'react';
import { Activity } from '../types/activity';
import { FacultyInfo} from '../types/faculty';
import {defaultFacultyInfo, getExaminationOptions, getSchemeOptions, getSemesterOptions, getClassOptions } from '../constants/facultyOptions'
import * as calc from '../services/calculations';
import * as suggestions from '../services/suggestion';
import { exportWithInsights } from '../services/exporter';

export default function useRemuneration() {
  const [currentStep, setCurrentStep] = useState(0);
  const [facultyInfo, setFacultyInfo] = useState<FacultyInfo>(defaultFacultyInfo);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [insights, setInsights] = useState<any>(null);

  // Sync activities with faculty info changes (semester, examination, scheme, class)

  useEffect(() => {
    const t = calc.calculateEstimatedTime(activities);
    setEstimatedTime(t);
  }, [activities]);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    const total = calc.calculateGrandTotal(activities);
    setGrandTotal(total);
    
    // Calculate insights for enhanced analytics
    const calculatedInsights = calc.calculateInsights(activities, total, estimatedTime);
    setInsights(calculatedInsights);
    
    return () => clearTimeout(timer);
  }, [activities, estimatedTime]);

  const setFacultyPartial = (patch: Partial<FacultyInfo>) => {
    setFacultyInfo(prev => ({ ...prev, ...patch }));
  };

  const addFromTemplate = (template: any) => {
    setActivities(prev => calc.addActivityFromTemplate(
      prev, 
      template, 
      facultyInfo.semester,
      facultyInfo.examination,
      facultyInfo.scheme,
      facultyInfo.class
    ));
  };

  const addCustomActivity = (
    type: string,
    category: Activity['category'],
    difficulty: Activity['difficulty'],
    rate: number
  ) => {
    setActivities(prev => calc.createCustomActivity(
      prev,
      type,
      category,
      difficulty,
      rate,
      facultyInfo.semester,
      facultyInfo.examination,
      facultyInfo.scheme,
      facultyInfo.class
    ));
  };

  const updateActivity = (id: number, field: keyof Activity, value: any) => {
    setActivities(prev => calc.updateActivityArray(prev, id, field, value));
  };

  const deleteActivity = (id: number) => {
    setActivities(prev => prev.filter(a => a.id !== id));
  };

  const nextStep = () => setCurrentStep(s => Math.min(s + 1, suggestions.steps.length - 1));
  const prevStep = () => setCurrentStep(s => Math.max(s - 1, 0));

  const exportReport = () => {
    exportWithInsights(facultyInfo, activities.filter(a => a.count > 0), grandTotal, estimatedTime);
  };

  // Enhanced suggestion functions
  const getSubjectSuggestions = () => {
    const branch = facultyInfo.branch as keyof typeof suggestions.subjectSuggestions;
    const semester = facultyInfo.semester as keyof (typeof suggestions.subjectSuggestions)[keyof typeof suggestions.subjectSuggestions];
    return suggestions.subjectSuggestions[branch]?.[semester] || [];
  };

  const getSemesterSuggestions = () => {
    return getSemesterOptions();
  };

  const getExaminationSuggestions = () => {
    return getExaminationOptions();
  };

  const getSchemeSuggestions = () => {
    return getSchemeOptions();
  };

  const getClassSuggestions = () => {
    return getClassOptions();
  };

  // Analytics functions
  const getSemesterWiseSummary = () => {
    return calc.getSemesterWiseSummary(activities);
  };

  const getActivityEfficiencyScore = (activity: Activity) => {
    return calc.getActivityEfficiencyScore(activity);
  };

  // Bulk operations
  const clearAllActivities = () => {
    setActivities([]);
  };

  const duplicateActivity = (id: number) => {
    const activity = activities.find(a => a.id === id);
    if (activity) {
      const newActivity = {
        ...activity,
        id: Math.max(...activities.map(a => a.id)) + 1,
        count: 0,
        total: 0,
        subject: `${activity.subject} (Copy)`,
        // Ensure new activity has current faculty info
        semester: facultyInfo.semester,
        examination: facultyInfo.examination,
        scheme: facultyInfo.scheme,
        class: facultyInfo.class
      };
      setActivities(prev => [...prev, newActivity]);
    }
  };

  const resetActivityCounts = () => {
    setActivities(prev => prev.map(a => ({ 
      ...a, 
      count: 0, 
      total: 0,
      // Maintain current faculty context
      semester: facultyInfo.semester,
      examination: facultyInfo.examination,
      scheme: facultyInfo.scheme,
      class: facultyInfo.class
    })));
  };

  // New function to get current faculty context for activity tables
  const getFacultyContext = () => ({
    semester: facultyInfo.semester,
    examination: facultyInfo.examination,
    scheme: facultyInfo.scheme,
    class: facultyInfo.class,
    branch: facultyInfo.branch,
    department: facultyInfo.department
  });

  // Function to filter activities by current semester
  const getActivitiesForCurrentSemester = () => {
    return activities.filter(activity => activity.semester === facultyInfo.semester);
  };

  return {
    // Step management
    currentStep,
    steps: suggestions.steps,
    nextStep,
    prevStep,
    
    // Faculty info
    facultyInfo,
    setFacultyPartial,
    getFacultyContext,
    
    // Activities management
    activities,
    addFromTemplate,
    addCustomActivity,
    updateActivity,
    deleteActivity,
    clearAllActivities,
    duplicateActivity,
    resetActivityCounts,
    getActivitiesForCurrentSemester,
    
    // Calculations
    grandTotal,
    isAnimating,
    estimatedTime,
    insights,
    
    // Export
    exportReport,
    
    // Suggestions
    getSubjectSuggestions,
    getSemesterSuggestions,
    getExaminationSuggestions,
    getSchemeSuggestions,
    getClassSuggestions,
    
    // Analytics
    getSemesterWiseSummary,
    getActivityEfficiencyScore
  };
}