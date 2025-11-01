"use client";
import React, { useState } from "react";

interface SemData {
  semester: string;
  department: string;
  year: string;
  files: File[];
}

const SemesterUpload: React.FC = () => {
  const [data, setData] = useState<SemData>({
    semester: "",
    department: "",
    year: "",
    files: [],
  });
  const [uploaded, setUploaded] = useState<SemData[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setData({ ...data, files: Array.from(e.target.files) });
    }
  };

  const handleAdd = () => {
    if (data.semester && data.department && data.year && data.files.length) {
      setUploaded([...uploaded, data]);
      setData({ semester: "", department: "", year: "", files: [] });
    }
  };

  return (
    <div className="border p-4 rounded-2xl shadow space-y-4 bg-white">
      <h2 className="text-xl font-semibold text-gray-800">Upload Subject Dataset</h2>

      <div className="grid grid-cols-3 gap-3">
        <input
          type="text"
          placeholder="Semester (e.g. 3,5,7)"
          value={data.semester}
          onChange={(e) => setData({ ...data, semester: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Department (e.g. IT, Civil)"
          value={data.department}
          onChange={(e) => setData({ ...data, department: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Year (e.g. SE, TE, BE)"
          value={data.year}
          onChange={(e) => setData({ ...data, year: e.target.value })}
          className="border p-2 rounded"
        />
      </div>

      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="border p-2 rounded w-full"
      />

      <button
        onClick={handleAdd}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
      >
        Add
      </button>

      <div className="mt-4 space-y-2">
        {uploaded.map((u, i) => (
          <div key={i} className="border p-3 rounded-lg">
            <p>
              Sem: {u.semester}, Dept: {u.department}, Year: {u.year}
            </p>
            <ul className="text-sm text-gray-600">
              {u.files.map((f, j) => (
                <li key={j}>{f.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SemesterUpload;
