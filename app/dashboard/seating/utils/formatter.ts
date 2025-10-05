export const formatBranch = (branch: string, students: number[]): string => {
    if (students.length === 0) return '';
    const start = Math.min(...students);
    const end = Math.max(...students);
    return `${branch} (${start}-${end}=${students.length})`;
  };
  