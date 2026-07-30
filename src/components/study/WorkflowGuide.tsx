/**
 * @file WorkflowGuide.tsx
 * Interactive Workflow Guide Component for new reviewers in Study Center.
 * Guides new reviewers through the 8-step request processing lifecycle,
 * tracking real-time completion status for each step with interactive checklists and guidance tips.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { STUDY_STEPS } from '../../constants/theme';
import { StepStatus } from '../../types/typeApproval';
import { StatusBadge } from '../common/StatusBadge';
import {
  Compass,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Sparkles,
  ShieldCheck,
  FileText,
  Lightbulb,
  CheckSquare,
  X,
  Play,
  Award,
} from 'lucide-react';

export interface GuideStepDetail {
  id: number;
  title: string;
  subtitle: string;
  objective: string;
  keyChecklist: string[];
  reviewerTips: string;
  requiredAttachments: string[];
  regulatoryReference: string;
}

const GUIDE_DETAILS: GuideStepDetail[] = [
  {
    id: 1,
    title: 'جمع البيانات الأولية والمستندات',
    subtitle: 'التحقق من اكتمال هوية مقدم الطلب، ملف الوكالة التجاري، والمواصفات الفنية المرفقة',
    objective: 'التأكد من أن ملف الطلب يحتوي على جميع الوثائق النظامية اللازمة لبدء الدراسة الفنية.',
    keyChecklist: [
      'التحقق من سريان السجل التجاري ورخصة التجارة للشركة المستوردة',
      'التأكد من توفر كتالوج المنتج الأصلي (Data Sheet) باللغة العربية أو الإنجليزية',
      'فحص كتاب التفويض الرسمي من الشركة المصنعة (Letter of Authorization)',
    ],
    reviewerTips: 'في حالة نقص أية وثيقة جوهرية، يمكنك تدوين ملحوظة وإحالة الطلب لخطوة إدارة النواقص (الخطوة 4).',
    requiredAttachments: ['السجل التجاري', 'كتالوج المنتج الفني', 'شهادة التفويض التجاري'],
    regulatoryReference: 'القرار الوزاري رقم (42) لسنة 2022 - المادة 5',
  },
  {
    id: 2,
    title: 'مصفوفة المطابقة الفنية والاشتراطات',
    subtitle: 'مطابقة مواصفات الجهاز مع اللوائح الوطنية والمواصفات المعتمدة لدى الوزارة',
    objective: 'إجراء مقارنة بين معايير الجهاز والمواصفات الفنية المعتمدة للحد من التداخل الترددي.',
    keyChecklist: [
      'فحص تطابق نطاق نطاقات التردد مع الخطة الوطنية للترددات (NFAP)',
      'مراجعة مستويات القدرة المشعة EIRP والحد الأقصى المسموح به',
      'التأكد من دعم التشفير الآمن وحماية خصوصية بيانات المستخدمين',
    ],
    reviewerTips: 'استعن بجدول المقارنة السريعة في الخطوة 2 لإبراز الفروقات والتجاوزات تلقائياً.',
    requiredAttachments: ['شهادة المطابقة CE/FCC', 'تقرير الفحص القياسي ISO/IEC'],
    regulatoryReference: 'اللائحة التنفيذية لتنظيم الاتصالات - باب التوافق الكهرومغناطيسي',
  },
  {
    id: 3,
    title: 'الدراسة الترددية والتقييم الفني',
    subtitle: 'تحليل النطاقات الترددية، التداخل الكهرومغناطيسي، ومصفوفة المخاطر الفنية',
    objective: 'تقييم احتمالية حدوث تداخلات راديوية مع شبكات الاتصالات القائمة والمشغلين المعتمدين.',
    keyChecklist: [
      'مطابقة الترددات مع قاعدة بيانات التخصيصات لدى قطاع طيف الترددات',
      'تحديد مستوى المخاطر عبر مصفوفة التعقيد الفني (Technical Risk Matrix)',
      'التأكد من عدم استخدام الترددات السيادية أو المخصصة للطوارئ',
    ],
    reviewerTips: 'إذا ظهر مستوى المخاطر "مرتفع" أو "حرج"، يلزم اشتراط ضبط القدرة أو طلب فحص ميداني.',
    requiredAttachments: ['تقرير قياسات الطيف الترددي', 'مخطط التغطية والتوزيع الراديوي'],
    regulatoryReference: 'خطة توزيع الترددات الوطنية (NFAP) - الإصدار التحديثي 2025',
  },
  {
    id: 4,
    title: 'إدارة النواقص والإحالات الفنية',
    subtitle: 'إشعار المستورد بالوثائق المطلوبة أو إحالة الطلب للجهات ذات العلاقة',
    objective: 'استكمال كافة المتطلبات المتبقية ومتابعة الردود الواردة من القطاعات الفنية الأخرى.',
    keyChecklist: [
      'تحديث حالة النواقص وتوثيق المراسلات مع المستورد عبر النظام',
      'متابعة ردود إحالات قطاع الأمن السايبراني أو المنافذ الجمركية',
      'إغلاق جميع النواقص قبل الانتقال لمسودة التوصية النهائية',
    ],
    reviewerTips: 'لا يمكن اعتماد الشهادة في الخطوة 8 إلا بعد إغلاق كافة النواقص المفتوحة.',
    requiredAttachments: ['إفادات الاستيفاء', 'المحاضر والتعهدات الموقعة'],
    regulatoryReference: 'دليل إجراءات التحسين وجودة الخدمات التنظيمية - المادة 12',
  },
  {
    id: 5,
    title: 'إعداد مسودة الدراسة الفنية والتقرير الميداني',
    subtitle: 'صياغة المسودة المبدئية وإرفاق تقارير المعاينة والمطابقة المختبرية',
    objective: 'توثيق نتائج التقييم الميداني والمختبري وتجهيز مسودة تقرير الموافقة الفنية.',
    keyChecklist: [
      'إدراج وتدقيق تقارير الفحص الميداني والمختبري (عبر أداة Drag & Drop)',
      'كتابة ملخص النتائج القياسية والملاحظات الهندسية الشاملة',
      'تحديد فترة صلاحية الشهادة الموصى بها (سنة إلى 3 سنوات)',
    ],
    reviewerTips: 'استخدم القوالب المجهزة في محرر مسودة الدراسة لتوفير الوقت وضمان الدقة.',
    requiredAttachments: ['تقرير المعايرة الميدانية', 'مسودة الدراسة الفنية'],
    regulatoryReference: 'معايير جودة التقرير الفني - المكتب الفني بالوزارة',
  },
  {
    id: 6,
    title: 'صياغة التوصية والرأي الفني التنظيمي',
    subtitle: 'تحديد القرار النهائي (موافقة كاملة، مشروطة، أو رفض مسبب)',
    objective: 'اتخاذ القرار التنظيمي النهائي بناءً على نتائج جميع مراحل الدراسة السابقة.',
    keyChecklist: [
      'تحديد القرار (قبول / قبول مشروط / رفض مسبب)',
      'صياغة الشروط والقيود التشغيلية في حالة القبول المشروط',
      'رفع التوصية إلى رئيس المكتب الفني ومدير عام تنظيم الاتصالات',
    ],
    reviewerTips: 'في حالة الرفض، يجب إسناد القرار إلى نص قانوني أو بند مواصفة محدد بوضوح.',
    requiredAttachments: ['مذكرة الرأي الفني التنظيمي'],
    regulatoryReference: 'دليل السلطات وصلاحيات الاعتماد - الإدارة العامة لتنظيم الاتصالات',
  },
  {
    id: 7,
    title: 'بناء وتدقيق التقرير الفني النهائي',
    subtitle: 'توليد التقرير النهائي الشامل المخصص للعرض على الإدارة العليا',
    objective: 'تجميع كافة المخرجات والتحليلات في وثيقة رسمية موحدة قابلة للطباعة والأرشفة.',
    keyChecklist: [
      'معايرة صياغة التقرير وتضمين توقيع المراجع الفني المسؤول',
      'التأكد من دقة الأرقام المرجعية ورقم الشفرة الشريطية QR',
      'تجميع جميع المرفقات والشهادات المرجعية في ملف إلكتروني واحد',
    ],
    reviewerTips: 'تأكد من معاينة التقرير بنمط A4 لضمان التنسيق الطباعي قبل إرساله للاعتماد.',
    requiredAttachments: ['التقرير الفني الشامل النهائي (PDF)'],
    regulatoryReference: 'نظام الأرشفة والتوثيق الإلكتروني بالجمهورية اليمنية',
  },
  {
    id: 8,
    title: 'الاعتمادات النهائية وإصدار الشهادة الرسمية',
    subtitle: 'التوقيع الرقمي، الختم الإلكتروني، وإرسال الشهادة لمقدم الطلب',
    objective: 'إصدار شهادة الموافقة النوعية الرسمية وتوقيعها رقمياً لإكمال الدورة المستندية.',
    keyChecklist: [
      'اختيار قالب الشهادة المناسب (أجهزة / أنظمة وإفراج مؤقت)',
      'تطبيق التوقيع الرقمي المعتمد والختم الرسمي للوزارة',
      'إرسال إشعار صدور الشهادة عبر البريد الإلكتروني لمستلم الشركة',
    ],
    reviewerTips: 'الشهادة الصادرة تحتوي على رمز QR ذكي مرمز للتحقق عبر البوابة الوطنية.',
    requiredAttachments: ['شهادة الموافقة النوعية الرسمية (الموقعة والمختومة)'],
    regulatoryReference: 'قانون التوقيع والمعاملات الإلكترونية رقم (15) لسنة 2024',
  },
];

export const WorkflowGuide: React.FC = () => {
  const { currentRequest, activeStep, setActiveStep, addToast } = useApp();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Helper to determine status of step
  const getStepStatus = (stepId: number): StepStatus => {
    const key = `step${stepId}` as keyof typeof currentRequest.stepStatuses;
    return currentRequest.stepStatuses[key] || 'لم_تبدأ';
  };

  // Helper to check if step is considered completed
  const isStepCompleted = (status: StepStatus) => status === 'معتمدة' || status === 'مقفلة';

  // Calculate completed steps count
  const completedStepsCount = STUDY_STEPS.filter((step) => isStepCompleted(getStepStatus(step.id))).length;
  const progressPercent = Math.round((completedStepsCount / 8) * 100);

  const currentDetail = GUIDE_DETAILS.find((d) => d.id === activeStep) || GUIDE_DETAILS[0];

  const toggleCheck = (itemKey: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemKey]: !prev[itemKey],
    }));
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-slate-100 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-4 font-sans text-xs transition-all">
      {/* Top Banner Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-amber-500/20 border border-amber-500/40 text-amber-400 rounded-xl">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <span>دليل معالجة الطلبات والتوجيه التفاعلي (Interactive Reviewer Workflow Guide)</span>
              <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-extrabold">
                دليل المراجع الجديد
              </span>
            </h3>
            <p className="text-[11px] text-slate-300">
              إرشادات وقواعد العمل الاسترشادية للخطوة الحالية مع تتبع نسبة الإنجاز والاشتراطات النظامية
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress Bar Badge */}
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
            <span className="text-[11px] text-slate-300 font-bold">إنجاز الدورة:</span>
            <div className="w-24 bg-slate-700 rounded-full h-2 overflow-hidden border border-slate-600">
              <div
                className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-mono font-extrabold text-emerald-400 text-xs">
              {completedStepsCount}/8 ({progressPercent}%)
            </span>
          </div>

          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold rounded-xl text-xs transition flex items-center gap-1 border border-slate-700"
          >
            <span>{isExpanded ? 'إخفاء الدليل' : 'إظهار دليل الخطوات'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Interactive Body */}
      {isExpanded && (
        <div className="space-y-4 animate-fade-in">
          {/* Step Selector Horizontal Timeline Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {STUDY_STEPS.map((step) => {
              const status = getStepStatus(step.id);
              const isCurrent = activeStep === step.id;
              const isCompleted = isStepCompleted(status);

              return (
                <button
                  key={step.id}
                  onClick={() => {
                    setActiveStep(step.id);
                    addToast(`الانتقال لدليل الخطوة ${step.id}: ${step.title}`, 'info');
                  }}
                  className={`p-2.5 rounded-xl border text-right transition flex flex-col justify-between space-y-1 relative ${
                    isCurrent
                      ? 'bg-blue-600/90 text-white border-blue-400 ring-2 ring-blue-400/40 shadow-md'
                      : isCompleted
                      ? 'bg-emerald-950/40 text-emerald-200 border-emerald-800/80 hover:bg-emerald-900/50'
                      : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="w-5 h-5 rounded-full bg-slate-900/80 text-white font-mono font-extrabold text-[10px] flex items-center justify-center shrink-0">
                      {step.id}
                    </span>
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : status === 'قيد_العمل' ? (
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-600" />
                    )}
                  </div>

                  <span className="font-extrabold text-[11px] line-clamp-1 leading-tight">{step.title}</span>

                  <span className="text-[9px] opacity-80 font-bold block">
                    {isCompleted ? 'تم الاعتماد' : status === 'قيد_العمل' ? 'قيد العمل' : 'لم تبدأ بعد'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Step Detailed Guidance Box */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700/80">
            {/* Left Main Guidance Column (7 Cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-start justify-between gap-2 border-b border-slate-700/80 pb-2.5">
                <div>
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded text-[10px] font-bold font-mono inline-block mb-1">
                    دليل الخطوة النشطة #{currentDetail.id}
                  </span>
                  <h4 className="text-sm font-extrabold text-white">{currentDetail.title}</h4>
                  <p className="text-[11px] text-slate-300">{currentDetail.subtitle}</p>
                </div>

                <StatusBadge status={getStepStatus(currentDetail.id)} size="sm" />
              </div>

              {/* Goal Objective */}
              <div className="p-3 bg-indigo-950/50 border border-indigo-800/60 rounded-xl space-y-1">
                <span className="font-extrabold text-indigo-300 text-[11px] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>الهدف التنظيمي الرئيسي من هذه الخطوة:</span>
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">{currentDetail.objective}</p>
              </div>

              {/* Key Checklist with Toggles */}
              <div className="space-y-2">
                <span className="font-extrabold text-slate-200 text-xs flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>قائمة التدقيق والمراجعة التنفيذية (Checklist):</span>
                </span>

                <div className="space-y-1.5">
                  {currentDetail.keyChecklist.map((item, idx) => {
                    const itemKey = `step-${currentDetail.id}-check-${idx}`;
                    const isChecked = !!checkedItems[itemKey];

                    return (
                      <button
                        key={itemKey}
                        onClick={() => toggleCheck(itemKey)}
                        className={`w-full p-2.5 rounded-lg border text-right transition flex items-center gap-2.5 ${
                          isChecked
                            ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200 line-through opacity-80'
                            : 'bg-slate-900/80 border-slate-700/80 text-slate-200 hover:border-slate-600'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition ${
                            isChecked ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-500'
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />}
                        </div>
                        <span className="text-[11px] font-bold">{item}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Supplementary Column (5 Cols) */}
            <div className="lg:col-span-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                {/* Reviewer Pro-tip */}
                <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl space-y-1 text-amber-200">
                  <span className="font-extrabold text-[11px] flex items-center gap-1.5 text-amber-300">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    <span>توجيه وإرشادات للمراجع الجديد:</span>
                  </span>
                  <p className="text-[11px] leading-relaxed text-amber-100">{currentDetail.reviewerTips}</p>
                </div>

                {/* Required Documents / Attachments List */}
                <div className="p-3 bg-slate-900/80 border border-slate-700/80 rounded-xl space-y-1.5">
                  <span className="font-extrabold text-[11px] text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                    <span>المرفقات والوثائق المطلوبة بهذه المرحلة:</span>
                  </span>
                  <ul className="space-y-1 text-[10px] text-slate-300 list-disc list-inside">
                    {currentDetail.requiredAttachments.map((doc, idx) => (
                      <li key={idx} className="font-mono text-blue-200">
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Regulatory Legal Reference */}
                <div className="p-2.5 bg-slate-900/60 border border-slate-700/60 rounded-xl space-y-0.5 text-[10px] text-slate-400 font-mono">
                  <span className="font-extrabold text-slate-300 block">المرجع القانوني والتنظيمي:</span>
                  <p className="text-slate-200">{currentDetail.regulatoryReference}</p>
                </div>
              </div>

              {/* Navigation Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-700/80">
                <button
                  onClick={() => {
                    if (activeStep > 1) setActiveStep(activeStep - 1);
                  }}
                  disabled={activeStep === 1}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>الخطوة السابقة</span>
                </button>

                <button
                  onClick={() => {
                    if (activeStep < 8) setActiveStep(activeStep + 1);
                  }}
                  disabled={activeStep === 8}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1 shadow-xs"
                >
                  <span>الانتقال للخطوة التالية</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
