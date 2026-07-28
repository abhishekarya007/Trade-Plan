import React from 'react';
import { Target, CheckCircle2, Award, Flame, AlertCircle } from 'lucide-react';

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

  const reviewedWithDiscipline = trades.filter(t => t.disciplineScore && t.disciplineScore > 0);
  const avgDiscipline = reviewedWithDiscipline.length > 0
    ? (reviewedWithDiscipline.reduce((acc, curr) => acc + curr.disciplineScore, 0) / reviewedWithDiscipline.length).toFixed(1)
    : '0.0';

  const pendingReviews = trades.filter(t => t.outcome === 'Pending EOD' || t.status === 'Planned');

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* Card 1: Total Trade Plans */}
      <div className="glass-card p-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-3 opacity-15 text-cyan-400 group-hover:scale-110 transition-transform">
          <Target className="h-10 w-10" />
        </div>
        <div className="flex items-center gap-2 mb-1 text-slate-400 text-xs font-medium">
          <Target className="h-3.5 w-3.5 text-cyan-400" />
          <span>Total Trade Plans</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-white">{totalPlans}</span>
          <span className="text-[11px] text-slate-400">
            {pendingReviews.length} pending EOD review
          </span>
        </div>
        <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-cyan-500 h-full transition-all duration-500" 
            style={{ width: `${totalPlans > 0 ? 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Card 2: Execution Rate */}
      <div className="glass-card p-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-3 opacity-15 text-blue-400 group-hover:scale-110 transition-transform">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div className="flex items-center gap-2 mb-1 text-slate-400 text-xs font-medium">
          <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />
          <span>Plan Execution Rate</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-blue-400">{executionRate}%</span>
          <span className="text-[11px] text-slate-400">
            {executedTrades.length} / {totalPlans} executed
          </span>
        </div>
        <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-blue-500 h-full transition-all duration-500" 
            style={{ width: `${executionRate}%` }}
          />
        </div>
      </div>

      {/* Card 3: Win Rate */}
      <div className="glass-card p-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-3 opacity-15 text-emerald-400 group-hover:scale-110 transition-transform">
          <Flame className="h-10 w-10" />
        </div>
        <div className="flex items-center gap-2 mb-1 text-slate-400 text-xs font-medium">
          <Flame className="h-3.5 w-3.5 text-emerald-400" />
          <span>EOD Win Rate</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-bold font-mono ${winRate >= 50 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {winRate}%
          </span>
          <span className="text-[11px] text-slate-400">
            {winTrades.length} target hits
          </span>
        </div>
        <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-emerald-500 h-full transition-all duration-500" 
            style={{ width: `${winRate}%` }}
          />
        </div>
      </div>

      {/* Card 4: Avg Discipline Rating */}
      <div className="glass-card p-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-3 opacity-15 text-amber-400 group-hover:scale-110 transition-transform">
          <Award className="h-10 w-10" />
        </div>
        <div className="flex items-center gap-2 mb-1 text-slate-400 text-xs font-medium">
          <Award className="h-3.5 w-3.5 text-amber-400" />
          <span>Avg Discipline Score</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-amber-400">
            {avgDiscipline} <span className="text-sm font-normal text-slate-400">/ 5.0</span>
          </span>
          <span className="text-[11px] font-mono text-amber-300">
            {'★'.repeat(Math.round(Number(avgDiscipline)))}
          </span>
        </div>
        <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-amber-500 h-full transition-all duration-500" 
            style={{ width: `${(Number(avgDiscipline) / 5) * 100}%` }}
          />
        </div>
      </div>

    </div>
  );
}
