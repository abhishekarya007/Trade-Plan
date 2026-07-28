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
      <div className="slate-card p-8 text-center text-[#8b949e]">
        <p className="text-xs">No trade data available for analytics.</p>
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
    <div className="space-y-6">
      
      {/* Section 1: Top Key Performance Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Long Win Rate */}
        <div className="slate-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#8b949e] text-xs mb-2 font-medium">
              <span>Long Trades 📈</span>
              <TrendingUp className="h-4 w-4 text-emerald-400/70" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-emerald-400/90">{longWinRate}%</span>
              <span className="text-xs text-[#8b949e]">{longWins.length}/{longTrades.length} wins</span>
            </div>
          </div>
          <div className="mt-4 w-full bg-[#21262d] h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500/50 h-full" style={{ width: `${longWinRate}%` }} />
          </div>
        </div>

        {/* Short Win Rate */}
        <div className="slate-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#8b949e] text-xs mb-2 font-medium">
              <span>Short Trades 📉</span>
              <TrendingDown className="h-4 w-4 text-rose-400/70" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-rose-400/90">{shortWinRate}%</span>
              <span className="text-xs text-[#8b949e]">{shortWins.length}/{shortTrades.length} wins</span>
            </div>
          </div>
          <div className="mt-4 w-full bg-[#21262d] h-1.5 rounded-full overflow-hidden">
            <div className="bg-rose-500/50 h-full" style={{ width: `${shortWinRate}%` }} />
          </div>
        </div>

        {/* Style Efficiency */}
        <div className="slate-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#8b949e] text-xs mb-2 font-medium">
              <span>Style Efficiency</span>
              <Zap className="h-4 w-4 text-amber-400/70" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-[#c9d1d9]">{dirWinRate}% Dir</span>
              <span className="text-xs text-[#8b949e] font-mono">/ {scalpWinRate}% Scalp</span>
            </div>
          </div>
          <div className="mt-4 w-full bg-[#21262d] h-1.5 rounded-full overflow-hidden flex">
            <div className="bg-cyan-500/50 h-full" style={{ width: `${dirWinRate}%` }} />
          </div>
        </div>

        {/* Bias Alignment Confluence */}
        <div className="slate-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#8b949e] text-xs mb-2 font-medium">
              <span>Bias Confluence</span>
              <Compass className="h-4 w-4 text-cyan-400/70" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-cyan-300/90">{alignedWinRate}%</span>
              <span className="text-xs text-[#8b949e]">when W & D match</span>
            </div>
          </div>
          <div className="mt-4 w-full bg-[#21262d] h-1.5 rounded-full overflow-hidden">
            <div className="bg-cyan-500/50 h-full" style={{ width: `${alignedWinRate}%` }} />
          </div>
        </div>

      </div>

      {/* Section 2: Behavioral & Psychological Audit Insight Panel */}
      <div className="slate-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-[#8b949e]" />
            <h3 className="text-xs font-semibold text-[#f0f6fc] uppercase tracking-wider">
              Behavioral Tag & Mindset Impact Audit
            </h3>
          </div>
          <span className="text-xs text-[#8b949e] font-mono">Disciplined vs Mistake Comparison</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Disciplined Trades Performance */}
          <div className="p-4 bg-[#0d1117] rounded-xl border border-emerald-500/20 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-emerald-400/90 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-emerald-400/70" />
                <span>Disciplined Execution Trades</span>
              </span>
              <span className="font-mono text-xs font-bold text-emerald-400/90">
                {disciplinedWinRate}% Win Rate
              </span>
            </div>
            <p className="text-xs text-[#8b949e] leading-relaxed">
              {disciplinedWins.length} wins out of {disciplinedTrades.length} trades tagged with patience or rule adherence.
            </p>
            <div className="w-full bg-[#21262d] h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500/50 h-full" style={{ width: `${disciplinedWinRate}%` }} />
            </div>
          </div>

          {/* Mistake Trades Performance */}
          <div className="p-4 bg-[#0d1117] rounded-xl border border-rose-500/20 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-rose-400/90 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-rose-400/70" />
                <span>Behavioral Mistake Trades</span>
              </span>
              <span className="font-mono text-xs font-bold text-rose-400/90">
                {mistakeWinRate}% Win Rate
              </span>
            </div>
            <p className="text-xs text-[#8b949e] leading-relaxed">
              {mistakeWins.length} wins out of {mistakeTradeList.length} trades affected by FOMO, early exit, or revenge trading.
            </p>
            <div className="w-full bg-[#21262d] h-1.5 rounded-full overflow-hidden">
              <div className="bg-rose-500/50 h-full" style={{ width: `${mistakeWinRate}%` }} />
            </div>
          </div>

        </div>
      </div>

      {/* Section 3: Main Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Strategy Win Rate Breakdown */}
        <div className="slate-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-cyan-400/70" />
              <h3 className="text-xs font-semibold text-[#f0f6fc] uppercase tracking-wider">
                Setup Strategy Performance
              </h3>
            </div>
            <span className="text-xs text-[#8b949e] font-mono">Ranked by Win Rate</span>
          </div>

          <div className="space-y-3.5">
            {setupStats.map((st) => (
              <div key={st.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#c9d1d9]">{st.name}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-[#8b949e] text-[11px]">{st.wins}/{st.reviewed} wins</span>
                    <span className={`font-semibold ${st.winRate >= 50 ? 'text-emerald-400/90' : 'text-amber-400/90'}`}>
                      {st.winRate}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-[#21262d] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${st.winRate >= 50 ? 'bg-emerald-500/50' : 'bg-amber-500/50'}`}
                    style={{ width: `${st.winRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Execution Status Distribution */}
        <div className="slate-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-400/70" />
              <h3 className="text-xs font-semibold text-[#f0f6fc] uppercase tracking-wider">
                Execution Status Distribution
              </h3>
            </div>
            <span className="text-xs text-[#8b949e] font-mono">{trades.length} Total Plans</span>
          </div>

          <div className="space-y-3">
            {EXECUTION_STATUSES.map((statusName) => {
              const count = statusCounts[statusName] || 0;
              const percentage = trades.length > 0 ? Math.round((count / trades.length) * 100) : 0;
              
              if (count === 0) return null;

              return (
                <div key={statusName} className="p-3 bg-[#0d1117] rounded-xl border border-[#30363d] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#c9d1d9]">{statusName}</span>
                    <span className="font-mono font-semibold text-[#8b949e]">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-[#21262d] h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${
                        statusName === 'Executed as Planned' 
                          ? 'bg-emerald-500/50' 
                          : statusName === 'Impulse Trade' 
                          ? 'bg-rose-500/50' 
                          : statusName === 'Not Valid Plan'
                          ? 'bg-amber-500/50'
                          : 'bg-blue-500/50'
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
      <div className="slate-card p-5">
        <div className="flex items-center gap-2 mb-3.5">
          <Tag className="h-4 w-4 text-[#8b949e]" />
          <h3 className="text-xs font-semibold text-[#f0f6fc] uppercase tracking-wider">
            Behavioral Tag Frequency
          </h3>
        </div>

        {sortedTags.length === 0 ? (
          <p className="text-xs text-[#8b949e]">No behavioral tags recorded yet. Tag your trades during End-of-Day review!</p>
        ) : (
          <div className="flex flex-wrap gap-2 pt-1">
            {sortedTags.map(([tagName, count]) => {
              const isMistake = mistakeTags.includes(tagName);
              return (
                <div 
                  key={tagName}
                  className={`flex items-center gap-2 bg-[#0d1117] border px-3 py-1.5 rounded-lg text-xs ${
                    isMistake ? 'border-rose-500/20 text-rose-400/90' : 'border-emerald-500/20 text-emerald-400/90'
                  }`}
                >
                  <span className="font-medium">#{tagName}</span>
                  <span className="bg-[#21262d] font-mono text-[10px] text-[#8b949e] px-1.5 py-0.5 rounded">
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
