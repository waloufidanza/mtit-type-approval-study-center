/**
 * @file EligibilityChecklist.tsx
 * Interactive checklist component for certificate issuance requirements.
 * Allows checking/unchecking technical, financial, security, and administrative items.
 * Displays prominent 'جاهز للإصدار' badge ONLY when ALL items are selected/passed.
 */

import React, { useState, useEffect } from 'react';
import { EligibilityItem } from '../../services/certificateService';
import { FileCheck, CheckCircle2, AlertTriangle, RefreshCw, CheckSquare, Square, ShieldCheck, Filter } from 'lucide-react';

interface EligibilityChecklistProps {
  initialItems: EligibilityItem[];
  onStatusChange?: (isReady: boolean, updatedItems: EligibilityItem[]) => void;
}

export const EligibilityChecklist: React.FC<EligibilityChecklistProps> = ({
  initialItems,
  onStatusChange,
}) => {
  const [items, setItems] = useState<EligibilityItem[]>(initialItems);
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');

  // Sync state if initialItems prop updates
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const allPassed = items.length > 0 && items.every((i) => i.passed);
  const passedCount = items.filter((i) => i.passed).length;
  const progressPercent = Math.round((passedCount / (items.length || 1)) * 100);

  // Toggle single item
  const handleToggle = (id: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, passed: !item.passed } : item
    );
    setItems(updated);
    const ready = updated.every((i) => i.passed);
    if (onStatusChange) {
      onStatusChange(ready, updated);
    }
  };

  // Select All items
  const handleSelectAll = () => {
    const updated = items.map((item) => ({ ...item, passed: true }));
    setItems(updated);
    if (onStatusChange) {
      onStatusChange(true, updated);
    }
  };

  // Reset items to false
  const handleReset = () => {
    const updated = items.map((item) => ({ ...item, passed: false }));
    setItems(updated);
    if (onStatusChange) {
      onStatusChange(false, updated);
    }
  };

  const filteredItems = items.filter(
    (item) => selectedCategory === 'الكل' || item.category === selectedCategory
  );

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
      {/* Header Banner & Readiness Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-600 text-white rounded-lg">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>قائمة استيفاء الشروط وأهلية الإصدار</span>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono font-bold px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                {passedCount}/{items.length} بنود مكتملة
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              تحديد واختبار كافة المتطلبات الفنية، المالية، والأمنية لضمان الامتثال
            </p>
          </div>
        </div>

        {/* PROMINENT READINESS BADGE (Shown ONLY when all items are checked) */}
        <div>
          {allPassed ? (
            <div className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-extrabold text-xs shadow-md flex items-center gap-2 border border-emerald-400 animate-pulse">
              <CheckCircle2 className="w-5 h-5 text-amber-300" />
              <div className="text-right">
                <span className="block text-xs font-black">جاهز للإصدار النهائي</span>
                <span className="block text-[9px] font-normal opacity-90">استيفاء 100% من الشروط والموافقات</span>
              </div>
            </div>
          ) : (
            <div className="px-3.5 py-1.5 bg-amber-50 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 rounded-xl font-bold text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="block text-xs">غير مكتمل ({items.length - passedCount} متبقية)</span>
                <span className="block text-[9px] text-amber-700 dark:text-amber-400">يتطلب استكمال جميع البنود للتفعيل</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar & Quick Controls */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
          <span>نسبة اكتمال متطلبات الإصدار:</span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400">{progressPercent}%</span>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
          <div
            className={`h-full transition-all duration-500 ${
              allPassed
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                : 'bg-gradient-to-r from-amber-500 to-emerald-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Quick Actions & Category Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 text-[11px] font-bold">التصنيف:</span>
            {['الكل', 'فني', 'مالي', 'أمني', 'إداري'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 rounded text-xs font-bold transition flex items-center gap-1"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>تحديد الكل</span>
            </button>

            <button
              onClick={handleReset}
              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded text-xs font-bold transition flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>إلغاء الكل</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Checkbox Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {filteredItems.map((item) => (
          <label
            key={item.id}
            onClick={() => handleToggle(item.id)}
            className={`p-3 rounded-xl border cursor-pointer transition flex items-start justify-between gap-3 ${
              item.passed
                ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100 shadow-2xs'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                checked={item.passed}
                onChange={() => {}} // handled by label onClick
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-extrabold leading-snug block">
                  {item.label}
                </span>
                {item.description && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            </div>

            <span className="text-[10px] font-mono px-2 py-0.5 bg-white/80 dark:bg-slate-900 rounded font-bold border border-slate-200 dark:border-slate-700 shrink-0">
              {item.category}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};
