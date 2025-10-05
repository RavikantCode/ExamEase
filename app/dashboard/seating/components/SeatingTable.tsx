'use client'
import React from 'react';
// import type { SeatingData, Block } from '../../types'; // adjust path if your types live elsewhere
import type { SeatingData,Block } from '../types/seating';

interface Props {
  output: SeatingData;
}

const SeatingTable: React.FC<Props> = ({ output }) => {
  if (!output) return null;

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl print:bg-white print:text-black">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">
          SEATING PLAN FOR UNIVERSITY TEST-I, AUGUST 2025
        </h2>
        <p className="text-lg font-semibold">{output.date}</p>
        <p className="text-gray-400 print:text-gray-700">
          TIME: {output.time.join(' & ')}
        </p>
      </div>

      <table className="w-full border-collapse border border-gray-600 print:border-black">
        <thead>
          <tr className="bg-gray-700 print:bg-gray-200">
            <th className="border border-gray-600 print:border-black p-3 text-left">No.</th>
            <th className="border border-gray-600 print:border-black p-3 text-left">BLOCK</th>
            <th className="border border-gray-600 print:border-black p-3 text-left">BRANCH</th>
            <th className="border border-gray-600 print:border-black p-3 text-left">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {output.seatingPlan.map((block: Block) => (
            <tr key={block.no} className="hover:bg-gray-700 hover:bg-opacity-30 print:hover:bg-transparent">
              <td className="border border-gray-600 print:border-black p-3">{block.no}</td>
              <td className="border border-gray-600 print:border-black p-3 font-bold">{block.block}</td>
              <td className="border border-gray-600 print:border-black p-3">
                {block.branches.map((branch, idx) => (
                  <div key={idx} className="text-sm">
                    {branch}
                  </div>
                ))}
              </td>
              <td className="border border-gray-600 print:border-black p-3 font-bold text-center">{block.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 print:hidden">
        <h3 className="text-lg font-bold mb-2">JSON Output:</h3>
        <pre className="bg-gray-900 p-4 rounded text-xs overflow-x-auto">
          {JSON.stringify(output, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default SeatingTable;
