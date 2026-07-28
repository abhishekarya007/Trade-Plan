import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', confirmVariant = 'danger' }) {
  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-[#111622] w-full max-w-sm overflow-hidden border border-slate-800/90 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200"
      >
        <div className="p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl border shrink-0 ${
              confirmVariant === 'danger' 
                ? 'bg-rose-950/60 text-rose-400 border-rose-900/60' 
                : 'bg-amber-950/60 text-amber-400 border-amber-900/60'
            }`}>
              {confirmVariant === 'danger' ? (
                <Trash2 className="h-5 w-5" />
              ) : (
                <AlertTriangle className="h-5 w-5" />
              )}
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-100">{title}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{message}</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/60">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold text-slate-950 transition-all ${
                confirmVariant === 'danger'
                  ? 'bg-rose-500 hover:bg-rose-400 text-white'
                  : 'bg-amber-400 hover:bg-amber-300'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
