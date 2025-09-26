"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, BookOpen } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Course } from "../utils/types";

interface CourseListProps {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
}

const CourseList: React.FC<CourseListProps> = ({ courses, setCourses }) => {
  const removeCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Courses ({courses.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {courses.length > 0 ? (
            courses.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between p-2 bg-blue-50 rounded text-sm"
              >
                <div>
                  <div className="font-medium">{course.code}</div>
                  <div className="text-gray-600">{course.name}</div>
                  <div className="text-xs text-gray-500">
                    {course.semester} | {course.students} students
                  </div>
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeCourse(course.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No courses added</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseList;
