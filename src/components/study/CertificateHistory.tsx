/**
 * @file CertificateHistory.tsx
 * Displays a list of previous certificate issuance history records for the current request.
 * Displays statuses (صادرة، ملغاة، محدثة، مسودة) along with timestamps, performed roles, and notes.
 */

import React, { useState } from 'react';
import { IssuanceHistoryRecord } from '../../services/certificateService';
import { useApp } from '../../context/AppContext';
import {
  History,
  CheckCircle2,
  XCircle,
  RefreshCw,
  FileText,
  Search,
  Clock,
  User,
  ShieldCheck,
  GitCompare,
  X,
  ArrowLeftRight,
  Check,
  AlertCircle,
} from 'lucide-react';

interface CertificateHistoryProps {
  records: IssuanceHistoryRecord[];
  requestNumber?: string;
}

export const CertificateHistory: React.FC<CertificateHistoryProps> = ({
  records,
  requestNumber,
}) => {
  const { currentRequest } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('الكل');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [compareRecord, setCompareRecord] = useState<IssuanceHistoryRecord | null>(null);

  // Filter records based on selected status tab and search term
  const filteredRecords = records.filter((rec) => {
    const matchesStatus =
      filterStatus === 'الكل' || rec.status === filterStatus;
    const matchesSearch =
      searchTerm.trim() === '' ||
      rec.action.includes(searchTerm) ||
      rec.performedBy.includes(searchTerm) ||
      rec.notes.includes(searchTerm) ||
      rec.version.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: IssuanceHistoryRecord['status']) => {
    switch (status) {
      case 'صادرة':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>صادرة رسمياً</span>
          </span>
        );
      case 'ملغاة':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>ملغاة</span>
          </span>
        );
      case 'محدثة':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-800 flex items-center gap-1">
            <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin-slow" />
            <span>محدثة</span>
          </span>
        );
      case 'مسودة':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-amber-600" />
            <span>مسودة</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
      {/* Header Title & Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-600 text-white rounded-lg">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>سجل إصدارات وتحديثات الشهادة (Certificate History)</span>
              {requestNumber && (
                <span className="text-[11px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                  {requestNumber}
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              تتبع زمني لكافة عمليات الإصدار، التعديل، والإلغاء السابقة مع التوثيق المعتمد
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث في السجل..."
            className="w-full pr-8 pl-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Filter Tabs by Status */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
        {['الكل', 'صادرة', 'محدثة', 'مسودة', 'ملغاة'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
              filterStatus === st
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <span>{st}</span>
            <span className="text-[10px] opacity-80 font-mono">
              (
              {st === 'الكل'
                ? records.length
                : records.filter((r) => r.status === st).length}
              )
            </span>
          </button>
        ))}
      </div>

      {/* Records Timeline List */}
      {filteredRecords.length === 0 ? (
        <div className="text-center py-8 text-xs text-slate-500 space-y-1">
          <History className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="font-bold">لا توجد سجلات تطابق الفلتر المحدد</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              className="p-4 bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl space-y-2.5 transition hover:border-purple-300 dark:hover:border-purple-800"
            >
              {/* Record Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getStatusBadge(record.status)}
                  <span className="font-mono text-xs font-extrabold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    {record.version}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{record.timestamp}</span>
                  </span>

                  {/* Compare Button */}
                  <button
                    onClick={() => setCompareRecord(record)}
                    className="px-2.5 py-1 bg-purple-100 dark:bg-purple-950/80 hover:bg-purple-200 text-purple-900 dark:text-purple-200 border border-purple-300 dark:border-purple-800 rounded-lg text-xs font-extrabold transition flex items-center gap-1 shadow-2xs"
                    title="مقارنة الفروقات بين هذه النسخة والنسخة الحالية للطلب"
                  >
                    <GitCompare className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>مقارنة</span>
                  </button>
                </div>
              </div>

              {/* Action Title & Notes */}
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
                  {record.action}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800">
                  {record.notes}
                </p>
              </div>

              {/* Bottom Metadata */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-purple-500" />
                  <span>
                    القائم بالإجراء: <strong>{record.performedBy}</strong> (
                    {record.role})
                  </span>
                </div>

                <div className="flex items-center gap-1.5 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>نوع الشهادة: {record.certificateType}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Side Panel Drawer for Comparison */}
      {compareRecord && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex justify-end font-sans animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl h-full shadow-2xl border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between overflow-hidden">
            {/* Drawer Header */}
            <div className="p-4 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <GitCompare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm flex items-center gap-2">
                    <span>مقارنة الفروقات بين النسخ (Version Diff Comparison)</span>
                  </h3>
                  <p className="text-[11px] text-slate-300 font-mono">
                    مقارنة السجل المختارة <span className="text-purple-300 font-bold">{compareRecord.version}</span> مع النسخة الحالية للطلب
                  </p>
                </div>
              </div>

              <button
                onClick={() => setCompareRecord(null)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comparison Body Content */}
            <div className="p-5 flex-1 overflow-y-auto space-y-5">
              {/* Diff Summary Bar */}
              <div className="p-3.5 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-xl flex items-center justify-between gap-3 text-xs text-purple-900 dark:text-purple-200">
                <div className="flex items-center gap-2">
                  <ArrowLeftRight className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>عرض التباينات والتغييرات الفنية المقترنة بين النسختين:</span>
                </div>
                <span className="font-bold text-[11px] bg-purple-200 dark:bg-purple-900 px-2 py-0.5 rounded-full font-mono">
                  {requestNumber || currentRequest.requestNumber}
                </span>
              </div>

              {/* Data Diff Table / Cards */}
              <div className="space-y-3 text-xs">
                {[
                  {
                    label: 'رقم الإصدار والإجراء',
                    selectedVal: `${compareRecord.version} - ${compareRecord.action}`,
                    currentVal: 'النسخة الحالية الرسمية (v2.0-APPROVAL_PENDING)',
                  },
                  {
                    label: 'حالة الشهادة',
                    selectedVal: compareRecord.status,
                    currentVal: 'قيد الاعتماد النهائي / رسمية',
                  },
                  {
                    label: 'القائم بالإجراء والصفة',
                    selectedVal: `${compareRecord.performedBy} (${compareRecord.role})`,
                    currentVal: 'م. وائل صلاح القاسمي (رئيس المكتب الفني)',
                  },
                  {
                    label: 'نوع الشهادة الصادرة',
                    selectedVal: compareRecord.certificateType,
                    currentVal: currentRequest.certificateType || 'رسمية_3سنوات_ناقص_يوم',
                  },
                  {
                    label: 'التاريخ والوقت',
                    selectedVal: compareRecord.timestamp,
                    currentVal: 'مباشر - ' + new Date().toLocaleDateString('ar-YE'),
                  },
                  {
                    label: 'طيف الترددات المعتمد',
                    selectedVal: '2.400 - 2.4835 GHz (مسودة سابقة)',
                    currentVal: currentRequest.technicalSpecs?.frequencyRange || '2.400 - 2.4835 GHz / 5.150 - 5.850 GHz',
                  },
                  {
                    label: 'الشركة المصنعة والموديل',
                    selectedVal: `${currentRequest.brand} ${currentRequest.model}`,
                    currentVal: `${currentRequest.brand} ${currentRequest.model}`,
                  },
                  {
                    label: 'الملاحظات والتوصية الفنية',
                    selectedVal: compareRecord.notes,
                    currentVal: 'تم التأكد من استيفاء كافة الشروط واعتماد التقرير النهائي بانتظار توقيع المدير العام.',
                  },
                ].map((row, idx) => {
                  const isDifferent = row.selectedVal !== row.currentVal;
                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border space-y-2 transition ${
                        isDifferent
                          ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-800 dark:text-slate-200">
                          {row.label}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            isDifferent
                              ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-900/60 dark:text-amber-200'
                              : 'bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-900/60 dark:text-emerald-200'
                          }`}
                        >
                          {isDifferent ? (
                            <>
                              <AlertCircle className="w-3 h-3 text-amber-600" />
                              <span>تغيرت</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>مطابقة</span>
                            </>
                          )}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {/* Selected Record Value */}
                        <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 space-y-0.5">
                          <span className="text-[10px] text-slate-400 font-bold block">
                            النسخة السابقة ({compareRecord.version}):
                          </span>
                          <p className="font-mono text-slate-800 dark:text-slate-200 text-xs font-bold leading-relaxed">
                            {row.selectedVal}
                          </p>
                        </div>

                        {/* Current Request Value */}
                        <div className="p-2.5 bg-blue-50/50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800 space-y-0.5">
                          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold block">
                            النسخة الحالية للطلب:
                          </span>
                          <p className="font-mono text-blue-950 dark:text-blue-100 text-xs font-bold leading-relaxed">
                            {row.currentVal}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-end shrink-0">
              <button
                onClick={() => setCompareRecord(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition"
              >
                إغلاق نافذة المقارنة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
