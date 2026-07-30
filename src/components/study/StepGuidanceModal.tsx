/**
 * @file StepGuidanceModal.tsx
 * Regulatory Instructions & Policy Guidance Modal for Study Center steps
 */

import React, { useState } from 'react';
import {
  BookOpen,
  X,
  FileText,
  ShieldAlert,
  UserCheck,
  Mail,
  Phone,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface StepGuidanceModalProps {
  stepNumber: number;
  isOpen: boolean;
  onClose: () => void;
}

const STEP_POLICIES: Record<
  number,
  {
    title: string;
    subtitle: string;
    regulationRef: string;
    objectives: string[];
    policies: string[];
    sopInstructions: string[];
  }
> = {
  1: {
    title: 'السياق وإثبات الهوية والسندات المالية',
    subtitle: 'التعليمات التنظيمية للتحقق من هوية مقدم الطلب والسندات المالية المعتمدة',
    regulationRef: 'القرار الوزاري رقم (42) لسنة 2023 بشأن تنظيم استيراد أجهزة الاتصالات',
    objectives: [
      'التحقق من سريان السجل التجاري والترخيص التجاري لنشاط استيراد وتسويق أجهزة الاتصالات.',
      'التأكد من وجود التوكيل التجاري المعتمد من الشركة المصنعة لمقدم الطلب المحلي.',
      'مطابقة سندات سداد الرسوم المقررة للفحص المبدئي والدراسة الفنية.',
    ],
    policies: [
      'يمنع قبول الطلبات المقدمة من شركات غير مسجلة رسمياً لدى وزارة الصناعة والتجارة.',
      'سندات السداد تصدر حصرياً من البنك المركزي أو الحساب الحكومي المعتمد للوزارة.',
      'عدم تطابق بيانات مقدم الطلب مع السجل التجاري يعد سبباً لرفض الطلب شكلاً.',
    ],
    sopInstructions: [
      'قم بمراجعة رقم السجل التجاري وتاريخ الانتهاء في حقل البيانات العامة.',
      'تأكد من مرفق السند المالي ومطابقة المبلغ للتعرفة الرسمية المقررة.',
      'في حال وجود اختلاف في اسم المستورد، قم بتسجيل نقص شكلي فوراً.',
    ],
  },
  2: {
    title: 'إدارة النواقص والإرساليات الجمركية',
    subtitle: 'السياسة التنظيمية لإخطار الموردين بالنواقص وتتبع مهل الاستيفاء القانونية',
    regulationRef: 'لائحة النواقص والإرساليات الجمركية - المادة (14) الفقرة (ب)',
    objectives: [
      'منح المورد إشعاراً رسمياً موثقاً بالنواقص الفنية أو الشاغرة مع مهلة قانونية.',
      'تتبع الإرساليات الجمركية المعلقة في المنافذ ومطابقة الكميات المصرح بها.',
      'إغلاق النواقص فور استيفاء المستندات المؤيدة من قبل معد الدراسة.',
    ],
    policies: [
      'المهلة المحددة لاستيفاء النواقص هي (14) يوماً تقويمياً من تاريخ الإخطار.',
      'انقضاء المهلة دون تقديم تسويغ مقبول يؤدي تلقائياً لإلغاء الطلب وتحويله للأرشيف.',
      'لا يجوز تعديل حالة النقص إلى (مغلق) إلا بعد رفع المستند الأصلي المطلوب.',
    ],
    sopInstructions: [
      'اختر نوع النقص من القائمة المعتمدة وحدد درجة الخطورة (حرجة / متوسطة / بسيطة).',
      'قم بصياغة نص الملاحظة الموجهة للمستورد بوضوح وبند اللائحة المستند عليه.',
      'تابع حالة الردود في جدول النواقص واعتمد الإغلاق عند المراجعة.',
    ],
  },
  3: {
    title: 'الإحالات والتنسيق مع الجهات السيادية والجمركية',
    subtitle: 'ضوابط التنسيق الخارجي مع هيئات الأمن والجمارك وطيف الترددات',
    regulationRef: 'مذكرة التنسيق المشترك المعتمدة بين وزارة الاتصالات والجهات السيادية',
    objectives: [
      'إحالة الأجهزة ذات الخصائص المشفرة أو الترددات الحساسة للجهات المختصة.',
      'استلام الإفادات الرسمية وحفظها في الأرشيف الإلكتروني للطلب.',
      'مراعاة المهل الزمنية والتنبيهات المجدولة للردود الخارجية.',
    ],
    policies: [
      'تتطلب أجهزة VSAT والترددات العسكرية إحالة وجوبية للأجهزة الأمنية المختصة.',
      'مهلة الاستجابة القياسية للإحالات هي (7) أيام عمل رسمية.',
      'الردود الواردة من طيف الترددات تعد جزءاً لا يتجزأ من القرار الفني النهائي.',
    ],
    sopInstructions: [
      'حدد الجهة المحال إليها والسبب الفني للإحالة مع تحديد مستوى السرية.',
      'أرفق الكتالوج الفني ومواصفات البث اللاسلكي مع خطابات الإحالة.',
      'في حال تأخر الرد لأكثر من 5 أيام، قم بجدولة تنبيه آلي متابعة.',
    ],
  },
  4: {
    title: 'المطابقة الفنية والمعايير الدولية',
    subtitle: 'دليل الفحص الفني والمطابقة لمعايير ETSI / FCC والأمن السيبراني',
    regulationRef: 'الدليل الوطني للمواصفات الفنية والمقاييس لأجهزة الاتصالات',
    objectives: [
      'فحص كتالوج الجهاز والتأكد من مطابقته للمواصفات المعيارية ETSI / IEEE.',
      'مراجعة تقارير الاختبارات المختبرية الصادرة من مختبرات دولية معتمدة (ILAC).',
      'التأكد من خلو الجهاز من البرمجيات الضارة أو ميزات التجسس غير المصرح بها.',
    ],
    policies: [
      'يمنع اعتماد الأجهزة التي لا تحمل شهادة CE أو FCC سارية المفعول.',
      'سقف قدرة البث الإشعاعي (EIRP) للنطاقات المفتوحة هو 20dBm (100mW) ما لم ينص التخصيص على خلاف ذلك.',
      'تقارير السلامة الكهرومغناطيسية (SAR) مطلوبة وجوباً للأجهزة المحمولة ملاصقة للجسم.',
    ],
    sopInstructions: [
      'قارن قدرة البث ونطاق التردد بالجدول الوطني المعتمد.',
      'تحقق من الرقم التسلسلي ورقم الاعتماد الدولي المطبوع على الشاشات والمرفقات.',
      'سجل الملاحظات الفنية المؤيدة للقبول أو الاستبعاد في الجدول الفني.',
    ],
  },
  5: {
    title: 'طيف الترددات والمواصفات الأمنية',
    subtitle: 'سياسة تخصيص ونطاقات طيف الترددات الوطنية واشتراطات الأمن القومي',
    regulationRef: 'الخطة الوطنية لتوزيع الترددات - جمهورية اليمن (National Frequency Plan)',
    objectives: [
      'ضمان عدم حدوث تداخلات كهرومغناطيسية مع الشبكات الوطنية السيادية والمدنية.',
      'التدقيق في النطاقات المترددة وتقنيات التعديل والتشفير المطبقة.',
      'استيفاء شروط الأمن القومي وحماية البنية التحتية الحساسة للاتصالات.',
    ],
    policies: [
      'النطاقات الترددية 2.4GHz و 5.8GHz مسموحة بشرط عدم تجاوز حد القدرة المعتمد.',
      'النطاقات المخصصة للطيران والملاحة البحرية والدفاع محظورة للاستخدام التجاري.',
      'تشفير AES-256 يتطلب تصريحاً أمنياً خاصاً واستخداماً محصوراً بالجهات المصرح لها.',
    ],
    sopInstructions: [
      'قم بإدخال قيمة التردد الأدنى والأعلى بدقة وتقييم نوع الاستخدام.',
      'راجع نتائج مطابقة طيف الترددات الآلية وافحص التنبيهات الملونة.',
      'وثق رأي طيف الترددات وسجل الملاحظة في قسم التوصيات الفنية.',
    ],
  },
  6: {
    title: 'مسودة الرأي والقرار الفني',
    subtitle: 'ضوابط الصياغة القانونية والتسبيب الفني للتوصيات المرفوعة',
    regulationRef: 'دليل الحوكمة وصنع القرار بالمكتب الفني للموافقة النوعية',
    objectives: [
      'صياغة التوصية الفنية النهائية بوضوح وموضوعية استناداً للنتائج الفنية.',
      'تحديد الشروط والقيود الواجب إدراجها في شهادة اعتماد النوع.',
      'رفع التوصية المسببة إلى مدير الإدارة ورئيس المكتب الفني.',
    ],
    policies: [
      'يجب أن تتضمن التوصية تسبيباً فندياً واضحاً يستند للوائح والمعايير.',
      'القرارات بالرفض تتطلب التوقيع المباشر ورأي قانوني مسبب.',
      'لا يجوز تعديل نص التوصية بعد توقيع المستوى القيادي الأول.',
    ],
    sopInstructions: [
      'اختر القرار النهائي (اعتماد / اعتماد مشروط / إعادة للتعديل / رفض).',
      'اكتب التسبيب الفني الشامل مع الإشارة إلى رقم المادة القانونية.',
      'أدرج أي شروط استيراد خاصة (مثل الفحص العشوائي في الجمرك).',
    ],
  },
  7: {
    title: 'منشئ التقرير الفني الرسمي',
    subtitle: 'معايير إعداد وتصدير التقرير الفني وحفظ النسخ الأرشيفية',
    regulationRef: 'اللائحة التنفيذية للتوثيق والتقارير الفنية الرسمية بالوزارة',
    objectives: [
      'توليد التقرير الفني الشامل المترابط متضمناً كافة الفحوصات والشهادات.',
      'طباعة وتصدير التقرير بتنسيق PDF الرسمي مع رمز التتبع QR.',
      'أرشفة التقرير في النظام المركزي للموافقة النوعية.',
    ],
    policies: [
      'التقرير الفني يعتبر وثيقة رسمية سريعة الإثبات أمام المحاكم والجمارك.',
      'يمنع تصدير التقرير الفني دون استيفاء توقيع التوثيق الرقمي.',
      'رمز QR يربط مباشرة بقاعدة بيانات الاستعلام الحكومية عن الاعتماد.',
    ],
    sopInstructions: [
      'راجع كافة المعاينات والتضمينات في مسودة التقرير.',
      'اضغط على زر (معاينة وطباعة التقرير الفني الرسمي PDF).',
      'تأكد من وجود الخاتم والترويسة والرمز التتبعي على المخرجات.',
    ],
  },
  8: {
    title: 'الاعتمادات الإلكترونية وتصدير الشهادة',
    subtitle: 'نظام التسلسل القيادي للاعتمادات والتوقيع الرقمي وإصدار الشهادات',
    regulationRef: 'نظام التوقيع والاعتماد الإلكتروني الحكومي - وزارة الاتصالات',
    objectives: [
      'تتبع سلسلة التوقيع القيادية (معد الدراسة -> مدير الإدارة -> رئيس المكتب الفني).',
      'إصدار شهادة اعتماد النوع الرسمية المزودة بالختم المائي ورمز التحقق.',
      'تفعيل الصلاحية الزمنية للشهادة وتسجيلها في السجل الوطني للأجهزة المعتمة.',
    ],
    policies: [
      'الاعتماد لا يكتمل قانوناً إلا بتوقيع رئيس المكتب الفني (م. وائل صلاح القاسمي).',
      'شهادة اعتماد النوع صالحة لمدة (3) سنوات تقويمية قابلة للتجديد.',
      'يحظر استخدام الشهادة لأجهزة مختلفة عن الموديل والرمز المصرح به.',
    ],
    sopInstructions: [
      'قم بمراجعة ملاحظات المستويات القيادية السابقة وتأمل الملاحظات.',
      'اختر قالب التوقيع الجاهز أو أدخل الملاحظات الاعتمادية الخاصة.',
      'اضغط على (اعتماد التوقيع الرقمي) للانتقال إلى المستوى التالي.',
    ],
  },
};

export const StepGuidanceModal: React.FC<StepGuidanceModalProps> = ({
  stepNumber,
  isOpen,
  onClose,
}) => {
  const { addToast } = useApp();
  const [copiedContact, setCopiedContact] = useState(false);

  if (!isOpen) return null;

  const policy = STEP_POLICIES[stepNumber] || STEP_POLICIES[1];

  const handleCopyContact = () => {
    const contactInfo = `م. وائل صلاح القاسمي - رئيس المكتب الفني
وزارة الاتصالات وتقنية المعلومات - جمهورية اليمن
المكتب المباشر: ext 101 | البريد الإلكتروني: w.alqasemi@mtit.gov.ye | هاتف: +967 1 234567`;
    navigator.clipboard.writeText(contactInfo);
    setCopiedContact(true);
    addToast({
      type: 'success',
      title: 'نسخ بيانات التواصل',
      message: 'تم نسخ بيانات التواصل مع رئيس المكتب الفني إلى الحافظة بنجاح.',
    });
    setTimeout(() => setCopiedContact(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
        {/* Modal Header */}
        <div className="bg-slate-900 text-slate-100 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-amber-500 text-slate-950 font-extrabold px-2 py-0.5 rounded">
                  الخطوة {stepNumber}
                </span>
                <h3 className="font-extrabold text-sm text-slate-100">{policy.title}</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{policy.subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs text-slate-700 dark:text-slate-300 max-h-[70vh] overflow-y-auto">
          {/* Reference Legal Regulation */}
          <div className="bg-blue-50 dark:bg-blue-950/40 p-3.5 rounded-xl border border-blue-200 dark:border-blue-800/60 flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-blue-900 dark:text-blue-200 block text-xs">
                المرجع التنظيمي والقرار الوزاري المعتمد:
              </span>
              <p className="text-blue-800 dark:text-blue-300 font-semibold mt-0.5">
                {policy.regulationRef}
              </p>
            </div>
          </div>

          {/* Section Objectives */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>الأهداف التشغيلية لهذا الجزء من المراجعة:</span>
            </h4>
            <ul className="space-y-1.5 pr-4 list-disc marker:text-amber-500">
              {policy.objectives.map((item, idx) => (
                <li key={idx} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Regulatory Rules & Constraints */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>السياسات والاشتراطات التنظيمية الملزمة:</span>
            </h4>
            <div className="space-y-1.5">
              {policy.policies.map((pol, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 rounded-lg text-rose-900 dark:text-rose-200 leading-relaxed font-medium"
                >
                  🛑 {pol}
                </div>
              ))}
            </div>
          </div>

          {/* Reviewer Action Steps */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-500" />
              <span>خطوات الإجراءات الموصى بها للمراجع الفني (SOP):</span>
            </h4>
            <div className="space-y-1.5">
              {policy.sopInstructions.map((sop, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg flex items-start gap-2"
                >
                  <span className="w-5 h-5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold rounded-full flex items-center justify-center shrink-0 text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed font-semibold text-slate-800 dark:text-slate-200">
                    {sop}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Head of Technical Office Contact Box */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-slate-100 p-4 rounded-xl border border-slate-700 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span className="font-extrabold text-xs text-amber-300">
                  للاستفسارات التنظيمية العاجلة والحالات الاستثنائية
                </span>
              </div>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40 font-bold">
                رئيس المكتب الفني
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="font-extrabold text-slate-100 text-sm">
                م. وائل صلاح القاسمي - رئيس المكتب الفني
              </div>
              <p className="text-slate-400 text-[11px]">
                وزارة الاتصالات وتقنية المعلومات - الإدارة العامة للموافقة النوعية
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-slate-300 pt-1">
              <div className="flex items-center gap-1.5 bg-slate-800/90 p-2 rounded border border-slate-700">
                <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>المكتب المباشر: ext 101 / +967 1 234567</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/90 p-2 rounded border border-slate-700">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>w.alqasemi@mtit.gov.ye</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={handleCopyContact}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-lg text-xs flex items-center gap-1.5 transition"
              >
                {copiedContact ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedContact ? 'تم النسخ' : 'نسخ بيانات التواصل'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 dark:bg-slate-900/90 px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-500 text-[11px]">
            دليل السياسات التنفيذية • وزارة الاتصالات وتقنية المعلومات
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 font-bold text-slate-800 dark:text-slate-200 rounded-lg transition"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
};
