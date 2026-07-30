/**
 * @file Dashboard.tsx
 * Executive Dashboard with Statistics, Visual Charts (Recharts), Recent Requests & Critical Alerts
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { QuarterlyPerformanceWidget } from './QuarterlyPerformanceWidget';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  XCircle,
  TrendingUp,
  Radio,
  ArrowRight,
  ShieldAlert,
  Layers,
  Sparkles,
  PieChart as PieIcon,
  Activity,
  BellRing,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { mockRequests = [], setCurrentRequest, setActiveScreen, setActiveStep, addToast } = useApp();

  const requests = mockRequests || [];

  // Summary counts
  const totalCount = requests.length;
  const underStudyCount = requests.filter(
    (r) => r.status === 'قيد_الدراسة' || r.status === 'قيد_إعداد_الدراسة_الفنية'
  ).length;
  const pendingDeficiencyCount = requests.filter((r) => r.status === 'بانتظار_الاستكمال').length;
  const referredCount = requests.filter(
    (r) =>
      r.status === 'محال' ||
      r.status === 'بانتظار_إفادة_الترددات' ||
      r.status === 'بانتظار_التنسيق_الأمني'
  ).length;
  const approvedCount = requests.filter((r) => r.status === 'معتمد' || r.status === 'معتمدة').length;
  const rejectedCount = requests.filter((r) => r.status === 'مرفوض' || r.status === 'مرفوضة').length;

  // Chart 1 Data: PieChart - Status Distribution (توزيع حالات الطلبات)
  const statusPieData = [
    { name: 'قيد الدراسة الفنية', value: underStudyCount || 3, color: '#2563eb' },
    { name: 'بانتظار الاستكمال', value: pendingDeficiencyCount || 2, color: '#d97706' },
    { name: 'محال للترددات/الأمن', value: referredCount || 2, color: '#7c3aed' },
    { name: 'معتمد وصادر', value: approvedCount || 4, color: '#059669' },
    { name: 'مرفوض', value: rejectedCount || 1, color: '#dc2626' },
  ];

  // Chart 2 Data: LineChart - Monthly Submissions & Approvals Trend (تطور الطلبات خلال الأشهر الماضية)
  const monthlyTrendData = [
    { month: 'يناير', requests: 14, approved: 11 },
    { month: 'فبراير', requests: 19, approved: 16 },
    { month: 'مارس', requests: 26, approved: 21 },
    { month: 'أبريل', requests: 23, approved: 19 },
    { month: 'مايو', requests: 31, approved: 27 },
    { month: 'يونيو', requests: 29, approved: 25 },
    { month: 'يوليو', requests: 38, approved: 32 },
  ];

  // Chart 3 Data: BarChart - Equipment Categories
  const equipmentCategoryData = [
    { name: 'لاسلكي وشبكات', count: 42, color: '#3b82f6' },
    { name: 'ألياف ضوئية', count: 28, color: '#10b981' },
    { name: 'اتصالات فضائية', count: 18, color: '#8b5cf6' },
    { name: 'خلوي 4G/5G', count: 15, color: '#f59e0b' },
  ];

  const handleOpenRequestInStudyCenter = (reqId: string) => {
    const req = mockRequests.find((r) => r.id === reqId);
    if (req) {
      setCurrentRequest(req);
      setActiveStep(req.currentStep);
      setActiveScreen('study');
    }
  };

  const handleTriggerReferralAlertTest = () => {
    addToast({
      type: 'warning',
      title: 'اقتراب مهلة الإحالة الترددية',
      message: 'تنبيه: متبقي أقل من 48 ساعة لاستلام إفادة طيف الترددات للطلب رقم MTIT-TA-2026-013077.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 text-white rounded-2xl p-6 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-blue-500/30 text-blue-200 rounded text-xs font-bold font-mono">
              النظام الداخلي v2.4
            </span>
            <span className="text-xs text-blue-200">• وزارة الاتصالات وتقنية المعلومات - الجمهورية اليمنية</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">
            لوحة تحكم مركز إعداد الدراسات والمراجعة الفنية
          </h1>
          <p className="text-xs text-blue-100 max-w-2xl leading-relaxed">
            متابعة حية لتدفق طلبات الموافقة النوعية، فحص المطابقة الترددية، وإصدار الشهادات المعتمدة.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTriggerReferralAlertTest}
            className="px-3 py-2 bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            title="اختبار تنبيه اقتراب مهلة الإحالة"
          >
            <BellRing className="w-4 h-4 text-amber-400" />
            <span>اختبار تنبيه مهلة الإحالة</span>
          </button>

          <button
            onClick={() => handleOpenRequestInStudyCenter(mockRequests[0]?.id || '')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-2 shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            <span>فتح أول طلب جاري للتدقيق</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards Grid (6 Metric Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">إجمالي الطلبات</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-extrabold font-mono text-slate-900 dark:text-slate-100">{totalCount}</p>
          <span className="text-[10px] text-slate-400">طلب موافقة نوعية</span>
        </div>

        {/* Under Study */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">قيد الدراسة الفنية</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-extrabold font-mono text-blue-600 dark:text-blue-400">{underStudyCount}</p>
          <span className="text-[10px] text-blue-500 font-bold">تتطلب دراسة لمعد التقرير</span>
        </div>

        {/* Pending Deficiencies */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">بانتظار الاستكمال</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-extrabold font-mono text-amber-600 dark:text-amber-400">{pendingDeficiencyCount}</p>
          <span className="text-[10px] text-amber-600 font-bold">لدى المورد / الممثل</span>
        </div>

        {/* Referred */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">محالة للجهات</span>
            <Send className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-xl font-extrabold font-mono text-purple-600 dark:text-purple-400">{referredCount}</p>
          <span className="text-[10px] text-purple-500 font-bold">طيف الترددات والأمن</span>
        </div>

        {/* Approved */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">معتمدة وصادرة</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">{approvedCount}</p>
          <span className="text-[10px] text-emerald-600 font-bold">شهادة جاهزة للتسليم</span>
        </div>

        {/* Rejected */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">مرفوضة</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-xl font-extrabold font-mono text-rose-600 dark:text-rose-400">{rejectedCount}</p>
          <span className="text-[10px] text-rose-500 font-bold">عدم مطابقة فنية</span>
        </div>
      </div>

      {/* Visual Analytics Grid with Recharts (Pie Chart & Line Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Recharts Pie Chart - Status Distribution (توزيع حالات الطلبات - مخطط دائري) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <PieIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>توزيع حالات الطلبات بشكل مرئي (مخطط دائري)</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">إحصاء حي</span>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`status-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: number) => [`${val} طلبات`, 'العدد']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-2 text-[10px] justify-center pt-1 border-t border-slate-100 dark:border-slate-800">
            {statusPieData.map((st) => (
              <div key={st.name} className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: st.color }} />
                <span>{st.name} ({st.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Recharts Line Chart - Monthly Request Trends (تطور الطلبات خلال الأشهر الماضية - مخطط خطي) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>تطور الطلبات والاعتمادات خلال الأشهر الماضية (مخطط خطي)</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">تحليل الاتجاه</span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line
                  type="monotone"
                  dataKey="requests"
                  name="إجمالي الطلبات المقدمة"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="approved"
                  name="الشهادات الصادرة واللمعتمدة"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quarterly Performance Analytics Widget (SLA Processing Time Analysis) */}
      <QuarterlyPerformanceWidget />

      {/* Equipment Bar Chart & Critical Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Equipment Categories Bar Chart */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-purple-600" />
              <span>تصنيف الأجهزة الفنية بالمنظومة</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">حجم المعاملات</span>
          </div>

          <div className="h-48 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={equipmentCategoryData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {equipmentCategoryData.map((entry, index) => (
                    <Cell key={`eq-bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Requests Table (8 Cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>أحدث طلبات الموافقة النوعية الجارية ({mockRequests.length})</span>
            </h3>

            <button
              onClick={() => setActiveScreen('requests')}
              className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
            >
              <span>عرض كافة الطلبات</span>
              <ArrowRight className="w-3 h-3 rotate-180" />
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">رقم الطلب</th>
                  <th className="p-3">المستورد / الممثل</th>
                  <th className="p-3">الماركة والموديل</th>
                  <th className="p-3">الخطوة الحالية</th>
                  <th className="p-3">الحالة والخيارات</th>
                  <th className="p-3 text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {mockRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3 font-mono font-bold text-blue-900 dark:text-blue-300">{req.requestNumber}</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{req.applicant.name}</td>
                    <td className="p-3">
                      <span className="font-bold">{req.brand}</span> <span className="font-mono text-slate-500">{req.model}</span>
                    </td>
                    <td className="p-3 font-mono text-slate-600 dark:text-slate-400">الخطوة {req.currentStep} من 8</td>
                    <td className="p-3">
                      <StatusBadge status={req.status} size="sm" />
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleOpenRequestInStudyCenter(req.id)}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold transition shadow-xs"
                      >
                        فتح في مركز الدراسة
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
