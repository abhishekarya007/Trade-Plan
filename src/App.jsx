import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import KpiSummary from './components/KpiSummary';
import JournalTableView from './components/JournalTableView';
import CalendarView from './components/CalendarView';
import AnalyticsView from './components/AnalyticsView';
import TradeFormModal from './components/TradeFormModal';
import EodReviewModal from './components/EodReviewModal';
import TradeDetailModal from './components/TradeDetailModal';
import ConfirmModal from './components/ConfirmModal';
import { ToastContainer } from './components/Toast';
import { playSuccessSound, playDeleteSound, playInfoSound } from './utils/sound';
import { getStoredTrades, saveStoredTrades, resetToDemoData } from './utils/storage';
import { PlusCircle, Filter } from 'lucide-react';

export default function App() {
  const [trades, setTrades] = useState([]);
  const [activeTab, setActiveTab] = useState('journal'); // 'journal' (Ledger) | 'calendar' | 'analytics'
  const [selectedDate, setSelectedDate] = useState('ALL'); // 'ALL' | 'TODAY' | 'YESTERDAY'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDirection, setFilterDirection] = useState('ALL');
  const [filterStyle, setFilterStyle] = useState('ALL');
  const [filterBias, setFilterBias] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterOutcome, setFilterOutcome] = useState('ALL');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [isEodModalOpen, setIsEodModalOpen] = useState(false);
  const [eodTargetTrade, setEodTargetTrade] = useState(null);
  const [selectedTradeDetail, setSelectedTradeDetail] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Toast Notifications State
  const [toasts, setToasts] = useState([]);

  // Confirm Modal State
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    confirmText: 'Confirm',
    confirmVariant: 'danger'
  });

  const addToast = (type, title, message) => {
    const newToast = { id: Date.now() + Math.random(), type, title, message };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Load trades on mount
  useEffect(() => {
    const data = getStoredTrades();
    setTrades(data);
  }, []);

  // Sync trades to storage
  const updateTradesState = (newTrades) => {
    setTrades(newTrades);
    saveStoredTrades(newTrades);
  };

  // Pre-Market Plan Add or Edit
  const handleSavePlan = (planData) => {
    if (editingPlan) {
      // Edit existing plan
      const updated = trades.map(t => t.id === editingPlan.id ? { ...t, ...planData } : t);
      updateTradesState(updated);
      playInfoSound();
      addToast('info', 'Plan Updated', `${planData.symbol} trade plan updated.`);
    } else {
      // Add new plan
      const newPlan = {
        id: `trade-${Date.now()}`,
        status: 'Planned',
        outcome: 'Pending EOD',
        tags: [],
        eodNotes: '',
        ...planData
      };
      updateTradesState([newPlan, ...trades]);
      playSuccessSound();
      addToast('success', 'Plan Created', `New trade plan for ${planData.symbol} added.`);
    }
    setEditingPlan(null);
  };

  // Duplicate / Clone Plan
  const handleDuplicatePlan = (tradeToClone) => {
    const clonedPlan = {
      ...tradeToClone,
      id: `trade-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Planned',
      outcome: 'Pending EOD',
      tags: [],
      eodNotes: '',
      planRationale: `[Clone of ${tradeToClone.symbol}] ${tradeToClone.planRationale || ''}`
    };
    updateTradesState([clonedPlan, ...trades]);
    playSuccessSound();
    addToast('success', 'Plan Cloned', `Cloned ${tradeToClone.symbol} setup for today.`);
  };

  // EOD Review Save
  const handleSaveEodReview = (tradeId, reviewData) => {
    const updated = trades.map(t => t.id === tradeId ? { ...t, ...reviewData } : t);
    updateTradesState(updated);
    playSuccessSound();
    addToast('success', 'EOD Audit Saved', `End-of-day review saved.`);
  };

  // Delete Plan with Confirmation Popup
  const handleDeletePlan = (tradeId) => {
    const targetTrade = trades.find(t => t.id === tradeId);
    const symbolLabel = targetTrade ? targetTrade.symbol : 'this trade plan';

    setConfirmConfig({
      isOpen: true,
      title: 'Delete Trade Plan?',
      message: `Are you sure you want to delete ${symbolLabel}? This action cannot be undone.`,
      confirmText: 'Delete Plan',
      confirmVariant: 'danger',
      onConfirm: () => {
        const updated = trades.filter(t => t.id !== tradeId);
        updateTradesState(updated);
        playDeleteSound();
        addToast('delete', 'Plan Deleted', `${symbolLabel} removed from ledger.`);
      }
    });
  };

  // Reset Data to Demo with Confirmation Popup
  const handleResetData = () => {
    setConfirmConfig({
      isOpen: true,
      title: 'Reset to Demo Data?',
      message: 'This will replace all your current trade plans with realistic demo trades. Continue?',
      confirmText: 'Reset All Data',
      confirmVariant: 'danger',
      onConfirm: () => {
        const resetData = resetToDemoData();
        setTrades(resetData);
        playDeleteSound();
        addToast('info', 'Data Reset', 'Restored initial sample trade plans.');
      }
    });
  };

  // Modal Handlers
  const handleOpenNewPlan = () => {
    setEditingPlan(null);
    setIsFormModalOpen(true);
  };

  const handleEditPlan = (trade) => {
    setEditingPlan(trade);
    setIsFormModalOpen(true);
  };

  const handleOpenEodReview = (trade) => {
    setEodTargetTrade(trade);
    setIsEodModalOpen(true);
  };

  const handleBatchEodOpen = () => {
    const unreviewed = trades.find(t => t.status === 'Planned');
    if (unreviewed) {
      handleOpenEodReview(unreviewed);
    } else if (trades.length > 0) {
      handleOpenEodReview(trades[0]);
    } else {
      addToast('info', 'No Trades', 'Create a trade plan first to audit!');
    }
  };

  const handleSelectTrade = (trade) => {
    setSelectedTradeDetail(trade);
    setIsDetailModalOpen(true);
  };

  // Filter Trades Logic
  const filteredTrades = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    return trades.filter((t) => {
      // Date filter
      if (selectedDate === 'TODAY' && t.date !== todayStr) return false;
      if (selectedDate === 'YESTERDAY' && t.date !== yesterdayStr) return false;

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSymbol = t.symbol.toLowerCase().includes(query);
        const matchesStrategy = (t.setupType || '').toLowerCase().includes(query);
        const matchesRationale = (t.planRationale || '').toLowerCase().includes(query);
        if (!matchesSymbol && !matchesStrategy && !matchesRationale) return false;
      }

      // Direction filter
      if (filterDirection !== 'ALL' && t.tradeDirection !== filterDirection) return false;

      // Style filter
      if (filterStyle !== 'ALL' && t.tradeStyle !== filterStyle) return false;

      // Bias filter
      if (filterBias !== 'ALL') {
        if (t.weeklyBias !== filterBias && t.dailyBias !== filterBias) return false;
      }

      // Execution status filter
      if (filterStatus !== 'ALL' && t.status !== filterStatus) return false;

      // Outcome filter
      if (filterOutcome !== 'ALL' && t.outcome !== filterOutcome) return false;

      return true;
    });
  }, [trades, selectedDate, searchQuery, filterDirection, filterStyle, filterBias, filterStatus, filterOutcome]);

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* App Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewPlanModal={handleOpenNewPlan}
        onOpenEodReviewModal={handleBatchEodOpen}
        trades={trades}
        setTrades={updateTradesState}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onResetData={handleResetData}
        addToast={addToast}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Key KPI Metrics Summary Cards */}
        <KpiSummary trades={trades} />

        {/* Filter Controls Toolbar (Only shown in Journal Ledger view) */}
        {activeTab === 'journal' && (
          <div className="glass-panel p-3 mb-6 flex flex-wrap items-center justify-between gap-3 text-xs border border-slate-800">
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-slate-400 font-medium px-2 py-1">
                <Filter className="h-3.5 w-3.5 text-cyan-400" />
                <span>Filters:</span>
              </div>

              {/* Direction Filter */}
              <select
                value={filterDirection}
                onChange={(e) => setFilterDirection(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="ALL">All Directions</option>
                <option value="Long">Long 📈</option>
                <option value="Short">Short 📉</option>
              </select>

              {/* Style Filter */}
              <select
                value={filterStyle}
                onChange={(e) => setFilterStyle(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="ALL">All Styles</option>
                <option value="Directional">Directional 🎯</option>
                <option value="Scalping">Scalping ⚡</option>
              </select>

              {/* Bias Filter */}
              <select
                value={filterBias}
                onChange={(e) => setFilterBias(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="ALL">All Biases</option>
                <option value="Bullish">Bullish 🟢</option>
                <option value="Bearish">Bearish 🔴</option>
                <option value="Neutral">Neutral / Range 🟡</option>
              </select>

              {/* Execution Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="ALL">All Execution Statuses</option>
                <option value="Planned">Planned</option>
                <option value="Executed as Planned">Executed as Planned</option>
                <option value="Executed with Variation">Executed with Variation</option>
                <option value="Valid Plan - Not Executed">Valid Plan - Not Executed</option>
                <option value="Not Valid Plan">Not Valid Plan</option>
                <option value="Impulse Trade">Impulse Trade</option>
              </select>
            </div>

            {/* Total Filtered Count */}
            <div className="text-slate-500 font-mono text-[11px]">
              Showing {filteredTrades.length} of {trades.length} plans
            </div>

          </div>
        )}

        {/* Dynamic Content Views */}
        {activeTab === 'journal' && (
          <JournalTableView
            trades={filteredTrades}
            onSelectTrade={handleSelectTrade}
            onEditPlan={handleEditPlan}
            onDuplicatePlan={handleDuplicatePlan}
            onDeletePlan={handleDeletePlan}
            onOpenEodReview={handleOpenEodReview}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            trades={trades}
            onSelectTrade={handleSelectTrade}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView trades={trades} />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 mt-12 text-center text-xs text-slate-500">
        <p>TradePlan Intraday Trading Ledger &copy; {new Date().getFullYear()} • Local Offline Storage Active</p>
      </footer>

      {/* Pre-Market Plan Form Modal */}
      <TradeFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSavePlan={handleSavePlan}
        initialData={editingPlan}
      />

      {/* End of Day Review Modal */}
      <EodReviewModal
        isOpen={isEodModalOpen}
        onClose={() => setIsEodModalOpen(false)}
        onSaveEodReview={handleSaveEodReview}
        trade={eodTargetTrade}
      />

      {/* Trade Detail Modal (Triggered on Ledger Row Click) */}
      <TradeDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        trade={selectedTradeDetail}
        onEditPlan={handleEditPlan}
        onDuplicatePlan={handleDuplicatePlan}
        onOpenEodReview={handleOpenEodReview}
        onDeletePlan={handleDeletePlan}
      />

      {/* Global Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        confirmVariant={confirmConfig.confirmVariant}
      />

      {/* Floating Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

    </div>
  );
}
