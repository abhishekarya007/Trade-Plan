import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Plus, Trash2, Save, Sparkles } from 'lucide-react';

const DEFAULT_PLAYBOOK_RULES = [
  'Never trade in the first 5 minutes of market opening.',
  'Always wait for 15-minute candle closure confirmation before entering.',
  'Max 2 trades per day. Stop trading if daily loss limit is hit.',
  'Never move stop loss once trade is active.',
  'Verify Weekly and Daily bias alignment before taking high-conviction trades.',
  'No impulse or revenge trades during choppy rangebound market conditions.'
];

const STORAGE_KEY_PLAYBOOK = 'trade_plan_playbook_rules_v1';

export default function PlaybookModal({ isOpen, onClose }) {
  const [rules, setRules] = useState([]);
  const [newRuleText, setNewRuleText] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PLAYBOOK);
      if (stored) {
        setRules(JSON.parse(stored));
      } else {
        setRules(DEFAULT_PLAYBOOK_RULES);
        localStorage.setItem(STORAGE_KEY_PLAYBOOK, JSON.stringify(DEFAULT_PLAYBOOK_RULES));
      }
    } catch (e) {
      setRules(DEFAULT_PLAYBOOK_RULES);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const saveRules = (updatedRules) => {
    setRules(updatedRules);
    localStorage.setItem(STORAGE_KEY_PLAYBOOK, JSON.stringify(updatedRules));
  };

  const handleAddRule = (e) => {
    e.preventDefault();
    if (!newRuleText.trim()) return;
    const updated = [...rules, newRuleText.trim()];
    saveRules(updated);
    setNewRuleText('');
  };

  const handleDeleteRule = (index) => {
    const updated = rules.filter((_, i) => i !== index);
    saveRules(updated);
  };

  const handleResetRules = () => {
    if (window.confirm('Reset playbook to default trading rules?')) {
      saveRules(DEFAULT_PLAYBOOK_RULES);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#111622] w-full max-w-xl overflow-hidden border border-slate-800/80 rounded-2xl shadow-xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800/60 bg-[#0e131f]/80">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-slate-800 text-amber-400 border border-slate-700/60">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">Trading Playbook & Golden Rules</h2>
              <p className="text-[11px] text-slate-400">Core guidelines & non-negotiable risk rules</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          
          {/* Rules List */}
          <div className="space-y-2">
            {rules.map((rule, idx) => (
              <div 
                key={idx}
                className="flex items-start justify-between gap-3 p-3 bg-[#0c101a] rounded-xl border border-slate-800/80 group"
              >
                <div className="flex items-start gap-2.5">
                  <span className="font-mono text-xs font-bold text-amber-400/90 bg-slate-800/60 px-1.5 py-0.5 rounded text-[10px] shrink-0 mt-0.5">
                    #{idx + 1}
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    {rule}
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteRule(idx)}
                  className="p-1 text-slate-600 hover:text-rose-400 rounded opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  title="Remove Rule"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Rule Form */}
          <form onSubmit={handleAddRule} className="pt-2 flex items-center gap-2">
            <input
              type="text"
              placeholder="Add custom trading rule..."
              value={newRuleText}
              onChange={(e) => setNewRuleText(e.target.value)}
              className="glass-input flex-1 text-xs"
            />
            <button
              type="submit"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-3 py-2 rounded-xl text-xs flex items-center gap-1 border border-slate-700/60 transition-all shrink-0"
            >
              <Plus className="h-3.5 w-3.5 text-cyan-400" />
              <span>Add Rule</span>
            </button>
          </form>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0e131f]/80 border-t border-slate-800/60 flex items-center justify-between">
          <button
            onClick={handleResetRules}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            Reset to Defaults
          </button>

          <button
            onClick={onClose}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-1.5 rounded-xl text-xs transition-all"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
