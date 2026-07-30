/**
 * @file CertificatePreview.tsx
 * Renders the Type Approval Certificate in an official A4 paper layout (a4-paper).
 * Includes placeholders for Signatures, QR Code, Barcode, and Equipment specifications.
 * Bound to CertificateService abstraction.
 */

import React, { useState, useEffect } from 'react';
import {
  certificateService,
  CertificateDetails,
  CertificateTypeOption,
} from '../../services/certificateService';
import {
  Award,
  Printer,
  Download,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  RefreshCw,
  Eye,
  Lock,
  FileText,
  X,
  Loader2,
} from 'lucide-react';

import { DigitalSealConfig } from './DigitalSealPanel';
import { CertificateTemplateOption } from './CertificateTemplateSelector';

interface CertificatePreviewProps {
  certificateDetails?: Partial<CertificateDetails>;
  sealConfig?: DigitalSealConfig;
  selectedTemplate?: CertificateTemplateOption;
  onRequestPreviewUpdate?: () => void;
}

export const CertificatePreview: React.FC<CertificatePreviewProps> = ({
  certificateDetails,
  sealConfig,
  selectedTemplate = 'tech_devices',
  onRequestPreviewUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [adapterMessage, setAdapterMessage] = useState<string>('');

  // PDF Export Dialog & Progress States
  const [showExportConfirm, setShowExportConfirm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportResult, setExportResult] = useState<string | null>(null);

  // Default values combined with provided props
  const details = {
    certificateNumber: certificateDetails?.certificateNumber || 'TA-2026-88392',
    requestNumber: certificateDetails?.requestNumber || 'REQ-2026-00481',
    applicantName: certificateDetails?.applicantName || 'شركة سبأفون للاتصالات النقال',
    commercialRegister: certificateDetails?.commercialRegister || '10293847',
    manufacturerName: certificateDetails?.manufacturerName || 'Huawei Technologies Co., Ltd.',
    manufacturerCountry: certificateDetails?.manufacturerCountry || 'الصين (China)',
    equipmentCategory: certificateDetails?.equipmentCategory || 'أجهزة محطات تقوية الإشارة 5G/4G',
    brandModel: certificateDetails?.brandModel || 'Huawei AirEngine 8760-X1-PRO',
    frequencyRanges: certificateDetails?.frequencyRanges || '2.400 - 2.4835 GHz / 5.150 - 5.850 GHz',
    powerOutput: certificateDetails?.powerOutput || '20 dBm (100 mW) EIRP',
    certificateType: (certificateDetails?.certificateType || 'رسمية_3سنوات_ناقص_يوم') as CertificateTypeOption,
    issueDate: certificateDetails?.issueDate || '2026-07-30',
    expectedExpiryDate: certificateDetails?.expectedExpiryDate || '2029-07-29',
    temporaryReason: certificateDetails?.temporaryReason,
  };

  // Signatures data
  const sigs = certificateDetails?.signatures || {
    reviewer: { roleTitle: 'معد الدراسة الفنية', signerName: 'م. أحمد باصريح', signed: true, date: '2026-07-30' },
    headOfUnit: { roleTitle: 'مدير موافقة النوعية', signerName: 'د. صادق الشرفي', signed: true, date: '2026-07-30' },
    generalDirector: { roleTitle: 'المدير العام لتنظيم الاتصالات', signerName: 'أ.د. يحيى المتوكل', signed: true, date: '2026-07-30' },
    technicalOfficeHead: { roleTitle: 'رئيس المكتب الفني', signerName: 'م. وائل صلاح القاسمي', signed: true, date: '2026-07-30' },
  };

  // Trigger preview generation via CertificateService on mount or detail change
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    certificateService.previewCertificate(details).then((res) => {
      if (isMounted) {
        setAdapterMessage(res.message);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [certificateDetails?.certificateNumber, certificateDetails?.certificateType, certificateDetails?.issueDate]);

  const handlePrint = () => {
    window.print();
  };

  const handleStartExport = () => {
    setExportResult(null);
    setExportProgress(0);
    setShowExportConfirm(true);
  };

  const handleExecuteExport = async () => {
    setIsExporting(true);
    setExportProgress(10);
    try {
      const res = await certificateService.exportCertificate(
        details.certificateNumber,
        'pdf',
        (percent) => setExportProgress(percent)
      );
      setExportResult(res.message);
    } catch (err: any) {
      setExportResult('حدث خطأ أثناء محاكاة التصدير.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Controls & Adapter Notice */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <Eye className="w-4 h-4 text-blue-600 shrink-0" />
          <div>
            <span className="font-extrabold text-slate-900 dark:text-slate-100 block">
              معاينة القالب الرسمي للموافقة النوعية (A4 Document Model)
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {adapterMessage || 'مرتبط بمحرك Abstraction Adapter'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onRequestPreviewUpdate && (
            <button
              onClick={onRequestPreviewUpdate}
              disabled={loading}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-bold transition flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>تحديث المعاينة</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>طباعة القالب (Print A4)</span>
          </button>

          <button
            onClick={handleStartExport}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تصدير كـ PDF</span>
          </button>
        </div>
      </div>

      {/* Official A4 Paper Container using `a4-paper` class */}
      <div className="bg-slate-200 dark:bg-slate-950 p-4 sm:p-8 rounded-2xl overflow-x-auto flex justify-center">
        <div
          id="certificate-paper-a4"
          className="a4-paper bg-white text-slate-900 shadow-2xl p-6 sm:p-8 border-4 border-slate-900 relative font-sans text-xs w-full max-w-[210mm] min-h-[297mm] space-y-6"
        >
          {/* Inner Frame with Dynamic Styling based on selectedTemplate */}
          <div
            className={`border-2 p-6 space-y-6 relative bg-white h-full flex flex-col justify-between overflow-hidden ${
              selectedTemplate === 'comm_systems'
                ? 'border-blue-700 bg-gradient-to-b from-blue-50/20 via-white to-blue-50/10'
                : selectedTemplate === 'temp_clearance'
                ? 'border-emerald-600 bg-gradient-to-b from-emerald-50/20 via-white to-emerald-50/10'
                : 'border-amber-600'
            }`}
          >
            {/* Optional Background Watermark */}
            {(sealConfig?.watermark ?? true) && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 z-0 select-none">
                <div className="w-80 h-80 rounded-full border-8 border-amber-800 flex items-center justify-center text-center p-6 font-extrabold text-amber-950 text-2xl tracking-widest uppercase">
                  الجمهورية اليمنية
                  <br />
                  وزارة الاتصالات
                  <br />
                  الموافقة النوعية
                </div>
              </div>
            )}

            {/* Header: Republic Emblem, Ministry Info, Certificate Serial */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
              <div className="text-right space-y-0.5">
                <p className="font-extrabold text-base text-slate-900">الجمهورية اليمنية</p>
                <p className="font-bold text-xs text-slate-800">وزارة الاتصالات وتقنية المعلومات</p>
                <p className="text-[11px] text-slate-600">
                  {selectedTemplate === 'comm_systems'
                    ? 'قطاع البنية التحتية والشبكات • قطاع تنظيم الاتصالات'
                    : selectedTemplate === 'temp_clearance'
                    ? 'إدارة التراخيص والمنافذ الجمركية • قطاع تنظيم الاتصالات'
                    : 'الإدارة العامة لتنظيم الاتصالات • المكتب الفني'}
                </p>
              </div>

              <div className="text-center font-mono space-y-1">
                <span
                  className={`px-3 py-1 rounded font-bold text-xs inline-block border ${
                    selectedTemplate === 'comm_systems'
                      ? 'bg-blue-100 text-blue-950 border-blue-500'
                      : selectedTemplate === 'temp_clearance'
                      ? 'bg-emerald-100 text-emerald-950 border-emerald-500'
                      : 'bg-amber-100 text-amber-950 border-amber-500'
                  }`}
                >
                  {selectedTemplate === 'comm_systems'
                    ? 'قالب الأنظمة والشبكات'
                    : selectedTemplate === 'temp_clearance'
                    ? 'قالب الترخيص والإفراج المؤقت'
                    : `نوع الشهادة: ${details.certificateType.replace(/_/g, ' ')}`}
                </span>
                <p className="font-bold text-slate-900 text-xs mt-1">
                  رقم الشهادة: {details.certificateNumber}
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  رقم الطلب: {details.requestNumber}
                </p>
              </div>
            </div>

            {/* Title Statement */}
            <div className="text-center space-y-2 py-2">
              <h1 className="text-xl font-extrabold text-blue-950 tracking-wide">
                {selectedTemplate === 'comm_systems'
                  ? 'شهادة اعتماد وتوافق الأنظمة والبنية التحتية الاتصالية'
                  : selectedTemplate === 'temp_clearance'
                  ? 'إفادة وترخيص الإفراج الفني الجمركي المؤقت'
                  : 'شهادة موافقة نوعية لأجهزة ونظم الاتصالات'}
              </h1>
              <p className="text-[11px] text-slate-500 font-mono tracking-wider">
                {selectedTemplate === 'comm_systems'
                  ? 'TELECOMMUNICATION INFRASTRUCTURE & NETWORK SYSTEM CERTIFICATE'
                  : selectedTemplate === 'temp_clearance'
                  ? 'TEMPORARY TECHNICAL CLEARANCE & CUSTOMS RELEASE PROVISIONAL PERMIT'
                  : 'TYPE APPROVAL CERTIFICATE FOR TELECOMMUNICATION EQUIPMENT'}
              </p>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-slate-800 font-bold leading-relaxed text-xs">
                {selectedTemplate === 'comm_systems'
                  ? 'تشهد الإدارة العامة لتنظيم الاتصالات بالجمهورية اليمنية بأن المنظومة الاتصالية والشبكية الموضحة بياناتها أدناه قد اجتازت اختبارات البروتوكولات الترددية الربط وتوافق السلامة الكهرومغناطيسية.'
                  : selectedTemplate === 'temp_clearance'
                  ? 'تمنح هذه الإفادة مؤقتاً للشحنات والمعدات الواردة عبر المنافذ الجمركية بغرض المعاينة والاختبار الميداني، وتلزم المستورد باستكمال كافة متطلبات المطابقة خلال الموعد المحدد.'
                  : 'تشهد وزارة الاتصالات وتقنية المعلومات بالجمهورية اليمنية بأن الجهاز المبينة تفاصيله ومواصفاته أدناه قد استوفى كافة الفحوصات المختبرية وااختبارات طيف الترددات والمواصفات الفنية المعتمدة لدى الوزارة.'}
              </div>
            </div>

            {/* Equipment & Applicant Specifications Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs border border-slate-300 p-4 bg-slate-50/80 rounded space-y-0">
              <div>
                <span className="text-slate-500 block text-[11px]">صاحب الاعتماد / المستورد:</span>
                <p className="font-extrabold text-slate-900">{details.applicantName}</p>
                <p className="text-[10px] text-slate-500 font-mono">س.ت: {details.commercialRegister}</p>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">الشركة المصنعة والبلد:</span>
                <p className="font-extrabold text-slate-900">
                  {details.manufacturerName} ({details.manufacturerCountry})
                </p>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">العلامة والموديل والجهاز:</span>
                <p className="font-extrabold font-mono text-blue-950 text-sm">
                  {details.brandModel}
                </p>
                <p className="text-[10px] text-slate-600">{details.equipmentCategory}</p>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">نطاق الترددات وقدرة البث:</span>
                <p className="font-mono font-bold text-slate-900">{details.frequencyRanges}</p>
                <p className="text-[10px] font-mono text-slate-600">EIRP: {details.powerOutput}</p>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">تاريخ الإصدار:</span>
                <p className="font-mono font-bold text-slate-900">{details.issueDate}</p>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">تاريخ الانتهاء المتوقع:</span>
                <p className="font-mono font-extrabold text-rose-900">{details.expectedExpiryDate}</p>
              </div>
            </div>

            {/* Temporary Reason (If Temporary Certificate) */}
            {details.temporaryReason && details.certificateType.includes('مؤقتة') && (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded text-[11px] text-amber-950 space-y-1">
                <span className="font-bold block">ملاحظة الترخيص المؤقت:</span>
                <p className="leading-relaxed">{details.temporaryReason}</p>
              </div>
            )}

            {/* Placeholders Row: Signatures, QR Code, Barcode */}
            <div className="pt-4 space-y-4 border-t border-slate-300">
              {/* Placeholders for Signatures Grid & Official Digital Seal */}
              <div className="space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-bold block">
                    عناصر الاعتماد الرقمي والتوقيعات القيادية (Signatures & Seal):
                  </span>
                  {sealConfig?.visible !== false && (
                    <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                      موقع الختم: {sealConfig?.position === 'right' ? 'يمين الوثيقة' : 'يسار الوثيقة'}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] relative">
                  {Object.entries(sigs).map(([key, sig]: [string, any]) => (
                    <div
                      key={key}
                      className="p-2 bg-slate-50 border border-slate-200 rounded text-center space-y-0.5"
                    >
                      <span className="text-[10px] text-slate-500 font-bold block">{sig.roleTitle}</span>
                      <p className="font-bold text-slate-900 text-xs">{sig.signerName}</p>
                      <div className="font-serif text-[10px] text-blue-900 font-bold">
                        {sig.signed ? '✓ معتمد رقمياً' : 'بانتظار الاعتماد'}
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 block">{sig.date || '2026-07-30'}</span>
                    </div>
                  ))}

                  {/* Render Official Digital Seal Stamp Badge */}
                  {sealConfig?.visible !== false && (
                    <div
                      style={{ opacity: sealConfig?.opacity ?? 0.9 }}
                      className={`absolute -top-3 z-20 pointer-events-none transition-all duration-300 ${
                        sealConfig?.position === 'right' ? 'right-2' : 'left-2'
                      }`}
                    >
                      <div
                        className={`w-28 h-28 rounded-full border-4 border-dashed p-1 flex flex-col items-center justify-center text-center shadow-lg transform -rotate-12 ${
                          sealConfig?.style === 'golden'
                            ? 'border-amber-600 bg-gradient-to-br from-amber-500/20 to-yellow-600/30 text-amber-900'
                            : sealConfig?.style === 'technical'
                            ? 'border-blue-600 bg-gradient-to-br from-blue-500/20 to-indigo-600/30 text-blue-900'
                            : sealConfig?.style === 'digital'
                            ? 'border-teal-600 bg-gradient-to-br from-teal-500/20 to-emerald-600/30 text-teal-900'
                            : 'border-purple-600 bg-gradient-to-br from-purple-500/20 to-indigo-600/30 text-purple-900'
                        }`}
                      >
                        <ShieldCheck className="w-6 h-6 mb-0.5" />
                        <span className="text-[9px] font-extrabold leading-tight">الجمهورية اليمنية</span>
                        <span className="text-[8px] font-bold leading-tight">وزارة الاتصالات</span>
                        <span className="text-[7px] font-mono font-bold mt-0.5 bg-white/80 px-1 rounded border">
                          ختم رسمي معتمد
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* QR Code & Barcode Placeholders Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                {/* QR Code Placeholder */}
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <div className="w-16 h-16 bg-slate-900 text-white rounded p-1 flex items-center justify-center shrink-0">
                    <QrCode className="w-12 h-12 text-white" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-xs text-slate-900 block">
                      رمز QR للتحقق والتتبع الإلكتروني
                    </span>
                    <span className="font-mono text-[10px] text-slate-600 block">
                      {details.certificateNumber}
                    </span>
                    <span className="text-[9px] text-blue-700 font-bold underline cursor-pointer">
                      https://mti.gov.ye/verify/{details.certificateNumber}
                    </span>
                  </div>
                </div>

                {/* Barcode Placeholder */}
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-center space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold block">
                    الرمز الباركوودي الشريطي (Barcode Placeholder)
                  </span>
                  <div className="h-8 bg-slate-900 rounded flex items-center justify-center text-white text-xs font-mono tracking-widest font-black">
                    |||||| ||| ||||| |||| |||| |||
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-800 block">
                    *{details.requestNumber}*
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Confirmation & Progress Modal */}
      {showExportConfirm && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                  حوار تأكيد تصدير الشهادة كـ PDF
                </h3>
              </div>
              <button
                onClick={() => !isExporting && setShowExportConfirm(false)}
                disabled={isExporting}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded disabled:opacity-30"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!exportResult ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-bold">
                  هل ترغب بتصدير وثيقة الشهادة الرسمية (رقم <span className="font-mono text-blue-600">{details.certificateNumber}</span>) بصيغة PDF عالية الدقة؟
                </p>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                  <span className="font-bold block text-slate-800 dark:text-slate-200">خصائص التصدير عبر المحرك:</span>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>تضمين العلامة المائية والختم الرسمي</li>
                    <li>تضمين رمز الـ QR للتتبع الإلكتروني</li>
                    <li>تضمين التوقيعات الرقمية المعتمدة</li>
                  </ul>
                </div>

                {isExporting ? (
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                        <span>جاري معالجة وتصدير ملف PDF...</span>
                      </span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400">{exportProgress}%</span>
                    </div>
                    {/* Mock Progress Indicator Bar */}
                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
                        style={{ width: `${exportProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowExportConfirm(false)}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={handleExecuteExport}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>تأكيد التصدير الان</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Success Result View */
              <div className="space-y-4 py-2 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                    تمت عملية التصدير بنجاح!
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">{exportResult}</p>
                </div>

                <div className="pt-2 flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      setShowExportConfirm(false);
                      setExportResult(null);
                    }}
                    className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition"
                  >
                    إغلاق النافذة
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
