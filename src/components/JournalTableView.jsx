import React, { useState, useMemo } from 'react';
import { 
  Edit3, 
  CheckSquare, 
  Trash2, 
  Calendar, 
  Eye, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  Flame, 
  ChevronsUpDown,
  ChevronsDownUp
} from 'lucide-react';

export default function JournalTableView({ trades, onSelectTrade, onEditPlan, onDeletePlan, onOpenEodReview }) {
  // Group trades by date
  const groupedTrades = useMemo(() => {
    if (!trades || trades.length === 0) return [];

    const groups = {};
    trades.forEach(t => {
      const d = t.date || 'Unknown Date';
      if (!groups[d]) {
        groups[d] = [];
      }
      groups[d].push(t);
    });

    // Sort dates descending (newest date first)
    const sortedDates = Object.keys(groups).sort((a, b) => new Date(b) - new Date(a));

    return sortedDates.map(dateStr => {
      const dayTrades = groups[dateStr];

      // Calculate Daily Summary Metrics
      const totalPlans = dayTrades.length;
      const executed = dayTrades.filter(t => 
        t.status === 'Executed as Planned' || t.status === 'Executed with Variation' || t.status === 'Impulse Trade'
      );
      const reviewed = dayTrades.filter(t => t.outcome && t.outcome !== 'Pending EOD' && t.outcome !== 'No Trade');
      const wins = reviewed.filter(t => t.outcome === 'Target Hit' || t.outcome === 'Partial Profit');
      const winRate = reviewed.length > 0 ? Math.round((wins.length / reviewed.length) * 100) : 0;

      return {
        date: dateStr,
        trades: dayTrades,
        totalPlans,
        executedCount: executed.length,
        reviewedCount: reviewed.length,
        winsCount: wins.length,
        winRate
      };
    });
  }, [trades]);

  // Track expanded dates
  const [expandedDates, setExpandedDates] = useState(() => {
    const initial = {};
    if (trades) {
      trades.forEach(t => { if (t.date) initial[t.date] = true; });
    }
    return initial;
  });

  const toggleDateAccordion = (dateStr) => {
    setExpandedDates(prev => ({
      ...prev,
      [dateStr]: !prev[dateStr]
    }));
  };

  const expandAll = () => {
    const all = {};
    groupedTrades.forEach(g => { all[g.date] = true; });
    setExpandedDates(all);
  };

  const collapseAll = () => {
    setExpandedDates({});
  };

  const formatDateLabel = (dateStr) => {
    if (!dateStr || dateStr === 'Unknown Date') return 'Unknown Date';
    
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    try {
      const d = new Date(dateStr + 'T00:00:00');
      const formatted = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      
      if (dateStr === today) return `Today • ${formatted}`;
      if (dateStr === yesterday) return `Yesterday • ${formatted}`;
      return formatted;
    } catch (e) {
      return dateStr;
    }
  };

  if (!trades || trades.length === 0) {
    return (
      <div className="glass-panel p-8 text-center text-slate-400">
        <p className="text-sm">No trade plans found matching your criteria.</p>
      </div>
    );
  }

  const allExpanded = groupedTrades.every(g => expandedDates[g.date]);

  return (
    <div className="space-y-3">
      
      {/* Accordion Controls Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1 py-0.5">
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-medium text-slate-300">
            {groupedTrades.length} Trading {groupedTrades.length === 1 ? 'Day' : 'Days'}
          </span>
        </div>

        <button
          onClick={allExpanded ? collapseAll : expandAll}
          className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors text-xs font-medium"
        >
          {allExpanded ? (
            <>
              <ChevronsDownUp className="h-3.5 w-3.5" />
              <span>Collapse All</span>
            </>
          ) : (
            <>
              <ChevronsUpDown className="h-3.5 w-3.5" />
              <span>Expand All</span>
            </>
          )}
        </button>
      </div>

      {/* Date-wise Accordion Groups */}
      <div className="space-y-3">
        {groupedTrades.map((group) => {
          const isExpanded = !!expandedDates[group.date];

          return (
            <div 
              key={group.date}
              className="glass-panel overflow-hidden border border-slate-800/60 rounded-xl transition-all"
            >
              {/* Accordion Header Row */}
              <div
                onClick={() => toggleDateAccordion(group.date)}
                className={`px-4 py-3 flex flex-wrap items-center justify-between gap-3 cursor-pointer select-none transition-colors ${
                  isExpanded ? 'bg-[#151c2c]/80 border-b border-slate-800/60' : 'bg-[#111622]/60 hover:bg-[#151c2c]/50'
                }`}
              >
                {/* Date & Expand Icon */}
                <div className="flex items-center gap-2.5">
                  <div className="text-slate-400">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-cyan-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-500" />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-slate-100 font-sans tracking-wide">
                      {formatDateLabel(group.date)}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md border border-slate-700/50">
                      {group.totalPlans} {group.totalPlans === 1 ? 'plan' : 'plans'}
                    </span>
                  </div>
                </div>

                {/* Daily Metrics Summary */}
                <div className="flex items-center gap-4 text-xs font-mono">
                  
                  {/* Executed Ratio */}
                  <div className="flex items-center gap-1 text-slate-400">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-400/80" />
                    <span>{group.executedCount}/{group.totalPlans} executed</span>
                  </div>

                  {/* Daily Win Rate */}
                  {group.reviewedCount > 0 && (
                    <div className="flex items-center gap-1 font-medium">
                      <Flame className="h-3.5 w-3.5 text-emerald-400/80" />
                      <span className={group.winRate >= 50 ? 'text-emerald-400' : 'text-amber-400'}>
                        {group.winRate}% win ({group.winsCount}/{group.reviewedCount})
                      </span>
                    </div>
                  )}

                </div>

              </div>

              {/* Accordion Content Body (Table) */}
              {isExpanded && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    
                    {/* Sub-Header */}
                    <thead className="bg-[#0e131f]/90 text-slate-400 font-medium border-b border-slate-800/40 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-2.5 px-4">Stock</th>
                        <th className="py-2.5 px-4">Dir</th>
                        <th className="py-2.5 px-4">Biases (W/D)</th>
                        <th className="py-2.5 px-4">Setup Strategy</th>
                        <th className="py-2.5 px-4">Conviction</th>
                        <th className="py-2.5 px-4">Pre-Market Plan Rationale</th>
                        <th className="py-2.5 px-4">Execution Status</th>
                        <th className="py-2.5 px-4">Outcome</th>
                        <th className="py-2.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>

                    {/* Trade Rows */}
                    <tbody className="divide-y divide-slate-800/30 font-sans">
                      {group.trades.map((t) => (
                        <tr 
                          key={t.id} 
                          onClick={() => onSelectTrade(t)}
                          className="hover:bg-slate-800/30 cursor-pointer transition-colors group"
                          title="Click to view details"
                        >
                          
                          {/* Stock Ticker */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 font-mono font-bold text-xs text-slate-100 group-hover:text-cyan-300 transition-colors">
                              <span>{t.symbol}</span>
                              <span className="text-[10px] bg-slate-800/50 text-slate-400 px-1.5 py-0.2 rounded font-normal">
                                {t.exchange || 'NSE'}
                              </span>
                            </div>
                          </td>

                          {/* Direction */}
                          <td className="py-3 px-4 whitespace-nowrap font-mono text-xs">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                              t.tradeDirection === 'Short'
                                ? 'bg-rose-950/60 text-rose-400 border-rose-900/60'
                                : 'bg-emerald-950/60 text-emerald-400 border-emerald-900/60'
                            }`}>
                              {t.tradeDirection === 'Short' ? '📉 Short' : '📈 Long'}
                            </span>
                          </td>

                          {/* Biases */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-[11px]">
                              <span className={t.weeklyBias === 'Bullish' ? 'text-emerald-400' : t.weeklyBias === 'Bearish' ? 'text-rose-400' : 'text-amber-400'}>
                                W: {t.weeklyBias || 'Neutral'}
                              </span>
                              <span className={t.dailyBias === 'Bullish' ? 'text-emerald-400' : t.dailyBias === 'Bearish' ? 'text-rose-400' : 'text-amber-400'}>
                                D: {t.dailyBias || 'Neutral'}
                              </span>
                            </div>
                          </td>

                          {/* Setup Strategy */}
                          <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-300">
                            <span className="bg-[#0b0f17] px-2 py-0.5 rounded border border-slate-800 text-[11px]">
                              {t.setupType || 'General'}
                            </span>
                          </td>

                          {/* Conviction */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className={`font-mono text-xs ${
                              t.conviction === 'High' ? 'text-amber-400 font-semibold' : 'text-slate-400'
                            }`}>
                              {t.conviction || 'Medium'}
                            </span>
                          </td>

                          {/* Rationale */}
                          <td className="py-3 px-4 max-w-xs">
                            <p className="text-slate-400 truncate text-[11px]" title={t.planRationale}>
                              {t.planRationale || '—'}
                            </p>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                              t.status === 'Executed as Planned'
                                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/50'
                                : t.status === 'Executed with Variation'
                                ? 'bg-blue-950/40 text-blue-400 border-blue-900/50'
                                : t.status === 'Not Valid Plan'
                                ? 'bg-amber-950/40 text-amber-400 border-amber-900/50'
                                : t.status === 'Impulse Trade'
                                ? 'bg-rose-950/40 text-rose-400 border-rose-900/50'
                                : 'bg-slate-900/50 text-slate-400 border-slate-800'
                            }`}>
                              {t.status || 'Planned'}
                            </span>
                          </td>

                          {/* Outcome */}
                          <td className="py-3 px-4 whitespace-nowrap font-mono text-xs">
                            <span className={
                              t.outcome === 'Target Hit' || t.outcome === 'Partial Profit'
                                ? 'text-emerald-400 font-semibold'
                                : t.outcome === 'Stop Loss Hit'
                                ? 'text-rose-400 font-semibold'
                                : 'text-slate-400'
                            }>
                              {t.outcome || 'Pending'}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => onSelectTrade(t)}
                                className="p-1 text-slate-400 hover:text-slate-200 rounded transition-colors"
                                title="View Details"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => onOpenEodReview(t)}
                                className="p-1 text-cyan-400 hover:text-cyan-300 rounded transition-colors"
                                title="Update EOD Review"
                              >
                                <CheckSquare className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => onEditPlan(t)}
                                className="p-1 text-slate-400 hover:text-slate-200 rounded transition-colors"
                                title="Edit Plan"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => onDeletePlan(t.id)}
                                className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                                title="Delete Plan"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
