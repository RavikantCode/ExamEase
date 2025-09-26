
'use client';
import React from 'react';
import { ChevronRight, ChevronLeft, ArrowRight, ArrowLeft } from 'lucide-react';

type Props = {
  onPrev: () => void;
  onNext: () => void;
  currentStep: number;
  stepsLength: number;
};

export default function Navigation({ onPrev, onNext, currentStep, stepsLength }: Props) {
  const progress = ((currentStep + 1) / stepsLength) * 100;

  return (
    <div className="mt-8 bg-[#000000] backdrop-blur-xl border border-gray-800 shadow-2xl rounded-2xl overflow-hidden">
      {/* Progress Header */}
      <div className="bg-gradient-to-r from-purple-500 to-[#111111] p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-white font-semibold text-sm">
            Step {currentStep + 1} of {stepsLength}
          </div>
          <div className="text-cyan-100 font-medium text-sm">
            {Math.round(progress)}% Complete
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-700/50 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Navigation Content */}
      <div className="p-6 bg-[#000000]">
        <div className="flex items-center justify-between gap-4">
          {/* Previous Button */}
          <button
            onClick={onPrev}
            disabled={currentStep === 0}
            className={`
              flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-200
              ${currentStep === 0 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50' 
                : 'bg-[#111111] text-white border border-gray-700 hover:bg-[#1a1a1a] hover:border-gray-600 active:scale-95'
              }
            `}
          >
            <ArrowLeft size={18} />
            <span>Previous</span>
          </button>

          {/* Step Indicators */}
          <div className="flex items-center gap-2">
            {Array.from({ length: stepsLength }, (_, index) => (
              <div
                key={index}
                className={`
                  w-3 h-3 rounded-full transition-all duration-300
                  ${index < currentStep 
                    ? 'bg-cyan-400 scale-110' 
                    : index === currentStep 
                    ? 'bg-purple-500 scale-125 ring-2 ring-purple-400/50' 
                    : 'bg-gray-700'
                  }
                `}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={onNext}
            disabled={currentStep === stepsLength - 1}
            className={`
              flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-200
              ${currentStep === stepsLength - 1 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50' 
                : 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg hover:from-purple-600 hover:to-cyan-600 active:scale-95 hover:shadow-xl hover:shadow-purple-500/25'
              }
            `}
          >
            <span>
              {currentStep === stepsLength - 1 ? 'Complete' : 'Next'}
            </span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Step Information */}
        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="flex items-center justify-between text-sm">
            <div className="text-[#9D9D9D]">
              {currentStep === 0 && "Let's get started with your information"}
              {currentStep === 1 && "Add your teaching activities"}
              {currentStep === 2 && "Review and finalize your report"}
              {currentStep >= 3 && "You're all set!"}
            </div>
            <div className="flex items-center gap-4">
              {currentStep > 0 && (
                <div className="flex items-center gap-1 text-xs text-cyan-400">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span>Progress saved</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}