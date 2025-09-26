
'use client';
import React from 'react';
import { Zap, BookOpen, Star, BookMarked, Calendar, Plus } from 'lucide-react';

type Props = {
  templates: Record<string, any[]>;
  onAdd: (template: any) => void;
};

export default function ActivityTemplates({ templates, onAdd }: Props) {
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'assessment': return <BookOpen size={20} className="text-cyan-400" />;
      case 'practical': return <Star size={20} className="text-purple-400" />;
      case 'project': return <BookMarked size={20} className="text-green-400" />;
      case 'duty': return <Calendar size={20} className="text-orange-400" />;
      default: return <Zap size={20} className="text-cyan-400" />;
    }
  };

  const getCategoryGradient = (category: string) => {
    switch (category.toLowerCase()) {
      case 'assessment': return 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30';
      case 'practical': return 'from-purple-500/20 to-indigo-500/20 border-purple-500/30';
      case 'project': return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
      case 'duty': return 'from-orange-500/20 to-red-500/20 border-orange-500/30';
      default: return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-400 bg-green-900/30';
      case 'medium': return 'text-yellow-400 bg-yellow-900/30';
      case 'hard': return 'text-red-400 bg-red-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  };

  return (
    <div className="bg-[#000000] backdrop-blur-xl border border-gray-800 shadow-2xl rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-[#111111] p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-400/20 rounded-xl">
            <Zap className="text-cyan-400" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Activity Templates</h3>
            <p className="text-cyan-100 text-sm">
              Quick-add pre-configured activities to your portfolio
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 bg-[#000000]">
        {/* Grid of Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {Object.entries(templates).map(([category, templArr]) => (
            <div key={category} className="space-y-4">
              {/* Category Header */}
              <div className={`p-4 rounded-xl bg-gradient-to-r ${getCategoryGradient(category)} border`}>
                <div className="flex items-center gap-3">
                  {getCategoryIcon(category)}
                  <div>
                    <h4 className="font-bold text-white capitalize text-lg">
                      {category}
                    </h4>
                    <p className="text-xs text-gray-300">
                      {templArr.length} templates available
                    </p>
                  </div>
                </div>
              </div>

              {/* Templates */}
              <div className="space-y-3">
                {templArr.map((template: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => onAdd(template)}
                    className="w-full group relative overflow-hidden bg-[#111111] border border-gray-700 
                             rounded-xl p-4 hover:bg-[#1a1a1a] hover:border-purple-500/50 
                             transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10
                             hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-white text-base mb-2 group-hover:text-cyan-400 transition-colors">
                          {template.type}
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3">
                          {template.difficulty && (
                            <span className={`px-2 py-1 text-xs font-medium rounded-lg ${getDifficultyColor(template.difficulty)}`}>
                              {template.difficulty}
                            </span>
                          )}
                          <span className="px-2 py-1 text-xs font-medium text-purple-300 bg-purple-900/30 rounded-lg capitalize">
                            {category}
                          </span>
                        </div>

                        {/* Rate */}
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-cyan-400">
                            ₹{template.rate.toLocaleString()}
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Plus size={14} />
                              <span>Add</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {Object.keys(templates).length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚡</div>
            <div className="text-white text-lg font-semibold mb-2">No Templates Available</div>
            <div className="text-[#9D9D9D] text-sm">
              Templates will appear here once they are configured
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-[#111111] border-t border-gray-700 p-4">
        <div className="flex items-center justify-between text-sm">
          <div className="text-[#9D9D9D]">
            {Object.values(templates).flat().length} total templates available
          </div>
          <div className="flex items-center gap-2 text-cyan-400">
            <Zap size={14} />
            <span>Click any template to add instantly</span>
          </div>
        </div>
      </div>
    </div>
  );
}