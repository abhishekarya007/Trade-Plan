import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Edit3, 
  Trash2, 
  CheckSquare, 
  Calendar, 
  Layers, 
  Star, 
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Tag
} from 'lucide-react';

export default function TradeCard({ trade, onEditPlan, onDeletePlan, onOpenEodReview }) {
  const getBiasBadge = (bias, label) => {
    if (bias === 'Bullish') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
          <TrendingUp className="h-3 w-3 text-emerald-400" />
          <span>{label}: Bullish</span>
        </span>
      );
    }
    if (bias === 'Bearish') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-400 border border-rose-800/80">
          <TrendingDown className="h-3 w-3 text-rose-400" />
          <span>{label}: Bearish</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-400 border border-amber-800/80">
        <Minus className="h-3 w-3 text-amber-400" />
        <span>{label}: {bias || 'Neutral'}</span>
      </span>
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Executed as Planned':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Executed as Planned</span>;
      case 'Executed with Variation':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Executed with Variation</span>;
      case 'Valid Plan - Not Executed':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30 flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" /> Plan Valid - Not Executed</span>;
      case 'Setup Didn\'t Trigger':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">Setup Didn't Trigger</span>;
      case 'Impulse Trade':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" /> Impulse Trade</span>;
      default:
        return <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">Planned (Pending)</span>;
    }
  };

  const getOutcomeBadge = (outcome) => {
    switch (outcome) {
      case 'Target Hit':
        return <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">🎯 Target Hit</span>;
      case 'Partial Profit':
        return <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">✨ Partial Profit</span>;
      case 'Stop Loss Hit':
        return <span className="font-mono text-xs font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/60">🛑 SL Hit</span>;
      case 'Breakeven':
        return <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">⚖️ Breakeven</span>;
      case 'No Trade':
        return <span className="font-mono text-xs font-medium text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">No Execution</span>;
      default:
        return <span className="font-mono text-xs text-cyan-400/80 italic">Awaiting EOD Review</span>;
    }
  };

  return (
    <div className="glass-card overflow-hidden flex flex-col justify-between transition-all duration-200 hover:border-slate-700">
      
      {/* Top Card Header */}
      <div className="p-4 border-b border-slate-800/60 bg-slate-900/40">
        <div className="flex items-center justify-between gap-2 mb-2">
          
          <div className="flex items-center gap-2">
            <span className="text-lg font-extrabold font-mono text-white tracking-wide">
              {trade.symbol}
            </span>
            <span className="text-[10px] font-bold font-mono uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
              {trade.exchange || 'NSE'}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEditPlan(trade)}
              className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
              title="Edit Plan"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onDeletePlan(trade.id)}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
              title="Delete Plan"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Date & Conviction */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-slate-500" />
            <span>{trade.date}</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[11px]">
            <span className="text-slate-500">Conviction:</span>
            <span className={`font-semibold ${
              trade.conviction === 'High' ? 'text-amber-400' : trade.conviction === 'Medium' ? 'text-cyan-400' : 'text-slate-400'
            }`}>
              {trade.conviction || 'Medium'}
            </span>
          </div>
        </div>
      </div>

      {/* Card Body - Strategy & Biases */}
      <div className="p-4 space-y-3.5 flex-1">
        
        {/* Biases */}
        <div className="flex flex-wrap gap-2">
          {getBiasBadge(trade.weeklyBias, 'Weekly')}
          {getBiasBadge(trade.dailyBias, 'Daily')}
        </div>

        {/* Setup Type */}
        <div className="flex items-center gap-2 text-xs">
          <Layers className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
          <span className="text-slate-400">Setup Strategy:</span>
          <span className="font-semibold text-slate-200 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            {trade.setupType || 'General Setup'}
          </span>
        </div>

        {/* Trade Rationale Notes */}
        {trade.planRationale && (
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 text-xs">
            <p className="text-slate-400 line-clamp-3 leading-relaxed">
              <span className="text-cyan-400/90 font-medium">Plan Rationale: </span>
              {trade.planRationale}
            </p>
          </div>
        )}

        {/* EOD Review Summary Section */}
        {trade.status && trade.status !== 'Planned' && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                EOD Execution Audit
              </span>
              {getOutcomeBadge(trade.outcome)}
            </div>

            {/* Discipline & Tags */}
            <div className="flex items-center justify-between text-xs">
              {trade.disciplineScore > 0 && (
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold font-mono">{trade.disciplineScore}.0</span>
                  <span className="text-[10px] text-slate-400">Discipline</span>
                </div>
              )}

              {trade.tags && trade.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-end">
                  {trade.tags.slice(0, 2).map((tag, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* EOD Learnings / Reflection */}
            {trade.eodNotes && (
              <div className="bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-900/40 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium mb-0.5">
                  <MessageSquare className="h-3 w-3" />
                  <span>Post-Market Lessons:</span>
                </div>
                <p className="text-slate-300 text-[11px] italic leading-relaxed line-clamp-2">
                  "{trade.eodNotes}"
                </p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Card Footer - EOD Review Button */}
      <div className="p-3 bg-slate-950/40 border-t border-slate-800/60 flex items-center justify-between">
        <div>
          {getStatusBadge(trade.status)}
        </div>

        <button
          onClick={() => onOpenEodReview(trade)}
          className="bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 hover:border-cyan-700/60 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
        >
          <CheckSquare className="h-3.5 w-3.5 text-cyan-400" />
          <span>{trade.status && trade.status !== 'Planned' ? 'Edit EOD Review' : 'Update EOD'}</span>
        </button>
      </div>

    </div>
  );
}
