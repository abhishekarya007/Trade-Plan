import React from 'react';
import { Target, CheckCircle2, Flame } from 'lucide-react';

export default function KpiSummary({ trades }) {
  const totalPlans = trades.length;

  const executedTrades = trades.filter(t => 
    t.status === 'Executed as Planned' || t.status === 'Executed with Variation' || t.status === 'Impulse Trade'
  );

  const completedReviews = trades.filter(t => t.outcome && t.outcome !== 'Pending EOD' && t.outcome !== 'No Trade');

  const winTrades = completedReviews.filter(t => t.outcome === 'Target Hit' || t.outcome === 'Partial Profit');
  
  const winRate = completedReviews.length > 0
    ? Math.round((winTrades.length / completedReviews.length) * 100)
    : 0;

  const executionRate = totalPlans > 0
    ? Math.round((executedTrades.length / totalPlans) * 100)
    : 0;

  const pendingReviews = trades.filter(t => t.outcome === 'Pending EOD' || t.status === 'Planned');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-5">
      
      {/* Card 1: Total Trade Plans */}
      <div className="glass-card p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5 font-medium">
            <span>Total Plans</span>
            <Target className="h-4 w-4 text-cyan-400/70" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-100">{totalPlans}</span>
            <span className="text-[11px] text-slate-500">
              {pendingReviews.length} pending
            </span>
          </div>
        </div>
        <div className="mt-3 w-full bg-slate-800/60 h-1 rounded-full overflow-hidden">
          <div className="bg-cyan-500/80 h-full" style={{ width: `${totalPlans > 0 ? 100 : 0}%` }} />
        </div>
      </div>

      {/* Card 2: Execution Rate */}
      <div className="glass-card p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5 font-medium">
            <span>Execution Rate</span>
            <CheckCircle2 className="h-4 w-4 text-blue-400/70" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-100">{executionRate}%</span>
            <span className="text-[11px] text-slate-500">
              {executedTrades.length} / {totalPlans} executed
            </span>
          </div>
        </div>
        <div className="mt-3 w-full bg-slate-800/60 h-1 rounded-full overflow-hidden">
          <div className="bg-blue-400/80 h-full" style={{ width: `${executionRate}%` }} />
        </div>
      </div>

      {/* Card 3: Win Rate */}
      <div className="glass-card p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5 font-medium">
            <span>EOD Win Rate</span>
            <Flame className="h-4 w-4 text-emerald-400/70" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-100">
              {winRate}%
            </span>
            <span className="text-[11px] text-slate-500">
              {winTrades.length} targets hit
            </span>
          </div>
        </div>
        <div className="mt-3 w-full bg-slate-800/60 h-1 rounded-full overflow-hidden">
          <div className="bg-emerald-400/80 h-full" style={{ width: `${winRate}%` }} />
        </div>
      </div>

    </div>
  );
}
