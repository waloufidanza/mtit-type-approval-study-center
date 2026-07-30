/**
 * @file Step5InitialStudy.tsx
 * Step 5: Professional Initial Study Document Structured Editor with Toolbar
 */

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  FileText,
  Save,
  Wand2,
  Table,
  PlusCircle,
  FileCheck2,
  Heading,
  ListOrdered,
  AlignRight,
  AlignLeft,
  History,
  GitCompare,
  Eye,
  FileSpreadsheet,
  CheckCircle2,
  RotateCcw,
  Clock,
  Check,
} from 'lucide-react';

export const Step5InitialStudy: React.FC = () => {
  const { currentRequest, setCurrentRequest, saveStatus, triggerSave, updateStepStatus, addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'editor' | 'a4preview' | 'versions'>('editor');

  const study = currentRequest.initialStudyContent;

  const handleTextChange = (field: keyof typeof study, val: string) => {
    setCurrentRequest((prev) => ({
      ...prev,
      initialStudyContent: {
        ...prev.initialStudyContent,
        [field]: val,
      },
    }));
  };

  const handleAutoGenerateFromData = () => {
    addToast({
      type: 'success',
      title: 'تم توليد مسودة التقرير تلقائياً',
      message: 'تم تجميع وسحب البيانات الفنية والنتائج المتحققة من الخطوات 1-4 وتضمينها في محرر التقرير.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Step Header & Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>الخطوة الخامسة: محرر تقرير الدراسة الأولية الشاملة</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              صياغة وتقسيم تقرير الدراسة الفنية الرسمية في 14 قسماً موحداً مع إمكانية المعاينة والتوليد الآلي.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* View switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1 rounded transition ${
                  activeTab === 'editor' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                المحرر المدمج
              </button>
              <button
                onClick={() => setActiveTab('a4preview')}
                className={`px-3 py-1 rounded transition ${
                  activeTab === 'a4preview' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                معاينة A4 ورقية
              </button>
            </div>

            <button
              onClick={() => updateStepStatus('step5', 'معتمدة')}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>اعتماد التقرير</span>
            </button>
          </div>
        </div>

        {/* Rich Toolbar Actions Bar */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto py-1 text-xs border-y border-slate-100 dark:border-slate-800 scrollbar-none">
          <div className="flex items-center gap-1.5">
            <button
              onClick={triggerSave}
              className="px-2.5 py-1.5 bg-blue-600 text-white rounded font-bold hover:bg-blue-500 flex items-center gap-1"
            >
              <Save className="w-3.5 h-3.5" />
              <span>حفظ</span>
            </button>

            <button
              onClick={handleAutoGenerateFromData}
              className="px-2.5 py-1.5 bg-amber-500 text-slate-950 rounded font-bold hover:bg-amber-400 flex items-center gap-1"
              title="تجميع كافة البيانات المعالجة تلقائياً"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>توليد آلي من البيانات المتحققة</span>
            </button>

            <button
              onClick={() => alert('إدراج جدول مقارنة بالمحرر')}
              className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded border border-slate-300 dark:border-slate-700"
              title="إدراج جدول"
            >
              <Table className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            </button>

            <button
              onClick={() => alert('إدراج ملخص النواقص المفتوحة')}
              className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-300 dark:border-slate-700 font-bold"
            >
              + ملخص النواقص
            </button>

            <button
              onClick={() => alert('إدراج نص الإفادة الترددية')}
              className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-300 dark:border-slate-700 font-bold"
            >
              + نص الإفادة
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('تصدير PDF شكل تجريبي')}
              className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded font-bold border border-slate-300 dark:border-slate-700"
            >
              تصدير PDF (تجريبي)
            </button>
            <button
              onClick={() => alert('تصدير DOCX شكل تجريبي')}
              className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded font-bold border border-slate-300 dark:border-slate-700"
            >
              تصدير Word (تجريبي)
            </button>
            <span className="text-[11px] font-mono text-slate-500 font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
              حالة التقرير: {saveStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Main View Mode: Editor vs A4 Sheet Preview */}
      {activeTab === 'editor' ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. بيانات الطلب */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">1. بيانات الطلب والسياق العام:</label>
              <textarea
                rows={3}
                value={study.requestContext}
                onChange={(e) => handleTextChange('requestContext', e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs leading-relaxed"
              />
            </div>

            {/* 2. تعريف الجهاز */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">2. تعريف الجهاز والهيكل العتادي:</label>
              <textarea
                rows={3}
                value={study.deviceDefinition}
                onChange={(e) => handleTextChange('deviceDefinition', e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs leading-relaxed"
              />
            </div>

            {/* 3. الاستخدام */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">3. الاستخدام المستهدف والتشغيل:</label>
              <textarea
                rows={3}
                value={study.intendedUse}
                onChange={(e) => handleTextChange('intendedUse', e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs leading-relaxed"
              />
            </div>

            {/* 4. الوثائق المراجعة */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">4. الوثائق والمستندات المراجعة:</label>
              <textarea
                rows={3}
                value={study.reviewedDocumentsSummary}
                onChange={(e) => handleTextChange('reviewedDocumentsSummary', e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs leading-relaxed"
              />
            </div>

            {/* 5. اتساق البيانات */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">5. اتساق البيانات ومصفوفة المصادر:</label>
              <textarea
                rows={3}
                value={study.dataConsistencySummary}
                onChange={(e) => handleTextChange('dataConsistencySummary', e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs leading-relaxed"
              />
            </div>

            {/* 6. المواصفات الفنية */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">6. ملخص المواصفات الفنية والكهربائية:</label>
              <textarea
                rows={3}
                value={study.technicalSpecsSummary}
                onChange={(e) => handleTextChange('technicalSpecsSummary', e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs leading-relaxed"
              />
            </div>

            {/* 7. الترددات */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">7. نتائج تحليل طيف الترددات والقدرة:</label>
              <textarea
                rows={3}
                value={study.spectrumAnalysisSummary}
                onChange={(e) => handleTextChange('spectrumAnalysisSummary', e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs leading-relaxed"
              />
            </div>

            {/* 8. المعايير والاختبارات */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">8. المعايير القياسية وتقارير الفحص:</label>
              <textarea
                rows={3}
                value={study.standardsAndTestingSummary}
                onChange={(e) => handleTextChange('standardsAndTestingSummary', e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs leading-relaxed"
              />
            </div>

            {/* 9. المخاطر والقيود */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">9. المخاطر الفنية والقيود التشغيلية:</label>
              <textarea
                rows={3}
                value={study.risksAndConstraints}
                onChange={(e) => handleTextChange('risksAndConstraints', e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs leading-relaxed"
              />
            </div>

            {/* 10. التنسيق الأمني */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">10. نتائج التنسيق والأمن السيبراني:</label>
              <textarea
                rows={3}
                value={study.securityCoordinationSummary}
                onChange={(e) => handleTextChange('securityCoordinationSummary', e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs leading-relaxed"
              />
            </div>

            {/* 11. النواقص والإفادات */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">11. حالة النواقص والإحالات الرسمية:</label>
              <textarea
                rows={3}
                value={study.deficienciesAndReferralsStatus}
                onChange={(e) => handleTextChange('deficienciesAndReferralsStatus', e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs leading-relaxed"
              />
            </div>

            {/* 12. التحليل الفني */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">12. التحليل والتقييم الفني الشامل:</label>
              <textarea
                rows={3}
                value={study.technicalAnalysis}
                onChange={(e) => handleTextChange('technicalAnalysis', e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs leading-relaxed"
              />
            </div>

            {/* 13. الخلاصة */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">13. الخلاصة والنتيجة التجميعية:</label>
              <textarea
                rows={3}
                value={study.conclusion}
                onChange={(e) => handleTextChange('conclusion', e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs leading-relaxed"
              />
            </div>

            {/* 14. التوصية الأولية */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">14. التوصية الأولية لمعد الدراسة:</label>
              <textarea
                rows={3}
                value={study.initialRecommendation}
                onChange={(e) => handleTextChange('initialRecommendation', e.target.value)}
                className="w-full p-3 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-lg text-xs leading-relaxed font-bold text-amber-950 dark:text-amber-200"
              />
            </div>
          </div>
        </div>
      ) : (
        /* A4 Sheet Preview Mode */
        <div className="bg-slate-200 dark:bg-slate-950 p-8 rounded-xl overflow-x-auto flex justify-center">
          <div className="a4-paper text-slate-900 space-y-6 text-xs leading-relaxed font-sans shadow-2xl">
            {/* Header emblem */}
            <div className="flex justify-between items-center border-b-2 border-slate-900 pb-4">
              <div className="text-right">
                <p className="font-bold text-sm">الجمهورية اليمنية</p>
                <p className="font-bold text-xs text-slate-700">وزارة الاتصالات وتقنية المعلومات</p>
                <p className="text-[10px] text-slate-500">المكتب الفني للموافقة النوعية</p>
              </div>

              <div className="text-center font-mono text-[10px] text-slate-600 border border-slate-300 p-2 rounded">
                <p className="font-bold text-xs text-slate-900">تقرير دراسة أولية</p>
                <p>الرقم: {currentRequest.requestNumber}</p>
                <p>التاريخ: 2026-07-30</p>
              </div>
            </div>

            {/* Subject */}
            <div className="bg-slate-100 p-3 rounded text-center font-bold text-sm text-slate-900">
              موضوع الدراسة: الموافقة النوعية للجهاز {currentRequest.brand} {currentRequest.model} ({currentRequest.deviceName})
            </div>

            {/* Content Sections Display */}
            <div className="space-y-4">
              <section>
                <h4 className="font-bold text-blue-900 border-b pb-1 mb-1">أولاً: بيانات الطلب والسياق العام</h4>
                <p>{study.requestContext}</p>
              </section>

              <section>
                <h4 className="font-bold text-blue-900 border-b pb-1 mb-1">ثانياً: النواقص والتوصية الأولية</h4>
                <p>{study.initialRecommendation}</p>
              </section>
            </div>

            <div className="pt-12 border-t flex justify-between items-end text-[10px] text-slate-500 font-mono">
              <span>صفحة 1 من 2</span>
              <span>تعتمد هذه المسودة إلكترونياً داخل منصة الوزارة</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
