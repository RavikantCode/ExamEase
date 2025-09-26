
// import { Activity } from '../types/activity';

// const difficultyMultiplier = { easy: 1, medium: 1.5, hard: 2.5 };

// export function calculateEstimatedTime(activities: Activity[]) {
//   const hours = activities.reduce((acc, a) => {
//     return acc + (a.count * (difficultyMultiplier[a.difficulty] || 1) * 0.5);
//   }, 0);
//   return Math.ceil(hours);
// }

// export function calculateGrandTotal(activities: Activity[]) {
//   return activities.reduce((sum, a) => sum + (a.count * a.rate), 0);
// }

// export function calculateInsights(activities: Activity[], grandTotal: number, estimatedTime: number) {
//   const totalCount = activities.reduce((s, a) => s + a.count, 0);
//   const avgRate = totalCount ? (grandTotal / totalCount) : 0;
//   const mostCommon = activities.reduce((acc, curr) => (acc.count > curr.count ? acc : curr), activities[0] || { type: 'N/A', count: 0 });
//   return {
//     totalHours: estimatedTime,
//     mostCommonActivity: mostCommon?.type || 'N/A',
//     averageRate: avgRate,
//     productivity: estimatedTime ? (grandTotal / estimatedTime) : 0
//   };
// }

// export function updateActivityArray(activities: Activity[], id: number, field: keyof Activity, value: any) {
//   return activities.map(a => {
//     if (a.id !== id) return a;
//     const updated = {
//       ...a,
//       [field]: ['count', 'rate'].includes(field as string) ? Number(value) || 0 : value
//     } as Activity;
//     if (field === 'count' || field === 'rate') {
//       updated.total = (field === 'count' ? Number(value) || 0 : a.count) * (field === 'rate' ? Number(value) || 0 : a.rate);
//     }
//     return updated;
//   });
// }

// export function addActivityFromTemplate(activities: Activity[], template: Partial<Activity>, facultySemester: string) {
//   const newId = activities.length > 0 ? Math.max(...activities.map(a => a.id)) + 1 : 1;
//   const newActivity: Activity = {
//     id: newId,
//     type: template.type || 'Custom Activity',
//     category: (template.category as Activity['category']) || 'assessment',
//     sem: facultySemester,
//     subject: '',
//     count: 0,
//     rate: template.rate || 0,
//     total: 0,
//     isCustom: false,
//     difficulty: (template.difficulty as Activity['difficulty']) || 'medium'
//   };
//   return [...activities, newActivity];
// }


// app/dashboard/remuneration/services/calculations.ts
import { Activity } from '../types/activity';

const difficultyMultiplier = { easy: 1, medium: 1.5, hard: 2.5 };

export function calculateEstimatedTime(activities: Activity[]) {
  const hours = activities.reduce((acc, a) => {
    return acc + (a.count * (difficultyMultiplier[a.difficulty] || 1) * 0.5);
  }, 0);
  return Math.ceil(hours);
}

export function calculateGrandTotal(activities: Activity[]) {
  return activities.reduce((sum, a) => sum + (a.count * a.rate), 0);
}

