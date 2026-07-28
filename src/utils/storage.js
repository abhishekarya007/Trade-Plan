import { SAMPLE_TRADES } from '../types/trade';

const STORAGE_KEY = 'trade_plan_app_data_v1';

export const getStoredTrades = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_TRADES));
      return SAMPLE_TRADES;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading trade plans from storage:', error);
    return SAMPLE_TRADES;
  }
};

export const saveStoredTrades = (trades) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
  } catch (error) {
    console.error('Error saving trade plans to storage:', error);
  }
};

export const resetToDemoData = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_TRADES));
  return SAMPLE_TRADES;
};

export const exportTradesToJSON = (trades) => {
  const jsonStr = JSON.stringify(trades, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `TradePlans_Export_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportTradesToCSV = (trades) => {
  if (!trades || trades.length === 0) return;
  
  const headers = [
    'Date',
    'Symbol',
    'Exchange',
    'Weekly Bias',
    'Daily Bias',
    'Setup Type',
    'Conviction',
    'Plan Rationale',
    'Status',
    'Outcome',
    'Emotion Tags',
    'EOD Notes'
  ];

  const rows = trades.map(t => [
    `"${t.date || ''}"`,
    `"${t.symbol || ''}"`,
    `"${t.exchange || ''}"`,
    `"${t.weeklyBias || ''}"`,
    `"${t.dailyBias || ''}"`,
    `"${t.setupType || ''}"`,
    `"${t.conviction || ''}"`,
    `"${(t.planRationale || '').replace(/"/g, '""')}"`,
    `"${t.status || ''}"`,
    `"${t.outcome || ''}"`,
    `"${(t.tags || []).join(', ')}"`,
    `"${(t.eodNotes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `TradePlans_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
