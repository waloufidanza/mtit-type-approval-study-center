/**
 * @file QuarterlyPerformanceWidget.tsx
 * Dashboard Widget displaying Average Request Processing Time during the current quarter (Q3 2026).
 * Uses Recharts to visualize SLA compliance, processing duration breakdown, and efficiency gains.
 */

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  AreaChart,
  Area,
} from 'recharts';
import {
  Clock,
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
  Filter,
  ArrowUpRight,
  Zap,
} from 'lucide-react';

export const QuarterlyPerformanceWidget: React.FC = () => {
  const [selectedQuarter, setSelectedQuarter] = useState<'Q3_2026' | 'Q2_2026' | 'Q1_2026'>('Q3_2026');

  // Average processing time (in hours) by equipment category during current quarter
  const currentQuarterData = [
    { category: 'أجهزة طرفية وموبايل', actualHours: 22, targetSLA: 48, requestsCount: 45 },
    { category: 'محطات بث وراديو', actualHours: 38, targetSLA: 48, requestsCount: 28 },
    { category: 'شبكات ألياف وسيرفرات', actualHours: 31, targetSLA: 48, requestsCount: 34 },
    { category: 'معدات اتصالات فضائية', actualHours: 54, targetSLA: 72, requestsCount: 16 },
    { category: 'إفراج جمركي مؤقت', actualHours: 18, targetSLA: 24, requestsCount: 52 },
  ];

  // Month-by-Month trend inside Q3 (July, August, September)
  const monthlySlaTrendData = [
    { week: 'الأسبوع 1 (يوليو)', avgHours: 44, targetHours: 48, completionRate: 91 },
    { week: 'الأسبوع 2 (يوليو)', avgHours: 39, targetHours: 48, completionRate: 93 },
    { week: 'الأسبوع 3 (يوليو)', avgHours: 35, targetHours: 48, completionRate: 96 },
    { week: 'الأسبوع 4 (يوليو)', avgHours: 31, targetHours: 48, completionRate: 98 },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4 font-sans">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>متوسط زمن معالجة الطلبات خلال الربع الحالي (Q3 Processing Time Analytics)</span>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full text-[10px] font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span>تحسن الكفاءة +18.4%</span>
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              قياس مؤشرات الأداء الزمني (SLA Key Performance Indicators) لإصدار شهادات الموافقة النوعية
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => setSelectedQuarter('Q3_2026')}
              className={`px-2.5 py-1 rounded-lg transition ${
                selectedQuarter === 'Q3_2026'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              الربع الثالث 2026
            </button>
            <button
              onClick={() => setSelectedQuarter('Q2_2026')}
              className={`px-2.5 py-1 rounded-lg transition ${
                selectedQuarter === 'Q2_2026'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              الربع الثاني 2026
            </button>
          </div>
        </div>
      </div>

      {/* KPI Highlights Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
            متوسط وقت المعالجة الإجمالي:
          </span>
          <p className="text-lg font-extrabold font-mono text-blue-600 dark:text-blue-400 flex items-baseline gap-1">
            <span>32.8</span>
            <span className="text-xs font-sans text-slate-500">ساعة</span>
          </p>
          <span className="text-[10px] text-emerald-600 font-bold">أقل من الهدف المحدد (48 ساعة)</span>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
            نسبة الالتزام بالمهلة القياسية SLA:
          </span>
          <p className="text-lg font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
            94.2%
          </p>
          <span className="text-[10px] text-slate-400">من إجمالي 175 طلب معالج</span>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
            أسرع زمن معالجة (إفراج مؤقت):
          </span>
          <p className="text-lg font-extrabold font-mono text-purple-600 dark:text-purple-400 flex items-baseline gap-1">
            <span>18</span>
            <span className="text-xs font-sans text-slate-500">ساعة</span>
          </p>
          <span className="text-[10px] text-purple-600 font-bold">عبر منفذ شحن الحدودي</span>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
            وفر الساعات المنجزة هذا الربع:
          </span>
          <p className="text-lg font-extrabold font-mono text-amber-600 dark:text-amber-400">
            2,660 ساعة
          </p>
          <span className="text-[10px] text-amber-600 font-bold">بفضل التحليل الآلي للترددات</span>
        </div>
      </div>

      {/* Visual Recharts Section (Bar Chart & Area Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1">
        {/* Bar Chart: Avg Processing Time per Equipment Category (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-blue-600" />
              <span>زمن المعالجة الفعلي مقابل الهدف التقديري لكل فئة معدات (بالساعات)</span>
            </h4>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentQuarterData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="category" tick={{ fontSize: 10 }} interval={0} angle={-10} textAnchor="end" />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(val: number) => [`${val} ساعة`, 'المؤشر الزمني']} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="actualHours" name="زمن المعالجة الفعلي (ساعة)" fill="#2563eb" radius={[6, 6, 0, 0]} />
                <Bar dataKey="targetSLA" name="المهلة التنظيمية SLA (ساعة)" fill="#94a3b8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Area Chart: SLA Trend across Weeks in Quarter (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>معدل انخفاض ساعات المعالجة الأسبوعي</span>
            </h4>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlySlaTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAvgHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="week" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="avgHours"
                  name="متوسط ساعات الانجاز"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorAvgHours)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
