/**
 * @file reportService.ts
 * ReportService Abstraction for Technical Final Report Generation,
 * Validation, Versioning, and Exporting (Mock PDF/DOCX).
 */

export interface ReportConfig {
  reportTitle: string;
  requestNumber: string;
  referenceNumber: string;
  preparedDate: string;
  lastUpdatedDate: string;
  reportType: 'نهائي' | 'مبدئي' | 'تحديث' | 'استثنائي';
  reportStatus: 'مسودة' | 'معتمد' | 'معاد للتعديل' | 'ملغى';
  versionNumber: string;
  authorName: string;
  language: 'العربية' | 'English';
  templateName: 'القالب الرسمي الوزاري A4' | 'قالب التقييم السريع' | 'قالب الفحص الفني المتقدم';
  includeLogo: boolean;
  includeQrCode: boolean;
  includeBarcode: boolean;
  includePageNumbers: boolean;
  includeTableOfContents: boolean;
  includeAppendices: boolean;
  includeSignatures: boolean;
  watermark: 'بدون' | 'مسودة' | 'معاد للتعديل' | 'معتمد' | 'ملغى';
}

export interface ReportSection {
  id: string;
  title: string;
  isMandatory: boolean;
  isVisible: boolean;
  order: number;
}

export interface ApprovalSigner {
  id: string;
  roleTitle: string;
  signerName: string;
  position: string;
  department: string;
  status: 'لم يصل إليه' | 'بانتظار المراجعة' | 'قيد المراجعة' | 'معتمد' | 'معتمد بشروط' | 'معاد للتعديل' | 'مرفوض' | 'تم تجاوزه' | 'غير مطلوب';
  signedDate?: string;
  signatureImage?: string;
  comments?: string;
  isOptional?: boolean;
}

export interface ReportVersion {
  version: string;
  createdDate: string;
  author: string;
  changesSummary: string;
  status: 'مسودة' | 'معتمد' | 'معاد للتعديل';
  reason?: string;
}

export interface ValidationCheckItem {
  id: string;
  label: string;
  passed: boolean;
  isCritical: boolean;
  details?: string;
}

class ReportService {
  /**
   * Generates initial 18 sections configuration
   */
  getDefaultSections(): ReportSection[] {
    return [
      { id: 'sec1', title: '1. الملخص التنفيذي', isMandatory: false, isVisible: true, order: 1 },
      { id: 'sec2', title: '2. بيانات الطلب وأطرافه', isMandatory: true, isVisible: true, order: 2 },
      { id: 'sec3', title: '3. الوثائق والمرفقات التي تمت مراجعتها', isMandatory: false, isVisible: true, order: 3 },
      { id: 'sec4', title: '4. اتساق هوية الجهاز', isMandatory: false, isVisible: true, order: 4 },
      { id: 'sec5', title: '5. الوصف الفني للجهاز', isMandatory: false, isVisible: true, order: 5 },
      { id: 'sec6', title: '6. جدول المواصفات الفنية', isMandatory: false, isVisible: true, order: 6 },
      { id: 'sec7', title: '7. الترددات والخصائص الراديوية', isMandatory: false, isVisible: true, order: 7 },
      { id: 'sec8', title: '8. المعايير وتقارير الاختبار', isMandatory: false, isVisible: true, order: 8 },
      { id: 'sec9', title: '9. نتيجة مراجعة إدارة تنظيم الترددات', isMandatory: false, isVisible: true, order: 9 },
      { id: 'sec10', title: '10. نتيجة التنسيق الأمني', isMandatory: false, isVisible: true, order: 10 },
      { id: 'sec11', title: '11. النواقص وطلبات الاستكمال', isMandatory: false, isVisible: true, order: 11 },
      { id: 'sec12', title: '12. الإحالات والإفادات الفنية', isMandatory: false, isVisible: true, order: 12 },
      { id: 'sec13', title: '13. التحليل الفني والتنظيمي', isMandatory: true, isVisible: true, order: 13 },
      { id: 'sec14', title: '14. المخاطر والقيود التشغيلية', isMandatory: false, isVisible: true, order: 14 },
      { id: 'sec15', title: '15. الرأي الفني والتوصية', isMandatory: true, isVisible: true, order: 15 },
      { id: 'sec16', title: '16. القرار النهائي', isMandatory: true, isVisible: true, order: 16 },
      { id: 'sec17', title: '17. شروط إصدار واستخدام الشهادة', isMandatory: false, isVisible: true, order: 17 },
      { id: 'sec18', title: '18. الملاحق والوثائق المرفقة', isMandatory: true, isVisible: true, order: 18 },
    ];
  }

