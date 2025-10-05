import { BranchGroup, Block, Room, StudentData, SeatingData } from "../types/seating";
import { formatBranch } from "./formatter";

export const generateSeatingArrangement = (
  students: StudentData[],
  rooms: Room[],
  date: string,
  timeSlots: string[]
): SeatingData | null => {
  const branchQueues: BranchGroup[] = students
    .filter(s => s.totalStudents > 0)
    .map(s => ({
      branch: s.branch,
      students: Array.from({ length: s.totalStudents }, (_, i) => i + 1),
      examGroup: s.examGroup,
    }));

  const result: Block[] = [];
  let blockNo = 1;
  let roomIndex = 0;
  let currentBranchIndex = 0;

  while (branchQueues.some(b => b.students.length > 0)) {
    const room = rooms[roomIndex];
    if (!room) return null;

    const studentsPerBranch = room.benches;
    const blockBranches: { [key: string]: number[] } = {};
    let seatsAllocated = 0;
    const usedExamGroups = new Set<string>();

    while (currentBranchIndex < branchQueues.length && branchQueues[currentBranchIndex].students.length === 0) {
      currentBranchIndex++;
    }
    if (currentBranchIndex >= branchQueues.length) break;

    const currentBranch = branchQueues[currentBranchIndex];
    const studentsToTake = Math.min(studentsPerBranch, currentBranch.students.length);
    const takenStudents = currentBranch.students.splice(0, studentsToTake);
    blockBranches[currentBranch.branch] = takenStudents;
    seatsAllocated += studentsToTake;
    usedExamGroups.add(currentBranch.examGroup);

    for (let i = currentBranchIndex + 1; i < branchQueues.length; i++) {
      const nextBranch = branchQueues[i];
      if (nextBranch.students.length > 0 && !usedExamGroups.has(nextBranch.examGroup)) {
        const remainingCapacity = room.benches * 2 - seatsAllocated;
        const takenFromNext = nextBranch.students.splice(0, remainingCapacity);
        blockBranches[nextBranch.branch] = takenFromNext;
        seatsAllocated += takenFromNext.length;
        break;
      }
    }

    const branches = Object.entries(blockBranches)
      .filter(([_, students]) => students.length > 0)
      .map(([branch, students]) => formatBranch(branch, students));

    const total = Object.values(blockBranches).reduce((sum, students) => sum + students.length, 0);

    if (total > 0) {
      result.push({ no: blockNo++, block: room.roomNumber, branches, total });
    }

    roomIndex++;
  }

  return { date, time: timeSlots, seatingPlan: result };
};
