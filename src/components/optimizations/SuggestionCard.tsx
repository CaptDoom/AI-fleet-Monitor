import React from 'react';
import { TrendingDown, ChevronRight, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';
import { OptimizationSuggestion } from '../../types';

export const SuggestionCard: React.FC<{ suggestion: OptimizationSuggestion }> = ({ suggestion }) => {
  return (
    <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <TrendingDown className="w-16 h-16 text-emerald-500" />
      </div>
      
      <div className="flex items-start gap-4 mb-4">
        <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5 text-emerald-500" />
        </div>
        <div>
          <h3 className="text-white font-bold">{suggestion.title}</h3>
          <p className="text-zinc-500 text-xs mt-1 leading-relaxed">{suggestion.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
        <div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold block mb-1">Est. Savings</span>
          <span className="text-emerald-400 font-bold font-mono">{suggestion.savings}</span>
        </div>
        <button className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest font-bold text-white bg-zinc-800 px-4 h-9 rounded-lg hover:bg-white hover:text-black transition-all">
          Apply Logic <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
