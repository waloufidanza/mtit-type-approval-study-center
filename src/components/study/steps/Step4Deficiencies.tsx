/**
 * @file Step4Deficiencies.tsx
 * Step 4: Deficiencies & External Referrals Manager
 */

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { DeficiencySeverity, DeficiencyItem, ReferralItem } from '../../../types/typeApproval';
import { StatusBadge } from '../../common/StatusBadge';
import { PriorityBadge } from '../../common/PriorityBadge';
import { Modal } from '../../common/Modal';
import {
  AlertTriangle,
  Send,
  Plus,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  Layers,
  Building,
  RotateCcw,
  Eye,
  Merge,
} from 'lucide-react';

export const Step4Deficiencies: React.FC = () => {
  const {
    currentRequest,
    addDeficiency,
    updateDeficiencyStatus,
    addReferral,
    updateReferralStatus,
    updateStepStatus,
  } = useApp();

  const [isAddDefModalOpen, setIsAddDefModalOpen] = useState(false);
  const [isAddRefModalOpen, setIsAddRefModalOpen] = useState(false);
  const [isPreviewLetterModalOpen, setIsPreviewLetterModalOpen] = useState(false);

  // New Deficiency Form State
  const [defDescription, setDefDescription] = useState('');
  const [defSeverity, setDefSeverity] = useState<DeficiencySeverity>('حرج');
  const [defEntity, setDefEntity] = useState('الممثل المحلي (شركة التقنية الحديثة)');
  const [defIsBlocking, setDefIsBlocking] = useState(true);

  // New Referral Form State
  const [refTargetEntity, setRefTargetEntity] = useState('الإدارة العامة لطيف الترددات');
  const [refTopic, setRefTopic] = useState('');
  const [refQuestions, setRefQuestions] = useState('');

  const handleCreateDeficiencySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!defDescription.trim()) return;

    addDeficiency({
      type: 'استكمال بيانات/تعهد',
      description: defDescription,
      source: 'مراجعة الخطوة الرابعة',
      severity: defSeverity,
      isBlocking: defIsBlocking,
      responsibleEntity: defEntity,
      deadline: '2026-08-10',
    });

    setDefDescription('');
    setIsAddDefModalOpen(false);
  };

  const handleCreateReferralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refTopic.trim()) return;

    addReferral({
      targetEntity: refTargetEntity,
      topic: refTopic,
      questions: refQuestions ? refQuestions.split('\n') : ['يرجى موافاتنا بالرأي الفني بشأن الجهاز'],
      attachments: ['RF_Test_Report_XR5000.pdf'],
      deadline: '2026-08-12',
    });

    setRefTopic('');
    setRefQuestions('');
    setIsAddRefModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span>الخطوة الرابعة: مدير النواقص وطلبات الاستكمال والإحالات الخارجية</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            تسجيل النواقص المانعة وغير المانعة، ومتابعة الإحالات الفنية مع الجهات الرسمية ذات العلاقة.
          </p>
        </div>

        <button
          onClick={() => updateStepStatus('step4', 'معتمدة')}
          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>اعتماد النواقص والإحالات</span>
        </button>
      </div>

      {/* Section 1: Deficiencies Manager */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>إدارة النواقص والاشتراطات الرسمية ({currentRequest.deficiencies.length})</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              توجيه طلبات التوضيح للمورد وإغلاقها فور استلام الإفادة.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('تم دمج النواقص المتكررة')}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition border border-slate-200 dark:border-slate-700 flex items-center gap-1"
            >
              <Merge className="w-3.5 h-3.5" />
              <span>دمج النواقص</span>
            </button>

            <button
              onClick={() => setIsPreviewLetterModalOpen(true)}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition border border-slate-200 dark:border-slate-700 flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              <span>معاينة خطاب الاستكمال</span>
            </button>

            <button
              onClick={() => setIsAddDefModalOpen(true)}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل نقص جديد</span>
            </button>
          </div>
        </div>

        {/* Deficiency Cards List */}
        <div className="space-y-3">
          {currentRequest.deficiencies.map((def) => (
            <div
              key={def.id}
              className={`p-4 rounded-xl border transition space-y-3 ${
                def.status === 'مغلق'
                  ? 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800'
                  : 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-900/60 shadow-xs'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-slate-500">#{def.id}</span>
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{def.type}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      def.severity === 'مانع_للاعتماد' || def.severity === 'حرج'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {def.severity}
                  </span>
                  {def.isBlocking && (
                    <span className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold">
                      يمنع التصدير
                    </span>
                  )}
                </div>

                <StatusBadge status={def.status} size="sm" />
              </div>

              <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
                {def.description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg">
                <div>
                  الجهة المسؤولة: <span className="font-bold text-slate-800 dark:text-slate-200">{def.responsibleEntity}</span>
                </div>
                <div>
                  تاريخ الطلب: <span className="font-mono">{def.requestDate}</span> • المهلة: <span className="font-mono text-amber-600 font-bold">{def.deadline}</span>
                </div>
              </div>

              {def.responseNote && (
                <div className="p-2.5 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-lg text-xs text-blue-900 dark:text-blue-200">
                  <span className="font-bold block mb-0.5">رد الجهة / المستورد:</span>
                  <p>{def.responseNote}</p>
                </div>
              )}

              {/* Closure Controls */}
              <div className="flex items-center justify-end gap-2 pt-1">
                {def.status !== 'مغلق' ? (
                  <button
                    onClick={() => updateDeficiencyStatus(def.id, 'مغلق', 'تم التحقق والاعتماد الميداني')}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold transition flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>إغلاق النقص واعتماد الرد</span>
                  </button>
                ) : (
                  <button
                    onClick={() => updateDeficiencyStatus(def.id, 'مفتوح', 'إعادة الفحص')}
                    className="px-3 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 rounded text-xs font-bold transition flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>إعادة فتح النقص</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Referrals Manager */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Send className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>إدارة الإحالات الفنية الخارجية ({currentRequest.referrals.length})</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              تنسيق واستطلاع الرأي الفني مع طيف الترددات، الأمن السيبراني والمختبرات.
            </p>
          </div>

          <button
            onClick={() => setIsAddRefModalOpen(true)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>إحالة لجهة خارجية</span>
          </button>
        </div>

        {/* Referrals Cards List */}
        <div className="space-y-3">
          {currentRequest.referrals.map((ref) => (
            <div key={ref.id} className="p-4 bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{ref.targetEntity}</span>
                </div>
                <StatusBadge status={ref.status} size="sm" />
              </div>

              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{ref.topic}</p>

              <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <span className="font-bold block">الأسئلة والاستفسارات المحالة:</span>
                <ul className="list-disc list-inside space-y-0.5 pr-2">
                  {ref.questions.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              </div>

              {ref.responseDetails && (
                <div className="p-3 bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                  <span className="font-bold block">الإفادة المستلمة:</span>
                  <p>{ref.responseDetails}</p>
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 block mt-1">الأثر الفني: {ref.responseImpact}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-700">
                <span>تاريخ الإحالة: {ref.referralDate}</span>
                {ref.status !== 'تمت_الإفادة' && (
                  <button
                    onClick={() => updateReferralStatus(ref.id, 'تمت_الإفادة', 'تم استلام الموافقة الفنية المكتملة', 'موافقة متوافقة مع الشروط')}
                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold transition"
                  >
                    تسجيل استلام الإفادة
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal 1: Add Deficiency */}
      <Modal isOpen={isAddDefModalOpen} onClose={() => setIsAddDefModalOpen(false)} title="تسجيل نقص أو توضيح جديد">
        <form onSubmit={handleCreateDeficiencySubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">وصف النقص أو التوضيح المطلوب:</label>
            <textarea
              rows={3}
              required
              value={defDescription}
              onChange={(e) => setDefDescription(e.target.value)}
              placeholder="مثال: تعهد بعدم تجاوز القدرة المسموحة 30 dBm..."
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الجهة المسؤولة:</label>
              <select
                value={defEntity}
                onChange={(e) => setDefEntity(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded"
              >
                <option value="الممثل المحلي (شركة التقنية الحديثة)">الممثل المحلي</option>
                <option value="المصنع (Example Comm Ltd)">المصنع الخارجي</option>
                <option value="المختبر الفني">المختبر الفني</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">مستوى الخطورة:</label>
              <select
                value={defSeverity}
                onChange={(e) => setDefSeverity(e.target.value as DeficiencySeverity)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded"
              >
                <option value="طفيف">طفيف (شكلي)</option>
                <option value="متوسط">متوسط</option>
                <option value="حرج">حرج</option>
                <option value="مانع_للاعتماد">مانع للاعتماد</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isBlockingCheck"
              checked={defIsBlocking}
              onChange={(e) => setDefIsBlocking(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isBlockingCheck" className="font-bold text-slate-800 dark:text-slate-200">
              هذا النقص يمنع استكمال الدراسة وتصدير الشهادة
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddDefModalOpen(false)}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded font-bold"
            >
              إلغاء
            </button>
            <button type="submit" className="px-4 py-2 bg-rose-600 text-white rounded font-bold hover:bg-rose-500">
              حفظ النقص
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Add Referral */}
      <Modal isOpen={isAddRefModalOpen} onClose={() => setIsAddRefModalOpen(false)} title="إرسال إحالة خارجية للجهات">
        <form onSubmit={handleCreateReferralSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الجهة المحال إليها:</label>
            <select
              value={refTargetEntity}
              onChange={(e) => setRefTargetEntity(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded"
            >
              <option value="الإدارة العامة لطيف الترددات">الإدارة العامة لطيف الترددات</option>
              <option value="إدارة التنسيق والأمن السيبراني">إدارة التنسيق والأمن السيبراني</option>
              <option value="المختبر المركزي لقياس التوافق">المختبر المركزي لقياس التوافق</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">موضوع الإحالة:</label>
            <input
              type="text"
              required
              value={refTopic}
              onChange={(e) => setRefTopic(e.target.value)}
              placeholder="مثال: فحص التوافق الترددي لربط عالي القدرة..."
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الأسئلة والاستفسارات (سطر لكل سؤال):</label>
            <textarea
              rows={3}
              value={refQuestions}
              onChange={(e) => setRefQuestions(e.target.value)}
              placeholder="هل التردد متاح؟&#10;هل توجد ملاحظات أمنية؟"
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddRefModalOpen(false)}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded font-bold"
            >
              إلغاء
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-500">
              إرسال الإحالة
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 3: Preview Completion Letter */}
      <Modal isOpen={isPreviewLetterModalOpen} onClose={() => setIsPreviewLetterModalOpen(false)} title="معاينة خطاب طلب الاستكمال">
        <div className="p-6 bg-white text-slate-900 rounded border border-slate-200 text-xs space-y-4 leading-relaxed font-sans select-none">
          <div className="text-center font-bold space-y-1 border-b pb-3">
            <p className="text-sm">الجمهورية اليمنية - وزارة الاتصالات وتقنية المعلومات</p>
            <p className="text-xs text-slate-600">قطاع تنظيم الاتصالات • إشعار طلب استكمال نواقص</p>
            <p className="text-[10px] text-slate-400 font-mono">الرقم المرجعي: MTIT-NOTIF-2026-0991</p>
          </div>

          <p>
            <strong>الأخوة/ {currentRequest.localRep.companyName} المحترمون،</strong>
          </p>

          <p>
            بالإشارة إلى طلبكم رقم <span className="font-mono font-bold text-blue-900">{currentRequest.requestNumber}</span> الخاص بمواصفات الجهاز موديل <span className="font-bold">{currentRequest.model}</span>، نحثكم على توفير النواقص الآتية خلال مهلة 5 أيام عمل:
          </p>

          <div className="bg-amber-50 p-3 rounded border border-amber-200 text-amber-900 font-bold space-y-1">
            {currentRequest.deficiencies.map((d, i) => (
              <p key={i}>
                {i + 1}. {d.description} ({d.responsibleEntity})
              </p>
            ))}
          </div>

          <div className="text-left pt-6">
            <p className="font-bold">المكتب الفني للموافقة النوعية</p>
            <p className="text-[10px] text-slate-500">صدر إلكترونياً بتاريخ 2026-07-30</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};
