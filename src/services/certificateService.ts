/**
 * @file certificateService.ts
 * Abstraction layer & Legacy Adapter Interface for Type Approval Certificate Issuance.
 * Designed so that the React UI relies strictly on this abstraction layer
 * without binding directly to a specific PDF, QR, or Validity calculation engine.
 */

export enum CertificateType {
  OFFICIAL = 'رسمية_3سنوات_ناقص_يوم',
  TEMP_3_MONTHS = 'مؤقتة_3أشهر',
  TEMP_6_MONTHS = 'مؤقتة_6أشهر',
  CUSTOM = 'مدة_مخصصة',
}

export type CertificateTypeOption =
  | 'رسمية_3سنوات_ناقص_يوم'
  | 'مؤقتة_3أشهر'
  | 'مؤقتة_6أشهر'
  | 'مدة_مخصصة'
  | CertificateType;

export type CertificateStatus =
  | 'مسودة_قيد_الإعداد'
  | 'قيد_اعتماد_التوقيعات'
  | 'صادرة_رسمياً'
  | 'معلقة'
  | 'ملغاة'
  | 'منتهية';

export interface GuaranteeData {
  checkNumber: string;
  bankName: string;
  amount: number;
  currency: string;
  expiryDate: string;
  paymentStatus: 'مدفوع' | 'معلق' | 'معفى' | 'ضمان_مستلم';
}

export interface CertificateSignature {
  roleTitle: string;
  signerName: string;
  signed: boolean;
  date?: string;
  digitalHash?: string;
}

export interface CertificateDetails {
  certificateNumber: string;
  requestNumber: string;
  applicantName: string;
  commercialRegister: string;
  manufacturerName: string;
  manufacturerCountry: string;
  equipmentCategory: string;
  brandModel: string;
  frequencyRanges: string;
  powerOutput: string;
  certificateType: CertificateTypeOption;
  issueDate: string;
  expectedExpiryDate: string;
  temporaryReason?: string;
  customValidityDays?: number;
  guaranteeData: GuaranteeData;
  status: CertificateStatus;
  signatures: {
    reviewer: CertificateSignature;
    headOfUnit: CertificateSignature;
    generalDirector: CertificateSignature;
    technicalOfficeHead: CertificateSignature;
  };
}

export interface EligibilityItem {
  id: string;
  label: string;
  passed: boolean;
  category: 'فني' | 'مالي' | 'أمني' | 'إداري';
  description?: string;
}

export interface IssuanceHistoryRecord {
  id: string;
  version: string;
  action: string;
  timestamp: string;
  performedBy: string;
  role: string;
  certificateType: string;
  status: 'صادرة' | 'ملغاة' | 'محدثة' | 'مسودة' | 'معلقة';
  notes: string;
}

export interface ExpiringCertificateItem {
  id: string;
  certificateNumber: string;
  requestNumber: string;
  applicantName: string;
  brandModel: string;
  certificateType: string;
  issueDate: string;
  expiryDate: string;
  daysRemaining: number;
  status: 'حرج' | 'تحذير' | 'طبيعي';
}

export interface CertificateServiceResponse {
  success: boolean;
  message: string;
  certificateNumber?: string;
  timestamp?: string;
  adapterVersion?: string;
}

export interface ICertificateService {
  validateEligibility(request: any): EligibilityItem[];
  getExpectedExpiryDate(type: CertificateTypeOption, issueDateStr: string, customDays?: number): string;
  previewCertificate(details: Partial<CertificateDetails>): Promise<CertificateServiceResponse>;
  issueCertificateMock(details: CertificateDetails): Promise<CertificateServiceResponse>;
  exportCertificate(
    certificateNumber: string,
    format?: 'pdf' | 'png',
    onProgress?: (percent: number) => void
  ): Promise<CertificateServiceResponse>;
  getIssuanceHistory(certificateNumber: string): IssuanceHistoryRecord[];
  getExpiringCertificates(thresholdDays?: number): ExpiringCertificateItem[];
}

/**
 * Mock Certificate Adapter (Simulates Legacy Adapter / External Engine API)
 */
export class LegacyCertificateAdapter implements ICertificateService {
  private adapterVersion = 'Legacy-Adapter-v2.1-Mock';

