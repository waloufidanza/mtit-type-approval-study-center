/**
 * @file DocumentViewerModal.tsx
 * In-app document previewer modal with zoom, page navigation, search, notes & rotate
 */

import React, { useState, useEffect } from 'react';
import { DocumentItem } from '../../types/typeApproval';
import { StatusBadge } from './StatusBadge';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Search,
  Maximize2,
  Minimize2,
  X,
  FileText,
  ChevronRight,
  ChevronLeft,
  MessageSquarePlus,
  CheckCircle,
  AlertCircle,
  Download,
  Focus,
  Sparkles,
} from 'lucide-react';

interface DocumentViewerModalProps {
  document: DocumentItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({ document, isOpen, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [newNote, setNewNote] = useState<string>('');
  const [notesList, setNotesList] = useState<string[]>([
    'تمت مطابقة التوقيع والختم المعتمد في هذه الصفحة',
    'القيم الترددية المذكورة بالصفحة 3 متطابقة مع تقرير الفحص',
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'f' || e.key === 'F') {
        // Toggle Focus Mode if not typing in input/textarea
        if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
        setIsFocusMode((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen || !document) return null;

  const handleAddNote = () => {
    if (newNote.trim()) {
      setNotesList([...notesList, newNote.trim()]);
      setNewNote('');
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/80 backdrop-blur-xs transition-all ${
        isFullScreen || isFocusMode ? 'p-0' : 'p-4'
      }`}
    >
      <div
        className={`bg-slate-900 text-slate-100 border border-slate-700 rounded-xl shadow-2xl flex flex-col overflow-hidden w-full transition-all ${
          isFullScreen || isFocusMode ? 'h-screen w-screen rounded-none' : 'max-w-6xl h-[90vh]'
        }`}
      >
        {/* Document Header Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-900/50 text-blue-400 rounded-lg border border-blue-700/50">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-100">{document.fileName}</h3>
                <StatusBadge status={document.matchStatus} size="sm" />
                {isFocusMode && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 animate-pulse">
                    <Sparkles className="w-3 h-3" />
                    <span>وضع التركيز العميق (Focus Mode)</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                نوع المستند: {document.docType} • الحجم: {document.fileSize} • تاريخ الرفع: {document.uploadDate}
              </p>
            </div>
          </div>

          {/* Interactive Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Focus Mode Toggle Button */}
            <button
              onClick={() => setIsFocusMode(!isFocusMode)}
              className={`px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1.5 border ${
                isFocusMode
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md ring-2 ring-amber-400/50'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
              title="تفعيل وضع التركيز (توسيع المستند وإخفاء الألواح الجانبية)"
            >
              <Focus className="w-4 h-4" />
              <span>{isFocusMode ? 'إنهاء وضع التركيز' : 'وضع التركيز العميق'}</span>
            </button>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute right-2.5 top-2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="بحث بالنص..."
                className="pl-2 pr-8 py-1 text-xs bg-slate-800 border border-slate-700 rounded text-slate-200 placeholder-slate-400 w-28 focus:w-40 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Page Navigation */}
            <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded border border-slate-700 text-xs">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="disabled:opacity-40 hover:text-blue-400 p-0.5"
                title="الصفحة السابقة"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="font-mono text-slate-300">
                صفحة {currentPage} من {document.totalPages}
              </span>
              <button
                disabled={currentPage >= document.totalPages}
                onClick={() => setCurrentPage((p) => Math.min(document.totalPages, p + 1))}
                className="disabled:opacity-40 hover:text-blue-400 p-0.5"
                title="الصفحة التالية"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Zoom controls */}
            <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded border border-slate-700 text-xs">
              <button
                onClick={() => setZoomLevel((z) => Math.max(50, z - 20))}
                className="hover:text-blue-400 p-0.5"
                title="تصغير"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono text-slate-300 w-12 text-center">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(250, z + 20))}
                className="hover:text-blue-400 p-0.5"
                title="تكبير"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Rotation */}
            <button
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-300 transition"
              title="تدوير المستند"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-300 transition"
              title={isFullScreen ? 'إنهاء ملء الشاشة' : 'ملء الشاشة'}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="p-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded transition"
              title="إغلاق المعاينة"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewer Body Grid (Thumbnails Sidebar + Document Viewer Stage + Notes Panel) */}
        <div className="flex-1 grid grid-cols-12 overflow-hidden bg-slate-950 relative">
          {/* Focus Mode Overlay Banner */}
          {isFocusMode && (
            <div className="absolute top-2 right-1/2 translate-x-1/2 z-20 bg-slate-900/90 text-amber-300 border border-amber-500/50 px-4 py-1.5 rounded-full text-xs font-bold shadow-xl flex items-center gap-2 backdrop-blur-md">
              <Focus className="w-4 h-4 text-amber-400" />
              <span>وضع التركيز الخالي من المشتتات مفعل</span>
              <button
                onClick={() => setIsFocusMode(false)}
                className="mr-2 px-2 py-0.5 bg-amber-500 text-slate-950 hover:bg-amber-400 rounded text-[11px] font-extrabold transition"
              >
                إغلاق التركيز (Esc)
              </button>
            </div>
          )}

          {/* Thumbnails Sidebar (Hidden in Focus Mode) */}
          {!isFocusMode && (
            <div className="col-span-2 border-l border-slate-800 p-3 overflow-y-auto hidden sm:block bg-slate-900/50">
              <h4 className="text-xs font-bold text-slate-400 mb-3 px-1">صفحات الوثيقة ({document.totalPages})</h4>
              <div className="space-y-2.5">
                {Array.from({ length: Math.min(12, document.totalPages) }).map((_, idx) => {
                  const pageNum = idx + 1;
                  const isSelected = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-full text-right p-2 rounded-lg border text-xs transition flex flex-col items-center ${
                        isSelected
                          ? 'bg-blue-900/40 border-blue-500 text-blue-300 shadow-sm'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="w-full aspect-3/4 bg-slate-800 rounded mb-1.5 border border-slate-700 flex items-center justify-center text-[10px] text-slate-500 font-mono">
                        ص {pageNum}
                      </div>
                      <span>صفحة {pageNum}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Document Canvas Display Stage (Takes full width in Focus Mode) */}
          <div
            className={`p-6 overflow-auto flex items-center justify-center bg-slate-950/90 relative transition-all ${
              isFocusMode ? 'col-span-12' : 'col-span-12 sm:col-span-7'
            }`}
          >
            <div
              style={{
                transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
                transition: 'transform 0.2s ease-out',
              }}
              className={`bg-white text-slate-900 rounded shadow-2xl p-8 w-full min-h-[680px] flex flex-col justify-between border border-slate-300 select-none ${
                isFocusMode ? 'max-w-3xl' : 'max-w-xl'
              }`}
            >
              {/* Document Mock Simulated Header */}
              <div>
                <div className="flex justify-between items-start border-b border-slate-200 pb-4 mb-6">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">{document.docType}</h2>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">Ref: {document.fileName}</p>
                  </div>
                  <div className="text-left text-xs text-slate-600">
                    <p className="font-bold">المملكة المتحدة / اليمن</p>
                    <p className="text-[10px] text-slate-400">التاريخ: {document.uploadDate}</p>
                  </div>
                </div>

                {/* Document Body Text Representation */}
                <div className="space-y-4 text-xs text-slate-700 leading-relaxed font-sans">
                  <p className="p-3 bg-slate-50 border-r-2 border-blue-600 rounded">
                    <strong>البيانات المعاينة - الصفحة ({currentPage}):</strong> تشهد الجهة المصدرة بأن الجهاز
                    المشار إليه بالموديل <span className="font-mono font-bold text-blue-900">XR-5000</span> قد خضع
                    لكافة الفحوصات المختبرية المعتمدة والتأكد من مطابقتة للمعايير التنظيمية.
                  </p>

                  <table className="w-full text-[11px] border-collapse border border-slate-200">
                    <thead>
                      <tr className="bg-slate-100 text-slate-800 font-bold">
                        <th className="border p-1.5 text-right">البند الفني</th>
                        <th className="border p-1.5 text-right">القيمة المسجلة</th>
                        <th className="border p-1.5 text-right">الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border p-1.5 font-bold">Frequency Range</td>
                        <td className="border p-1.5 font-mono">5150 - 5850 MHz</td>
                        <td className="border p-1.5 text-emerald-700 font-bold">Pass</td>
                      </tr>
                      <tr>
                        <td className="border p-1.5 font-bold">Max EIRP Power</td>
                        <td className="border p-1.5 font-mono">30 - 36 dBm</td>
                        <td className="border p-1.5 text-amber-700 font-bold">Conditional Pass</td>
                      </tr>
                      <tr>
                        <td className="border p-1.5 font-bold">IP Protection</td>
                        <td className="border p-1.5 font-mono">IP67 Enclosure</td>
                        <td className="border p-1.5 text-emerald-700 font-bold">Pass</td>
                      </tr>
                    </tbody>
                  </table>

                  {searchTerm && (
                    <div className="p-2 bg-amber-100 text-amber-900 border border-amber-300 rounded text-xs font-bold">
                      نتائج البحث عن ({searchTerm}): تم العثور على 3 تطابقات في الصفحة الحالية.
                    </div>
                  )}

                  <p className="text-[11px] text-slate-500 italic mt-6">
                    ملاحظة المراجع: الوثيقة تحتوي على التواقيع الرقمية والأختام الرسمية المعتمدة لدى وزارة الاتصالات.
                  </p>
                </div>
              </div>

              {/* Document Mock Footer */}
              <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span>Page {currentPage} of {document.totalPages}</span>
                <span>CONFIDENTIAL OFFICIAL REVIEW</span>
              </div>
            </div>
          </div>

          {/* Notes & Verification Drawer Panel (Hidden in Focus Mode) */}
          {!isFocusMode && (
            <div className="col-span-12 sm:col-span-3 border-r border-slate-800 p-4 overflow-y-auto bg-slate-900/80 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-200 mb-3 flex items-center gap-1.5">
                  <MessageSquarePlus className="w-4 h-4 text-blue-400" />
                  <span>ملاحظات المعاينة الفنية</span>
                </h4>

                {/* Notes List */}
                <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                  {notesList.map((note, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-800 border border-slate-700 rounded text-xs text-slate-300">
                      <p className="leading-relaxed">{note}</p>
                      <span className="text-[10px] text-slate-500 mt-1 block text-left">اليوم 11:25</span>
                    </div>
                  ))}
                </div>

                {/* Add Note Input */}
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="أضف ملاحظة أو استفسار فني على هذه الصفحة..."
                    className="w-full p-2 text-xs bg-slate-950 border border-slate-700 rounded text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddNote}
                    className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5" />
                    <span>إضافة الملاحظة</span>
                  </button>
                </div>
              </div>

              {/* Quick Actions Footer */}
              <div className="pt-4 border-t border-slate-800 space-y-2 mt-4">
                <div className="p-2.5 bg-emerald-950/50 border border-emerald-800 rounded text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>الوثيقة مقروءة ومطابقة للشروط</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
