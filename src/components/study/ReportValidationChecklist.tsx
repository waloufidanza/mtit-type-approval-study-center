/**
 * @file ReportValidationChecklist.tsx
 * Standalone Pre-Approval & Export Validation Checklist Unit.
 * Verifies request completeness, technical evaluation, spectrum review, security approvals,
 * open deficiencies, and sign-offs before allowing final report approval or export.
 * Displays a detailed list of reasons and blocking items if requirements are incomplete.
 */

import React from 'react';
import { ValidationCheckItem } from '../../services/reportService';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldAlert,
  CheckSquare,
  Info,
  FileCheck2,
  Lock,
} from 'lucide-react';

interface ReportValidationChecklistProps {
  items: ValidationCheckItem[];
  onRecheck?: () => void;
  className?: string;
}

export const ReportValidationChecklist: React.FC<ReportValidationChecklistProps> = ({
  items,
  onRecheck,
  className = '',
}) => {
  const criticalFailed = items.filter((item) => item.isCritical && !item.passed);
  const optionalFailed = items.filter((item) => !item.isCritical && !item.passed);
  const totalPassed = items.filter((item) => item.passed).length;
  const isFullyEligible = criticalFailed.length === 0;

  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-4 font-sans ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span>قائمة فحص واشتراطات الاعتماد والتصدير</span>
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              التحقق التلقائي من اكتمال المراجعة الفنية، البيانات، والاعتمادات الرسمية
            </p>
          </div>
        </div>

        <span
          className={`text-[10px] font-mono font-extrabold px-2.5 py-1 rounded-full border ${
            isFullyEligible
              ? 'bg-emerald-100 text-emerald-900 border-emerald-400 dark:bg-emerald-950/80 dark:text-emerald-200'
              : 'bg-rose-100 text-rose-900 border-rose-400 dark:bg-rose-950/80 dark:text-rose-200'
          }`}
        >
          {totalPassed} / {items.length} اجتاز
        </span>
      </div>

      {/* Main Validation Status Banner */}
      <div
        className={`p-3 rounded-xl border flex items-center gap-3 ${
          isFullyEligible
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100'
        }`}
      >
        {isFullyEligible ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        ) : (
          <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
        )}

        <div className="text-xs space-y-0.5">
          <p className="font-extrabold">
            {isFullyEligible
              ? 'تم استيفاء كافة المتطلبات والاشتراطات الأساسية للاعتماد والتصدير'
              : 'توجد متطلبات غير مكتملة تمنع الاعتماد النهائي للتقرير'}
          </p>
          <p className="text-[10px] opacity-90">
            {isFullyEligible
              ? 'يمكنك الآن إصدار واعتماد التقرير الفني النهائي وتصديره كملف رسميا.'
              : `يوجد (${criticalFailed.length}) بند إلزامي لم يتم استيفاؤه بعد.`}
          </p>
        </div>
      </div>

      {/* Unmet Reasons Box (Shown if any failed) */}
      {!isFullyEligible && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl space-y-2 text-xs text-amber-950 dark:text-amber-200">
          <div className="flex items-center gap-1.5 font-bold text-[11px] text-amber-900 dark:text-amber-300 border-b border-amber-200/80 pb-1">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>أسباب عدم اكتمال التقرير والاشتراطات المانعة:</span>
          </div>

          <ul className="space-y-1 text-[11px] list-disc list-inside">
            {criticalFailed.map((item) => (
              <li key={item.id} className="font-bold text-rose-800 dark:text-rose-300">
                <span className="font-mono text-[10px]">[متطلب إلزامي]:</span> {item.label}
              </li>
            ))}
            {optionalFailed.map((item) => (
              <li key={item.id} className="text-amber-900 dark:text-amber-200">
                <span className="font-mono text-[10px]">[توصية تحسين]:</span> {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Individual Items List */}
      <div className="space-y-2 text-xs">
        {items.map((item) => (
          <div
            key={item.id}
            className={`p-2.5 rounded-xl border flex items-start justify-between gap-2 transition ${
              item.passed
                ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/80 text-rose-950 dark:text-rose-200'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {item.passed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              )}

              <div className="space-y-0.5">
                <p className="font-bold text-[11px] leading-snug">{item.label}</p>
                {item.details && (
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{item.details}</p>
                )}
              </div>
            </div>

            <span
              className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold shrink-0 ${
                item.passed
                  ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                  : item.isCritical
                  ? 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-300'
                  : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
              }`}
            >
              {item.passed ? 'مكتمل' : item.isCritical ? 'إلزامي غير مكتمل' : 'اختياري'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
