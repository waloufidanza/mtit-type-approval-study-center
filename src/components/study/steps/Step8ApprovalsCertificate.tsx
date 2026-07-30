/**
 * @file Step8ApprovalsCertificate.tsx
 * Step 8: 4-Level Approvals Chain, Fees & Guarantee, Certificate Issuance Engine
 */

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { CertificateType } from '../../../types/typeApproval';
import { StatusBadge } from '../../common/StatusBadge';
import { MinistryLogo } from '../../common/MinistryLogo';
import { DigitalSignatureModal } from '../../common/DigitalSignatureModal';
import { CertificateIssuanceUnit } from '../CertificateIssuanceUnit';
import { SyncStatusPanel } from '../SyncStatusPanel';
import { exportElementToPDF } from '../../../utils/pdfExport';
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ShieldCheck,
  CreditCard,
  QrCode,
  FileCheck,
  Printer,
  Download,
  Clock,
  UserCheck,
  Building,
} from 'lucide-react';

export const Step8ApprovalsCertificate: React.FC = () => {
  const { currentRequest, approveWorkflowLevel, rejectWorkflowLevel, setCurrentRequest, addToast } = useApp();
  const [selectedCertType, setSelectedCertType] = useState<CertificateType>(
    currentRequest.certificateType || 'شهادة_نهائية'
  );
  const [approvalNoteInput, setApprovalNoteInput] = useState('');
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [activeSigner, setActiveSigner] = useState<{ name: string; role: string; level: number } | null>(null);
  const [digitalSignatures, setDigitalSignatures] = useState<Record<number, { hash: string; date: string }>>({});

  const certTypes: { id: CertificateType; label: string }[] = [
    { id: 'شهادة_نهائية', label: 'شهادة نهائية (3 سنوات)' },
    { id: 'شهادة_مؤقتة', label: 'شهادة مؤقتة (6 أشهر)' },
    { id: 'إعادة_إصدار', label: 'إعادة إصدار (محدثة)' },
    { id: 'بدل_فاقد', label: 'بدل فاقد' },
    { id: 'تعليق', label: 'تعليق الشهادة' },
    { id: 'إلغاء', label: 'إلغاء الشهادة' },
  ];

  // Eligibility Checks
  const checklist = [
    { label: 'التقرير الفني النهائي معتمد', isDone: currentRequest.stepStatuses.step7 === 'معتمدة' || currentRequest.stepStatuses.step5 === 'معتمدة' },
    { label: 'الفحص والاعتماد الترددي مكتمل', isDone: currentRequest.spectrumStatus === 'متوافق' || currentRequest.spectrumStatus === 'متوافق_بشروط' },
    { label: 'التنسيق الأمني والسيبراني مكتمل', isDone: currentRequest.securityStatus === 'موافق' || currentRequest.securityStatus === 'موافق_بشروط' },
    { label: 'كافة النواقص والمانعات الحرجة مغلقة', isDone: currentRequest.deficiencies.every((d) => d.status === 'مغلق') },
    { label: 'استيفاء وتأكيد تسديد الرسوم والضمان', isDone: currentRequest.feesAndGuarantee.paymentStatus === 'مدفوع' },
    { label: 'تطابق بيانات الموديل والمصنع مع النموذج', isDone: true },
    { label: 'سلسلة اعتمادات المكتب الفني والمدير العام', isDone: currentRequest.approvals.filter((a) => a.status === 'معتمد').length >= 2 },
    { label: 'عدم وجود شهادة موافقة نوعية متعارضة', isDone: true },
  ];

  const allChecklistPassed = checklist.every((c) => c.isDone);

  const handleSelectCertType = (type: CertificateType) => {
    setSelectedCertType(type);
    setCurrentRequest((prev) => ({
      ...prev,
      certificateType: type,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>الخطوة الثامنة: خط الاعتمادات الإدارية ومحرك إصدار الشهادة الرسمية</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            سلسلة التواضيع الأربعة، التحقق من الرسوم والضمان المالي ومعاينة وثيقة الشهادة النهائية.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              exportElementToPDF('certificate-paper', `Type-Approval-Certificate-${currentRequest.requestNumber}`);
              addToast('جاري تصدير وثيقة الشهادة الرسمية بتنسيق PDF عالية الدقة...', 'info');
            }}
            className="px-3.5 py-1.5 bg-rose-700 hover:bg-rose-600 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>تصدير الشهادة PDF</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الشهادة الرسمية</span>
          </button>
        </div>
      </div>

      {/* 4-Level Approvals Chain Cards */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <UserCheck className="w-4 h-4 text-amber-500" />
          <span>سلسلة الاعتمادات التنظيمية للأخوة المسؤولين (4 مستويات):</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentRequest.approvals.map((app) => {
            const isApproved = app.status === 'معتمد';
            const isPending = app.status === 'بانتظار_المراجعة';
            const isReturned = app.status === 'معاد_للتعديل';

            return (
              <div
                key={app.level}
                className={`p-4 rounded-xl border transition space-y-3 flex flex-col justify-between ${
                  isApproved
                    ? 'bg-emerald-50/80 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800'
                    : isPending
                    ? 'bg-amber-50/80 border-amber-300 dark:bg-amber-950/40 dark:border-amber-800 ring-2 ring-amber-400'
                    : isReturned
                    ? 'bg-rose-50/80 border-rose-200 dark:bg-rose-950/40 dark:border-rose-800'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-70'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                      {app.level}
                    </span>
                    <StatusBadge status={app.status} size="sm" />
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 pt-1">{app.roleName}</h4>
                  <p className="font-bold text-blue-900 dark:text-blue-300 text-xs">{app.userName}</p>
                  <p className="text-[10px] text-slate-500">{app.title}</p>
                </div>

                {app.date && (
                  <p className="text-[10px] font-mono text-slate-500 border-t border-slate-200 dark:border-slate-700 pt-1">
                    التاريخ: {app.date}
                  </p>
                )}

                {app.notes && (
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 italic bg-white/60 dark:bg-slate-900/60 p-2 rounded">
                    "{app.notes}"
                  </p>
                )}

                {/* Approve/Reject Interactive Buttons for current pending user */}
                {isPending && (
                  <div className="space-y-2 pt-2 border-t border-amber-200">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold">
                        <span>ملاحظة/توصية الاعتماد:</span>
                        <span className="text-blue-600 dark:text-blue-400 font-normal">قوالب مسبقة الإعداد</span>
                      </div>
                      
                      {/* Quick Approval Templates */}
                      <div className="flex flex-wrap gap-1 pb-1">
                        {[
                          'تمت الدراسة وتأكيد المطابقة للمواصفات الوطنية، نوصي بالاعتماد النهائي.',
                          'معتمد بشرط الالتزام بحدود الترددات وقدرة البث المرخصة من الوزارة.',
                          'موافقة مشروطة مع إجراء فحص فني عشوائي للشحنة عند الوصول.',
                          'معاد للمراجعة وجود نواقص لم يتم استيفاؤها بعد.'
                        ].map((templateText, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setApprovalNoteInput(templateText)}
                            className="text-[10px] bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 truncate max-w-[140px] text-right transition"
                            title={templateText}
                          >
                            ⚡ {templateText}
                          </button>
                        ))}
                      </div>

                      <input
                        type="text"
                        placeholder="أدخل ملاحظة الاعتماد أو اختر من القوالب..."
                        value={approvalNoteInput}
                        onChange={(e) => setApprovalNoteInput(e.target.value)}
                        className="w-full p-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <button
                      onClick={() => {
                        setActiveSigner({ name: app.userName, role: app.roleName, level: app.level });
                        setSignatureModalOpen(true);
                      }}
                      className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold transition flex items-center justify-center gap-1 shadow-2xs"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>توقيع رقمي واعتمد (Sign)</span>
                    </button>

                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => approveWorkflowLevel(app.level, approvalNoteInput)}
                        className="py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold transition flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>اعتماد بسيط</span>
                      </button>
                      <button
                        onClick={() => rejectWorkflowLevel(app.level, approvalNoteInput)}
                        className="py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-bold transition flex items-center justify-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>إعادة</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Digital Signature Badge if signed */}
                {digitalSignatures[app.level] && (
                  <div className="p-2 bg-emerald-100/70 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 rounded-lg text-[10px] space-y-0.5">
                    <span className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>ختم توقيع رقمي موثق</span>
                    </span>
                    <p className="font-mono text-emerald-800 dark:text-emerald-300 truncate">
                      {digitalSignatures[app.level].hash}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Fees & Guarantee Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <CreditCard className="w-4 h-4 text-blue-600" />
          <span>بيانات التسديد والضمان المالي (Fees & Guarantee)</span>
        </h3>

        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-slate-700 dark:text-slate-300">رسوم المراجعة:</span>
            <span className="font-mono font-extrabold text-blue-900 dark:text-blue-300 text-sm">
              {currentRequest.feesAndGuarantee.amount.toLocaleString()} YER
            </span>
          </div>

          <div className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-slate-700 dark:text-slate-300">حالة السداد ورقم الإيصال:</span>
            <div className="flex items-center gap-2">
              <StatusBadge status={currentRequest.feesAndGuarantee.paymentStatus} size="sm" />
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                #{currentRequest.feesAndGuarantee.receiptNumber}
              </span>
            </div>
          </div>

          <div className="p-3 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-lg space-y-1">
            <span className="font-bold text-amber-900 dark:text-amber-200 block">شيك الضمان المالي:</span>
            <p className="text-amber-800 dark:text-amber-300 font-mono">
              رقم الشيك: {currentRequest.feesAndGuarantee.guaranteeCheckNumber} • القيمة: {currentRequest.feesAndGuarantee.guaranteeAmount?.toLocaleString()} YER
            </p>
            <p className="text-[11px] text-amber-700 dark:text-amber-400">
              تاريخ انتهاء الضمان: {currentRequest.feesAndGuarantee.guaranteeExpiryDate}
            </p>
          </div>
        </div>
      </div>

      {/* Integrated Certificate Issuance Unit */}
      <CertificateIssuanceUnit />

      {/* Cloud & Local Storage Archive Sync Status Panel */}
      <SyncStatusPanel requestNumber={currentRequest.requestNumber} />

      {/* Digital Signature Modal */}
      {activeSigner && (
        <DigitalSignatureModal
          isOpen={signatureModalOpen}
          onClose={() => setSignatureModalOpen(false)}
          signerName={activeSigner.name}
          signerRole={activeSigner.role}
          documentTitle={`شهادة الموافقة النوعية للطلب #${currentRequest.requestNumber}`}
          onSign={(sigData) => {
            approveWorkflowLevel(activeSigner.level, `توقيع رقمي موثق - Hash: ${sigData.signatureHash}`);
            setDigitalSignatures((prev) => ({
              ...prev,
              [activeSigner.level]: { hash: sigData.signatureHash, date: sigData.timestamp },
            }));
            addToast('تم إكمال التوقيع الرقمي والاعتماد بنجاح', 'success');
          }}
        />
      )}
    </div>
  );
};
