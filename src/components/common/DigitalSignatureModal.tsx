import React, { useState, useRef } from 'react';
import { ShieldCheck, CheckCircle2, Lock, X, Award, Fingerprint, Edit3, RotateCcw } from 'lucide-react';

interface DigitalSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSign: (signatureData: {
    signerName: string;
    signerRole: string;
    signatureHash: string;
    timestamp: string;
    certificateNumber: string;
    drawingDataUrl?: string;
  }) => void;
  signerName: string;
  signerRole: string;
  documentTitle: string;
}

export const DigitalSignatureModal: React.FC<DigitalSignatureModalProps> = ({
  isOpen,
  onClose,
  onSign,
  signerName,
  signerRole,
  documentTitle,
}) => {
  const [signatureMode, setSignatureMode] = useState<'draw' | 'pin'>('draw');
  const [pinCode, setPinCode] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [signedSuccess, setSignedSuccess] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Canvas Drawing Pad State & Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  if (!isOpen) return null;

  const generateSignatureHash = () => {
    const chars = '0123456789ABCDEF';
    let result = '0x';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Canvas Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawingRef.current = true;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = '#1e3a8a'; // dark blue
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasDrawn(false);
  };

  const handleConfirmSignature = () => {
    if (!agreed) return;
    if (signatureMode === 'pin' && pinCode.length < 4) return;
    if (signatureMode === 'draw' && !hasDrawn) return;

    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      setSignedSuccess(true);
      const hash = generateSignatureHash();
      const now = new Date().toLocaleString('ar-YE');
      const drawingUrl = canvasRef.current ? canvasRef.current.toDataURL() : undefined;

      setTimeout(() => {
        onSign({
          signerName,
          signerRole,
          signatureHash: hash,
          timestamp: now,
          certificateNumber: `SIG-${Date.now().toString().slice(-6)}`,
          drawingDataUrl: drawingUrl,
        });
        setSignedSuccess(false);
        setPinCode('');
        setAgreed(false);
        onClose();
      }, 1200);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-900 text-white p-5 flex items-center justify-between border-b border-blue-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-400/30">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm">لوحة التوقيع الإلكتروني (Digital Signature Pad)</h3>
              <p className="text-[11px] text-blue-200">توقيع المراجع والختم الزمني المعتمد</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {signedSuccess ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 rounded-full flex items-center justify-center mx-auto text-emerald-600 border-2 border-emerald-500 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-slate-100">تم التوقيع الإلكتروني بنجاح!</h4>
              <p className="text-slate-500">تم توليد الختم المشفر وتسجيل التوقيع في سجل التتبع الموثوق.</p>
            </div>
          ) : (
            <>
              {/* Document Summary */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex justify-between items-center text-slate-500">
                  <span>القرار المراد توقيعه:</span>
                  <span className="font-mono text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-1.5 py-0.5 rounded font-bold">
                    معتمد
                  </span>
                </div>
                <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{documentTitle}</p>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">الموقع المفوض:</span>
                  <span className="font-bold text-blue-900 dark:text-blue-300">
                    {signerName} ({signerRole})
                  </span>
                </div>
              </div>

              {/* Signature Mode Switcher Tabs */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setSignatureMode('draw')}
                  className={`flex-1 py-1.5 rounded-lg transition flex items-center justify-center gap-1.5 ${
                    signatureMode === 'draw'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>توقيع يدوي (Signature Pad)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSignatureMode('pin')}
                  className={`flex-1 py-1.5 rounded-lg transition flex items-center justify-center gap-1.5 ${
                    signatureMode === 'pin'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>رمز الأمان (PIN)</span>
                </button>
              </div>

              {/* Mode 1: Interactive Canvas Drawing Pad */}
              {signatureMode === 'draw' ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                      <span>ارسم توقيعك في المربع أدناه:</span>
                    </label>
                    <button
                      type="button"
                      onClick={clearCanvas}
                      className="text-[11px] font-bold text-rose-600 hover:underline flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>مسح التوقيع</span>
                    </button>
                  </div>

                  <div className="border-2 border-dashed border-blue-300 dark:border-blue-800 rounded-xl bg-white dark:bg-slate-950 p-1 relative shadow-inner">
                    <canvas
                      ref={canvasRef}
                      width={380}
                      height={120}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className="w-full h-28 cursor-crosshair touch-none rounded-lg"
                    />
                    {!hasDrawn && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-300 dark:text-slate-700 font-bold text-xs">
                        ضع خط توقيعك هنا بفرشاة الرسم...
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Mode 2: Security PIN Input */
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-500" />
                    <span>رمز الأمان السري المفوض (PIN):</span>
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="أدخل رمز التوقيع (مثال: 1234)"
                    className="w-full px-3 py-2 text-center text-lg font-mono tracking-widest bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Declaration Checkbox */}
              <label className="flex items-start gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                  أقر بصفتي المخولة قانونياً بأن التوقيع الرقمي يُعد اعتماداً رسمياً نهائياً للوثيقة ويتحمل كافة الآثار القانونية للتنظيم.
                </span>
              </label>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition text-xs"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  disabled={
                    !agreed ||
                    (signatureMode === 'pin' && pinCode.length < 4) ||
                    (signatureMode === 'draw' && !hasDrawn) ||
                    isSigning
                  }
                  onClick={handleConfirmSignature}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl font-bold transition text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  {isSigning ? (
                    <span>جاري التوقيع والتشفير...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>توقيع واعتمد نهائياً</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
;
