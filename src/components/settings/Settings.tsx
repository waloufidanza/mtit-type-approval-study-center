/**
 * @file Settings.tsx
 * System Configurations, Technical Standards & Regulatory Policies
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sliders, Shield, Save, Moon, Sun, Check, Stamp } from 'lucide-react';
import { SignatureSettingsManager } from './SignatureSettingsManager';

export const Settings: React.FC = () => {
  const { theme, toggleTheme, addToast } = useApp();

  const handleSaveSettings = () => {
    addToast({
      type: 'success',
      title: 'حفظ الإعدادات',
      message: 'تم حفظ كافة الإعدادات والسياسات الفنية للنظام بنجاح.',
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>إعدادات النظام والسياسات التنظيمية للمواصفة النوعية</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            إدارة الخطة الوطنية للترددات، مدة صلاحيات الشهادات، والرسوم والأختام والتواقيع.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
        >
          <Save className="w-4 h-4" />
          <span>حفظ التغييرات</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Appearance Settings */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
            مظهر النظام والثيم
          </h3>

          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div>
              <span className="font-bold block text-slate-900 dark:text-slate-100">الوضع الليلي (Dark Mode)</span>
              <span className="text-[11px] text-slate-500">مريح للعين أثناء مراجعة التقرير والمستندات</span>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 font-bold flex items-center gap-2"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-700" />}
              <span>{theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}</span>
            </button>
          </div>
        </div>

        {/* Regulatory Defaults */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
            المدد الافتراضية والرسوم (SLA)
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">صلاحية الشهادة النهائية الافتراضية:</label>
              <select className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded">
                <option value="3">3 سنوات (قياسي)</option>
                <option value="1">سنة واحدة</option>
                <option value="5">5 سنوات</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">رسوم المعاملة القياسية (YER):</label>
              <input
                type="number"
                defaultValue={150000}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded font-mono font-bold"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Signature & Seal Settings Manager */}
      <SignatureSettingsManager />
    </div>
  );
};
