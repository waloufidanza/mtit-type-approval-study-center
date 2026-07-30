/**
 * @file ApprovalWorkflowPanel.tsx
 * Dynamic RTL Approval Workflow Panel for Technical Final Report.
 * Renders signers in RTL order based on request requirements (Security, Spectrum, Administrative, Deputy Minister).
 * Supports all official approval statuses with high contrast print-ready styling.
 */

import React, { useState } from 'react';
import { ApprovalSigner } from '../../services/reportService';
import {
  ShieldCheck,
  UserCheck,
  Clock,
  AlertCircle,
  XCircle,
  RotateCcw,
  Plus,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Building,
  Key,
} from 'lucide-react';

interface ApprovalWorkflowPanelProps {
  signers: ApprovalSigner[];
  onUpdateSigners: (updated: ApprovalSigner[]) => void;
  requiresSpectrum?: boolean;
  requiresSecurity?: boolean;
  requiresDeputyMinister?: boolean;
  isPrintMode?: boolean;
}

export const ApprovalWorkflowPanel: React.FC<ApprovalWorkflowPanelProps> = ({
  signers,
  onUpdateSigners,
  requiresSpectrum = true,
  requiresSecurity = true,
  requiresDeputyMinister = false,
  isPrintMode = false,
}) => {
  const [selectedSignerId, setSelectedSignerId] = useState<string | null>(null);

  const getStatusBadge = (status: ApprovalSigner['status']) => {
    switch (status) {
      case 'معتمد':
        return {
          bg: 'bg-emerald-100 text-emerald-900 border-emerald-400 dark:bg-emerald-950/80 dark:text-emerald-200',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
          label: 'معتمد',
        };
      case 'معتمد بشروط':
        return {
          bg: 'bg-teal-100 text-teal-900 border-teal-400 dark:bg-teal-950/80 dark:text-teal-200',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />,
          label: 'معتمد بشروط',
        };
      case 'قيد المراجعة':
        return {
          bg: 'bg-blue-100 text-blue-900 border-blue-400 dark:bg-blue-950/80 dark:text-blue-200',
          icon: <Clock className="w-3.5 h-3.5 text-blue-600" />,
          label: 'قيد المراجعة',
        };
      case 'بانتظار المراجعة':
        return {
          bg: 'bg-amber-100 text-amber-900 border-amber-400 dark:bg-amber-950/80 dark:text-amber-200',
          icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
          label: 'بانتظار المراجعة',
        };
      case 'معاد للتعديل':
        return {
          bg: 'bg-orange-100 text-orange-900 border-orange-400 dark:bg-orange-950/80 dark:text-orange-200',
          icon: <RotateCcw className="w-3.5 h-3.5 text-orange-600" />,
          label: 'معاد للتعديل',
        };
      case 'مرفوض':
        return {
          bg: 'bg-rose-100 text-rose-900 border-rose-400 dark:bg-rose-950/80 dark:text-rose-200',
          icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
          label: 'مرفوض',
        };
      case 'غير مطلوب':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300',
          icon: <Lock className="w-3.5 h-3.5 text-slate-400" />,
          label: 'غير مطلوب',
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-600 border-slate-300',
          icon: <Clock className="w-3.5 h-3.5 text-slate-400" />,
          label: 'لم يصل إليه',
        };
    }
  };

  const handleStatusChange = (id: string, newStatus: ApprovalSigner['status']) => {
    const updated = signers.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          status: newStatus,
          signedDate: newStatus.includes('معتمد') ? new Date().toISOString().split('T')[0] : s.signedDate,
        };
      }
      return s;
    });
    onUpdateSigners(updated);
  };

  const moveSigner = (index: number, direction: 'right' | 'left') => {
    const targetIndex = direction === 'right' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= signers.length) return;

    const updated = [...signers];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onUpdateSigners(updated);
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Panel Header */}
      {!isPrintMode && (
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                مسار الاعتمادات والتوقيعات الديناميكية (Approval Workflow)
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                ترتيب التوقيعات من اليمين إلى اليسار بحسب مسار الاعتماد (فني ← ترددي ← أمني ← تنفيذي)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-700">
              عدد المسارات النشطة: {signers.filter((s) => s.status !== 'غير مطلوب').length}
            </span>
          </div>
        </div>
      )}

      {/* RTL Dynamic Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 dir-rtl">
        {signers.map((signer, idx) => {
          const badge = getStatusBadge(signer.status);

          return (
            <div
              key={signer.id}
              className={`p-3.5 rounded-xl border space-y-3 transition relative flex flex-col justify-between ${
                isPrintMode
                  ? 'bg-white border-slate-900 text-slate-900 shadow-none'
                  : signer.status.includes('معتمد')
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
              }`}
            >
              {/* Card Header & Order Number */}
              <div className="space-y-1">
                <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-700/80 pb-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-mono font-extrabold text-[10px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>

                  <span className={`px-2 py-0.5 rounded border text-[9px] font-bold flex items-center gap-1 ${badge.bg}`}>
                    {badge.icon}
                    <span>{badge.label}</span>
                  </span>
                </div>

                <div className="pt-1">
                  <h5 className="font-extrabold text-xs text-slate-900 dark:text-slate-100">{signer.roleTitle}</h5>
                  <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-0.5">{signer.signerName}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{signer.position}</p>
                </div>
              </div>

              {/* Signature Canvas Box / Placeholder */}
              <div className="h-14 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center relative overflow-hidden my-1">
                {signer.signatureImage ? (
                  <img src={signer.signatureImage} alt="Signature" className="max-h-full object-contain p-1" />
                ) : signer.status.includes('معتمد') ? (
                  <span className="italic font-serif text-slate-700 dark:text-slate-300 font-bold text-xs">
                    {signer.signerName}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 italic">مساحة التوقيع الرقمي والختم</span>
                )}
              </div>

              {/* Status Selector & Reordering Toolbar (Hidden in Print) */}
              {!isPrintMode && (
                <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 block">
                      تعديل حالة الاعتماد:
                    </label>
                    <select
                      value={signer.status}
                      onChange={(e) => handleStatusChange(signer.id, e.target.value as ApprovalSigner['status'])}
                      className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-bold text-[10px]"
                    >
                      <option value="لم يصل إليه">لم يصل إليه</option>
                      <option value="بانتظار المراجعة">بانتظار المراجعة</option>
                      <option value="قيد المراجعة">قيد المراجعة</option>
                      <option value="معتمد">معتمد</option>
                      <option value="معتمد بشروط">معتمد بشروط</option>
                      <option value="معاد للتعديل">معاد للتعديل</option>
                      <option value="مرفوض">مرفوض</option>
                      <option value="غير مطلوب">غير مطلوب</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-mono text-slate-500">
                      {signer.signedDate ? `تاريخ: ${signer.signedDate}` : 'لم يوقع بعد'}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveSigner(idx, 'right')}
                        disabled={idx === 0}
                        title="تحريك لليمين"
                        className="p-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 rounded disabled:opacity-20"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => moveSigner(idx, 'left')}
                        disabled={idx === signers.length - 1}
                        title="تحريك لليسار"
                        className="p-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 rounded disabled:opacity-20"
                      >
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
