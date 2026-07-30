/**
 * @file Step6TechnicalOpinion.tsx
 * Step 6: Formulating Official Technical Opinion & Decision Matrix
 */

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { FinalDecision } from '../../../types/typeApproval';
import { StatusBadge } from '../../common/StatusBadge';
import {
  FileCheck,
  CheckCircle2,
  Plus,
  Trash2,
  AlertCircle,
  Scale,
  ShieldAlert,
} from 'lucide-react';

export const Step6TechnicalOpinion: React.FC = () => {
  const { currentRequest, setCurrentRequest, addToast, updateStepStatus } = useApp();
  const opinion = currentRequest.technicalOpinion;

  const [newConditionInput, setNewConditionInput] = useState('');

  const decisionOptions: { id: FinalDecision; label: string; desc: string }[] = [
    { id: 'موافقة', label: 'موافقة نهائية بدون شروط', desc: 'استيفاء كافة الشروط والمواصفات الفنية تماماً' },
    { id: 'موافقة_بشروط', label: 'موافقة نوعية مشروطة', desc: 'الالتزام بكود المنطقة والترددات المحددة' },
    { id: 'موافقة_مؤقتة', label: 'موافقة مؤقتة (6 أشهر)', desc: 'لاختبار الجهاز بالميدان تحت إشراف الوزارة' },
    { id: 'طلب_استكمال', label: 'طلب استكمال بيانات', desc: 'وجود نواقص مستندية جوهرية يطلب إغلاقها' },
    { id: 'تعليق', label: 'تعليق البت في الطلب', desc: 'بانتظار نتائج تحقيقات أو سياسات ترددية طارئة' },
    { id: 'إعادة_للمراجعة', label: 'إعادة للمعد للتعديل', desc: 'إعادة كراسة الدراسة لإعادة التدقيق' },
    { id: 'رفض', label: 'رفض الطلب نهائياً', desc: 'مخالفة معايير السلامة الوطنية أو حظر النطاق' },
    { id: 'إحالة_إضافية', label: 'إحالة للوزير / الهيئة العليا', desc: 'الحالات الاستثنائية التي تتطلب قراراً سيادياً' },
  ];

  const handleDecisionSelect = (decision: FinalDecision) => {
    setCurrentRequest((prev) => ({
      ...prev,
      technicalOpinion: {
        ...prev.technicalOpinion,
        finalRecommendation: decision,
      },
    }));
    addToast({
      type: 'info',
      title: 'تحديد التوصية النهائية',
      message: `تم اختيار القرار النهائيو: (${decision.replace(/_/g, ' ')})`,
    });
  };

  const handleAddCondition = () => {
    if (newConditionInput.trim()) {
      setCurrentRequest((prev) => ({
        ...prev,
        technicalOpinion: {
          ...prev.technicalOpinion,
          conditions: [...prev.technicalOpinion.conditions, newConditionInput.trim()],
        },
      }));
      setNewConditionInput('');
    }
  };

  const handleDeleteCondition = (index: number) => {
    setCurrentRequest((prev) => ({
      ...prev,
      technicalOpinion: {
        ...prev.technicalOpinion,
        conditions: prev.technicalOpinion.conditions.filter((_, i) => i !== index),
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>الخطوة السادسة: نموذج الرأي الفني وصياغة القرار النهائي</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            صياغة الأساس الفني والتنظيمي واختيار التوصية الرسمية الموجهة للمكتب الفني والمدير العام.
          </p>
        </div>

        <button
          onClick={() => updateStepStatus('step6', 'معتمدة')}
          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>اعتماد الرأي الفني</span>
        </button>
      </div>

      {/* Decision Radio Grid Options */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <FileCheck className="w-4 h-4 text-amber-500" />
          <span>خيارات القرار النهائي (8 مسارات تنظيمية):</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {decisionOptions.map((opt) => {
            const isSelected = opinion.finalRecommendation === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => handleDecisionSelect(opt.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition space-y-1.5 ${
                  isSelected
                    ? 'bg-blue-50/90 dark:bg-blue-950/60 border-blue-600 shadow-sm ring-1 ring-blue-500'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{opt.label}</span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-400'
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{opt.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Fields Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-5 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* الوقائع */}
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">الوقائع والأحداث الإجرائية:</label>
            <textarea
              rows={3}
              value={opinion.facts}
              onChange={(e) =>
                setCurrentRequest((prev) => ({
                  ...prev,
                  technicalOpinion: { ...prev.technicalOpinion, facts: e.target.value },
                }))
              }
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
            />
          </div>

          {/* النتائج الفنية المتحققة */}
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">النتائج الفنية المتحققة:</label>
            <textarea
              rows={3}
              value={opinion.verifiedTechnicalFindings}
              onChange={(e) =>
                setCurrentRequest((prev) => ({
                  ...prev,
                  technicalOpinion: { ...prev.technicalOpinion, verifiedTechnicalFindings: e.target.value },
                }))
              }
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
            />
          </div>

          {/* الأساس الفني */}
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">الأساس والمرجع الفني:</label>
            <textarea
              rows={3}
              value={opinion.technicalBasis}
              onChange={(e) =>
                setCurrentRequest((prev) => ({
                  ...prev,
                  technicalOpinion: { ...prev.technicalOpinion, technicalBasis: e.target.value },
                }))
              }
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
            />
          </div>

          {/* الأساس التنظيمي */}
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">الأساس التنظيمي والقانوني:</label>
            <textarea
              rows={3}
              value={opinion.regulatoryBasis}
              onChange={(e) =>
                setCurrentRequest((prev) => ({
                  ...prev,
                  technicalOpinion: { ...prev.technicalOpinion, regulatoryBasis: e.target.value },
                }))
              }
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
            />
          </div>
        </div>

        {/* Conditions Section */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <label className="block font-bold text-slate-900 dark:text-slate-100">
            اشتراطات الاعتماد والشهادة المعتمدة ({opinion.conditions.length} شروط):
          </label>

          <div className="space-y-2">
            {opinion.conditions.map((cond, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg"
              >
                <div className="flex items-start gap-2">
                  <span className="font-bold font-mono text-blue-600">{idx + 1}.</span>
                  <p className="text-slate-800 dark:text-slate-200">{cond}</p>
                </div>
                <button
                  onClick={() => handleDeleteCondition(idx)}
                  className="p-1 text-slate-400 hover:text-rose-600 transition shrink-0"
                  title="حذف الشرط"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add condition input */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={newConditionInput}
              onChange={(e) => setNewConditionInput(e.target.value)}
              placeholder="إضافة شرط ملزم بالشهادة..."
              className="flex-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded"
            />
            <button
              onClick={handleAddCondition}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold transition flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة شرط</span>
            </button>
          </div>
        </div>

        {/* Justification Text Area */}
        <div className="pt-3">
          <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">مبررات قرار الموافقة أو الرفض النهائي:</label>
          <textarea
            rows={3}
            value={opinion.decisionJustification}
            onChange={(e) =>
              setCurrentRequest((prev) => ({
                ...prev,
                technicalOpinion: { ...prev.technicalOpinion, decisionJustification: e.target.value },
              }))
            }
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-bold text-blue-900 dark:text-blue-200"
          />
        </div>
      </div>
    </div>
  );
};
