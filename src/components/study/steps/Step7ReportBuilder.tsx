/**
 * @file Step7ReportBuilder.tsx
 * Step 7: Official Final Report Builder & Printable A4 Sheet Engine
 */

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { exportElementToPDF, exportTechnicalReportPDF } from '../../../utils/pdfExport';
import { MinistryLogo } from '../../common/MinistryLogo';
import { ChangeLogViewer } from '../ChangeLogViewer';
import {
  FileText,
  Printer,
  Download,
  Eye,
  CheckCircle2,
  Sliders,
  QrCode,
  Layers,
  History,
  FileSpreadsheet,
} from 'lucide-react';

export const Step7ReportBuilder: React.FC = () => {
  const { currentRequest, updateStepStatus, addToast } = useApp();

  const [visibleSections, setVisibleSections] = useState({
    header: true,
    toc: true,
    context: true,
    matrix: true,
    spectrum: true,
    deficiencies: true,
    opinion: true,
    signatures: true,
  });

  const toggleSection = (key: keyof typeof visibleSections) => {
    setVisibleSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>الخطوة السابعة: منشئ التقرير الفني النهائي (Report Builder)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            تجميع واستعراض التقرير النهائي الجاهز للطباعة والاعتماد مع خيارات إخفاء/إظهار الأقسام.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-slate-800 text-white hover:bg-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الورقة الرسمية</span>
          </button>

          <button
            onClick={() => updateStepStatus('step7', 'معتمدة')}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>اعتماد التقرير النهائي</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Section Visibility Controls Sidebar */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>التحكم بأقسام التقرير:</span>
          </h3>

          <div className="space-y-2 text-xs">
            {Object.entries({
              header: 'الترويسة والرأس الرسمي',
              toc: 'جدول المحتويات',
              context: 'سياق الطلب وأطرافه',
              matrix: 'جدول اتساق البيانات',
              spectrum: 'جدول الترددات والفحص',
              deficiencies: 'ملخص النواقص والإحالات',
              opinion: 'الرأي الفني والتوصية',
              signatures: 'ختام الاعتمادات والتوقيع',
            }).map(([key, label]) => (
              <label
                key={key}
                className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <span className="font-bold text-slate-800 dark:text-slate-200">{label}</span>
                <input
                  type="checkbox"
                  checked={visibleSections[key as keyof typeof visibleSections]}
                  onChange={() => toggleSection(key as keyof typeof visibleSections)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
              </label>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <button
              onClick={() => {
                exportElementToPDF('printable-report-paper', `Technical-Report-${currentRequest.requestNumber}`);
                addToast('جاري توليد ملف PDF للتقرير الفني بالترويسة والشعار الرسمي...', 'info');
              }}
              className="w-full py-1.5 bg-rose-900/10 hover:bg-rose-900/20 text-rose-700 dark:text-rose-300 rounded text-xs font-bold border border-rose-300 dark:border-rose-800 flex items-center justify-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تصدير ملف PDF رسمياً</span>
            </button>

            <button
              onClick={() => alert('تصدير DOCX شكل تجريبي')}
              className="w-full py-1.5 bg-blue-900/10 hover:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded text-xs font-bold border border-blue-300 dark:border-blue-800 flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تصدير Word (DOCX)</span>
            </button>
          </div>
        </div>

        {/* Printable A4 Document Preview Stage */}
        <div className="lg:col-span-9 bg-slate-200 dark:bg-slate-950 p-8 rounded-xl overflow-x-auto flex justify-center">
          <div
            id="printable-report-paper"
            className="a4-paper text-slate-900 space-y-6 text-xs leading-relaxed font-sans shadow-2xl relative bg-white p-8"
          >
            {/* Header */}
            {visibleSections.header && (
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                <div className="text-right space-y-0.5">
                  <p className="font-extrabold text-base">الجمهورية اليمنية</p>
                  <p className="font-bold text-xs text-slate-800">وزارة الاتصالات وتقنية المعلومات</p>
                  <p className="text-[11px] text-slate-600">الإدارة العامة لتنظيم الاتصالات • المكتب الفني</p>
                </div>

                <MinistryLogo className="w-14 h-14 text-amber-700 mx-auto" />

                {/* QR Placeholder */}
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 border-2 border-slate-900 p-1 flex flex-col items-center justify-center bg-slate-50">
                    <QrCode className="w-12 h-12 text-slate-900" />
                  </div>
                  <div className="text-left font-mono text-[10px] text-slate-600">
                    <p className="font-bold text-xs text-slate-900">تقرير دراسة فنية</p>
                    <p>رقم: {currentRequest.requestNumber}</p>
                    <p>التاريخ: 2026-07-30</p>
                  </div>
                </div>
              </div>
            )}

            {/* Document Title */}
            <div className="bg-slate-100 p-3 rounded text-center border border-slate-300">
              <h1 className="font-extrabold text-sm text-slate-900">
                تقرير الدراسة الفنية النهائية لإصدار الموافقة النوعية
              </h1>
              <p className="text-[11px] text-slate-600 mt-0.5">
                الجهاز: {currentRequest.brand} {currentRequest.model} • المورد: {currentRequest.localRep.companyName}
              </p>
            </div>

            {/* Table of Contents */}
            {visibleSections.toc && (
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1 text-[11px]">
                <span className="font-bold block text-slate-800 border-b pb-1">جدول محتويات التقرير:</span>
                <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
                  <p>1. بيانات الطلب وأطرافه (ص 1)</p>
                  <p>2. اتساق بيانات المصادر (ص 1)</p>
                  <p>3. الفحص الفني والترددي (ص 2)</p>
                  <p>4. الرأي الفني والاشتراطات (ص 2)</p>
                </div>
              </div>
            )}

            {/* Context Section */}
            {visibleSections.context && (
              <div className="space-y-1.5">
                <h3 className="font-bold text-blue-900 border-b pb-1 text-xs">1. بيانات الطلب وأطرافه الرسمية</h3>
                <p>{currentRequest.initialStudyContent.requestContext}</p>
              </div>
            )}

            {/* Data Matrix */}
            {visibleSections.matrix && (
              <div className="space-y-1.5">
                <h3 className="font-bold text-blue-900 border-b pb-1 text-xs">2. نتائج مطابقة البيانات الهيكلية</h3>
                <table className="w-full text-right text-[10px] border-collapse border border-slate-300">
                  <thead>
                    <tr className="bg-slate-100 font-bold">
                      <th className="border p-1">الحقل</th>
                      <th className="border p-1">القيمة المعتمدة</th>
                      <th className="border p-1">حالة المطابقة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRequest.dataMatrix.slice(0, 4).map((r) => (
                      <tr key={r.fieldKey}>
                        <td className="border p-1 font-bold">{r.fieldName}</td>
                        <td className="border p-1 font-mono">{r.confirmedValue || r.requestFormVal}</td>
                        <td className="border p-1">{r.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Spectrum Section */}
            {visibleSections.spectrum && (
              <div className="space-y-1.5">
                <h3 className="font-bold text-blue-900 border-b pb-1 text-xs">3. الفحص الفني والترددي والتوافق</h3>
                <p>{currentRequest.initialStudyContent.spectrumAnalysisSummary}</p>
              </div>
            )}

            {/* Technical Opinion Section */}
            {visibleSections.opinion && (
              <div className="space-y-1.5 p-3 bg-amber-50/60 border border-amber-200 rounded">
                <h3 className="font-bold text-amber-900 border-b border-amber-300 pb-1 text-xs">
                  4. التوصية الفنية النهائية والاشتراطات
                </h3>
                <p className="font-bold text-blue-900">
                  القرار: {currentRequest.technicalOpinion.finalRecommendation.replace(/_/g, ' ')}
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                  {currentRequest.technicalOpinion.conditions.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Signatures */}
            {visibleSections.signatures && (
              <div className="pt-8 grid grid-cols-2 gap-8 text-center text-[10px]">
                <div>
                  <p className="font-bold">معد الدراسة الفنية</p>
                  <p className="text-slate-500">م. أحمد باصريح</p>
                  <div className="h-10 flex items-center justify-center font-serif text-blue-800 text-xs italic">
                    A. Basarih
                  </div>
                </div>
                <div>
                  <p className="font-bold">رئيس المكتب الفني</p>
                  <p className="text-slate-500">د. صادق الشرفي</p>
                  <div className="h-10 flex items-center justify-center text-slate-400 italic">
                    (توقيع إلكتروني موازي)
                  </div>
                </div>
              </div>
            )}

            <div className="pt-6 border-t flex justify-between items-center text-[9px] text-slate-400 font-mono">
              <span>صفحة 1 من 1</span>
              <span>وزارة الاتصالات وتقنية المعلومات - نظام الموافقة النوعية</span>
            </div>
          </div>
        </div>
      </div>

      {/* Audit & Change Log Viewer Component */}
      <ChangeLogViewer />
    </div>
  );
};
