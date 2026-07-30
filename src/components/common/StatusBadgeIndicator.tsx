/**
 * @file StatusBadgeIndicator.tsx
 * Status Badge Indicator Component with Tooltip displaying last update timestamp.
 * Provides visual colored badges and interactive tooltips for certificate status across requests UI.
 */

import React, { useState } from 'react';
import { Clock, Info, CheckCircle2, AlertCircle, Hourglass, XCircle, FileSpreadsheet } from 'lucide-react';

export interface StatusBadgeIndicatorProps {
  status: string;
  lastUpdated?: string;
  certificateNumber?: string;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
  className?: string;
}

export const StatusBadgeIndicator: React.FC<StatusBadgeIndicatorProps> = ({
  status,
  lastUpdated = '2026-07-30 14:25',
  certificateNumber,
  size = 'md',
  showPulse = true,
  className = '',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Normalize status text
  const cleanStatus = (status || '').replace(/_/g, ' ');

  // Define visual themes based on status
  let bgColor = 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700';
  let dotColor = 'bg-slate-500';
  let IconComponent = Info;

  if (
    cleanStatus.includes('معتمدة') ||
    cleanStatus.includes('جاهزة للاعتماد') ||
    cleanStatus.includes('صادرة') ||
    cleanStatus.includes('موافق')
  ) {
    bgColor = 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-800';
    dotColor = 'bg-emerald-500';
    IconComponent = CheckCircle2;
  } else if (
    cleanStatus.includes('دراسة') ||
    cleanStatus.includes('مراجعة') ||
    cleanStatus.includes('قيد') ||
    cleanStatus.includes('جديد')
  ) {
    bgColor = 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/80 dark:text-blue-200 dark:border-blue-800';
    dotColor = 'bg-blue-500';
    IconComponent = FileSpreadsheet;
  } else if (
    cleanStatus.includes('استكمال') ||
    cleanStatus.includes('ترددات') ||
    cleanStatus.includes('معلقة') ||
    cleanStatus.includes('بانتظار')
  ) {
    bgColor = 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-800';
    dotColor = 'bg-amber-500';
    IconComponent = Hourglass;
  } else if (cleanStatus.includes('مرفوضة') || cleanStatus.includes('ملغاة') || cleanStatus.includes('اعتراض')) {
    bgColor = 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-800';
    dotColor = 'bg-rose-500';
    IconComponent = XCircle;
  }

  // Size variations
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm gap-2',
  }[size];

  const dotSize = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  }[size];

  return (
    <div
      className="relative inline-block font-sans"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => setShowTooltip((prev) => !prev)}
    >
      {/* Badge Button/Tag */}
      <span
        className={`inline-flex items-center font-bold rounded-full border shadow-2xs cursor-pointer select-none transition-all duration-200 ${bgColor} ${sizeClasses} ${className}`}
      >
        <span className="relative flex items-center justify-center shrink-0">
          <span className={`rounded-full ${dotColor} ${dotSize}`} />
          {showPulse && (
            <span
              className={`absolute inline-flex h-full w-full rounded-full ${dotColor} opacity-75 animate-ping`}
            />
          )}
        </span>

        <span className="truncate">{cleanStatus}</span>
        <IconComponent className="w-3.5 h-3.5 opacity-80 shrink-0" />
      </span>

      {/* Interactive Tooltip showing last update timestamp */}
      {showTooltip && (
        <div className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 w-60 bg-slate-900 text-slate-100 p-2.5 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1.5 animate-fade-in pointer-events-none">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1 text-[11px] font-bold text-slate-300">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>آخر تحديث للحالة</span>
            </span>
            <span className="font-mono text-emerald-400 text-[10px]">{lastUpdated}</span>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed font-semibold">
            حالة الشهادة الحالية: <strong className="text-white">{cleanStatus}</strong>
          </p>

          {certificateNumber && (
            <p className="text-[10px] font-mono text-slate-400">
              رقم الوثيقة: <span className="text-amber-300">{certificateNumber}</span>
            </p>
          )}

          {/* Tooltip Down Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
};
