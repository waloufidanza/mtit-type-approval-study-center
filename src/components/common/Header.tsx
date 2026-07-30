/**
 * @file Header.tsx
 * Official Ministry Header & Navigation Toolbar
 */

import React, { useState } from 'react';
import { useApp, ActiveScreen } from '../../context/AppContext';
import { MinistryLogo } from './MinistryLogo';
import { USER_ROLES } from '../../constants/theme';
import {
  LayoutDashboard,
  FileText,
  FileSpreadsheet,
  History,
  Users,
  Settings,
  Bell,
  Search,
  Moon,
  Sun,
  ShieldCheck,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  Clock,
  CheckCheck,
  Trash2,
  X,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Info,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeScreen,
    setActiveScreen,
    currentUserRole,
    setCurrentUserRole,
    darkMode,
    setDarkMode,
    setIsLoggedIn,
    currentRequest,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotification,
    clearAllNotifications,
  } = useApp();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems: { id: ActiveScreen; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { id: 'requests', label: 'قائمة الطلبات', icon: <FileSpreadsheet className="w-3.5 h-3.5" /> },
    {
      id: 'studyCenter',
      label: 'مركز إعداد الدراسة',
      icon: <FileText className="w-3.5 h-3.5" />,
      badge: currentRequest.requestNumber.split('-').pop(),
    },
    { id: 'tasks', label: 'المهام والتنبيهات', icon: <Clock className="w-3.5 h-3.5" /> },
    { id: 'auditLog', label: 'سجل الإجراءات', icon: <History className="w-3.5 h-3.5" /> },
    { id: 'users', label: 'المستخدمون والصلاحيات', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'settings', label: 'الإعدادات', icon: <Settings className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-slate-100 border-b border-slate-800 shadow-2xs">
      {/* Top Bar - Compact Official Ministry Credentials & Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-3">
        {/* Logo & Entity Name */}
        <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setActiveScreen('dashboard')}>
          <MinistryLogo size="sm" />
        </div>

        {/* Global Search & System Status */}
        <div className="hidden lg:flex items-center gap-2 flex-1 max-w-sm mx-4">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute right-2.5 top-2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث سريع برقم الطلب، المورد، أو الموديل..."
              className="w-full pl-3 pr-8 py-1 bg-slate-800/90 border border-slate-700 rounded-md text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Right Tools & Profile */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Encrypted Network Status */}
          <div className="hidden xl:flex items-center gap-1.5 px-2 py-0.5 bg-emerald-950/80 border border-emerald-700/60 rounded-full text-[10px] text-emerald-300 font-bold">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>الشبكة الحكومية المشفرة</span>
          </div>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-[11px] font-bold text-amber-300 transition"
              title="تبديل الدور الوظيفي"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>الدور: {currentUserRole}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showRoleDropdown && (
              <div className="absolute left-0 mt-1 w-48 bg-slate-800 border border-slate-700 rounded-md shadow-lg py-1 z-50 text-xs">
                <div className="px-2.5 py-1 border-b border-slate-700 text-slate-400 font-bold text-[10px]">
                  اختر الدور الوظيفي للاختبار:
                </div>
                {USER_ROLES.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setCurrentUserRole(role);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-right px-2.5 py-1.5 hover:bg-slate-700 flex items-center justify-between ${
                      currentUserRole === role ? 'text-blue-400 font-bold bg-slate-700/50' : 'text-slate-200'
                    }`}
                  >
                    <span>{role}</span>
                    {currentUserRole === role && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition"
            title="تبديل الوضع الداكن/الفاتح"
          >
            {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Notification Center */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition relative flex items-center justify-center"
              title="مركز التنبيهات الإدارية"
            >
              <Bell className="w-4 h-4" />
              {notifications.filter((n) => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-amber-500 text-slate-950 rounded-full text-[10px] font-extrabold flex items-center justify-center animate-pulse">
                  {notifications.filter((n) => !n.read).length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute left-0 mt-1.5 w-80 md:w-96 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 text-xs overflow-hidden">
                {/* Header */}
                <div className="bg-slate-900 px-3.5 py-2.5 border-b border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span className="font-extrabold text-slate-100 text-xs">مركز التنبيهات الإدارية</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                      {notifications.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px]">
                    {notifications.some((n) => !n.read) && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-bold transition"
                        title="تحديد كافة التنبيهات كمقروءة"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>قراءة الكل</span>
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-slate-400 hover:text-rose-400 flex items-center gap-1 font-bold transition"
                        title="مسح كافة التنبيهات"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Notifications Log List (Last 10 Items) */}
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-700/60 p-1">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs space-y-1">
                      <Bell className="w-6 h-6 mx-auto text-slate-600 opacity-50" />
                      <p>لا توجد تنبيهات مسجلة حالياً</p>
                    </div>
                  ) : (
                    notifications.slice(0, 10).map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-lg transition space-y-1 relative group ${
                          !n.read
                            ? 'bg-slate-900/90 border-r-2 border-amber-500'
                            : 'hover:bg-slate-700/50 opacity-80'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-100">
                            {n.type === 'warning' && <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                            {n.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                            {n.type === 'error' && <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                            {n.type === 'info' && <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                            
                            <span className={!n.read ? 'text-amber-200' : 'text-slate-200'}>{n.title}</span>

                            {!n.read && (
                              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block shrink-0" />
                            )}
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {!n.read && (
                              <button
                                onClick={() => markNotificationAsRead(n.id)}
                                className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-blue-400 transition"
                                title="تعليم كمقروء"
                              >
                                <CheckCheck className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              onClick={() => clearNotification(n.id)}
                              className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-rose-400 transition"
                              title="حذف التنبيه"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-300 leading-relaxed pl-1">{n.message}</p>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                          <span className="font-mono">{n.timestamp}</span>
                          {n.requestNumber && (
                            <button
                              onClick={() => {
                                if (n.linkScreen) setActiveScreen(n.linkScreen);
                                setShowNotifications(false);
                              }}
                              className="font-mono font-bold text-blue-400 hover:underline flex items-center gap-0.5"
                            >
                              <span>{n.requestNumber}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="bg-slate-900 px-3 py-1.5 border-t border-slate-700 text-center text-[10px] text-slate-400">
                  سجل الإشعارات المباشر • مكتب المراجعة الفنية
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-1.5 p-1 pl-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-xs"
            >
              <div className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-[11px]">
                أ
              </div>
              <span className="font-bold text-slate-100 hidden sm:inline text-[11px]">م. أحمد باصريح</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showUserDropdown && (
              <div className="absolute left-0 mt-1 w-44 bg-slate-800 border border-slate-700 rounded-md shadow-lg py-1 z-50 text-xs">
                <div className="px-2.5 py-1.5 border-b border-slate-700">
                  <p className="font-bold text-slate-100 text-[11px]">م. أحمد باصريح</p>
                  <p className="text-[10px] text-slate-400">a.basarih@mtit.gov.ye</p>
                </div>
                <button
                  onClick={() => {
                    setActiveScreen('settings');
                    setShowUserDropdown(false);
                  }}
                  className="w-full text-right px-2.5 py-1.5 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 text-[11px]"
                >
                  <User className="w-3 h-3 text-blue-400" />
                  <span>الإعدادات والملف</span>
                </button>
                <button
                  onClick={() => {
                    setIsLoggedIn(false);
                    setActiveScreen('login');
                  }}
                  className="w-full text-right px-2.5 py-1.5 hover:bg-slate-700 text-amber-300 flex items-center gap-1.5 text-[11px] border-t border-slate-700"
                >
                  <LogOut className="w-3 h-3" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Compact Navigation Bar */}
      <nav className="bg-slate-950/90 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-1 text-xs">
          {navItems.map((item) => {
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`px-1 py-0.2 rounded text-[10px] font-mono ${
                      isActive ? 'bg-blue-800 text-blue-100' : 'bg-slate-800 text-amber-300 border border-slate-700'
                    }`}
                  >
                    #{item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
