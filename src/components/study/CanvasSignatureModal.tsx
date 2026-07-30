/**
 * @file CanvasSignatureModal.tsx
 * Interactive Canvas Signature & Image Upload Modal.
 * Allows reviewers to draw a digital signature using mouse or touch, or upload a signature image,
 * preview the signature before confirming, and apply it to a specific signer role.
 */

import React, { useRef, useState, useEffect } from 'react';
import {
  PenTool,
  RotateCcw,
  Check,
  X,
  Upload,
  Eye,
  Trash2,
  Sparkles,
  ShieldCheck,
  Eraser,
} from 'lucide-react';

interface CanvasSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  signerTitle: string;
  signerName: string;
  onSaveSignature: (signatureDataUrl: string) => void;
  currentSignatureUrl?: string;
}

export const CanvasSignatureModal: React.FC<CanvasSignatureModalProps> = ({
  isOpen,
  onClose,
  signerTitle,
  signerName,
  onSaveSignature,
  currentSignatureUrl,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeTab, setActiveTab] = useState<'draw' | 'upload'>('draw');
  const [penColor, setPenColor] = useState<string>('#1e3a8a'); // Navy Blue default
  const [penWidth, setPenWidth] = useState<number>(3);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentSignatureUrl || null);
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && activeTab === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Clear background to transparent/white
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setHasDrawn(false);
      }
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  // Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing && canvasRef.current) {
      setIsDrawing(false);
      // Auto update preview
      const dataUrl = canvasRef.current.toDataURL('image/png');
      setPreviewUrl(dataUrl);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setHasDrawn(false);
      setPreviewUrl(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        setPreviewUrl(result);
        setHasDrawn(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmSave = () => {
    if (previewUrl) {
      onSaveSignature(previewUrl);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden space-y-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/20 border border-blue-400/30 rounded-xl">
              <PenTool className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm">لوحة رسم وتصديق التوقيع الرقمي (Signature Pad)</h3>
              <p className="text-[11px] text-blue-200">
                {signerTitle} - <span className="font-bold text-amber-300">{signerName}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Mode Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <button
              onClick={() => setActiveTab('draw')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
                activeTab === 'draw'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>رسم التوقيع بالماوس / اللمس</span>
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
                activeTab === 'upload'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>رفع صورة توقيع جاهزة (PNG/JPG)</span>
            </button>
          </div>

          {/* TAB 1: DRAW CANVAS */}
          {activeTab === 'draw' && (
            <div className="space-y-3">
              {/* Canvas Toolbar */}
              <div className="flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">لون القلم:</span>
                  <div className="flex items-center gap-1.5">
                    {[
                      { color: '#1e3a8a', label: 'أزرق كحلي' },
                      { color: '#000000', label: 'أسود' },
                      { color: '#065f46', label: 'أخضر ملكي' },
                    ].map((c) => (
                      <button
                        key={c.color}
                        onClick={() => setPenColor(c.color)}
                        style={{ backgroundColor: c.color }}
                        title={c.label}
                        className={`w-5 h-5 rounded-full border-2 transition ${
                          penColor === c.color ? 'border-amber-400 scale-110 shadow-xs' : 'border-white dark:border-slate-800'
                        }`}
                      />
                    ))}
                  </div>

                  <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px] mr-2">سُمكن القلم:</span>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={penWidth}
                    onChange={(e) => setPenWidth(Number(e.target.value))}
                    className="w-16 accent-blue-600"
                  />
                </div>

                <button
                  onClick={clearCanvas}
                  className="px-2.5 py-1 bg-rose-100 dark:bg-rose-950/80 hover:bg-rose-200 text-rose-700 dark:text-rose-300 rounded-lg text-[11px] font-bold transition flex items-center gap-1 border border-rose-300 dark:border-rose-800"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>مسح اللوحة</span>
                </button>
              </div>

              {/* Interactive Canvas */}
              <div className="border-2 border-dashed border-blue-300 dark:border-blue-800 rounded-2xl p-2 bg-white flex justify-center shadow-inner relative">
                <canvas
                  ref={canvasRef}
                  width={480}
                  height={180}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="cursor-crosshair touch-none bg-white rounded-xl"
                />

                {!hasDrawn && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-400 text-xs font-bold gap-2">
                    <PenTool className="w-4 h-4 opacity-50" />
                    <span>ارسم توقيعك هنا بالماوس أو على الشاشة اللوحية...</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD IMAGE */}
          {activeTab === 'upload' && (
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center space-y-3 bg-slate-50/50 dark:bg-slate-800/30">
              <Upload className="w-10 h-10 text-blue-500 mx-auto animate-bounce" />
              <div>
                <p className="font-extrabold text-slate-800 dark:text-slate-200 text-xs">
                  اختر صورة التوقيع من جهازك
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  الصيغ المتاحة: PNG, JPG, WEBP (يفضل خلفية شفافة أو بيضاء)
                </p>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="signature-file-input"
              />
              <label
                htmlFor="signature-file-input"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-xs"
              >
                <Upload className="w-4 h-4" />
                <span>تصفح الملفات...</span>
              </label>
            </div>
          )}

          {/* Signature Live Preview Area */}
          {previewUrl && (
            <div className="bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 p-3 rounded-xl space-y-2">
              <span className="font-extrabold text-emerald-900 dark:text-emerald-300 text-[11px] flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                <span>معاينة التوقيع الرقمي قبل الاعتماد النهائي:</span>
              </span>

              <div className="bg-white p-3 rounded-lg border border-emerald-200 dark:border-emerald-900 flex items-center justify-center h-20 shadow-xs">
                <img src={previewUrl} alt="Signature Preview" className="max-h-full object-contain" />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-50 dark:bg-slate-800/80 p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition"
          >
            إلغاء
          </button>

          <button
            onClick={handleConfirmSave}
            disabled={!previewUrl}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs font-extrabold transition flex items-center gap-2 shadow-md"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-200" />
            <span>تأكيد واعتماد التوقيع الرقمي</span>
          </button>
        </div>
      </div>
    </div>
  );
};
