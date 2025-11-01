"use client";
import React, { useState, useEffect } from "react";
import Papa from "papaparse";

interface GenerateTimeTableProps {
  morningTime: string;
  eveningTime: string;
  startDate: string;
}

export default function GenerateTimeTableForm({
  morningTime,
  eveningTime,
  startDate,
}: GenerateTimeTableProps) {
  const [seSubjects, setSeSubjects] = useState<string[]>([]);
  const [teSubjects, setTeSubjects] = useState<string[]>([]);
  const [beSubjects, setBeSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [dayName, setDayName] = useState<string>("");

  // Auto-generate day name from date
  useEffect(() => {
    if (startDate) {
      const day = new Date(startDate).toLocaleDateString("en-US", {
        weekday: "long",
      });
      setDayName(day);
    }
  }, [startDate]);

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const subjects = results.data.map((r: any) => r["Subject Name"]).filter(Boolean);
        setter(subjects);
      },
    });
  };

  const downloadPDF = async (subjects: string[], title: string) => {
    if (!subjects.length) return alert(`Upload ${title} subjects first!`);
    if (!startDate) return alert("Please set a start date in the timetable form!");

    setLoading(true);
    try {
      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjects,
          title,
          startDate,
          morningTime,
          eveningTime,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate PDF");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      console.error(err);
      alert("Failed to load document. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-white shadow rounded-2xl">
      <h2 className="text-2xl font-semibold text-gray-800">📅 Generate Exam Timetable</h2>

      <div className="space-y-3 text-gray-700">
        {startDate ? (
          <p>
            <strong>Start Date:</strong> {startDate} ({dayName})
          </p>
        ) : (
          <p className="text-red-500 text-sm">
            ⚠️ Please select a date from the VT Timetable form.
          </p>
        )}
        <p>
          <strong>Morning Shift:</strong> {morningTime || "Not set"}
        </p>
        <p>
          <strong>Evening Shift:</strong> {eveningTime || "Not set"}
        </p>
      </div>

      <div className="space-y-3">
        <label className="font-semibold">Upload SE CSV:</label>
        <input type="file" accept=".csv" onChange={(e) => handleCSVUpload(e, setSeSubjects)} />

        <label className="font-semibold">Upload TE CSV:</label>
        <input type="file" accept=".csv" onChange={(e) => handleCSVUpload(e, setTeSubjects)} />

        <label className="font-semibold">Upload BE CSV:</label>
        <input type="file" accept=".csv" onChange={(e) => handleCSVUpload(e, setBeSubjects)} />
      </div>

      <div className="flex flex-wrap gap-3 pt-4">
        <button
          onClick={() => downloadPDF(seSubjects, "SE")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Download SE PDF
        </button>
        <button
          onClick={() => downloadPDF(teSubjects, "TE")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Download TE PDF
        </button>
        <button
          onClick={() => downloadPDF(beSubjects, "BE")}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Download BE PDF
        </button>
      </div>

      {loading && <p className="text-sm text-gray-500">Generating PDFs...</p>}
    </div>
  );
}