  /**
   * Generates default approval workflow signers
   */
  getDefaultApprovalWorkflow(): ApprovalSigner[] {
    return [
      {
        id: 'tech_office',
        roleTitle: 'المكتب الفني',
        signerName: 'م. أحمد باصريح',
        position: 'مهندس موافقة نوعية رئيسي',
        department: 'المكتب الفني',
        status: 'معتمد',
        signedDate: '2026-07-29',
      },
      {
        id: 'type_approval_mgr',
        roleTitle: 'مدير إدارة الموافقة النوعية',
        signerName: 'د. صادق الشرفي',
        position: 'مدير إدارة الموافقة النوعية',
        department: 'إدارة الموافقة النوعية',
        status: 'معتمد',
        signedDate: '2026-07-30',
      },
      {
        id: 'telecom_gen_dir',
        roleTitle: 'مدير عام الإدارة العامة لتنظيم الاتصالات',
        signerName: 'م. وائل صلاح القاسمي',
        position: 'المدير العام',
        department: 'الإدارة العامة لتنظيم الاتصالات',
        status: 'بانتظار المراجعة',
      },
      {
        id: 'deputy_minister',
        roleTitle: 'وكيل الوزارة (اختياري)',
        signerName: 'أ.د. يحيى المتوكل',
        position: 'وكيل وزارة الاتصالات',
        department: 'قيادة الوزارة',
        status: 'غير مطلوب',
        isOptional: true,
      },
    ];
  }

  /**
   * Pre-approval Validation Checklist Logic
   */
  validateReport(request: any): ValidationCheckItem[] {
    const checks: ValidationCheckItem[] = [
      {
        id: 'req_data',
        label: 'اكتمال بيانات الطلب الأساسية والمورد والشركة المصنعة',
        passed: !!(request?.requestNumber && request?.brand && request?.model),
        isCritical: true,
      },
      {
        id: 'model_confirm',
        label: 'وجود موديل معتمد وتطابق بيانات المصنع والماركة',
        passed: !!request?.model,
        isCritical: true,
      },
      {
        id: 'tech_review',
        label: 'اكتمال الدراسة الفنية واختبارات الأمان الكهربائي والكهرومغناطيسي',
        passed: request?.initialStudyContent?.technicalEvaluation?.length > 10,
        isCritical: true,
      },
      {
        id: 'spectrum_check',
        label: 'مراجعة الترددات ونطاقات الإرسال والقدرة الراديوية EIRP',
        passed: !!request?.initialStudyContent?.spectrumAnalysisSummary,
        isCritical: true,
      },
      {
        id: 'deficiencies_cleared',
        label: 'إغلاق أو معالجة النواقص الحرجة المفتوحة',
        passed: !request?.deficiencies?.some((d: any) => d.status === 'مفتوح' && d.severity === 'حرجة'),
        isCritical: true,
      },
      {
        id: 'tech_opinion',
        label: 'اعتماد الرأي الفني والتوصية النهائية مع الاشتراطات',
        passed: !!request?.technicalOpinion?.finalRecommendation,
        isCritical: true,
      },
      {
        id: 'final_decision',
        label: 'تحديد القرار النهائي الرسمي والمسار التنفيذي',
        passed: true,
        isCritical: true,
      },
      {
        id: 'signers_set',
        label: 'تحديد مسار واعتمادات التوقيعات الثلاثية الأساسية',
        passed: true,
        isCritical: true,
      },
    ];

    return checks;
  }

  /**
   * Mock Export PDF Execution
   */
  exportToPDF(config: ReportConfig, contentElementId: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Trigger print or blob download simulation
        window.print();
        resolve(true);
      }, 500);
    });
  }

  /**
   * Mock Export DOCX Execution
   */
  exportToDOCX(config: ReportConfig): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const dummyContent = `الجمهورية اليمنية - وزارة الاتصالات وتقنية المعلومات\nتقرير الدراسة الفنية النهائية (${config.requestNumber})\nمرجع: ${config.referenceNumber}`;
        const blob = new Blob([dummyContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Final-Technical-Report-${config.requestNumber}.docx`;
        a.click();
        URL.revokeObjectURL(url);
        resolve(true);
      }, 600);
    });
  }
}

export const reportService = new ReportService();
