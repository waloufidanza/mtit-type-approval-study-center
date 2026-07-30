/**
 * @file UserOnboardingTour.tsx
 * Interactive Tooltip/Popover Onboarding Tour component for new users in 'Study Center'.
 * Guides users through Technical Study steps, Security coordination, Validation checks,
 * Technical Report generation, and Certificate issuance workflows.
 */

import React, { useState, useEffect } from 'react';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Radio,
  Award,
  Sparkles,
  HelpCircle,
  Eye,
  Settings,
} from 'lucide-react';

export interface TourStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  targetStepNumber: number;
  icon: React.ReactNode;
  tips: string[];
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 1,
    title: 'الخطوة 1: المراجعة الأولية وتصنيف المستندات',
    subtitle: 'التحقق من اكتمال طلب الموافقة النوعية وثائقياً',
    description:
      'هنا يتم التأكد من صحة مستندات المصنع المورد، مطابقة نموذج الطلب، والتحقق من دفع الرسوم والضمانات المرفقة قبل البدء بالدراسة.',
    targetStepNumber: 1,
    icon: <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    tips: [
      'تأكد من صلاحية شهادات ISO والضمانات.',
      'يمكنك إضافة ملاحظات أولية على أي مستند ناقص.',
    ],
  },
  {
    id: 2,
    title: 'الخطوة 2: الفحص الفني والكهربائي والامان',
    subtitle: 'تقييم مواصفات المعدة الكهربائية والانبعاثات',
    description:
      'مراجعة تقارير المختبرات الدولية المعتمدة (CE / FCC / RED)، ومستوى طاقة البث، ونسب ومستويات الامتثال للحماية الإشعاعية والصحة.',
    targetStepNumber: 2,
    icon: <Settings className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
    tips: [
      'راجع طاقة البث EIRP وحدود السلامة.',
      'تأكد من مطابقة شاحن الجهاز لمعايير الكهرباء المحلية.',
    ],
  },
  {
    id: 3,
    title: 'الخطوة 3: مطابقة النطاقات والترددات الوطنية',
    subtitle: 'التأكد من التوافق مع الخطة الوطنية للترددات',
    description:
      'فحص النطاقات الترددية للمعدة ونوع التضمين (Modulation)، والتأكد من عدم وجود أي تداخل مع الشبكات الوطنية أو الخدمات الحيوية.',
    targetStepNumber: 3,
    icon: <Radio className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
    tips: [
      'قارن ترددات الجهاز بالخطة الوطنية المعروضة بالجدول.',
      'في حال وجود تعارض تردد، سيقوم النظام بالتنبيه التلقائي.',
    ],
  },
  {
    id: 4,
    title: 'الخطوة 4: التنسيق والتراخيص الأمنية',
    subtitle: 'مراجعة الملاحظات والاعتمادات الأمنية والسيادية',
    description:
      'متابعة ردود واستجابات الجهات الأمنية المختصة للأجهزة ذات الاستخدام المزدوج أو التشفير العالي قبل الموافقة النهائي.',
    targetStepNumber: 4,
    icon: <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    tips: [
      'الأجهزة المشفرة تتطلب خطاب عدم مانعة أمني.',
      'يمكنك إرفاق المراسلات الأمنية مباشرة بهذه الخطوة.',
    ],
  },
  {
    id: 5,
    title: 'الخطوة 5: إدارة النواقص والإحالات الرسمية',
    subtitle: 'طلب إيضاحات من المورد أو إحالة للجنة الفنية العليا',
    description:
      'إذا تبين وجود نقص بالشهادات أو الحاجة لفحص مختبري إضافي، يمكنك توجيه النواقص للمورد مع تجميد فترة SLA مؤقتاً.',
    targetStepNumber: 5,
    icon: <HelpCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
    tips: [
      'يتم إرسال إشعار تلقائي للمورد بمهلة لاستكمال النواقص.',
    ],
  },
  {
    id: 6,
    title: 'الخطوة 6: التوصية الفنية والقرار النهائي',
    subtitle: 'صياغة القرار (قبول / قبول بشرط / رفض)',
    description:
      'صياغة التوصية النهائية استناداً إلى نتائج الخطوات السابقة ومصفوفة التعقيد الفني واحتساب نقاط المخاطر.',
    targetStepNumber: 6,
    icon: <Compass className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
    tips: [
      'استخدم مساعد الذكاء الاصطناعي لكتابة مسودة التوصية تلقائياً.',
    ],
  },
  {
    id: 7,
    title: 'الخطوة 7: التقرير الفني الشامل وإصدار الشهادة',
    subtitle: 'توليد التقرير النهائي A4 وإصدار شهادة الموافقة النوعية',
    description:
      'مركز التقرير الفني النهائي: يتيح معاينة التقرير بنمط A4، تطبيق قائمة الفحص والاعتمادات، إضافة التوقيع الرقمي والختم، وتوليد رمز QR للشهادة.',
    targetStepNumber: 7,
    icon: <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    tips: [
      'تأكد من اجتياز كافة بنود قائمة الفحص المانعة قبل الاعتماد.',
      'يتم مزامنة التقرير والشهادة تلقائياً مع السحابة الأرشيفية.',
    ],
  },
];

