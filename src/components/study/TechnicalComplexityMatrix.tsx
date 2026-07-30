/**
 * @file TechnicalComplexityMatrix.tsx
 * Technical Complexity & Risk Assessment Matrix Component for Study Center.
 * Analyzes technical specifications of selected equipment (Frequency, EIRP, Encryption, Dual-Use)
 * and generates a 2D Heatmap Risk Assessment Matrix to assist reviewers in decision-making.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Radio,
  Lock,
  Cpu,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from 'lucide-react';

export interface RiskFactor {
  id: string;
  category: string;
  name: string;
  likelihood: 1 | 2 | 3 | 4; // 1: منخفض جداً, 4: حرج
  impact: 1 | 2 | 3 | 4;     // 1: طفيف, 4: حرج
  score: number;             // Likelihood * Impact
  status: 'منخفض' | 'متوسط' | 'مرتفع' | 'حرج';
  mitigation: string;
}

export const TechnicalComplexityMatrix: React.FC = () => {
  const { currentRequest, addToast } = useApp();
  const [showAdjuster, setShowAdjuster] = useState(false);

  // Dynamic Risk Factors derived from equipment technical specs
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([
    {
      id: 'rf-1',
      category: 'طيف الترددات',
      name: 'مخاطر التداخل مع الشبكات المجاورة (Spectrum Overlap)',
      likelihood: 2,
      impact: 3,
      score: 6,
      status: 'متوسط',
      mitigation: 'تطبيق فلترة النطاق الترددي المخصص (Band-pass filtering) وتحديد القنوات التشغيلية.',
    },
    {
      id: 'rf-2',
      category: 'القدرة المشعة EIRP',
      name: 'تجاوز حدود القدرة المسموحة بالمناطق المأهولة (EMF Radiation)',
      likelihood: 1,
      impact: 2,
      score: 2,
      status: 'منخفض',
      mitigation: 'الالتزام بمعايير ICNIRP الدولية وتركيب الهوائي على ارتفاع لا يقل عن 12 متراً.',
    },
    {
      id: 'rf-3',
      category: 'الأمان والتشفير',
      name: 'قوة بروتوكولات حماية البيانات (AES-256 / WPA3 Security)',
      likelihood: 1,
      impact: 3,
      score: 3,
      status: 'منخفض',
      mitigation: 'الجهاز يعمل ببروتوكولات تشفير معتمدة دولياً ومستوفية لمتطلبات الأمن السايبراني القومي.',
    },
    {
      id: 'rf-4',
      category: 'الاستخدام المزدوج',
      name: 'حساسية أجهزة التوجيه عالية السرعة والاستخدام المزدوج',
      likelihood: 2,
      impact: 2,
      score: 4,
      status: 'متوسط',
      mitigation: 'اشتراط التسجيل الحصري لموقع التركيب وتعهد المستورد بعدم تحويل الاستخدام.',
    },
  ]);

  // Calculate Overall Risk Level & Score
  const totalScore = riskFactors.reduce((acc, curr) => acc + curr.score, 0);
  const maxPossibleScore = riskFactors.length * 16;
  const overallRiskPercentage = Math.round((totalScore / maxPossibleScore) * 100);

  let overallStatus: 'منخفض' | 'متوسط' | 'مرتفع' | 'حرج' = 'منخفض';
  let badgeBg = 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200';
  if (overallRiskPercentage > 60) {
    overallStatus = 'حرج';
    badgeBg = 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950 dark:text-rose-200';
  } else if (overallRiskPercentage > 35) {
    overallStatus = 'مرتفع';
    badgeBg = 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200';
  } else if (overallRiskPercentage > 18) {
    overallStatus = 'متوسط';
    badgeBg = 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950 dark:text-blue-200';
  }

  // Update Likelihood or Impact for a factor
  const handleUpdateFactor = (id: string, field: 'likelihood' | 'impact', val: number) => {
    setRiskFactors((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const updatedLikelihood = field === 'likelihood' ? (val as any) : f.likelihood;
          const updatedImpact = field === 'impact' ? (val as any) : f.impact;
          const newScore = updatedLikelihood * updatedImpact;
          let status: 'منخفض' | 'متوسط' | 'مرتفع' | 'حرج' = 'منخفض';
          if (newScore >= 12) status = 'حرج';
          else if (newScore >= 8) status = 'مرتفع';
          else if (newScore >= 4) status = 'متوسط';

          return {
            ...f,
            likelihood: updatedLikelihood,
            impact: updatedImpact,
            score: newScore,
            status,
          };
        }
        return f;
      })
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4 font-sans text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 rounded-xl">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>مصفوفة تقييم التعقيد والمخاطر الفنية (Technical Complexity & Risk Matrix)</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeBg}`}>
                مستوى المخاطر الكلي: {overallStatus} ({overallRiskPercentage}%)
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              تحليل آلي ومعايير تقييم المخاطر الفنية لمعدة ({currentRequest.brand} {currentRequest.model})
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAdjuster((prev) => !prev)}
          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
        >
          <Sliders className="w-3.5 h-3.5 text-purple-500" />
          <span>تعديل الأوزان المعيارية</span>
          {showAdjuster ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* 2D Heatmap Matrix Grid (4x4 Matrix Visualizer) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Heatmap Visualizer (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-950 text-slate-100 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-extrabold text-xs text-purple-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>مصفوفة تقييم المخاطر (Likelihood vs Impact Heatmap)</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">4x4 Standard Grid</span>
          </div>

          {/* Grid Layout */}
          <div className="space-y-1">
            <div className="text-center font-bold text-[10px] text-slate-400 pb-1">
              ← الأثر المتوقع (Impact) →
            </div>

            <div className="grid grid-cols-5 gap-1.5 text-center font-mono text-[10px]">
              {/* Row Headers */}
              <div className="col-span-1" />
              <div className="p-1 bg-slate-900 text-slate-400 font-bold rounded">طفيف (1)</div>
              <div className="p-1 bg-slate-900 text-slate-400 font-bold rounded">متوسط (2)</div>
              <div className="p-1 bg-slate-900 text-slate-400 font-bold rounded">عالي (3)</div>
              <div className="p-1 bg-slate-900 text-slate-400 font-bold rounded">حرج (4)</div>

              {/* Rows 4 to 1 */}
              {[4, 3, 2, 1].map((lh) => (
                <React.Fragment key={`row-${lh}`}>
                  <div className="p-1.5 bg-slate-900 text-slate-300 font-bold rounded flex items-center justify-center text-[9px]">
                    احتمالية ({lh})
                  </div>
                  {[1, 2, 3, 4].map((imp) => {
                    const cellScore = lh * imp;
                    const matchingFactors = riskFactors.filter((f) => f.likelihood === lh && f.impact === imp);
                    let cellBg = 'bg-slate-900 text-slate-500 border border-slate-800';
                    if (cellScore >= 12) cellBg = 'bg-rose-950/80 text-rose-200 border border-rose-800 font-bold';
                    else if (cellScore >= 8) cellBg = 'bg-amber-950/80 text-amber-200 border border-amber-800 font-bold';
                    else if (cellScore >= 4) cellBg = 'bg-blue-950/80 text-blue-200 border border-blue-800 font-bold';
                    else cellBg = 'bg-emerald-950/80 text-emerald-200 border border-emerald-800 font-bold';

                    return (
                      <div
                        key={`cell-${lh}-${imp}`}
                        className={`p-2 rounded flex flex-col items-center justify-center transition min-h-[48px] relative ${cellBg}`}
                      >
                        <span className="opacity-40 text-[9px]">{cellScore}</span>
                        {matchingFactors.length > 0 && (
                          <div className="mt-0.5 px-1 bg-purple-500 text-white rounded font-mono text-[9px] font-extrabold animate-pulse">
                            {matchingFactors.length} عنصر
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800 pt-2 font-mono">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> منخفض (1-3)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> متوسط (4-7)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> مرتفع (8-11)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> حرج (12-16)
            </span>
          </div>
        </div>

        {/* Detailed Risk Factors Cards (6 Cols) */}
        <div className="lg:col-span-6 space-y-2">
          <span className="font-extrabold text-slate-900 dark:text-slate-100 text-xs block">
            تحليل عناصر المخاطر والتخفيفات التكنولوجية المقترحة:
          </span>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {riskFactors.map((rf) => (
              <div
                key={rf.id}
                className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>{rf.name}</span>
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      rf.status === 'حرج'
                        ? 'bg-rose-100 text-rose-900 border-rose-300'
                        : rf.status === 'مرتفع'
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : rf.status === 'متوسط'
                        ? 'bg-blue-100 text-blue-900 border-blue-300'
                        : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    }`}
                  >
                    مستوى {rf.status} (درجة {rf.score})
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                  <strong className="text-purple-600 dark:text-purple-400">إجراء التخفيف:</strong> {rf.mitigation}
                </p>

                {/* Adjuster controls if open */}
                {showAdjuster && (
                  <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10px]">
                    <div>
                      <label className="text-slate-500 block">الاحتمالية (1-4):</label>
                      <select
                        value={rf.likelihood}
                        onChange={(e) => handleUpdateFactor(rf.id, 'likelihood', parseInt(e.target.value))}
                        className="w-full p-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-bold"
                      >
                        <option value={1}>1 - منخفض جداً</option>
                        <option value={2}>2 - متوسط</option>
                        <option value={3}>3 - عالي</option>
                        <option value={4}>4 - حرج جداً</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-500 block">الأثر (1-4):</label>
                      <select
                        value={rf.impact}
                        onChange={(e) => handleUpdateFactor(rf.id, 'impact', parseInt(e.target.value))}
                        className="w-full p-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-bold"
                      >
                        <option value={1}>1 - طفيف</option>
                        <option value={2}>2 - متوسط</option>
                        <option value={3}>3 - عالي</option>
                        <option value={4}>4 - حرج</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviewer Actionable Recommendation Banner */}
      <div className="p-3 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-xl flex items-center justify-between text-xs text-purple-950 dark:text-purple-200">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" />
          <div>
            <strong className="font-extrabold block text-xs">
              التوصية الفنية الموصى بها للمراجع (Reviewer Decision Guidance):
            </strong>
            <p className="text-[11px] text-purple-800 dark:text-purple-300">
              بناءً على نتائج مصفوفة المخاطر ({overallRiskPercentage}%)، نوصي بـ{' '}
              <span className="font-bold underline">"الموافقة الفنية المشروطة"</span> مع تثبيت حدود القدرة اللاسلكية EIRP وإلزام المستورد ببروتوكول الربط الأمن.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
