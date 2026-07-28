import React, { useState, useEffect } from 'react';
import { X, CheckSquare, Star, MessageSquare, Tag, AlertCircle, Award } from 'lucide-react';
import { EXECUTION_STATUSES, OUTCOMES, EMOTION_TAGS } from '../types/trade';

export default function EodReviewModal({ isOpen, onClose, onSaveEodReview, trade }) {
  const [status, setStatus] = useState('Executed as Planned');
  const [outcome, setOutcome] = useState('Target Hit');
  const [disciplineScore, setDisciplineScore] = useState(5);
  const [selectedTags, setSelectedTags] = useState([]);
  const [eodNotes, setEodNotes] = useState('');

  useEffect(() => {
    if (trade) {
      setStatus(trade.status && trade.status !== 'Planned' ? trade.status : 'Executed as Planned');
      setOutcome(trade.outcome && trade.outcome !== 'Pending EOD' ? trade.outcome : 'Target Hit');
      setDisciplineScore(trade.disciplineScore || 5);
      setSelectedTags(trade.tags || []);
      setEodNotes(trade.eodNotes || '');
    }
  }, [trade, isOpen]);

  if (!isOpen || !trade) return null;

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveEodReview(trade.id, {
      status,
      outcome,
      disciplineScore,
      tags: selectedTags,
      eodNotes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel w-full max-w-xl overflow-hidden border border-slate-700/80 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckSquare className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">End of Day (EOD) Review</h2>
                <span className="font-mono text-xs font-bold text-cyan-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                  {trade.symbol}
                </span>
              </div>
              <p className="text-xs text-slate-400">Audit your execution accuracy & post-market reflections</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Pre-Market Plan Summary Banner */}
        <div className="mx-5 mt-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="font-semibold text-slate-300">Pre-Market Plan:</span>
            <span>{trade.setupType} • {trade.weeklyBias}/{trade.dailyBias} Bias</span>
          </div>
          <p className="text-slate-400 italic line-clamp-2">
            "{trade.planRationale || 'No rationale recorded'}"
          </p>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* Execution Status */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Plan Execution Status
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {EXECUTION_STATUSES.filter(s => s !== 'Planned').map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st)}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-left border transition-all flex items-center justify-between ${
                    status === st
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-md shadow-cyan-950/40'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span>{st}</span>
                  {status === st && <CheckSquare className="h-3.5 w-3.5 text-cyan-400 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Outcome Result */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Trade Outcome
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {OUTCOMES.filter(o => o !== 'Pending EOD').map(out => (
                <button
                  key={out}
                  type="button"
                  onClick={() => setOutcome(out)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                    outcome === out
                      ? out === 'Target Hit' || out === 'Partial Profit'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500 shadow-sm'
                        : out === 'Stop Loss Hit'
                        ? 'bg-rose-950 text-rose-300 border-rose-500 shadow-sm'
                        : 'bg-amber-950 text-amber-300 border-amber-500 shadow-sm'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {out}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Discipline Score Rating */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-0.5 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-amber-400" />
                <span>Discipline Rating (Self Audit)</span>
              </label>
              <p className="text-[11px] text-slate-500">How closely did you follow your trading rules?</p>
            </div>

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setDisciplineScore(star)}
                  className="p-1 text-amber-400 hover:scale-125 transition-transform"
                >
                  <Star
                    className={`h-5 w-5 ${
                      star <= disciplineScore
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-700 fill-slate-900'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Behavioral / Emotion Tags */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
              <Tag className="h-3.5 w-3.5 text-cyan-400" />
              <span>Behavioral & Mindset Tags</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {EMOTION_TAGS.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-cyan-900/80 text-cyan-200 border-cyan-500 font-medium'
                        : 'bg-slate-900/40 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {isSelected ? `✓ #${tag}` : `#${tag}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Post-Market Reflection / Learnings */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
              <span>EOD Reflection: What worked? What was executed? What to improve?</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Plan worked as expected! Patiently waited for 15-min candle confirmation. Next time, exit 50% at R1 level."
              value={eodNotes}
              onChange={(e) => setEodNotes(e.target.value)}
              className="glass-input w-full text-xs leading-relaxed"
            />
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <CheckSquare className="h-4 w-4" />
              <span>Save EOD Review</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
