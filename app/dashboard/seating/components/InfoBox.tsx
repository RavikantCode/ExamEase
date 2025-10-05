'use client'
import React from 'react';
import { Info } from 'lucide-react';

const InfoBox: React.FC = () => {
  return (
    <div className="bg-blue-900 bg-opacity-50 border border-blue-500 rounded-lg p-4 mb-6 print:hidden">
      <div className="flex items-start gap-2">
        <Info size={24} className="flex-shrink-0 mt-1" />
        <div>
          <p className="font-semibold mb-1">Algorithm Logic</p>
          <p className="text-sm text-gray-300">
            <strong>40 benches room:</strong><br />
            • Take 40 students from SE COMP A (1-40)<br />
            • Take 40 students from BE IT C (1-40)<br />
            • Total: 80 students (different exam groups on same bench)<br /><br />
            <strong>Next room:</strong><br />
            • Continue: SE COMP A (41-75=35) + BE IT C (41-45=5) = 40<br />
            • Then: BE IT C (46-79=34) + next branch (6) = 40<br />
            • Total: 80 students
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoBox;
