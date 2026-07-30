/**
 * @file StudyTaskReminderWidget.tsx
 * Mini Task & Reminder System Widget for the Study & Review Center.
 * Allows reviewers/engineers to create, track, and manage reminder notes linked to dates,
 * specific request numbers, and status milestones to ensure follow-ups on pending applications.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskItem } from '../../types/typeApproval';
import {
  Bell,
  Plus,
  CheckCircle2,
  Clock,
  Calendar,
  AlertTriangle,
  FileText,
  User,
  Trash2,
  Check,
  Search,
  Filter,
  Tag,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const StudyTaskReminderWidget: React.FC = () => {
  const {
    currentRequest,
    tasksList = [],
    addTask,
    updateTaskStatus,
    toggleTaskReminder,
    triggerTaskReminderNow,
    addToast,
  } = useApp();

  // Widget expand / collapse state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filterMode, setFilterMode] = useState<'ALL' | 'CURRENT_REQ' | 'PENDING'>('CURRENT_REQ');

  // Form States for new reminder task
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('2026-08-05');
  const [taskPriority, setTaskPriority] = useState<'حرج' | 'مرتفع' | 'متوسط'>('مرتفع');
  const [linkedStatus, setLinkedStatus] = useState('بانتظار رد طيف الترددات');
  const [assignedDept, setAssignedDept] = useState('المكتب الفني');

  // Handle Add Task Submission
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      addToast({
        type: 'error',
        title: 'عنوان المهمة مطلوب',
        message: 'يرجى كتابة عنوان للتذكير قبل الإضافة.',
      });
      return;
    }

    const newTask: Omit<TaskItem, 'id'> = {
      title: taskTitle.trim(),
      requestNumber: currentRequest.requestNumber,
      category: 'إفادة ترددية',
      assignedUser: 'م. أحمد باصريح',
      assignedDept: assignedDept,
      deadline: taskDeadline,
      regulatoryTimeframe: '48 ساعة',
      priority: taskPriority,
      status: 'قيد_المتابعة',
      reminderScheduled: true,
      reminderThresholdHours: 24,
      lastNotificationSent: '',
    };

    addTask(newTask);
    addToast({
      type: 'success',
      title: 'تمت إضافة الملاحظة التذكيرية',
      message: `تم ربط التذكير بـ (${currentRequest.requestNumber}) بموعد ${taskDeadline}.`,
    });

    // Reset Form
    setTaskTitle('');
    setTaskDescription('');
    setIsFormOpen(false);
  };

  // Filter Tasks List
  const filteredTasks = tasksList.filter((t) => {
    if (filterMode === 'CURRENT_REQ') {
      return t.requestNumber === currentRequest.requestNumber;
    }
    if (filterMode === 'PENDING') {
      return t.status !== 'مكتمل';
    }
    return true; // ALL
  });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4 font-sans text-xs">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 rounded-xl">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>ملاحظات المتابعة والتذكير الآلي (Study Task & Reminder Engine)</span>
              <span className="px-2 py-0.5 bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded-full text-[10px] font-bold border border-amber-200 dark:border-amber-800">
                {tasksList.filter((t) => t.status !== 'مكتملة').length} تذكيرات معلقة
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              إنشاء وتتبع مهام المتابعة المرتبطة بمهل زمنية وحالات الطلبات لتفادي التأخير
            </p>
          </div>
        </div>

        {/* Form Toggle Button */}
        <button
          onClick={() => setIsFormOpen((prev) => !prev)}
          className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl text-xs transition flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة تذكير / مهمة متابعة</span>
          {isFormOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* New Task Creation Form */}
      {isFormOpen && (
        <form
          onSubmit={handleCreateTask}
          className="p-4 bg-amber-50/60 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/80 space-y-3 animate-fade-in"
        >
          <div className="flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-200 border-b border-amber-200/60 dark:border-amber-800 pb-2">
            <span>إضافة مهمة تذكيرية جديدة لطلب الحالي ({currentRequest.requestNumber}):</span>
            <span className="text-[10px] font-mono text-amber-700 dark:text-amber-300">
              مقدم الطلب: {currentRequest.applicant.name}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Title */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                عنوان المهمة / التذكير:
              </label>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="مثال: متابعة إفادة الهيئة العامة للطيران بشأن التداخل الترددي..."
                className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-bold text-xs"
                required
              />
            </div>

            {/* Target Deadline */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                <span>الموعد النهائي لتنفيذ التذكير:</span>
              </label>
              <input
                type="date"
                value={taskDeadline}
                onChange={(e) => setTaskDeadline(e.target.value)}
                className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono font-bold text-xs"
              />
            </div>

            {/* Linked Status */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-purple-500" />
                <span>مرتبطة بمرحلة / حالة الطلب:</span>
              </label>
              <select
                value={linkedStatus}
                onChange={(e) => setLinkedStatus(e.target.value)}
                className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-bold text-xs"
              >
                <option value="بانتظار رد طيف الترددات">بانتظار رد طيف الترددات</option>
                <option value="استكمال الوثائق والنواقص">استكمال الوثائق والنواقص</option>
                <option value="قيد الدراسة الميدانية والمختبرية">قيد الدراسة الميدانية والمختبرية</option>
                <option value="اعتماد التقرير الفني المبدئي">اعتماد التقرير الفني المبدئي</option>
                <option value="جاهزية إصدار الشهادة">جاهزية إصدار الشهادة</option>
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                <span>مستوى الأولوية والخطورة:</span>
              </label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value as any)}
                className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-bold text-xs"
              >
                <option value="حرج">حرج (High Alert)</option>
                <option value="مرتفع">مرتفع الأهمية</option>
                <option value="متوسط">متوسط (متابعة روتينية)</option>
              </select>
            </div>

            {/* Assigned Dept */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-teal-500" />
                <span>الجهة المتابعة:</span>
              </label>

              <select
                value={assignedDept}
                onChange={(e) => setAssignedDept(e.target.value)}
                className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-bold text-xs"
              >
                <option value="المكتب الفني">المكتب الفني</option>
                <option value="إدارة الترددات والطيف">إدارة الترددات والطيف</option>
                <option value="مختبر الفحص الفني">مختبر الفحص الفني</option>
                <option value="شؤون المستوردين">شؤون المستوردين</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
              تفاصيل وملاحظات إضافية للمهمة:
            </label>
            <textarea
              rows={2}
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="اكتب أية ملاحظات تفصيلية أو أرقام إحالات مرتبطة بالمتابعة..."
              className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-sans text-xs"
            />
          </div>

          {/* Form Action Buttons */}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-lg text-xs"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-lg text-xs transition flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>حفظ التذكير والمتابعة</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl border border-slate-200 dark:border-slate-700/80">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFilterMode('CURRENT_REQ')}
            className={`px-3 py-1 rounded-lg font-bold text-[11px] transition ${
              filterMode === 'CURRENT_REQ'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            الطلب الحالي ({currentRequest.requestNumber})
          </button>

          <button
            onClick={() => setFilterMode('PENDING')}
            className={`px-3 py-1 rounded-lg font-bold text-[11px] transition ${
              filterMode === 'PENDING'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            المهام المعلقة
          </button>

          <button
            onClick={() => setFilterMode('ALL')}
            className={`px-3 py-1 rounded-lg font-bold text-[11px] transition ${
              filterMode === 'ALL'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            كافة المهام ({tasksList.length})
          </button>
        </div>

        <span className="text-[10px] text-slate-400 font-mono font-bold">
          نظام التنبيهات الزمني الآلي متصل
        </span>
      </div>

      {/* Tasks Cards List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="p-6 text-center bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs font-bold">
            لا توجد مهام تذكيرية مطابقة لهذا العرض. اضغط "إضافة تذكير" لإنشاء ملاحظة متابعة جديدة.
          </div>
        ) : (
          filteredTasks.map((t) => {
            const isDone = t.status === 'مكتمل';

            return (
              <div
                key={t.id}
                className={`p-3.5 rounded-xl border transition space-y-2 ${
                  isDone
                    ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60'
                    : t.priority === 'حرج'
                    ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800/80'
                    : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <button
                      onClick={() => updateTaskStatus(t.id, isDone ? 'قيد_المتابعة' : 'مكتمل')}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition ${
                        isDone
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 hover:border-amber-500 bg-white dark:bg-slate-800'
                      }`}
                      title={isDone ? 'إعادة الفتح' : 'تحديد كمكتمل'}
                    >
                      {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-extrabold text-xs text-slate-900 dark:text-slate-100 ${
                            isDone ? 'line-through text-slate-400' : ''
                          }`}
                        >
                          {t.title}
                        </span>

                        <span className="px-1.5 py-0.5 bg-blue-50 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 font-mono text-[10px] font-bold rounded border border-blue-200 dark:border-blue-800">
                          {t.requestNumber}
                        </span>

                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            t.priority === 'حرج'
                              ? 'bg-rose-100 text-rose-900 border border-rose-300 dark:bg-rose-950 dark:text-rose-200'
                              : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {t.priority}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-mono">
                        الفئة: {t.category} | المهلة التنظيمية: {t.regulatoryTimeframe}
                      </p>
                    </div>
                  </div>

                  {/* Immediate Test Trigger Button */}
                  <button
                    onClick={() => triggerTaskReminderNow(t.id)}
                    className="px-2 py-1 bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-200 font-bold rounded-lg text-[10px] transition border border-amber-300 dark:border-amber-800 flex items-center gap-1 shrink-0"
                    title="تجربة إرسال التنبيه الآلي الفوري"
                  >
                    <Bell className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                    <span>تنبيه فوري</span>
                  </button>
                </div>

                {/* Footer Metadata */}
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2 font-mono">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-blue-500" />
                      <span>الموعد النهائي: {t.deadline}</span>
                    </span>

                    <span className="flex items-center gap-1 font-sans font-semibold">
                      <User className="w-3 h-3 text-teal-500" />
                      <span>{t.assignedUser} ({t.assignedDept})</span>
                    </span>
                  </div>

                  <span
                    className={`font-bold font-sans ${
                      t.status === 'مكتملة'
                        ? 'text-emerald-600'
                        : t.status === 'قيد الإنجاز'
                        ? 'text-blue-600'
                        : 'text-amber-600'
                    }`}
                  >
                    الحالة: {t.status}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
