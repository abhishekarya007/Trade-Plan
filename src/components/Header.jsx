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
import { playSuccessSound, playInfoSound } from '../utils/sound';

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
  onResetData,
  addToast
}) {
  const fileInputRef = useRef(null);
  const [isPlaybookOpen, setIsPlaybookOpen] = useState(false);

  const handleExportJSON = () => {
    exportTradesToJSON(trades);
    playInfoSound();
    if (addToast) addToast('info', 'JSON Exported', 'Downloaded trade plan data JSON.');
  };

  const handleExportCSV = () => {
    exportTradesToCSV(trades);
    playInfoSound();
    if (addToast) addToast('info', 'CSV Exported', 'Downloaded trade plan spreadsheet CSV.');
  };

  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (Array.isArray(importedData)) {
          setTrades(importedData);
          playSuccessSound();
          if (addToast) addToast('success', 'Data Imported', `Successfully loaded ${importedData.length} trade plans!`);
        } else {
          if (addToast) addToast('danger', 'Import Failed', 'Invalid JSON format. Expected an array of trades.');
        }
      } catch (err) {
        if (addToast) addToast('danger', 'Import Error', 'Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#161b22] border-b border-[#30363d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
            
            {/* Left Block: Brand Logo & Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-between w-full lg:w-auto gap-4">
              
              {/* Logo & Tagline */}
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-[#21262d] border border-[#30363d] flex items-center justify-center text-cyan-400 shrink-0">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-base font-bold tracking-tight text-[#f0f6fc] font-sans">
                      Trade<span className="text-cyan-400 font-mono">Plan</span>
                    </h1>
                    <span className="text-[10px] font-medium tracking-wider text-[#8b949e] bg-[#21262d] border border-[#30363d] px-1.5 py-0.5 rounded font-mono">
                      INTRADAY
                    </span>
                  </div>
                </div>
              </div>

              {/* View Switcher Tabs */}
              <div className="bg-[#0d1117] p-1 rounded-lg border border-[#30363d] flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('journal')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    activeTab === 'journal'
                      ? 'bg-[#21262d] text-[#f0f6fc] border border-[#30363d]'
                      : 'text-[#8b949e] hover:text-[#c9d1d9]'
                  }`}
                >
                  <Table className={`h-3.5 w-3.5 ${activeTab === 'journal' ? 'text-cyan-400' : ''}`} />
                  <span>Ledger</span>
                </button>

                <button
                  onClick={() => setActiveTab('calendar')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    activeTab === 'calendar'
                      ? 'bg-[#21262d] text-[#f0f6fc] border border-[#30363d]'
                      : 'text-[#8b949e] hover:text-[#c9d1d9]'
                  }`}
                >
                  <Calendar className={`h-3.5 w-3.5 ${activeTab === 'calendar' ? 'text-cyan-400' : ''}`} />
                  <span>Calendar</span>
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    activeTab === 'analytics'
                      ? 'bg-[#21262d] text-[#f0f6fc] border border-[#30363d]'
                      : 'text-[#8b949e] hover:text-[#c9d1d9]'
                  }`}
                >
                  <BarChart3 className={`h-3.5 w-3.5 ${activeTab === 'analytics' ? 'text-cyan-400' : ''}`} />
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
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8b949e]" />
                <input
                  type="text"
                  placeholder="Search stock..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] text-xs text-[#c9d1d9] placeholder-[#8b949e] rounded-lg pl-8 pr-2.5 py-1.5 focus:outline-none focus:border-[#484f58]"
                />
              </div>

              {/* Date Filter Selector */}
              <div className="flex items-center gap-1 bg-[#0d1117] border border-[#30363d] rounded-lg px-2.5 py-1 text-xs text-[#c9d1d9]">
                <Calendar className="h-3.5 w-3.5 text-[#8b949e] shrink-0" />
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent text-xs text-[#c9d1d9] focus:outline-none cursor-pointer font-medium"
                >
                  <option value="ALL" className="bg-[#161b22] text-[#c9d1d9]">All Dates</option>
                  <option value="TODAY" className="bg-[#161b22] text-[#c9d1d9]">Today</option>
                  <option value="YESTERDAY" className="bg-[#161b22] text-[#c9d1d9]">Yesterday</option>
                </select>
              </div>

              {/* Playbook Rules Button */}
              <button
                onClick={() => setIsPlaybookOpen(true)}
                className="bg-[#21262d] hover:bg-[#30363d] text-amber-400 border border-[#30363d] px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                title="Trading Rules Playbook"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                <span>Playbook</span>
              </button>

              {/* Import / Export Utility Bar */}
              <div className="flex items-center gap-0.5 bg-[#0d1117] p-1 rounded-lg border border-[#30363d]">
                <button
                  onClick={handleExportJSON}
                  className="p-1 text-[#8b949e] hover:text-[#c9d1d9] rounded transition-colors"
                  title="Export JSON"
                >
                  <Download className="h-3.5 w-3.5" />
                </button>

                <button
                  onClick={handleExportCSV}
                  className="p-1 text-[#8b949e] hover:text-emerald-400 rounded transition-colors text-xs font-mono font-bold"
                  title="Export CSV"
                >
                  CSV
                </button>

                <label className="p-1 text-[#8b949e] hover:text-[#c9d1d9] rounded cursor-pointer transition-colors" title="Import JSON">
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
                  className="p-1 text-[#8b949e] hover:text-rose-400 rounded transition-colors"
                  title="Reset to Demo Data"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* EOD Audit */}
              <button
                onClick={onOpenEodReviewModal}
                className="bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <CheckSquare className="h-3.5 w-3.5 text-emerald-400" />
                <span className="hidden sm:inline">EOD Audit</span>
              </button>

              {/* New Trade Plan Trigger */}
              <button
                onClick={onOpenNewPlanModal}
                className="hidden lg:flex bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-3.5 py-1.5 rounded-lg text-xs items-center gap-1.5 transition-colors"
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
