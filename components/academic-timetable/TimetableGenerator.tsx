// components/academic-timetable/TimetableGenerator.tsx

'use client';

import { useState } from 'react';
import { TimetableGenerationResult } from '@/lib/academic-timetable/types';
import TimetableDisplay from './TimetableDisplay';

interface TimetableGeneratorProps {
  sectionId: string;
  sectionName: string;
}

export default function TimetableGenerator({ sectionId, sectionName }: TimetableGeneratorProps) {
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<TimetableGenerationResult | null>(null);
  const [config, setConfig] = useState({
    populationSize: 9,
    eliteSize: 1,
    tournamentSize: 3,
    mutationRate: 0.05,
    maxGenerations: 1000,
    targetFitness: 1.0
  });

  const handleGenerate = async () => {
    setGenerating(true);
    setResult(null);

    try {
      const response = await fetch('/api/timetable/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sectionId,
          academicYear: '2025-26',
          semester: 'EVEN',
          config
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({
        success: false,
        conflicts: [],
        generationStats: {
          generations: 0,
          finalFitness: 0,
          timeTaken: 0
        }
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Generation Configuration</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Population Size
            </label>
            <input
              type="number"
              value={config.populationSize}
              onChange={(e) => setConfig({ ...config, populationSize: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="5"
              max="50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Elite Size
            </label>
            <input
              type="number"
              value={config.eliteSize}
              onChange={(e) => setConfig({ ...config, eliteSize: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tournament Size
            </label>
            <input
              type="number"
              value={config.tournamentSize}
              onChange={(e) => setConfig({ ...config, tournamentSize: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="2"
              max="10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mutation Rate
            </label>
            <input
              type="number"
              step="0.01"
              value={config.mutationRate}
              onChange={(e) => setConfig({ ...config, mutationRate: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0.01"
              max="0.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Generations
            </label>
            <input
              type="number"
              value={config.maxGenerations}
              onChange={(e) => setConfig({ ...config, maxGenerations: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="100"
              max="5000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Fitness
            </label>
            <input
              type="number"
              step="0.01"
              value={config.targetFitness}
              onChange={(e) => setConfig({ ...config, targetFitness: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0.8"
              max="1.0"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 
            disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold text-lg"
        >
          {generating ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating Timetable...
            </span>
          ) : (
            'Generate Timetable'
          )}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Statistics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Generation Statistics</h3>
            
            {result.success ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-sm text-green-600 font-medium">Status</div>
                  <div className="text-2xl font-bold text-green-700">Success</div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-sm text-blue-600 font-medium">Generations</div>
                  <div className="text-2xl font-bold text-blue-700">
                    {result.generationStats.generations}
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="text-sm text-purple-600 font-medium">Fitness Score</div>
                  <div className="text-2xl font-bold text-purple-700">
                    {(result.generationStats.finalFitness * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="text-sm text-orange-600 font-medium">Time Taken</div>
                  <div className="text-2xl font-bold text-orange-700">
                    {(result.generationStats.timeTaken / 1000).toFixed(1)}s
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-red-700 font-medium">
                  Failed to generate timetable
                </div>
                {(result as any).error && (
                  <p className="mt-1 text-sm text-red-600">{(result as any).error}</p>
                )}
              </div>
            )}
          </div>

          {/* Conflicts */}
          {result.conflicts && result.conflicts.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-yellow-700">
                Conflicts Detected ({result.conflicts.length})
              </h3>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {result.conflicts.map((conflict, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded border ${
                      conflict.severity === 'HIGH'
                        ? 'bg-red-50 border-red-200'
                        : conflict.severity === 'MEDIUM'
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-sm">
                        {conflict.type.replace(/_/g, ' ')}:
                      </span>
                      <span className="text-sm">{conflict.message}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timetable Display */}
          {result.success && result.schedule && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <TimetableDisplay
                classes={result.schedule.classes as any}
                sectionName={sectionName}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
