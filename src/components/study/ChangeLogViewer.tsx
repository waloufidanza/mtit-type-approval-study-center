/**
 * @file ChangeLogViewer.tsx
 * Change Log Viewer Component for Study & Technical Review Center.
 * Displays detailed modifications in entered data prior to certificate approval,
 * with multi-filtering by user, category, and search terms.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  History,
  User,
  Filter,
  Search,
  ArrowLeftRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCode2,
  Sliders,
  Download,
  Eye,
  Tag,
  ShieldCheck,
} from 'lucide-react';

export interface ChangeLogRecord {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  category: 'البيانات الفنية' | 'معلومات الشهادة والترددات' | 'المستندات والنواقص' | 'الاعتمادات';
  fieldName: string;
  oldValue: string;
  newValue: string;
  reason?: string;
}

const MOCK_CHANGE_LOGS: ChangeLogRecord[] = [
  {
    id: 'chg-101',
    timestamp: '2026-07-30 14:15',
    userName: 'م. أحمد باصريح',
    userRole: 'معد الدراسة الفنية',
    category: 'البيانات الفنية',
    fieldName: 'نطاق الترددات التشغيلية (Frequency Range)',
    oldValue: '2.400 - 2.4835 GHz (قيمة سابقة غير كافية)',
    newValue: '2.400 - 2.4835 GHz / 5.150 - 5.850 GHz (إضافة نطاق 5GHz)',
    reason: 'تم التحديث بناءً على نتائج الكتالوج الفني وحسابات EIRP',
  },
  {
    id: 'chg-102',
    timestamp: '2026-07-30 13:20',
    userName: 'د. صادق الشرفي',
    userRole: 'مدير موافقة النوعية',
    category: 'معلومات الشهادة والترددات',
    fieldName: 'نوع الشهادة المقترحة',
    oldValue: 'شهادة مؤقتة (6 أشهر)',
    newValue: 'رسمية (3 سنوات ناقص يوم)',
    reason: 'استيفاء كافة شروط المطابقة البيئية وإفادة طيف الترددات',
  },
  {
    id: 'chg-103',
    timestamp: '2026-07-30 11:05',
    userName: 'م. وائل صلاح القاسمي',
    userRole: 'رئيس المكتب الفني',
    category: 'الاعتمادات',
    fieldName: 'حالة اعتماد خطوة الدراسة الفنية',
    oldValue: 'قيد المراجعة المبدئية',
    newValue: 'معتمدة ومجازة فنيًا',
    reason: 'الموافقة على نتائج الاختبارات المختبرية ومطابقة مواصفات الموديل',
  },
  {
    id: 'chg-104',
    timestamp: '2026-07-29 16:40',
    userName: 'م. خالد العبسي',
    userRole: 'مهندس فحص مختبري',
    category: 'البيانات الفنية',
    fieldName: 'قدرة البث الإشعاعي (EIRP Power)',
    oldValue: '100 mW (20 dBm)',
    newValue: '200 mW (23 dBm)',
    reason: 'تصحيح قراءة قدرة البث وفق تقرير اختبار CE الفعلي',
  },
  {
    id: 'chg-105',
    timestamp: '2026-07-29 10:15',
    userName: 'م. أحمد باصريح',
    userRole: 'معد الدراسة الفنية',
    category: 'المستندات والنواقص',
    fieldName: 'حالة نقص شهادة المطابقة البيئية (CE)',
    oldValue: 'نقص مفتوح (بانتظار المستثمر)',
    newValue: 'مستلم ومغلق بنجاح',
    reason: 'قام المورد برفع المرفق الأصلي المعتمد من قبل الهيئة الدولية',
  },
  {
    id: 'chg-106',
    timestamp: '2026-07-28 15:30',
    userName: 'أ.د. يحيى المتوكل',
    userRole: 'المدير العام لتنظيم الاتصالات',
    category: 'معلومات الشهادة والترددات',
    fieldName: 'تاريخ بدء صلاحية الشهادة',
    oldValue: '2026-08-01',
    newValue: '2026-07-30',
    reason: 'تقديم تاريخ السريان بطلب رسمي من المورد المعتمد',
  },
];

export const ChangeLogViewer: React.FC = () => {
  const { currentRequest, mockUsers = [], addToast } = useApp();
  const [selectedUser, setSelectedUser] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Extract unique user names for filter dropdown
  const availableUsers = Array.from(
    new Set(MOCK_CHANGE_LOGS.map((log) => log.userName))
  );

  // Filter change logs
  const filteredLogs = MOCK_CHANGE_LOGS.filter((log) => {
    const matchesUser = selectedUser === 'ALL' || log.userName === selectedUser;
    const matchesCategory = selectedCategory === 'ALL' || log.category === selectedCategory;
    const matchesSearch =
      log.fieldName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.oldValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.newValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesUser && matchesCategory && matchesSearch;
  });

  const handleExportLogs = () => {
    addToast({
      type: 'success',
      title: 'تصدير سجل التغييرات',
      message: `تم تصدير سجل التعديلات قبل الاعتماد لـ (${currentRequest.requestNumber}) بنجاح بصيغة CSV.`,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4 font-sans">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 rounded-xl">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>سجل التغييرات والتعديلات على البيانات (ChangeLog Viewer)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              تتبع زمني دقيق لكافة التغييرات المنفذة على حقول الطلب والمواصفات قبل الاعتماد النهائي للشهادة
            </p>
          </div>
        </div>

        <button
          onClick={handleExportLogs}
          className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-2xs"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>تصدير السجل</span>
        </button>
      </div>

      {/* Filter Controls Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60">
        {/* Filter by User */}
        <div className="space-y-1 text-xs">
          <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-blue-500" />
            <span>عرض التعديلات بحسب المستخدم:</span>
          </label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-bold text-xs focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">جميع المستخدمين في النظام ({availableUsers.length})</option>
            {availableUsers.map((usr) => (
              <option key={usr} value={usr}>
                {usr}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Category */}
        <div className="space-y-1 text-xs">
          <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-purple-500" />
            <span>تصنيف التعديل:</span>
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-bold text-xs focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">جميع التصنيفات</option>
            <option value="البيانات الفنية">البيانات الفنية والمواصفات</option>
            <option value="معلومات الشهادة والترددات">معلومات الشهادة والترددات</option>
            <option value="المستندات والنواقص">المستندات والنواقص</option>
            <option value="الاعتمادات">قرارات الاعتماد والخطوات</option>
          </select>
        </div>

        {/* Search Field */}
        <div className="space-y-1 text-xs">
          <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <Search className="w-3.5 h-3.5 text-teal-500" />
            <span>بحث في الحقول والقيم:</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث بالحقل أو القيمة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-7 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-bold text-xs"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" />
          </div>
        </div>
      </div>

      {/* Change Logs Timeline / List */}
      <div className="space-y-3 pt-1">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs font-bold">
            لا توجد تغييرات مطابقة لمعايير التصفية المختارة.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 bg-slate-50/70 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-3 hover:border-blue-400 transition"
            >
              {/* User Header Bar */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-300 dark:border-blue-700">
                    {log.userName.charAt(0)}
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 block">
                      {log.userName}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                      {log.userRole}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-mono">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 rounded-full font-bold border border-blue-200 dark:border-blue-800">
                    {log.category}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{log.timestamp}</span>
                  </span>
                </div>
              </div>

              {/* Field Name */}
              <div className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <FileCode2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>الحقل المعدل: <strong className="text-blue-600 dark:text-blue-400">{log.fieldName}</strong></span>
              </div>

              {/* Diff Values Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Old Value */}
                <div className="p-2.5 bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg space-y-0.5">
                  <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 block">
                    القيمة السابقة (قبل التعديل):
                  </span>
                  <p className="font-mono text-slate-800 dark:text-slate-200 text-xs font-bold leading-relaxed line-through decoration-rose-500">
                    {log.oldValue}
                  </p>
                </div>

                {/* New Value */}
                <div className="p-2.5 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-lg space-y-0.5">
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block">
                    القيمة الجديدة (الجديدة المعتمدة):
                  </span>
                  <p className="font-mono text-emerald-950 dark:text-emerald-100 text-xs font-extrabold leading-relaxed">
                    {log.newValue}
                  </p>
                </div>
              </div>

              {/* Reason / Notes */}
              {log.reason && (
                <div className="text-[11px] text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-700 dark:text-slate-300">ملاحظة التعديل: </span>
                  <span>{log.reason}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
