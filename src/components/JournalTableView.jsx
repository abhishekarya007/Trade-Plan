import React from 'react';
import { Edit3, CheckSquare, Trash2, TrendingUp, TrendingDown, Star, Calendar } from 'lucide-react';

export default function JournalTableView({ trades, onEditPlan, onDeletePlan, onOpenEodReview }) {
  if (!trades || trades.length === 0) {
    return (
      <div className="glass-panel p-8 text-center text-slate-400">
        <p className="text-sm">No trade plans found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel overflow-hidden border border-slate-800/80">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          
          {/* Table Header */}
          <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3.5 px-4">Date & Stock</th>
              <th className="py-3.5 px-4">Biases (W/D)</th>
              <th className="py-3.5 px-4">Setup Strategy</th>
              <th className="py-3.5 px-4">Conviction</th>
              <th className="py-3.5 px-4">Pre-Market Plan Rationale</th>
              <th className="py-3.5 px-4">Execution Status</th>
              <th className="py-3.5 px-4">Outcome</th>
              <th className="py-3.5 px-4">Discipline</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {trades.map((t) => (
              <tr key={t.id} className="hover:bg-slate-900/50 transition-colors">
                
                {/* Date & Stock */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 font-mono font-bold text-sm text-white">
                      <span>{t.symbol}</span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded border border-slate-700 font-normal">
                        {t.exchange || 'NSE'}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Calendar className="h-3 w-3" /> {t.date}
                    </span>
                  </div>
                </td>

                {/* Weekly / Daily Bias */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                      t.weeklyBias === 'Bullish' ? 'text-emerald-400' : t.weeklyBias === 'Bearish' ? 'text-rose-400' : 'text-amber-400'
                    }`}>
                      W: {t.weeklyBias || 'Neutral'}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                      t.dailyBias === 'Bullish' ? 'text-emerald-400' : t.dailyBias === 'Bearish' ? 'text-rose-400' : 'text-amber-400'
                    }`}>
                      D: {t.dailyBias || 'Neutral'}
                    </span>
                  </div>
                </td>

                {/* Setup Strategy */}
                <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-200">
                  <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800 text-xs">
                    {t.setupType || 'General'}
                  </span>
                </td>

                {/* Conviction */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className={`font-semibold font-mono text-xs ${
                    t.conviction === 'High' ? 'text-amber-400' : 'text-slate-400'
                  }`}>
                    {t.conviction || 'Medium'}
                  </span>
                </td>

                {/* Plan Rationale */}
                <td className="py-3.5 px-4 max-w-xs">
                  <p className="text-slate-400 truncate text-[11px]" title={t.planRationale}>
                    {t.planRationale || '—'}
                  </p>
                </td>

                {/* Execution Status */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                    t.status === 'Executed as Planned'
                      ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                      : t.status === 'Executed with Variation'
                      ? 'bg-blue-950/80 text-blue-400 border-blue-800'
                      : t.status === 'Impulse Trade'
                      ? 'bg-rose-950/80 text-rose-400 border-rose-800'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}>
                    {t.status || 'Planned'}
                  </span>
                </td>

                {/* Outcome */}
                <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                  <span className={`font-semibold text-xs ${
                    t.outcome === 'Target Hit' || t.outcome === 'Partial Profit'
                      ? 'text-emerald-400'
                      : t.outcome === 'Stop Loss Hit'
                      ? 'text-rose-400'
                      : 'text-slate-400'
                  }`}>
                    {t.outcome || 'Pending'}
                  </span>
                </td>

                {/* Discipline */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {t.disciplineScore > 0 ? (
                    <div className="flex items-center gap-1 text-amber-400 font-mono font-bold text-xs">
                      <Star className="h-3.5 w-3.5 fill-amber-400" />
                      <span>{t.disciplineScore}.0</span>
                    </div>
                  ) : (
                    <span className="text-slate-600">—</span>
                  )}
                </td>

                {/* Action Buttons */}
                <td className="py-3.5 px-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onOpenEodReview(t)}
                      className="p-1.5 bg-slate-800 hover:bg-cyan-950 hover:text-cyan-400 text-slate-300 rounded border border-slate-700 transition-colors"
                      title="Update EOD Review"
                    >
                      <CheckSquare className="h-3.5 w-3.5 text-cyan-400" />
                    </button>
                    <button
                      onClick={() => onEditPlan(t)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                      title="Edit Plan"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDeletePlan(t.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
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
    </div>
  );
}
