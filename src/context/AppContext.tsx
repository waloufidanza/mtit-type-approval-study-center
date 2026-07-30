/**
 * @file AppContext.tsx
 * Global state management for Ministry Type Approval System
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  TypeApprovalRequest,
  AuditLogEntry,
  StepStatus,
  DeficiencyItem,
  ReferralItem,
  UserAccount,
} from '../types/typeApproval';
import { PRIMARY_REQUEST, MOCK_REQUESTS_LIST, MOCK_AUDIT_LOGS, MOCK_USERS, MOCK_TASKS } from '../mock/typeApprovalData';
import { TaskItem } from '../types/typeApproval';

export type ActiveScreen =
  | 'login'
  | 'dashboard'
  | 'requests'
  | 'studyCenter'
  | 'auditLog'
  | 'tasks'
  | 'users'
  | 'settings';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  requestNumber?: string;
  linkScreen?: ActiveScreen;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'وردت إفادة طيف الترددات',
    message: 'وردت إفادة بالموافقة المشروطة على طلب XR-5000 من قبل الإدارة العامة لطيف الترددات.',
    timestamp: 'قبل 10 دقائق',
    type: 'success',
    read: false,
    requestNumber: 'TA-2026-0041',
    linkScreen: 'studyCenter',
  },
  {
    id: 'notif-2',
    title: 'تنبيه اقتراب مهلة الإحالة',
    message: 'متبقي 48 ساعة على الموعد النهائي لاستلام رد الهيئة العامة للطيران المدني على الإحالة.',
    timestamp: 'قبل ساعة',
    type: 'warning',
    read: false,
    requestNumber: 'TA-2026-0038',
    linkScreen: 'studyCenter',
  },
  {
    id: 'notif-3',
    title: 'اعتماد التقرير الفني المبدئي',
    message: 'قام مدير الإدارة باعتمد التقرير الفني لطلب شركة سبأفون ورُفع لرئيس المكتب الفني.',
    timestamp: 'قبل 3 ساعات',
    type: 'info',
    read: false,
    requestNumber: 'TA-2026-0035',
    linkScreen: 'studyCenter',
  },
  {
    id: 'notif-4',
    title: 'تسجيل نقص جديد مرسل للمورد',
    message: 'تم إرسال إشعار نقص شهادة المطابقة البيئية إلى الشركة اليمنية الخليجية.',
    timestamp: 'قبل 5 ساعات',
    type: 'warning',
    read: true,
    requestNumber: 'TA-2026-0041',
  },
  {
    id: 'notif-5',
    title: 'تأكيد استلام رسوم الدراسة',
    message: 'تأكيد سداد رسوم الفحص الفني للطلب رقم TA-2026-0042 بقيمة 50,000 ريال.',
    timestamp: 'أمس 16:30',
    type: 'success',
    read: true,
  },
  {
    id: 'notif-6',
    title: 'تحديث اللائحة التنفيذية لطيف الترددات',
    message: 'إشعارات المكتب الفني: تم تعميم الضوابط الجديدة لنطاقات 5.8GHz الصادرة من م. وائل صلاح القاسمي.',
    timestamp: 'أمس 11:15',
    type: 'info',
    read: true,
  },
];

interface AppContextType {
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;

  isAuthenticated: boolean;
  setIsAuthenticated: (status: boolean) => void;

  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;

  currentUser: UserAccount;
  setCurrentUser: (user: UserAccount) => void;

  currentUserRole: string;
  setCurrentUserRole: (role: string) => void;

  mockUsers: UserAccount[];
  addUser: (user: Omit<UserAccount, 'id' | 'lastLogin' | 'assignedRequestsCount'>) => void;
  updateUser: (id: string, user: Partial<UserAccount>) => void;
  deleteUser: (id: string) => void;

  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;

  theme: 'light' | 'dark';
  toggleTheme: () => void;

  blindReviewMode: boolean;
  setBlindReviewMode: React.Dispatch<React.SetStateAction<boolean>>;
  toggleBlindReviewMode: () => void;

  currentRequest: TypeApprovalRequest;
  setCurrentRequest: React.Dispatch<React.SetStateAction<TypeApprovalRequest>>;

  requestsList: TypeApprovalRequest[];
  setRequestsList: React.Dispatch<React.SetStateAction<TypeApprovalRequest[]>>;

  mockRequests: TypeApprovalRequest[];
  setMockRequests: React.Dispatch<React.SetStateAction<TypeApprovalRequest[]>>;

  activeStep: number;
  setActiveStep: (step: number) => void;

  saveStatus: 'محفوظ' | 'جارٍ الحفظ' | 'تعديلات غير محفوظة' | 'فشل الحفظ';
  setSaveStatus: (status: 'محفوظ' | 'جارٍ الحفظ' | 'تعديلات غير محفوظة' | 'فشل الحفظ') => void;
  triggerSave: () => void;

  auditLogs: AuditLogEntry[];
  addAuditLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;

  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;

  // Task Manager & Scheduled Reminders
  tasksList: TaskItem[];
  addTask: (task: Omit<TaskItem, 'id'>) => void;
  toggleTaskReminder: (id: string) => void;
  triggerTaskReminderNow: (id: string) => void;
  updateTaskStatus: (id: string, status: TaskItem['status']) => void;

  // Actions for study center
  updateStepStatus: (stepKey: keyof TypeApprovalRequest['stepStatuses'], status: StepStatus) => void;
  addDeficiency: (def: Omit<DeficiencyItem, 'id' | 'requestDate' | 'status'>) => void;
  updateDeficiencyStatus: (id: string, status: DeficiencyItem['status'], note?: string) => void;
  addReferral: (ref: Omit<ReferralItem, 'id' | 'referralDate' | 'status'>) => void;
  updateReferralStatus: (id: string, status: ReferralItem['status'], response?: string, impact?: string) => void;
  approveWorkflowLevel: (level: number, notes?: string) => void;
  rejectWorkflowLevel: (level: number, notes?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  const [mockUsers, setMockUsers] = useState<UserAccount[]>(MOCK_USERS);
  const [currentUser, setCurrentUser] = useState<UserAccount>(MOCK_USERS[0] || {
    id: 'usr-1',
    name: 'م. أحمد باصريح',
    fullName: 'المهندس/ أحمد محمد باصريح',
    title: 'معد الدراسة الفنية',
    role: 'معد الدراسة',
    department: 'المكتب الفني للموافقة النوعية',
    email: 'a.basarih@mtit.gov.ye',
    phone: '+967 771 234 567',
    permissions: ['إعداد الدراسات', 'رفع المرفقات', 'تسجيل النواقص', 'تنسيق الإحالات'],
    status: 'نشط',
    lastLogin: '2026-07-30 11:20',
    assignedRequestsCount: 4,
  });

  const [currentUserRole, setCurrentUserRole] = useState<string>('معد الدراسة');
  const [currentRequest, setCurrentRequest] = useState<TypeApprovalRequest>(PRIMARY_REQUEST);
  const [requestsList, setRequestsList] = useState<TypeApprovalRequest[]>(MOCK_REQUESTS_LIST);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [saveStatus, setSaveStatus] = useState<'محفوظ' | 'جارٍ الحفظ' | 'تعديلات غير محفوظة' | 'فشل الحفظ'>('محفوظ');
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOGS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [tasksList, setTasksList] = useState<TaskItem[]>(MOCK_TASKS);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('app_dark_mode');
      if (saved !== null) {
        return saved === 'true';
      }
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  const [blindReviewMode, setBlindReviewMode] = useState<boolean>(false);
  const toggleBlindReviewMode = () => setBlindReviewMode((prev) => !prev);

  const theme = darkMode ? 'dark' : 'light';
  const toggleTheme = () => setDarkMode((prev) => !prev);

  // Apply dark mode class to root HTML & store in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('app_dark_mode', String(darkMode));
    } catch (e) {
      console.warn('Unable to save dark mode to localStorage', e);
    }
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addUser = (newUser: Omit<UserAccount, 'id' | 'lastLogin' | 'assignedRequestsCount'>) => {
    const id = `usr-${Date.now()}`;
    const created: UserAccount = {
      ...newUser,
      id,
      lastLogin: 'لم يسجل دخول بعد',
      assignedRequestsCount: 0,
    };
    setMockUsers((prev) => [created, ...prev]);
    addToast({
      type: 'success',
      title: 'إضافة مستخدم جديد',
      message: `تمت إضافة الحساب (${newUser.name || newUser.fullName}) بدور [${newUser.role}] بنجاح.`,
    });
  };

  const updateUser = (id: string, updatedFields: Partial<UserAccount>) => {
    setMockUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updatedFields } : u))
    );
    if (currentUser?.id === id) {
      setCurrentUser((prev) => ({ ...prev, ...updatedFields }));
    }
    addToast({
      type: 'info',
      title: 'تعديل بياني المستخدم',
      message: 'تم تحديث بيانات المستخدم والدور الوظيفي المخصص بنجاح.',
    });
  };

  const deleteUser = (id: string) => {
    setMockUsers((prev) => prev.filter((u) => u.id !== id));
    addToast({
      type: 'warning',
      title: 'حذف حساب مستخدم',
      message: 'تم إلغاء تفعيل/حذف حساب المستخدم من النظام.',
    });
  };

  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: 'الآن',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    addNotification({
      title: toast.title,
      message: toast.message,
      type: toast.type,
      requestNumber: currentRequest?.requestNumber,
      linkScreen: 'studyCenter',
    });
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addAuditLog = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newLog: AuditLogEntry = {
      ...entry,
      id: `log-${Date.now()}`,
      timestamp: formattedDate,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const triggerSave = () => {
    setSaveStatus('جارٍ الحفظ');
    setTimeout(() => {
      setSaveStatus('محفوظ');
      const now = new Date();
      const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
      setCurrentRequest((prev) => ({
        ...prev,
        lastUpdated: `اليوم الساعة ${timeStr}`,
      }));
      addToast({
        type: 'success',
        title: 'تم الحفظ بنجاح',
        message: 'تم حفظ كافة التعديلات على دراسة الطلب بنجاح في قاعدة البيانات المحلية.',
      });
      addAuditLog({
        userName: 'م. أحمد باصريح',
        userRole: currentUserRole,
        action: 'تحديث وحفظ دراسة الطلب',
        department: 'المكتب الفني للموافقة النوعية',
        previousValue: 'نسخة سابقة',
        newValue: 'النسخة الحالية المحدثة',
        ipAddress: '10.20.4.112',
        reason: 'حفظ تلقائي / يدوي من قبل المراجع',
        details: `حفظ البيانات للخطوة رقم ${activeStep}`,
        requestNumber: currentRequest.requestNumber,
      });
    }, 800);
  };

  const updateStepStatus = (stepKey: keyof TypeApprovalRequest['stepStatuses'], status: StepStatus) => {
    setCurrentRequest((prev) => ({
      ...prev,
      stepStatuses: {
        ...prev.stepStatuses,
        [stepKey]: status,
      },
    }));
    addToast({
      type: 'info',
      title: 'تحديث حالة الخطوة',
      message: `تم تغيير حالة الخطوة إلى (${status})`,
    });
  };

  const addDeficiency = (def: Omit<DeficiencyItem, 'id' | 'requestDate' | 'status'>) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')}`;

    const newDef: DeficiencyItem = {
      ...def,
      id: `def-${Date.now().toString().slice(-4)}`,
      requestDate: dateStr,
      status: 'مفتوح',
    };

    setCurrentRequest((prev) => ({
      ...prev,
      deficiencies: [newDef, ...prev.deficiencies],
    }));

    addToast({
      type: 'warning',
      title: 'تم تسجيل نقص جديد',
      message: `تم إضافة النقص بنجاح وتوجيهه إلى (${def.responsibleEntity})`,
    });

    addAuditLog({
      userName: 'م. أحمد باصريح',
      userRole: currentUserRole,
      action: 'إنشاء نقص جديد',
      department: 'المكتب الفني للموافقة النوعية',
      previousValue: '-',
      newValue: def.description,
      ipAddress: '10.20.4.112',
      reason: 'عدم اكتمال بيانات الوثائق المطلوبة',
      details: `نقص جديد بخطورة: ${def.severity}`,
      requestNumber: currentRequest.requestNumber,
    });
  };

  const updateDeficiencyStatus = (id: string, status: DeficiencyItem['status'], note?: string) => {
    setCurrentRequest((prev) => ({
      ...prev,
      deficiencies: prev.deficiencies.map((d) =>
        d.id === id
          ? {
              ...d,
              status,
              closureDecisionNote: note || d.closureDecisionNote,
              resolutionDate: status === 'مغلق' ? new Date().toISOString().split('T')[0] : d.resolutionDate,
            }
          : d
      ),
    }));

    addToast({
      type: 'success',
      title: 'تحديث حالة النقص',
      message: `تمت مراجعة النقص وتغيير حالته إلى: ${status}`,
    });
  };

  const addReferral = (ref: Omit<ReferralItem, 'id' | 'referralDate' | 'status'>) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')}`;

    const newRef: ReferralItem = {
      ...ref,
      id: `ref-${Date.now().toString().slice(-4)}`,
      referralDate: dateStr,
      status: 'قيد_الدراسة',
    };

    setCurrentRequest((prev) => ({
      ...prev,
      referrals: [newRef, ...prev.referrals],
    }));

    addToast({
      type: 'info',
      title: 'تم إرسال الإحالة',
      message: `تم إرسال الموضوع إلى (${ref.targetEntity}) بنجاح.`,
    });
  };

  const updateReferralStatus = (
    id: string,
    status: ReferralItem['status'],
    response?: string,
    impact?: string
  ) => {
    setCurrentRequest((prev) => ({
      ...prev,
      referrals: prev.referrals.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              responseDetails: response || r.responseDetails,
              responseImpact: impact || r.responseImpact,
              approvedDate: status === 'تمت_الإفادة' ? new Date().toISOString().split('T')[0] : r.approvedDate,
            }
          : r
      ),
    }));

    addToast({
      type: 'success',
      title: 'تحديث الإحالة',
      message: `تم تسجيل إفادة الجهة المحال إليها وتحديث النتيجة.`,
    });
  };

  const approveWorkflowLevel = (level: number, notes?: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setCurrentRequest((prev) => {
      const updatedApprovals = prev.approvals.map((a) => {
        if (a.level === level) {
          return {
            ...a,
            status: 'معتمد' as const,
            date: nowStr,
            notes: notes || a.notes || 'تم الاعتماد حسب الأصول.',
          };
        }
        if (a.level === level + 1 && a.status === 'لم_يصل_بعد') {
          return {
            ...a,
            status: 'بانتظار_المراجعة' as const,
          };
        }
        return a;
      });

      const allApproved = updatedApprovals.every((a) => a.status === 'معتمد');

      return {
        ...prev,
        approvals: updatedApprovals,
        certificateStatus: allApproved ? ('صالحة' as const) : prev.certificateStatus,
        status: allApproved ? ('معتمدة' as const) : prev.status,
      };
    });

    addToast({
      type: 'success',
      title: 'تم الاعتماد بنجاح',
      message: `تم اعتماد المستوى رقم ${level} في سلسلة الاعتمادات التنظيمية.`,
    });
  };

  const rejectWorkflowLevel = (level: number, notes?: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setCurrentRequest((prev) => ({
      ...prev,
      approvals: prev.approvals.map((a) =>
        a.level === level
          ? {
              ...a,
              status: 'معاد_للتعديل' as const,
              date: nowStr,
              notes: notes || 'تمت التوصية بالإعادة للتعديل أو استكمال البيانات.',
            }
          : a
      ),
      status: 'بانتظار_الاستكمال',
    }));

    addToast({
      type: 'error',
      title: 'تمت إعادة الطلب للتعديل',
      message: `تم إرسال ملاحظات المراجعة وإعادة الطلب إلى معد الدراسة.`,
    });
  };

  const addTask = (task: Omit<TaskItem, 'id'>) => {
    const newTask: TaskItem = {
      ...task,
      id: `tsk-${Date.now().toString().slice(-4)}`,
    };
    setTasksList((prev) => [newTask, ...prev]);
    addToast({
      type: 'success',
      title: 'تم إنشاء المهمة بنجاح',
      message: `تم إضافة المهمة: "${task.title}" وجدولة مهلتها النظامية.`,
    });
    addAuditLog({
      userName: currentUser.name,
      userRole: currentUser.role,
      action: 'إضافة مهمة وجدولة تنبيه',
      department: currentUser.department,
      previousValue: 'لا يوجد',
      newValue: task.title,
      reason: 'إنشاء مهمة جديدة ضمن المهام ذات المهل الرسمية',
      details: `تاريخ الاستحقاق: ${task.deadline} - المهلة: ${task.regulatoryTimeframe}`,
      ipAddress: '10.20.4.112',
    });
  };

  const toggleTaskReminder = (id: string) => {
    setTasksList((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextState = !t.reminderScheduled;
          if (nextState) {
            addToast({
              type: 'info',
              title: 'تم تفعيل التنبيه الآلي المجدول',
              message: `سيتم تنبيه المعنيين قبل ${t.reminderThresholdHours} ساعة من الموعد النهائي للمهمة: ${t.title}`,
            });
          } else {
            addToast({
              type: 'warning',
              title: 'تم إيقاف التنبيه المجدول',
              message: `تم إلغاء تفعيل الإشعارات الآلية المجدولة للمهمة: ${t.title}`,
            });
          }
          return { ...t, reminderScheduled: nextState };
        }
        return t;
      })
    );
  };

  const triggerTaskReminderNow = (id: string) => {
    const task = tasksList.find((t) => t.id === id);
    if (!task) return;

    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setTasksList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, lastNotificationSent: nowStr } : t))
    );

    addToast({
      type: 'warning',
      title: `🔔 تنبيه عاجل: مهمة قريبة من الانتهاء (${task.requestNumber})`,
      message: `تذكير آلي: المهمة "${task.title}" تنتهي مهلتها النظامية بتاريخ ${task.deadline}. يرجى اتخاذ الإجراء اللازم!`,
    });

    addAuditLog({
      userName: 'نظام التنبيهات الآلي',
      userRole: 'تنبيه مجدول آلي',
      action: 'إرسال إشعار تذكير آلي للمهمة',
      department: 'إدارة الرقابة والمهل التنظيمية',
      previousValue: task.lastNotificationSent || 'لم يرسل',
      newValue: nowStr,
      reason: 'اقتراب الموعد النهائي وحلول وقت التنبيه المجدول',
      details: `تم توجيه التنبيه للمسؤول: ${task.assignedUser} (${task.assignedDept})`,
      requestNumber: task.requestNumber,
      ipAddress: '10.20.0.1',
    });
  };

  const updateTaskStatus = (id: string, status: TaskItem['status']) => {
    setTasksList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
    addToast({
      type: 'success',
      title: 'تحديث حالة المهمة',
      message: `تم تغيير حالة المهمة إلى: ${status}`,
    });
  };

  return (
    <AppContext.Provider
      value={{
        activeScreen,
        setActiveScreen,
        isAuthenticated,
        setIsAuthenticated,
        isLoggedIn,
        setIsLoggedIn,
        currentUser,
        setCurrentUser,
        currentUserRole,
        setCurrentUserRole,
        mockUsers,
        addUser,
        updateUser,
        deleteUser,
        darkMode,
        setDarkMode,
        theme,
        toggleTheme,
        blindReviewMode,
        setBlindReviewMode,
        toggleBlindReviewMode,
        currentRequest,
        setCurrentRequest,
        requestsList,
        setRequestsList,
        mockRequests: requestsList,
        setMockRequests: setRequestsList,
        activeStep,
        setActiveStep,
        saveStatus,
        setSaveStatus,
        triggerSave,
        auditLogs,
        addAuditLog,
        toasts,
        addToast,
        removeToast,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotification,
        clearAllNotifications,
        addNotification,
        tasksList,
        addTask,
        toggleTaskReminder,
        triggerTaskReminderNow,
        updateTaskStatus,
        updateStepStatus,
        addDeficiency,
        updateDeficiencyStatus,
        addReferral,
        updateReferralStatus,
        approveWorkflowLevel,
        rejectWorkflowLevel,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
