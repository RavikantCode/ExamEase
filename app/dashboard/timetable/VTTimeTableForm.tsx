"use client";
import React, { useState } from "react";

interface Shift {
  date: string;
  day: string;
  morningShift: string;
  eveningShift: string;
}

export default function VTTimeTableForm() {
  const [shift, setShift] = useState<Shift>({
    date: "",
    day: "",
    morningShift: "",
    eveningShift: "",
  });
  const [entries, setEntries] = useState<Shift[]>([]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    const day = new Date(date).toLocaleDateString("en-US", { weekday: "long" });
    setShift({ ...shift, date, day });
  };

  const handleAdd = () => {
    if (shift.date && shift.morningShift && shift.eveningShift) {
      setEntries([...entries, shift]);
      setShift({ date: "", day: "", morningShift: "", eveningShift: "" });
    }
  };

  const handleDelete = (index: number) => setEntries(entries.filter((_, i) => i !== index));

  return (
    <div className="border p-4 rounded-2xl shadow space-y-4 bg-white">
      <h2 className="text-xl font-semibold text-gray-800">VT Timetable Setup</h2>

      <div className="grid grid-cols-2 gap-3">
        <input
          type="date"
          value={shift.date}
          onChange={handleDateChange}
          className="border p-2 rounded"
        />
        <input
          type="time"
          value={shift.morningShift}
          onChange={(e) => setShift({ ...shift, morningShift: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="time"
          value={shift.eveningShift}
          onChange={(e) => setShift({ ...shift, eveningShift: e.target.value })}
          className="border p-2 rounded"
        />
      </div>

      <button
        onClick={handleAdd}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Add
      </button>

      <div className="mt-4 space-y-2">
        {entries.map((e, i) => (
          <div key={i} className="border p-3 rounded-lg flex justify-between items-center">
            <div>
              <p>
                {e.date} — {e.day}
              </p>
              <p>Morning: {e.morningShift}</p>
              <p>Evening: {e.eveningShift}</p>
            </div>
            <button
              onClick={() => handleDelete(i)}
              className="text-sm bg-red-500 px-2 py-1 rounded text-white"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
