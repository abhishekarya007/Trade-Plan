import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  CheckCircle2, 
  Tag, 
  Compass,
  AlertTriangle,
  Award,
  ShieldAlert
} from 'lucide-react';
import { SETUP_TYPES, EXECUTION_STATUSES } from '../types/trade';

export default function AnalyticsView({ trades }) {
  if (!trades || trades.length === 0) {
    return (
      <div className="glass-panel p-8 text-center text-slate-400">
        <p className="text-sm">No trade data available for analytics.</p>
      </div>
    );
  }

  // Helper for Reviewed Trades with actual outcome
  const reviewedTrades = trades.filter(t => t.outcome && t.outcome !== 'Pending EOD' && t.outcome !== 'No Trade');

  // 1. Long vs Short Performance
  const longTrades = reviewedTrades.filter(t => (t.tradeDirection || 'Long') === 'Long');
  const longWins = longTrades.filter(t => t.outcome === 'Target Hit' || t.outcome === 'Partial Profit');
  const longWinRate = longTrades.length > 0 ? Math.round((longWins.length / longTrades.length) * 100) : 0;

  const shortTrades = reviewedTrades.filter(t => t.tradeDirection === 'Short');
  const shortWins = shortTrades.filter(t => t.outcome === 'Target Hit' || t.outcome === 'Partial Profit');
  const shortWinRate = shortTrades.length > 0 ? Math.round((shortWins.length / shortTrades.length) * 100) : 0;

  // 2. Directional vs Scalping Performance
  const dirTrades = reviewedTrades.filter(t => (t.tradeStyle || 'Directional') === 'Directional');
  const dirWins = dirTrades.filter(t => t.outcome === 'Target Hit' || t.outcome === 'Partial Profit');
  const dirWinRate = dirTrades.length > 0 ? Math.round((dirWins.length / dirTrades.length) * 100) : 0;

  const scalpTrades = reviewedTrades.filter(t => t.tradeStyle === 'Scalping');
  const scalpWins = scalpTrades.filter(t => t.outcome === 'Target Hit' || t.outcome === 'Partial Profit');
  const scalpWinRate = scalpTrades.length > 0 ? Math.round((scalpWins.length / scalpTrades.length) * 100) : 0;

  // 3. Weekly + Daily Bias Alignment Success
  const alignedTrades = reviewedTrades.filter(t => t.weeklyBias === t.dailyBias && t.weeklyBias !== 'Neutral');
  const alignedWins = alignedTrades.filter(t => t.outcome === 'Target Hit' || t.outcome === 'Partial Profit');
  const alignedWinRate = alignedTrades.length > 0 ? Math.round((alignedWins.length / alignedTrades.length) * 100) : 0;

  // 4. Behavioral & Psychology Tag Impact Analysis
  const disciplinedTags = ['Disciplined Execution', 'Patience Paid Off', 'Followed Rules 100%'];
  const mistakeTags = ['FOMO Entry', 'Early Exit', 'Hesitation / Missed Entry', 'Revenge Trade', 'Over-Leveraged'];

  const disciplinedTrades = reviewedTrades.filter(t => 
    t.tags && t.tags.some(tag => disciplinedTags.includes(tag))
  );
  const disciplinedWins = disciplinedTrades.filter(t => t.outcome === 'Target Hit' || t.outcome === 'Partial Profit');
  const disciplinedWinRate = disciplinedTrades.length > 0 ? Math.round((disciplinedWins.length / disciplinedTrades.length) * 100) : 0;

  const mistakeTradeList = reviewedTrades.filter(t => 
    t.tags && t.tags.some(tag => mistakeTags.includes(tag))
  );
  const mistakeWins = mistakeTradeList.filter(t => t.outcome === 'Target Hit' || t.outcome === 'Partial Profit');
  const mistakeWinRate = mistakeTradeList.length > 0 ? Math.round((mistakeWins.length / mistakeTradeList.length) * 100) : 0;

  // 5. Setup Strategy Performance
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
  }).filter(s => s.total > 0).sort((a, b) => b.winRate - a.winRate);

  // 6. Execution Status Breakdown
  const statusCounts = {};
  trades.forEach(t => {
    const st = t.status || 'Planned';
    statusCounts[st] = (statusCounts[st] || 0) + 1;
  });

  // 7. Behavioral Tag Frequencies
  const tagCounts = {};
  trades.forEach(t => {
    if (t.tags && Array.isArray(t.tags)) {
      t.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });

  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-5">
      
      {/* Section 1: Top Key Performance Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Long Win Rate */}
        <div className="glass-card p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-medium">
              <span>Long Trades 📈</span>
              <TrendingUp className="h-4 w-4 text-emerald-400/80" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-emerald-400">{longWinRate}%</span>
              <span className="text-[11px] text-slate-500">{longWins.length}/{longTrades.length} wins</span>
            </div>
          </div>
          <div className="mt-3 w-full bg-slate-800/60 h-1 rounded-full overflow-hidden">
            <div className="bg-emerald-400/80 h-full" style={{ width: `${longWinRate}%` }} />
          </div>
        </div>

        {/* Short Win Rate */}
        <div className="glass-card p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-medium">
              <span>Short Trades 📉</span>
              <TrendingDown className="h-4 w-4 text-rose-400/80" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-rose-400">{shortWinRate}%</span>
              <span className="text-[11px] text-slate-500">{shortWins.length}/{shortTrades.length} wins</span>
            </div>
          </div>
          <div className="mt-3 w-full bg-slate-800/60 h-1 rounded-full overflow-hidden">
            <div className="bg-rose-400/80 h-full" style={{ width: `${shortWinRate}%` }} />
          </div>
        </div>

        {/* Style Efficiency */}
        <div className="glass-card p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-medium">
              <span>Style Efficiency</span>
              <Zap className="h-4 w-4 text-amber-400/80" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-slate-100">{dirWinRate}% Dir</span>
              <span className="text-xs text-slate-400 font-mono">/ {scalpWinRate}% Scalp</span>
            </div>
          </div>
          <div className="mt-3 w-full bg-slate-800/60 h-1 rounded-full overflow-hidden flex">
            <div className="bg-cyan-400/80 h-full" style={{ width: `${dirWinRate}%` }} />
          </div>
        </div>

        {/* Bias Alignment Confluence */}
        <div className="glass-card p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-medium">
              <span>Bias Confluence</span>
              <Compass className="h-4 w-4 text-cyan-400/80" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-cyan-300">{alignedWinRate}%</span>
              <span className="text-[11px] text-slate-500">when W & D match</span>
            </div>
          </div>
          <div className="mt-3 w-full bg-slate-800/60 h-1 rounded-full overflow-hidden">
            <div className="bg-cyan-400/80 h-full" style={{ width: `${alignedWinRate}%` }} />
          </div>
        </div>

      </div>

      {/* Section 2: Behavioral & Psychological Audit Insight Panel */}
      <div className="glass-panel p-5 border border-slate-800/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-400/80" />
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Behavioral Tag & Mindset Impact Audit
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Disciplined vs Mistake Comparison</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Disciplined Trades Performance */}
          <div className="p-3.5 bg-[#0c101a] rounded-xl border border-emerald-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-emerald-400" />
                <span>Disciplined Execution Trades</span>
              </span>
              <span className="font-mono text-xs font-bold text-emerald-300">
                {disciplinedWinRate}% Win Rate
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {disciplinedWins.length} wins out of {disciplinedTrades.length} trades tagged with patience or rule adherence.
            </p>
            <div className="w-full bg-slate-800/60 h-1 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full" style={{ width: `${disciplinedWinRate}%` }} />
            </div>
          </div>

          {/* Mistake Trades Performance */}
          <div className="p-3.5 bg-[#0c101a] rounded-xl border border-rose-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                <span>Behavioral Mistake Trades</span>
              </span>
              <span className="font-mono text-xs font-bold text-rose-400">
                {mistakeWinRate}% Win Rate
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {mistakeWins.length} wins out of {mistakeTradeList.length} trades affected by FOMO, early exit, or revenge trading.
            </p>
            <div className="w-full bg-slate-800/60 h-1 rounded-full overflow-hidden">
              <div className="bg-rose-400 h-full" style={{ width: `${mistakeWinRate}%` }} />
            </div>
          </div>

        </div>
      </div>

      {/* Section 3: Main Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Strategy Win Rate Breakdown */}
        <div className="glass-panel p-5 border border-slate-800/60">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-cyan-400/80" />
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Setup Strategy Performance
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Ranked by Win Rate</span>
          </div>

          <div className="space-y-3.5">
            {setupStats.map((st) => (
              <div key={st.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-300">{st.name}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-500 text-[11px]">{st.wins}/{st.reviewed} wins</span>
                    <span className={`font-semibold ${st.winRate >= 50 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {st.winRate}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-800/60 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${st.winRate >= 50 ? 'bg-emerald-400/80' : 'bg-amber-400/80'}`}
                    style={{ width: `${st.winRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Execution Status Distribution */}
        <div className="glass-panel p-5 border border-slate-800/60">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-400/80" />
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Execution Status Distribution
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">{trades.length} Total Plans</span>
          </div>

          <div className="space-y-2.5">
            {EXECUTION_STATUSES.map((statusName) => {
              const count = statusCounts[statusName] || 0;
              const percentage = trades.length > 0 ? Math.round((count / trades.length) * 100) : 0;
              
              if (count === 0) return null;

              return (
                <div key={statusName} className="p-2.5 bg-[#0c101a] rounded-xl border border-slate-800/60">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-slate-300">{statusName}</span>
                    <span className="font-mono font-semibold text-slate-400">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-800/60 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${
                        statusName === 'Executed as Planned' 
                          ? 'bg-emerald-400/80' 
                          : statusName === 'Impulse Trade' 
                          ? 'bg-rose-400/80' 
                          : statusName === 'Not Valid Plan'
                          ? 'bg-amber-400/80'
                          : 'bg-blue-400/80'
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

      {/* Section 4: Psychology Tag Cloud */}
      <div className="glass-panel p-5 border border-slate-800/60">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="h-4 w-4 text-amber-400/80" />
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Behavioral Tag Frequency
          </h3>
        </div>

        {sortedTags.length === 0 ? (
          <p className="text-xs text-slate-500">No behavioral tags recorded yet. Tag your trades during End-of-Day review!</p>
        ) : (
          <div className="flex flex-wrap gap-2 pt-1">
            {sortedTags.map(([tagName, count]) => {
              const isMistake = mistakeTags.includes(tagName);
              return (
                <div 
                  key={tagName}
                  className={`flex items-center gap-2 bg-[#0c101a] border px-3 py-1 rounded-lg text-xs ${
                    isMistake ? 'border-rose-900/60' : 'border-emerald-900/60'
                  }`}
                >
                  <span className={isMistake ? 'text-rose-400 font-medium' : 'text-emerald-400 font-medium'}>
                    #{tagName}
                  </span>
                  <span className="bg-slate-800 font-mono text-[10px] text-slate-400 px-1.5 py-0.2 rounded">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
