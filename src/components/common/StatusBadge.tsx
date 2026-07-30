/**
 * @file StatusBadge.tsx
 * Status indicator badge with strict color rules:
 * - Emerald/Green for Approved/Success only
 * - Amber/Orange for Warning/Pending
 * - Rose/Red for Errors/Blocking
 * - Slate/Blue for In Progress / Default
 */

import React from 'react';
import { RequestStatus, StepStatus, MatchStatus, SpectrumStatus, SecurityStatus } from '../../types/typeApproval';

interface StatusBadgeProps {
  status: RequestStatus | StepStatus | MatchStatus | SpectrumStatus | SecurityStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getColors = (val: string) => {
    switch (val) {
      // Success / Approved (Green ONLY)
      case 'معتمدة':
      case 'معتمد':
      case 'متوافق':
      case 'موافق':
      case 'متطابق':
      case 'مغلق':
      case 'صالحة':
      case 'مدفوع':
      case 'تمت_الإفادة':
      case 'مطابق_للطيف_الوطني':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';

      // Conditional / Warning (Amber/Orange)
      case 'قيد_إعداد_الدراسة_الفنية':
      case 'قيد_دراسة_المستندات':
      case 'قيد_العمل':
      case 'يحتاج_استكمالاً':
      case 'بانتظار_الاستكمال':
      case 'بانتظار_إفادة_الترددات':
      case 'بانتظار_التنسيق_الأمني':
      case 'بانتظار_المستثمر':
      case 'بانتظار_رد':
      case 'بانتظار_الإفادة':
      case 'متوافق_بشروط':
      case 'موافق_بشروط':
      case 'اختلاف_بسيط':
      case 'يحتاج_توضيحاً':
      case 'محال':
      case 'مستلم_قيد_المراجعة':
      case 'يحتاج_مراجعة':
      case 'تعديلات غير محفوظة':
      case 'يحتاج_ترخيص_خاص':
      case 'مسودة':
        return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';

      // Error / Rejected / Blocking (Red ONLY)
      case 'مرفوضة':
      case 'تعارض_جوهري':
      case 'غير_متوافق':
      case 'اعتراض':
      case 'مانع_للاعتماد':
      case 'حرج':
      case 'معادة_للتعديل':
      case 'فشل الحفظ':
      case 'محظور':
      case 'إلغاء':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';

      // Neutral / Ready / Info
      case 'جديد':
      case 'جاهزة_للمراجعة_الفنية':
      case 'جاهزة_للاعتماد':
      case 'جاهزة_للمراجعة':
      case 'لم_تبدأ':
      case 'لا_يحتاج_إحالة':
      case 'لا_يتطلب':
      case 'مفعل':
      case 'محفوظ':
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';

      default:
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
    }
  };

  const formattedText = status.replace(/_/g, ' ');

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border whitespace-nowrap ${sizeClasses} ${getColors(
        status
      )}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 shrink-0" />
      {formattedText}
    </span>
  );
};
