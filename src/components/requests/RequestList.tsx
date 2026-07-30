/**
 * @file RequestList.tsx
 * Advanced Request List Screen with Multi-filtering, Date Range, Reviewer & Equipment Type,
 * view toggles, and memory state caching in localStorage.
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { StatusBadgeIndicator } from '../common/StatusBadgeIndicator';
import { PriorityBadge } from '../common/PriorityBadge';
import {
  Search,
  Filter,
  Layers,
  Grid,
  List,
  Eye,
  Plus,
  Calendar,
  Building,
  User,
  RotateCcw,
  Sparkles,
  X,
  Radio,
  CheckCircle2,
} from 'lucide-react';

export const RequestList: React.FC = () => {
  const { mockRequests = [], mockUsers = [], setCurrentRequest, setActiveScreen, setActiveStep, addToast } = useApp();

  // Load cached filter state from localStorage if available
  const [searchTerm, setSearchTerm] = useState<string>(() => {
    try {
      const cached = localStorage.getItem('request_filters_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        return parsed.searchTerm || '';
      }
    } catch {}
    return '';
  });

  const [dateFrom, setDateFrom] = useState<string>(() => {
    try {
      const cached = localStorage.getItem('request_filters_cache');
      if (cached) return JSON.parse(cached).dateFrom || '';
    } catch {}
    return '';
  });

  const [dateTo, setDateTo] = useState<string>(() => {
    try {
      const cached = localStorage.getItem('request_filters_cache');
      if (cached) return JSON.parse(cached).dateTo || '';
    } catch {}
    return '';
  });

  const [selectedReviewer, setSelectedReviewer] = useState<string>(() => {
    try {
      const cached = localStorage.getItem('request_filters_cache');
      if (cached) return JSON.parse(cached).selectedReviewer || 'ALL';
    } catch {}
    return 'ALL';
  });

  const [selectedEquipmentType, setSelectedEquipmentType] = useState<string>(() => {
    try {
      const cached = localStorage.getItem('request_filters_cache');
      if (cached) return JSON.parse(cached).selectedEquipmentType || 'ALL';
    } catch {}
    return 'ALL';
  });

  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>(() => {
    try {
      const cached = localStorage.getItem('request_filters_cache');
      if (cached) return JSON.parse(cached).selectedStatusFilter || 'ALL';
    } catch {}
    return 'ALL';
  });

  const [viewMode, setViewMode] = useState<'table' | 'grid'>(() => {
    try {
      const cached = localStorage.getItem('request_filters_cache');
      if (cached) return JSON.parse(cached).viewMode || 'table';
    } catch {}
    return 'table';
  });

  // Save filters to localStorage whenever any filter state changes
  useEffect(() => {
    try {
      const cacheData = {
        searchTerm,
        dateFrom,
        dateTo,
        selectedReviewer,
        selectedEquipmentType,
        selectedStatusFilter,
        viewMode,
      };
      localStorage.setItem('request_filters_cache', JSON.stringify(cacheData));
    } catch (e) {
      console.warn('Unable to cache request search filters to localStorage', e);
    }
  }, [searchTerm, dateFrom, dateTo, selectedReviewer, selectedEquipmentType, selectedStatusFilter, viewMode]);

  const requests = mockRequests || [];

  // Filter computation
  const filteredRequests = requests.filter((req) => {
    // 1. Text Search
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      req.requestNumber.toLowerCase().includes(term) ||
      req.applicant.name.toLowerCase().includes(term) ||
      req.brand.toLowerCase().includes(term) ||
      req.model.toLowerCase().includes(term) ||
      req.deviceName.toLowerCase().includes(term) ||
      req.assignedReviewer.toLowerCase().includes(term);

    // 2. Date Range Filter
    let matchesDate = true;
    if (dateFrom) {
      matchesDate = matchesDate && req.submissionDate >= dateFrom;
    }
    if (dateTo) {
      matchesDate = matchesDate && req.submissionDate <= dateTo;
    }

    // 3. Reviewer Filter
    const matchesReviewer =
      selectedReviewer === 'ALL' || req.assignedReviewer.includes(selectedReviewer);

    // 4. Equipment Type / Category
    const matchesEquipment =
      selectedEquipmentType === 'ALL' ||
      req.equipmentCategory === selectedEquipmentType ||
      req.equipmentType === selectedEquipmentType;

    // 5. Status
    const matchesStatus =
      selectedStatusFilter === 'ALL' ||
      req.status === selectedStatusFilter ||
      (selectedStatusFilter === 'قيد_الدراسة' && req.status.includes('دراسة')) ||
      (selectedStatusFilter === 'محال' && (req.status.includes('محال') || req.status.includes('إفادة')));

    return matchesSearch && matchesDate && matchesReviewer && matchesEquipment && matchesStatus;
  });

  // Active filters count
  const activeFiltersCount =
    (searchTerm ? 1 : 0) +
    (dateFrom ? 1 : 0) +
    (dateTo ? 1 : 0) +
    (selectedReviewer !== 'ALL' ? 1 : 0) +
    (selectedEquipmentType !== 'ALL' ? 1 : 0) +
    (selectedStatusFilter !== 'ALL' ? 1 : 0);

  const handleResetFilters = () => {
    setSearchTerm('');
    setDateFrom('');
    setDateTo('');
    setSelectedReviewer('ALL');
    setSelectedEquipmentType('ALL');
    setSelectedStatusFilter('ALL');
    localStorage.removeItem('request_filters_cache');
    addToast({
      type: 'info',
      title: 'إعادة الضبط',
      message: 'تم تفريغ كافة الفلاتر والبحث بنجاح.',
    });
  };

  const handleOpenStudy = (reqId: string) => {
    const req = mockRequests.find((r) => r.id === reqId);
    if (req) {
      setCurrentRequest(req);
      setActiveStep(req.currentStep);
      setActiveScreen('study');
    }
  };

  // Get unique equipment types & reviewers for dropdown options
  const reviewerOptions = Array.from(
    new Set([
      'م. أحمد باصريح',
      'م. محمد الكبسي',
      'د. صادق الشرفي',
      'م. فاطمة العريقي',
      ...mockUsers.map((u) => u.name || u.fullName),
    ])
  );

  return (
    <div className="space-y-6">
      {/* Header & Advanced Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>قائمة طلبات الموافقة النوعية والسجل العام ({filteredRequests.length})</span>
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/80 text-blue-700 dark:text-blue-200 rounded-full text-xs font-bold font-mono">
                  {activeFiltersCount} فلاتر نشطة
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              تصفية متعددة وحفظ أوتوماتيكي لنتائج البحث والتصفية حسب التاريخ، المراجع، وتصنيف الجهاز.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded transition ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-900 shadow-xs text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
                title="عرض جدول"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-900 shadow-xs text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
                title="عرض بطاقات"
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => handleOpenStudy(mockRequests[0]?.id || '')}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل طلب موافقة جديد</span>
            </button>
          </div>
        </div>

        {/* Multi-Filter Search Panel */}
        <div className="space-y-3">
          {/* Main Text Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="ابحث برقم الطلب، المستورد، الموديل، الماركة، أو المراجع المسؤول..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-9 pl-9 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute left-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Advanced Filtering Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
            {/* Date From */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                <span>تاريخ التقديم (من):</span>
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                <span>تاريخ التقديم (إلى):</span>
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono"
              />
            </div>

            {/* Reviewer Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-indigo-500" />
                <span>المراجع المسؤول:</span>
              </label>
              <select
                value={selectedReviewer}
                onChange={(e) => setSelectedReviewer(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              >
                <option value="ALL">جميع المراجعين بالمكتب الفني</option>
                {reviewerOptions.map((rev) => (
                  <option key={rev} value={rev}>
                    {rev}
                  </option>
                ))}
              </select>
            </div>

            {/* Equipment Type Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-purple-500" />
                <span>نوع وتصنيف الجهاز:</span>
              </label>
              <select
                value={selectedEquipmentType}
                onChange={(e) => setSelectedEquipmentType(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              >
                <option value="ALL">كافة أنواع تصنيفات الأجهزة</option>
                <option value="لاسلكي وشبكات">أجهزة لاسلكية وشبكات</option>
                <option value="ألياف ضوئية">شبكات ومعدات ألياف ضوئية</option>
                <option value="ساتلايت">أجهزة اتصالات فضائية (SatCom)</option>
                <option value="شبكات خلوي 4G/5G">محطات ومعدات خلوي 4G/5G</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-emerald-500" />
                <span>حالة المعاملة:</span>
              </label>
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              >
                <option value="ALL">جميع الحالات والخطوات</option>
                <option value="قيد_الدراسة">قيد الدراسة الفنية</option>
                <option value="بانتظار_الاستكمال">بانتظار استكمال الوثائق</option>
                <option value="محال">محال لقطاع الترددات / الأمن</option>
                <option value="معتمد">معتمد نهائياً</option>
                <option value="مرفوض">مرفوض</option>
              </select>
            </div>
          </div>

          {/* Preset Buttons & Reset Control */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-slate-400">فلاتر سريعة:</span>
              <button
                onClick={() => setSelectedStatusFilter('قيد_الدراسة')}
                className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded text-[11px] font-bold hover:bg-blue-100 transition"
              >
                قيد الدراسة
              </button>
              <button
                onClick={() => setSelectedStatusFilter('بانتظار_الاستكمال')}
                className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded text-[11px] font-bold hover:bg-amber-100 transition"
              >
                بانتظار الاستكمال
              </button>
              <button
                onClick={() => setSelectedStatusFilter('محال')}
                className="px-2.5 py-1 bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded text-[11px] font-bold hover:bg-purple-100 transition"
              >
                الإحالات الترددية
              </button>
              <button
                onClick={() => {
                  const today = new Date().toISOString().split('T')[0];
                  const firstOfMon = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                    .toISOString()
                    .split('T')[0];
                  setDateFrom(firstOfMon);
                  setDateTo(today);
                }}
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded text-[11px] font-bold hover:bg-slate-200 transition"
              >
                طلبات هذا الشهر
              </button>
            </div>

            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="px-3 py-1 bg-rose-50 dark:bg-rose-950/80 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 rounded font-bold transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إلغاء وإعادة ضبط الفلاتر</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area: Table Mode vs Grid Mode */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center space-y-3">
          <Filter className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            لم يتم العثور على نتائج تطابق شروط التصفية الحالية
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            تأكد من دقة عبارة البحث أو جرب تغيير نطاق التاريخ والمراجع المحدد.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold transition"
          >
            إلغاء كافة شروط البحث
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs overflow-hidden">
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">رقم الطلب والتاريخ</th>
                  <th className="p-3">المستورد (المقدم)</th>
                  <th className="p-3">المصنع والبلد</th>
                  <th className="p-3">العلامة والموديل</th>
                  <th className="p-3">نوع الجهاز</th>
                  <th className="p-3">المراجع المسؤول</th>
                  <th className="p-3 text-center">الخطوة الحالية</th>
                  <th className="p-3">الحالة والخيارات</th>
                  <th className="p-3 text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3 font-mono">
                      <p className="font-bold text-blue-900 dark:text-blue-300">{req.requestNumber}</p>
                      <span className="text-[10px] text-slate-400">{req.submissionDate}</span>
                    </td>
                    <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{req.applicant.name}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">
                      {req.manufacturer.companyName} ({req.manufacturer.country})
                    </td>
                    <td className="p-3 font-bold text-slate-900 dark:text-slate-100">
                      {req.brand} <span className="font-mono text-slate-500 font-normal">{req.model}</span>
                    </td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">{req.equipmentType}</td>
                    <td className="p-3 text-indigo-700 dark:text-indigo-300 font-bold">
                      {req.assignedReviewer}
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-blue-600">
                      الخطوة {req.currentStep} من 8
                    </td>
                    <td className="p-3">
                      <StatusBadgeIndicator
                        status={req.status}
                        lastUpdated={req.submissionDate ? `${req.submissionDate} 14:30` : '2026-07-30 14:30'}
                        certificateNumber={req.certificateNumber}
                        size="sm"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleOpenStudy(req.id)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold transition shadow-xs flex items-center justify-center gap-1 mx-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>دراسة المعاملة</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards Grid Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="font-mono font-bold text-xs text-blue-900 dark:text-blue-300">
                    {req.requestNumber}
                  </span>
                  <StatusBadgeIndicator
                    status={req.status}
                    lastUpdated={req.submissionDate ? `${req.submissionDate} 14:30` : '2026-07-30 14:30'}
                    certificateNumber={req.certificateNumber}
                    size="sm"
                  />
                </div>

                <p className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                  {req.brand} {req.model}
                </p>
                <p className="text-xs text-slate-500">{req.deviceName}</p>

                <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300 pt-1">
                  <p className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-bold">{req.applicant.name}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-300 font-bold">
                    <User className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
                    <span>المراجع: {req.assignedReviewer}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-500">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>تاريخ التقديم: {req.submissionDate}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleOpenStudy(req.id)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>فتح كراسة الدراسة الفنية</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
