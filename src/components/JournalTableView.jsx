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
  ChevronsDownUp,
  Copy,
  Layers
} from 'lucide-react';

export default function JournalTableView({ trades, onSelectTrade, onEditPlan, onDuplicatePlan, onDeletePlan, onOpenEodReview }) {
  // Group trades by date
  const groupedTrades = useMemo(() => {
    if (!trades || trades.length === 0) return [];

    const groupsMap = {};
    trades.forEach((trade) => {
      const dateKey = trade.date || 'Undated';
      if (!groupsMap[dateKey]) {
        groupsMap[dateKey] = [];
      }
      groupsMap[dateKey].push(trade);
    });

    const sortedDates = Object.keys(groupsMap).sort((a, b) => new Date(b) - new Date(a));

    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    return sortedDates.map((dateStr) => {
      const dateTrades = groupsMap[dateStr];
      let dateLabel = dateStr;
      
      if (dateStr === todayStr) {
        dateLabel = 'Today';
      } else if (dateStr === yesterdayStr) {
        dateLabel = 'Yesterday';
      } else if (dateStr !== 'Undated') {
        const d = new Date(dateStr + 'T00:00:00');
        dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }

      // Stats
      const totalCount = dateTrades.length;
      const executedCount = dateTrades.filter(t => 
        t.status === 'Executed as Planned' || t.status === 'Executed with Variation'
      ).length;

      const reviewedTrades = dateTrades.filter(t => t.outcome && t.outcome !== 'Pending EOD' && t.outcome !== 'No Trade');
      const winCount = reviewedTrades.filter(t => t.outcome === 'Target Hit' || t.outcome === 'Partial Profit').length;
      const winRate = reviewedTrades.length > 0 ? Math.round((winCount / reviewedTrades.length) * 100) : null;

      return {
        dateStr,
        dateLabel,
        trades: dateTrades,
        totalCount,
        executedCount,
        winRate
      };
    });
  }, [trades]);

  // Accordion open/close state
  const [openGroups, setOpenGroups] = useState(() => {
    const initial = {};
    if (groupedTrades.length > 0) {
      initial[groupedTrades[0].dateStr] = true;
    }
    return initial;
  });

  const toggleGroup = (dateStr) => {
    setOpenGroups(prev => ({
      ...prev,
      [dateStr]: !prev[dateStr]
    }));
  };

  const handleExpandAll = () => {
    const allOpen = {};
    groupedTrades.forEach(g => { allOpen[g.dateStr] = true; });
    setOpenGroups(allOpen);
  };

  const handleCollapseAll = () => {
    setOpenGroups({});
  };

  const getBiasBadge = (bias) => {
    switch (bias) {
      case 'Bullish':
        return <span className="text-emerald-400 font-mono text-[11px] font-medium">🟢 Bull</span>;
      case 'Bearish':
        return <span className="text-rose-400 font-mono text-[11px] font-medium">🔴 Bear</span>;
      case 'Rangebound':
      case 'Neutral':
      default:
        return <span className="text-amber-400 font-mono text-[11px] font-medium">🟡 Range</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Executed as Planned':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Executed</span>;
      case 'Executed with Variation':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">Variation</span>;
      case 'Valid Plan - Not Executed':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#21262d] text-[#8b949e] border border-[#30363d]">Not Executed</span>;
      case 'Not Valid Plan':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">Not Valid</span>;
      case 'Impulse Trade':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">Impulse</span>;
      case 'Planned':
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Planned</span>;
    }
  };

  const getOutcomeBadge = (outcome) => {
    switch (outcome) {
      case 'Target Hit':
        return <span className="text-emerald-400 font-semibold font-mono text-xs">🎯 Target Hit</span>;
      case 'Partial Profit':
        return <span className="text-emerald-300 font-mono text-xs">💰 Partial Profit</span>;
      case 'Stop Loss Hit':
        return <span className="text-rose-400 font-mono text-xs">🛑 SL Hit</span>;
      case 'Breakeven':
        return <span className="text-amber-300 font-mono text-xs">⚖️ Breakeven</span>;
      case 'No Trade':
        return <span className="text-[#8b949e] font-mono text-xs">⏹️ No Trade</span>;
      case 'Pending EOD':
      default:
        return <span className="text-cyan-400 font-mono text-xs">⏳ Pending</span>;
    }
  };

  if (!trades || trades.length === 0) {
    return (
      <div className="slate-card p-12 text-center">
        <Layers className="h-10 w-10 text-[#8b949e] mx-auto mb-3" />
        <h3 className="text-base font-bold text-[#f0f6fc]">No Trade Plans Found</h3>
        <p className="text-xs text-[#8b949e] mt-1">Create a new pre-market plan to populate your intraday trading ledger.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      {/* Accordion Global Controls */}
      <div className="flex items-center justify-between text-xs text-[#8b949e] px-1">
        <span className="font-mono text-[11px]">
          {groupedTrades.length} Trading {groupedTrades.length === 1 ? 'Day' : 'Days'} Accordion
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExpandAll}
            className="flex items-center gap-1 hover:text-[#c9d1d9] transition-colors"
          >
            <ChevronsUpDown className="h-3.5 w-3.5" />
            <span>Expand All</span>
          </button>
          <span>•</span>
          <button
            onClick={handleCollapseAll}
            className="flex items-center gap-1 hover:text-[#c9d1d9] transition-colors"
          >
            <ChevronsDownUp className="h-3.5 w-3.5" />
            <span>Collapse All</span>
          </button>
        </div>
      </div>

      {/* Date-Wise Accordions List */}
      <div className="space-y-3">
        {groupedTrades.map((group) => {
          const isOpen = !!openGroups[group.dateStr];

          return (
            <div 
              key={group.dateStr}
              className="slate-card overflow-hidden"
            >
              
              {/* Accordion Top Header Bar */}
              <div 
                onClick={() => toggleGroup(group.dateStr)}
                className="p-3.5 bg-[#161b22] hover:bg-[#1c2129] cursor-pointer transition-colors flex flex-wrap items-center justify-between gap-3 select-none border-b border-[#30363d]"
              >
                
                {/* Left: Date Title */}
                <div className="flex items-center gap-2.5">
                  <div className="p-1 text-[#8b949e]">
                    {isOpen ? <ChevronDown className="h-4 w-4 text-[#c9d1d9]" /> : <ChevronRight className="h-4 w-4" />}
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-[#f0f6fc] font-sans">
                      {group.dateLabel}
                    </h3>
                    <span className="text-[11px] font-mono text-[#8b949e] bg-[#21262d] px-2 py-0.5 rounded border border-[#30363d]">
                      {group.dateStr}
                    </span>
                  </div>
                </div>

                {/* Right: Daily Summary Badges */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#c9d1d9] font-mono">
                    <strong className="text-cyan-400">{group.totalCount}</strong> {group.totalCount === 1 ? 'plan' : 'plans'}
                  </span>

                  <span className="text-xs text-[#8b949e] font-mono">
                    (<strong className="text-emerald-400">{group.executedCount}</strong> executed)
                  </span>

                  {group.winRate !== null && (
                    <span className="flex items-center gap-1 text-xs font-mono font-medium px-2 py-0.5 rounded slate-badge-mint">
                      <Flame className="h-3.5 w-3.5 text-emerald-400" />
                      <span>{group.winRate}% Win</span>
                    </span>
                  )}
                </div>

              </div>

              {/* Expanded Accordion Table View */}
              {isOpen && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#c9d1d9]">
                    
                    {/* Sub-Header */}
                    <thead className="bg-[#0d1117] text-[#8b949e] font-medium border-b border-[#30363d] uppercase tracking-wider text-[10px] font-mono">
                      <tr>
                        <th className="py-2.5 px-4">Stock</th>
                        <th className="py-2.5 px-4">Dir & Style</th>
                        <th className="py-2.5 px-4">Biases (W/D)</th>
                        <th className="py-2.5 px-4">Setup Strategy</th>
                        <th className="py-2.5 px-4">Conviction</th>
                        <th className="py-2.5 px-4">Pre-Market Plan Rationale</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-4">Outcome</th>
                        <th className="py-2.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>

                    {/* Trade Rows */}
                    <tbody className="divide-y divide-[#30363d]/50 font-sans">
                      {group.trades.map((t) => (
                        <tr 
                          key={t.id} 
                          onClick={() => onSelectTrade(t)}
                          className="hover:bg-[#21262d] cursor-pointer transition-colors group"
                          title="Click to view full plan details"
                        >
                          
                          {/* Stock Ticker */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 font-mono font-bold text-xs text-[#f0f6fc] group-hover:text-cyan-400 transition-colors">
                              <span>{t.symbol}</span>
                              <span className="text-[10px] bg-[#21262d] text-[#8b949e] px-1.5 py-0.2 rounded font-normal border border-[#30363d]">
                                {t.exchange || 'NSE'}
                              </span>
                            </div>
                          </td>

                          {/* Direction & Style Soft Badges */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                t.tradeDirection === 'Short' ? 'slate-badge-coral' : 'slate-badge-mint'
                              }`}>
                                {t.tradeDirection === 'Short' ? '📉 SHORT' : '📈 LONG'}
                              </span>

                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                t.tradeStyle === 'Scalping' ? 'slate-badge-amber' : 'slate-badge-cyan'
                              }`}>
                                {t.tradeStyle === 'Scalping' ? '⚡ SCALP' : '🎯 DIR'}
                              </span>
                            </div>
                          </td>

                          {/* Biases */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              {getBiasBadge(t.weeklyBias)}
                              <span className="text-[#484f58]">/</span>
                              {getBiasBadge(t.dailyBias)}
                            </div>
                          </td>

                          {/* Setup Strategy */}
                          <td className="py-3 px-4 whitespace-nowrap font-medium text-[#c9d1d9]">
                            <span className="bg-[#21262d] text-cyan-300 px-2 py-0.5 rounded border border-[#30363d] font-mono text-[11px]">
                              {t.setupType || 'General'}
                            </span>
                          </td>

                          {/* Conviction */}
                          <td className="py-3 px-4 whitespace-nowrap font-mono text-xs">
                            <span className={`font-medium ${
                              t.conviction === 'High' ? 'text-amber-400 font-semibold' : 'text-[#8b949e]'
                            }`}>
                              {t.conviction || 'Medium'}
                            </span>
                          </td>

                          {/* Plan Rationale Snippet */}
                          <td className="py-3 px-4 max-w-xs">
                            <p className="truncate text-[#c9d1d9] text-xs italic" title={t.planRationale}>
                              "{t.planRationale || 'No rationale recorded'}"
                            </p>
                          </td>

                          {/* Execution Status */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            {getStatusBadge(t.status)}
                          </td>

                          {/* Outcome */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            {getOutcomeBadge(t.outcome)}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => onSelectTrade(t)}
                                className="p-1 text-[#8b949e] hover:text-[#c9d1d9] rounded transition-colors"
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
                                className="p-1 text-[#8b949e] hover:text-[#c9d1d9] rounded transition-colors"
                                title="Edit Plan"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => onDuplicatePlan(t)}
                                className="p-1 text-[#8b949e] hover:text-cyan-300 rounded transition-colors"
                                title="Duplicate / Clone Plan"
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => onDeletePlan(t.id)}
                                className="p-1 text-[#8b949e] hover:text-rose-400 rounded transition-colors"
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
