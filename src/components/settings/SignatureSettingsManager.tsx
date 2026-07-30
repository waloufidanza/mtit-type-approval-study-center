/**
 * @file SignatureSettingsManager.tsx
 * Admin Manager for Official Signature Templates, Seals, Stamp Uploads & Permissions.
 * Configures signatures for Technical Reports & Type Approval Certificates.
 */

import React, { useState } from 'react';
import {
  FileCheck,
  Upload,
  Plus,
  Check,
  Shield,
  Edit2,
  Trash2,
  Lock,
  Stamp,
  Award,
  Image as ImageIcon,
  CheckCircle2,
  Eye,
  Building2,
  Sparkles,
} from 'lucide-react';

export interface SignatureTemplateItem {
  id: string;
  signatoryTitle: string; // e.g. "مدير عام المواصفات والمقاييس"
  signatoryName: string; // e.g. "م. عبد الله أحمد السياني"
  department: string; // e.g. "المكتب الفني والاعتماد"
  permissionRole: 'مدير_المواصفة' | 'مهندس_فني' | 'المدير_العام' | 'وكيل_الوزارة';
  allowedDocTypes: ('تقرير_فني' | 'شهادة_موافقة' | 'تنسيق_أمني')[];
  signatureImageUrl: string;
  sealImageUrl: string;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
}

const DEFAULT_TEMPLATES: SignatureTemplateItem[] = [
  {
    id: 'sig-1',
    signatoryTitle: 'مدير عام اعتماد المواصفة النوعية',
    signatoryName: 'د. خالد عبد الرحمن المؤيد',
    department: 'الإدارة العامة للتراخيص والمواصفات',
    permissionRole: 'مدير_المواصفة',
    allowedDocTypes: ['تقرير_فني', 'شهادة_موافقة'],
    signatureImageUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&auto=format&fit=crop&q=80',
    sealImageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200&auto=format&fit=crop&q=80',
    isActive: true,
    isDefault: true,
    createdAt: '2026-01-15',
  },
  {
    id: 'sig-2',
    signatoryTitle: 'رئيس قسم المراجعة الفنية والترددات',
    signatoryName: 'م. طارق علي العنسي',
    department: 'إدارة إدارة الترددات والراديو',
    permissionRole: 'مهندس_فني',
    allowedDocTypes: ['تقرير_فني'],
    signatureImageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    sealImageUrl: '',
    isActive: true,
    isDefault: false,
    createdAt: '2026-02-10',
  },
  {
    id: 'sig-3',
    signatoryTitle: 'وكيل وزارة الاتصالات لقطاع الترددات',
    signatoryName: 'أ.د. محمد حسين المتوكل',
    department: 'قيادة الوزارة',
    permissionRole: 'وكيل_الوزارة',
    allowedDocTypes: ['شهادة_موافقة', 'تنسيق_أمني'],
    signatureImageUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
    sealImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    isActive: true,
    isDefault: false,
    createdAt: '2026-03-01',
  },
];

