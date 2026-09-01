import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full font-mono">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start space-x-3 rounded-lg border-2 p-3.5 shadow-[5px_5px_0px_#000000] transition-all animate-in slide-in-from-bottom-3 ${
              isSuccess ? 'border-emerald-400 bg-[#0d1c15] text-emerald-100' :
              isError ? 'border-rose-500 bg-[#210d14] text-rose-100' :
              isWarning ? 'border-[#ffee00] bg-[#221c0b] text-[#ffee00]' :
              'border-[#06b6d4] bg-[#0c1626] text-cyan-100'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
              {isError && <AlertCircle className="h-4 w-4 text-rose-400" />}
              {isWarning && <AlertTriangle className="h-4 w-4 text-[#ffee00]" />}
              {!isSuccess && !isError && !isWarning && <Info className="h-4 w-4 text-cyan-400" />}
            </div>

            <div className="flex-1 truncate">
              <p className="text-xs font-bold leading-tight uppercase tracking-tight">{toast.title}</p>
              {toast.message && (
                <p className="text-[11px] opacity-90 mt-0.5 font-sans leading-snug">{toast.message}</p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-slate-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
