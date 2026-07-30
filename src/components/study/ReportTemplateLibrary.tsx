/**
 * @file ReportTemplateLibrary.tsx
 * Field Inspection Report Template Library (وحدة قوالب تقارير الفحص الميداني)
 * Allows reviewers to choose pre-formatted field inspection templates auto-filled with
 * device specs, applicant info, and frequency parameters for rapid visit documentation.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileCode,
  Sparkles,
  CheckCircle2,
  Copy,
  Printer,
  Download,
  Building,
  Radio,
  UserCheck,
  Calendar,
  Layers,
  ShieldCheck,
  FileText,
  Zap,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export interface InspectionTemplate {
  id: string;
  title: string;
  category: 'ميداني_قياسي' | 'قدرة_وانبعاثات' | 'توافق_كهرومغناطيسي' | 'منافذ_جمركية' | 'شبكات_خاصة';
  description: string;
  standardReference: string;
  recommendedFor: string;
  defaultConclusion: string;
  inspectionChecklist: string[];
}

const REPORT_TEMPLATES: InspectionTemplate[] = [
  {
    id: 'tpl-field-std',
    title: 'قالب تقرير الفحص والمعاينة الميدانية القياسي',
    category: 'ميداني_قياسي',
    description: 'نموذج شامل لفحص الموقع، مطابقة النطاق الترددي، واختبار السلامة الإشعاعية للجهاز الميداني.',
    standardReference: 'القرار الوزاري رقم (42) لسنة 2022 - المادة 8 (إجراءات المعاينة)',
    recommendedFor: 'أجهزة المحطات اللاسلكية، أجهزة الربط الميكروويفي، والمقسّمات المحلية.',
    defaultConclusion: 'تأكد فريق المعاينة الميدانية من مطابقة أبعاد وتجهيزات الجهاز مع البيانات المرفقة بالطلب، ولم تسجل أية قراءات تتجاوز الحدود المسموح بها كهرومغناطيسياً.',
    inspectionChecklist: [
      'التحقق الميداني من الرقم التسلسلي (Serial Number) ومطابقته للوحة الجهاز',
      'قياس شدة التغطية ونطاق التردد المستعمل أثنـاء التشغيل التجريبي',
      'فحص نظام التأريض والوقاية من الصواعق بالموقع',
      'التأكد من وضع ملصق الشفرة الرقمية الموحدة وتسمية المنافذ',
    ],
  },
  {
    id: 'tpl-eirp-power',
    title: 'قالب تقرير قياس القدرة المشعة EIRP والانبعاثات',
    category: 'قدرة_وانبعاثات',
    description: 'قالب قياس دقيق لمستويات القدرة المشعة المكافئة وخفض التداخل الراديوي التوافقي.',
    standardReference: 'لائحة تنظيم طيف الترددات الوطنية (NFAP-2025) - البند 4.2',
    recommendedFor: 'أجهزة البث الراديوي، أجهزة الوايفاي المتقدمة Wi-Fi 6E/7، والهواتف الثابتة اللاسلكية.',
    defaultConclusion: 'أظهرت القراءات المختبرية قياس قدرة EIRP بمستوى يقع ضمن الحد الأقصى المسموح به قانونياً دون تسجيل أية انبعاثات جانبية ضارة (Spurious Emissions).',
    inspectionChecklist: [
      'ربط محلل الطيف الترددي (Spectrum Analyzer) ومعايرة الكابلات',
      'قياس قدرة الخرج الفعلية عند أقصى ضغط تشغيلي (Peak Power Output)',
      'فحص الترددات التوافقية الثانوية التأثير على النطاقات المجاورة',
      'تسجيل مستوى الشدة الكهرومغناطيسية عند مسافة 1 متر و5 أمتار',
    ],
  },
  {
    id: 'tpl-emc-compat',
    title: 'قالب اختبار التوافق الكهرومغناطيسي والسلامة (EMC)',
    category: 'توافق_كهرومغناطيسي',
    description: 'قالب لتوثيق قياسات الحصانة الضوئية والكهرومغناطيسية وتأثير الحقول على الأجهزة المجاورة.',
    standardReference: 'المواصفة الدولية ISO/IEC 17025 ومعيار السلامة الإشعاعية ICNIRP',
    recommendedFor: 'الأجهزة الطبية اللاسلكية، الأنظمة الإلكترونية الصناعية، وأجهزة الملاحة الجوية والحرجة.',
    defaultConclusion: 'أثبت اختبار التوافق الكهرومغناطيسي حصانة الجهاز ضد التداخلات الخارجية وعدم تأثيره سلباً على أجهزة الاتصال الحساسة المجاورة.',
    inspectionChecklist: [
      'اختيار غرف الفحص المعزولة (Anechoic Chamber) أو الموقع الهادئ راديوياً',
      'قياس مستويات التداخل الحثي والسعوي عبر خطوط التغذية الكهربائية',
      'اختبار الحصانة ضد التفريغ الكهرومغناطيسي الكهروساكن (ESD Test)',
      'فحص درجات الحرارة والتهوية أثناء التشغيل لمدة 60 دقيقة متواصلة',
    ],
  },
  {
    id: 'tpl-customs-entry',
    title: 'قالب معايرة المطابقة السريعة بالمنافذ الجمركية',
    category: 'منافذ_جمركية',
    description: 'تقرير فحص مباشر ومعاينة ظاهرية للشحنات المستوردة بالمنافذ الجمركية الجوية والبحرية.',
    standardReference: 'دليل إجراءات الإفراج الجمركي الموحد لوزارة الاتصالات - المادة 14',
    recommendedFor: 'الشحنات المستوردة بالمنافذ البرية والبحرية والجوية (الإفراج المؤقت أو الدائم).',
    defaultConclusion: 'تم معاينة العينة العشوائية للشحنة بالمنافذ الجمركية وتبين تطابق العينة بنسبة 100% مع مواصفات طراز الاعتماد النوعي الصادر.',
    inspectionChecklist: [
      'فحص سلامة الأغلفة والكراتين الأصلية والعلامات التجارية',
      'مطابقة شفرات الماك Barcode ورقم طراز الشحنة مع أوراق البيان الجمركي',
      'التأكد من إرفاق كتيبات التشغيل باللغة العربية مع كل وحدة',
      'سحب عينة عشوائية لاختبار التشغيل الأولي بالمختبر الجمركي',
    ],
  },
];

export const ReportTemplateLibrary: React.FC = () => {
  const { currentRequest, addToast, addAuditLog } = useApp();

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(REPORT_TEMPLATES[0].id);

  // Form Fields Auto-Filled from Current Request Context
  const [inspectorName, setInspectorName] = useState<string>('م. عبدالجليل حميد');
  const [inspectionSite, setInspectionSite] = useState<string>('مختبر الفحص المركزي - صنعاء');
  const [inspectionDate, setInspectionDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );
  const [overallResult, setOverallResult] = useState<'مطابق_لكافة_المواصفات' | 'مطابق_بشروط' | 'غير_مطابق'>(
    'مطابق_لكافة_المواصفات'
  );
  const [customNotes, setCustomNotes] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const activeTemplate = REPORT_TEMPLATES.find((t) => t.id === selectedTemplateId) || REPORT_TEMPLATES[0];

  // Auto-filled device fields string generator
  const generatedReportText = `===============================================================
          تقرير المعاينة والفحص الميداني التلقائي
  جمهورية اليمن - وزارة الاتصالات وتقنية المعلومات
===============================================================

[1] بيانات الطلب والجهاز الميداني:
---------------------------------------------------------------
رقم طلب الاعتماد: ${currentRequest.requestNumber}
اسم الشحنة / الجهاز: ${currentRequest.deviceInfo.deviceName} (${currentRequest.deviceInfo.commercialName})
رقم الطراز (Model): ${currentRequest.deviceInfo.modelNumber}
الشركة المصنعة: ${currentRequest.deviceInfo.manufacturerName} (${currentRequest.deviceInfo.originCountry})
الشركة المستوردة: ${currentRequest.applicant.companyName}
النطاق الترددي المعتمد: ${currentRequest.deviceInfo.operatingFrequencies}
أقصى قدرة مشعة (EIRP): ${currentRequest.deviceInfo.maxPowerEirp}

[2] معلومات الزيرة الميدانية والمعايرة:
---------------------------------------------------------------
اسم المفتش الفني: ${inspectorName}
موقع الفحص / المختبر: ${inspectionSite}
تاريخ تنفيذ المعاينة: ${inspectionDate}
نوع القالب الفني: ${activeTemplate.title}
المرجع التنظيمي: ${activeTemplate.standardReference}

[3] نتائج بنود قائمة التدقيق القياسية (Checklist):
---------------------------------------------------------------
${activeTemplate.inspectionChecklist.map((item, idx) => `  [✓] بند ${idx + 1}: ${item} (تم الفحص والاختبار)`).join('\n')}

[4] التقييم والخلاصة الميدانية:
---------------------------------------------------------------
النتيجة العامة: ${overallResult.replace(/_/g, ' ')}
الخلاصة الميدانية:
${activeTemplate.defaultConclusion}

${customNotes ? `ملاحظات إضافية من المفتش:\n${customNotes}\n` : ''}
---------------------------------------------------------------
توقيع مهندس الفحص الميداني: ${inspectorName}
ختم وحدة المعاينة الميدانية - وزارة الاتصالات
===============================================================`;

  const handleCopyReportText = () => {
    navigator.clipboard.writeText(generatedReportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);

    addToast({
      type: 'success',
      title: 'تم نسخ نص تقرير الفحص',
      message: 'تم نسخ التقرير المكتمل التعبئة الموحد إلى الحافظة بنجاح.',
    });
  };

  const handleApplyReport = () => {
    addToast({
      type: 'success',
      title: 'تم اعتماد تقرير الفحص الميداني',
      message: `تم توليد وربط تقرير (${activeTemplate.title}) بالطلب (${currentRequest.requestNumber}).`,
    });

    addAuditLog({
      userName: inspectorName,
      userRole: 'مهندس فحص ميداني',
      action: 'توليد تقرير فحص ميداني من مكتبة القوالب الجاهزة',
      department: 'وحدة المعايرة الفنية',
      previousValue: 'بدون تقرير معتمد',
      newValue: activeTemplate.title,
      reason: `تعبئة تلقائية لبيانات الجهاز ${currentRequest.deviceInfo.deviceName}`,
      details: `النتيجة: ${overallResult} | الموقع: ${inspectionSite}`,
      requestNumber: currentRequest.requestNumber,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4 font-sans text-xs">
      {/* Top Banner Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 rounded-xl">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>مكتبة قوالب تقارير الفحص الميداني التلقائية (Report Template Library)</span>
              <span className="px-2 py-0.5 bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded-full text-[10px] font-extrabold border border-amber-200 dark:border-amber-800">
                تعبئة تلقائية Auto-Fill
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              اختيار نموذج جاهز ومزود ببيانات الجهاز ({currentRequest.deviceInfo.deviceName}) لتوثيق الزيارات بسرعة ودقة
            </p>
          </div>
        </div>

        <button
          onClick={handleApplyReport}
          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs transition flex items-center gap-1.5 shadow-xs"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>اعتماد وتصدير تقرير الفحص التلقائي</span>
        </button>
      </div>

      {/* Main Grid: Template Cards Selection vs Auto-Filled Report Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Side: Template Selector Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <span className="font-extrabold text-slate-700 dark:text-slate-300 text-[11px] block flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-blue-500" />
            <span>اختر نموذج الفحص المناسب لنوع الجهاز والموقع:</span>
          </span>

          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1 custom-scrollbar">
            {REPORT_TEMPLATES.map((tpl) => {
              const isSelected = tpl.id === selectedTemplateId;

              return (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplateId(tpl.id)}
                  className={`p-3 rounded-xl border transition cursor-pointer relative space-y-1.5 ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/30'
                      : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                      ) : (
                        <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <span>{tpl.title}</span>
                    </h5>

                    <span className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[9px] font-bold rounded">
                      {tpl.category.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {tpl.description}
                  </p>

                  <div className="text-[9px] text-slate-500 font-mono pt-1 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                    <span>مخصص لـ: {tpl.recommendedFor}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Form Customization & Live Preview (7 Cols) */}
        <div className="lg:col-span-7 space-y-3 bg-slate-50/60 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          {/* Form Quick Editors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pb-3 border-b border-slate-200 dark:border-slate-700">
            <div>
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                اسم المفتش المسؤول:
              </label>
              <input
                type="text"
                value={inspectorName}
                onChange={(e) => setInspectorName(e.target.value)}
                className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-bold text-xs"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                موقع / مختبر الفحص:
              </label>
              <input
                type="text"
                value={inspectionSite}
                onChange={(e) => setInspectionSite(e.target.value)}
                className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-bold text-xs"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                نتيجة الفحص الميداني:
              </label>
              <select
                value={overallResult}
                onChange={(e) => setOverallResult(e.target.value as any)}
                className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-bold text-xs"
              >
                <option value="مطابق_لكافة_المواصفات">مطابق لكافة المواصفات</option>
                <option value="مطابق_بشروط">مطابق بشروط تشغيلية</option>
                <option value="غير_مطابق">غير مطابق (تجاوز الحدود)</option>
              </select>
            </div>
          </div>

          {/* Auto-filled Preview Header */}
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>معاينة نص التقرير المعبأ تلقائياً (Auto-Generated Preview):</span>
            </span>

            <button
              onClick={handleCopyReportText}
              className="px-2.5 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold rounded-lg text-[10px] transition flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم النسخ' : 'نسخ التقرير الكامل'}</span>
            </button>
          </div>

          {/* Pre-Formatted Document Text Preview */}
          <div className="bg-slate-950 text-emerald-400 font-mono text-[10px] p-3.5 rounded-xl border border-slate-800 h-64 overflow-y-auto leading-relaxed custom-scrollbar whitespace-pre-wrap select-all shadow-inner dir-ltr text-left">
            {generatedReportText}
          </div>

          {/* Additional Notes Field */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block">
              إضافة ملاحظات وتوصيات خاصة بمهندس الفحص الميداني:
            </label>
            <input
              type="text"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="مثال: يوصى بضبط مستوى قدرة الهوائي عند التركيب النهائي بالمناطق المأهولة..."
              className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-sans text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
