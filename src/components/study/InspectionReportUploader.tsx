/**
 * @file InspectionReportUploader.tsx
 * Field & Laboratory Inspection Report Uploader with Drag & Drop capability.
 * Allows reviewers to drag and drop inspection files, view thumbnails/previews,
 * and link field measurement reports to the active type approval request.
 */

import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  Eye,
  Trash2,
  Download,
  File,
  Sparkles,
  ShieldCheck,
  Building,
  UserCheck,
  Clock,
  Plus,
} from 'lucide-react';

export interface InspectionReportItem {
  id: string;
  requestNumber: string;
  fileName: string;
  fileSize: string;
  fileType: 'pdf' | 'image' | 'document';
  uploadDate: string;
  inspectorName: string;
  labName: string;
  resultStatus: 'مطابق' | 'تحت_المراجعة' | 'ملاحظات_فنية';
  notes: string;
  previewUrl?: string;
}

export const InspectionReportUploader: React.FC = () => {
  const { currentRequest, addToast, addAuditLog } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [selectedReportForView, setSelectedReportForView] = useState<InspectionReportItem | null>(null);

  // Pre-populated inspection reports list linked to requests
  const [reportsList, setReportsList] = useState<InspectionReportItem[]>([
    {
      id: 'ir-101',
      requestNumber: currentRequest.requestNumber,
      fileName: 'تقرير_الفحص_الميداني_ومعايرة_القدرة_EIRP.pdf',
      fileSize: '2.4 MB',
      fileType: 'pdf',
      uploadDate: '2026-07-28 10:30',
      inspectorName: 'م. خالد العبسي',
      labName: 'المختبر القومي للقياسات الاتصالية - صنعاء',
      resultStatus: 'مطابق',
      notes: 'تم فحص انبعاثات النطاق المزدوج وتأكيد عدم وجود تداخلات خارج النطاق المخصص.',
    },
    {
      id: 'ir-102',
      requestNumber: currentRequest.requestNumber,
      fileName: 'نتائج_اختبار_المواصفات_الكهرومغناطيسية_EMC.png',
      fileSize: '1.1 MB',
      fileType: 'image',
      uploadDate: '2026-07-29 14:15',
      inspectorName: 'م. سمير القاضي',
      labName: 'وحدة الفحص بالمنافذ الجمركية',
      resultStatus: 'مطابق',
      previewUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      notes: 'صورة لوحة القياس الفنية أثناء الضغط التشغيلي المكثف.',
    },
  ]);

  // Form input for new report metadata
  const [inspectorName, setInspectorName] = useState('م. عبدالجليل حميد');
  const [labName, setLabName] = useState('مركز المعايرة والفحص الفني بالوزارة');
  const [reportNotes, setReportNotes] = useState('');

  // Drag Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = (files: File[]) => {
    files.forEach((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      let fileType: 'pdf' | 'image' | 'document' = 'document';
      if (ext === 'pdf') fileType = 'pdf';
      else if (['png', 'jpg', 'jpeg', 'webp'].includes(ext || '')) fileType = 'image';

      const newReport: InspectionReportItem = {
        id: `ir-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        requestNumber: currentRequest.requestNumber,
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        fileType,
        uploadDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
        inspectorName: inspectorName || 'المفتش الفني',
        labName: labName || 'مختبر الفحص القومي',
        resultStatus: 'مطابق',
        notes: reportNotes || 'تقرير فحص ميداني مرفوع حديثاً بانتظار الاعتماد النهائي.',
      };

      setReportsList((prev) => [newReport, ...prev]);

      addToast({
        type: 'success',
        title: 'تم إدراج تقرير الفحص الميداني',
        message: `تم رفع ملف (${file.name}) وربطه بالطلب (${currentRequest.requestNumber}) بنجاح.`,
      });

      addAuditLog({
        userName: inspectorName,
        userRole: 'مهندس فحص ميداني',
        action: 'رفع تقرير فحص واختبار ميداني جديد',
        department: 'مختبر الفحص المعايري',
        previousValue: 'لا يوجد تقرير فحص متكامل',
        newValue: file.name,
        reason: 'إرفاق نتائج الفحص الميداني لاختبار قدرة الهوائيات والتوافقيات',
        details: `اسم المختبر: ${labName} | الحجم: ${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        requestNumber: currentRequest.requestNumber,
      });
    });

    setReportNotes('');
  };

  const handleDeleteReport = (id: string, name: string) => {
    setReportsList((prev) => prev.filter((r) => r.id !== id));
    addToast({
      type: 'info',
      title: 'تم حذف تقرير الفحص',
      message: `تم إزالة الملف (${name}) من قائمة تقارير الطلب.`,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4 font-sans text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 rounded-xl">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>رفع ومعاينة تقارير الفحص الميداني (Inspection Report Uploader)</span>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded-full text-[10px] font-bold border border-blue-200 dark:border-blue-800">
                سحب وإسقاط D&D
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              ربط وثائق الفحص الميداني والمعايرة المختبرية بالطلب الحالي ({currentRequest.requestNumber})
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
          {reportsList.length} تقارير مرفقة
        </span>
      </div>

      {/* Metadata Form & Drag and Drop Zone */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Form Inputs (4 Cols) */}
        <div className="lg:col-span-5 bg-slate-50/70 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-2.5">
          <span className="font-extrabold text-slate-900 dark:text-slate-100 text-[11px] block flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>بيانات جهة ومسؤول الفحص الميداني:</span>
          </span>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block">
              اسم المهندس / المفتش المسؤول:
            </label>
            <input
              type="text"
              value={inspectorName}
              onChange={(e) => setInspectorName(e.target.value)}
              className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-bold text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block">
              اسم المختبر / مركز القياس الفني:
            </label>
            <input
              type="text"
              value={labName}
              onChange={(e) => setLabName(e.target.value)}
              className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-bold text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block">
              ملخص الملاحظات والنتائج الفنية:
            </label>
            <textarea
              rows={2}
              value={reportNotes}
              onChange={(e) => setReportNotes(e.target.value)}
              placeholder="اكتب أية ملاحظات تم رصدها أثناء القياس اللاسلكي بالميدان..."
              className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-sans text-xs"
            />
          </div>
        </div>

        {/* Dropzone Area (7 Cols) */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`lg:col-span-7 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center space-y-2 relative overflow-hidden ${
            isDragging
              ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/40 ring-4 ring-blue-500/20'
              : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 bg-slate-50/40 dark:bg-slate-800/20 hover:bg-slate-100/60'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            multiple
            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
          />

          <div className="p-3 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300 rounded-full shadow-inner">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div>
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100">
              اسحب وأسقط تقرير الفحص الميداني هنا أو انقر للاستعراض
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              يدعم صيغ الملفات (PDF, PNG, JPG, DOCX) بحجم أقصى 25 ميجابايت للملف
            </p>
          </div>

          <span className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded-lg shadow-2xs">
            اختر ملف من الجهاز
          </span>
        </div>
      </div>

      {/* Reports Thumbnail Preview Cards List */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
          تقارير الفحص الميداني المرتبطة بالطلب الحالي:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {reportsList.map((rep) => (
            <div
              key={rep.id}
              className="p-3 bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2 relative flex flex-col justify-between hover:shadow-xs transition"
            >
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {rep.fileType === 'pdf' ? (
                      <div className="p-2 bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 rounded-lg shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                    ) : rep.fileType === 'image' ? (
                      <div className="p-2 bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 rounded-lg shrink-0">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="p-2 bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 rounded-lg shrink-0">
                        <File className="w-4 h-4" />
                      </div>
                    )}

                    <div>
                      <h5 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">
                        {rep.fileName}
                      </h5>
                      <p className="text-[10px] font-mono text-slate-400">
                        {rep.fileSize} • {rep.uploadDate}
                      </p>
                    </div>
                  </div>

                  <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 text-[10px] font-bold rounded">
                    {rep.resultStatus}
                  </span>
                </div>

                {/* Optional Image Thumbnail Preview */}
                {rep.previewUrl && (
                  <div className="h-24 w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 relative bg-slate-900">
                    <img
                      src={rep.previewUrl}
                      alt={rep.fileName}
                      className="w-full h-full object-cover opacity-90 hover:opacity-100 transition"
                    />
                    <span className="absolute bottom-1 right-1 bg-slate-900/80 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                      معاينة الصورة الميدانية
                    </span>
                  </div>
                )}

                <div className="text-[10px] text-slate-600 dark:text-slate-400 space-y-0.5 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <p className="flex items-center gap-1 font-bold">
                    <UserCheck className="w-3 h-3 text-blue-500" />
                    <span>المفتش: {rep.inspectorName}</span>
                  </p>
                  <p className="flex items-center gap-1 font-mono text-slate-500">
                    <Building className="w-3 h-3 text-slate-400" />
                    <span>{rep.labName}</span>
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 italic pt-0.5">
                    "{rep.notes}"
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setSelectedReportForView(rep)}
                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold rounded-lg text-[10px] transition flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-500" />
                  <span>عرض ومعاينة التقرير</span>
                </button>

                <button
                  onClick={() => handleDeleteReport(rep.id, rep.fileName)}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                  title="حذف التقرير"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for viewing selected report details */}
      {selectedReportForView && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>تفاصيل تقرير الفحص الميداني المعاين</span>
              </h4>

              <button
                onClick={() => setSelectedReportForView(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-800 dark:text-slate-200">
              <p>
                <strong className="text-slate-500">اسم الملف:</strong> {selectedReportForView.fileName}
              </p>
              <p>
                <strong className="text-slate-500">الطلب المرتبط:</strong> {selectedReportForView.requestNumber}
              </p>
              <p>
                <strong className="text-slate-500">المفتش المسؤول:</strong> {selectedReportForView.inspectorName}
              </p>
              <p>
                <strong className="text-slate-500">المختبر:</strong> {selectedReportForView.labName}
              </p>
              <p>
                <strong className="text-slate-500">ملاحظات القياس:</strong> {selectedReportForView.notes}
              </p>

              {selectedReportForView.previewUrl && (
                <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                  <img
                    src={selectedReportForView.previewUrl}
                    alt="Inspection"
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedReportForView(null)}
                className="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-xl text-xs"
              >
                إغلاق المعاينة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
