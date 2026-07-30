/**
 * @file RequestRibbon.tsx
 * Fixed top ribbon displaying core request metadata & quick action toolbar
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import {
  Save,
  FolderOpen,
  FileCheck2,
  History,
  Printer,
  MoreVertical,
  CheckCircle2,
  Clock,
  Send,
  Download,
  AlertCircle,
} from 'lucide-react';

export const RequestRibbon: React.FC = () => {
  const { currentRequest, saveStatus, triggerSave, setActiveScreen } = useApp();
  const [showExtraMenu, setShowExtraMenu] = useState(false);

  // Compute Alert Conditions
  const openDeficiencies = currentRequest.deficiencies?.filter((d) => d.status === 'مفتوح') || [];
  const hasCriticalDeficiency = openDeficiencies.some((d) => d.priority === 'عالي' || d.type === 'وثيقة_مفقودة');
  
  const pendingReferrals = currentRequest.referrals?.filter((r) => r.status === 'بانتظار_الرد' || r.status === 'تأخر_الرد') || [];
  const hasOverdueReferral = pendingReferrals.some((r) => r.status === 'تأخر_الرد' || (r.overdueDays && r.overdueDays > 0));

  return (
    <div className="bg-[#0f172a] text-slate-100 rounded-lg p-3 border border-slate-800 space-y-2.5">
      {/* Top Compact Info Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Primary Details Block */}
        <div className="flex items-center gap-3 flex-wrap text-xs">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">رقم الطلب</div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono font-extrabold text-blue-400 tracking-wider">
                {currentRequest.requestNumber}
              </span>

              {/* Red Visual Alert Badges for Reviewer */}
              {openDeficiencies.length > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 animate-pulse border ${
                    hasCriticalDeficiency
                      ? 'bg-rose-950 text-rose-300 border-rose-600'
                      : 'bg-amber-950 text-amber-300 border-amber-600'
                  }`}
                  title="تنبيه: نواقص حرج لم يتم إغلاقها بعد"
                >
                  <AlertCircle className="w-3 h-3 text-rose-400" />
                  <span>{openDeficiencies.length} نواقص حرجة</span>
                </span>
              )}

              {pendingReferrals.length > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border ${
                    hasOverdueReferral
                      ? 'bg-rose-950 text-rose-300 border-rose-600 animate-bounce'
                      : 'bg-amber-950 text-amber-300 border-amber-600'
                  }`}
                  title="تنبيه: إحالة تجاوزت المهلة الزمنية للرد"
                >
                  <Clock className="w-3 h-3 text-rose-400" />
                  <span>{hasOverdueReferral ? 'إحالة متأخرة' : `${pendingReferrals.length} إحالات معلقة`}</span>
                </span>
              )}
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-0.5">الحالة والأولوية</div>
            <div className="flex items-center gap-1.5">
              <StatusBadge status={currentRequest.status} size="sm" />
              <PriorityBadge priority={currentRequest.priority} />
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden md:block"></div>

          <div className="hidden md:block">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">المورد والنموذج</div>
            <div className="text-xs font-bold text-slate-200">
              {currentRequest.localRep.companyName} • <span className="text-amber-300">{currentRequest.brand} {currentRequest.model}</span>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden lg:block"></div>

          <div className="hidden lg:block">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">نوع الجهاز / البلد</div>
            <div className="text-xs text-slate-300 font-medium">
              {currentRequest.equipmentType} ({currentRequest.manufacturer.country})
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-1.5">
          {/* Primary Action: Save Button with status */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={triggerSave}
              disabled={saveStatus === 'جارٍ الحفظ'}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded text-xs font-bold transition flex items-center gap-1 shadow-2xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>حفظ</span>
            </button>

            <span className="text-[10px] text-slate-400 hidden sm:inline-flex items-center gap-1 font-mono bg-slate-800/80 px-2 py-1 rounded border border-slate-700">
              {saveStatus === 'جارٍ الحفظ' && <Clock className="w-3 h-3 text-amber-400 animate-spin" />}
              {saveStatus === 'محفوظ' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              <span>{saveStatus}</span>
            </span>
          </div>

          {/* Secondary Actions */}
          <button
            onClick={() => alert('عرض نموذج الطلب الأصلي المقدم عبر البوابة')}
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-xs text-slate-200 font-bold transition"
            title="عرض نموذج الطلب المقدم"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-blue-400" />
            <span>النموذج</span>
          </button>

          <button
            onClick={() => setActiveScreen('auditLog')}
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-xs text-slate-200 font-bold transition"
            title="عرض سجل كافة الإجراءات على هذا الطلب"
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span>السجل</span>
          </button>

          <button
            onClick={() => window.print()}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-200 transition"
            title="طباعة ملخص الدراسة الفنية"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>

          {/* Extra Menu */}
          <div className="relative">
            <button
              onClick={() => setShowExtraMenu(!showExtraMenu)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-200 transition"
              title="إجراءات إضافية"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {showExtraMenu && (
              <div className="absolute left-0 mt-1 w-48 bg-slate-900 border border-slate-700 rounded-md shadow-lg py-1 z-50 text-xs">
                <button
                  onClick={() => {
                    alert('تم فتح مجلد الطلب المؤرشف بالفرع المحلي');
                    setShowExtraMenu(false);
                  }}
                  className="w-full text-right px-3 py-1.5 hover:bg-slate-800 text-slate-200 flex items-center gap-1.5"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>مجلد الوثائق</span>
                </button>
                <button
                  onClick={() => {
                    alert('تصدير البيانات الفنية (XML)');
                    setShowExtraMenu(false);
                  }}
                  className="w-full text-right px-3 py-1.5 hover:bg-slate-800 text-slate-200 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-blue-400" />
                  <span>تصدير (XML)</span>
                </button>
                <button
                  onClick={() => {
                    alert('إحالة عاجلة لرئيس المكتب الفني');
                    setShowExtraMenu(false);
                  }}
                  className="w-full text-right px-3 py-1.5 hover:bg-slate-800 text-amber-300 flex items-center gap-1.5 border-t border-slate-800 font-bold"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>إحالة للمكتب الفني</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compact Secondary Line */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-3 flex-wrap">
          <div>
            <span>المراجع: </span>
            <span className="font-bold text-slate-200">{currentRequest.assignedReviewer}</span>
          </div>
          <div>
            <span>التحديث: </span>
            <span className="font-mono text-slate-300">{currentRequest.lastUpdated}</span>
          </div>
          <div className="text-[10px] bg-slate-800/90 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 font-bold">
            إعداد وتطوير: م. وائل صلاح القاسمي - رئيس المكتب الفني
          </div>
        </div>

        <div className="flex items-center gap-2 min-w-[200px]">
          <span className="font-bold text-slate-300">نسبة الإنجاز:</span>
          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${currentRequest.completionPercentage}%` }}
            />
          </div>
          <span className="font-mono font-bold text-blue-400">{currentRequest.completionPercentage}%</span>
        </div>
      </div>
    </div>
  );
};