  validateEligibility(request: any): EligibilityItem[] {
    const isStep7Done = request?.stepStatuses?.step7 === 'معتمدة' || request?.stepStatuses?.step5 === 'معتمدة';
    const isSpectrumOk = request?.spectrumStatus === 'متوافق' || request?.spectrumStatus === 'متوافق_بشروط';
    const isSecurityOk = request?.securityStatus === 'موافق' || request?.securityStatus === 'موافق_بشروط';
    const isDeficienciesClear = (request?.deficiencies || []).every((d: any) => d.status === 'مغلق');
    const isFeePaid = request?.feesAndGuarantee?.paymentStatus === 'مدفوع' || request?.feesAndGuarantee?.paymentStatus === 'ضمان_مستلم';
    const hasApprovals = (request?.approvals || []).filter((a: any) => a.status === 'معتمد').length >= 2;

    return [
      {
        id: 'chk-1',
        label: 'اعتماد التقرير الفني النهائي بالمكتب الفني',
        passed: isStep7Done,
        category: 'فني',
        description: 'استيفاء الشروط والمواصفات الفنية المعتمدة باللائحة الوطنية.',
      },
      {
        id: 'chk-2',
        label: 'استيفاء فحص وموافقة قطاع طيف الترددات',
        passed: isSpectrumOk,
        category: 'فني',
        description: 'مطابقة الترددات وقدرات البث الإشعاعي للجدول الوطني.',
      },
      {
        id: 'chk-3',
        label: 'التنسيق والتصريح الأمني والسيبراني',
        passed: isSecurityOk,
        category: 'أمني',
        description: 'تأمين حماية الشبكات والتشفير المصرح به.',
      },
      {
        id: 'chk-4',
        label: 'إغلاق كافة النواقص والملاحظات الحرجة',
        passed: isDeficienciesClear,
        category: 'إداري',
        description: 'تقديم الوثائق الأصلية والتوكيلات والكتالوج المعتمد.',
      },
      {
        id: 'chk-5',
        label: 'سداد الرسوم والضمان المالي المقرر',
        passed: isFeePaid,
        category: 'مالي',
        description: 'تأكيد إيصال السداد وشيك الضمان المصرفي.',
      },
      {
        id: 'chk-6',
        label: 'التسلسل القيادي للتواريخ والتوقيعات الرسمية',
        passed: hasApprovals,
        category: 'إداري',
        description: 'توقيع المستوى الأول والثاني بسلسلة التوصيات.',
      },
      {
        id: 'chk-7',
        label: 'مطابقة العلامة والموديل والشركة المصنعة',
        passed: true,
        category: 'فني',
        description: 'خلو السجل الوطني من تعارضات سابقة للموديل نفسه.',
      },
      {
        id: 'chk-8',
        label: 'تأكيد صحة الوثائق والسند التجاري النافذ',
        passed: true,
        category: 'إداري',
        description: 'سريان السجل التجاري والترخيص الفني للمستورد.',
      },
    ];
  }

  getExpectedExpiryDate(type: CertificateTypeOption, issueDateStr: string, customDays: number = 365): string {
    const baseDate = new Date(issueDateStr || Date.now());
    if (isNaN(baseDate.getTime())) {
      return '2029-07-29';
    }

    const d = new Date(baseDate);
    if (type === 'رسمية_3سنوات_ناقص_يوم') {
      d.setFullYear(d.getFullYear() + 3);
      d.setDate(d.getDate() - 1);
    } else if (type === 'مؤقتة_3أشهر') {
      d.setMonth(d.getMonth() + 3);
    } else if (type === 'مؤقتة_6أشهر') {
      d.setMonth(d.getMonth() + 6);
    } else if (type === 'مدة_مخصصة') {
      d.setDate(d.getDate() + (customDays || 90));
    }

    return d.toISOString().split('T')[0];
  }

  async previewCertificate(details: Partial<CertificateDetails>): Promise<CertificateServiceResponse> {
    // Mock simulation for preview adapter call
    await new Promise((res) => setTimeout(res, 400));
    return {
      success: true,
      message: `تم توليد معاينة وثيقة الشهادة بنجاح بواسطة المحرك ${this.adapterVersion}`,
      certificateNumber: details.certificateNumber || 'TA-2026-99482',
      timestamp: new Date().toLocaleTimeString('ar-YE'),
      adapterVersion: this.adapterVersion,
    };
  }

