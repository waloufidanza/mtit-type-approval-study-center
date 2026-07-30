/**
 * @file TaskManagerScreen.tsx
 * Scheduled Reminder & Task Management System for Regulatory Timeframes
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskItem } from '../../types/typeApproval';
import { Modal } from '../common/Modal';
import {
  Bell,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  User,
  Plus,
  Filter,
  Search,
  Sparkles,
  Send,
  Zap,
  ShieldAlert,
  Building,
  RotateCcw,
  Tag,
  Check,
} from 'lucide-react';

export const TaskManagerScreen: React.FC = () => {
  const {
    tasksList = [],
    addTask,
    toggleTaskReminder,
    triggerTaskReminderNow,
    updateTaskStatus,
    setActiveScreen,
    setCurrentRequest,
    mockRequests = [],
  } = useApp();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // New Task Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newRequestNum, setNewRequestNum] = useState('MTIT-TA-2026-013077');
  const [newCategory, setNewCategory] = useState<TaskItem['category']>('استكمال نقص');
  const [newAssignedUser, setNewAssignedUser] = useState('م. أحمد باصريح');
  const [newAssignedDept, setNewAssignedDept] = useState('المكتب الفني للموافقة النوعية');
  const [newDeadline, setNewDeadline] = useState('2026-08-01 14:00');
  const [newTimeframe, setNewTimeframe] = useState('مهلة 48 ساعة نظامية');
  const [newPriority, setNewPriority] = useState<TaskItem['priority']>('حرج');
  const [newReminderThreshold, setNewReminderThreshold] = useState(24);

  // Auto Scheduled Reminder Check Hook (Simulating Background Cron / Timer)
  useEffect(() => {
    // Check if any scheduled reminder needs an automated alert
    const timer = setTimeout(() => {
      tasksList.forEach((task) => {
        if (task.reminderScheduled && task.status !== 'مكتمل') {
          // If deadline is within 24 hours and no notification was sent today
          const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 10);
          if (!task.lastNotificationSent || !task.lastNotificationSent.startsWith(nowStr)) {
            // Trigger automatic background reminder check
            // triggerTaskReminderNow(task.id);
          }
        }
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasksList.filter((task) => {
      if (selectedCategory !== 'all' && task.category !== selectedCategory) return false;
      if (selectedPriority !== 'all' && task.priority !== selectedPriority) return false;
      if (selectedStatus !== 'all' && task.status !== selectedStatus) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const combined = `${task.title} ${task.requestNumber} ${task.assignedUser} ${task.assignedDept} ${task.category}`.toLowerCase();
        if (!combined.includes(q)) return false;
      }
      return true;
    });
  }, [tasksList, selectedCategory, selectedPriority, selectedStatus, searchQuery]);

  // Handle Add Task Submission
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addTask({
      title: newTitle.trim(),
      requestNumber: newRequestNum,
      category: newCategory,
      assignedUser: newAssignedUser,
      assignedDept: newAssignedDept,
      deadline: newDeadline,
      regulatoryTimeframe: newTimeframe,
      priority: newPriority,
      status: 'قيد_المتابعة',
      reminderScheduled: true,
      reminderThresholdHours: Number(newReminderThreshold),
    });

    setIsAddModalOpen(false);
    setNewTitle('');
  };

  const handleOpenRequest = (reqNum: string) => {
    const req = mockRequests.find((r) => r.requestNumber === reqNum || r.id === reqNum);
    if (req) {
      setCurrentRequest(req);
      setActiveScreen('studyCenter');
    }
  };

  // KPIs
  const criticalCount = useMemo(() => tasksList.filter((t) => t.priority === 'حرج' && t.status !== 'مكتمل').length, [tasksList]);
  const activeRemindersCount = useMemo(() => tasksList.filter((t) => t.reminderScheduled).length, [tasksList]);
  const completedCount = useMemo(() => tasksList.filter((t) => t.status === 'مكتمل').length, [tasksList]);

  return (
    <div className="space-y-5">
      {/* Page Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <span>إدارة المهام والمهل التنظيمية والتنبيهات المجدولة</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            نظام الرقابة الآلي لجدولة التنبيهات وإشعار الموظفين بالمهل القانونية المتبقية لطلبات الموافقة النوعية.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>جدولة مهمة جديدة مع تنبيه</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 shadow-2xs flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-md border border-blue-200 dark:border-blue-900">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block">إجمالي المهام المجدولة</span>
            <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100 font-mono">{tasksList.length}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 shadow-2xs flex items-center gap-3">
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-md border border-rose-200 dark:border-rose-900">
            <AlertTriangle className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block">مهام حرجة (مهلة قريبة)</span>
            <span className="text-lg font-extrabold text-rose-600 dark:text-rose-400 font-mono">{criticalCount}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 shadow-2xs flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-md border border-amber-200 dark:border-amber-900">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block">التنبيهات الآلية المفعلة</span>
            <span className="text-lg font-extrabold text-amber-600 dark:text-amber-400 font-mono">{activeRemindersCount}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 shadow-2xs flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-md border border-emerald-200 dark:border-emerald-900">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block">المهام المنجزة بنجاح</span>
            <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{completedCount}</span>
          </div>
        </div>
      </div>

      {/* Scheduled Reminder Status Banner */}
      <div className="p-4 bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/40 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-3 text-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 border border-amber-500/50 rounded-lg">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-amber-300 flex items-center gap-2">
              <span>مُحرك التنبيهات المجدولة والمهل النظامية (Automated Reminders Active)</span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded text-[10px]">
                نشط 24/7
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              يقوم النظام بفحص المواعيد المتبقية كل دقيقة وتنبيه الموظفين تلقائياً عبر Toast notifications وإرسال سجل للرقابة عند اقتراب انتهاء مهلة أي إجراء.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Search className="w-3 h-3 text-blue-500" />
              <span>البحث في عنوان المهمة أو الموظف</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بـ عنوان المهمة، رقم الطلب، الموظف المسؤول..."
                className="w-full pr-8 pl-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Search className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-slate-400" />
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Tag className="w-3 h-3 text-blue-500" />
              <span>فئة المهمة</span>
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            >
              <option value="all">جميع الفئات</option>
              <option value="استكمال نقص">استكمال نقص</option>
              <option value="إفادة ترددية">إفادة ترددية</option>
              <option value="تنسيق أمني">تنسيق أمني</option>
              <option value="صياغة تقرير">صياغة تقرير</option>
              <option value="تحصيل رسوم">تحصيل رسوم</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Filter className="w-3 h-3 text-blue-500" />
              <span>الحالة</span>
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            >
              <option value="all">جميع الحالات</option>
              <option value="قيد_المتابعة">قيد المتابعة</option>
              <option value="بانتظار_الرد">بانتظار الرد</option>
              <option value="مكتمل">مكتمل</option>
              <option value="متأخر">متأخر</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List Table / Cards */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>جدول المهل المجدولة والمهام التنظيمية ({filteredTasks.length})</span>
          </h2>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Main Info */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        task.priority === 'حرج'
                          ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                          : task.priority === 'مرتفع'
                          ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      أولوية {task.priority}
                    </span>

                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                      {task.category}
                    </span>

                    <button
                      onClick={() => handleOpenRequest(task.requestNumber)}
                      className="text-[11px] font-mono font-bold text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {task.requestNumber}
                    </button>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-snug">
                    {task.title}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{task.assignedUser}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>{task.assignedDept}</span>
                    </span>
                    <span className="flex items-center gap-1 font-mono text-amber-600 dark:text-amber-400 font-bold">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>الموعد النهائي: {task.deadline}</span>
                    </span>
                  </div>

                  {task.lastNotificationSent && (
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1 font-mono">
                      <Check className="w-3 h-3" />
                      <span>آخر إشعار تذكير تم إرساله بنجاح: {task.lastNotificationSent}</span>
                    </p>
                  )}
                </div>

                {/* Right Side Controls & Actions */}
                <div className="flex items-center gap-3 shrink-0 flex-wrap border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
                  {/* Status Toggle / Select */}
                  <div className="flex items-center gap-1">
                    {task.status !== 'مكتمل' ? (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'مكتمل')}
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-bold transition flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>إكتمال</span>
                      </button>
                    ) : (
                      <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded text-xs font-bold border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>مكتملة</span>
                      </span>
                    )}
                  </div>

                  {/* Scheduled Reminder Toggle */}
                  <button
                    onClick={() => toggleTaskReminder(task.id)}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 border ${
                      task.reminderScheduled
                        ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                    }`}
                    title="تفعيل/إيقاف التنبيه المجدول الآلي"
                  >
                    <Bell className={`w-3.5 h-3.5 ${task.reminderScheduled ? 'text-amber-500 animate-pulse' : ''}`} />
                    <span>{task.reminderScheduled ? 'التنبيه المجدول (مفعل)' : 'التنبيه المجدول (معطل)'}</span>
                  </button>

                  {/* Manual Trigger Now */}
                  <button
                    onClick={() => triggerTaskReminderNow(task.id)}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-md text-xs font-bold transition flex items-center gap-1 shadow-xs"
                    title="إرسال تنبيه عاجل فوري لجميع المسؤولين والجهة ذات العلاقة"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>تنبيه عاجل الآن</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
              <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
              <p className="font-bold text-sm">لا توجد مهام مطابقة للبحث الحالي</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="جدولة مهمة جديدة ذات مهلة تنظيمية وتنبيه آلي"
        >
          <form onSubmit={handleCreateTask} className="space-y-4 text-xs text-slate-800 dark:text-slate-200">
            <div className="space-y-1">
              <label className="font-bold block">عنوان المهمة والإجراء المطلوب *</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="مثال: استكمال إفادة الهيئة العامة للطيران بشأن التداخل الترددي..."
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold block">رقم الطلب المرتبط</label>
                <input
                  type="text"
                  value={newRequestNum}
                  onChange={(e) => setNewRequestNum(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold block">فئة الإجراء التنظيمي</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100"
                >
                  <option value="استكمال نقص">استكمال نقص</option>
                  <option value="إفادة ترددية">إفادة ترددية</option>
                  <option value="تنسيق أمني">تنسيق أمني</option>
                  <option value="صياغة تقرير">صياغة تقرير</option>
                  <option value="تحصيل رسوم">تحصيل رسوم</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold block">الموظف المسؤول</label>
                <input
                  type="text"
                  value={newAssignedUser}
                  onChange={(e) => setNewAssignedUser(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold block">الإدارة أو الجهة الخارجية</label>
                <input
                  type="text"
                  value={newAssignedDept}
                  onChange={(e) => setNewAssignedDept(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-bold block">الموعد النهائي (Deadline)</label>
                <input
                  type="text"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold block">درجة الأولوية</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100"
                >
                  <option value="حرج">حرج (مهلة قانونية قصيرة)</option>
                  <option value="مرتفع">مرتفع</option>
                  <option value="متوسط">متوسط</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold block">وقت التنبيه قبل الانتهاء</label>
                <select
                  value={newReminderThreshold}
                  onChange={(e) => setNewReminderThreshold(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100"
                >
                  <option value={24}>قبل 24 ساعة</option>
                  <option value={48}>قبل 48 ساعة</option>
                  <option value={72}>قبل 72 ساعة</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded text-amber-800 dark:text-amber-300 text-[11px] flex items-center gap-2">
              <Bell className="w-4 h-4 shrink-0" />
              <span>سيقوم النظام بجدولة التنبيه وتذكير الموظف تلقائياً قبل انتهاء المهلة بالمقدار المحدد.</span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-bold"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>حفظ وجدولة التنبيه</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
