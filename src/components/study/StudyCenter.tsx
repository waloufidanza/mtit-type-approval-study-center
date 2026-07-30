/**
 * @file StudyCenter.tsx
 * Daily Technical Reviewer Workspace (مساحة عمل يومية للمراجع الفني)
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { RequestRibbon } from './RequestRibbon';
import { WorkflowSteps } from './WorkflowSteps';
import { DecisionSidebar } from './DecisionSidebar';
import { RequestTimeline } from './RequestTimeline';
import { StepGuidanceModal } from './StepGuidanceModal';
import { SmartAnalysisModal } from './SmartAnalysisModal';
import { ExpirationAlerts } from './ExpirationAlerts';

// Step components
import { Step1Context } from './steps/Step1Context';
import { Step2Matrix } from './steps/Step2Matrix';
import { Step3Technical } from './steps/Step3Technical';
import { Step4Deficiencies } from './steps/Step4Deficiencies';
import { Step5InitialStudy } from './steps/Step5InitialStudy';
import { Step6TechnicalOpinion } from './steps/Step6TechnicalOpinion';
import { Step7ReportBuilder } from './steps/Step7ReportBuilder';
import { Step8ApprovalsCertificate } from './steps/Step8ApprovalsCertificate';

import {
  ChevronLeft,
  ChevronRight,
  Save,
  Clock,
  AlertTriangle,
  HelpCircle,
  FileCheck2,
  CheckCircle2,
  Layers,
  X,
  Keyboard,
  ArrowRight,
  ArrowLeft,
  Activity,
  AlertCircle,
  Sparkles,
  BookOpen,
  EyeOff,
  Eye,
  ShieldAlert,
} from 'lucide-react';

export const StudyCenter: React.FC = () => {
  const {
    currentRequest,
    activeStep,
    setActiveStep,
    saveStatus,
    triggerSave,
    addToast,
    blindReviewMode,
    toggleBlindReviewMode,
  } = useApp();

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaveFormatted, setLastSaveFormatted] = useState('12:56:06');
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showGuidanceModal, setShowGuidanceModal] = useState(false);
  const [showSmartAnalysisModal, setShowSmartAnalysisModal] = useState(false);

  const stepTitles: Record<number, string> = {
    1: 'الخطوة 1: السياق وجمع البيانات الأولية',
    2: 'الخطوة 2: مصفوفة المتطلبات والمطابقة',
    3: 'الخطوة 3: الدراسة الفنية القياسية والترددات',
    4: 'الخطوة 4: إدارة النواقص والاستيفاءات',
    5: 'الخطوة 5: مسودة الدراسة والتقييم المبدئي',
    6: 'الخطوة 6: الرأي الفني والتوصية التنظيمية',
    7: 'الخطوة 7: صياغة التقرير الفني النهائي',
    8: 'الخطوة 8: الاعتمادات وإصدار الشهادة الرسمية',
  };

  // Open Deficiencies & Pending Referrals Counters
  const openDeficienciesCount = currentRequest.deficiencies?.filter((d) => d.status === 'مفتوح').length || 0;
  const pendingReferralsCount = currentRequest.referrals?.filter((r) => r.status === 'بانتظار_الرد').length || 0;

  // Critical Requirement Alert Condition
  const hasCriticalUnverified =
    openDeficienciesCount > 0 ||
    currentRequest.spectrumStatus === 'غير_متوافق' ||
    currentRequest.securityStatus === 'يتطلب_تنسيق';

  // Handle Save
  const handleSaveWorkspace = () => {
    triggerSave();
    const now = new Date();
    setLastSaveFormatted(now.toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    setHasUnsavedChanges(false);
  };

  // Step Navigation
  const handleNextStep = () => {
    if (activeStep < 8) {
      setActiveStep(activeStep + 1);
      addToast(`الانتقال إلى: ${stepTitles[activeStep + 1]}`, 'info');
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
      addToast(`العودة إلى: ${stepTitles[activeStep - 1]}`, 'info');
    }
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when typing in inputs/textareas
      const targetTag = (e.target as HTMLElement)?.tagName;
      if (targetTag === 'INPUT' || targetTag === 'TEXTAREA' || targetTag === 'SELECT') {
        return;
      }

      if (e.ctrlKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveWorkspace();
      } else if (e.ctrlKey && e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextStep();
      } else if (e.ctrlKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevStep();
      } else if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setShowShortcutsModal((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeStep]);

  const renderActiveStepComponent = () => {
    switch (activeStep) {
      case 1:
        return <Step1Context />;
      case 2:
        return <Step2Matrix />;
      case 3:
        return <Step3Technical />;
      case 4:
        return <Step4Deficiencies />;
      case 5:
        return <Step5InitialStudy />;
      case 6:
        return <Step6TechnicalOpinion />;
      case 7:
        return <Step7ReportBuilder />;
      case 8:
        return <Step8ApprovalsCertificate />;
      default:
        return <Step1Context />;
    }
  };

  return (
    <div className="space-y-3 min-w-0 max-w-full font-sans">
      {/* 1. Daily Reviewer Top Header & Breadcrumb Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Breadcrumb Path */}
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-bold overflow-x-auto whitespace-nowrap">
          <span className="text-slate-400">مركز الدراسات</span>
          <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-mono text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900">
            {currentRequest.requestNumber}
          </span>
          <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 dark:text-slate-100 font-extrabold">{stepTitles[activeStep]}</span>
        </div>

        {/* Indicators & Shortcuts Trigger */}
        <div className="flex items-center gap-3">
          {/* Unsaved Changes Dot Indicator */}
          {hasUnsavedChanges ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 rounded-full font-bold text-[11px] animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>تعديلات غير محفوظة</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[11px] font-mono">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              <span>آخر حفظ: {lastSaveFormatted}</span>
            </span>
          )}

          {/* Open Deficiencies Counter */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] border ${
              openDeficienciesCount > 0
                ? 'bg-rose-50 text-rose-800 dark:bg-rose-950/80 dark:text-rose-200 border-rose-300'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200'
            }`}
            title="عدد النواقص غير المغلقة في هذا الطلب"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>النواقص المفتوحة: {openDeficienciesCount}</span>
          </div>

          {/* Pending Referrals Counter */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] border ${
              pendingReferralsCount > 0
                ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/80 dark:text-amber-200 border-amber-300'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200'
            }`}
            title="عدد الإحالات المعلقة بانتظار رد الجهات الفنية"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>الإحالات المعلقة: {pendingReferralsCount}</span>
          </div>

          {/* AI Smart Request Analysis Button */}
          <button
            onClick={() => setShowSmartAnalysisModal(true)}
            className="px-2.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold rounded-lg shadow-sm transition flex items-center gap-1.5 text-[11px]"
            title="تحليل ذكي للطلب وقراءة النواقص والتعارضات المحتملة"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>التحليل الذكي للطلب</span>
          </button>

          {/* Step Policy & Guidance Button */}
          <button
            onClick={() => setShowGuidanceModal(true)}
            className="px-2.5 py-1.5 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800 font-extrabold rounded-lg transition flex items-center gap-1.5 text-[11px]"
            title="التعليمات والسياسات التنظيمية الخاصة بهذه الخطوة"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>السياسات والتعليمات</span>
          </button>

          {/* Blind Review Mode Toggle Switch */}
          <button
            onClick={toggleBlindReviewMode}
            className={`px-2.5 py-1.5 rounded-lg border font-extrabold transition flex items-center gap-1.5 text-[11px] ${
              blindReviewMode
                ? 'bg-purple-600 hover:bg-purple-500 text-white border-purple-700 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200'
            }`}
            title="إخفاء بيانات مقدم الطلب الحساسة لضمان الحيادية في التقييم الفني"
          >
            {blindReviewMode ? <EyeOff className="w-3.5 h-3.5 text-white" /> : <Eye className="w-3.5 h-3.5 text-purple-500" />}
            <span>الدراسة العمياء {blindReviewMode ? '(مفعل)' : '(معطل)'}</span>
          </button>

          {/* Keyboard Shortcuts Trigger Button */}
          <button
            onClick={() => setShowShortcutsModal(true)}
            className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-300 hover:text-blue-700 rounded-lg transition border border-slate-200 dark:border-slate-700 flex items-center gap-1 font-bold text-[11px]"
            title="اختصارات لوحة المفاتيح (?)"
          >
            <Keyboard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">اختصارات</span>
          </button>
        </div>
      </div>

      {/* 2. Expiration Alerts Panel (<30 days certificates) */}
      <ExpirationAlerts />

      {/* Blind Review Mode Active Notice Banner */}
      {blindReviewMode && (
        <div className="p-3 bg-purple-900 text-purple-100 rounded-xl border border-purple-700 shadow-sm flex items-center justify-between text-xs animate-fade-in">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-purple-300 shrink-0" />
            <div>
              <span className="font-extrabold block text-white text-xs">
                وضع الدراسة والمراجعة العمياء نشط (Blind Review Mode Active)
              </span>
              <p className="text-[11px] text-purple-200">
                تم حجب الهوية التجارية وبيانات التواصل الخاصة بمقدم الطلب لضمان أعلى معايير الشفافية والحيادية أثناء التقييم الفني للمواصفات.
              </p>
            </div>
          </div>

          <button
            onClick={toggleBlindReviewMode}
            className="px-3 py-1 bg-purple-800 hover:bg-purple-700 text-white font-bold rounded-lg text-xs border border-purple-600 transition"
          >
            إلغاء وضع الدراسة العمياء
          </button>
        </div>
      )}

      {/* Critical Unverified Info Alert Banner (if applicable) */}
      {hasCriticalUnverified && (
        <div className="p-3 bg-amber-500/10 dark:bg-amber-950/40 border-l-4 border-amber-500 rounded-r-xl flex items-center justify-between text-xs text-amber-900 dark:text-amber-200 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <span className="font-extrabold block">تنبيه حرج للتقييم الفني:</span>
              <p className="text-[11px] text-amber-800 dark:text-amber-300">
                هناك متغيرات حرجة لم يتم استيفاؤها بالكامل بعد (نواقص مفتوحة أو متطلبات ترددية/أمنية غير معتمدة). يرجى مراجعة الخطوات 3 و 4 قبل التوصية بالاعتماد النهائي.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveStep(4)}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg shrink-0 text-[11px] transition shadow-2xs"
          >
            استيفاء النواقص ←
          </button>
        </div>
      )}

      {/* 3. Fixed Top Request Ribbon */}
      <RequestRibbon />

      {/* 4. Horizontal Stepper */}
      <WorkflowSteps />

      {/* 5. Sticky Technical Reviewer Action Toolbar (Save, Previous Step, Next Step) */}
      <div className="bg-slate-900 text-white rounded-xl p-3 border border-slate-800 shadow-md flex items-center justify-between flex-wrap gap-3 sticky top-2 z-20">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevStep}
            disabled={activeStep === 1}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border border-slate-700"
          >
            <ChevronRight className="w-4 h-4" />
            <span>العودة للخطوة السابقة</span>
          </button>

          <span className="text-[11px] text-slate-400 font-mono px-2 hidden md:inline">
            الخطوة {activeStep} من 8
          </span>
        </div>

        {/* Center Save Workspace Status */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveWorkspace}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>حفظ مسودة العمل الفني</span>
          </button>
          <span className="text-[11px] text-emerald-400 font-mono hidden sm:inline-flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{saveStatus} ({lastSaveFormatted})</span>
          </span>
        </div>

        {/* Right Next Step Button */}
        <button
          onClick={handleNextStep}
          disabled={activeStep === 8}
          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
        >
          <span>الانتقال إلى الإجراء التالي</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* 6. Main Workspace Layout (Active Step Component + Fixed Decision Sidebar) */}
      <div className="flex flex-col lg:flex-row gap-4 items-start min-w-0 pt-1">
        <div className="flex-1 min-w-0 w-full space-y-4">
          {renderActiveStepComponent()}
          
          {/* Interactive Request Audit Log / Timeline Component */}
          <RequestTimeline requestNumber={currentRequest.requestNumber} />
        </div>
        <div className="w-full lg:w-80 shrink-0 sticky top-20">
          <DecisionSidebar />
        </div>
      </div>

      {/* Official Developer Credit Footer */}
      <div className="bg-slate-900 text-slate-300 p-3 rounded-xl border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-slate-100">نظام اعتماد النوع الفني - وزارة الاتصالات وتقنية المعلومات</span>
        </div>
        <div className="text-[11px] font-bold text-amber-300 bg-slate-800 px-3 py-1 rounded-lg border border-amber-500/30">
          إعداد وتطوير: م. وائل صلاح القاسمي - رئيس المكتب الفني
        </div>
      </div>

      {/* Keyboard Shortcuts Help Modal */}
      {showShortcutsModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                  اختصارات لوحة المفاتيح لمساحة العمل
                </h3>
              </div>
              <button
                onClick={() => setShowShortcutsModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                <span className="font-bold text-slate-800 dark:text-slate-200">حفظ مسودة مساحة العمل:</span>
                <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono rounded text-[11px] font-bold">
                  Ctrl + S
                </kbd>
              </div>

              <div className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                <span className="font-bold text-slate-800 dark:text-slate-200">الانتقال للخطوة التالية:</span>
                <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono rounded text-[11px] font-bold">
                  Ctrl + →
                </kbd>
              </div>

              <div className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                <span className="font-bold text-slate-800 dark:text-slate-200">العودة للخطوة السابقة:</span>
                <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono rounded text-[11px] font-bold">
                  Ctrl + ←
                </kbd>
              </div>

              <div className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                <span className="font-bold text-slate-800 dark:text-slate-200">عرض قائمه الاختصارات هذه:</span>
                <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono rounded text-[11px] font-bold">
                  ?
                </kbd>
              </div>
            </div>

            <button
              onClick={() => setShowShortcutsModal(false)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* Step Guidance & Regulations Modal */}
      <StepGuidanceModal
        stepNumber={activeStep}
        isOpen={showGuidanceModal}
        onClose={() => setShowGuidanceModal(false)}
      />

      {/* Smart AI Analysis Modal */}
      <SmartAnalysisModal
        isOpen={showSmartAnalysisModal}
        onClose={() => setShowSmartAnalysisModal(false)}
      />
    </div>
  );
};

