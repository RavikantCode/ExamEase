"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Course } from "../utils/types";

interface CourseFormProps {
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
}

const CourseForm: React.FC<CourseFormProps> = ({ setCourses }) => {
  const [newCourse, setNewCourse] = useState<Omit<Course, "id">>({
    code: "",
    name: "",
    semester: "",
    subject: "",
    students: 0,
  });

  const addCourse = () => {
    if (newCourse.code && newCourse.name) {
      setCourses((prev) => [
        ...prev,
        { ...newCourse, id: Date.now().toString(), students: Number(newCourse.students) || 0 },
      ]);
      setNewCourse({ code: "", name: "", semester: "", subject: "", students: 0 });
    }
  };

  return (
    <div className="space-y-3 p-4 border rounded-lg bg-white shadow">
      <Input
        placeholder="Course Code"
        value={newCourse.code}
        onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
      />
      <Input
        placeholder="Course Name"
        value={newCourse.name}
        onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-2">
        <Input
          placeholder="Semester"
          value={newCourse.semester}
          onChange={(e) => setNewCourse({ ...newCourse, semester: e.target.value })}
        />
        <Input
          placeholder="Subject"
          value={newCourse.subject}
          onChange={(e) => setNewCourse({ ...newCourse, subject: e.target.value })}
        />
      </div>
      <Input
        type="number"
        placeholder="Students Count"
        value={newCourse.students}
        onChange={(e) => setNewCourse({ ...newCourse, students: Number(e.target.value) })}
      />
      <Button onClick={addCourse} className="w-full">
        <Plus className="h-4 w-4 mr-2" /> Add Course
      </Button>
    </div>
  );
};

export default CourseForm;