interface UserOnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToStep?: (stepNumber: number) => void;
  currentActiveStep?: number;
}

export const UserOnboardingTour: React.FC<UserOnboardingTourProps> = ({
  isOpen,
  onClose,
  onNavigateToStep,
  currentActiveStep = 1,
}) => {
  const [currentTourIndex, setCurrentTourIndex] = useState(0);

  useEffect(() => {
    // Sync current tour index with active step if provided
    if (isOpen && currentActiveStep >= 1 && currentActiveStep <= TOUR_STEPS.length) {
      const idx = TOUR_STEPS.findIndex((s) => s.targetStepNumber === currentActiveStep);
      if (idx !== -1) {
        setCurrentTourIndex(idx);
      }
    }
  }, [isOpen, currentActiveStep]);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentTourIndex];
  const isFirst = currentTourIndex === 0;
  const isLast = currentTourIndex === TOUR_STEPS.length - 1;
  const progressPercent = Math.round(((currentTourIndex + 1) / TOUR_STEPS.length) * 100);

  const handleNext = () => {
    if (!isLast) {
      const nextIdx = currentTourIndex + 1;
      setCurrentTourIndex(nextIdx);
      if (onNavigateToStep) {
        onNavigateToStep(TOUR_STEPS[nextIdx].targetStepNumber);
      }
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      const prevIdx = currentTourIndex - 1;
      setCurrentTourIndex(prevIdx);
      if (onNavigateToStep) {
        onNavigateToStep(TOUR_STEPS[prevIdx].targetStepNumber);
      }
    }
  };

  const handleStepJump = (index: number) => {
    setCurrentTourIndex(index);
    if (onNavigateToStep) {
      onNavigateToStep(TOUR_STEPS[index].targetStepNumber);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs font-sans animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col space-y-0">
        {/* Top Progress Line */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 relative">
          <div
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-2xl shadow-2xs">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  جولة تعليمية تفاعلية
                </span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200 rounded-full text-[10px] font-mono font-extrabold">
                  {currentTourIndex + 1} من {TOUR_STEPS.length}
                </span>
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
                دليل مركز الدراسة والتقارير الفنية
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            title="إغلاق الجولة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Step Icon & Title Banner */}
          <div className="p-4 bg-gradient-to-br from-blue-50/80 to-indigo-50/50 dark:from-slate-800 dark:to-slate-800/60 border border-blue-100 dark:border-slate-700 rounded-2xl flex items-start gap-3.5">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-xs shrink-0 border border-slate-100 dark:border-slate-800">
              {currentStep.icon}
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                {currentStep.title}
              </h4>
              <p className="text-xs font-bold text-blue-700 dark:text-blue-300">
                {currentStep.subtitle}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            {currentStep.description}
          </p>

          {/* Quick Tips */}
          {currentStep.tips && currentStep.tips.length > 0 && (
            <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl space-y-1.5 text-xs text-emerald-950 dark:text-emerald-200">
              <div className="flex items-center gap-1.5 font-bold text-[11px] text-emerald-800 dark:text-emerald-300">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>نصائح إرشادية سريعة:</span>
              </div>
              <ul className="space-y-1 list-disc list-inside text-[11px] opacity-95">
                {currentStep.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Step Indicators Grid */}
          <div className="flex items-center justify-between gap-1 pt-2 border-t border-slate-100 dark:border-slate-800">
            {TOUR_STEPS.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => handleStepJump(idx)}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-mono font-bold transition flex items-center justify-center gap-1 border ${
                  idx === currentTourIndex
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : idx < currentTourIndex
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                    : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                }`}
                title={step.title}
              >
                <span>خـ{step.targetStepNumber}</span>
                {idx < currentTourIndex && <CheckCircle2 className="w-2.5 h-2.5" />}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
          >
            تخطي الجولة
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={isFirst}
              className="px-3.5 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-40"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>السابق</span>
            </button>

            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shadow-sm"
            >
              <span>{isLast ? 'إنهاء واستكشاف' : 'التالي'}</span>
              {!isLast ? <ArrowLeft className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
