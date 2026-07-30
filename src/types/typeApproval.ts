/**
 * @file typeApproval.ts
 * Type definitions for Ministry of Telecommunications & IT (Yemen)
 * Type Approval Study & Technical Review Center
 */

export type RequestStatus =
  | 'جديد'
  | 'قيد_دراسة_المستندات'
  | 'قيد_إعداد_الدراسة_الفنية'
  | 'بانتظار_الاستكمال'
  | 'بانتظار_إفادة_الترددات'
  | 'بانتظار_التنسيق_الأمني'
  | 'جاهزة_للمراجعة_الفنية'
  | 'جاهزة_للاعتماد'
  | 'معتمدة'
  | 'مرفوضة'
  | 'معلقة';

export type StepStatus =
  | 'لم_تبدأ'
  | 'قيد_العمل'
  | 'تحتاج_استكمالاً'
  | 'بانتظار_رد'
  | 'جاهزة_للمراجعة'
  | 'معتمدة'
  | 'معادة_للتعديل'
  | 'مقفلة';

export type PriorityLevel = 'عادية' | 'عالية' | 'حرجة' | 'طوارئ';

export type MatchStatus = 'متطابق' | 'اختلاف_بسيط' | 'يحتاج_توضيحاً' | 'تعارض_جوهري' | 'غير_متوفر';

export type SpectrumStatus =
  | 'لا_يحتاج_إحالة'
  | 'يحتاج_مراجعة'
  | 'محال'
  | 'بانتظار_الإفادة'
  | 'متوافق'
  | 'متوافق_بشروط'
  | 'غير_متوافق';

export type SecurityStatus =
  | 'لا_يتطلب'
  | 'يتطلب'
  | 'محال'
  | 'بانتظار_الإفادة'
  | 'موافق'
  | 'موافق_بشروط'
  | 'اعتراض';

export type DeficiencySeverity = 'طفيف' | 'متوسط' | 'حرج' | 'مانع_للاعتماد';

export type DeficiencyStatus = 'مفتوح' | 'بانتظار_المستثمر' | 'مستلم_قيد_المراجعة' | 'مغلق' | 'ملغى';

export type ReferralStatus = 'جديدة' | 'قيد_الدراسة' | 'تمت_الإفادة' | 'يتطلب_توضيحاً_إضافياً';

export type FinalDecision =
  | 'موافقة'
  | 'موافقة_بشروط'
  | 'موافقة_مؤقتة'
  | 'طلب_استكمال'
  | 'تعليق'
  | 'إعادة_للمراجعة'
  | 'رفض'
  | 'إحالة_إضافية';

export type CertificateType = 'شهادة_مؤقتة' | 'شهادة_نهائية' | 'إعادة_إصدار' | 'بدل_فاقد' | 'تعليق' | 'إلغاء';

export interface ApplicantInfo {
  name: string;
  crNumber: string; // سجل تجاري
  taxNumber: string;
  address: string;
  city: string;
  contactPerson: string;
  phone: string;
  email: string;
}

export interface LocalRepresentative {
  companyName: string;
  authNumber: string;
  authValidity: string;
  contactPerson: string;
  phone: string;
  email: string;
}

export interface ManufacturerInfo {
  companyName: string;
  country: string;
  website: string;
  factoryAddress: string;
  qualityCertificates: string[]; // ISO 9001, CE, FCC, etc.
}

export interface DocumentItem {
  id: string;
  docType: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  readStatus: 'مقروء' | 'غير_مقروء';
  matchStatus: MatchStatus;
  totalPages: number;
  notes: string;
  fileUrl?: string;
  contentCategory?: string;
}

export interface ComparisonRow {
  fieldKey: string;
  fieldName: string;
  requestFormVal: string;
  complianceCertVal: string;
  testReportVal: string;
  datasheetVal: string;
  userManualVal: string;
  photosVal: string;
  authLetterVal: string;
  status: MatchStatus;
  confirmedValue?: string;
  notes?: string;
}

export interface FrequencyBand {
  id: string;
  startFreq: string;
  endFreq: string;
  unit: 'MHz' | 'GHz' | 'kHz';
  bandwidth: string;
  txPower: string;
  eirp: string;
  antennaType: string;
  antennaGain: string;
  modulation: string;
  dutyCycle: string;
  channelSpacing: string;
  environment: 'داخلي' | 'خارجي' | 'كلاهما';
  complianceStatus: 'مطابق_للطيف_الوطني' | 'يحتاج_ترخيص_خاص' | 'محظور';
}

export interface DeficiencyItem {
  id: string;
  type: string;
  description: string;
  source: string;
  severity: DeficiencySeverity;
  isBlocking: boolean;
  responsibleEntity: string;
  requestDate: string;
  deadline: string;
  status: DeficiencyStatus;
  responseNote?: string;
  closureDecisionNote?: string;
  resolutionDate?: string;
}

