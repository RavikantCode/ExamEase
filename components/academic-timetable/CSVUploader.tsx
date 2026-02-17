// components/academic-timetable/CSVUploader.tsx

'use client';

import { useState } from 'react';
import { CSVUploadResult } from '@/lib/academic-timetable/types';

interface CSVUploaderProps {
  type: 'rooms' | 'instructors' | 'courses' | 'workload';
  academicYear?: string;
  semester?: string;
  onUploadComplete?: (result: CSVUploadResult) => void;
}

export default function CSVUploader({
  type,
  academicYear,
  semester,
  onUploadComplete
}: CSVUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<CSVUploadResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      
      if (type === 'workload') {
        if (!academicYear || !semester) {
          throw new Error('Academic year and semester required for workload upload');
        }
        formData.append('academicYear', academicYear);
        formData.append('semester', semester);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const contentType = response.headers.get('content-type') || '';
      let payload: any;

      if (contentType.includes('application/json')) {
        payload = await response.json();
      } else {
        const fallback = await response.text();
        throw new Error(
          fallback?.trim() || 'Server returned a non-JSON response. Check the server logs for details.'
        );
      }

      const normalized: CSVUploadResult = {
        success: Boolean(payload?.success),
        recordsProcessed: payload?.recordsProcessed ?? 0,
        errors: payload?.errors ?? (payload?.error ? [payload.error] : undefined)
      };

      if (!normalized.success && !normalized.errors) {
        normalized.errors = ['Upload failed'];
      }

      setResult(normalized);

      if (onUploadComplete) {
        onUploadComplete(normalized);
      }
    } catch (error: any) {
      setResult({
        success: false,
        recordsProcessed: 0,
        errors: [error.message]
      });
    } finally {
      setUploading(false);
    }
  };

  const getTypeLabel = () => {
    const labels = {
      rooms: 'Rooms',
      instructors: 'Instructors',
      courses: 'Courses',
      workload: 'Workload Distribution'
    };
    return labels[type];
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Upload {getTypeLabel()} CSV</h3>
      
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md
              hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed
              transition-colors font-medium whitespace-nowrap"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>

        {result && (
          <div className={`p-4 rounded-md ${
            result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-start gap-2">
              <span className={`font-semibold ${
                result.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {result.success ? '✓ Success' : '✗ Error'}
              </span>
              <div className="flex-1">
                <p className={result.success ? 'text-green-700' : 'text-red-700'}>
                  {result.success
                    ? `Successfully processed ${result.recordsProcessed} records${
                        type === 'workload' ? ' and created course-instructor relationships' : ''
                      }`
                    : 'Upload failed'}
                </p>
                {result.errors && result.errors.length > 0 && (
                  <ul className="mt-2 space-y-1 text-sm text-red-600">
                    {result.errors.map((error, idx) => (
                      <li key={idx}>• {error}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-600">
          <p className="font-medium mb-2">CSV Format Requirements:</p>
          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            {type === 'rooms' && (
              <code className="text-xs">
                roomNumber, seatingCapacity<br/>
                101, 60<br/>
                102, 80
              </code>
            )}
            {type === 'instructors' && (
              <code className="text-xs">
                uid, name, abbreviation, maxHoursPerWeek<br/>
                T001, Dr. John Doe, JD, 16<br/>
                T002, Prof. Jane Smith, JS, 14
              </code>
            )}
            {type === 'courses' && (
              <code className="text-xs">
                courseCode, courseName, maxStudents, lectureHours, practicalHours<br/>
                CS101, Data Structures, 60, 3, 2<br/>
                CS102, Algorithms, 60, 4, 2
              </code>
            )}
            {type === 'workload' && (
              <code className="text-xs">
                instructor_name, course_code, subject_name, theory_hours, practical_hours<br/>
                Dr. John Doe, CS101, Data Structures, 3, 2<br/>
                Prof. Jane Smith, CS102, Algorithms, 4, 2
              </code>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
