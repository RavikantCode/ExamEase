"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Teacher } from "../utils/types";

interface TeacherFormProps {
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
}

const TeacherForm: React.FC<TeacherFormProps> = ({ setTeachers }) => {
  const [newTeacher, setNewTeacher] = useState<Omit<Teacher, "id">>({
    name: "",
    branch: "",
    maxHoursPerDay: 6,
  });

  const addTeacher = () => {
    if (newTeacher.maxHoursPerDay <= 0) {
        alert("Max hours per day must be greater than 0");         //this one added recently at friday 3:00 pm 
        return;
      }

    if (newTeacher.name && newTeacher.branch) {
      setTeachers((prev) => [
        ...prev,
        {
          ...newTeacher,
          id: Date.now().toString(),
          maxHoursPerDay: Number(newTeacher.maxHoursPerDay) || 6,
        },
      ]);
      setNewTeacher({ name: "", branch: "", maxHoursPerDay: 6 });
    }
  };

  return (
    <div className="space-y-3 p-4 border rounded-lg bg-white shadow">
      <Input
        placeholder="Teacher Name"
        value={newTeacher.name}
        onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
      />
      <Input
        placeholder="Branch/Department"
        value={newTeacher.branch}
        onChange={(e) => setNewTeacher({ ...newTeacher, branch: e.target.value })}
      />
      <Input
        type="number"
        placeholder="Max Hours/Day"
        value={newTeacher.maxHoursPerDay}
        onChange={(e) => setNewTeacher({ ...newTeacher, maxHoursPerDay: Number(e.target.value) })}
      />
      <Button onClick={addTeacher} className="w-full">
        <Plus className="h-4 w-4 mr-2" /> Add Teacher
      </Button>
    </div>
  );
};

export default TeacherForm;
