/**
 * @file TechnicalReportCenter.tsx
 * Comprehensive Unit for Step 7: "إعداد وتصدير التقرير الفني النهائي"
 * Integrates:
 * - Report Settings Panel (Side Controls for Metadata, Watermarks, Logo/QR/Barcode toggles)
 * - ExecutiveSummaryDashboard (Page 1 Visual KPI Summary Cards with Icon & Monochromatic Print Support)
 * - Dynamic A4 Report Renderer powered by ReportService abstraction (18 Dynamic Sections)
 * - ApprovalWorkflowPanel (RTL Dynamic Approval Cards with Statuses)
 * - Pre-approval Report Validation Checklist
 * - Trial PDF/DOCX Export & Draft Lifecycle Management
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MinistryLogo } from '../common/MinistryLogo';
import { ExecutiveSummaryDashboard } from './ExecutiveSummaryDashboard';
import { ApprovalWorkflowPanel } from './ApprovalWorkflowPanel';
import { ChangeLogViewer } from './ChangeLogViewer';
import { ReportValidationChecklist } from './ReportValidationChecklist';
import {
  reportService,
  ReportConfig,
  ReportSection,
  ApprovalSigner,
  ValidationCheckItem,
} from '../../services/reportService';
import {
  FileText,
  Printer,
  Download,
  Eye,
  CheckCircle2,
  Sliders,
  QrCode,
  Layers,
  History,
  FileSpreadsheet,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Building2,
  Cpu,
  Radio,
  FileCheck,
  CheckSquare,
  ArrowUp,
  ArrowDown,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  Info,
  Clock,
  UserCheck,
  PenTool,
  Lock,
  Sparkles,
  Barcode as BarcodeIcon,
} from 'lucide-react';

export const TechnicalReportCenter: React.FC = () => {
  const { currentRequest, updateStepStatus, addToast, addAuditLog } = useApp();

  // Report Configuration State
  const [config, setConfig] = useState<ReportConfig>({
    reportTitle: 'تقرير الدراسة الفنية النهائية لإصدار شهادة الموافقة النوعية',
    requestNumber: currentRequest.requestNumber,
    referenceNumber: `TR-YEM-${new Date().getFullYear()}-${currentRequest.requestNumber.slice(-4)}`,
    preparedDate: new Date().toISOString().split('T')[0],
    lastUpdatedDate: new Date().toISOString().split('T')[0],
    reportType: 'نهائي',
    reportStatus: 'مسودة',
    versionNumber: '1.0',
    authorName: 'م. أحمد باصريح (المكتب الفني)',
    language: 'العربية',
    templateName: 'القالب الرسمي الوزاري A4',
    includeLogo: true,
    includeQrCode: true,
    includeBarcode: true,
    includePageNumbers: true,
    includeTableOfContents: true,
    includeAppendices: true,
    includeSignatures: true,
    watermark: 'مسودة',
  });

  // Dynamic 18 Sections State
  const [sections, setSections] = useState<ReportSection[]>(reportService.getDefaultSections());

  // Workflow Signers State
  const [signers, setSigners] = useState<ApprovalSigner[]>(reportService.getDefaultApprovalWorkflow());

  // UI Viewport Controls
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isBlackAndWhiteMode, setIsBlackAndWhiteMode] = useState<boolean>(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string>('sec1');

  // Pre-approval Validation State
  const [validationItems, setValidationItems] = useState<ValidationCheckItem[]>([]);

  useEffect(() => {
    const checks = reportService.validateReport(currentRequest);
    setValidationItems(checks);
  }, [currentRequest]);

  const canApproveReport = validationItems.every((item) => !item.isCritical || item.passed);

  // Section Toggle Visibility
  const toggleSectionVisibility = (id: string) => {
    setSections((prev) =>
      prev.map((sec) => (sec.id === id ? { ...sec, isVisible: !sec.isVisible } : sec))
    );
  };

  // Reorder Sections
  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === sections.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setSections(updated);
  };

  // Action Handlers
  const handleSaveDraft = () => {
    addToast({
      type: 'info',
      title: 'حفظ مسودة التقرير الفني',
      message: 'تم حفظ كافة الإعدادات وهيكل أجزاء التقرير بنجاح.',
    });
  };

  const handleApproveReport = () => {
    if (!canApproveReport) {
      addToast({
        type: 'error',
        title: 'تعذر اعتماد التقرير الفني',
        message: 'يرجى معالجة الملاحظات والبنود غير المكتملة في قائمة التحقق أولاً.',
      });
      return;
    }

    setConfig((prev) => ({ ...prev, reportStatus: 'معتمد', watermark: 'معتمد' }));
    updateStepStatus('step7', 'معتمدة');

    addToast({
      type: 'success',
      title: 'تم اعتماد التقرير الفني النهائي',
      message: `تم اعتماد التقرير المرجعي (${config.referenceNumber}) لطلب الموافقة النوعية.`,
    });

    addAuditLog({
      userName: config.authorName,
      userRole: 'معد التقرير الفني',
      action: 'اعتماد التقرير الفني النهائي',
      department: 'المكتب الفني',
      previousValue: 'مسودة',
      newValue: 'معتمد',
      reason: 'استكمال كافة المراجعات الفنية والهيكلية وقائمة التحقق',
      details: `رقم المرجع: ${config.referenceNumber}`,
      requestNumber: currentRequest.requestNumber,
    });
  };

  const handleReturnForModification = () => {
    setConfig((prev) => ({ ...prev, reportStatus: 'معاد للتعديل', watermark: 'معاد للتعديل' }));
    addToast({
      type: 'warning',
      title: 'إعادة التقرير للتعديل',
      message: 'تم تعديل حالة التقرير إلى معاد للتعديل لإعادة مراجعة الأجزاء المطلوبة.',
    });
  };

  const handleExportPDF = async () => {
    addToast({
      type: 'info',
      title: 'جاري تصدير ملف PDF (نسخة تجريبية)',
      message: 'تجهيز الشعار والترويسة والجداول والتوقيعات الرسمية...',
    });
    await reportService.exportToPDF(config, 'printable-a4-technical-report');
  };

  const handleExportDOCX = async () => {
    addToast({
      type: 'info',
      title: 'جاري تصدير ملف DOCX (نسخة تجريبية)',
      message: 'توليد مستند وورد تفاعلي بالبيانات الهيكلية للتقرير...',
    });
    await reportService.exportToDOCX(config);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Top Settings Toolbar & Metadata Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>إعداد وتصدير التقرير الفني النهائي</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                    config.reportStatus === 'معتمد'
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-400 dark:bg-emerald-950/80 dark:text-emerald-200'
                      : config.reportStatus === 'معاد للتعديل'
                      ? 'bg-amber-100 text-amber-900 border-amber-400 dark:bg-amber-950/80 dark:text-amber-200'
                      : 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200'
                  }`}
                >
                  {config.reportStatus}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                تحديد محددات التقرير، الهيكل، العلامة المائية، الاعتمادات، ومعاينة A4 قبل الاعتماد
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleSaveDraft}
              className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold transition"
            >
              حفظ كمسودة
            </button>

            <button
              onClick={handleReturnForModification}
              className="px-3.5 py-1.5 bg-amber-50 dark:bg-amber-950/80 hover:bg-amber-100 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 rounded-xl text-xs font-bold transition"
            >
              إعادة للتعديل
            </button>

            <button
              onClick={handleApproveReport}
              disabled={!canApproveReport}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>اعتماد التقرير الفني</span>
            </button>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

            <button
              onClick={handleExportPDF}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>تصدير PDF (تجريبي)</span>
            </button>

            <button
              onClick={handleExportDOCX}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>تصدير DOCX (تجريبي)</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة</span>
            </button>
          </div>
        </div>

        {/* Metadata Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
              الرقم المرجعي للتقرير:
            </label>
            <input
              type="text"
              value={config.referenceNumber}
              onChange={(e) => setConfig({ ...config, referenceNumber: e.target.value })}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-xs font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
              تاريخ التقرير:
            </label>
            <input
              type="date"
              value={config.preparedDate}
              onChange={(e) => setConfig({ ...config, preparedDate: e.target.value })}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-xs font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
              العلامة المائية (Watermark):
            </label>
            <select
              value={config.watermark}
              onChange={(e) =>
                setConfig({ ...config, watermark: e.target.value as ReportConfig['watermark'] })
              }
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-bold text-xs"
            >
              <option value="بدون">بدون علامة مائية</option>
              <option value="مسودة">مسودة (Draft)</option>
              <option value="معاد للتعديل">معاد للتعديل</option>
              <option value="معتمد">معتمد (Approved)</option>
              <option value="ملغى">ملغى (Canceled)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
              قالب التقرير:
            </label>
            <select
              value={config.templateName}
              onChange={(e) =>
                setConfig({ ...config, templateName: e.target.value as ReportConfig['templateName'] })
              }
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-bold text-xs"
            >
              <option value="القالب الرسمي الوزاري A4">القالب الرسمي الوزاري A4</option>
              <option value="قالب التقييم السريع">قالب التقييم السريع</option>
              <option value="قالب الفحص الفني المتقدم">قالب الفحص الفني المتقدم</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
              رقم النسخة واللغة:
            </label>
            <div className="flex gap-1">
              <input
                type="text"
                value={config.versionNumber}
                onChange={(e) => setConfig({ ...config, versionNumber: e.target.value })}
                className="w-1/2 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-xs font-bold text-center"
              />
              <select
                value={config.language}
                onChange={(e) =>
                  setConfig({ ...config, language: e.target.value as ReportConfig['language'] })
                }
                className="w-1/2 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-bold text-xs"
              >
                <option value="العربية">العربية</option>
                <option value="English">English</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
              مُعد التقرير الفني:
            </label>
            <input
              type="text"
              value={config.authorName}
              onChange={(e) => setConfig({ ...config, authorName: e.target.value })}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-bold text-xs"
            />
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="flex flex-wrap items-center gap-4 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">
            تضمين الخصائص الرسمية:
          </span>

          {[
            { key: 'includeLogo', label: 'شعار الوزارة' },
            { key: 'includeQrCode', label: 'رمز QR' },
            { key: 'includeBarcode', label: 'الباركوود' },
            { key: 'includePageNumbers', label: 'أرقام الصفحات' },
            { key: 'includeTableOfContents', label: 'الفهرس' },
            { key: 'includeAppendices', label: 'الملاحق' },
            { key: 'includeSignatures', label: 'التوقيعات والاعتمادات' },
          ].map(({ key, label }) => (
            <label
              key={key}
              className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700 dark:text-slate-300"
            >
              <input
                type="checkbox"
                checked={config[key as keyof ReportConfig] as boolean}
                onChange={(e) => setConfig({ ...config, [key]: e.target.checked })}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 2. Main 3-Column Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* RIGHT PANEL: 18 Sections Structure Manager (3 Cols) */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>هيكل التقرير (18 قسم)</span>
            </h3>

            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded border border-blue-200 dark:border-blue-800">
              {sections.filter((s) => s.isVisible).length} / {sections.length} نشط
            </span>
          </div>

          <div className="space-y-1.5 max-h-[620px] overflow-y-auto pr-1 text-xs">
            {sections.map((sec, idx) => (
              <div
                key={sec.id}
                onClick={() => setSelectedSectionId(sec.id)}
                className={`p-2 rounded-xl border transition flex items-center justify-between gap-1 cursor-pointer ${
                  selectedSectionId === sec.id
                    ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-400 dark:border-blue-700'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <input
                    type="checkbox"
                    checked={sec.isVisible}
                    disabled={sec.isMandatory}
                    onChange={() => toggleSectionVisibility(sec.id)}
                    className="rounded text-blue-600 focus:ring-blue-500 shrink-0"
                  />
                  <span
                    className={`font-bold truncate text-[11px] ${
                      sec.isVisible ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 line-through'
                    }`}
                  >
                    {sec.title}
                  </span>
                </div>

                <div className="flex items-center gap-0.5 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSection(idx, 'up');
                    }}
                    disabled={idx === 0}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-400 disabled:opacity-20"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSection(idx, 'down');
                    }}
                    disabled={idx === sections.length - 1}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-400 disabled:opacity-20"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MIDDLE PANEL: Printable A4 Document Viewport (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-200 dark:bg-slate-950 p-6 rounded-2xl overflow-x-auto flex flex-col items-center shadow-inner space-y-4">
          {/* Zoom & Viewport Controls */}
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2 flex items-center justify-between w-full text-xs shadow-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">تكبير المعاينة:</span>
              <button
                onClick={() => setZoomLevel((z) => Math.max(75, z - 10))}
                className="p-1 bg-slate-100 dark:bg-slate-800 rounded hover:bg-slate-200"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono font-bold text-[11px] px-1">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                className="p-1 bg-slate-100 dark:bg-slate-800 rounded hover:bg-slate-200"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 font-bold cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={isBlackAndWhiteMode}
                  onChange={(e) => setIsBlackAndWhiteMode(e.target.checked)}
                  className="rounded text-slate-800"
                />
                <span>معاينة أبيض وأسود (Print Mode)</span>
              </label>
            </div>
          </div>

          {/* Scaled Printable A4 Sheet Paper */}
          <div
            id="printable-a4-technical-report"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className={`a4-paper text-slate-900 space-y-5 text-xs leading-relaxed font-sans shadow-2xl relative bg-white p-8 border border-slate-300 min-h-[1120px] transition-all ${
              isBlackAndWhiteMode ? 'filter grayscale contrast-125' : ''
            }`}
          >
            {/* Watermark Overlay */}
            {config.watermark !== 'بدون' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 rotate-[320deg] select-none z-0">
                <span className="text-7xl font-black uppercase text-slate-900 border-8 border-slate-900 p-6 rounded-3xl">
                  {config.watermark}
                </span>
              </div>
            )}

            {/* Official Ministry Header */}
            {config.includeLogo && (
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3 relative z-10">
                <div className="text-right space-y-0.5">
                  <p className="font-black text-sm text-slate-900">الجمهورية اليمنية</p>
                  <p className="font-bold text-xs text-slate-800">وزارة الاتصالات وتقنية المعلومات</p>
                  <p className="text-[10px] text-slate-600">الإدارة العامة لتنظيم الاتصالات • المكتب الفني</p>
                </div>

                <MinistryLogo className="w-12 h-12 text-amber-700 mx-auto" />

                <div className="flex items-center gap-2 text-left">
                  {config.includeQrCode && (
                    <div className="w-14 h-14 border border-slate-900 p-0.5 bg-slate-50 flex items-center justify-center">
                      <QrCode className="w-12 h-12 text-slate-900" />
                    </div>
                  )}
                  <div className="font-mono text-[9px] text-slate-700">
                    <p className="font-bold text-slate-900 text-[10px]">الموافقة النوعية</p>
                    <p>المرجع: {config.referenceNumber}</p>
                    <p>الطلب: {currentRequest.requestNumber}</p>
                    <p>التاريخ: {config.preparedDate}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Title Banner */}
            <div className="bg-slate-100 p-3 rounded-lg border border-slate-300 text-center space-y-1 relative z-10">
              <h1 className="font-black text-sm text-slate-900">{config.reportTitle}</h1>
              <p className="text-[11px] text-slate-700 font-bold">
                الجهاز: {currentRequest.brand} {currentRequest.model} | المورد: {currentRequest.localRep.companyName}
              </p>
            </div>

            {/* Page 1 Executive Summary Dashboard */}
            <div className="relative z-10">
              <ExecutiveSummaryDashboard request={currentRequest} isPrintMode={isBlackAndWhiteMode} />
            </div>

            {/* 18 Dynamic Report Sections */}
            <div className="space-y-4 relative z-10 pt-2">
              {sections
                .filter((s) => s.isVisible)
                .map((sec) => (
                  <div key={sec.id} className="space-y-1.5 border-b border-slate-200 pb-3">
                    <h3 className="font-extrabold text-xs text-blue-900 bg-slate-100 px-2 py-1 rounded border-r-4 border-blue-600">
                      {sec.title}
                    </h3>

                    {sec.id === 'sec1' && (
                      <p className="text-[11px] text-slate-800 leading-relaxed">
                        يتضمن هذا التقرير نتائج المراجعة الشاملة لطلب الموافقة النوعية للجهاز المذكور، وقد تمت دراسة كافة البيانات الفنية واختبارات الأمان الكهربائي والكهرومغناطيسي، وأثبتت نتائج المطابقة استيفاء المنتج لمعايير الخدمة الوزارية المعتمدة.
                      </p>
                    )}

                    {sec.id === 'sec2' && (
                      <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-50 p-2 rounded border border-slate-200 font-mono">
                        <p><span className="font-bold text-slate-600">رقم الطلب:</span> {currentRequest.requestNumber}</p>
                        <p><span className="font-bold text-slate-600">مقدم الطلب:</span> {currentRequest.applicantName}</p>
                        <p><span className="font-bold text-slate-600">الممثل المحلي:</span> {currentRequest.localRep.companyName}</p>
                        <p><span className="font-bold text-slate-600">الشركة المصنعة:</span> {currentRequest.manufacturer.name}</p>
                        <p><span className="font-bold text-slate-600">العلامة التجارية:</span> {currentRequest.brand}</p>
                        <p><span className="font-bold text-slate-600">الموديل المعتمد:</span> {currentRequest.model}</p>
                      </div>
                    )}

                    {sec.id === 'sec3' && (
                      <table className="w-full text-right text-[10px] border-collapse border border-slate-300">
                        <thead>
                          <tr className="bg-slate-100 font-bold">
                            <th className="border p-1">نوع المستند</th>
                            <th className="border p-1">اسم الملف</th>
                            <th className="border p-1">نتيجة المراجعة</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentRequest.documents.slice(0, 3).map((d) => (
                            <tr key={d.id}>
                              <td className="border p-1 font-bold">{d.type}</td>
                              <td className="border p-1 font-mono">{d.name}</td>
                              <td className="border p-1 text-emerald-800 font-bold">مقبول ومطابق</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    {sec.id === 'sec13' && (
                      <p className="text-[11px] text-slate-800">
                        {currentRequest.initialStudyContent.requestContext || 'تم التحليل الفني بناءً على المعايير المعتمدة وإثبات التوافق مع الاشتراطات اللائحية.'}
                      </p>
                    )}

                    {sec.id === 'sec15' && (
                      <div className="p-2 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-950">
                        <p className="font-bold">التوصية الفنية المعتمدة:</p>
                        <p className="mt-0.5 font-bold text-blue-900">
                          {currentRequest.technicalOpinion.finalRecommendation.replace(/_/g, ' ')}
                        </p>
                      </div>
                    )}

                    {sec.id === 'sec16' && (
                      <div className="p-2.5 bg-emerald-100 border border-emerald-300 rounded font-bold text-emerald-950 text-xs">
                        القرار النهائي: موافقة نوعية رسمية معتمدة لإصدار الشهادة الفنية.
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {/* Approval Workflow Block */}
            {config.includeSignatures && (
              <div className="pt-6 relative z-10 border-t-2 border-slate-900">
                <ApprovalWorkflowPanel
                  signers={signers}
                  onUpdateSigners={setSigners}
                  isPrintMode={isBlackAndWhiteMode}
                />
              </div>
            )}

            {/* Footer */}
            <div className="pt-6 border-t flex justify-between items-center text-[9px] text-slate-500 font-mono relative z-10">
              <span>صفحة 1 من 1</span>
              <span>وثيقة رسمية صادرة من نظام الموافقة النوعية - وزارة الاتصالات وتقنية المعلومات</span>
            </div>
          </div>
        </div>

        {/* LEFT PANEL: Validation Checklist & History Log (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Pre-approval Validation Checklist */}
          <ReportValidationChecklist items={validationItems} />

          {/* Report Version History Widget */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <History className="w-4 h-4 text-amber-600" />
                <span>سجل نسخ التقرير</span>
              </h3>
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 text-xs">
              <div className="flex justify-between font-mono font-bold text-slate-800 dark:text-slate-200">
                <span>النسخة v1.0 (الحالية)</span>
                <span className="text-emerald-600">مسودة</span>
              </div>
              <p className="text-[10px] text-slate-500">إنشاء السجل الأساسي للتقرير الفني النهائي.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Change Log Timeline */}
      <ChangeLogViewer />
    </div>
  );
};
