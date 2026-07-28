import React, { useRef } from 'react';
import { 
  TrendingUp, 
  PlusCircle, 
  CheckSquare, 
  Download, 
  Upload, 
  RotateCcw, 
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
    <header className="sticky top-0 z-30 bg-[#0b0f17]/90 backdrop-blur-md border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3.5">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center justify-between w-full lg:w-auto">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-center text-cyan-400">
                <TrendingUp className="h-4.5 w-4.5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold tracking-tight text-slate-100 font-sans">
                    Trade<span className="text-cyan-400 font-mono">Plan</span>
                  </h1>
                  <span className="text-[10px] font-semibold tracking-wider text-slate-400 bg-slate-800/60 border border-slate-700/50 px-2 py-0.5 rounded-md">
                    Intraday Ledger
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Pre-Market Strategy & EOD Execution Audit</p>
              </div>
            </div>

            {/* Mobile View Add Trigger */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={onOpenNewPlanModal}
                className="bg-cyan-500/90 hover:bg-cyan-400 text-slate-950 font-semibold p-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                title="New Trade Plan"
              >
                <PlusCircle className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs & Filters */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            
            {/* View Switcher */}
            <div className="bg-[#111622] p-1 rounded-xl border border-slate-800/80 flex items-center gap-1">
              <button
                onClick={() => setActiveTab('journal')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'journal'
                    ? 'bg-slate-800 text-cyan-300 border border-slate-700/60'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Table className="h-3.5 w-3.5" />
                <span>Ledger</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'analytics'
                    ? 'bg-slate-800 text-cyan-300 border border-slate-700/60'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BarChart3 className="h-3.5 w-3.5" />
                <span>Analytics</span>
              </button>
            </div>

            {/* Quick Search */}
            <div className="relative flex-1 sm:flex-none sm:w-44">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search stock..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111622] border border-slate-800 text-xs text-slate-200 placeholder-slate-500 rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            {/* Date Filter Selector */}
            <div className="flex items-center gap-1.5 bg-[#111622] border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-slate-300">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-[#111622] text-slate-200">All Dates</option>
                <option value="TODAY" className="bg-[#111622] text-slate-200">Today</option>
                <option value="YESTERDAY" className="bg-[#111622] text-slate-200">Yesterday</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            
            {/* Utilities */}
            <div className="flex items-center gap-0.5 bg-[#111622] p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => exportTradesToJSON(trades)}
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded transition-colors"
                title="Export JSON"
              >
                <Download className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => exportTradesToCSV(trades)}
                className="p-1.5 text-slate-400 hover:text-emerald-300 rounded transition-colors text-xs font-mono font-bold"
                title="Export CSV"
              >
                CSV
              </button>

              <label className="p-1.5 text-slate-400 hover:text-slate-200 rounded cursor-pointer transition-colors" title="Import JSON">
                <Upload className="h-3.5 w-3.5" />
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
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded transition-colors"
                title="Reset to Demo Data"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* EOD Audit */}
            <button
              onClick={onOpenEodReviewModal}
              className="bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              <CheckSquare className="h-3.5 w-3.5 text-emerald-400" />
              <span>EOD Audit</span>
            </button>

            {/* New Trade Plan Trigger */}
            <button
              onClick={onOpenNewPlanModal}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>New Plan</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
