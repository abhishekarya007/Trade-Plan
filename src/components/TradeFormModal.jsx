import React, { useState, useEffect } from 'react';
import { X, Save, TrendingUp } from 'lucide-react';
import { BIAS_TYPES, SETUP_TYPES, CONVICTION_LEVELS, EXCHANGES } from '../types/trade';

export default function TradeFormModal({ isOpen, onClose, onSavePlan, initialData }) {
  const [formData, setFormData] = useState({
    symbol: '',
    exchange: 'NSE',
    tradeDirection: 'Long',
    tradeStyle: 'Directional',
    date: new Date().toISOString().split('T')[0],
    weeklyBias: BIAS_TYPES.BULLISH,
    dailyBias: BIAS_TYPES.BULLISH,
    setupType: 'Breakout',
    conviction: 'High',
    planRationale: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        symbol: initialData.symbol || '',
        exchange: initialData.exchange || 'NSE',
        tradeDirection: initialData.tradeDirection || 'Long',
        tradeStyle: initialData.tradeStyle || 'Directional',
        date: initialData.date || new Date().toISOString().split('T')[0],
        weeklyBias: initialData.weeklyBias || BIAS_TYPES.BULLISH,
        dailyBias: initialData.dailyBias || BIAS_TYPES.BULLISH,
        setupType: initialData.setupType || 'Breakout',
        conviction: initialData.conviction || 'High',
        planRationale: initialData.planRationale || ''
      });
    } else {
      setFormData({
        symbol: '',
        exchange: 'NSE',
        tradeDirection: 'Long',
        tradeStyle: 'Directional',
        date: new Date().toISOString().split('T')[0],
        weeklyBias: BIAS_TYPES.BULLISH,
        dailyBias: BIAS_TYPES.BULLISH,
        setupType: 'Breakout',
        conviction: 'High',
        planRationale: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.symbol.trim()) {
      alert('Please enter a stock symbol or name.');
      return;
    }
    onSavePlan(formData);
    onClose();
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-[#111622] w-full max-w-xl overflow-hidden border border-slate-800/80 rounded-2xl shadow-xl animate-in fade-in zoom-in duration-200"
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800/60 bg-[#0e131f]/80">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 border border-slate-700/60">
              <TrendingUp className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">
                {initialData ? 'Edit Trade Plan' : 'New Pre-Market Trade Plan'}
              </h2>
              <p className="text-[11px] text-slate-400">Stock direction, style, strategy & rationale</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* Row 1: Symbol & Direction */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Stock Symbol <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. RELIANCE"
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                className="glass-input w-full font-mono uppercase font-bold text-cyan-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Trade Direction
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, tradeDirection: 'Long' })}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all flex items-center justify-center gap-1 ${
                    formData.tradeDirection === 'Long'
                      ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                      : 'bg-[#0c101a] text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span>📈 Long</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, tradeDirection: 'Short' })}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all flex items-center justify-center gap-1 ${
                    formData.tradeDirection === 'Short'
                      ? 'bg-rose-950/60 text-rose-400 border-rose-800'
                      : 'bg-[#0c101a] text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span>📉 Short</span>
                </button>
              </div>
            </div>

          </div>

          {/* Row 2: Trade Style, Exchange, Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Trade Style */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Trade Style
              </label>
              <div className="grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, tradeStyle: 'Directional' })}
                  className={`py-1.5 px-1 rounded-lg text-[11px] font-medium border transition-all ${
                    formData.tradeStyle === 'Directional'
                      ? 'bg-cyan-950/60 text-cyan-300 border-cyan-800'
                      : 'bg-[#0c101a] text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  🎯 Directional
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, tradeStyle: 'Scalping' })}
                  className={`py-1.5 px-1 rounded-lg text-[11px] font-medium border transition-all ${
                    formData.tradeStyle === 'Scalping'
                      ? 'bg-amber-950/60 text-amber-300 border-amber-800'
                      : 'bg-[#0c101a] text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  ⚡ Scalping
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Exchange
              </label>
              <select
                value={formData.exchange}
                onChange={(e) => setFormData({ ...formData, exchange: e.target.value })}
                className="glass-input w-full cursor-pointer"
              >
                {EXCHANGES.map(ex => (
                  <option key={ex} value={ex} className="bg-[#111622] text-slate-200">
                    {ex}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="glass-input w-full cursor-pointer text-xs"
              />
            </div>

          </div>

          {/* Biases */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[#0c101a] rounded-xl border border-slate-800/80">
            
            {/* Weekly Bias */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1.5 flex items-center justify-between">
                <span>Weekly Bias</span>
                <span className="text-[10px] text-slate-500 font-mono">Higher TF</span>
              </label>
              <div className="grid grid-cols-3 gap-1">
                {['Bullish', 'Bearish', 'Neutral'].map(bias => (
                  <button
                    key={bias}
                    type="button"
                    onClick={() => setFormData({ ...formData, weeklyBias: bias })}
                    className={`py-1 px-1.5 rounded-md text-xs font-medium border transition-all ${
                      formData.weeklyBias === bias
                        ? bias === 'Bullish'
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/80'
                          : bias === 'Bearish'
                          ? 'bg-rose-950/60 text-rose-400 border-rose-800/80'
                          : 'bg-amber-950/60 text-amber-400 border-amber-800/80'
                        : 'bg-[#111622] text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {bias === 'Bullish' ? '🟢 Bullish' : bias === 'Bearish' ? '🔴 Bearish' : '🟡 Neutral'}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Bias */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1.5 flex items-center justify-between">
                <span>Daily Bias</span>
                <span className="text-[10px] text-slate-500 font-mono">Intraday TF</span>
              </label>
              <div className="grid grid-cols-3 gap-1">
                {['Bullish', 'Bearish', 'Rangebound'].map(bias => (
                  <button
                    key={bias}
                    type="button"
                    onClick={() => setFormData({ ...formData, dailyBias: bias })}
                    className={`py-1 px-1.5 rounded-md text-xs font-medium border transition-all ${
                      formData.dailyBias === bias
                        ? bias === 'Bullish'
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/80'
                          : bias === 'Bearish'
                          ? 'bg-rose-950/60 text-rose-400 border-rose-800/80'
                          : 'bg-amber-950/60 text-amber-400 border-amber-800/80'
                        : 'bg-[#111622] text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {bias === 'Bullish' ? '🟢 Bullish' : bias === 'Bearish' ? '🔴 Bearish' : '🟡 Range'}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Setup & Conviction */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Setup Strategy
              </label>
              <select
                value={formData.setupType}
                onChange={(e) => setFormData({ ...formData, setupType: e.target.value })}
                className="glass-input w-full cursor-pointer"
              >
                {SETUP_TYPES.map(setup => (
                  <option key={setup} value={setup} className="bg-[#111622] text-slate-200">
                    {setup}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Conviction
              </label>
              <div className="grid grid-cols-3 gap-1">
                {CONVICTION_LEVELS.map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setFormData({ ...formData, conviction: lvl })}
                    className={`py-1.5 px-2 rounded-md text-xs font-medium border transition-all ${
                      formData.conviction === lvl
                        ? 'bg-slate-800 text-cyan-300 border-slate-700'
                        : 'bg-[#0c101a] text-slate-400 border-slate-800'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Rationale */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
              <span>Trade Plan Rationale & Triggers</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Retesting VWAP on 15-min chart. Looking for bullish confirmation..."
              value={formData.planRationale}
              onChange={(e) => setFormData({ ...formData, planRationale: e.target.value })}
              className="glass-input w-full text-xs leading-relaxed"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/60">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{initialData ? 'Update Plan' : 'Save Plan'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
