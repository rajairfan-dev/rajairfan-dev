import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { 
  Key, 
  Wifi, 
  Clock, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Building,
  Globe,
  Loader2
} from 'lucide-react';

const LANGUAGES = [
  { code: 'en', name: 'English 🇬🇧' },
  { code: 'de', name: 'German 🇩🇪' },
  { code: 'it', name: 'Italian 🇮🇹' },
  { code: 'nl', name: 'Dutch 🇳🇱' },
  { code: 'fr', name: 'French 🇫🇷' },
  { code: 'es', name: 'Spanish 🇪🇸' },
  { code: 'pl', name: 'Polish 🇵🇱' },
  { code: 'ru', name: 'Russian 🇷🇺' },
  { code: 'ar', name: 'Arabic 🇸🇦' },
  { code: 'zh', name: 'Chinese 🇨🇳' },
  { code: 'sv', name: 'Swedish 🇸🇪' }
];

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeLang, setActiveLang] = useState('en');
  const [recordId, setRecordId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    hotel_name: 'AlpineStay',
    wifi_name: 'AlpineStay_Guest',
    wifi_password: 'alpine2026',
    checkout_time: '11:00 AM',
    breakfast_hours: '7:00 AM – 10:30 AM'
  });

  const [translations, setTranslations] = useState<Record<string, { welcome: string; breakfast: string }>>({});

  // Password Change States
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  // Status Alerts
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [passSuccess, setPassSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('hotel_settings').select('*').limit(1).maybeSingle();

      if (data) {
        setRecordId(data.id);
        setFormData({
          hotel_name: data.hotel_name || 'AlpineStay',
          wifi_name: data.wifi_name || 'AlpineStay_Guest',
          wifi_password: data.wifi_password || 'alpine2026',
          checkout_time: data.checkout_time || '11:00 AM',
          breakfast_hours: data.breakfast_hours || '7:00 AM – 10:30 AM'
        });
        if (data.translations) {
          setTranslations(data.translations);
        }
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTranslationChange = (field: 'welcome' | 'breakfast', value: string) => {
    setTranslations(prev => ({
      ...prev,
      [activeLang]: {
        ...prev[activeLang],
        [field]: value
      }
    }));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage('');
    setSavedSuccess(false);

    try {
      const payload: any = {
        ...formData,
        translations
      };

      if (recordId) {
        payload.id = recordId;
      }

      const { error } = await supabase.from('hotel_settings').upsert(payload);

      if (error) throw error;

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      fetchSettings();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error saving settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setPassSuccess(false);

    if (newPassword.length < 6) {
      setErrorMessage('Password kam se kam 6 characters ka hona chahiye.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords match nahi ho rahe!');
      return;
    }

    setPassLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setPassSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPassSuccess(false), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Password update nahi ho saka.');
    } finally {
      setPassLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-500 space-x-2">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        <span className="text-sm font-medium">Loading Hotel Settings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Hotel Settings & Configuration</h2>
        <p className="text-sm text-slate-500">Manage hotel info, multi-language settings, and security</p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* General Hotel Info */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex items-center space-x-2">
            <Building className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800">General Configuration</h3>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Hotel Name</label>
              <input
                type="text"
                value={formData.hotel_name}
                onChange={e => setFormData({ ...formData, hotel_name: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Wi-Fi Name (SSID)</label>
              <div className="relative">
                <Wifi className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.wifi_name}
                  onChange={e => setFormData({ ...formData, wifi_name: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Wi-Fi Password</label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.wifi_password}
                  onChange={e => setFormData({ ...formData, wifi_password: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Breakfast Timings</label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.breakfast_hours}
                  onChange={e => setFormData({ ...formData, breakfast_hours: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Checkout Time</label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.checkout_time}
                  onChange={e => setFormData({ ...formData, checkout_time: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Language Support */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex items-center space-x-2">
            <Globe className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800">Multi-Language Translations</h3>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setActiveLang(lang.code)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-semibold border transition ${
                    activeLang === lang.code
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>

            <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                Editing: {LANGUAGES.find(l => l.code === activeLang)?.name}
              </h4>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Welcome Greeting Message</label>
                <input
                  type="text"
                  value={translations[activeLang]?.welcome || ''}
                  onChange={e => handleTranslationChange('welcome', e.target.value)}
                  placeholder="e.g. Welcome to AlpineStay!"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Breakfast Description</label>
                <input
                  type="text"
                  value={translations[activeLang]?.breakfast || ''}
                  onChange={e => handleTranslationChange('breakfast', e.target.value)}
                  placeholder="e.g. Served from 7:00 AM to 10:30 AM in the Main Dining Room"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm transition flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving to Database...' : 'Save All Settings & Languages'}</span>
            </button>

            {savedSuccess && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Saved successfully to database!</span>
              </span>
            )}
          </div>
        </div>
      </form>

      {/* Security & Password Change */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-800">Account Security</h3>
        </div>

        <form onSubmit={handleChangePassword} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Confirm New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="submit"
              disabled={passLoading || !newPassword}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold shadow-sm transition flex items-center space-x-2 disabled:opacity-50"
            >
              <Key className="w-4 h-4" />
              <span>Update Password</span>
            </button>

            {passSuccess && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Password updated!</span>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
                }
