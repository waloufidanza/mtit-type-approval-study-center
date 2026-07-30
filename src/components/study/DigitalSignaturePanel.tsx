/**
 * @file DigitalSignaturePanel.tsx
 * Digital Signatures Configuration Panel for Certificate Issuance.
 * Allows users to select authorized signers from dropdowns and toggle signature statuses,
 * updating the CertificatePreview immediately.
 */

import React from 'react';
import { CertificateSignature } from '../../services/certificateService';
import { ShieldCheck, UserCheck, Calendar, CheckCircle2, Lock, Check } from 'lucide-react';

export interface SignatureMap {
  reviewer: CertificateSignature;
  headOfUnit: CertificateSignature;
  technicalOfficeHead: CertificateSignature;
  generalDirector: CertificateSignature;
}

interface DigitalSignaturePanelProps {
  signatures: SignatureMap;
  onChange: (updatedSignatures: SignatureMap) => void;
}

// Preset list of authorized signers per role
const AUTHORIZED_SIGNERS: Record<keyof SignatureMap, string[]> = {
  reviewer: [
    'م. أحمد باصريح',
    'م. خالد العبسي',
    'م. سارة المقطري',
    'م. طارق الذبحاني',
  ],
  headOfUnit: [
    'د. صادق الشرفي',
    'د. حمود القوسي',
    'م. عبدالكريم الآنسي',
  ],
  technicalOfficeHead: [
    'م. وائل صلاح القاسمي',
    'م. نبيل العواضي',
    'م. علي جابر الهادي',
  ],
  generalDirector: [
    'أ.د. يحيى المتوكل',
    'د. عبدالملك الحوري',
    'م. محمد الشامي',
  ],
};

export const DigitalSignaturePanel: React.FC<DigitalSignaturePanelProps> = ({
  signatures,
  onChange,
}) => {
  const handleNameChange = (roleKey: keyof SignatureMap, name: string) => {
    const updated = {
      ...signatures,
      [roleKey]: {
        ...signatures[roleKey],
        signerName: name,
      },
    };
    onChange(updated);
  };

  const handleToggleSigned = (roleKey: keyof SignatureMap, isSigned: boolean) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = {
      ...signatures,
      [roleKey]: {
        ...signatures[roleKey],
        signed: isSigned,
        date: isSigned ? (signatures[roleKey].date || today) : '',
      },
    };
    onChange(updated);
  };

  const handleDateChange = (roleKey: keyof SignatureMap, dateStr: string) => {
    const updated = {
      ...signatures,
      [roleKey]: {
        ...signatures[roleKey],
        date: dateStr,
      },
    };
    onChange(updated);
  };

  const handleApproveAll = () => {
    const today = new Date().toISOString().split('T')[0];
    const updated: SignatureMap = {
      reviewer: { ...signatures.reviewer, signed: true, date: signatures.reviewer.date || today },
      headOfUnit: { ...signatures.headOfUnit, signed: true, date: signatures.headOfUnit.date || today },
      technicalOfficeHead: { ...signatures.technicalOfficeHead, signed: true, date: signatures.technicalOfficeHead.date || today },
      generalDirector: { ...signatures.generalDirector, signed: true, date: signatures.generalDirector.date || today },
    };
    onChange(updated);
  };

  const rolesList: { key: keyof SignatureMap; label: string; iconColor: string }[] = [
    { key: 'reviewer', label: 'معد الدراسة الفنية', iconColor: 'text-blue-500' },
    { key: 'headOfUnit', label: 'مدير الإدارة الفنية (موافقة النوعية)', iconColor: 'text-teal-500' },
    { key: 'technicalOfficeHead', label: 'رئيس الهيئة / المكتب الفني', iconColor: 'text-purple-500' },
    { key: 'generalDirector', label: 'المدير العام لتنظيم الاتصالات', iconColor: 'text-amber-500' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              لوحة التوقيعات الرقمية المعتمدة (Digital Signature Panel)
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              تحديد المسئولين المعتمدين وحالة الاعتماد للتحديث الفوري على المعاينة الرسمية
            </p>
          </div>
        </div>

        <button
          onClick={handleApproveAll}
          className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
        >
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span>اعتماد كافة التوقيعات دفعة واحدة</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {rolesList.map(({ key, label, iconColor }) => {
          const sig = signatures[key];
          const options = AUTHORIZED_SIGNERS[key];

          return (
            <div
              key={key}
              className={`p-3.5 rounded-xl border space-y-3 transition ${
                sig.signed
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 truncate">
                  <UserCheck className={`w-3.5 h-3.5 shrink-0 ${iconColor}`} />
                  <span className="truncate">{label}</span>
                </span>
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ${
                    sig.signed
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-400 dark:bg-emerald-900/60 dark:text-emerald-200'
                      : 'bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  {sig.signed ? 'معتمد' : 'معلق'}
                </span>
              </div>

              {/* Select Authorized Signer Dropdown */}
              <div className="space-y-1 text-xs">
                <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">
                  اختر المسؤول المعتمد:
                </label>
                <select
                  value={sig.signerName}
                  onChange={(e) => handleNameChange(key, e.target.value)}
                  className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-bold text-xs focus:ring-2 focus:ring-blue-500"
                >
                  {options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                  {!options.includes(sig.signerName) && (
                    <option value={sig.signerName}>{sig.signerName}</option>
                  )}
                </select>
              </div>

              {/* Checkbox for Signed Toggle */}
              <label className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={sig.signed}
                  onChange={(e) => handleToggleSigned(key, e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300"
                />
                <span>تفعيل التوقيع الرقمي</span>
              </label>

              {/* Signed Date Input */}
              {sig.signed && (
                <div className="space-y-1 text-xs pt-1 border-t border-emerald-200 dark:border-emerald-900">
                  <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-emerald-600" />
                    <span>تاريخ التوقيع:</span>
                  </label>
                  <input
                    type="date"
                    value={sig.date || new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleDateChange(key, e.target.value)}
                    className="w-full p-1.5 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 rounded font-mono text-[11px] text-slate-900 dark:text-slate-100 font-bold"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
