/**
 * @file DecisionSidebar.tsx
 * Sticky decision sidebar panel showing real-time eligibility & key evaluation parameters
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  AlertTriangle,
  Radio,
  ShieldCheck,
  FileCheck,
  CheckCircle2,
  Clock,
  ArrowLeft,
  XCircle,
  HelpCircle,
  Award,
} from 'lucide-react';

export const DecisionSidebar: React.FC = () => {
  const { currentRequest, setActiveStep } = useApp();

  // Calculate live statistics from request data
  const criticalDeficienciesCount = currentRequest.deficiencies.filter(
    (d) => (d.severity === 'حرج' || d.severity === 'مانع_للاعتماد') && d.status !== 'مغلق'
  ).length;

  const pendingReferralsCount = currentRequest.referrals.filter((r) => r.status !== 'تمت_الإفادة').length;

  // Evaluate eligibility criteria
  const isReportReady = currentRequest.stepStatuses.step5 === 'معتمدة' || currentRequest.stepStatuses.step5 === 'جاهزة_للمراجعة';
  const isSpectrumApproved = currentRequest.spectrumStatus === 'متوافق' || currentRequest.spectrumStatus === 'متوافق_بشروط';
  const noCriticalDefs = criticalDeficienciesCount === 0;

  const isEligibleForCert = isReportReady && isSpectrumApproved && noCriticalDefs;

  return (
    <aside className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
          لوحة القرار الجانبية
        </h3>
        <span className="text-[10px] font-mono font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900">
          مُحدّث آلياً
        </span>
      </div>

      <div className="space-y-3">
        {/* 1. النواقص الحرجة Card */}
        <div
          onClick={() => setActiveStep(4)}
          className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-md p-3 cursor-pointer hover:border-blue-500 transition"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">النواقص الحرجة والمانعة</span>
            <span
              className={`w-5 h-5 rounded text-[10px] flex items-center justify-center font-bold text-white ${
                criticalDeficienciesCount > 0 ? 'bg-rose-600' : 'bg-emerald-600'
              }`}
            >
              {String(criticalDeficienciesCount).padStart(2, '0')}
            </span>
          </div>
          <ul className="text-[11px] space-y-1 text-slate-700 dark:text-slate-300">
            {criticalDeficienciesCount > 0 ? (
              currentRequest.deficiencies
                .filter((d) => (d.severity === 'حرج' || d.severity === 'مانع_للاعتماد') && d.status !== 'مغلق')
                .map((def) => (
                  <li key={def.id} className="flex gap-1 text-rose-700 dark:text-rose-400 font-medium">
                    <span>•</span>
                    <span className="truncate">{def.description}</span>
                  </li>
                ))
            ) : (
              <li className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>لا توجد أي نواقص حرجّة</span>
              </li>
            )}
          </ul>
        </div>

        {/* 2. الإحالات الفنية Card */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-md p-3 space-y-2.5">
          <div className="text-xs font-bold text-slate-900 dark:text-slate-100">الإحالات الفنية والأمنية</div>
          <div className="space-y-2 text-xs">
            {/* الترددات */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">طيف الترددات</span>
                <StatusBadge status={currentRequest.spectrumStatus} size="sm" />
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-1.5 rounded-full ${
                    currentRequest.spectrumStatus === 'متوافق'
                      ? 'bg-emerald-600 w-full'
                      : 'bg-amber-500 w-2/3'
                  }`}
                />
              </div>
            </div>

            {/* الأمن السيبراني والتنسيق */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">التنسيق الأمني</span>
                <StatusBadge status={currentRequest.securityStatus} size="sm" />
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-1.5 rounded-full ${
                    currentRequest.securityStatus === 'موافق'
                      ? 'bg-emerald-600 w-full'
                      : 'bg-amber-500 w-1/2'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Certificate Eligibility Banner */}
        <div className="bg-[#0f172a] text-slate-100 border border-slate-800 rounded-md p-3 space-y-1.5">
          <div className="text-[11px] font-bold text-slate-300">أهلية إصدار الشهادة الرسمية</div>
          <div className={`text-sm font-extrabold ${isEligibleForCert ? 'text-emerald-400' : 'text-amber-300'}`}>
            {isEligibleForCert ? 'مؤهل لإصدار الشهادة' : 'غير مؤهل حالياً'}
          </div>
          <p className="text-[10px] leading-relaxed text-slate-300">
            {isEligibleForCert
              ? 'تم استيفاء الشروط الأساسية للفحص الترددي وإغلاق النواقص وبانتظار التوقيع.'
              : 'يجب إغلاق جميع النواقص الحرجة واستلام كافة الإفادات الترددية قبل الاعتماد.'}
          </p>
        </div>
      </div>

      {/* Prominent Primary Action Button */}
      <div className="pt-1">
        <button
          onClick={() => setActiveStep(isEligibleForCert ? 8 : pendingReferralsCount > 0 ? 4 : 5)}
          className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-md transition flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <span>الإجراء التالي: {isEligibleForCert ? 'التوجه للاعتمادات' : 'متابعة النواقص والإحالات'}</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
