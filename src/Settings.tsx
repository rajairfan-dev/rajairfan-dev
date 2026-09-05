import React from 'react';

interface SettingsProps {
  t: Record<string, string>;
}

export default function Settings({ t }: SettingsProps) {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h3 className="text-xl font-bold text-slate-900">{t.hotelSettingsTitle}</h3>
        <p className="text-xs text-slate-500 mt-0.5">{t.hotelSettingsSubtitle}</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h4 className="font-bold text-slate-800 text-sm">{t.generalConfig}</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">{t.hotelName}</label>
            <input type="text" defaultValue="AlpineStay" className="w-full p-2 text-sm border rounded-lg" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">{t.wifiSsid}</label>
            <input type="text" defaultValue="AlpineStay" className="w-full p-2 text-sm border rounded-lg" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">{t.wifiPass}</label>
            <input type="text" defaultValue="AlpineStay" className="w-full p-2 text-sm border rounded-lg" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">{t.breakfastTimings}</label>
            <input type="text" defaultValue="7:00 AM - 10:30 AM" className="w-full p-2 text-sm border rounded-lg" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h4 className="font-bold text-slate-800 text-sm">{t.accountSecurity}</h4>
        <div className="space-y-3 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">{t.newPassword}</label>
            <input type="password" placeholder="••••••••" className="w-full p-2 text-sm border rounded-lg" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">{t.confirmPassword}</label>
            <input type="password" placeholder="••••••••" className="w-full p-2 text-sm border rounded-lg" />
          </div>
          <button className="px-4 py-2 bg-slate-600 text-white text-xs font-bold rounded-lg hover:bg-slate-700">
            {t.updatePassword}
          </button>
        </div>
      </div>
    </div>
  );
}
