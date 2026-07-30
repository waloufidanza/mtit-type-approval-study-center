/**
 * @file syncService.ts
 * SyncService Abstraction for synchronizing Technical Reports & Certificates
 * to Nextcloud Cloud Storage or Local Directory Archives.
 * Supports auto-sync, retry logic, status tracking, and file audit logs.
 */

export interface SyncedFileItem {
  id: string;
  fileName: string;
  fileType: 'تقرير فني نهائي' | 'شهادة موافقة نوعية' | 'مرفق فني' | 'سجل اعتمادات';
  sizeBytes: number;
  sha256Hash: string;
  syncedAt: string;
  status: 'ناجح' | 'فشل' | 'جاري التحميل';
}

export interface SyncRecord {
  requestNumber: string;
  targetDestination: 'Nextcloud' | 'LocalDrive';
  nextcloudUrl?: string;
  localPath?: string;
  syncStatus: 'متزامن' | 'قيد المزامنة' | 'متعثر' | 'لم يبدأ';
  lastSyncTime?: string;
  totalFilesCount: number;
  syncedFilesCount: number;
  files: SyncedFileItem[];
  errorMessage?: string;
  retryAttempts: number;
}

export interface SyncGlobalConfig {
  autoSyncOnApprove: boolean;
  defaultDestination: 'Nextcloud' | 'LocalDrive';
  nextcloudServerUrl: string;
  nextcloudFolder: string;
  localStoragePath: string;
  retryIntervalMinutes: number;
  maxRetryAttempts: number;
  enableEncryption: boolean;
}

class SyncService {
  private globalConfig: SyncGlobalConfig = {
    autoSyncOnApprove: true,
    defaultDestination: 'Nextcloud',
    nextcloudServerUrl: 'https://cloud.telecom.gov.ye/remote.php/dav/files/type_approval/',
    nextcloudFolder: '/تقارير_الموافقة_النوعية/2026/',
    localStoragePath: '/var/archive/telecom/type_approval_docs/',
    retryIntervalMinutes: 5,
    maxRetryAttempts: 3,
    enableEncryption: true,
  };

  private syncRecordsStore: Map<string, SyncRecord> = new Map();

  constructor() {
    // Seed initial mock records for sample requests
    this.seedMockRecords();
  }

  private seedMockRecords() {
    this.syncRecordsStore.set('REQ-2026-8921', {
      requestNumber: 'REQ-2026-8921',
      targetDestination: 'Nextcloud',
      nextcloudUrl: 'https://cloud.telecom.gov.ye/remote.php/dav/files/type_approval/REQ-2026-8921/',
      syncStatus: 'متزامن',
      lastSyncTime: '2026-07-30 14:22:10',
      totalFilesCount: 3,
      syncedFilesCount: 3,
      retryAttempts: 0,
      files: [
        {
          id: 'sf1',
          fileName: 'Final-Technical-Report-8921.pdf',
          fileType: 'تقرير فني نهائي',
          sizeBytes: 2458900,
          sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          syncedAt: '2026-07-30 14:22:05',
          status: 'ناجح',
        },
        {
          id: 'sf2',
          fileName: 'Certificate-TAC-2026-8921.pdf',
          fileType: 'شهادة موافقة نوعية',
          sizeBytes: 1120400,
          sha256Hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
          syncedAt: '2026-07-30 14:22:08',
          status: 'ناجح',
        },
        {
          id: 'sf3',
          fileName: 'Spectrum-Compliance-Log.json',
          fileType: 'سجل اعتمادات',
          sizeBytes: 420100,
          sha256Hash: '5a2e9b104d2e82110c73292410a562095f32906109a25d20b660f8541a5f6f21',
          syncedAt: '2026-07-30 14:22:10',
          status: 'ناجح',
        },
      ],
    });

    this.syncRecordsStore.set('REQ-2026-8922', {
      requestNumber: 'REQ-2026-8922',
      targetDestination: 'Nextcloud',
      nextcloudUrl: 'https://cloud.telecom.gov.ye/remote.php/dav/files/type_approval/REQ-2026-8922/',
      syncStatus: 'متعثر',
      lastSyncTime: '2026-07-30 11:05:14',
      totalFilesCount: 2,
      syncedFilesCount: 1,
      errorMessage: 'فشل الاتصال بخادم Nextcloud (HTTP 503 Service Unavailable). تعذر رفع التقرير النهائي.',
      retryAttempts: 2,
      files: [
        {
          id: 'sf4',
          fileName: 'Final-Technical-Report-8922.pdf',
          fileType: 'تقرير فني نهائي',
          sizeBytes: 3100200,
          sha256Hash: 'a2b1c3d4e5f60718293a4b5c6d7e8f901a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
          syncedAt: '2026-07-30 11:05:00',
          status: 'فشل',
        },
      ],
    });
  }

