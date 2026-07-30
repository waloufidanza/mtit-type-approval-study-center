/**
 * @file Step3Technical.tsx
 * Step 3: Technical & Frequency Spectrum Inspection with Confidence Scores & Security Cards
 */

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { SpectrumStatus, SecurityStatus, FrequencyBand } from '../../../types/typeApproval';
import { StatusBadge } from '../../common/StatusBadge';
import {
  Radio,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Sliders,
  Plus,
  Trash2,
  FileText,
  AlertOctagon,
  Lock,
} from 'lucide-react';

export const Step3Technical: React.FC = () => {
  const { currentRequest, setCurrentRequest, addToast, updateStepStatus } = useApp();

  const [spectrumState, setSpectrumState] = useState<SpectrumStatus>(currentRequest.spectrumStatus);
  const [securityState, setSecurityState] = useState<SecurityStatus>(currentRequest.securityStatus);

  const [newBand, setNewBand] = useState<Partial<FrequencyBand>>({
    startFreq: '5850',
    endFreq: '5925',
    unit: 'MHz',
    bandwidth: '20 MHz',
    txPower: '20 dBm',
    eirp: '23 dBm',
    antennaType: 'External',
    antennaGain: '18 dBi',
    complianceStatus: 'يحتاج_ترخيص_خاص',
  });

  const handleUpdateSpectrumStatus = (st: SpectrumStatus) => {
    setSpectrumState(st);
    setCurrentRequest((prev) => ({
      ...prev,
      spectrumStatus: st,
    }));
    addToast({
      type: 'info',
      title: 'تحديث نتيجة الترددات',
      message: `تم تحديث حالة الفحص الترددي إلى (${st.replace(/_/g, ' ')})`,
    });
  };

  const handleUpdateSecurityStatus = (st: SecurityStatus) => {
    setSecurityState(st);
    setCurrentRequest((prev) => ({
      ...prev,
      securityStatus: st,
    }));
    addToast({
      type: 'info',
      title: 'تحديث حالة التنسيق الأمني',
      message: `تم تحديث حالة التنسيق الأمني إلى (${st.replace(/_/g, ' ')})`,
    });
  };

  const handleAddFrequencyBand = () => {
    const band: FrequencyBand = {
      id: `band-${Date.now()}`,
      startFreq: newBand.startFreq || '5000',
      endFreq: newBand.endFreq || '5100',
      unit: newBand.unit as 'MHz' | 'GHz' | 'kHz',
      bandwidth: newBand.bandwidth || '20 MHz',
      txPower: newBand.txPower || '20 dBm',
      eirp: newBand.eirp || '23 dBm',
      antennaType: newBand.antennaType || 'Omni',
      antennaGain: newBand.antennaGain || '10 dBi',
      modulation: 'OFDM',
      dutyCycle: '100%',
      channelSpacing: '5 MHz',
      environment: 'خارجي',
      complianceStatus: newBand.complianceStatus as 'مطابق_للطيف_الوطني' | 'يحتاج_ترخيص_خاص' | 'محظور',
    };

    setCurrentRequest((prev) => ({
      ...prev,
      frequencyBands: [...prev.frequencyBands, band],
    }));

    addToast({
      type: 'success',
      title: 'إضافة نطاق ترددي جديد',
      message: `تم إضافة النطاق (${band.startFreq} - ${band.endFreq} ${band.unit}) بنجاح.`,
    });
  };

  const handleDeleteBand = (id: string) => {
    setCurrentRequest((prev) => ({
      ...prev,
      frequencyBands: prev.frequencyBands.filter((b) => b.id !== id),
    }));
  };

  // 19 Detailed Technical Parameters with Source, Page Number, Confidence Score & Review Status
  const technicalSpecsList = [
    { name: 'التقنيات المدمجة', val: 'Wi-Fi 5 (802.11ac wave 2) / PTP Proprietary Protocol', src: 'Datasheet', page: 2, confidence: 99, status: 'تم الفحص' },
    { name: 'واجهات الاتصال', val: '1x Gigabit RJ45 PoE, 1x SFP Optical Slot', src: 'Datasheet', page: 3, confidence: 98, status: 'تم الفحص' },
    { name: 'نطاقات التردد المتاحة', val: '5150 - 5850 MHz', src: 'RF Test Report', page: 12, confidence: 100, status: 'مطابق' },
    { name: 'عرض النطاق (Bandwidth)', val: '20 / 40 / 80 MHz Channel Widths', src: 'RF Test Report', page: 14, confidence: 96, status: 'تم الفحص' },
    { name: 'قدرة الإرسال (Tx Power)', val: '27 dBm (500 mW)', src: 'RF Test Report', page: 22, confidence: 94, status: 'محال للترددات' },
    { name: 'القدرة المشعة EIRP', val: '36 dBm (4000 mW)', src: 'RF Test Report', page: 26, confidence: 92, status: 'تنبيه قدرة عالية' },
    { name: 'نوع الهوائي', val: 'Integrated Dual-Polarization Flat Panel Antenna', src: 'User Manual', page: 5, confidence: 99, status: 'مطابق' },
    { name: 'كسب الهوائي (Gain)', val: '23 dBi Directional Panel', src: 'Datasheet', page: 4, confidence: 97, status: 'مطابق' },
    { name: 'نوع التضمين (Modulation)', val: 'OFDM (BPSK, QPSK, 16-QAM, 64-QAM, 256-QAM)', src: 'RF Test Report', page: 18, confidence: 99, status: 'تم الفحص' },
    { name: 'دورة التشغيل (Duty Cycle)', val: '100% Continuous Transmit Capable', src: 'RF Test Report', page: 30, confidence: 95, status: 'تم الفحص' },
    { name: 'تباعد القنوات (Spacing)', val: '5 MHz Channel Step', src: 'User Manual', page: 11, confidence: 98, status: 'تم الفحص' },
    { name: 'الاستخدام (داخلي/خارجي)', val: 'خارجي (Outdoor Pole / Tower Mount)', src: 'Datasheet', page: 1, confidence: 100, status: 'مطابق' },
    { name: 'بيئة التشغيل والحرارة', val: '-40°C to +65°C Operating Temperature', src: 'Datasheet', page: 5, confidence: 96, status: 'تم الفحص' },
    { name: 'مصدر الطاقة (Power)', val: 'PoE 802.3at (48V Passive / Active)', src: 'User Manual', page: 8, confidence: 99, status: 'مطابق' },
    { name: 'درجة الحماية الهيكلية', val: 'IP67 Weatherproof / UV Resistant', src: 'Test Report', page: 40, confidence: 97, status: 'مطابق' },
    { name: 'المعايير القياسية المطبقة', val: 'EN 301 893, EN 302 502, IEC 62368-1', src: 'CE RED Cert', page: 2, confidence: 100, status: 'مطابق' },
    { name: 'نتائج فحوص التوافق EMC', val: 'Pass - Compliant with EN 301 489-17', src: 'EMC Report', page: 15, confidence: 98, status: 'مطابق' },
    { name: 'القيود التشغيلية', val: 'يتطلب حظر القنوات 5600-5650 MHz لرادارات الطقس', src: 'Spectrum Decision', page: 1, confidence: 95, status: 'شرط ملزم' },
    { name: 'مخاطر التداخل الكهرومغناطيسي', val: 'مخاطر منخفضة عند حصر EIRP بـ 30 dBm', src: 'Technical Opinion', page: 3, confidence: 91, status: 'تحت المتابعة' },
  ];

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Radio className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>الخطوة الثالثة: الفحص الفني والترددي للمواصفات والتقنيات</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            تدقيق 19 معياراً فنياً، وإدارة نطاقات التردد المتاحة وتحديد القرارات الخاصة بقطاع الترددات والأمن.
          </p>
        </div>

        <button
          onClick={() => updateStepStatus('step3', 'معتمدة')}
          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>اعتماد الفحص الفني</span>
        </button>
      </div>

      {/* Two Status Control Cards: Spectrum & Security */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Spectrum Review Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>بطاقة نتيجة مراجعة الترددات (Spectrum Decision)</span>
            </h3>
            <StatusBadge status={spectrumState} size="sm" />
          </div>

          <div className="space-y-2 text-xs">
            <p className="text-slate-600 dark:text-slate-400">حدد نتيجة الفحص الترددي بناءً على إفادة قطاع الترددات:</p>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  'لا_يحتاج_إحالة',
                  'يحتاج_مراجعة',
                  'محال',
                  'بانتظار_الإفادة',
                  'متوافق',
                  'متوافق_بشروط',
                  'غير_متوافق',
                ] as SpectrumStatus[]
              ).map((st) => (
                <button
                  key={st}
                  onClick={() => handleUpdateSpectrumStatus(st)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold border transition ${
                    spectrumState === st
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  {st.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security Coordination Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>بطاقة التنسيق والأمن السيبراني (Security Coordination)</span>
            </h3>
            <StatusBadge status={securityState} size="sm" />
          </div>

          <div className="space-y-2 text-xs">
            <p className="text-slate-600 dark:text-slate-400">حدد نتيجة التنسيق الأمني والبرمجي للجهاز:</p>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  'لا_يتطلب',
                  'يتطلب',
                  'محال',
                  'بانتظار_الإفادة',
                  'موافق',
                  'موافق_بشروط',
                  'اعتراض',
                ] as SecurityStatus[]
              ).map((st) => (
                <button
                  key={st}
                  onClick={() => handleUpdateSecurityStatus(st)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold border transition ${
                    securityState === st
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  {st.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Band Frequency Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>جدول النطاقات الترددية للجهاز (Multi-Band Frequency Allocations)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              يعرض النطاقات التشغيلية ومطابقتها لخطة الترددات الوطنية اليمنية.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">نطاق التردد (MHz)</th>
                <th className="p-3">عرض القناة</th>
                <th className="p-3">قدرة الإرسال (Tx)</th>
                <th className="p-3">قدرة EIRP</th>
                <th className="p-3">نوع الهوائي والكسب</th>
                <th className="p-3">حالة المطابقة مع الخطة الوطنية</th>
                <th className="p-3 text-center">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200 font-mono">
              {currentRequest.frequencyBands.map((band) => (
                <tr key={band.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-blue-900 dark:text-blue-300">
                    {band.startFreq} - {band.endFreq} {band.unit}
                  </td>
                  <td className="p-3">{band.bandwidth}</td>
                  <td className="p-3">{band.txPower}</td>
                  <td className="p-3 font-bold text-amber-700 dark:text-amber-300">{band.eirp}</td>
                  <td className="p-3 font-sans text-xs">
                    {band.antennaType} ({band.antennaGain})
                  </td>
                  <td className="p-3 font-sans">
                    <StatusBadge status={band.complianceStatus} size="sm" />
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDeleteBand(band.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition"
                      title="حذف النطاق"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add New Frequency Band Row Controls */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-3 text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300">إضافة نطاق ترددي:</span>
          <input
            type="text"
            placeholder="بداية 5850"
            value={newBand.startFreq}
            onChange={(e) => setNewBand({ ...newBand, startFreq: e.target.value })}
            className="w-24 p-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-center font-mono"
          />
          <span>-</span>
          <input
            type="text"
            placeholder="نهاية 5925"
            value={newBand.endFreq}
            onChange={(e) => setNewBand({ ...newBand, endFreq: e.target.value })}
            className="w-24 p-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-center font-mono"
          />
          <button
            onClick={handleAddFrequencyBand}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold transition flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة النطاق</span>
          </button>
        </div>
      </div>

      {/* 19 Technical Parameters Detailed Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>المواصفات والبارامترات الفنية الشاملة (19 بنداً مع درجة الثقة)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {technicalSpecsList.map((item, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-50/90 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/80 space-y-1.5 text-xs"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-bold text-slate-900 dark:text-slate-100">{item.name}</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">ثقة {item.confidence}%</span>
              </div>
              <p className="font-bold text-blue-900 dark:text-blue-300 font-mono text-xs">{item.val}</p>
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px] text-slate-500">
                <span>المصدر: {item.src} (ص {item.page})</span>
                <span className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
