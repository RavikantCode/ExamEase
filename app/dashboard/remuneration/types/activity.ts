// // app/dashboard/remuneration/types/activity.ts
// export type Category = 'assessment' | 'practical' | 'project' | 'duty';
// export type Difficulty = 'easy' | 'medium' | 'hard';

// export interface Activity {
//   id: number;
//   type: string;
//   category: Category;
//   sem: string;
//   subject: string;
//   count: number;
//   rate: number;
//   total: number;
//   isCustom: boolean;
//   difficulty: Difficulty;
// }


export type Category = 'assessment' | 'practical' | 'project' | 'duty';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Activity {
  id: number;
  type: string;
  category: Category;
  semester: string; // Changed from 'sem' to 'semester' for consistency
  subject: string;
  count: number;
  rate: number;
  total: number;
  isCustom: boolean;
  difficulty: Difficulty;
  department?:string
  // Added missing fields that should be tracked per activity
  examination?: string;
  scheme?: string;
  class?: string;
}
