/**
 * @file Step2Matrix.tsx
 * Step 2: Device Identity & Data Consistency Comparison Matrix
 */

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { ComparisonRow, MatchStatus } from '../../../types/typeApproval';
import { StatusBadge } from '../../common/StatusBadge';
import {
  GitCompare,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  XCircle,
  Edit,
  Send,
  SlidersHorizontal,
  Check,
  Info,
} from 'lucide-react';

export const Step2Matrix: React.FC = () => {
  const { currentRequest, setCurrentRequest, addToast, updateStepStatus } = useApp();
  const [selectedRow, setSelectedRow] = useState<ComparisonRow | null>(currentRequest.dataMatrix[2] || null);
  const [confirmedValInput, setConfirmedValInput] = useState<string>('');
  const [actionNoteInput, setActionNoteInput] = useState<string>('');

  const handleSelectRow = (row: ComparisonRow) => {
    setSelectedRow(row);
    setConfirmedValInput(row.confirmedValue || row.requestFormVal);
    setActionNoteInput(row.notes || '');
  };

  const handleConfirmValue = (newStatus: MatchStatus) => {
    if (!selectedRow) return;

    const updatedMatrix = currentRequest.dataMatrix.map((r) =>
      r.fieldKey === selectedRow.fieldKey
        ? {
            ...r,
            status: newStatus,
            confirmedValue: confirmedValInput,
            notes: actionNoteInput,
          }
        : r
    );

    setCurrentRequest((prev) => ({
      ...prev,
      dataMatrix: updatedMatrix,
    }));

    setSelectedRow((prev) =>
      prev ? { ...prev, status: newStatus, confirmedValue: confirmedValInput, notes: actionNoteInput } : null
    );

    addToast({
      type: 'success',
      title: 'تم اعتماد قيمة البند',
      message: `تم اعتماد القيمة النهائي لبند (${selectedRow.fieldName}) بنجاح.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>الخطوة الثانية: هوية الجهاز ومصفوفة اتساق البيانات عبر المصادر</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            مقارنة تقاطعية للبيانات المسجلة بنموذج الطلب مقابل شهادات المطابقة وتقارير الفحص والكتالوجات.
          </p>
        </div>

        <button
          onClick={() => updateStepStatus('step2', 'معتمدة')}
          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>اعتماد مصفوفة البيانات</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Matrix Main Table Column */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs overflow-hidden space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              جدول المقارنة الموحّد ({currentRequest.dataMatrix.length} حقول أساسية)
            </h3>
            <span className="text-[11px] text-slate-500">حدد صفاً لمراجعة القِيم والمصادر وتثبيتها</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg max-h-[550px] overflow-y-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-2.5">اسم الحقل الفني</th>
                  <th className="p-2.5">نموذج الطلب</th>
                  <th className="p-2.5">تقرير الفحص</th>
                  <th className="p-2.5">النشرة الفنية</th>
                  <th className="p-2.5 text-center">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {currentRequest.dataMatrix.map((row) => {
                  const isSelected = selectedRow?.fieldKey === row.fieldKey;
                  return (
                    <tr
                      key={row.fieldKey}
                      onClick={() => handleSelectRow(row)}
                      className={`cursor-pointer transition ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/50 border-r-4 border-r-blue-600 font-semibold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="p-2.5 font-bold text-slate-900 dark:text-slate-100">{row.fieldName}</td>
                      <td className="p-2.5 font-mono text-slate-700 dark:text-slate-300 max-w-[120px] truncate">
                        {row.requestFormVal}
                      </td>
                      <td className="p-2.5 font-mono text-slate-700 dark:text-slate-300 max-w-[120px] truncate">
                        {row.testReportVal}
                      </td>
                      <td className="p-2.5 font-mono text-slate-700 dark:text-slate-300 max-w-[120px] truncate">
                        {row.datasheetVal}
                      </td>
                      <td className="p-2.5 text-center">
                        <StatusBadge status={row.status} size="sm" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Field Detail Drawer / Action Panel */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          {selectedRow ? (
            <div className="space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  تفاصيل تدقيق الحقل
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {selectedRow.fieldName}
                </h3>
                <div className="mt-1">
                  <StatusBadge status={selectedRow.status} size="sm" />
                </div>
              </div>

              {/* Source-by-Source breakdown list */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-600 dark:text-slate-400">قيم الحقل عبر المستندات المختلفة:</h4>

                <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 block text-[10px]">1. نموذج الطلب الرسمي:</span>
                  <p className="font-mono font-bold text-slate-900 dark:text-slate-100">{selectedRow.requestFormVal}</p>
                </div>

                <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 block text-[10px]">2. شهادة المطابقة (CE/FCC):</span>
                  <p className="font-mono font-bold text-slate-900 dark:text-slate-100">{selectedRow.complianceCertVal}</p>
                </div>

                <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 block text-[10px]">3. تقرير الفحص المختبري (Test Report):</span>
                  <p className="font-mono font-bold text-blue-900 dark:text-blue-300">{selectedRow.testReportVal}</p>
                </div>

                <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 block text-[10px]">4. النشرة الفنية (Datasheet):</span>
                  <p className="font-mono font-bold text-slate-900 dark:text-slate-100">{selectedRow.datasheetVal}</p>
                </div>
              </div>

              {/* Edit Confirmed Value */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  القيمة المعتمدة نهائياً في الدراسة:
                </label>
                <input
                  type="text"
                  value={confirmedValInput}
                  onChange={(e) => setConfirmedValInput(e.target.value)}
                  className="w-full p-2 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />

                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mt-2">
                  سبب أو ملاحظة المراجع:
                </label>
                <textarea
                  rows={2}
                  value={actionNoteInput}
                  onChange={(e) => setActionNoteInput(e.target.value)}
                  placeholder="أدخل مبرر القبول أو التغاضي..."
                  className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Four Required Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleConfirmValue('متطابق')}
                  className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>اعتماد القيمة المحددة</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleConfirmValue('اختلاف_بسيط')}
                    className="py-1.5 px-2 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-bold transition flex items-center justify-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>اختلاف بسيط</span>
                  </button>

                  <button
                    onClick={() => handleConfirmValue('يحتاج_توضيحاً')}
                    className="py-1.5 px-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold transition flex items-center justify-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>طلب توضيح</span>
                  </button>
                </div>

                <button
                  onClick={() => handleConfirmValue('تعارض_جوهري')}
                  className="w-full py-1.5 px-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-xs font-semibold transition border border-slate-300 dark:border-slate-700"
                >
                  تحديد كتعارض جوهري
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">اختر حتلاً من الجدول لمراجعته</div>
          )}
        </div>
      </div>
    </div>
  );
};
