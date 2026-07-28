import React from 'react';
import { Target, CheckCircle2, TrendingUp } from 'lucide-react';

export default function KpiSummary({ trades }) {
  if (!trades || trades.length === 0) return null;

  const totalPlans = trades.length;

  // Execution Rate
  const executedTrades = trades.filter(t => 
    t.status === 'Executed as Planned' || t.status === 'Executed with Variation'
  );
  const executionRate = Math.round((executedTrades.length / totalPlans) * 100);

  // EOD Win Rate
  const reviewedTrades = trades.filter(t => t.outcome && t.outcome !== 'Pending EOD' && t.outcome !== 'No Trade');
  const winTrades = reviewedTrades.filter(t => t.outcome === 'Target Hit' || t.outcome === 'Partial Profit');
  const winRate = reviewedTrades.length > 0 ? Math.round((winTrades.length / reviewedTrades.length) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      
      {/* Total Plans */}
      <div className="slate-card p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">
            Total Trade Plans
          </span>
          <div className="p-1.5 rounded-md bg-[#21262d] text-cyan-400 border border-[#30363d]">
            <Target className="h-4 w-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-[#f0f6fc]">
            {totalPlans}
          </span>
          <span className="text-xs text-[#8b949e]">Logged plans</span>
        </div>

        <div className="mt-3 w-full bg-[#21262d] h-1 rounded-full overflow-hidden">
          <div className="bg-cyan-500 h-full w-full" />
        </div>
      </div>

      {/* Execution Rate */}
      <div className="slate-card p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">
            Execution Fidelity
          </span>
          <div className="p-1.5 rounded-md bg-[#21262d] text-emerald-400 border border-[#30363d]">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-emerald-400">
            {executionRate}%
          </span>
          <span className="text-xs text-[#8b949e]">
            ({executedTrades.length}/{totalPlans} executed)
          </span>
        </div>

        <div className="mt-3 w-full bg-[#21262d] h-1 rounded-full overflow-hidden">
          <div 
            className="bg-emerald-400 h-full transition-all duration-300" 
            style={{ width: `${executionRate}%` }} 
          />
        </div>
      </div>

      {/* EOD Win Rate */}
      <div className="slate-card p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">
            EOD Win Rate
          </span>
          <div className="p-1.5 rounded-md bg-[#21262d] text-blue-400 border border-[#30363d]">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-blue-300">
            {winRate}%
          </span>
          <span className="text-xs text-[#8b949e]">
            ({winTrades.length}/{reviewedTrades.length} wins)
          </span>
        </div>

        <div className="mt-3 w-full bg-[#21262d] h-1 rounded-full overflow-hidden">
          <div 
            className="bg-blue-400 h-full transition-all duration-300" 
            style={{ width: `${winRate}%` }} 
          />
        </div>
      </div>

    </div>
  );
}
