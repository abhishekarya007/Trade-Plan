import React from 'react';
import { 
  X, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Edit3, 
  CheckSquare, 
  Trash2, 
  Calendar, 
  Layers, 
  MessageSquare, 
  Tag, 
  CheckCircle2, 
  AlertTriangle,
  BookOpen,
  Copy
} from 'lucide-react';

export default function TradeDetailModal({ isOpen, onClose, trade, onEditPlan, onDuplicatePlan, onOpenEodReview, onDeletePlan }) {
  if (!isOpen || !trade) return null;

  const getBiasBadge = (bias, label) => {
    if (bias === 'Bullish') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-950/40 text-emerald-400 border border-emerald-900/40">
          <TrendingUp className="h-3 w-3 text-emerald-400" />
          <span>{label}: Bullish</span>
        </span>
      );
    }
    if (bias === 'Bearish') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-rose-950/40 text-rose-400 border border-rose-900/40">
          <TrendingDown className="h-3 w-3 text-rose-400" />
          <span>{label}: Bearish</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-950/40 text-amber-400 border border-amber-900/40">
        <Minus className="h-3 w-3 text-amber-400" />
        <span>{label}: {bias || 'Neutral'}</span>
      </span>
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Executed as Planned':
        return <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-950/40 text-emerald-400 border border-emerald-900/50 flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> Executed as Planned</span>;
      case 'Executed with Variation':
        return <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-blue-950/40 text-blue-400 border border-blue-900/50 flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> Executed with Variation</span>;
      case 'Valid Plan - Not Executed':
        return <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-purple-950/40 text-purple-300 border border-purple-900/50 flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5" /> Plan Valid - Not Executed</span>;
      case 'Not Valid Plan':
        return <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-amber-950/40 text-amber-400 border border-amber-900/50 flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5" /> Not Valid Plan</span>;
      case 'Setup Didn\'t Trigger':
        return <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-900 text-slate-400 border border-slate-800">Setup Didn't Trigger</span>;
      case 'Impulse Trade':
        return <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-rose-950/40 text-rose-400 border border-rose-900/50 flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5" /> Impulse Trade</span>;
      default:
        return <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-900 text-slate-400 border border-slate-800">Planned (Pending EOD)</span>;
    }
  };

  const getOutcomeBadge = (outcome) => {
    switch (outcome) {
      case 'Target Hit':
        return <span className="font-mono text-xs font-semibold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-900/50">🎯 Target Hit</span>;
      case 'Partial Profit':
        return <span className="font-mono text-xs font-semibold text-emerald-300 bg-emerald-950/30 px-2.5 py-1 rounded-md border border-emerald-900/40">✨ Partial Profit</span>;
      case 'Stop Loss Hit':
        return <span className="font-mono text-xs font-semibold text-rose-400 bg-rose-950/40 px-2.5 py-1 rounded-md border border-rose-900/50">🛑 Stop Loss Hit</span>;
      case 'Breakeven':
        return <span className="font-mono text-xs font-semibold text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-md border border-amber-900/50">⚖️ Breakeven</span>;
      case 'No Trade':
        return <span className="font-mono text-xs font-medium text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">No Execution</span>;
      default:
        return <span className="font-mono text-xs text-slate-500 italic">Awaiting EOD Review</span>;
    }
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-[#111622] w-full max-w-2xl overflow-hidden border border-slate-800/80 rounded-2xl shadow-xl animate-in fade-in zoom-in duration-200"
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800/60 bg-[#0e131f]/80">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center font-mono font-bold text-cyan-400 text-base">
              {trade.symbol.slice(0, 2)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100 font-mono">{trade.symbol}</h2>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50">
                  {trade.exchange || 'NSE'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                <span>Trade Date: <strong className="text-slate-200">{trade.date}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => { onClose(); onEditPlan(trade); }}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 text-xs"
              title="Edit Trade Plan"
            >
              <Edit3 className="h-4 w-4" />
              <span className="hidden sm:inline">Edit</span>
            </button>

            <button
              onClick={() => { onClose(); onDuplicatePlan(trade); }}
              className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 text-xs"
              title="Duplicate Plan"
            >
              <Copy className="h-4 w-4" />
              <span className="hidden sm:inline">Clone</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this trade plan?')) {
                  onClose();
                  onDeletePlan(trade.id);
                }
              }}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Delete Trade Plan"
            >
              <Trash2 className="h-4 w-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Section 1: Pre-Market Strategy */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-cyan-400/80" />
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Pre-Market Trade Strategy
                </h3>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <span>Conviction:</span>
                <span className={`font-mono ${
                  trade.conviction === 'High' ? 'text-amber-400 font-semibold' : 'text-slate-300'
                }`}>
                  {trade.conviction || 'Medium'}
                </span>
              </div>
            </div>

            {/* Biases, Direction & Style */}
            <div className="flex flex-wrap gap-2 pt-0.5">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase font-mono border ${
                trade.tradeDirection === 'Short'
                  ? 'bg-rose-950/40 text-rose-400 border-rose-900/40'
                  : 'bg-emerald-950/40 text-emerald-400 border-emerald-900/40'
              }`}>
                {trade.tradeDirection === 'Short' ? '📉 Short' : '📈 Long'}
              </span>

              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold font-mono border ${
                trade.tradeStyle === 'Scalping'
                  ? 'bg-amber-950/40 text-amber-300 border-amber-900/40'
                  : 'bg-slate-900 text-slate-300 border-slate-800'
              }`}>
                {trade.tradeStyle === 'Scalping' ? '⚡ Scalping' : '🎯 Directional'}
              </span>

              {getBiasBadge(trade.weeklyBias, 'Weekly')}
              {getBiasBadge(trade.dailyBias, 'Daily')}
              
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-900 text-slate-300 border border-slate-800">
                <Layers className="h-3 w-3 text-cyan-400/80" />
                <span>Strategy: {trade.setupType || 'General'}</span>
              </span>
            </div>

            {/* Plan Rationale */}
            <div className="bg-[#0c101a] p-3.5 rounded-xl border border-slate-800/80 space-y-1">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                Plan Rationale & Triggers
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                {trade.planRationale || 'No rationale notes recorded for this plan.'}
              </p>
            </div>
          </div>

          {/* Section 2: End-of-Day Execution Audit */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-emerald-400/80" />
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  End-of-Day Execution Audit
                </h3>
              </div>
              {getOutcomeBadge(trade.outcome)}
            </div>

            {/* Execution status */}
            <div className="p-3 bg-[#0c101a] rounded-xl border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
                Execution Status
              </span>
              <div>
                {getStatusBadge(trade.status)}
              </div>
            </div>

            {/* Behavioral Tags */}
            {trade.tags && trade.tags.length > 0 && (
              <div className="space-y-1">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Tag className="h-3 w-3 text-slate-400" />
                  <span>Behavioral Tags:</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {trade.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-900 text-cyan-300/90 border border-slate-800 text-xs px-2 py-0.5 rounded-md font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* EOD Reflections */}
            <div className="bg-[#0c101a] p-3.5 rounded-xl border border-slate-800/80 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Post-Market Reflections</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                {trade.eodNotes ? `"${trade.eodNotes}"` : 'No post-market reflections recorded yet.'}
              </p>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#0e131f]/80 border-t border-slate-800/60 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            Close
          </button>

          <button
            onClick={() => { onClose(); onOpenEodReview(trade); }}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all"
          >
            <CheckSquare className="h-3.5 w-3.5" />
            <span>Update EOD Review</span>
          </button>
        </div>

      </div>
    </div>
  );
}
