/**
 * @file SyncStatusPanel.tsx
 * UI Panel displaying the Cloud & Local Drive Sync Status for Reports & Certificates.
 * Integrates with SyncService to trigger manual sync, view Nextcloud/Local drive details,
 * check file hashes, and monitor sync errors/retries.
 */

import React, { useState, useEffect } from 'react';
import { syncService, SyncRecord, SyncedFileItem } from '../../services/syncService';
import {
  Cloud,
  CloudCheck,
  CloudOff,
  RefreshCw,
  FolderCheck,
  HardDrive,
  FileCheck2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
} from 'lucide-react';

interface SyncStatusPanelProps {
  requestNumber?: string;
  onSyncCompleted?: (record: SyncRecord) => void;
  className?: string;
}

export const SyncStatusPanel: React.FC<SyncStatusPanelProps> = ({
  requestNumber = 'REQ-2026-8921',
  onSyncCompleted,
  className = '',
}) => {
  const [record, setRecord] = useState<SyncRecord>(() => syncService.getSyncRecord(requestNumber));
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<'Nextcloud' | 'LocalDrive'>(
    record.targetDestination || 'Nextcloud'
  );

  useEffect(() => {
    setRecord(syncService.getSyncRecord(requestNumber));
  }, [requestNumber]);

  const handleTriggerSync = async () => {
    setIsSyncing(true);
    try {
      const updated = await syncService.syncRequestFiles(requestNumber, selectedTarget);
      setRecord(updated);
      if (onSyncCompleted) onSyncCompleted(updated);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRetry = async () => {
    setIsSyncing(true);
    try {
      const updated = await syncService.retrySync(requestNumber);
      setRecord(updated);
      if (onSyncCompleted) onSyncCompleted(updated);
    } finally {
      setIsSyncing(false);
    }
  };

  const getStatusBadge = () => {
    switch (record.syncStatus) {
      case 'متزامن':
        return (
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 rounded-lg text-[10px] font-extrabold flex items-center gap-1">
            <CloudCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>متزامن مع السحابة</span>
          </span>
        );
      case 'قيد المزامنة':
        return (
          <span className="px-2.5 py-1 bg-blue-100 text-blue-900 border border-blue-300 dark:bg-blue-950 dark:text-blue-200 rounded-lg text-[10px] font-extrabold flex items-center gap-1 animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
            <span>جاري المزامنة...</span>
          </span>
        );
      case 'متعثر':
        return (
          <span className="px-2.5 py-1 bg-rose-100 text-rose-900 border border-rose-300 dark:bg-rose-950 dark:text-rose-200 rounded-lg text-[10px] font-extrabold flex items-center gap-1">
            <CloudOff className="w-3.5 h-3.5 text-rose-600" />
            <span>تعثرت المزامنة</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-slate-100 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 rounded-lg text-[10px] font-bold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>لم تبدأ المزامنة</span>
          </span>
        );
    }
  };

  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-4 font-sans ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span>حالة المزامنة الأرشيفية (Sync Status)</span>
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              أرشفة التقارير والشهادات على سحابة Nextcloud أو المجلدات المحلية
            </p>
          </div>
        </div>

        {getStatusBadge()}
      </div>

      {/* Target Selector & Trigger Action */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
        <div>
          <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">
            وجهة المزامنة المطلوبة:
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedTarget('Nextcloud')}
              className={`flex-1 py-1.5 px-2.5 rounded-lg font-bold border flex items-center justify-center gap-1.5 text-[11px] transition ${
                selectedTarget === 'Nextcloud'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
              }`}
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Nextcloud Cloud</span>
            </button>

            <button
              onClick={() => setSelectedTarget('LocalDrive')}
              className={`flex-1 py-1.5 px-2.5 rounded-lg font-bold border flex items-center justify-center gap-1.5 text-[11px] transition ${
                selectedTarget === 'LocalDrive'
                  ? 'bg-slate-800 text-white border-slate-800 shadow-xs dark:bg-slate-700'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>مجلد محلي أمني</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-end">
          {record.syncStatus === 'متعثر' ? (
            <button
              onClick={handleRetry}
              disabled={isSyncing}
              className="w-full py-1.5 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>إعادة المحاولة ({record.retryAttempts})</span>
            </button>
          ) : (
            <button
              onClick={handleTriggerSync}
              disabled={isSyncing}
              className="w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>مزامنة فورية للطلب</span>
            </button>
          )}
        </div>
      </div>

      {/* Sync Failure Error Notice */}
      {record.syncStatus === 'متعثر' && record.errorMessage && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 rounded-xl text-xs space-y-1 text-rose-900 dark:text-rose-200">
          <div className="flex items-center gap-1.5 font-bold text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>تفاصيل تعثر المزامنة السحابية:</span>
          </div>
          <p className="text-[11px] leading-relaxed opacity-90">{record.errorMessage}</p>
        </div>
      )}

      {/* Destination Details & Paths */}
      <div className="text-[11px] space-y-1.5 p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
          <span className="font-bold flex items-center gap-1">
            <FolderCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>المسار المستهدف:</span>
          </span>
          <span className="font-mono text-[10px] truncate max-w-[220px] dir-ltr text-slate-800 dark:text-slate-200">
            {selectedTarget === 'Nextcloud' ? record.nextcloudUrl : record.localPath}
          </span>
        </div>

        {record.lastSyncTime && (
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
            <span>تاريخ آخر مزامنة ناجحة:</span>
            <span className="font-mono text-slate-800 dark:text-slate-200">{record.lastSyncTime}</span>
          </div>
        )}
      </div>

      {/* Synced Files List */}
      {record.files && record.files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 flex items-center justify-between">
            <span>الملفات المؤرشفة بالعملية ({record.syncedFilesCount}):</span>
            <span className="text-[10px] text-slate-500 font-mono">
              تشفير SHA-256 موثق
            </span>
          </h4>

          <div className="space-y-1.5">
            {record.files.map((file) => (
              <div
                key={file.id}
                className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <p className="font-bold text-[11px] text-slate-900 dark:text-slate-100">{file.fileName}</p>
                    <p className="text-[9px] text-slate-500 dark:text-slate-400 font-mono">
                      {file.fileType} • {(file.sizeBytes / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <div className="text-left">
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                      file.status === 'ناجح'
                        ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {file.status}
                  </span>
                  <p className="text-[8px] font-mono text-slate-400 truncate max-w-[100px] block mt-0.5" title={file.sha256Hash}>
                    HASH: {file.sha256Hash.slice(0, 10)}...
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
