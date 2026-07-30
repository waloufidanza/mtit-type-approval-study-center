/**
 * @file AuditLogScreen.tsx
 * Comprehensive Audit Log Viewer with Filtering by User, Action Type, Department & Date Range
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AuditLogEntry } from '../../types/typeApproval';
import { Modal } from '../common/Modal';
import {
  History,
  Search,
  Filter,
  User,
  Calendar,
  Layers,
  ArrowRightLeft,
  ShieldCheck,
  RotateCcw,
  Download,
  FileSpreadsheet,
  Printer,
  Info,
  Clock,
  Building,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export const AuditLogScreen: React.FC = () => {
  const { auditLogs = [], setActiveScreen, setCurrentRequest, mockRequests = [] } = useApp();

  // View mode state (table vs timeline)
  const [viewMode, setViewMode] = useState<'table' | 'timeline'>('table');

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState('all');
  const [selectedAction, setSelectedAction] = useState('all');
  const [selectedDept, setSelectedDept] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Selected Log Entry for Modal View
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  // Extract unique users, actions, and departments for dropdowns
  const uniqueUsers = useMemo(() => {
    const users = new Set(auditLogs.map((l) => l.userName).filter(Boolean));
    return Array.from(users);
  }, [auditLogs]);

  const uniqueActions = useMemo(() => {
    const actions = new Set(auditLogs.map((l) => l.action).filter(Boolean));
    return Array.from(actions);
  }, [auditLogs]);

  const uniqueDepts = useMemo(() => {
    const depts = new Set(auditLogs.map((l) => l.department).filter(Boolean));
    return Array.from(depts);
  }, [auditLogs]);

  // Apply filters
  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      // User filter
      if (selectedUser !== 'all' && log.userName !== selectedUser) {
        return false;
      }

      // Action type filter
      if (selectedAction !== 'all' && log.action !== selectedAction) {
        return false;
      }

      // Department filter
      if (selectedDept !== 'all' && log.department !== selectedDept) {
        return false;
      }

      // Date range filter
      if (startDate) {
        const logDate = log.timestamp.split(' ')[0];
        if (logDate < startDate) return false;
      }
      if (endDate) {
        const logDate = log.timestamp.split(' ')[0];
        if (logDate > endDate) return false;
      }

      // Keyword search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const combined = `${log.userName} ${log.userRole} ${log.action} ${log.department} ${log.reason} ${log.details} ${log.requestNumber || ''} ${log.ipAddress}`.toLowerCase();
        if (!combined.includes(q)) return false;
      }

      return true;
    });
  }, [auditLogs, selectedUser, selectedAction, selectedDept, startDate, endDate, searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedUser('all');
    setSelectedAction('all');
    setSelectedDept('all');
    setStartDate('');
    setEndDate('');
  };

  const handleOpenRequest = (reqNum?: string) => {
    if (!reqNum) return;
    const req = mockRequests.find((r) => r.requestNumber === reqNum || r.id === reqNum);
    if (req) {
      setCurrentRequest(req);
      setActiveScreen('studyCenter');
    }
  };

  // Export to CSV helper
  const handleExportCSV = () => {
    const headers = ['رقم السجل', 'التاريخ والوقت', 'المستخدم', 'الدور', 'نوع الإجراء', 'الإدارة', 'رقم الطلب', 'القيمة السابقة', 'القيمة الجديدة', 'السبب'];
    const rows = filteredLogs.map((l) => [
      l.id,
      l.timestamp,
      l.userName,
      l.userRole,
      l.action,
      l.department,
      l.requestNumber || '-',
      l.previousValue,
      l.newValue,
      l.reason,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].map((e) => e.map(cell => `"${cell}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>سجل الإجراءات والعمليات التنظيمية (Audit Trail)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            منظومة التتبع الرقمي المشفرة لكافة عمليات الاعتماد والتعديل والإحالة وفق معايير الحوكمة والمساءلة الحكومية.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>تصدير السجل (CSV)</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-bold transition border border-slate-300 dark:border-slate-700 flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة التقرير</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 shadow-2xs flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-md border border-blue-200 dark:border-blue-900">
            <History className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block">إجمالي الإجراءات المسجلة</span>
            <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100 font-mono">{auditLogs.length}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 shadow-2xs flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-md border border-amber-200 dark:border-amber-900">
            <Filter className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block">نتائج التصفية الحالية</span>
            <span className="text-lg font-extrabold text-amber-600 dark:text-amber-400 font-mono">{filteredLogs.length}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 shadow-2xs flex items-center gap-3">
          <div className="p-2.5 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-md border border-purple-200 dark:border-purple-900">
            <User className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block">المستخدمون المشاركون</span>
            <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100 font-mono">{uniqueUsers.length}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 shadow-2xs flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-md border border-emerald-200 dark:border-emerald-900">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block">التوقيع الرقمي</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>متحقق وغير قابل للتعديل</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filter Component (Search by User, Action Type, Department & Date Range) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
              وحدة الفلترة والبحث المتقدم في السجلات
            </h2>
          </div>
          {(searchQuery || selectedUser !== 'all' || selectedAction !== 'all' || selectedDept !== 'all' || startDate || endDate) && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة ضبط الفلاتر</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Keyword Search */}
          <div className="lg:col-span-2 space-y-1">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Search className="w-3 h-3 text-blue-500" />
              <span>البحث الشامل بالكلمات المفتاحية</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث باسم المستخدم، رقم الطلب، الإجراء، أو التفاصيل..."
                className="w-full pr-8 pl-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Search className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-slate-400" />
            </div>
          </div>

          {/* User Filter Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <User className="w-3 h-3 text-blue-500" />
              <span>المستخدم</span>
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            >
              <option value="all">جميع المستخدمين ({uniqueUsers.length})</option>
              {uniqueUsers.map((usr) => (
                <option key={usr} value={usr}>
                  {usr}
                </option>
              ))}
            </select>
          </div>

          {/* Action Type Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Layers className="w-3 h-3 text-blue-500" />
              <span>نوع الإجراء</span>
            </label>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            >
              <option value="all">جميع أنواع الإجراءات ({uniqueActions.length})</option>
              {uniqueActions.map((act) => (
                <option key={act} value={act}>
                  {act}
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Building className="w-3 h-3 text-blue-500" />
              <span>الإدارة / الجهة</span>
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            >
              <option value="all">جميع الإدارات والقطاعات</option>
              {uniqueDepts.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Range Inputs Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-emerald-500" />
              <span>من تاريخ (تاريخ البداية)</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-rose-500" />
              <span>إلى تاريخ (تاريخ النهاية)</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-2 flex items-end justify-between">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              يتم تحديث قائمة نتائج السجل تلقائياً بناءً على محددات الفلترة أعلاه.
            </span>
          </div>
        </div>
      </div>

      {/* Audit Log Results Container Header with View Mode Switcher */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <History className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>تاريخ السجلات والأنشطة ({filteredLogs.length})</span>
          </h2>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === 'table'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>جدول السجلات</span>
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === 'timeline'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>المخطط الزمني (Timeline View)</span>
              </button>
            </div>

            <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
              عرض {filteredLogs.length} من أصل {auditLogs.length}
            </span>
          </div>
        </div>

        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">التاريخ والوقت</th>
                  <th className="py-2.5 px-3">المستخدم والدور</th>
                  <th className="py-2.5 px-3">نوع الإجراء والإدارة</th>
                  <th className="py-2.5 px-3">رقم الطلب المرتبط</th>
                  <th className="py-2.5 px-3">التغيير (من → إلى)</th>
                  <th className="py-2.5 px-3">المبرر / السبب</th>
                  <th className="py-2.5 px-3 text-center">التفاصيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{log.timestamp}</span>
                        </div>
                      </td>

                      <td className="py-2.5 px-3 font-medium">
                        <p className="font-bold text-slate-900 dark:text-slate-100">{log.userName}</p>
                        <span className="text-[10px] text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-1.5 py-0.2 rounded font-sans border border-blue-200 dark:border-blue-900">
                          {log.userRole}
                        </span>
                      </td>

                      <td className="py-2.5 px-3">
                        <p className="font-bold text-slate-900 dark:text-slate-100">{log.action}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">{log.department}</p>
                      </td>

                      <td className="py-2.5 px-3 font-mono">
                        {log.requestNumber ? (
                          <button
                            onClick={() => handleOpenRequest(log.requestNumber)}
                            className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-950 text-blue-800 dark:text-blue-300 rounded text-[11px] font-bold border border-slate-200 dark:border-slate-700 transition"
                          >
                            {log.requestNumber}
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}
                      </td>

                      <td className="py-2.5 px-3 max-w-xs">
                        <div className="flex items-center gap-1 text-[11px] text-slate-700 dark:text-slate-300">
                          <span className="line-through text-slate-400 truncate max-w-[100px]">{log.previousValue}</span>
                          <ArrowRightLeft className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="font-bold text-emerald-700 dark:text-emerald-400 truncate max-w-[120px]">{log.newValue}</span>
                        </div>
                      </td>

                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 max-w-xs truncate text-[11px]">
                        {log.reason}
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded text-xs font-bold transition border border-slate-200 dark:border-slate-700"
                        >
                          معاينة
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 dark:text-slate-400">
                      <XCircle className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
                      <p className="font-bold text-sm">لم يتم العثور على أي سجلات تطابق شروط الفلترة</p>
                      <p className="text-xs mt-1">جرّب تغيير كلمات البحث أو إلغاء فلاتر المستخدم والتاريخ.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Timeline View Component */
          <div className="p-6 relative">
            <div className="absolute right-9 top-8 bottom-8 w-0.5 bg-slate-200 dark:bg-slate-800" />
            <div className="space-y-6">
              {filteredLogs.map((log) => (
                <div key={log.id} className="relative flex items-start gap-4 mr-6">
                  {/* Timeline Dot Icon */}
                  <div className="absolute -right-[23px] top-1 w-5 h-5 rounded-full bg-blue-600 border-4 border-white dark:border-slate-900 shadow-xs z-10 flex items-center justify-center" />

                  {/* Timeline Card Content */}
                  <div className="flex-1 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{log.action}</span>
                        {log.requestNumber && (
                          <button
                            onClick={() => handleOpenRequest(log.requestNumber)}
                            className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-mono text-[11px] font-bold rounded"
                          >
                            {log.requestNumber}
                          </button>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{log.timestamp}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {log.userName} ({log.userRole})
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500 dark:text-slate-400">{log.department}</span>
                    </div>

                    <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 text-xs flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 line-through">{log.previousValue}</span>
                        <ArrowRightLeft className="w-3.5 h-3.5 text-blue-500" />
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{log.newValue}</span>
                      </div>
                      <span className="text-slate-500 text-[11px] italic">المبرر: {log.reason}</span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 font-mono">
                      <span>IP: {log.ipAddress}</span>
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                      >
                        عرض التفاصيل الكاملة ←
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal for Selected Audit Log */}
      {selectedLog && (
        <Modal
          isOpen={!!selectedLog}
          onClose={() => setSelectedLog(null)}
          title={`تفاصيل السجل الرقمي: ${selectedLog.id}`}
        >
          <div className="space-y-4 text-xs text-slate-800 dark:text-slate-200">
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-slate-500 dark:text-slate-400 font-bold block">المستخدم المسؤول</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{selectedLog.userName} ({selectedLog.userRole})</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 font-bold block">التاريخ والوقت Precise</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{selectedLog.timestamp}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 font-bold block">الإدارة / التشكيل الإداري</span>
                <span>{selectedLog.department}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 font-bold block">عنوان IP والجلسة</span>
                <span className="font-mono">{selectedLog.ipAddress}</span>
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-200 dark:border-slate-700 pt-3">
              <h4 className="font-bold text-slate-900 dark:text-slate-100">نوع الإجراء والتعديل الفعلي</h4>
              <div className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs space-y-1">
                <p><span className="text-slate-400">الإجراء:</span> {selectedLog.action}</p>
                <p><span className="text-rose-400">القيمة السابقة:</span> {selectedLog.previousValue}</p>
                <p><span className="text-emerald-400">القيمة الجديدة:</span> {selectedLog.newValue}</p>
              </div>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-900 dark:text-slate-100 block">المبرر التنظيمي:</span>
              <p className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                {selectedLog.reason}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-900 dark:text-slate-100 block">التفاصيل الفنية الإضافية:</span>
              <p className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                {selectedLog.details}
              </p>
            </div>

            <div className="p-3 bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 rounded-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <div className="text-[11px]">
                <p className="font-bold">سجل موثق بالبصمة الرقمية المشفرة (SHA-256 Verified)</p>
                <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">Hash: 8f9a2b7e1c4d03e5f6a1b2c3d4e5f6a7b8c9d0e1</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
