export interface BranchGroup {
    branch: string;
    students: number[];
    examGroup: string;
  }
  
  export interface Block {
    no: number;
    block: string;
    branches: string[];
    total: number;
  }
  
  export interface SeatingData {
    date: string;
    time: string[];
    seatingPlan: Block[];
  }
  
  export interface Room {
    roomNumber: string;
    benches: number;
  }
  
  export interface StudentData {
    branch: string;
    totalStudents: number;
    examGroup: string;
  }
  