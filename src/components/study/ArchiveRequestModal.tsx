/**
 * @file ArchiveRequestModal.tsx
 * Archive Request & Synchronization Modal.
 * Simulates exporting request data and approved certificate to external archive services:
 * Nextcloud WebDAV Cloud Drive, Local PC File Directory, or Ministry External Archival API,
 * with live progress simulation, checksum calculation, and success status confirmation.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Archive,
  Cloud,
  FolderArchive,
  HardDrive,
  CheckCircle2,
  X,
  Upload,
  RefreshCw,
  Server,
  FileCheck,
  ShieldCheck,
  Copy,
  Check,
} from 'lucide-react';

interface ArchiveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchiveRequestModal: React.FC<ArchiveRequestModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentRequest, addToast, addAuditLog } = useApp();

  const [syncTarget, setSyncTarget] = useState<'nextcloud' | 'local_pc' | 'ministry_api'>('nextcloud');
  const [localPath, setLocalPath] = useState<string>('C:\\MOCI_Archives\\2026\\TypeApproval\\');
  const [nextcloudUrl, setNextcloudUrl] = useState<string>(
    'https://cloud.moci.gov.ye/remote.php/dav/files/archive/type_approval/'
  );

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncProgress, setSyncProgress] = useState<number>(0);
  const [syncStepText, setSyncStepText] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [archiveRefId, setArchiveRefId] = useState<string>('');
  const [archiveChecksum, setArchiveChecksum] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleStartArchiving = () => {
    setIsSyncing(true);
    setSyncProgress(10);
    setSyncStepText('تجميع البيانات الهيكلية وملفات المرفقات المعتمدة...');
    setIsCompleted(false);

    // Simulated sync steps
    setTimeout(() => {
      setSyncProgress(35);
      setSyncStepText('إنشاء وثيقة XML/JSON وتوليد شهادة PDF الرسمية وتقرير الفحص...');
    }, 1200);

    setTimeout(() => {
      setSyncProgress(70);
      setSyncStepText(
        syncTarget === 'nextcloud'
          ? 'المزامنة عبر بروتوكول WebDAV مع سحابة Nextcloud الوزارية...'
          : syncTarget === 'local_pc'
          ? `حفظ وتوثيق الشحنة الرقمية المرمزة في المسار المحلي (${localPath})...`
          : 'التصدير إلى البوابة الوطنية للأرشيف الحكومي الموحد (G2G)...'
      );
    }, 2500);

    setTimeout(() => {
      setSyncProgress(100);
      const generatedRef = `ARC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const generatedHash = `sha256:${Array.from({ length: 16 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`;

      setArchiveRefId(generatedRef);
      setArchiveChecksum(generatedHash);
      setIsSyncing(false);
      setIsCompleted(true);

      addToast({
        type: 'success',
        title: 'تمت أرشفة ومزامنة الطلب بنجاح',
        message: `تم أرشفة الطلب (${currentRequest.requestNumber}) برقم مرجعي (${generatedRef}).`,
      });

      addAuditLog({
        userName: 'م. أحمد باصريح',
        userRole: 'معد التقرير الفني',
        action: 'أرشفة ومزامنة بيانات الطلب والشهادة',
        department: 'وحدة الأرشفة الإلكترونية',
        previousValue: 'طلب غير مؤرشف',
        newValue: generatedRef,
        reason: `مزامنة خارجية عبر ${syncTarget.toUpperCase()}`,
        details: `المسار/الرابط: ${syncTarget === 'nextcloud' ? nextcloudUrl : localPath}`,
        requestNumber: currentRequest.requestNumber,
      });
    }, 4000);
  };

  const copyRefCode = () => {
    navigator.clipboard.writeText(`${archiveRefId} (${archiveChecksum})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden space-y-4">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-amber-500/20 border border-amber-500/40 text-amber-400 rounded-xl">
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <span>أرشفة ومزامنة بيانات الطلب (External Request Archiving)</span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-extrabold">
                  Nextcloud / Local Directory
                </span>
              </h3>
              <p className="text-[11px] text-slate-300">
                تصدير السجل الكامل، الشهادات، والمرفقات إلى الأرشيف الوزاري الموحد
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Target Storage Options Selector */}
          <div className="space-y-2">
            <span className="font-extrabold text-slate-700 dark:text-slate-300 text-xs block">
              اختر وُجهة المزامنة والأرشفة الخارجية:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => setSyncTarget('nextcloud')}
                className={`p-3 rounded-xl border text-right transition flex flex-col justify-between space-y-2 ${
                  syncTarget === 'nextcloud'
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/30 text-blue-900 dark:text-blue-200'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Cloud className="w-5 h-5 text-blue-500" />
                  {syncTarget === 'nextcloud' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </div>
                <div>
                  <h5 className="font-extrabold text-xs">سحابة Nextcloud</h5>
                  <p className="text-[10px] opacity-80">مزامنة مباشر WebDAV</p>
                </div>
              </button>

              <button
                onClick={() => setSyncTarget('local_pc')}
                className={`p-3 rounded-xl border text-right transition flex flex-col justify-between space-y-2 ${
                  syncTarget === 'local_pc'
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/30 text-blue-900 dark:text-blue-200'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <HardDrive className="w-5 h-5 text-indigo-500" />
                  {syncTarget === 'local_pc' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </div>
                <div>
                  <h5 className="font-extrabold text-xs">مسار محلي بـ الكمبيوتر</h5>
                  <p className="text-[10px] opacity-80">Local Directory</p>
                </div>
              </button>

              <button
                onClick={() => setSyncTarget('ministry_api')}
                className={`p-3 rounded-xl border text-right transition flex flex-col justify-between space-y-2 ${
                  syncTarget === 'ministry_api'
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/30 text-blue-900 dark:text-blue-200'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Server className="w-5 h-5 text-purple-500" />
                  {syncTarget === 'ministry_api' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </div>
                <div>
                  <h5 className="font-extrabold text-xs">الأرشيف الحكومي (G2G)</h5>
                  <p className="text-[10px] opacity-80">Ministry Central API</p>
                </div>
              </button>
            </div>
          </div>

          {/* Configuration Inputs */}
          {syncTarget === 'nextcloud' && (
            <div className="space-y-1 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block">
                رابط خادم Nextcloud ومسار المجلد:
              </label>
              <input
                type="text"
                value={nextcloudUrl}
                onChange={(e) => setNextcloudUrl(e.target.value)}
                className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-xs dir-ltr text-left"
              />
            </div>
          )}

          {syncTarget === 'local_pc' && (
            <div className="space-y-1 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block">
                المسار المحلي في جهاز المراجع (Local File Path):
              </label>
              <input
                type="text"
                value={localPath}
                onChange={(e) => setLocalPath(e.target.value)}
                className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-xs dir-ltr text-left"
              />
            </div>
          )}

          {/* Progress Bar during Sync */}
          {isSyncing && (
            <div className="p-4 bg-blue-50/80 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-800 rounded-xl space-y-2 animate-pulse">
              <div className="flex items-center justify-between text-xs font-bold text-blue-900 dark:text-blue-200">
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                  <span>{syncStepText}</span>
                </span>
                <span className="font-mono">{syncProgress}%</span>
              </div>

              <div className="w-full bg-blue-200 dark:bg-blue-900 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${syncProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Success Banner */}
          {isCompleted && (
            <div className="p-4 bg-emerald-50/90 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl space-y-3 animate-fade-in">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <div>
                  <h4 className="font-extrabold text-xs text-emerald-900 dark:text-emerald-200">
                    اكتملت أرشفة الطلب ومزامنته بنجاح!
                  </h4>
                  <p className="text-[10px] text-emerald-800 dark:text-emerald-300">
                    تم إنشاء وتوزيع السجل الأرشيفي الشامل وحفظ النسخة المعتمدة بسلامة تشفيرية عالية.
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-emerald-200 dark:border-emerald-900 text-xs font-mono space-y-1">
                <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-slate-500">الرقم المرجعي للأرشفة:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{archiveRefId}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-slate-500">بصمة التشفير (SHA-256):</span>
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 truncate max-w-[200px]">
                    {archiveChecksum}
                  </span>
                </div>
              </div>

              <button
                onClick={copyRefCode}
                className="w-full py-1.5 bg-emerald-100 dark:bg-emerald-900/60 hover:bg-emerald-200 text-emerald-900 dark:text-emerald-200 font-bold rounded-lg text-xs transition flex items-center justify-center gap-1.5"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'تم نسخ الرمز المرجعي' : 'نسخ رقم الأرشيف والبصمة الرقمية'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="bg-slate-50 dark:bg-slate-800/80 p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition"
          >
            إغلاق
          </button>

          {!isCompleted && (
            <button
              onClick={handleStartArchiving}
              disabled={isSyncing}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white rounded-xl text-xs font-extrabold transition flex items-center gap-2 shadow-md"
            >
              <Upload className="w-4 h-4 text-amber-200" />
              <span>بدء أرشفة ومزامنة الطلب الآن</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
