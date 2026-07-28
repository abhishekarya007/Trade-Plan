import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2, Flame, Target } from 'lucide-react';

export default function CalendarView({ trades, onSelectTrade }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Generate Calendar Days for current month
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startingDayOfWeek = firstDayOfMonth.getDay();
    const totalDaysInMonth = lastDayOfMonth.getDate();

    // Previous month padding days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const paddingLeftDays = [];
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      paddingLeftDays.push({
        dayNumber: prevMonthLastDay - i,
        isCurrentMonth: false,
        dateStr: null
      });
    }

    // Current month days
    const currentMonthDays = [];
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const monthStr = String(month + 1).padStart(2, '0');
      const dayStr = String(i).padStart(2, '0');
      const dateStr = `${year}-${monthStr}-${dayStr}`;

      const dayTrades = trades.filter(t => t.date === dateStr);
      const reviewed = dayTrades.filter(t => t.outcome && t.outcome !== 'Pending EOD' && t.outcome !== 'No Trade');
      const wins = reviewed.filter(t => t.outcome === 'Target Hit' || t.outcome === 'Partial Profit');
      const winRate = reviewed.length > 0 ? Math.round((wins.length / reviewed.length) * 100) : null;

      currentMonthDays.push({
        dayNumber: i,
        isCurrentMonth: true,
        dateStr,
        trades: dayTrades,
        totalPlans: dayTrades.length,
        reviewedCount: reviewed.length,
        winsCount: wins.length,
        winRate
      });
    }

    // Combine padding + current days
    const totalCells = paddingLeftDays.length + currentMonthDays.length;
    const paddingRightCount = Math.ceil(totalCells / 7) * 7 - totalCells;
    const paddingRightDays = [];
    for (let i = 1; i <= paddingRightCount; i++) {
      paddingRightDays.push({
        dayNumber: i,
        isCurrentMonth: false,
        dateStr: null
      });
    }

    return [...paddingLeftDays, ...currentMonthDays, ...paddingRightDays];
  }, [currentDate, trades]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleTodayMonth = () => {
    setCurrentDate(new Date());
  };

  const monthYearLabel = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-4">
      
      {/* Calendar Header Navigation */}
      <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-3 border border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-800 text-cyan-400 border border-slate-700/60">
            <CalendarIcon className="h-4.5 w-4.5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 font-sans tracking-wide">
              {monthYearLabel}
            </h2>
            <p className="text-xs text-slate-400">Monthly Trade Plan & Performance Calendar</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTodayMonth}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded-lg border border-slate-800 transition-colors"
          >
            Today
          </button>
          
          <div className="flex items-center gap-1 bg-[#0c101a] p-1 rounded-lg border border-slate-800/80">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 text-slate-400 hover:text-slate-200 rounded transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 text-slate-400 hover:text-slate-200 rounded transition-colors"
              title="Next Month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="glass-panel p-4 overflow-hidden border border-slate-800/80">
        
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Calendar Day Cells Grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((cell, idx) => {
            if (!cell.isCurrentMonth) {
              return (
                <div key={idx} className="min-h-[90px] p-2 bg-[#0d111a]/40 rounded-xl border border-slate-800/20 opacity-30 text-slate-600 text-xs">
                  {cell.dayNumber}
                </div>
              );
            }

            const isToday = cell.dateStr === todayStr;
            const hasTrades = cell.totalPlans > 0;

            return (
              <div
                key={idx}
                className={`min-h-[95px] p-2.5 rounded-xl border transition-all flex flex-col justify-between ${
                  isToday 
                    ? 'bg-[#151c2c] border-cyan-500/50 shadow-sm' 
                    : hasTrades
                    ? 'bg-[#111622] border-slate-800 hover:border-slate-700'
                    : 'bg-[#0e131f]/50 border-slate-800/40 text-slate-500'
                }`}
              >
                {/* Cell Header: Day Number & Plan Count */}
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-xs font-bold ${
                    isToday ? 'text-cyan-400' : 'text-slate-300'
                  }`}>
                    {cell.dayNumber}
                  </span>

                  {hasTrades && (
                    <span className="text-[10px] font-mono font-bold bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded">
                      {cell.totalPlans} {cell.totalPlans === 1 ? 'plan' : 'plans'}
                    </span>
                  )}
                </div>

                {/* Trade Dots & Win Rate */}
                {hasTrades ? (
                  <div className="space-y-1.5 mt-2">
                    
                    {/* Win rate badge if reviewed */}
                    {cell.winRate !== null && (
                      <div className="flex items-center gap-1 font-mono text-[10px] font-semibold">
                        <Flame className="h-3 w-3 text-emerald-400" />
                        <span className={cell.winRate >= 50 ? 'text-emerald-400' : 'text-amber-400'}>
                          {cell.winRate}% Win
                        </span>
                      </div>
                    )}

                    {/* Stock ticker mini pills */}
                    <div className="flex flex-wrap gap-1">
                      {cell.trades.map(t => (
                        <span 
                          key={t.id}
                          onClick={() => onSelectTrade(t)}
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded cursor-pointer transition-transform hover:scale-105 border ${
                            t.outcome === 'Target Hit' || t.outcome === 'Partial Profit'
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                              : t.outcome === 'Stop Loss Hit'
                              ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                              : 'bg-slate-800/80 text-slate-300 border-slate-700'
                          }`}
                          title={`${t.symbol} (${t.tradeDirection}) - Click to view`}
                        >
                          {t.symbol.slice(0, 4)}
                        </span>
                      ))}
                    </div>

                  </div>
                ) : (
                  <div className="text-[10px] text-slate-600 italic">No plans</div>
                )}

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
