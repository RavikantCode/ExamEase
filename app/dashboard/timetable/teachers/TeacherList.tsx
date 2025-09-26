"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Teacher } from "../utils/types";

interface TeacherListProps {
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
}

const TeacherList: React.FC<TeacherListProps> = ({ teachers, setTeachers }) => {
  const removeTeacher = (id: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Teachers ({teachers.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {teachers.length > 0 ? (
            teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="flex items-center justify-between p-2 bg-green-50 rounded text-sm"
              >
                <div>
                  <div className="font-medium">{teacher.name}</div>
                  <div className="text-gray-600">{teacher.branch}</div>
                  <div className="text-xs text-gray-500">
                    Max {teacher.maxHoursPerDay}h/day
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeTeacher(teacher.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No teachers added</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherList;
