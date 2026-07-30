/**
 * @file ToastContainer.tsx
 * Floating toast notification display for feedback
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const icon = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
          error: <XCircle className="w-5 h-5 text-rose-600 shrink-0" />,
          info: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
        }[toast.type];

        const borderColor = {
          success: 'border-emerald-200 bg-emerald-50/95 dark:bg-emerald-950/90 dark:border-emerald-800',
          warning: 'border-amber-200 bg-amber-50/95 dark:bg-amber-950/90 dark:border-amber-800',
          error: 'border-rose-200 bg-rose-50/95 dark:bg-rose-950/90 dark:border-rose-800',
          info: 'border-blue-200 bg-blue-50/95 dark:bg-blue-950/90 dark:border-blue-800',
        }[toast.type];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-lg transition-all animate-in slide-in-from-bottom-3 duration-200 ${borderColor}`}
          >
            {icon}
            <div className="flex-1 text-right">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{toast.title}</h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
