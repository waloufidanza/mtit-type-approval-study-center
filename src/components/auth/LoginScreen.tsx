/**
 * @file LoginScreen.tsx
 * Official Ministry Login Screen with Emblem, System Title, Version & Role Selector
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MinistryLogo } from '../common/MinistryLogo';
import { Lock, User, Key, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { setIsAuthenticated, setCurrentUser, mockUsers, setActiveScreen } = useApp();
  const defaultUserId = mockUsers?.[0]?.id || '';
  const [selectedPresetUserId, setSelectedPresetUserId] = useState(defaultUserId);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chosenUser = mockUsers?.find((u) => u.id === selectedPresetUserId) || mockUsers?.[0];
    if (chosenUser) {
      setCurrentUser(chosenUser);
    }
    setIsAuthenticated(true);
    setActiveScreen('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 font-sans dir-rtl">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

      <div className="w-full max-w-md bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-2xl p-8 space-y-6 relative z-10 backdrop-blur-md">
        {/* Emblem & Ministry Info */}
        <div className="text-center space-y-2">
          <MinistryLogo className="mx-auto" size="lg" />
          <h2 className="text-sm font-bold text-slate-300 pt-2">الجمهورية اليمنية</h2>
          <p className="text-xs font-semibold text-blue-400">وزارة الاتصالات وتقنية المعلومات</p>

          <div className="pt-2">
            <h1 className="text-lg font-extrabold text-white leading-tight">
              مركز إعداد الدراسات والمراجعة الفنية للموافقة النوعية
            </h1>
            <span className="inline-block mt-2 px-2.5 py-0.5 bg-blue-950 text-blue-300 border border-blue-800 rounded font-mono font-bold text-[10px]">
              النظام الداخلي v2.4 • محمي بأعلى معايير الأمن السيبراني
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          {/* Preset User Quick Select for Evaluation */}
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700 space-y-2">
            <label className="block font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>اختر مستخدماً تجريبياً للدخول المباشر:</span>
            </label>
            <select
              value={selectedPresetUserId}
              onChange={(e) => setSelectedPresetUserId(e.target.value)}
              className="w-full p-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white font-bold"
            >
              {mockUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} — ({u.title})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">اسم المستخدم / الرقم الوظيفي:</label>
            <div className="relative">
              <User className="w-4 h-4 absolute right-3 top-2.5 text-slate-500" />
              <input
                type="text"
                defaultValue="admin_technical"
                className="w-full pr-9 pl-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">كلمة المرور الرسمية:</label>
            <div className="relative">
              <Key className="w-4 h-4 absolute right-3 top-2.5 text-slate-500" />
              <input
                type="password"
                defaultValue="••••••••••••"
                className="w-full pr-9 pl-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold transition shadow-lg flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>تسجيل الدخول للنظام الداخلي</span>
          </button>
        </form>

        {/* Official Notice */}
        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-[10px] text-slate-400 text-center leading-relaxed">
          <p className="font-bold text-slate-300 mb-0.5">إشعار الاستخدام الرسمي:</p>
          هذه المنصة مخصصة فقط للمختصين المخولين بالوزارة والمكتب الفني. يمنع أي وصول غير مصرح به وسيتم تتبعه قانونياً.
        </div>
      </div>
    </div>
  );
};
