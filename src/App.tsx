/**
 * @file App.tsx
 * Primary Application Shell rendering Active Screens and Header Layout
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { ToastContainer } from './components/common/ToastContainer';
import { Dashboard } from './components/dashboard/Dashboard';
import { RequestList } from './components/requests/RequestList';
import { StudyCenter } from './components/study/StudyCenter';
import { UserManagement } from './components/users/UserManagement';
import { Settings } from './components/settings/Settings';
import { AuditLogScreen } from './components/audit/AuditLogScreen';
import { TaskManagerScreen } from './components/tasks/TaskManagerScreen';
import { LoginScreen } from './components/auth/LoginScreen';

const AppContent: React.FC = () => {
  const { isAuthenticated, activeScreen } = useApp();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans dir-rtl antialiased transition-colors duration-200">
      {/* Top Header Bar */}
      <Header />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeScreen === 'dashboard' && <Dashboard />}
        {activeScreen === 'requests' && <RequestList />}
        {(activeScreen === 'studyCenter' || (activeScreen as string) === 'study') && <StudyCenter />}
        {activeScreen === 'tasks' && <TaskManagerScreen />}
        {activeScreen === 'auditLog' && <AuditLogScreen />}
        {activeScreen === 'users' && <UserManagement />}
        {activeScreen === 'settings' && <Settings />}
      </main>

      {/* Technical Status Footer */}
      <footer className="mt-12 h-9 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-6 text-[11px] text-slate-400 font-mono select-none">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-slate-300">النظام متصل بالشبكة الحكومية المشفرة</span>
          </div>
          <div className="hidden sm:block">آخر حفظ تلقائي: منذ دقيقتين</div>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:inline">مركز إعداد الدراسات والمراجعة الفنية</span>
          <span className="px-1.5 py-0.5 bg-blue-950 text-blue-300 rounded text-[10px] border border-blue-800 font-mono">MTIT-SYS-ID: 8820-X10</span>
        </div>
      </footer>

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
