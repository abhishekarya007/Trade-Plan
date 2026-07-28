import React, { useState, useEffect } from 'react';
import { X, PlusCircle, Save, TrendingUp, Layers, Calendar, HelpCircle } from 'lucide-react';
import { BIAS_TYPES, SETUP_TYPES, CONVICTION_LEVELS, EXCHANGES } from '../types/trade';

export default function TradeFormModal({ isOpen, onClose, onSavePlan, initialData }) {
  const [formData, setFormData] = useState({
    symbol: '',
    exchange: 'NSE',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel w-full max-w-lg overflow-hidden border border-slate-700/80 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {initialData ? 'Edit Pre-Market Trade Plan' : 'Create Intraday Trade Plan'}
              </h2>
              <p className="text-xs text-slate-400">Define stock bias, strategy & execution rationale</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* Stock Symbol & Exchange & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Symbol */}
            <div className="sm:col-span-1">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Stock Symbol / Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. RELIANCE"
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                className="glass-input w-full font-mono uppercase font-bold text-cyan-300"
              />
            </div>

            {/* Exchange */}
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
                  <option key={ex} value={ex} className="bg-slate-900 text-slate-200">
                    {ex}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Plan Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="glass-input w-full cursor-pointer text-xs"
              />
            </div>

          </div>

          {/* Bias Matrix: Weekly Bias & Daily Bias */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            
            {/* Weekly Bias */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Weekly Bias</span>
                <span className="text-[10px] text-slate-500 font-mono">Higher TF</span>
              </label>
              <div className="grid grid-cols-3 gap-1">
                {['Bullish', 'Bearish', 'Neutral'].map(bias => (
                  <button
                    key={bias}
                    type="button"
                    onClick={() => setFormData({ ...formData, weeklyBias: bias })}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                      formData.weeklyBias === bias
                        ? bias === 'Bullish'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-600 shadow-sm shadow-emerald-900/50'
                          : bias === 'Bearish'
                          ? 'bg-rose-950 text-rose-400 border-rose-600 shadow-sm shadow-rose-900/50'
                          : 'bg-amber-950 text-amber-400 border-amber-600 shadow-sm shadow-amber-900/50'
                        : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {bias === 'Bullish' ? '🟢 Bullish' : bias === 'Bearish' ? '🔴 Bearish' : '🟡 Neutral'}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Bias */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Daily Bias</span>
                <span className="text-[10px] text-slate-500 font-mono">Intraday TF</span>
              </label>
              <div className="grid grid-cols-3 gap-1">
                {['Bullish', 'Bearish', 'Rangebound'].map(bias => (
                  <button
                    key={bias}
                    type="button"
                    onClick={() => setFormData({ ...formData, dailyBias: bias })}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                      formData.dailyBias === bias
                        ? bias === 'Bullish'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-600 shadow-sm shadow-emerald-900/50'
                          : bias === 'Bearish'
                          ? 'bg-rose-950 text-rose-400 border-rose-600 shadow-sm shadow-rose-900/50'
                          : 'bg-amber-950 text-amber-400 border-amber-600 shadow-sm shadow-amber-900/50'
                        : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {bias === 'Bullish' ? '🟢 Bullish' : bias === 'Bearish' ? '🔴 Bearish' : '🟡 Range'}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Setup Type & Conviction */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Setup Category */}
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
                  <option key={setup} value={setup} className="bg-slate-900 text-slate-200">
                    {setup}
                  </option>
                ))}
              </select>
            </div>

            {/* Conviction Level */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Conviction Level
              </label>
              <div className="grid grid-cols-3 gap-1">
                {CONVICTION_LEVELS.map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setFormData({ ...formData, conviction: lvl })}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-all ${
                      formData.conviction === lvl
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-sm'
                        : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {lvl === 'High' ? '⭐ High' : lvl === 'Medium' ? 'Medium' : 'Low'}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Plan Rationale / Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
              <span>Trade Plan Rationale & Triggers</span>
              <span className="text-[10px] text-slate-500">Key catalyst, chart pattern, VWAP level, volume...</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Consolidating above 20 EMA on daily chart. Looking for 15-min candle breakout above VWAP with strong volume..."
              value={formData.planRationale}
              onChange={(e) => setFormData({ ...formData, planRationale: e.target.value })}
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
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all"
            >
              <Save className="h-4 w-4" />
              <span>{initialData ? 'Update Plan' : 'Save Pre-Market Plan'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
