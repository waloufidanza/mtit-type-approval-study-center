/**
 * @file DigitalSealPanel.tsx
 * Official Ministry Digital Seal Configuration Panel for Certificate Issuance.
 * Allows users to choose official seal styles and position (left/right) on the certificate template preview.
 */

import React from 'react';
import { Shield, Stamp, Layout, Eye, Check, Sliders, Layers } from 'lucide-react';

export type SealStyleOption = 'golden' | 'technical' | 'digital' | 'temporary';
export type SealPositionOption = 'left' | 'right';

export interface DigitalSealConfig {
  style: SealStyleOption;
  position: SealPositionOption;
  visible: boolean;
  opacity: number;
  watermark: boolean;
}

interface DigitalSealPanelProps {
  sealConfig: DigitalSealConfig;
  onChange: (updatedConfig: DigitalSealConfig) => void;
}

export const DigitalSealPanel: React.FC<DigitalSealPanelProps> = ({
  sealConfig,
  onChange,
}) => {
  const handleStyleSelect = (style: SealStyleOption) => {
    onChange({ ...sealConfig, style });
  };

  const handlePositionSelect = (position: SealPositionOption) => {
    onChange({ ...sealConfig, position });
  };

  const handleToggleVisible = (visible: boolean) => {
    onChange({ ...sealConfig, visible });
  };

  const handleToggleWatermark = (watermark: boolean) => {
    onChange({ ...sealConfig, watermark });
  };

  const handleOpacityChange = (opacity: number) => {
    onChange({ ...sealConfig, opacity });
  };

  const sealStyles: {
    id: SealStyleOption;
    title: string;
    description: string;
    badgeBg: string;
    borderColor: string;
  }[] = [
    {
      id: 'golden',
      title: 'الختم الذهبي السامي (Official Golden Seal)',
      description: 'ختم شعار الجمهورية الذهبي البارز الخاص بالموافقات الرسمية النهائية',
      badgeBg: 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white',
      borderColor: 'border-amber-400 dark:border-amber-600',
    },
    {
      id: 'technical',
      title: 'الختم الفني الموحد (Technical Standard Seal)',
      description: 'ختم الإدارة العامة لتنظيم الاتصالات والمكتب الفني المعتمد',
      badgeBg: 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white',
      borderColor: 'border-blue-400 dark:border-blue-600',
    },
    {
      id: 'digital',
      title: 'ختم الاعتماد الرقمي QrSeal (Digital QR Seal)',
      description: 'ختم أمني رقمي مزود بفرام الشفافية مع رمز التتبع الباركوودي',
      badgeBg: 'bg-gradient-to-r from-teal-600 to-emerald-700 text-white',
      borderColor: 'border-teal-400 dark:border-teal-600',
    },
    {
      id: 'temporary',
      title: 'ختم الترخيص المؤقت (Temporary License Seal)',
      description: 'ختم رسمي مخصص للتراخيص المؤقتة محددة فترة الصلاحية',
      badgeBg: 'bg-gradient-to-r from-purple-600 to-indigo-800 text-white',
      borderColor: 'border-purple-400 dark:border-purple-600',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4 font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Stamp className="w-5 h-5 text-amber-600" />
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              لوحة الأختام الرسمية المعتمدة (Digital Seal Panel)
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              تحديد نمط الختم الرسمي للوزارة وموقع ظهوره (يمين/يسار) على الوثيقة فوراً
            </p>
          </div>
        </div>

        {/* Global Seal Toggle */}
        <label className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <input
            type="checkbox"
            checked={sealConfig.visible}
            onChange={(e) => handleToggleVisible(e.target.checked)}
            className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
          />
          <Eye className="w-4 h-4 text-amber-600" />
          <span>تفعيل وتثبيت الختم الرسمي</span>
        </label>
      </div>

      {/* Seal Styles Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
          اختر نمط الختم الرسمي للوزارة:
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {sealStyles.map((item) => {
            const isSelected = sealConfig.style === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleStyleSelect(item.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition space-y-2 relative ${
                  isSelected
                    ? `${item.borderColor} bg-amber-50/50 dark:bg-amber-950/20 ring-2 ring-amber-500/50`
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.badgeBg}`}>
                    {item.title.split(' ')[1] || 'ختم رسمي'}
                  </span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <p className="font-extrabold text-xs text-slate-900 dark:text-slate-100 leading-snug">
                  {item.title}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Placement & Alignment Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
        {/* Seal Alignment Switcher */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block flex items-center gap-1">
            <Layout className="w-3.5 h-3.5 text-blue-500" />
            <span>مكان وموقع ظهور الختم على نموذج الشهادة:</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handlePositionSelect('right')}
              className={`py-2 px-3 rounded-lg border font-bold text-xs transition flex items-center justify-center gap-1.5 ${
                sealConfig.position === 'right'
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>يمين النموذج (Right)</span>
            </button>

            <button
              onClick={() => handlePositionSelect('left')}
              className={`py-2 px-3 rounded-lg border font-bold text-xs transition flex items-center justify-center gap-1.5 ${
                sealConfig.position === 'left'
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>يسار النموذج (Left)</span>
            </button>
          </div>
        </div>

        {/* Seal Watermark Option */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-purple-500" />
            <span>خلفية العلامة المائية (Watermark Overlay):</span>
          </label>
          <label className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer h-9">
            <input
              type="checkbox"
              checked={sealConfig.watermark}
              onChange={(e) => handleToggleWatermark(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
            />
            <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
              طباعة الشعار الرسمي كعلامة مائية شفافة خلف الشهادة
            </span>
          </label>
        </div>

        {/* Opacity Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-teal-500" />
              <span>درجة بروز ووضوح الختم:</span>
            </label>
            <span className="font-mono text-xs font-bold text-amber-600">
              {Math.round(sealConfig.opacity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.3"
            max="1"
            step="0.05"
            value={sealConfig.opacity}
            onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
            className="w-full accent-amber-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
