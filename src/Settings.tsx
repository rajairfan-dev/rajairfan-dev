import React, { useState } from 'react';
import { 
  Building2, 
  Wifi, 
  KeyRound, 
  Clock, 
  Globe, 
  ShieldCheck, 
  Save, 
  Lock,
  CheckCircle2
} from 'lucide-react';
import { languageList, translations, Language } from './translations';

export default function Settings() {
  const [selectedLang, setSelectedLang] = useState<Language>('en');
  const [showToast, setShowToast] = useState(false);

  // Form State
  const [hotelName, setHotelName] = useState('AlpineStay');
  const [wifiSsid, setWifiSsid] = useState('AlpineStay_Guest');
  const [wifiPassword, setWifiPassword] = useState('alpine2026');
  const [breakfastTime, setBreakfastTime] = useState('7:00 AM - 10:30 AM');
  const [checkoutTime, setCheckoutTime] = useState('11:00 AM');

  // Translations Form State
  const [translationsData, setTranslationsData] = useState(translations);

  // Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast();
  };

  const handleSaveTranslations = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast();
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword === confirmPassword) {
      triggerToast();
      setNewPassword('');
      setConfirmPassword('');
    } else {
      alert('Passwords do not match!');
    }
  };

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const currentLangLabel = languageList.find(l => l.code === selectedLang);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center space-x-2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-bold">Settings saved successfully!</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Hotel Settings & Configuration
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Manage hotel info, multi-language settings, and security
        </p>
      </div>

      {/* 1. General Configuration Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-base">General Configuration</h2>
            <p className="text-xs text-slate-400">Basic hotel details for guest WiFi & information</p>
          </div>
        </div>

        <form onSubmit={handleSaveGeneral} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Hotel Name</label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Wi-Fi Name (SSID)</label>
              <div className="relative">
                <Wifi className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Wi-Fi Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Breakfast Timings</label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={breakfastTime}
                  onChange={(e) => setBreakfastTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Checkout Time</label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={checkoutTime}
                  onChange={(e) => setCheckoutTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* 2. Multi-Language Translations Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-base">Multi-Language Translations</h2>
            <p className="text-xs text-slate-400">Customize AI Concierge prompts & messages per language</p>
          </div>
        </div>

        <form onSubmit={handleSaveTranslations} className="p-6 space-y-6">
          {/* Language Selection Buttons */}
          <div className="flex flex-wrap gap-2">
            {languageList.map((item) => {
              const active = selectedLang === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setSelectedLang(item.code as Language)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border ${
                    active
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.label}</span>
                  <span>{item.flag}</span>
                </button>
              );
            })}
          </div>

          {/* Active Editing Container */}
          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <div className="flex items-center space-x-2 text-indigo-700 font-extrabold text-xs tracking-wider uppercase">
              <span>EDITING: {currentLangLabel?.label.toUpperCase()}</span>
              <span>{currentLangLabel?.flag}</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Welcome Greeting Message</label>
              <textarea
                rows={4}
                value={translationsData[selectedLang]?.welcomeMsg || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setTranslationsData((prev) => ({
                    ...prev,
                    [selectedLang]: {
                      ...prev[selectedLang],
                      welcomeMsg: val
                    }
                  }));
                }}
                className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Input Placeholder Text</label>
              <input
                type="text"
                value={translationsData[selectedLang]?.askPlaceholder || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setTranslationsData((prev) => ({
                    ...prev,
                    [selectedLang]: {
                      ...prev[selectedLang],
                      askPlaceholder: val
                    }
                  }));
                }}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition flex items-center justify-center space-x-2 shadow-md shadow-indigo-100"
          >
            <Save className="w-4 h-4" />
            <span>Save All Settings & Languages</span>
          </button>
        </form>
      </div>

      {/* 3. Account Security Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-base">Account Security</h2>
            <p className="text-xs text-slate-400">Update admin credentials and password</p>
          </div>
        </div>

        <form onSubmit={handleUpdatePassword} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition flex items-center space-x-2 shadow-sm"
          >
            <KeyRound className="w-4 h-4" />
            <span>Update Password</span>
          </button>
        </form>
      </div>
    </div>
  );
                }
