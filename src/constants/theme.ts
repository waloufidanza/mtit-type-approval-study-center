/**
 * Theme constants and design tokens for Ministry of Telecommunications & IT UI
 */

export const GOVERNMENT_COLORS = {
  navy: {
    DEFAULT: '#0f172a',
    light: '#1e293b',
    dark: '#080e1a',
  },
  blue: {
    DEFAULT: '#2563eb',
    hover: '#1d4ed8',
    light: '#eff6ff',
  },
  gold: '#d97706', // Government Gold accents
  emerald: '#16a34a', // Success
  amber: '#ea580c', // Warning
  rose: '#dc2626', // Error
  slateBg: '#f8fafc',
};

export const STUDY_STEPS = [
  { id: 1, title: 'سياق الطلب والمرفقات', description: 'بيانات الأطراف والوثائق الثبوتية والمعاينة' },
  { id: 2, title: 'هوية الجهاز واتساق البيانات', description: 'مقارنة البيانات عبر مصادر الوثائق المختلفة' },
  { id: 3, title: 'الفحص الفني والترددي', description: 'المواصفات، النطاقات الترددية، والمسائل الأمنية' },
  { id: 4, title: 'النواقص والإحالات والإفادات', description: 'إدارة النواقص، طلبات الاستكمال والإحالات الفنية' },
  { id: 5, title: 'الدراسة الأولية', description: 'محرر تقرير الدراسة الفنية الموحد مع التخزين' },
  { id: 6, title: 'الرأي الفني', description: 'الأساس التنظيمي والفني والتوصية النهائية' },
  { id: 7, title: 'التقرير النهائي', description: 'تجميع التقرير ومعاينة A4 وتصدير PDF/DOCX' },
  { id: 8, title: 'الاعتمادات والشهادة', description: 'سلسلة التواضيع، الضمان المالي وإصدار الشهادة' },
];

export const USER_ROLES = [
  'مدير النظام',
  'معد الدراسة',
  'المراجع الفني',
  'مراجع الترددات',
  'منسق أمني',
  'رئيس المكتب الفني',
  'مدير الموافقة النوعية',
  'المدير العام',
  'مسؤول الشهادات',
  'قراءة فقط',
] as const;
