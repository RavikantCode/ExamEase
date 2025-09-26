
'use client';
import React from 'react';
import { ChevronRight, User, BookOpen, Download } from 'lucide-react';

type Step = { title: string; description: string };
type Props = { steps: Step[]; currentStep: number };

const icons = [User, BookOpen, Download];

export default function Stepper({ steps, currentStep }: Props) {
  return (
    <div className="flex items-center justify-center flex-wrap gap-4 p-6">
      {steps.map((step, index) => {
        const Icon = icons[index] || ChevronRight;
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <div key={index} className="flex items-center">
            {/* Step Card */}
            <div
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-500 hover:scale-102 border
                ${isActive
                  ? 'bg-gradient-to-r from-purple-500 via-purple-600 to-cyan-500 text-white shadow-purple-500/25 border-purple-400/30 animate-pulse'
                  : isCompleted
                  ? 'bg-gradient-to-r from-purple-400 to-cyan-400 text-white shadow-purple-400/20 border-purple-300/30'
                  : 'bg-gray-900/50 text-gray-300 border-gray-700/50 hover:bg-gray-800/60'
                }`}
            >
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full shadow-inner transition-all duration-300
                  ${isActive
                    ? 'bg-white/20 backdrop-blur-sm shadow-white/10 ring-2 ring-white/30'
                    : isCompleted
                    ? 'bg-white/20 backdrop-blur-sm shadow-white/10'
                    : 'bg-gray-800/80 text-gray-400 shadow-gray-900/20'
                  }`}
              >
                <Icon size={20} className="drop-shadow-sm" />
              </div>

              <div className="flex flex-col">
                <span className={`font-semibold text-sm tracking-wide
                  ${isActive ? 'text-white drop-shadow-sm' : 
                    isCompleted ? 'text-white/95' : 'text-gray-300'}`}>
                  {step.title}
                </span>
                <span className={`text-xs mt-0.5 
                  ${isActive ? 'text-white/90 drop-shadow-sm' : 
                    isCompleted ? 'text-white/80' : 'text-gray-400'}`}>
                  {step.description}
                </span>
              </div>
            </div>

            {/* Connector */}
            {index < steps.length - 1 && (
              <div className="flex items-center mx-4">
                <div className={`w-8 h-0.5 rounded-full transition-all duration-500
                  ${isCompleted 
                    ? 'bg-gradient-to-r from-purple-400 to-cyan-400 shadow-sm' 
                    : 'bg-gray-700/50'}`}
                />
                <ChevronRight
                  className={`ml-2 transition-all duration-500 drop-shadow-sm
                    ${isCompleted 
                      ? 'text-cyan-400 animate-pulse' 
                      : isActive 
                      ? 'text-purple-400' 
                      : 'text-gray-500'}`}
                  size={18}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}