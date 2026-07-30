/**
 * @file UserManagement.tsx
 * Comprehensive User & Role Management Section for Technical Review Team & System Admins.
 * Allows viewing, adding, editing, and deleting users with predefined roles.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserAccount } from '../../types/typeApproval';
import {
  UserCheck,
  Shield,
  Plus,
  Lock,
  CheckCircle2,
  Mail,
  Phone,
  Edit2,
  Trash2,
  Search,
  Filter,
  X,
  User,
  ShieldAlert,
  Sparkles,
  UserPlus,
} from 'lucide-react';

export const PREDEFINED_ROLES = [
  {
    id: 'admin',
    name: 'مدير النظام',
    titleEn: 'System Administrator',
    description: 'صلاحيات شاملة لإدارة كافة إعدادات المنظومة والمستخدمين والاعتمادات.',
    defaultPermissions: ['إدارة المنظومة', 'إدارة المستخدمين', 'تعديل السياسات', 'الاعتماد النهائي', 'الصلاحيات الشاملة'],
  },
  {
    id: 'preparer',
    name: 'معد الدراسة',
    titleEn: 'Study Preparer',
    description: 'إعداد الدراسة الفنية، فحص تقارير الفحص، رفع المرفقات، وتسجيل النواقص.',
    defaultPermissions: ['إعداد الدراسات', 'رفع المرفقات', 'تسجيل النواقص', 'تنسيق الإحالات'],
  },
  {
    id: 'reviewer',
    name: 'المراجع الفني',
    titleEn: 'Technical Reviewer',
    description: 'مراجعة الدراسات الفنية، اعتماد خطط الفحص، والموافقة على توصيات الشهادات.',
    defaultPermissions: ['مراجعة الرأي الفني', 'اعتماد خطة الفحص', 'الموافقة على النواقص', 'إحالة الجهات'],
  },
  {
    id: 'readonly',
    name: 'قراءة فقط',
    titleEn: 'Read Only',
    description: 'استعراض البيانات وسجلات المراجعة والتقارير الفنية دون إمكانية التعديل.',
    defaultPermissions: ['عرض الطلبات', 'عرض التقرير الفني', 'طباعة المستندات'],
  },
];

export const UserManagement: React.FC = () => {
  const { mockUsers = [], currentUser, setCurrentUser, addUser, updateUser, deleteUser, addToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);

  // Modal Form State
  const [formData, setFormData] = useState<{
    name: string;
    fullName: string;
    title: string;
    role: string;
    department: string;
    email: string;
    phone: string;
    status: 'نشط' | 'غير_نشط';
    permissionsStr: string;
  }>({
    name: '',
    fullName: '',
    title: '',
    role: 'معد الدراسة',
    department: 'المكتب الفني للموافقة النوعية',
    email: '',
    phone: '',
    status: 'نشط',
    permissionsStr: '',
  });

  // Delete Confirmation State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter users
  const filteredUsers = mockUsers.filter((u) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      u.name?.toLowerCase().includes(term) ||
      u.fullName?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.title?.toLowerCase().includes(term) ||
      u.department?.toLowerCase().includes(term);

    const matchesRole = selectedRoleFilter === 'ALL' || u.role === selectedRoleFilter;

    return matchesSearch && matchesRole;
  });

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      fullName: '',
      title: 'معد الدراسة الفنية',
      role: 'معد الدراسة',
      department: 'المكتب الفني للموافقة النوعية',
      email: '',
      phone: '+967 77',
      status: 'نشط',
      permissionsStr: 'إعداد الدراسات, رفع المرفقات, تسجيل النواقص',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: UserAccount) => {
    setEditingUser(user);
    setFormData({
      name: user.name || user.fullName,
      fullName: user.fullName || user.name,
      title: user.title || user.role,
      role: user.role,
      department: user.department,
      email: user.email,
      phone: user.phone,
      status: user.status || 'نشط',
      permissionsStr: (user.permissions || []).join(', '),
    });
    setIsModalOpen(true);
  };

  const handleRoleChange = (roleName: string) => {
    const predefined = PREDEFINED_ROLES.find((r) => r.name === roleName);
    if (predefined) {
      setFormData((prev) => ({
        ...prev,
        role: roleName,
        title: predefined.titleEn,
        permissionsStr: predefined.defaultPermissions.join(', '),
      }));
    } else {
      setFormData((prev) => ({ ...prev, role: roleName }));
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      addToast({
        type: 'error',
        title: 'بيانات غير مكتملة',
        message: 'يرجى إدخال اسم المستخدم والبريد الإلكتروني.',
      });
      return;
    }

    const permissions = formData.permissionsStr
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (editingUser) {
      // Update existing user
      updateUser(editingUser.id, {
        name: formData.name,
        fullName: formData.fullName || formData.name,
        title: formData.title,
        role: formData.role,
        department: formData.department,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
        permissions,
      });
    } else {
      // Add new user
      addUser({
        name: formData.name,
        fullName: formData.fullName || formData.name,
        title: formData.title,
        role: formData.role,
        department: formData.department,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
        permissions,
      });
    }

    setIsModalOpen(false);
  };

  const handleDeleteUserConfirm = (id: string) => {
    if (currentUser?.id === id) {
      addToast({
        type: 'error',
        title: 'إجراء غير مسموح',
        message: 'لا يمكنك حذف حساب الجلسة النشطة الحالية التي تحضر بها.',
      });
      setDeleteConfirmId(null);
      return;
    }
    deleteUser(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>إدارة حسابات المستخدمين والصلاحيات الأدوار الوظيفية</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            إضافة وتعديل مستخدمي النظام وتعيين الأدوار القياسية (مدير النظام، معد الدراسة، المراجع الفني، قراءة فقط).
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
        >
          <UserPlus className="w-4 h-4" />
          <span>إضافة مستخدم جديد</span>
        </button>
      </div>

      {/* Active Session Switcher Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 border border-blue-200 dark:border-slate-700 rounded-xl p-5 space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>المستخدم النشط الحالي في النظام (Active Session):</span>
        </span>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              {currentUser?.name || currentUser?.fullName || 'مستخدم النظام'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              الدور القياسي: <span className="font-bold text-blue-900 dark:text-blue-200">{currentUser?.role}</span> ({currentUser?.department})
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500 font-bold">تبديل الحساب للاختبار:</span>
            {mockUsers?.map((u) => (
              <button
                key={u.id}
                onClick={() => setCurrentUser(u)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                  currentUser?.id === u.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
                }`}
              >
                {u.name?.split(' ')[1] || u.name || u.fullName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="ابحث بالاسم، البريد، المسمى أو الإدارة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-9 pl-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <select
          value={selectedRoleFilter}
          onChange={(e) => setSelectedRoleFilter(e.target.value)}
          className="p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
        >
          <option value="ALL">جميع الأدوار التنظيمية</option>
          <option value="مدير النظام">مدير النظام (System Administrator)</option>
          <option value="معد الدراسة">معد الدراسة (Study Preparer)</option>
          <option value="المراجع الفني">المراجع الفني (Technical Reviewer)</option>
          <option value="رئيس المكتب الفني">رئيس المكتب الفني</option>
          <option value="قراءة فقط">قراءة فقط (Read Only)</option>
        </select>

        <div className="flex items-center justify-end text-slate-500 text-xs">
          <span>إجمالي الحسابات المعروضة: </span>
          <span className="font-bold font-mono text-blue-600 mr-1">{filteredUsers.length} مستخدمين</span>
        </div>
      </div>

      {/* Users Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className={`bg-white dark:bg-slate-900 border rounded-xl p-5 shadow-xs space-y-3 flex flex-col justify-between transition ${
              currentUser?.id === user.id
                ? 'border-blue-500 ring-2 ring-blue-500/20'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded font-mono font-bold text-[10px]">
                  {user.id}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                    user.status === 'نشط'
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  {user.status || 'نشط'}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center justify-between">
                  <span>{user.name || user.fullName}</span>
                  {currentUser?.id === user.id && (
                    <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[9px]">الحساب الحالي</span>
                  )}
                </h3>
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">{user.role}</p>
                <p className="text-xs text-slate-500 mt-0.5">{user.title || user.department}</p>
              </div>

              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono text-[11px]">{user.email}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono text-[11px]">{user.phone}</span>
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-1">الصلاحيات التنفيذية:</span>
                <div className="flex flex-wrap gap-1">
                  {(user.permissions || []).map((p, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-[9px]"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => handleOpenEditModal(user)}
                className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded text-xs font-bold transition flex items-center justify-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>تعديل الدور</span>
              </button>

              <button
                onClick={() => setDeleteConfirmId(user.id)}
                className="py-1.5 px-3 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900 text-rose-600 rounded text-xs font-bold transition flex items-center justify-center gap-1"
                title="حذف حساب المستخدم"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                <span>{editingUser ? 'تعديل بيانات الحساب والدور الوظيفي' : 'إضافة حساب مستخدم جديد'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الاسم الكامل واللقب العلمي:
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: المهندس/ أحمد باصريح"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value, fullName: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    اختر الدور الوظيفي (Role):
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                  >
                    <option value="مدير النظام">مدير النظام (System Administrator)</option>
                    <option value="معد الدراسة">معد الدراسة (Study Preparer)</option>
                    <option value="المراجع الفني">المراجع الفني (Technical Reviewer)</option>
                    <option value="قراءة فقط">قراءة فقط (Read Only)</option>
                    <option value="رئيس المكتب الفني">رئيس المكتب الفني</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">المسمى الوظيفي:</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">البريد الإلكتروني:</label>
                  <input
                    type="email"
                    required
                    placeholder="name@mtit.gov.ye"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">رقم الهاتف التواصل:</label>
                  <input
                    type="text"
                    placeholder="+967 771 000 000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الإدارة / الإدارة العامة:</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الصلاحيات المخصصة (تفصل بفاصلة):
                </label>
                <input
                  type="text"
                  value={formData.permissionsStr}
                  onChange={(e) => setFormData({ ...formData, permissionsStr: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="font-bold text-slate-700 dark:text-slate-300">حالة الحساب:</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.status === 'نشط'}
                      onChange={() => setFormData({ ...formData, status: 'نشط' })}
                    />
                    <span>نشط</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.status === 'غير_نشط'}
                      onChange={() => setFormData({ ...formData, status: 'غير_نشط' })}
                    />
                    <span>غير نشط</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-xs"
                >
                  حفظ البيانات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl text-center">
            <ShieldAlert className="w-10 h-10 text-rose-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              هل أنت تأكد من حذف حساب هذا المستخدم؟
            </h3>
            <p className="text-xs text-slate-500">
              سيتم إلغاء تفعيل المستخدم وسحب كافة الصلاحيات الموكلة إليه بالنظام.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleDeleteUserConfirm(deleteConfirmId)}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold shadow-xs"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
