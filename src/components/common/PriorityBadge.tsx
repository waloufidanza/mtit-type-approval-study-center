/**
 * @file PriorityBadge.tsx
 * Priority badge component (عادية, عالية, حرجة, طوارئ)
 */

import React from 'react';
import { PriorityLevel } from '../../types/typeApproval';

interface PriorityBadgeProps {
  priority: PriorityLevel;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const getStyle = (p: PriorityLevel) => {
    switch (p) {
      case 'طوارئ':
        return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800 animate-pulse';
      case 'حرجة':
        return 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800';
      case 'عالية':
        return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border ${getStyle(priority)}`}>
      <span>الأولوية:</span>
      <span>{priority}</span>
    </span>
  );
};