export function calculateInsights(activities: Activity[], grandTotal: number, estimatedTime: number) {
  const activeActivities = activities.filter(a => a.count > 0);
  const totalCount = activeActivities.reduce((s, a) => s + a.count, 0);
  const avgRate = totalCount ? (grandTotal / totalCount) : 0;
  const mostCommon = activeActivities.reduce((acc, curr) => (acc.count > curr.count ? acc : curr), activeActivities[0] || { type: 'N/A', count: 0 });
  
  // Enhanced insights for ExamEase
  const categoryBreakdown = activeActivities.reduce((acc, a) => {
    acc[a.category] = (acc[a.category] || 0) + a.count;
    return acc;
  }, {} as Record<string, number>);

  const difficultyBreakdown = activeActivities.reduce((acc, a) => {
    acc[a.difficulty] = (acc[a.difficulty] || 0) + a.count;
    return acc;
  }, {} as Record<string, number>);

  const semesterBreakdown = activeActivities.reduce((acc, a) => {
    acc[a.semester] = (acc[a.semester] || 0) + a.count;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalHours: estimatedTime,
    mostCommonActivity: mostCommon?.type || 'N/A',
    averageRate: avgRate,
    productivity: estimatedTime ? (grandTotal / estimatedTime) : 0,
    totalActivities: activeActivities.length,
    categoryBreakdown,
    difficultyBreakdown,
    semesterBreakdown,
    highestPayingActivity: activeActivities.reduce((max, curr) => 
      (curr.rate > max.rate) ? curr : max, activeActivities[0] || { type: 'N/A', rate: 0 }
    ),
    totalSubjects: new Set(activeActivities.map(a => a.subject).filter(Boolean)).size
  };
}

export function updateActivityArray(activities: Activity[], id: number, field: keyof Activity, value: any) {
  return activities.map(a => {
    if (a.id !== id) return a;
    const updated = {
      ...a,
      [field]: ['count', 'rate'].includes(field as string) ? Number(value) || 0 : value
    } as Activity;
    if (field === 'count' || field === 'rate') {
      updated.total = (field === 'count' ? Number(value) || 0 : a.count) * (field === 'rate' ? Number(value) || 0 : a.rate);
    }
    return updated;
  });
}

export function addActivityFromTemplate(
  activities: Activity[], 
  template: Partial<Activity>, 
  facultySemester: string,
  facultyExamination?: string,
  facultyScheme?: string,
  facultyClass?: string
) {
  const newId = activities.length > 0 ? Math.max(...activities.map(a => a.id)) + 1 : 1;
  const newActivity: Activity = {
    id: newId,
    type: template.type || 'Custom Activity',
    category: (template.category as Activity['category']) || 'assessment',
    semester: facultySemester, // Changed from 'sem' to 'semester'
    subject: '',
    count: 0,
    rate: template.rate || 0,
    total: 0,
    isCustom: false,
    difficulty: (template.difficulty as Activity['difficulty']) || 'medium',
    examination: facultyExamination,
    scheme: facultyScheme,
    class: facultyClass
  };
  return [...activities, newActivity];
}

export function createCustomActivity(
  activities: Activity[],
  type: string,
  category: Activity['category'],
  difficulty: Activity['difficulty'],
  rate: number,
  facultySemester: string,
  facultyExamination?: string,
  facultyScheme?: string,
  facultyClass?: string
) {
  const newId = activities.length > 0 ? Math.max(...activities.map(a => a.id)) + 1 : 1;
  const newActivity: Activity = {
    id: newId,
    type,
    category,
    semester: facultySemester,
    subject: '',
    count: 0,
    rate,
    total: 0,
    isCustom: true,
    difficulty,
    examination: facultyExamination,
    scheme: facultyScheme,
    class: facultyClass
  };
  return [...activities, newActivity];
}

// Helper function to get semester-wise summary
export function getSemesterWiseSummary(activities: Activity[]) {
  const activeActivities = activities.filter(a => a.count > 0);
  return activeActivities.reduce((acc, a) => {
    if (!acc[a.semester]) {
      acc[a.semester] = {
        totalAmount: 0,
        totalCount: 0,
        activities: 0,
        subjects: new Set()
      };
    }
    acc[a.semester].totalAmount += a.total;
    acc[a.semester].totalCount += a.count;
    acc[a.semester].activities += 1;
    if (a.subject) acc[a.semester].subjects.add(a.subject);
    return acc;
  }, {} as Record<string, { totalAmount: number; totalCount: number; activities: number; subjects: Set<string> }>);
}

// Helper function to get activity efficiency score
export function getActivityEfficiencyScore(activity: Activity): number {
  if (activity.count === 0) return 0;
  const baseScore = activity.rate * activity.count;
  const difficultyBonus = difficultyMultiplier[activity.difficulty] || 1;
  return baseScore * difficultyBonus;
}