import React from 'react';
import { BarChart3, PieChart, ShieldAlert, Award, Layers, TrendingUp, Tag, CheckCircle2 } from 'lucide-react';
import { SETUP_TYPES, EMOTION_TAGS } from '../types/trade';

export default function AnalyticsView({ trades }) {
  if (!trades || trades.length === 0) {
    return (
      <div className="glass-panel p-8 text-center text-slate-400">
        <p className="text-sm">No trade data available for analytics.</p>
      </div>
    );
  }

  // 1. Setup Strategy Performance Calculation
  const setupStats = SETUP_TYPES.map(setup => {
    const setupTrades = trades.filter(t => t.setupType === setup);
    const reviewed = setupTrades.filter(t => t.outcome && t.outcome !== 'Pending EOD' && t.outcome !== 'No Trade');
    const wins = reviewed.filter(t => t.outcome === 'Target Hit' || t.outcome === 'Partial Profit');
    const winRate = reviewed.length > 0 ? Math.round((wins.length / reviewed.length) * 100) : 0;
    
    return {
      name: setup,
      total: setupTrades.length,
      reviewed: reviewed.length,
      wins: wins.length,
      winRate
    };
  }).filter(s => s.total > 0).sort((a, b) => b.total - a.total);

  // 2. Behavioral Tag Frequencies
  const tagCounts = {};
  trades.forEach(t => {
    if (t.tags && Array.isArray(t.tags)) {
      t.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });

  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

  // 3. Execution Status Distribution
  const statusCounts = {};
  trades.forEach(t => {
    const st = t.status || 'Planned';
    statusCounts[st] = (statusCounts[st] || 0) + 1;
  });

  // 4. Bias Alignment Performance
  const alignedTrades = trades.filter(t => t.weeklyBias === t.dailyBias && t.weeklyBias !== 'Neutral');
  const alignedWins = alignedTrades.filter(t => t.outcome === 'Target Hit' || t.outcome === 'Partial Profit');
  const alignedWinRate = alignedTrades.length > 0 ? Math.round((alignedWins.length / alignedTrades.length) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Top Banner KPI highlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Bias Confluence Win Rate */}
        <div className="glass-card p-4 border border-cyan-500/30">
          <div className="flex items-center gap-2 mb-1 text-slate-400 text-xs font-medium">
            <TrendingUp className="h-4 w-4 text-cyan-400" />
            <span>Weekly + Daily Bias Alignment</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-cyan-300">{alignedWinRate}%</span>
            <span className="text-xs text-slate-400">win rate when W & D match</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {alignedWins.length} wins out of {alignedTrades.length} bias-aligned trades.
          </p>
        </div>

        {/* Most Frequent Setup */}
        <div className="glass-card p-4 border border-emerald-500/30">
          <div className="flex items-center gap-2 mb-1 text-slate-400 text-xs font-medium">
            <Layers className="h-4 w-4 text-emerald-400" />
            <span>Top Performing Setup</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-emerald-300">
              {setupStats.length > 0 ? setupStats[0].name : 'N/A'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {setupStats.length > 0 ? `${setupStats[0].winRate}% win rate across ${setupStats[0].total} plans` : 'No setups yet'}
          </p>
        </div>

        {/* Top Discipline Mindset */}
        <div className="glass-card p-4 border border-amber-500/30">
          <div className="flex items-center gap-2 mb-1 text-slate-400 text-xs font-medium">
            <Award className="h-4 w-4 text-amber-400" />
            <span>Primary Mindset Tag</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-amber-300">
              {sortedTags.length > 0 ? `#${sortedTags[0][0]}` : 'No tags'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {sortedTags.length > 0 ? `Tagged ${sortedTags[0][1]} times in EOD reviews` : 'Tag your trades in EOD review'}
          </p>
        </div>

      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Setup Strategy Performance Table */}
        <div className="glass-panel p-5 border border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Strategy / Setup Win Rate Breakdown</h3>
          </div>

          <div className="space-y-4">
            {setupStats.map((st) => (
              <div key={st.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{st.name}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400 text-[11px]">{st.wins}/{st.reviewed} wins ({st.total} planned)</span>
                    <span className={`font-bold ${st.winRate >= 50 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {st.winRate}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${st.winRate >= 50 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${st.winRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Execution Fidelity Distribution */}
        <div className="glass-panel p-5 border border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Plan Execution Fidelity Audit</h3>
          </div>

          <div className="space-y-3">
            {Object.entries(statusCounts).map(([statusName, count]) => {
              const percentage = Math.round((count / trades.length) * 100);
              return (
                <div key={statusName} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-300">{statusName}</span>
                    <span className="font-mono font-bold text-cyan-400">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        statusName === 'Executed as Planned' ? 'bg-emerald-500' : statusName === 'Impulse Trade' ? 'bg-rose-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Behavioral & Psychology Tag Cloud */}
      <div className="glass-panel p-5 border border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="h-4 w-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white">Psychology & Discipline Tag Frequency</h3>
        </div>

        {sortedTags.length === 0 ? (
          <p className="text-xs text-slate-500">No behavioral tags recorded yet. Select tags during your End-of-Day review!</p>
        ) : (
          <div className="flex flex-wrap gap-2 pt-2">
            {sortedTags.map(([tagName, count]) => (
              <div 
                key={tagName}
                className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs"
              >
                <span className="text-cyan-300 font-medium">#{tagName}</span>
                <span className="bg-slate-800 font-mono text-[10px] font-bold text-slate-300 px-1.5 py-0.5 rounded-md">
                  {count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
