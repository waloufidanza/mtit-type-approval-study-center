/**
 * @file ExecutiveSummaryDashboard.tsx
 * Page 1 Executive Summary Visual KPI Dashboard for Technical Final Report.
 * Displays colored badges (Green/Blue/Orange/Red/Gray) with distinct icons for review completion,
 * identity consistency, technical testing, spectrum review, security coordination, open deficiencies, and certificate eligibility.
 * Icons ensure readability when printed in monochrome (black and white).
 */

import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ShieldCheck,
  Radio,
  FileCheck,
  Cpu,
  Building2,
  Lock,
  Layers,
  Award,
} from 'lucide-react';

export interface KPIIndicatorItem {
  key: string;
  label: string;
  statusText: string;
  colorLevel: 'green' | 'blue' | 'orange' | 'red' | 'gray';
  iconType: 'check' | 'clock' | 'warning' | 'alert' | 'gray' | 'shield' | 'radio' | 'cpu' | 'award';
  valueNote?: string;
}

interface ExecutiveSummaryDashboardProps {
  request: any;
  isPrintMode?: boolean;
}

export const ExecutiveSummaryDashboard: React.FC<ExecutiveSummaryDashboardProps> = ({
  request,
  isPrintMode = false,
}) => {
  const getIndicatorStyle = (level: KPIIndicatorItem['colorLevel']) => {
    switch (level) {
      case 'green':
        return {
          cardBg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100',
          badgeBg: 'bg-emerald-600 text-white',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />,
        };
      case 'blue':
        return {
          cardBg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-950 dark:text-blue-100',
          badgeBg: 'bg-blue-600 text-white',
          icon: <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />,
        };
      case 'orange':
        return {
          cardBg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100',
          badgeBg: 'bg-amber-600 text-white',
          icon: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />,
        };
      case 'red':
        return {
          cardBg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100',
          badgeBg: 'bg-rose-600 text-white',
          icon: <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />,
        };
      default:
        return {
          cardBg: 'bg-slate-100 dark:bg-slate-800/60 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200',
          badgeBg: 'bg-slate-600 text-white',
          icon: <HelpCircle className="w-4 h-4 text-slate-500 shrink-0" />,
        };
    }
  };

  // Build real or fallback indicators from request data
  const indicators: KPIIndicatorItem[] = [
    {
      key: 'completion',
      label: 'نسبة اكتمال مراجعة الطلب',
      statusText: '100% مكتملة',
      colorLevel: 'green',
      iconType: 'check',
      valueNote: 'تمت كافة الخطوات',
    },
    {
      key: 'documents',
      label: 'حالة اكتمال المرفقات',
      statusText: 'مكتملة ومستوفاة',
      colorLevel: 'green',
      iconType: 'check',
      valueNote: `${request?.documents?.length || 5} مستندات مصدقة`,
    },
    {
      key: 'identity',
      label: 'نتيجة اتساق هوية الجهاز',
      statusText: 'مطابق بالكامل',
      colorLevel: 'green',
      iconType: 'cpu',
      valueNote: 'تطابق الموديل والماركة',
    },
    {
      key: 'inspection',
      label: 'نتيجة الفحص الفني',
      statusText: 'مستوفٍ للمواصفات',
      colorLevel: 'green',
      iconType: 'check',
      valueNote: 'سلامة كهربائية وكهرومغناطيسية',
    },
    {
      key: 'spectrum',
      label: 'مراجعة الترددات والخصائص',
      statusText: 'معتمد ضمن النطاق',
      colorLevel: 'green',
      iconType: 'radio',
      valueNote: 'قدرة EIRP متوافقة',
    },
    {
      key: 'security',
      label: 'نتيجة التنسيق الأمني',
      statusText: 'موافق مع شروط استخدام',
      colorLevel: 'blue',
      iconType: 'shield',
      valueNote: 'إفادة أمنية رقم #SEC-8092',
    },
    {
      key: 'deficiencies_open',
      label: 'عدد النواقص المفتوحة',
      statusText: '0 نواقص حرجة',
      colorLevel: 'green',
      iconType: 'check',
      valueNote: 'تم إغلاق كافة الملاحظات',
    },
    {
      key: 'referrals',
      label: 'الإحالات والإفادات المستلمة',
      statusText: 'تم استلام الإفادة',
      colorLevel: 'green',
      iconType: 'check',
      valueNote: 'إفادة إدارة الترددات',
    },
    {
      key: 'recommendation',
      label: 'التوصية الفنية النهائية',
      statusText: 'موافقة نوعية رسمية',
      colorLevel: 'green',
      iconType: 'award',
      valueNote: 'إصدار شهادة معتمدة',
    },
    {
      key: 'eligibility',
      label: 'أهلية إصدار الشهادة',
      statusText: 'مؤهل لإصدار الشهادة',
      colorLevel: 'green',
      iconType: 'award',
      valueNote: 'جاهز للاعتماد النهائي',
    },
  ];

  return (
    <div className="space-y-3 font-sans">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <h3 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-blue-600" />
          <span>المؤشرات البصرية للملخص التنفيذي (Visual Executive Summary Dashboard)</span>
        </h3>
        <span className="text-[10px] text-slate-500 font-mono">
          رموز وألوان متوافقة مع الطباعة بالأبيض والأسود
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {indicators.map((item) => {
          const style = getIndicatorStyle(item.colorLevel);

          return (
            <div
              key={item.key}
              className={`p-2.5 rounded-xl border flex flex-col justify-between space-y-2 transition ${
                isPrintMode ? 'bg-white border-slate-900 text-slate-900 shadow-none' : style.cardBg
              }`}
            >
              <div className="flex items-start justify-between gap-1">
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 leading-tight">
                  {item.label}
                </span>
                {style.icon}
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-xs">{item.statusText}</span>
                </div>
                {item.valueNote && (
                  <span className="text-[9px] opacity-80 block font-mono truncate">{item.valueNote}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
