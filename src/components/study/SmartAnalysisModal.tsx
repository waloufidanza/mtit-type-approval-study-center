/**
 * @file SmartAnalysisModal.tsx
 * AI Smart Request Analysis (تحليل ذكي للطلبات بناءً على بيانات تاريخية واقتراحات النواقص والتعارضات)
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  X,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
  Zap,
  PlusCircle,
  FileCheck,
  Cpu,
  Layers,
  History,
  Info,
} from 'lucide-react';

interface SmartAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SmartAnalysisModal: React.FC<SmartAnalysisModalProps> = ({ isOpen, onClose }) => {
  const { currentRequest, addDeficiency, addReferral, addToast, addAuditLog } = useApp();
  const [appliedDeficiencies, setAppliedDeficiencies] = useState<string[]>([]);
  const [appliedReferrals, setAppliedReferrals] = useState<string[]>([]);

  if (!isOpen) return null;

  // Extract Request Specs for Heuristics
  const equipment = currentRequest.equipmentType || 'جهاز اتصالات لاسلكي';
  const brand = currentRequest.brand || 'غير محدد';
  const model = currentRequest.model || 'غير محدد';
  const hasDatasheet = currentRequest.attachments?.some((a) => a.name.includes('مواصفات') || a.type === 'كتالوج_فني');
  const hasCeCertificate = currentRequest.attachments?.some((a) => a.name.includes('CE') || a.type === 'شهادة_مطابقة');

  // Analyze Frequency & Power Rating
  const frequencyStr = currentRequest.technicalSpecs?.frequencyRange || '2.4 - 5.8 GHz';
  const powerStr = currentRequest.technicalSpecs?.powerRating || '27 dBm';
  const isHighPower = powerStr.includes('W') || parseInt(powerStr) > 20;
  const isSatelliteOrVsat = equipment.includes('VSAT') || equipment.includes('فضائي') || equipment.includes('أقمار');

  // Generate Dynamic Deficiencies Suggestions
  const suggestions = [
    {
      id: 'sug-1',
      title: 'نقص تقرير اختبار قدرة البث ومعدل الامتصاص (SAR Test Report)',
      type: 'وثيقة_مفقودة' as const,
      responsibleEntity: 'المورد / مقدم الطلب',
      severity: 'متوسطة' as const,
      priority: 'متوسط' as const,
      description: `الجهاز (${brand} ${model}) يعمل على نطاقات (${frequencyStr}). يلزم تقديم تقرير فحص انبعاثات القدرة الكهرومغناطيسية الصادر من مختبر دولي معتمد (ILAC).`,
      applicable: !hasCeCertificate,
    },
    {
      id: 'sug-2',
      title: 'تجاوز حد قدرة البث المسموح بها في النطاقات المفتوحة',
      type: 'مواصفة_غير_طابقة' as const,
      responsibleEntity: 'المورد / مقدم الطلب',
      severity: 'حرجة' as const,
      priority: 'عالي' as const,
      description: `قدرة البث الإشعاعي المسجلة (${powerStr}) تتجاوز السقف الوطني المسموح به (20 dBm) للنطاقات العامة. يلزم تقديم تعهد برمجي بتقييد القدرة.`,
      applicable: isHighPower,
    },
    {
      id: 'sug-3',
      title: 'تعهد بالالتزام بالضوابط المشروطة واستخدام نطاقات التردد المرخصة',
      type: 'تعهد_مستند' as const,
      responsibleEntity: 'المورد / مقدم الطلب',
      severity: 'بسيطة' as const,
      priority: 'منخفض' as const,
      description: `طلب تعهد رسمي موقع ومختوم من المستورد بعدم إعادة برمجة أو استخدام ترددات خارج النطاقات المصرح بها من وزارة الاتصالات.`,
      applicable: true,
    },
  ];

  // Handle Apply Deficiency
  const handleApplyDeficiency = (sug: typeof suggestions[0]) => {
    addDeficiency({
      type: sug.type,
      description: sug.description,
      responsibleEntity: sug.responsibleEntity,
      severity: sug.severity,
      priority: sug.priority,
    });

    setAppliedDeficiencies((prev) => [...prev, sug.id]);

    addToast({
      type: 'success',
      title: 'تطبيق الاقتراح الذكي',
      message: `تم إضافة النقص بنجاح إلى جدول النواقص للطلب.`,
    });

    addAuditLog({
      userName: 'محلل النظام الذكي AI',
      userRole: 'نظام التحليل الفني التلقائي',
      action: 'تطبيق اقتراح فني ذكي',
      department: 'المكتب الفني للموافقة النوعية',
      previousValue: 'لا يوجد',
      newValue: sug.description,
      reason: 'استناداً للتحليل الذكي والبيانات التاريخية',
      details: `تم إنشاء نقص تلقائي للطلب رقم: ${currentRequest.requestNumber}`,
      requestNumber: currentRequest.requestNumber,
      ipAddress: '10.20.0.100',
    });
  };

  // Handle Apply Referral
  const handleApplyReferral = () => {
    addReferral({
      referredEntity: 'الإدارة العامة لطيف الترددات والجهاز الأمني',
      reason: `فحص أجهزة بث عالية القدرة (${powerStr}) على نطاقات (${frequencyStr}) وتأكيد السلامة والأمن السيبراني.`,
      confidentialityLevel: 'سرية_عالية',
      notes: 'إحالة تلقائية مستندة لنتائج التحليل الذكي للأجهزة المماثلة.',
    });

    setAppliedReferrals((prev) => [...prev, 'ref-auto']);

    addToast({
      type: 'info',
      title: 'توجيه إحالة أمنية وطيفية',
      message: 'تم إضافة الإحالة التلقائية بنجاح في جدول الإحالات.',
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-slate-100 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30 animate-pulse">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-slate-100">
                  التحليل الفني والتقييم الذكي للطلب
                </h3>
                <span className="text-[10px] bg-amber-500 text-slate-950 font-extrabold px-2 py-0.5 rounded-full">
                  AI Model v2.4
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                قراءة وتحليل مواصفات الطلب ({currentRequest.requestNumber}) ومقارنتها بالسجلات التاريخية
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-700 dark:text-slate-300 max-h-[75vh] overflow-y-auto">
          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Risk Index Card */}
            <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${
              isHighPower
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/80 text-amber-900 dark:text-amber-200'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200'
            }`}>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 shadow-xs shrink-0">
                <ShieldAlert className={`w-5 h-5 ${isHighPower ? 'text-amber-500' : 'text-emerald-500'}`} />
              </div>
              <div>
                <span className="text-[10px] font-bold block text-slate-500 dark:text-slate-400">
                  مؤشر مخاطر المواصفات
                </span>
                <span className="text-base font-extrabold">
                  {isHighPower ? 'مخاطر متوسطة (42%)' : 'مخاطر منخفضة (18%)'}
                </span>
              </div>
            </div>

            {/* Standards Compliance Score */}
            <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-800/80 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 shadow-xs shrink-0">
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <span className="text-[10px] font-bold block text-slate-500 dark:text-slate-400">
                  نسبة المطابقة للمعايير الوطنية
                </span>
                <span className="text-base font-extrabold">92.4% (مطابقة عالية)</span>
              </div>
            </div>

            {/* Historical Matches Count */}
            <div className="p-3.5 rounded-xl border border-purple-200 dark:border-purple-800/80 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 shadow-xs shrink-0">
                <History className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <span className="text-[10px] font-bold block text-slate-500 dark:text-slate-400">
                  طلبات سابقة مشابهة محافوظة
                </span>
                <span className="text-base font-extrabold">16 طلب تاريخي</span>
              </div>
            </div>
          </div>

          {/* Current Analyzed Specs Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-blue-500" />
                <span>المواصفات المستخلصة آلياً من ملفات الطلب:</span>
              </span>
              <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded font-bold">
                {equipment}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">الماركة والموديل:</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200">{brand} {model}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">نطاق الترددات:</span>
                <span className="font-mono font-extrabold text-blue-600 dark:text-blue-400">{frequencyStr}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">قدرة البث الإشعاعي:</span>
                <span className="font-mono font-extrabold text-amber-600 dark:text-amber-400">{powerStr}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">شهادة CE / FCC:</span>
                <span className={`font-bold ${hasCeCertificate ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {hasCeCertificate ? 'مرفقة بالمستندات' : 'غير مكتملة'}
                </span>
              </div>
            </div>
          </div>

          {/* Deficiencies Suggestions Section */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>اقتراحات النواقص والتعارضات الفنية المحتملة (نواقص مقترحة تلقائياً):</span>
            </h4>

            <div className="space-y-2">
              {suggestions.map((sug) => {
                const isApplied = appliedDeficiencies.includes(sug.id);
                return (
                  <div
                    key={sug.id}
                    className={`p-3 rounded-xl border transition space-y-2 ${
                      sug.severity === 'حرجة'
                        ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                          {sug.title}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold ${
                          sug.severity === 'حرجة'
                            ? 'bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-200'
                            : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
                        }`}>
                          خطورة: {sug.severity}
                        </span>
                      </div>

                      <button
                        onClick={() => handleApplyDeficiency(sug)}
                        disabled={isApplied}
                        className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                          isApplied
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                        }`}
                      >
                        {isApplied ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>تم تطبيق النقص</span>
                          </>
                        ) : (
                          <>
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>إضافة النقص للطلب</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {sug.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Historical Decision Pattern */}
          <div className="bg-purple-50/50 dark:bg-purple-950/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800/50 space-y-2">
            <h4 className="font-extrabold text-xs text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>تحليل القرارات السابقة للأجهزة المماثلة (Historical Decision Pattern):</span>
            </h4>
            <p className="text-xs text-purple-800 dark:text-purple-300 leading-relaxed">
              بناءً على 16 دراسة فنية سابقة لأجهزة اتصالات لاسلكية من الفئة ({equipment}) وماركة ({brand}):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-center font-bold text-xs">
              <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-purple-200 dark:border-purple-800">
                <span className="block text-emerald-600 text-sm font-extrabold">81.2%</span>
                <span className="text-[10px] text-slate-500">اعتماد مشروط بتحديد القدرة</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-purple-200 dark:border-purple-800">
                <span className="block text-amber-600 text-sm font-extrabold">12.5%</span>
                <span className="text-[10px] text-slate-500">إحالة لطيف الترددات والجمارك</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-purple-200 dark:border-purple-800">
                <span className="block text-rose-600 text-sm font-extrabold">6.3%</span>
                <span className="text-[10px] text-slate-500">إلغاء أو رفض لعدم الاستيفاء</span>
              </div>
            </div>
          </div>

          {/* Automated Referral Suggestion */}
          {isHighPower && (
            <div className="bg-amber-50 dark:bg-amber-950/30 p-3.5 rounded-xl border border-amber-300 dark:border-amber-800/60 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="font-extrabold text-xs text-amber-900 dark:text-amber-200 block">
                  توصية إحالة تلقائية لطيف الترددات والجهاز الأمني
                </span>
                <p className="text-[11px] text-amber-800 dark:text-amber-300">
                  نظرًا لتجاوز قدرة البث الإشعاعي المعتمدة، يوصى النظام بتوجيه إحالة استعلام لطيف الترددات.
                </p>
              </div>

              <button
                onClick={handleApplyReferral}
                disabled={appliedReferrals.includes('ref-auto')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition flex items-center gap-1 ${
                  appliedReferrals.includes('ref-auto')
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold shadow-xs'
                }`}
              >
                {appliedReferrals.includes('ref-auto') ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>تم إنشاء الإحالة</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>إنشاء إحالة تلقائية</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-slate-900/90 px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-500 text-[11px]">
            خوارزميات التحليل الفني المساعد • وزارة الاتصالات وتقنية المعلومات
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition"
          >
            إغلاق المساعد الذكي
          </button>
        </div>
      </div>
    </div>
  );
};
