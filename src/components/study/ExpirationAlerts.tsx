/**
 * @file ExpirationAlerts.tsx
 * Expiration Alerts component for the Study Center (مركز الدراسة).
 * Calculates certificates near expiration (< 30 days) using CertificateService
 * and presents them in an interactive warning banner/panel.
 */

import React, { useState, useEffect } from 'react';
import {
  certificateService,
  ExpiringCertificateItem,
} from '../../services/certificateService';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  Clock,
  Send,
  Calendar,
  ChevronDown,
  ChevronUp,
  X,
  FileCheck2,
  BellRing,
  CheckCircle2,
} from 'lucide-react';

export const ExpirationAlerts: React.FC = () => {
  const { addToast } = useApp();
  const [expiringList, setExpiringList] = useState<ExpiringCertificateItem[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [notifiedIds, setNotifiedIds] = useState<string[]>([]);

  useEffect(() => {
    const items = certificateService.getExpiringCertificates(30);
    setExpiringList(items);
  }, []);

  const visibleItems = expiringList.filter((item) => !dismissedIds.includes(item.id));

  if (visibleItems.length === 0) {
    return null;
  }

  const criticalCount = visibleItems.filter((item) => item.status === 'حرج').length;

  const handleSendReminder = (item: ExpiringCertificateItem) => {
    if (notifiedIds.includes(item.id)) return;
    setNotifiedIds((prev) => [...prev, item.id]);
    addToast({
      type: 'success',
      title: 'إرسال إشعار تجديد',
      message: `تم إرسال تذكير رسمي بتجديد الشهادة (${item.certificateNumber}) إلى المستورد (${item.applicantName}) بنجاح.`,
    });
  };

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => [...prev, id]);
  };

  return (
    <div className="bg-amber-500/10 dark:bg-amber-950/40 border-l-4 border-amber-500 rounded-r-xl border border-amber-200 dark:border-amber-900/60 p-4 shadow-sm font-sans space-y-3">
      {/* Banner Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500 text-slate-950 rounded-lg animate-pulse">
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-amber-950 dark:text-amber-200">
                تحذيرات الشهادات القريبة من الانتهاء (أقل من 30 يوماً)
              </h3>
              <span className="px-2 py-0.5 bg-amber-600 text-white font-mono font-extrabold text-[11px] rounded-full">
                {visibleItems.length} شهادات
              </span>
              {criticalCount > 0 && (
                <span className="px-2 py-0.5 bg-rose-600 text-white font-mono font-extrabold text-[11px] rounded-full animate-bounce">
                  {criticalCount} حرج جداً
                </span>
              )}
            </div>
            <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
              استنادا إلى بيانات محرك CertificateService، تتوفر شهادات ترخيص مؤقته ورسمية شارفت على الانتهاء تتطلب المتابعة والتجديد
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="px-3 py-1 bg-amber-100 dark:bg-amber-900/60 hover:bg-amber-200 text-amber-950 dark:text-amber-200 font-bold rounded-lg text-xs transition flex items-center gap-1 shrink-0"
        >
          <span>{isExpanded ? 'طي اللوحة' : 'عرض التفاصيل'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded List Grid */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {visibleItems.map((item) => {
            const isCritical = item.daysRemaining <= 10;
            const isNotified = notifiedIds.includes(item.id);

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border space-y-2.5 transition relative ${
                  isCritical
                    ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'
                    : 'bg-amber-50/90 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
                }`}
              >
                {/* Item Top Bar */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold font-mono border ${
                        isCritical
                          ? 'bg-rose-600 text-white border-rose-700'
                          : 'bg-amber-600 text-white border-amber-700'
                      }`}
                    >
                      {isCritical ? 'حرج (ينتهي قريباً)' : 'تحذير تجديد'}
                    </span>

                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {item.certificateNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-extrabold text-rose-700 dark:text-rose-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-rose-600" />
                      <span>متبقي {item.daysRemaining} يوم</span>
                    </span>

                    <button
                      onClick={() => handleDismiss(item.id)}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                      title="إخفاء التنبيه"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details Body */}
                <div className="space-y-1 text-xs">
                  <p className="font-extrabold text-slate-900 dark:text-slate-100">
                    {item.applicantName}
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 font-mono">
                    الجهاز: <strong>{item.brandModel}</strong> ({item.certificateType})
                  </p>

                  <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500 dark:text-slate-400 pt-1">
                    <span>تاريخ الانتهاء: <strong className="text-rose-700 dark:text-rose-300">{item.expiryDate}</strong></span>
                    <span>رقم الطلب: {item.requestNumber}</span>
                  </div>
                </div>

                {/* Action Controls */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 font-bold">
                    إجراء متطلب: إشعار المستورد
                  </span>

                  <button
                    onClick={() => handleSendReminder(item)}
                    disabled={isNotified}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition flex items-center gap-1 ${
                      isNotified
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700 cursor-not-allowed'
                        : isCritical
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-xs'
                        : 'bg-amber-600 hover:bg-amber-500 text-white shadow-xs'
                    }`}
                  >
                    {isNotified ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>تم إرسال التذكير</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>إرسال إشعار تجديد</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
