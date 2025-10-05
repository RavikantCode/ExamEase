'use client'
import React from 'react';
import { Download, Play } from 'lucide-react';

interface Props {
    generate: () => void;
    exportOutput: () => void;
    printPDF: () => void;
    loading: boolean;
    output: any | null;
  }
  

const OutputActions: React.FC<Props> = ({ generate, exportOutput, printPDF, loading, output }) => {
  return (
    <div className="flex justify-center gap-4 mb-6 print:hidden">
      <button
        onClick={generate}
        disabled={loading}
        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-lg font-semibold disabled:opacity-50"
      >
        <Play size={20} />
        {loading ? 'Processing...' : 'Generate Seating Plan'}
      </button>

      {output && (
        <>
          <button
            onClick={exportOutput}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg"
          >
            <Download size={18} />
            Export JSON
          </button>

          <button
            onClick={printPDF}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg"
          >
            <Download size={18} />
            Print PDF
          </button>
        </>
      )}
    </div>
  );
};

export default OutputActions;
