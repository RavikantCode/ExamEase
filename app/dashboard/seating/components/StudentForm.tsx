import React from "react";
// import { StudentData } from "@/types/seating";
import { StudentData } from "../types/seating";

interface Props {
  students: StudentData[];
  setStudents: React.Dispatch<React.SetStateAction<StudentData[]>>;
}

const StudentForm: React.FC<Props> = ({ students, setStudents }) => {
  return (
    <div>
      {students.map((student, idx) => (
        <div key={idx} className="bg-gray-700 p-2 rounded">
          <input
            type="text"
            value={student.branch}
            onChange={(e) => {
              const newStudents = [...students];
              newStudents[idx].branch = e.target.value;
              setStudents(newStudents);
            }}
          />
          <input
            type="number"
            value={student.totalStudents}
            onChange={(e) => {
              const newStudents = [...students];
              newStudents[idx].totalStudents = parseInt(e.target.value) || 0;
              setStudents(newStudents);
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default StudentForm;