  /**
   * Get Global Sync Config
   */
  getGlobalConfig(): SyncGlobalConfig {
    return { ...this.globalConfig };
  }

  /**
   * Update Global Sync Config
   */
  updateGlobalConfig(updatedConfig: Partial<SyncGlobalConfig>) {
    this.globalConfig = { ...this.globalConfig, ...updatedConfig };
  }

  /**
   * Get Sync Record for a given request number
   */
  getSyncRecord(requestNumber: string): SyncRecord {
    if (this.syncRecordsStore.has(requestNumber)) {
      return this.syncRecordsStore.get(requestNumber)!;
    }

    // Default record for new request
    const newRecord: SyncRecord = {
      requestNumber,
      targetDestination: this.globalConfig.defaultDestination,
      nextcloudUrl: `${this.globalConfig.nextcloudServerUrl}${requestNumber}/`,
      localPath: `${this.globalConfig.localStoragePath}${requestNumber}/`,
      syncStatus: 'لم يبدأ',
      totalFilesCount: 0,
      syncedFilesCount: 0,
      retryAttempts: 0,
      files: [],
    };
    this.syncRecordsStore.set(requestNumber, newRecord);
    return newRecord;
  }

  /**
   * Simulate Syncing Files for a request
   */
  async syncRequestFiles(
    requestNumber: string,
    target: 'Nextcloud' | 'LocalDrive' = 'Nextcloud'
  ): Promise<SyncRecord> {
    const record = this.getSyncRecord(requestNumber);
    record.syncStatus = 'قيد المزامنة';
    record.targetDestination = target;
    record.errorMessage = undefined;

    return new Promise((resolve) => {
      setTimeout(() => {
        const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19);

        // Simulated file list generated
        const reportFile: SyncedFileItem = {
          id: `f-${Date.now()}-1`,
          fileName: `Final-Report-${requestNumber}.pdf`,
          fileType: 'تقرير فني نهائي',
          sizeBytes: 2850000,
          sha256Hash: Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2),
          syncedAt: nowStr,
          status: 'ناجح',
        };

        const certFile: SyncedFileItem = {
          id: `f-${Date.now()}-2`,
          fileName: `Type-Approval-Certificate-${requestNumber}.pdf`,
          fileType: 'شهادة موافقة نوعية',
          sizeBytes: 1340000,
          sha256Hash: Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2),
          syncedAt: nowStr,
          status: 'ناجح',
        };

        record.files = [reportFile, certFile];
        record.totalFilesCount = 2;
        record.syncedFilesCount = 2;
        record.syncStatus = 'متزامن';
        record.lastSyncTime = nowStr;
        record.retryAttempts = 0;

        this.syncRecordsStore.set(requestNumber, record);
        resolve({ ...record });
      }, 1200);
    });
  }

  /**
   * Retry Sync if failed
   */
  async retrySync(requestNumber: string): Promise<SyncRecord> {
    const record = this.getSyncRecord(requestNumber);
    record.retryAttempts += 1;
    return this.syncRequestFiles(requestNumber, record.targetDestination);
  }
}

export const syncService = new SyncService();
