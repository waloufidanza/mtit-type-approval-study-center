/**
 * @file CertificateTemplateSelector.tsx
 * Certificate Template Selector Component for Certificate Issuance Unit.
 * Allows users to choose between official certificate templates with live preview switching.
 */

import React from 'react';
import { Layout, Radio, Smartphone, RadioTower, Clock, Check, Sparkles, FileText } from 'lucide-react';

export type CertificateTemplateOption = 'tech_devices' | 'comm_systems' | 'temp_clearance';

export interface CertificateTemplateInfo {
  id: CertificateTemplateOption;
  title: string;
  subTitle: string;
  badge: string;
  badgeColor: string;
  borderColor: string;
  description: string;
  features: string[];
  icon: React.ComponentType<{ className?: string }>;
}

export const CERTIFICATE_TEMPLATES: CertificateTemplateInfo[] = [
  {
    id: 'tech_devices',
    title: 'قالب الأجهزة والطرفيات التقنية',
    subTitle: 'Technical End-User Devices Template',
    badge: 'النموذج القياسي A1',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-800',
    borderColor: 'border-amber-400 dark:border-amber-600',
    description: 'مخصص لأجهزة الاتصال اللاسلكي الفردية، المودمات، الهواتف، والحاسبات الطرفية ذات النطاقات المحددة.',
    features: ['إبراز قدرات الإشعاع EIRP', 'جدول الترددات التشغيلية', 'كود التتبع السريع QR'],
    icon: Smartphone,
  },
  {
    id: 'comm_systems',
    title: 'قالب الأنظمة والشبكات الاتصالية',
    subTitle: 'Telecom Systems & Infrastructure Template',
    badge: 'نموذج البنية التحتية B2',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/80 dark:text-blue-200 dark:border-blue-800',
    borderColor: 'border-blue-400 dark:border-blue-600',
    description: 'مخصص لمحطات البث الرئيسية، المايكروويف، شبكات الألياف الضوئية، وأجهزة المقسمات المركزية.',
    features: ['عرض بروتوكولات التشفير والربط', 'خريطة النطاقات المزدوجة', 'تأكيد التوافق الترددي القومي'],
    icon: RadioTower,
  },
  {
    id: 'temp_clearance',
    title: 'قالب التراخيص الفنية والإفراج المؤقت',
    subTitle: 'Temporary Clearance & Provisional License',
    badge: 'نموذج الإفراج المشروط C3',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-800',
    borderColor: 'border-emerald-400 dark:border-emerald-600',
    description: 'مخصص للشحنات العابرة للمنافذ الجمركية، الأجهزة تحت الاختبار الميداني، والتراخيص مؤقتة السريان.',
    features: ['تأكيد تاريخ انتهاء المهل الجمركية', 'شروط الاستكمال المعلقة', 'ختم الإفراج المشروط البارز'],
    icon: Clock,
  },
];

interface CertificateTemplateSelectorProps {
  selectedTemplate: CertificateTemplateOption;
  onChangeTemplate: (template: CertificateTemplateOption) => void;
}

export const CertificateTemplateSelector: React.FC<CertificateTemplateSelectorProps> = ({
  selectedTemplate,
  onChangeTemplate,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4 font-sans">
      {/* Selector Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 rounded-xl">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>اختيار قالب الشهادة الرسمي (Certificate Template Selector)</span>
              <span className="px-2 py-0.5 bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 rounded-full text-[10px] font-bold border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                تحديث فوري للمعاينة
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              اختر الهيكل والتصميم الرسمي المناسب لنوع المعدة أو الترخيص المطلوب إصداره
            </p>
          </div>
        </div>
      </div>

      {/* Templates Grid Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {CERTIFICATE_TEMPLATES.map((tmpl) => {
          const isSelected = selectedTemplate === tmpl.id;
          const IconComp = tmpl.icon;

          return (
            <div
              key={tmpl.id}
              onClick={() => onChangeTemplate(tmpl.id)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 space-y-3 relative flex flex-col justify-between ${
                isSelected
                  ? `${tmpl.borderColor} bg-amber-50/40 dark:bg-amber-950/20 ring-2 ring-amber-500/40 shadow-sm`
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/60'
              }`}
            >
              <div className="space-y-2">
                {/* Top Badge & Radio indicator */}
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${tmpl.badgeColor}`}>
                    {tmpl.badge}
                  </span>

                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                      isSelected
                        ? 'border-amber-600 bg-amber-600 text-white'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                {/* Title & Icon */}
                <div className="flex items-start gap-2.5 pt-1">
                  <div
                    className={`p-2 rounded-xl shrink-0 ${
                      isSelected
                        ? 'bg-amber-500 text-white shadow-2xs'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100">
                      {tmpl.title}
                    </h4>
                    <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                      {tmpl.subTitle}
                    </p>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                  {tmpl.description}
                </p>
              </div>

              {/* Template Feature Highlights */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 space-y-1">
                {tmpl.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[10px] text-slate-600 dark:text-slate-400 font-semibold">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
