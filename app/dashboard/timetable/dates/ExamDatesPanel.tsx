"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar } from "lucide-react";

interface ExamDatesPanelProps {
  examDates: string[];
  setExamDates: React.Dispatch<React.SetStateAction<string[]>>;
}

const ExamDatesPanel: React.FC<ExamDatesPanelProps> = ({ examDates, setExamDates }) => {
  const [newDate, setNewDate] = useState<string>("");

  const addDate = () => {
    if (newDate && !examDates.includes(newDate)) {
      setExamDates([...examDates, newDate]);
      setNewDate("");
    }
  };

  const removeDate = (dateToRemove: string) => {
    setExamDates(examDates.filter((d) => d !== dateToRemove));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Exam Dates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="flex-1"
          />
          <Button onClick={addDate}>Add</Button>
        </div>

        {/* List Dates */}
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {examDates.length > 0 ? (
            examDates.map((date) => (
              <div
                key={date}
                className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
              >
                <span>{new Date(date).toLocaleDateString()}</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeDate(date)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No dates added</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExamDatesPanel;
