import React, { useRef } from 'react';
import { 
  TrendingUp, 
  PlusCircle, 
  CheckSquare, 
  Download, 
  Upload, 
  RotateCcw, 
  LayoutDashboard, 
  Table, 
  BarChart3,
  Calendar,
  Search
} from 'lucide-react';
import { exportTradesToJSON, exportTradesToCSV } from '../utils/storage';

export default function Header({
  activeTab,
  setActiveTab,
  onOpenNewPlanModal,
  onOpenEodReviewModal,
  trades,
  setTrades,
  selectedDate,
  setSelectedDate,
  searchQuery,
  setSearchQuery,
  onResetData
}) {
  const fileInputRef = useRef(null);

  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (Array.isArray(importedData)) {
          setTrades(importedData);
          alert(`Successfully imported ${importedData.length} trade plans!`);
        } else {
          alert('Invalid JSON file format. Expected an array of trade plans.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center justify-between w-full lg:w-auto">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-emerald-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20">
                <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <TrendingUp className="h-5.5 w-5.5 text-cyan-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-white font-sans">
                    Trade<span className="text-cyan-400 font-mono">Plan</span>
                  </h1>
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 px-2 py-0.5 rounded-full">
                    Intraday Suite
                  </span>
                </div>
                <p className="text-xs text-slate-400">Pre-Market Strategy & EOD Execution Audit</p>
              </div>
            </div>

            {/* Mobile View Toggle */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={onOpenNewPlanModal}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold p-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                title="New Trade Plan"
              >
                <PlusCircle className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs & Search */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* View Switcher Tabs */}
            <div className="bg-slate-900/90 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
              <button
                onClick={() => setActiveTab('cards')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'cards'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Cards</span>
              </button>
              
              <button
                onClick={() => setActiveTab('journal')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'journal'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Table className="h-3.5 w-3.5" />
                <span>Ledger</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'analytics'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <BarChart3 className="h-3.5 w-3.5" />
                <span>Analytics</span>
              </button>
            </div>

            {/* Quick Search */}
            <div className="relative flex-1 sm:flex-none sm:w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search stock..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30"
              />
            </div>

            {/* Date Filter Selector */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300">
              <Calendar className="h-3.5 w-3.5 text-cyan-400" />
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900 text-slate-200">All Dates</option>
                <option value="TODAY" className="bg-slate-900 text-slate-200">Today</option>
                <option value="YESTERDAY" className="bg-slate-900 text-slate-200">Yesterday</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Reset / Export / Import Utility Group */}
            <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-lg border border-slate-800/80">
              <button
                onClick={() => exportTradesToJSON(trades)}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
                title="Export JSON"
              >
                <Download className="h-4 w-4" />
              </button>

              <button
                onClick={() => exportTradesToCSV(trades)}
                className="p-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 rounded transition-colors text-xs font-mono font-bold"
                title="Export CSV Spreadsheet"
              >
                CSV
              </button>

              <label className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded cursor-pointer transition-colors" title="Import JSON">
                <Upload className="h-4 w-4" />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImportJSON}
                  accept=".json"
                  className="hidden"
                />
              </label>

              <button
                onClick={onResetData}
                className="p-1.5 text-rose-400/80 hover:text-rose-300 hover:bg-rose-950/40 rounded transition-colors"
                title="Reset to Demo Data"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            {/* EOD Batch Review */}
            <button
              onClick={onOpenEodReviewModal}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
            >
              <CheckSquare className="h-4 w-4 text-emerald-400" />
              <span>EOD Audit</span>
            </button>

            {/* New Trade Plan Trigger */}
            <button
              onClick={onOpenNewPlanModal}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="h-4 w-4" />
              <span>New Trade Plan</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
