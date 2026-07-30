/**
 * @file CertificateIssuanceUnit.tsx
 * Type Approval Certificate Issuance Unit (وحدة إصدار شهادة الموافقة النوعية)
 *
 * Implements interactive Mock UI relying on the CertificateService abstraction.
 * Decoupled from PDF engine, QR engine, and validity logic to allow later binding
 * with a legacy engine adapter or external API.
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  certificateService,
  CertificateTypeOption,
  CertificateType,
  CertificateStatus,
  CertificateDetails,
  EligibilityItem,
  IssuanceHistoryRecord,
} from '../../services/certificateService';
import { EligibilityChecklist } from './EligibilityChecklist';
import { CertificatePreview } from './CertificatePreview';
import { CertificateHistory } from './CertificateHistory';
import { DigitalSignaturePanel, SignatureMap } from './DigitalSignaturePanel';
import { DigitalSealPanel, DigitalSealConfig } from './DigitalSealPanel';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  CreditCard,
  FileCheck,
  Eye,
  Zap,
  AlertTriangle,
  History,
  Info,
  Calendar,
  Layers,
  Check,
  Copy,
} from 'lucide-react';

export const CertificateIssuanceUnit: React.FC = () => {
  const { currentRequest, addToast, addAuditLog } = useApp();

  // Certificate Type & Dates State
  const [certType, setCertType] = useState<CertificateTypeOption>(CertificateType.OFFICIAL);
  const [issueDate, setIssueDate] = useState<string>(
    currentRequest.certificateIssueDate || new Date().toISOString().split('T')[0]
  );
  const [customDays, setCustomDays] = useState<number>(180);
  const [temporaryReason, setTemporaryReason] = useState<string>(
    'إصدار مؤقت لغرض الفحص المختبري والعرض الميداني في المنفذ الجمركي لحين استكمال شهادة المطابقة البيئية.'
  );

  // Status & History States
  const [certStatus, setCertStatus] = useState<CertificateStatus>('مسودة_قيد_الإعداد');
  const [historyRecords, setHistoryRecords] = useState<IssuanceHistoryRecord[]>([]);
  const [eligibilityList, setEligibilityList] = useState<EligibilityItem[]>([]);
  const [isReadyForIssuance, setIsReadyForIssuance] = useState<boolean>(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isIssuingMock, setIsIssuingMock] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);

  // Signatures State
  const [signatures, setSignatures] = useState<SignatureMap>({
    reviewer: { roleTitle: 'معد الدراسة الفنية', signerName: 'م. أحمد باصريح', signed: true, date: '2026-07-30' },
    headOfUnit: { roleTitle: 'مدير موافقة النوعية', signerName: 'د. صادق الشرفي', signed: true, date: '2026-07-30' },
    technicalOfficeHead: { roleTitle: 'رئيس المكتب الفني', signerName: 'م. وائل صلاح القاسمي', signed: true, date: '2026-07-30' },
    generalDirector: { roleTitle: 'المدير العام لتنظيم الاتصالات', signerName: 'أ.د. يحيى المتوكل', signed: false, date: '' },
  });

  // Digital Seal Configuration State
  const [sealConfig, setSealConfig] = useState<DigitalSealConfig>({
    style: 'golden',
    position: 'left',
    visible: true,
    opacity: 0.9,
    watermark: true,
  });

  // Calculate Expected Expiry Date using CertificateService Abstraction
  const expectedExpiryDate = certificateService.getExpectedExpiryDate(certType, issueDate, customDays);

  // Load Eligibility & Issuance History on Mount / Request change
  useEffect(() => {
    const checklist = certificateService.validateEligibility(currentRequest);
    setEligibilityList(checklist);
    setIsReadyForIssuance(checklist.every((c) => c.passed));

    const history = certificateService.getIssuanceHistory(currentRequest.certificateNumber || 'TA-2026-88392');
    setHistoryRecords(history);
  }, [currentRequest]);

  // Handle Eligibility Check updates
  const handleEligibilityChange = (isReady: boolean, updatedItems: EligibilityItem[]) => {
    setIsReadyForIssuance(isReady);
    setEligibilityList(updatedItems);
  };

  // Handle Preview Action via CertificateService
  const handlePreview = async () => {
    setIsLoadingPreview(true);
    try {
      const response = await certificateService.previewCertificate({
        certificateNumber: currentRequest.certificateNumber || 'TA-2026-88392',
        requestNumber: currentRequest.requestNumber,
        applicantName: currentRequest.applicant.name,
        certificateType: certType,
        issueDate,
        expectedExpiryDate,
        temporaryReason,
      });

      if (response.success) {
        addToast({
          type: 'success',
          title: 'معاينة القالب الرسمي',
          message: response.message,
        });
      }
    } catch (e) {
      addToast({
        type: 'error',
        title: 'فشل المعاينة',
        message: 'حدث خطأ أثناء الاتصال بمحرك المعاينة الخارجي.',
      });
    } finally {
      setIsLoadingPreview(false);
    }
  };

  // Handle Mock Issuance Trial via CertificateService
  const handleMockIssuance = async () => {
    setIsIssuingMock(true);
    try {
      const fullDetails: CertificateDetails = {
        certificateNumber: currentRequest.certificateNumber || `TA-${new Date().getFullYear()}-0942`,
        requestNumber: currentRequest.requestNumber,
        applicantName: currentRequest.applicant.name,
        commercialRegister: currentRequest.applicant.crNumber || '10293847',
        manufacturerName: currentRequest.manufacturer.companyName,
        manufacturerCountry: currentRequest.manufacturer.country,
        equipmentCategory: currentRequest.equipmentCategory || 'أجهزة اتصالات لاسلكية',
        brandModel: `${currentRequest.brand} ${currentRequest.model}`,
        frequencyRanges: currentRequest.technicalSpecs?.frequencyRange || '2.4 GHz / 5.8 GHz',
        powerOutput: currentRequest.technicalSpecs?.powerRating || '20 dBm (100mW)',
        certificateType: certType,
        issueDate,
        expectedExpiryDate,
        temporaryReason: certType.includes('مؤقتة') ? temporaryReason : undefined,
        customValidityDays: certType === 'مدة_مخصصة' ? customDays : undefined,
        guaranteeData: {
          checkNumber: currentRequest.feesAndGuarantee?.guaranteeCheckNumber || 'CH-994021',
          bankName: 'بنك التسليف التعاوني والكشفي (CAC Bank)',
          amount: currentRequest.feesAndGuarantee?.guaranteeAmount || 2500000,
          currency: 'YER',
          expiryDate: currentRequest.feesAndGuarantee?.guaranteeExpiryDate || '2027-12-31',
          paymentStatus: currentRequest.feesAndGuarantee?.paymentStatus || 'مدفوع',
        },
        status: 'صادرة_رسمياً',
        signatures: {
          reviewer: signatures.reviewer,
          headOfUnit: signatures.headOfUnit,
          generalDirector: signatures.generalDirector,
          technicalOfficeHead: signatures.technicalOfficeHead,
        },
      };

      const res = await certificateService.issueCertificateMock(fullDetails);

      if (res.success) {
        setCertStatus('صادرة_رسمياً');
        addToast({
          type: 'success',
          title: 'محاكاة إصدار الشهادة',
          message: res.message,
        });

        // Log audit record
        addAuditLog({
          userName: 'معد الدراسة الفنية',
          userRole: 'مهندس الموافقة النوعية',
          action: 'إطلاق محاكاة إصدار شهادة تجريبية',
          department: 'الإدارة العامة لتنظيم الاتصالات',
          previousValue: certStatus,
          newValue: 'صادرة_رسمياً',
          reason: 'اختبار الربط مع محرك الشهادات الخارجي',
          details: `رقم الشهادة المحاكاة: ${res.certificateNumber} | النوع: ${certType}`,
          requestNumber: currentRequest.requestNumber,
          ipAddress: '10.20.1.45',
        });

        // Add to history list
        const newHistRecord: IssuanceHistoryRecord = {
          id: `hist-${Date.now()}`,
          version: `v3.0-ISSUED-${res.certificateNumber}`,
          action: 'إصدار تجريبي ناجح لمستند الشهادة',
          timestamp: new Date().toLocaleString('ar-YE'),
          performedBy: 'م. أحمد باصريح (عبر واجهة Abstraction)',
          role: 'محلل فني بالمكتب الفني',
          certificateType: certType,
          status: 'صادرة',
          notes: 'تم الاختبار عبر المحاكي، الواجهة جاهزة للربط مع Adapter القديم.',
        };
        setHistoryRecords((prev) => [newHistRecord, ...prev]);
      }
    } catch (e) {
      addToast({
        type: 'error',
        title: 'فشل محاكاة الإصدار',
        message: 'عذراً، حدث خطأ أثناء تنفيذ أمر محاكاة الإصدار التجريبي.',
      });
    } finally {
      setIsIssuingMock(false);
    }
  };

  const handleCopyCertificateNum = () => {
    const num = currentRequest.certificateNumber || 'TA-2026-88392';
    navigator.clipboard.writeText(num);
    setCopiedNumber(true);
    addToast({
      type: 'info',
      title: 'نسخ رقم الشهادة',
      message: `تم نسخ الرقم الرسمي (${num}) إلى الحافظة.`,
    });
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Module Title Banner & Adapter Status Badge */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 text-white rounded-lg">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>وحدة إصدار شهادة الموافقة النوعية</span>
                <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 font-mono font-bold px-2 py-0.5 rounded-full border border-blue-300 dark:border-blue-800">
                  CertificateService API
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                تأهيل المستندات، اختيار فئة الصلاحية، مراجعة الضمانات، والمعاينة التفاعلية للقالب الرسمي قبل الإصدار
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls Header */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePreview}
            disabled={isLoadingPreview}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-bold rounded-lg text-xs transition flex items-center gap-1.5 shadow-2xs"
          >
            <Eye className="w-4 h-4 text-blue-500" />
            <span>{isLoadingPreview ? 'جاري طلب المعاينة...' : 'معاينة القالب'}</span>
          </button>

          <button
            onClick={handleMockIssuance}
            disabled={isIssuingMock}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-lg text-xs transition flex items-center gap-1.5 shadow-md"
          >
            <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>{isIssuingMock ? 'جاري محاكاة الإصدار...' : 'إصدار تجريبي غير فعلي'}</span>
          </button>
        </div>
      </div>

      {/* Legacy Adapter Integration Info Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/80 p-3.5 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-extrabold block text-sm">
            ملاحظة معمارية هندسية (Legacy Certificate Adapter Ready):
          </span>
          <p className="leading-relaxed">
            هذه الواجهة تعتمد كلياً على نمط التجريد <strong>CertificateService</strong>. لا تجري الواجهة أي عمليات حسابية للصلاحية أو توليد رموز QR/PDF داخلياً، مما يتيح ربطها لاحقاً بمحرك تصدير الشهادات القديم عبر REST API أو Legacy Adapter بدون تعديل أي مكون بالواجهة.
          </p>
        </div>
      </div>

      {/* Interactive Eligibility Checklist Component */}
      <EligibilityChecklist
        initialItems={eligibilityList}
        onStatusChange={handleEligibilityChange}
      />

      {/* Certificate Configuration: Type Selector, Dates, Reason, Guarantees */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Certificate Type & Validity Selector */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Award className="w-4 h-4 text-blue-600" />
            <span>نوع الشهادة وفترة الصلاحية المقررة</span>
          </h3>

          <div className="space-y-2 text-xs">
            {[
              { id: CertificateType.OFFICIAL, name: 'رسمية (3 سنوات ناقص يوم)', badge: 'قياسية' },
              { id: CertificateType.TEMP_3_MONTHS, name: 'مؤقتة (3 أشهر)', badge: 'مؤقتة' },
              { id: CertificateType.TEMP_6_MONTHS, name: 'مؤقتة (6 أشهر)', badge: 'مؤقتة' },
              { id: CertificateType.CUSTOM, name: 'مدة مخصصة بصلاحية خاصة', badge: 'استثنائية' },
            ].map((option) => (
              <label
                key={option.id}
                className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition ${
                  certType === option.id
                    ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-500 text-blue-900 dark:text-blue-100 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="certificateType"
                    checked={certType === option.id}
                    onChange={() => setCertType(option.id as CertificateTypeOption)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>{option.name}</span>
                </div>
                <span className="text-[10px] bg-white/80 dark:bg-slate-900 px-2 py-0.5 rounded font-bold font-mono border border-slate-200 dark:border-slate-700">
                  {option.badge}
                </span>
              </label>
            ))}
          </div>

          {/* Custom Validity Days Input */}
          {certType === CertificateType.CUSTOM && (
            <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-800 space-y-1 text-xs">
              <label className="block font-bold text-blue-900 dark:text-blue-200">
                حدد عدد أيام الصلاحية المخصصة:
              </label>
              <input
                type="number"
                min={30}
                max={1095}
                value={customDays}
                onChange={(e) => setCustomDays(parseInt(e.target.value) || 180)}
                className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100 font-mono font-bold"
              />
            </div>
          )}

          {/* Issue & Expiry Dates */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                <span>تاريخ الإصدار المعتمد:</span>
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-rose-500" />
                <span>تاريخ الانتهاء المتوقع (محسوب آلياً عبر Abstraction):</span>
              </label>
              <div className="w-full p-2 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 rounded font-mono font-extrabold text-rose-900 dark:text-rose-200 text-sm">
                {expectedExpiryDate}
              </div>
            </div>
          </div>
        </div>

        {/* Temporary Reason & Guarantee Box */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          {/* Temporary Reason Field */}
          {certType.includes('مؤقتة') && (
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/80 rounded-xl space-y-2 text-xs">
              <label className="font-extrabold text-amber-900 dark:text-amber-200 block flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>سبب وتبرير الإصدار المؤقت للشهادة:</span>
              </label>
              <textarea
                rows={3}
                value={temporaryReason}
                onChange={(e) => setTemporaryReason(e.target.value)}
                placeholder="اكتب المبرر والسبب الفني للإصدار المؤقت..."
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 rounded text-slate-800 dark:text-slate-200 leading-relaxed text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}

          {/* Guarantee / Warranty Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>بيانات الضمان المالي والسداد (Guarantee & Warranty Details)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block">رقم شيك الضمان والبنك:</span>
                <p className="font-mono font-extrabold text-slate-800 dark:text-slate-200">
                  {currentRequest.feesAndGuarantee?.guaranteeCheckNumber || 'CH-994021'} (CAC Bank)
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block">قيمة الضمان المالي:</span>
                <p className="font-mono font-extrabold text-blue-600 dark:text-blue-400 text-sm">
                  {(currentRequest.feesAndGuarantee?.guaranteeAmount || 2500000).toLocaleString()} YER
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block">تاريخ انتهاء الضمان:</span>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {currentRequest.feesAndGuarantee?.guaranteeExpiryDate || '2027-12-31'}
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block">حالة سداد الرسوم:</span>
                <p className="font-bold text-emerald-600 dark:text-emerald-400">
                  {currentRequest.feesAndGuarantee?.paymentStatus || 'مدفوع بالكامل'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Signature Panel Component */}
      <DigitalSignaturePanel
        signatures={signatures}
        onChange={setSignatures}
      />

      {/* Official Ministry Digital Seal Panel Component */}
      <DigitalSealPanel
        sealConfig={sealConfig}
        onChange={setSealConfig}
      />

      {/* Official A4 Certificate Preview Component */}
      <CertificatePreview
        sealConfig={sealConfig}
        certificateDetails={{
          certificateNumber: currentRequest.certificateNumber || 'TA-2026-88392',
          requestNumber: currentRequest.requestNumber,
          applicantName: currentRequest.applicant.name,
          commercialRegister: currentRequest.applicant.crNumber || '10293847',
          manufacturerName: currentRequest.manufacturer.companyName,
          manufacturerCountry: currentRequest.manufacturer.country,
          equipmentCategory: currentRequest.equipmentType || 'أجهزة اتصالات لاسلكية',
          brandModel: `${currentRequest.brand} ${currentRequest.model}`,
          frequencyRanges: currentRequest.technicalSpecs?.frequencyRange || '2.4 GHz / 5.8 GHz',
          powerOutput: currentRequest.technicalSpecs?.powerRating || '20 dBm (100mW)',
          certificateType: certType,
          issueDate,
          expectedExpiryDate,
          temporaryReason: certType.includes('مؤقتة') ? temporaryReason : undefined,
          signatures: {
            reviewer: signatures.reviewer,
            headOfUnit: signatures.headOfUnit,
            generalDirector: signatures.generalDirector,
            technicalOfficeHead: signatures.technicalOfficeHead,
          },
        }}
        onRequestPreviewUpdate={handlePreview}
      />

      {/* Issuance History Component */}
      <CertificateHistory
        records={historyRecords}
        requestNumber={currentRequest.requestNumber}
      />
    </div>
  );
};