export interface ReferralItem {
  id: string;
  targetEntity: string; // مثل: إدارة طيف الترددات، الأمن السيبراني
  topic: string;
  questions: string[];
  attachments: string[];
  referralDate: string;
  deadline: string;
  status: ReferralStatus;
  responseDetails?: string;
  responseImpact?: string;
  approvedDate?: string;
}

export interface ApprovalLevel {
  level: number;
  roleName: string;
  userName: string;
  title: string;
  status: 'معتمد' | 'بانتظار_المراجعة' | 'معاد_للتعديل' | 'لم_يصل_بعد';
  date?: string;
  notes?: string;
  signatureUrl?: string;
}

export interface FeeAndGuarantee {
  feeType: string;
  amount: number;
  currency: 'YER' | 'USD';
  paymentStatus: 'مدفوع' | 'غير_مدفوع' | 'معفى';
  receiptNumber: string;
  hasGuaranteeCheck: boolean;
  guaranteeCheckNumber?: string;
  guaranteeAmount?: number;
  guaranteeExpiryDate?: string;
}

export interface TypeApprovalRequest {
  id: string;
  requestNumber: string; // MTIT-TA-2026-013077
  applicant: ApplicantInfo;
  localRep: LocalRepresentative;
  manufacturer: ManufacturerInfo;
  brand: string; // EXACOM
  model: string; // XR-5000
  deviceName: string; // جهاز ربط لاسلكي خارجي
  equipmentType: string;
  hardwareVersion: string;
  softwareVersion: string;
  status: RequestStatus;
  priority: PriorityLevel;
  assignedReviewer: string;
  completionPercentage: number;
  submissionDate: string;
  lastUpdated: string;
  targetCompletionDate: string;

  // Documents
  documents: DocumentItem[];

  // Data consistency
  dataMatrix: ComparisonRow[];

  // Technical
  powerSource: string;
  protectionDegree: string; // IP67
  operatingEnv: string;
  standards: string[];
  testReportNo: string;
  testReportIssuer: string;
  frequencyBands: FrequencyBand[];
  spectrumStatus: SpectrumStatus;
  spectrumNotes?: string;
  securityStatus: SecurityStatus;
  securityNotes?: string;

  // Deficiencies & Referrals
  deficiencies: DeficiencyItem[];
  referrals: ReferralItem[];

  // Study text
  initialStudyContent: {
    requestContext: string;
    deviceDefinition: string;
    intendedUse: string;
    reviewedDocumentsSummary: string;
    dataConsistencySummary: string;
    technicalSpecsSummary: string;
    spectrumAnalysisSummary: string;
    standardsAndTestingSummary: string;
    risksAndConstraints: string;
    securityCoordinationSummary: string;
    deficienciesAndReferralsStatus: string;
    technicalAnalysis: string;
    conclusion: string;
    initialRecommendation: string;
  };

  // Technical Opinion
  technicalOpinion: {
    facts: string;
    verifiedTechnicalFindings: string;
    spectrumDecisionText: string;
    securityDecisionText: string;
    closedDeficienciesSummary: string;
    openDeficienciesSummary: string;
    technicalBasis: string;
    regulatoryBasis: string;
    risks: string;
    conditions: string[];
    finalRecommendation: FinalDecision;
    decisionJustification: string;
  };

  // Workflow step statuses
  stepStatuses: {
    step1: StepStatus;
    step2: StepStatus;
    step3: StepStatus;
    step4: StepStatus;
    step5: StepStatus;
    step6: StepStatus;
    step7: StepStatus;
    step8: StepStatus;
  };

  // Approvals & Certificate
  approvals: ApprovalLevel[];
  feesAndGuarantee: FeeAndGuarantee;
  certificateNumber?: string;
  certificateIssueDate?: string;
  certificateExpiryDate?: string;
  certificateType?: CertificateType;
  certificateStatus?: 'صالحة' | 'مسودة' | 'معلقة' | 'ملغاة';
}

export interface AuditLogEntry {
  id: string;
  userName: string;
  userRole: string;
  action: string;
  department: string;
  previousValue: string;
  newValue: string;
  timestamp: string;
  ipAddress: string;
  reason: string;
  details: string;
  requestNumber?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  fullName: string;
  title: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  permissions: string[];
  status: 'نشط' | 'غير_نشط';
  lastLogin: string;
  assignedRequestsCount: number;
}

export interface TaskItem {
  id: string;
  title: string;
  requestNumber: string;
  category: 'استكمال نقص' | 'إفادة ترددية' | 'تنسيق أمني' | 'صياغة تقرير' | 'تحصيل رسوم';
  assignedUser: string;
  assignedDept: string;
  deadline: string;
  regulatoryTimeframe: string;
  priority: 'حرج' | 'مرتفع' | 'متوسط';
  status: 'قيد_المتابعة' | 'مكتمل' | 'متأخر' | 'بانتظار_الرد';
  reminderScheduled: boolean;
  reminderThresholdHours: number;
  lastNotificationSent?: string;
}