export const SignatureSettingsManager: React.FC = () => {
  const [templates, setTemplates] = useState<SignatureTemplateItem[]>(DEFAULT_TEMPLATES);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<SignatureTemplateItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState<SignatureTemplateItem['permissionRole']>('مدير_المواصفة');
  const [allowedTypes, setAllowedTypes] = useState<('تقرير_فني' | 'شهادة_موافقة' | 'تنسيق_أمني')[]>([
    'تقرير_فني',
    'شهادة_موافقة',
  ]);

  const handleOpenAdd = () => {
    setSelectedTemplate(null);
    setTitle('');
    setName('');
    setDepartment('الإدارة العامة للتراخيص');
    setRole('مدير_المواصفة');
    setAllowedTypes(['تقرير_فني', 'شهادة_موافقة']);
    setIsEditing(true);
  };

  const handleOpenEdit = (tpl: SignatureTemplateItem) => {
    setSelectedTemplate(tpl);
    setTitle(tpl.signatoryTitle);
    setName(tpl.signatoryName);
    setDepartment(tpl.department);
    setRole(tpl.permissionRole);
    setAllowedTypes(tpl.allowedDocTypes);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!title || !name) return;

    if (selectedTemplate) {
      // Update
      setTemplates((prev) =>
        prev.map((item) =>
          item.id === selectedTemplate.id
            ? {
                ...item,
                signatoryTitle: title,
                signatoryName: name,
                department,
                permissionRole: role,
                allowedDocTypes: allowedTypes,
              }
            : item
        )
      );
    } else {
      // Add new
      const newItem: SignatureTemplateItem = {
        id: `sig-${Date.now()}`,
        signatoryTitle: title,
        signatoryName: name,
        department,
        permissionRole: role,
        allowedDocTypes: allowedTypes,
        signatureImageUrl:
          'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&auto=format&fit=crop&q=80',
        sealImageUrl:
          'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200&auto=format&fit=crop&q=80',
        isActive: true,
        isDefault: false,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setTemplates((prev) => [newItem, ...prev]);
    }

    setIsEditing(false);
  };

  const handleToggleActive = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t))
    );
  };

  const handleDelete = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleDocType = (type: 'تقرير_فني' | 'شهادة_موافقة' | 'تنسيق_أمني') => {
    if (allowedTypes.includes(type)) {
      setAllowedTypes(allowedTypes.filter((t) => t !== type));
    } else {
      setAllowedTypes([...allowedTypes, type]);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 rounded-2xl">
            <Stamp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>إدارة نماذج التواقيع والأختام الرسمية</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              تحديد التواقيع الرسمية، الأختام المعتمدة، والصلاحيات المقترنة للتقارير والشهادات
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة نموذج توقيع جديد</span>
        </button>
      </div>

      {/* Templates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className={`p-4 rounded-2xl border transition space-y-3 relative flex flex-col justify-between ${
              tpl.isActive
                ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                : 'bg-slate-100/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300 rounded text-[10px] font-mono font-bold">
                  {tpl.department}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleActive(tpl.id)}
                    className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      tpl.isActive
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {tpl.isActive ? 'مفعل' : 'معطل'}
                  </button>
                </div>
              </div>

              <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                {tpl.signatoryTitle}
              </h4>
              <p className="text-[11px] font-bold text-purple-700 dark:text-purple-400 mt-0.5">
                {tpl.signatoryName}
              </p>

              {/* Document Permissions Chips */}
              <div className="flex flex-wrap gap-1 mt-2">
                {tpl.allowedDocTypes.map((dt) => (
                  <span
                    key={dt}
                    className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded text-[9px] font-mono"
                  >
                    {dt === 'تقرير_فني'
                      ? 'التقرير الفني'
                      : dt === 'شهادة_موافقة'
                      ? 'الشهادة الرسمية'
                      : 'التنسيق الأمني'}
                  </span>
                ))}
              </div>

              {/* Signature & Seal Visual Preview */}
              <div className="mt-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-around gap-2 text-center">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 block mb-1">صورة التوقيع</span>
                  <div className="w-16 h-10 border border-slate-100 dark:border-slate-800 rounded bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                    {tpl.signatureImageUrl ? (
                      <img src={tpl.signatureImageUrl} alt="Tawqee" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[8px] text-slate-400">بدون توقيع</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[9px] font-bold text-slate-400 block mb-1">الختم الرسمي</span>
                  <div className="w-10 h-10 border border-slate-100 dark:border-slate-800 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                    {tpl.sealImageUrl ? (
                      <img src={tpl.sealImageUrl} alt="Khatm" className="w-full h-full object-cover" />
                    ) : (
                      <Stamp className="w-4 h-4 text-slate-300" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs">
              <button
                onClick={() => handleOpenEdit(tpl)}
                className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition"
                title="تعديل النموذج"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(tpl.id)}
                className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition"
                title="حذف النموذج"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs font-sans">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                {selectedTemplate ? 'تعديل نموذج التوقيع' : 'إضافة نموذج توقيع جديد'}
              </h4>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
              >
                إلغاء
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الصفة والمسمى الوظيفي:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: مدير عام المواصفات والمقاييس"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  اسم المفوض بالتوقيع:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: م. عبد الله أحمد السياني"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الإدارة / القسم:
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  المستندات المصرح بتوقيعها:
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => toggleDocType('تقرير_فني')}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition ${
                      allowedTypes.includes('تقرير_فني')
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    التقرير الفني
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleDocType('شهادة_موافقة')}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition ${
                      allowedTypes.includes('شهادة_موافقة')
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    شهادة الموافقة
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleDocType('تنسيق_أمني')}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition ${
                      allowedTypes.includes('تنسيق_أمني')
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    التنسيق الأمني
                  </button>
                </div>
              </div>

              {/* Upload Simulation UI */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-center space-y-1">
                  <Upload className="w-5 h-5 text-purple-600 mx-auto" />
                  <span className="text-[10px] font-bold block text-slate-700 dark:text-slate-300">
                    رفع صورة التوقيع
                  </span>
                  <span className="text-[8px] text-slate-400 block">PNG شفاف</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-center space-y-1">
                  <Stamp className="w-5 h-5 text-emerald-600 mx-auto" />
                  <span className="text-[10px] font-bold block text-slate-700 dark:text-slate-300">
                    رفع صورة الختم الرسمي
                  </span>
                  <span className="text-[8px] text-slate-400 block">دائري معتمد</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-extrabold shadow-xs"
              >
                حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
