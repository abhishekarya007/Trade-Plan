import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X, Trash2 } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const { id, type, title, message } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 3500);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />;
      case 'danger':
      case 'delete':
        return <Trash2 className="h-4 w-4 text-rose-400 shrink-0" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-cyan-400 shrink-0" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-emerald-900/60 bg-[#0c141d]';
      case 'danger':
      case 'delete':
        return 'border-rose-900/60 bg-[#170e13]';
      case 'info':
      default:
        return 'border-cyan-900/60 bg-[#0c121e]';
    }
  };

  return (
    <div className={`p-3.5 rounded-xl border shadow-2xl flex items-start gap-3 w-80 text-xs text-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-200 backdrop-blur-md ${getBorderColor()}`}>
      <div className="mt-0.5">{getIcon()}</div>
      
      <div className="flex-1">
        <h4 className="font-bold text-slate-100">{title}</h4>
        {message && <p className="text-slate-400 mt-0.5">{message}</p>}
      </div>

      <button
        onClick={() => onClose(id)}
        className="p-1 text-slate-500 hover:text-slate-300 rounded transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onClose }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-auto">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
}