  async issueCertificateMock(details: CertificateDetails): Promise<CertificateServiceResponse> {
    // Mock simulation for issuance trial
    await new Promise((res) => setTimeout(res, 600));
    const generatedNum = details.certificateNumber || `TA-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    return {
      success: true,
      message: `[محاكاة تجريبية] تم إرسال أمر إصدار الشهادة (${generatedNum}) إلى محرك التصدير الخارجي بنجاح.`,
      certificateNumber: generatedNum,
      timestamp: new Date().toISOString(),
      adapterVersion: this.adapterVersion,
    };
  }

  async exportCertificate(
    certificateNumber: string,
    format: 'pdf' | 'png' = 'pdf',
    onProgress?: (percent: number) => void
  ): Promise<CertificateServiceResponse> {
    const steps = [15, 35, 60, 85, 100];
    for (const p of steps) {
      if (onProgress) onProgress(p);
      await new Promise((res) => setTimeout(res, 250));
    }

    return {
      success: true,
      message: `تم تصدير وثيقة الشهادة الرسمية (${certificateNumber}) بنجاح بصيغة ${format.toUpperCase()}.`,
      certificateNumber,
      timestamp: new Date().toISOString(),
      adapterVersion: this.adapterVersion,
    };
  }

  getIssuanceHistory(certificateNumber: string): IssuanceHistoryRecord[] {
    return [
      {
        id: 'hist-1',
        version: 'v1.0-DRAFT',
        action: 'إنشاء مسودة الشهادة وتوليد الرمز التتبعي',
        timestamp: '2026-07-30 09:15:00',
        performedBy: 'م. أحمد باصريح',
        role: 'معد الدراسة الفنية',
        certificateType: 'رسمية (3 سنوات ناقص يوم)',
        status: 'مسودة',
        notes: 'تم استيفاء الشروط وتحديد نطاق الترددات 2.4/5.8GHz.',
      },
      {
        id: 'hist-2',
        version: 'v1.1-REVIEW',
        action: 'تحديث المراجعة الفنية الأولى وتسجيل رقم الإيصال المالي',
        timestamp: '2026-07-30 11:30:00',
        performedBy: 'د. صادق الشرفي',
        role: 'مدير إدارة الموافقة النوعية',
        certificateType: 'رسمية (3 سنوات ناقص يوم)',
        status: 'محدثة',
        notes: 'التحقق من سندات السداد وشيك الضمان المصرفي وتأكيد سريان البيانات.',
      },
      {
        id: 'hist-3',
        version: 'v2.0-APPROVAL_PENDING',
        action: 'رفع التوصية لرئيس المكتب الفني والتجهيز للإصدار الرسمى',
        timestamp: '2026-07-30 13:45:00',
        performedBy: 'م. وائل صلاح القاسمي',
        role: 'رئيس المكتب الفني',
        certificateType: 'رسمية (3 سنوات ناقص يوم)',
        status: 'صادرة',
        notes: 'جاهزة وتأكيد الاستيفاء، صالحة للاستخدام الرسمي وتطبيق التوقيعات.',
      },
      {
        id: 'hist-4',
        version: 'v0.9-CANCELLED_MOCK',
        action: 'إلغاء مسودة سابقة بسبب تعديل الموديل الفني',
        timestamp: '2026-07-28 16:20:00',
        performedBy: 'م. أحمد باصريح',
        role: 'معد الدراسة الفنية',
        certificateType: 'مؤقتة 3 أشهر',
        status: 'ملغاة',
        notes: 'تم إلغاء الإصدار المؤقت السابق واستبداله بطلب النطاق الترددي المزدوج.',
      },
    ];
  }

  getExpiringCertificates(thresholdDays: number = 30): ExpiringCertificateItem[] {
    return [
      {
        id: 'exp-1',
        certificateNumber: 'TA-2023-11029',
        requestNumber: 'REQ-2023-0881',
        applicantName: 'شركة يمن موبايل للهاتف النقال',
        brandModel: 'ZTE ZXWN BBU5200',
        certificateType: 'مؤقتة 3 أشهر',
        issueDate: '2026-05-05',
        expiryDate: '2026-08-05',
        daysRemaining: 6,
        status: 'حرج' as const,
      },
      {
        id: 'exp-2',
        certificateNumber: 'TA-2026-88392',
        requestNumber: 'REQ-2026-00481',
        applicantName: 'شركة سبأفون للاتصالات النقال',
        brandModel: 'Huawei AirEngine 8760-X1-PRO',
        certificateType: 'مؤقتة 6 أشهر',
        issueDate: '2026-02-15',
        expiryDate: '2026-08-15',
        daysRemaining: 16,
        status: 'تحذير' as const,
      },
      {
        id: 'exp-3',
        certificateNumber: 'TA-2023-55102',
        requestNumber: 'REQ-2023-00210',
        applicantName: 'شركة يو للاتصالات (YOU)',
        brandModel: 'Ericsson Radio 4480 B1+B3',
        certificateType: 'رسمية (3 سنوات)',
        issueDate: '2023-08-20',
        expiryDate: '2026-08-19',
        daysRemaining: 20,
        status: 'تحذير' as const,
      },
      {
        id: 'exp-4',
        certificateNumber: 'TA-2026-33901',
        requestNumber: 'REQ-2026-00119',
        applicantName: 'مؤسسة أفق التكنولوجيا للحلول اللاسلكية',
        brandModel: 'MikroTik NetMetal ac²',
        certificateType: 'مؤقتة 3 أشهر',
        issueDate: '2026-05-28',
        expiryDate: '2026-08-28',
        daysRemaining: 29,
        status: 'تحذير' as const,
      },
    ].filter((item) => item.daysRemaining <= thresholdDays);
  }
}

export const certificateService: ICertificateService = new LegacyCertificateAdapter();
