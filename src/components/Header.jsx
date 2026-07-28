import React, { useRef, useState } from 'react';
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
  Search,
  ShieldCheck
} from 'lucide-react';
import PlaybookModal from './PlaybookModal';
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
  const [isPlaybookOpen, setIsPlaybookOpen] = useState(false);

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
    <>
      <header className="sticky top-0 z-30 bg-[#0b0f17]/95 backdrop-blur-md border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
            
            {/* Left Block: Brand Logo & Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-between w-full lg:w-auto gap-4">
              {/* Logo & Tagline */}
              <div className="flex items-center gap-2.5">
                <div className="h-8.5 w-8.5 rounded-xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-center text-cyan-400 shrink-0">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h1 className="text-base font-bold tracking-tight text-slate-100 font-sans">
                      Trade<span className="text-cyan-400 font-mono">Plan</span>
                    </h1>
                    <span className="text-[9px] font-semibold tracking-wider text-slate-400 bg-slate-800/60 border border-slate-700/50 px-1.5 py-0.5 rounded">
                      Intraday
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 hidden sm:block">Pre-Market & EOD Audit</p>
                </div>
              </div>

              {/* View Switcher Tabs */}
              <div className="bg-[#111622] p-1 rounded-xl border border-slate-800/80 flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('journal')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'journal'
                      ? 'bg-slate-800 text-cyan-300 border border-slate-700/60 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Table className="h-3.5 w-3.5" />
                  <span>Ledger</span>
                </button>

                <button
                  onClick={() => setActiveTab('calendar')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'calendar'
                      ? 'bg-slate-800 text-cyan-300 border border-slate-700/60 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Calendar</span>
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'analytics'
                      ? 'bg-slate-800 text-cyan-300 border border-slate-700/60 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BarChart3 className="h-3.5 w-3.5" />
                  <span>Analytics</span>
                </button>
              </div>

              {/* Mobile View Add Button */}
              <button
                onClick={onOpenNewPlanModal}
                className="lg:hidden bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors"
                title="New Plan"
              >
                <PlusCircle className="h-4 w-4" />
              </button>
            </div>

            {/* Right Block: Search, Date Filter, Playbook, Utilities, EOD Audit, New Plan */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
              
              {/* Quick Search */}
              <div className="relative flex-1 sm:flex-none sm:w-36">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search stock..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#111622] border border-slate-800 text-xs text-slate-200 placeholder-slate-500 rounded-xl pl-8 pr-2.5 py-1.5 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              {/* Date Filter Selector */}
              <div className="flex items-center gap-1 bg-[#111622] border border-slate-800 rounded-xl px-2 py-1 text-xs text-slate-300">
                <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
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

              {/* Playbook Rules Button */}
              <button
                onClick={() => setIsPlaybookOpen(true)}
                className="bg-[#111622] hover:bg-slate-800/80 text-amber-300 border border-slate-800 hover:border-slate-700 px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 transition-all"
                title="Trading Rules Playbook"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                <span>Playbook</span>
              </button>

              {/* Import / Export Utility Bar */}
              <div className="flex items-center gap-0.5 bg-[#111622] p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => exportTradesToJSON(trades)}
                  className="p-1 text-slate-400 hover:text-slate-200 rounded transition-colors"
                  title="Export JSON"
                >
                  <Download className="h-3.5 w-3.5" />
                </button>

                <button
                  onClick={() => exportTradesToCSV(trades)}
                  className="p-1 text-slate-400 hover:text-emerald-300 rounded transition-colors text-xs font-mono font-bold"
                  title="Export CSV"
                >
                  CSV
                </button>

                <label className="p-1 text-slate-400 hover:text-slate-200 rounded cursor-pointer transition-colors" title="Import JSON">
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
                  className="p-1 text-slate-400 hover:text-rose-400 rounded transition-colors"
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
                <span className="hidden sm:inline">EOD Audit</span>
              </button>

              {/* New Trade Plan Trigger */}
              <button
                onClick={onOpenNewPlanModal}
                className="hidden lg:flex bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl text-xs items-center gap-1.5 transition-all shadow-sm"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>New Plan</span>
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Playbook Rules Modal */}
      <PlaybookModal
        isOpen={isPlaybookOpen}
        onClose={() => setIsPlaybookOpen(false)}
      />
    </>
  );
}
