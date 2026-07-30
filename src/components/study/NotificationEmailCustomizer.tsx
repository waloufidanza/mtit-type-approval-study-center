/**
 * @file NotificationEmailCustomizer.tsx
 * Interactive Notification & Email Customization Unit.
 * Allows reviewers/issuers to customize automated emails sent to applicants upon certificate issuance.
 * Includes template presets, dynamic tag insertion, live message preview, and simulated email dispatch.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mail,
  Send,
  CheckCircle2,
  Paperclip,
  FileText,
  Sparkles,
  Eye,
  Sliders,
  UserCheck,
  Tag,
  Clock,
  Loader2,
  RefreshCw,
  X,
  ShieldCheck,
} from 'lucide-react';

export interface NotificationEmailCustomizerProps {
  applicantName: string;
  applicantEmail: string;
  certificateNumber: string;
  brandModel: string;
  expiryDate: string;
  onRequestClose?: () => void;
}

export const NotificationEmailCustomizer: React.FC<NotificationEmailCustomizerProps> = ({
  applicantName,
  applicantEmail,
  certificateNumber,
  brandModel,
  expiryDate,
  onRequestClose,
}) => {
  const { addToast, addAuditLog } = useApp();

  // Form States
  const [recipient, setRecipient] = useState<string>(applicantEmail || 'info@sabafon.com.ye');
  const [subject, setSubject] = useState<string>(
    `إشعار صدور شهادة الموافقة النوعية المعتمدة - رقم الشهادة (${certificateNumber})`
  );
  const [emailBody, setEmailBody] = useState<string>(
    `السادة/ {APPLICANT_NAME} المحترمون،\n\nتحية طيبة وبعد،،،\n\nتود وزارة الاتصالات وتقنية المعلومات - الإدارة العامة لتنظيم الاتصالات إفادتكم بأنه قد تم بحمد الله اعتماد وإصدار "شهادة الموافقة النوعية الرسمية" للجهـاز والمعدة التالية:\n\n• الموديل والعلامة: {BRAND_MODEL}\n• رقم الوثيقة المعتمدة: {CERTIFICATE_NO}\n• تاريخ الانتهاء المعتمد: {EXPIRY_DATE}\n\nيمكنكم تحميل وثيقة الشهادة الرسمية المرفقة الموقعة والمختومة رقمياً أو التحقق منها عبر منصة الوزارة الإلكترونية باستخدام رمز الـ QR.\n\nشاكرين تعاونكم مع معايير الجودة القومية.\n\nوتقبلوا فائق الاحترام والتقدير،،\nالمكتب الفني - الإدارة العامة لتنظيم الاتصالات`
  );
  const [attachPdf, setAttachPdf] = useState<boolean>(true);
  const [attachQrLink, setAttachQrLink] = useState<boolean>(true);

  // Dispatch Animation States
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendProgress, setSendProgress] = useState<number>(0);
  const [sendStepText, setSendStepText] = useState<string>('');
  const [sentSuccess, setSentSuccess] = useState<boolean>(false);

  // Dynamic Tags Replacements
  const renderCompiledBody = (templateStr: string) => {
    return templateStr
      .replace(/{APPLICANT_NAME}/g, applicantName || 'المستورد المعتمد')
      .replace(/{CERTIFICATE_NO}/g, certificateNumber || 'TA-2026-88392')
      .replace(/{BRAND_MODEL}/g, brandModel || 'Huawei AirEngine 8760-X1-PRO')
      .replace(/{EXPIRY_DATE}/g, expiryDate || '2029-07-29');
  };

  const insertTag = (tag: string) => {
    setEmailBody((prev) => prev + ` ${tag} `);
  };

  // Simulated Email Dispatch Handler
  const handleSendEmail = () => {
    if (!recipient.trim() || !subject.trim()) {
      addToast({
        type: 'error',
        title: 'بيانات غير مكتملة',
        message: 'يرجى إدخال البريد الإلكتروني للعنوان والموضوع بشكل صحيح قبل الإرسال.',
      });
      return;
    }

    setIsSending(true);
    setSendProgress(15);
    setSendStepText('تجميع عناصر الشهادة وتوليد ملف الـ PDF المعتمد...');

    setTimeout(() => {
      setSendProgress(50);
      setSendStepText('التشفير الأمن ونقل الرسالة عبر سيرفر البريد القومي (SMTP Gateway)...');
    }, 1000);

    setTimeout(() => {
      setSendProgress(85);
      setSendStepText('تأكيد استلام صندوق وارد المستورد وتحديث السجل...');
    }, 2000);

    setTimeout(() => {
      setSendProgress(100);
      setIsSending(false);
      setSentSuccess(true);

      addToast({
        type: 'success',
        title: 'تم إرسال الإشعار الإلكتروني بنجاح',
        message: `تم تسليم إشعار صدور الشهادة (${certificateNumber}) إلى بريد (${recipient}) بنجاح.`,
      });

      addAuditLog({
        userName: 'معد الشهادات - نظام الإشعارات',
        userRole: 'مسؤول إصدار شهادات',
        action: 'إرسال إشعار بريد إلكتروني مخصص بالشهادة',
        department: 'الإدارة العامة لتنظيم الاتصالات',
        previousValue: 'لم يرسل إشعار صدور',
        newValue: `تم الإرسال إلى ${recipient}`,
        reason: 'إشعار المستورد فور صدور شهادة الموافقة النوعية المعتمدة',
        details: `الموضوع: ${subject} | المرفقات: PDF (${attachPdf ? 'نعم' : 'لا'})`,
        requestNumber: certificateNumber,
        ipAddress: '10.20.4.12',
      });
    }, 2800);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 font-sans text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 rounded-xl">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>خدمة وتخصيص إشعارات البريد الآلية (Email Dispatch Service)</span>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 rounded-full text-[10px] font-bold border border-blue-200 dark:border-blue-800">
                محاكاة مباشرة
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              تخصيص وإرسال إشعار صدور الشهادة الرسمية لمقدم الطلب مباشرة مع المرفقات
            </p>
          </div>
        </div>

        {onRequestClose && (
          <button
            onClick={onRequestClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {sentSuccess ? (
        /* Success Screen */
        <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-center space-y-3 animate-fade-in">
          <div className="w-12 h-12 bg-emerald-500 text-white rounded-full mx-auto flex items-center justify-center shadow-md">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h4 className="text-sm font-extrabold text-emerald-950 dark:text-emerald-200">
            تم إرسال البريد الإلكتروني بنجاح لمقدم الطلب!
          </h4>
          <p className="text-xs text-emerald-800 dark:text-emerald-300 max-w-md mx-auto leading-relaxed">
            تم تسليم إشعار صدور الشهادة <strong className="font-mono text-slate-900 dark:text-white">{certificateNumber}</strong> مرفقاً بملف الشهادة PDF المعتمد رقمياً إلى البريد الإلكتروني: <strong className="font-mono">{recipient}</strong>.
          </p>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => setSentSuccess(false)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>إرسال إشعار آخر</span>
            </button>
          </div>
        </div>
      ) : (
        /* Email Composition Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Form Side */}
          <div className="space-y-3 bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            {/* Recipient Email */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 text-[11px] flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                <span>البريد الإلكتروني للجهة المستلمة:</span>
              </label>
              <input
                type="email"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-xs font-bold"
                placeholder="email@company.ye"
              />
            </div>

            {/* Email Subject */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 text-[11px] flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-purple-500" />
                <span>عنوان موضوع الرسالة (Subject Line):</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-bold text-xs"
              />
            </div>

            {/* Quick Dynamic Tags Insert Buttons */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
                إدراج المتغيرات الديناميكية تلقائياً:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { tag: '{APPLICANT_NAME}', label: 'اسم المستورد' },
                  { tag: '{CERTIFICATE_NO}', label: 'رقم الشهادة' },
                  { tag: '{BRAND_MODEL}', label: 'الموديل' },
                  { tag: '{EXPIRY_DATE}', label: 'تاريخ الانتهاء' },
                ].map((item) => (
                  <button
                    key={item.tag}
                    type="button"
                    onClick={() => insertTag(item.tag)}
                    className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/80 dark:hover:bg-blue-900 text-blue-800 dark:text-blue-300 font-mono text-[10px] rounded border border-blue-200 dark:border-blue-800 font-bold transition"
                  >
                    + {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Email Body Textarea */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 text-[11px] block">
                نص الإشعار القابل للتخصيص:
              </label>
              <textarea
                rows={6}
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-sans text-xs leading-relaxed"
              />
            </div>

            {/* Attachments Toggles */}
            <div className="space-y-1.5 pt-1 border-t border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
                المرفقات والروابط المضمنة:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={attachPdf}
                    onChange={(e) => setAttachPdf(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <Paperclip className="w-3.5 h-3.5 text-blue-500" />
                  <span className="font-bold text-[11px] text-slate-800 dark:text-slate-200">
                    إرفاق الشهادة بصيغة PDF
                  </span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={attachQrLink}
                    onChange={(e) => setAttachQrLink(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="font-bold text-[11px] text-slate-800 dark:text-slate-200">
                    تضمين رابط التحقق QR
                  </span>
                </label>
              </div>
            </div>

            {/* Sending Action Button & Progress */}
            {isSending ? (
              <div className="space-y-2 p-3 bg-blue-50 dark:bg-blue-950/50 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between text-xs font-bold text-blue-900 dark:text-blue-200">
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span>جاري إرسال الإشعار...</span>
                  </span>
                  <span className="font-mono">{sendProgress}%</span>
                </div>
                <div className="w-full bg-blue-200 dark:bg-blue-900 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${sendProgress}%` }}
                  />
                </div>
                <p className="text-[10px] text-blue-700 dark:text-blue-300 font-mono text-center">
                  {sendStepText}
                </p>
              </div>
            ) : (
              <button
                onClick={handleSendEmail}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>إرسال الإشعار لمقدم الطلب الآن</span>
              </button>
            )}
          </div>

          {/* Live Preview Side */}
          <div className="space-y-2 bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-700 relative flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
                <span className="flex items-center gap-1.5 text-blue-400 font-extrabold">
                  <Eye className="w-4 h-4" />
                  <span>معاينة حية للبريد الإلكتروني (Live Email Preview)</span>
                </span>
                <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] font-mono">
                  صندوق الوارد
                </span>
              </div>

              {/* Email Envelope Fields */}
              <div className="space-y-1 text-[11px] font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <p>
                  <strong className="text-slate-400">إلى:</strong> <span className="text-emerald-400">{recipient}</span>
                </p>
                <p>
                  <strong className="text-slate-400">من:</strong> <span className="text-blue-300">notifications@mti.gov.ye</span>
                </p>
                <p className="truncate">
                  <strong className="text-slate-400">الموضوع:</strong> <span className="text-amber-300 font-sans font-bold">{subject}</span>
                </p>
              </div>

              {/* Formatted Mail Content Card */}
              <div className="bg-white text-slate-900 p-3.5 rounded-lg shadow-inner space-y-2 font-sans text-xs whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                  <span className="font-extrabold text-blue-900 text-[11px]">
                    الجمهورية اليمنية - وزارة الاتصالات وتقنية المعلومات
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">2026-07-30</span>
                </div>

                <p className="text-xs">{renderCompiledBody(emailBody)}</p>

                {/* Attachment Badges */}
                {(attachPdf || attachQrLink) && (
                  <div className="pt-2 border-t border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 block">الملفات المرفقة بالرسالة:</span>
                    <div className="flex flex-wrap gap-2 text-[10px]">
                      {attachPdf && (
                        <div className="px-2 py-1 bg-rose-50 text-rose-900 border border-rose-300 rounded font-bold flex items-center gap-1">
                          <Paperclip className="w-3 h-3 text-rose-600" />
                          <span>{certificateNumber}_Signed.pdf</span>
                        </div>
                      )}
                      {attachQrLink && (
                        <div className="px-2 py-1 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>رابط التحقق السريع QR</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <p className="text-[10px] text-slate-500 font-mono text-center pt-2">
              🔒 الرسالة مشفرة ببروتوكول الأمان TLS للمرسلين المعتمدين من الوزارة.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
