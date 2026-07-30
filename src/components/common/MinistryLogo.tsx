/**
 * @file MinistryLogo.tsx
 * Placeholder Emblem and Seal for Ministry of Telecommunications & Information Technology (Republic of Yemen)
 */

import React from 'react';

interface MinistryLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const MinistryLogo: React.FC<MinistryLogoProps> = ({ size = 'md', showSubtitle = true }) => {
  const dimensions = {
    sm: { box: 'w-8 h-8', textTitle: 'text-xs', textSub: 'text-[9px]' },
    md: { box: 'w-11 h-11', textTitle: 'text-sm font-bold', textSub: 'text-xs' },
    lg: { box: 'w-16 h-16', textTitle: 'text-base font-bold', textSub: 'text-sm' },
    xl: { box: 'w-24 h-24', textTitle: 'text-xl font-extrabold', textSub: 'text-base' },
  }[size];

  return (
    <div className="flex items-center gap-3 select-none">
      <div
        className={`${dimensions.box} rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center p-1.5 shadow-md border border-slate-700 shrink-0 relative overflow-hidden`}
        title="شعار وزارة الاتصالات وتقنية المعلومات - الجمهورية اليمنية"
      >
        {/* Decorative Golden Eagle Emblem Placeholder */}
        <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-amber-400">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 2" />
          <path d="M50 15 L62 38 L90 38 L68 54 L76 82 L50 66 L24 82 L32 54 L10 38 L38 38 Z" opacity="0.85" />
          <path d="M35 50 Q50 30 65 50 Q50 70 35 50 Z" fill="#0f172a" />
          <circle cx="50" cy="50" r="8" fill="currentColor" />
        </svg>
      </div>

      <div className="flex flex-col text-right">
        <span className={`leading-tight text-slate-900 dark:text-slate-100 ${dimensions.textTitle}`}>
          الجمهورية اليمنية
        </span>
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-snug">
          وزارة الاتصالات وتقنية المعلومات
        </span>
        {showSubtitle && (
          <span className={`text-slate-500 dark:text-slate-400 font-medium ${dimensions.textSub}`}>
            الإدارة العامة لتنظيم الاتصالات • الموافقة النوعية
          </span>
        )}
      </div>
    </div>
  );
};
