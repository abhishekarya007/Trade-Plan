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
  Star, 
  MessageSquare, 
  Tag, 
  CheckCircle2, 
  AlertTriangle,
  Award,
  BookOpen
} from 'lucide-react';

export default function TradeDetailModal({ isOpen, onClose, trade, onEditPlan, onOpenEodReview, onDeletePlan }) {
  if (!isOpen || !trade) return null;

  const getBiasBadge = (bias, label) => {
    if (bias === 'Bullish') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
          <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
          <span>{label}: Bullish</span>
        </span>
      );
    }
    if (bias === 'Bearish') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-400 border border-rose-800/80">
          <TrendingDown className="h-3.5 w-3.5 text-rose-400" />
          <span>{label}: Bearish</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-400 border border-amber-800/80">
        <Minus className="h-3.5 w-3.5 text-amber-400" />
        <span>{label}: {bias || 'Neutral'}</span>
      </span>
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Executed as Planned':
        return <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> Executed as Planned</span>;
      case 'Executed with Variation':
        return <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> Executed with Variation</span>;
      case 'Valid Plan - Not Executed':
        return <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30 flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5" /> Plan Valid - Not Executed</span>;
      case 'Not Valid Plan':
        return <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5" /> Not Valid Plan</span>;
      case 'Setup Didn\'t Trigger':
        return <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">Setup Didn't Trigger</span>;
      case 'Impulse Trade':
        return <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5" /> Impulse Trade</span>;
      default:
        return <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">Planned (Pending EOD)</span>;
    }
  };

  const getOutcomeBadge = (outcome) => {
    switch (outcome) {
      case 'Target Hit':
        return <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-700">🎯 Target Hit</span>;
      case 'Partial Profit':
        return <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800">✨ Partial Profit</span>;
      case 'Stop Loss Hit':
        return <span className="font-mono text-xs font-bold text-rose-400 bg-rose-950/80 px-2.5 py-1 rounded-md border border-rose-700">🛑 Stop Loss Hit</span>;
      case 'Breakeven':
        return <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-md border border-amber-700">⚖️ Breakeven</span>;
      case 'No Trade':
        return <span className="font-mono text-xs font-medium text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">No Execution</span>;
      default:
        return <span className="font-mono text-xs text-cyan-400 italic">Awaiting EOD Review</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel w-full max-w-2xl overflow-hidden border border-slate-700/80 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center font-mono font-extrabold text-cyan-400 text-lg">
                {trade.symbol.slice(0, 2)}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white font-mono">{trade.symbol}</h2>
                <span className="text-xs font-bold font-mono uppercase bg-slate-800 text-cyan-400 px-2.5 py-0.5 rounded border border-slate-700">
                  {trade.exchange || 'NSE'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                <span>Trade Date: <strong className="text-slate-200">{trade.date}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { onClose(); onEditPlan(trade); }}
              className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 text-xs"
              title="Edit Trade Plan"
            >
              <Edit3 className="h-4 w-4" />
              <span className="hidden sm:inline">Edit Plan</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this trade plan?')) {
                  onClose();
                  onDeletePlan(trade.id);
                }
              }}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Delete Trade Plan"
            >
              <Trash2 className="h-4 w-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Section 1: Pre-Market Strategy */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Pre-Market Trade Strategy
                </h3>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <span>Conviction:</span>
                <span className={`font-semibold font-mono ${
                  trade.conviction === 'High' ? 'text-amber-400' : 'text-slate-300'
                }`}>
                  {trade.conviction || 'Medium'}
                </span>
              </div>
            </div>

            {/* Biases */}
            <div className="flex flex-wrap gap-2 pt-1">
              {getBiasBadge(trade.weeklyBias, 'Weekly')}
              {getBiasBadge(trade.dailyBias, 'Daily')}
              
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 text-slate-200 border border-slate-800">
                <Layers className="h-3.5 w-3.5 text-cyan-400" />
                <span>Strategy: {trade.setupType || 'General'}</span>
              </span>
            </div>

            {/* Plan Rationale */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                Plan Rationale & Technical Triggers
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                {trade.planRationale || 'No rationale notes recorded for this plan.'}
              </p>
            </div>
          </div>

          {/* Section 2: End-of-Day (EOD) Execution Audit */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  End-of-Day Execution Audit
                </h3>
              </div>
              {getOutcomeBadge(trade.outcome)}
            </div>

            {/* Execution status pill & Discipline score */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                  Execution Status
                </span>
                <div>
                  {getStatusBadge(trade.status)}
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                  Discipline Self-Rating
                </span>
                <div className="flex items-center gap-2">
                  {trade.disciplineScore > 0 ? (
                    <>
                      <div className="flex items-center text-amber-400">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= trade.disciplineScore ? 'fill-amber-400 text-amber-400' : 'text-slate-800'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-mono text-xs font-bold text-amber-300">
                        {trade.disciplineScore}.0 / 5.0
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-slate-500 italic">Not rated yet</span>
                  )}
                </div>
              </div>

            </div>

            {/* Emotion / Behavioral Tags */}
            {trade.tags && trade.tags.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Behavioral Tags:</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {trade.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-900 text-cyan-300 border border-slate-800 text-xs px-2.5 py-1 rounded-lg font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* EOD Post-Market Reflections & Learnings */}
            <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-900/40 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <MessageSquare className="h-4 w-4" />
                <span>Post-Market Reflections & Learnings</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed italic">
                {trade.eodNotes ? `"${trade.eodNotes}"` : 'No post-market reflections recorded yet. Click "Update EOD Review" below to add notes.'}
              </p>
            </div>

          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Close
          </button>

          <button
            onClick={() => { onClose(); onOpenEodReview(trade); }}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <CheckSquare className="h-4 w-4" />
            <span>Update EOD Review</span>
          </button>
        </div>

      </div>
    </div>
  );
}
