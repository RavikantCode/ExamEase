'use client'
import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface Props {
  error: string;
  output: any | null;
}

const Alerts: React.FC<Props> = ({ error, output }) => {
  return (
    <>
      {error && (
        <div className="bg-red-900 bg-opacity-50 border border-red-500 rounded-lg p-4 mb-6 flex items-center gap-2 print:hidden">
          <AlertCircle size={24} />
          <span>{error}</span>
        </div>
      )}

      {output && !error && (
        <div className="bg-green-900 bg-opacity-50 border border-green-500 rounded-lg p-4 mb-6 flex items-center gap-2 print:hidden">
          <CheckCircle size={24} />
          <span>Done! Each branch takes room_capacity/2 students, paired with different exam groups.</span>
        </div>
      )}
    </>
  );
};

export default Alerts;
