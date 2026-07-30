/**
 * @file Step1Context.tsx
 * Step 1: Request Context & Attachments Viewer
 */

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { DocumentItem } from '../../../types/typeApproval';
import { StatusBadge } from '../../common/StatusBadge';
import { DocumentViewerModal } from '../../common/DocumentViewerModal';
import {
  FileText,
  Eye,
  Building,
  User,
  Globe,
  MapPin,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Info,
  Layers,
  FileCheck,
} from 'lucide-react';

export const Step1Context: React.FC = () => {
  const { currentRequest, updateStepStatus, blindReviewMode } = useApp();
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const handleOpenPreview = (doc: DocumentItem) => {
    setSelectedDoc(doc);
    setIsViewerOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Step Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>الخطوة الأولى: سياق الطلب والمرفقات الثبوتية</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            مراجعة أطراف الطلب (المستورد، الوكيل، المصنع) والتحقق الأولي من الوثائق الرسمية المسلمة.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => updateStepStatus('step1', 'معتمدة')}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>اعتماد الخطوة الأولى</span>
          </button>
        </div>
      </div>

      {/* Stakeholders Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Applicant Card */}
        <div className={`border rounded-lg p-3 space-y-2 transition ${
          blindReviewMode
            ? 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-300 dark:border-purple-800'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>مقدم الطلب (المستورد)</span>
            </h3>
            {blindReviewMode ? (
              <span className="text-[10px] font-mono font-bold bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-200 px-1.5 py-0.5 rounded border border-purple-300">
                [سجل محمي - دراسة عمياء]
              </span>
            ) : (
              <span className="text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-900">
                {currentRequest.applicant.crNumber}
              </span>
            )}
          </div>

          <div className="space-y-1 text-xs text-slate-800 dark:text-slate-200">
            <p className="font-extrabold text-slate-900 dark:text-slate-100 text-xs">
              {blindReviewMode ? '██████████ (مستورد معتمد - محمي)' : currentRequest.applicant.name}
            </p>
            <p className="flex items-center gap-1 text-slate-600 dark:text-slate-400 text-[11px]">
              <MapPin className="w-3 h-3 shrink-0" />
              <span>{blindReviewMode ? 'العنوان محمي تحت حساب الدراسة العمياء' : `${currentRequest.applicant.address} - ${currentRequest.applicant.city}`}</span>
            </p>
            <p className="text-slate-700 dark:text-slate-300 text-[11px]">
              التواصل: <span className="font-bold text-slate-900 dark:text-slate-100">{blindReviewMode ? 'م. [تواصل محجب]' : currentRequest.applicant.contactPerson}</span>
            </p>
            <p className="font-mono text-slate-600 dark:text-slate-400 text-[11px]">
              {blindReviewMode ? '+967-77**** | ***@domain.ye' : `${currentRequest.applicant.phone} | ${currentRequest.applicant.email}`}
            </p>
          </div>
        </div>

        {/* Local Representative Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>الممثل المحلي المعتمد</span>
            </h3>
            <span className="text-[10px] font-mono font-bold bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-900">
              التفويض: {currentRequest.localRep.authNumber}
            </span>
          </div>

          <div className="space-y-1 text-xs text-slate-800 dark:text-slate-200">
            <p className="font-extrabold text-slate-900 dark:text-slate-100 text-xs">{currentRequest.localRep.companyName}</p>
            <p className="flex items-center gap-1 text-slate-600 dark:text-slate-400 text-[11px]">
              <Calendar className="w-3 h-3 shrink-0" />
              <span>السريان حتى: {currentRequest.localRep.authValidity}</span>
            </p>
            <p className="text-slate-700 dark:text-slate-300 text-[11px]">
              الممثل: <span className="font-bold text-slate-900 dark:text-slate-100">{currentRequest.localRep.contactPerson}</span>
            </p>
            <p className="font-mono text-slate-600 dark:text-slate-400 text-[11px]">{currentRequest.localRep.phone} | {currentRequest.localRep.email}</p>
          </div>
        </div>

        {/* Manufacturer Info Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>الشركة المصنعة العالمية</span>
            </h3>
            <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              {currentRequest.manufacturer.country}
            </span>
          </div>

          <div className="space-y-1 text-xs text-slate-800 dark:text-slate-200">
            <p className="font-extrabold text-slate-900 dark:text-slate-100 text-xs">{currentRequest.manufacturer.companyName}</p>
            <p className="text-slate-600 dark:text-slate-400 text-[11px]">{currentRequest.manufacturer.factoryAddress}</p>
            <div className="flex items-center gap-1 flex-wrap pt-0.5">
              {currentRequest.manufacturer.qualityCertificates.map((cert, idx) => (
                <span key={idx} className="px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-[10px] font-mono border border-slate-200 dark:border-slate-700">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Attachments Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>جدول الوثائق والمرفقات المرفقة مع الطلب ({currentRequest.documents.length})</span>
            </h3>
          </div>

          <button
            onClick={() => alert('إضافة وثيقة إضافية للطلب')}
            className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded text-xs font-bold transition border border-slate-300 dark:border-slate-700"
          >
            + رفع وثيقة جديدة
          </button>
        </div>

        {/* Dense Attachments Table */}
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-md">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-2 px-3">نوع المستند</th>
                <th className="py-2 px-3">اسم الملف والحجم</th>
                <th className="py-2 px-3">تاريخ الرفع</th>
                <th className="py-2 px-3">القراءة</th>
                <th className="py-2 px-3">المطابقة</th>
                <th className="py-2 px-3 text-center">الصفحات</th>
                <th className="py-2 px-3">ملاحظات المراجع</th>
                <th className="py-2 px-3 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {currentRequest.documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                  <td className="py-1.5 px-3 font-bold text-slate-900 dark:text-slate-100">
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>{doc.docType}</span>
                    </div>
                  </td>
                  <td className="py-1.5 px-3 font-mono">
                    <p className="font-bold text-blue-900 dark:text-blue-300">{doc.fileName}</p>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{doc.fileSize}</span>
                  </td>
                  <td className="py-1.5 px-3 font-mono text-slate-600 dark:text-slate-400">{doc.uploadDate}</td>
                  <td className="py-1.5 px-3">
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                        doc.readStatus === 'مقروء'
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {doc.readStatus}
                    </span>
                  </td>
                  <td className="py-1.5 px-3">
                    <StatusBadge status={doc.matchStatus} size="sm" />
                  </td>
                  <td className="py-1.5 px-3 text-center font-mono font-bold">{doc.totalPages} ص</td>
                  <td className="py-1.5 px-3 text-slate-700 dark:text-slate-300 max-w-xs truncate">{doc.notes}</td>
                  <td className="py-1.5 px-3 text-center">
                    <button
                      onClick={() => handleOpenPreview(doc)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold transition shadow-2xs"
                    >
                      <Eye className="w-3 h-3" />
                      <span>معاينة</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Internal Document Viewer Modal Launcher */}
      <DocumentViewerModal
        document={selectedDoc}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />
    </div>
  );
};
