/**
 * @file RequestTimeline.tsx
 * Interactive Request Timeline / Audit Log (سجل تغييرات وتتبع إجراءات هذا الطلب)
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AuditLogEntry } from '../../types/typeApproval';
import {
  History,
  Search,
  Filter,
  UserCheck,
  Clock,
  ShieldCheck,
  FileEdit,
  AlertCircle,
  Send,
  CheckCircle2,
  ChevronDown,
  Layers,
} from 'lucide-react';

interface RequestTimelineProps {
  requestNumber: string;
}

export const RequestTimeline: React.FC<RequestTimelineProps> = ({ requestNumber }) => {
  const { auditLogs } = useApp();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReviewer, setSelectedReviewer] = useState<string>('ALL');
  const [selectedActionType, setSelectedActionType] = useState<string>('ALL');
  const [isExpanded, setIsExpanded] = useState(true);

  // Filter logs for this specific request number or general system logs associated
  const requestLogs = auditLogs.filter(
    (log) => !log.requestNumber || log.requestNumber === requestNumber
  );

  // Extract unique reviewer names
  const reviewersList = Array.from(new Set(requestLogs.map((log) => log.userName))).filter(Boolean);

  // Extract unique action types
  const actionTypesList = Array.from(new Set(requestLogs.map((log) => log.action))).filter(Boolean);

  // Filtered Logs Calculation
  const filteredLogs = requestLogs.filter((log) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.reason.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesReviewer = selectedReviewer === 'ALL' || log.userName === selectedReviewer;
    const matchesAction = selectedActionType === 'ALL' || log.action === selectedActionType;

    return matchesSearch && matchesReviewer && matchesAction;
  });

  // Action Icon Helper
  const getActionIcon = (action: string) => {
    if (action.includes('توقيع') || action.includes('اعتماد')) {
      return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
    }
    if (action.includes('ناقص') || action.includes('نواقص')) {
      return <AlertCircle className="w-4 h-4 text-rose-500" />;
    }
    if (action.includes('إحالة') || action.includes('تحويل')) {
      return <Send className="w-4 h-4 text-blue-500" />;
    }
    if (action.includes('تعديل') || action.includes('تحديث')) {
      return <FileEdit className="w-4 h-4 text-amber-500" />;
    }
    return <Clock className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-4">
      {/* Timeline Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>تاريخ وتتبع تغييرات الطلب (Status History)</span>
              <span className="text-[10px] font-mono bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full font-bold">
                {filteredLogs.length} سجلات
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              السجل الزمني التفاعلي لجميع التعديلات والقرارات المنفذة على الطلب رقم{' '}
              <span className="font-mono font-bold text-blue-600">{requestNumber}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl transition"
        >
          <span>{isExpanded} طي التتبع : إظهار التتبع</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isExpanded && (
        <>
          {/* Filters Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="text"
                placeholder="بحث في تفاصيل الإجراء أو الملاحظة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-8 pl-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Filter by Reviewer Name */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-2.5 py-1 border border-slate-200 dark:border-slate-700 rounded-lg text-xs">
              <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={selectedReviewer}
                onChange={(e) => setSelectedReviewer(e.target.value)}
                className="w-full bg-transparent border-none text-xs font-bold focus:outline-none text-slate-700 dark:text-slate-200"
              >
                <option value="ALL">جميع المراجعين ({reviewersList.length})</option>
                {reviewersList.map((reviewer, idx) => (
                  <option key={idx} value={reviewer}>
                    {reviewer}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Action Type */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-2.5 py-1 border border-slate-200 dark:border-slate-700 rounded-lg text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={selectedActionType}
                onChange={(e) => setSelectedActionType(e.target.value)}
                className="w-full bg-transparent border-none text-xs font-bold focus:outline-none text-slate-700 dark:text-slate-200"
              >
                <option value="ALL">جميع الإجراءات المنفذة</option>
                {actionTypesList.map((action, idx) => (
                  <option key={idx} value={action}>
                    {action}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Timeline Tree */}
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-bold text-xs space-y-2">
              <History className="w-8 h-8 mx-auto opacity-40 text-slate-500" />
              <p>لا توجد سجلات مطابقة لمعايير التصفية المختارة</p>
            </div>
          ) : (
            <div className="relative pl-2 pr-4 space-y-4 before:absolute before:right-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {filteredLogs.map((log) => (
                <div key={log.id} className="relative flex items-start gap-3 group">
                  {/* Circle Marker */}
                  <div className="z-10 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-xs group-hover:border-blue-500 transition">
                    {getActionIcon(log.action)}
                  </div>

                  {/* Log Content Card */}
                  <div className="flex-1 bg-slate-50 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 p-3 rounded-xl transition space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-700/60 pb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100">
                          {log.action}
                        </span>
                        <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-1.5 py-0.5 rounded font-bold">
                          {log.department}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{log.timestamp}</span>
                      </div>
                    </div>

                    {/* Reviewer Meta */}
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">{log.userName}</span>
                        <span className="text-[10px] text-slate-400">({log.userRole})</span>
                      </div>
                      {log.ipAddress && (
                        <span className="text-[10px] font-mono text-slate-400">IP: {log.ipAddress}</span>
                      )}
                    </div>

                    {/* Details / Justification */}
                    <p className="text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900/80 p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 leading-relaxed">
                      {log.details || log.reason}
                    </p>

                    {/* Value Changes (if available) */}
                    {(log.previousValue || log.newValue) && (
                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                        <div className="bg-rose-50 dark:bg-rose-950/40 p-1.5 rounded border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300">
                          <span className="font-bold block text-[9px] text-rose-500">القيمة السابقة:</span>
                          <span className="font-mono">{log.previousValue || '-'}</span>
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-950/40 p-1.5 rounded border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                          <span className="font-bold block text-[9px] text-emerald-500">القيمة الجديدة:</span>
                          <span className="font-mono">{log.newValue || '-'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
