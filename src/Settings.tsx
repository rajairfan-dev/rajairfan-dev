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
  CheckCircle2,
  Sparkles,
  MessageSquare
} from 'lucide-react';

// Professional Default Dynamic Templates per Language
const UI_DICTIONARY: Record<string, any> = {
  en: {
    title: "Hotel Settings & Configuration",
    subtitle: "Manage hotel info, multi-language settings, and security",
    genConfig: "General Configuration",
    genSub: "Basic hotel details for guest WiFi & information",
    hotelName: "Hotel Name",
    wifiName: "Wi-Fi Name (SSID)",
    wifiPass: "Wi-Fi Password",
    bfTime: "Breakfast Timings",
    coTime: "Checkout Time",
    multiLang: "Multi-Language Translations",
    multiSub: "Customize AI Concierge templates & prompts per language",
    editing: "EDITING LANGUAGE",
    welMsg: "Welcome Greeting Message",
    welPlaceholder: "Welcome to AlpineStay! We are delighted to have you with us. How can we assist you today?",
    askPlaceholder: "AI Concierge Input Placeholder",
    askPlaceholderVal: "Ask me anything about your stay, WiFi, or room service...",
    wifiTemplate: "WiFi Info Template Message",
    wifiTemplateVal: "Free Guest Wi-Fi: Connect to 'AlpineStay_Guest' using password 'alpine2026'.",
    checkoutTemplate: "Checkout Info Template Message",
    checkoutTemplateVal: "Standard Checkout time is 11:00 AM. Please let us know if you need late checkout.",
    saveBtn: "Save All Settings & Languages",
    secTitle: "Account Security",
    secSub: "Update admin credentials and password",
    newPass: "New Password",
    confPass: "Confirm New Password",
    updatePassBtn: "Update Password",
    toastSuccess: "Settings saved successfully!"
  },
  de: {
    title: "Hoteleinstellungen & Konfiguration",
    subtitle: "Verwalten Sie Hotelinformationen, mehrsprachige Einstellungen und Sicherheit",
    genConfig: "Allgemeine Konfiguration",
    genSub: "Grundlegende Hoteldetails für Gäste-WLAN & Informationen",
    hotelName: "Hotelname",
    wifiName: "WLAN-Name (SSID)",
    wifiPass: "WLAN-Passwort",
    bfTime: "Frühstückszeiten",
    coTime: "Check-out-Zeit",
    multiLang: "Mehrsprachige Übersetzungen",
    multiSub: "Passen Sie KI-Concierge-Vorlagen & Eingabeaufforderungen an",
    editing: "SPRACHE BEARBEITEN",
    welMsg: "Willkommensnachricht",
    welPlaceholder: "Willkommen im AlpineStay! Wir freuen uns, Sie bei uns zu haben. Wie können wir Ihnen heute helfen?",
    askPlaceholder: "KI-Concierge-Eingabetext",
    askPlaceholderVal: "Fragen Sie mich etwas über Ihren Aufenthalt, WLAN oder Zimmerservice...",
    wifiTemplate: "WLAN-Info-Vorlage",
    wifiTemplateVal: "Kostenloses Gäste-WLAN: Verbinden Sie sich mit 'AlpineStay_Guest' (Passwort: alpine2026).",
    checkoutTemplate: "Check-out-Info-Vorlage",
    checkoutTemplateVal: "Die reguläre Check-out-Zeit ist 11:00 Uhr. Teilen Sie uns mit, wenn Sie einen späten Check-out benötigen.",
    saveBtn: "Alle Einstellungen & Sprachen speichern",
    secTitle: "Kontosicherheit",
    secSub: "Administrator-Anmeldeinformationen und Passwort aktualisieren",
    newPass: "Neues Passwort",
    confPass: "Neues Passwort bestätigen",
    updatePassBtn: "Passwort aktualisieren",
    toastSuccess: "Einstellungen erfolgreich gespeichert!"
  },
  es: {
    title: "Configuración del Hotel",
    subtitle: "Gestione información del hotel, idiomas y seguridad",
    genConfig: "Configuración General",
    genSub: "Detalles básicos del hotel para WiFi de huéspedes e información",
    hotelName: "Nombre del Hotel",
    wifiName: "Nombre de Wi-Fi (SSID)",
    wifiPass: "Contraseña de Wi-Fi",
    bfTime: "Horario de Desayuno",
    coTime: "Hora de Salida (Checkout)",
    multiLang: "Traducciones Multilingües",
    multiSub: "Personalice las plantillas y mensajes del Concierge IA",
    editing: "EDITANDO IDIOMA",
    welMsg: "Mensaje de Bienvenida",
    welPlaceholder: "¡Bienvenido a AlpineStay! Estamos encantados de tenerle con nosotros. ¿En qué podemos ayudarle?",
    askPlaceholder: "Texto de Marcador del Concierge IA",
    askPlaceholderVal: "Pregúntame cualquier cosa sobre tu estancia, WiFi o servicio a la habitación...",
    wifiTemplate: "Plantilla de Información WiFi",
    wifiTemplateVal: "Wi-Fi gratuito para huéspedes: Conéctese a 'AlpineStay_Guest' con la contraseña 'alpine2026'.",
    checkoutTemplate: "Plantilla de Información de Checkout",
    checkoutTemplateVal: "La hora de salida estándar es a las 11:00 AM. Avísanos si necesitas salida tardía.",
    saveBtn: "Guardar Ajustes e Idiomas",
    secTitle: "Seguridad de la Cuenta",
    secSub: "Actualizar credenciales de administrador y contraseña",
    newPass: "Nueva Contraseña",
    confPass: "Confirmar Nueva Contraseña",
    updatePassBtn: "Actualizar Contraseña",
    toastSuccess: "¡Ajustes guardados con éxito!"
  }
};

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', label: 'Español', flag: '🇪🇸' }
];

export default function Settings() {
  const [currentLang, setCurrentLang] = useState<'en' | 'de' | 'es'>('de');
  const [showToast, setShowToast] = useState(false);

  // Form States
  const [hotelName, setHotelName] = useState('AlpineStay');
  const [wifiSsid, setWifiSsid] = useState('AlpineStay_Guest');
  const [wifiPassword, setWifiPassword] = useState('alpine2026');
  const [breakfastTime, setBreakfastTime] = useState('7:00 AM - 10:30 AM');
  const [checkoutTime, setCheckoutTime] = useState('11:00 AM');

  // Dynamic Content according to selected language
  const t = UI_DICTIONARY[currentLang] || UI_DICTIONARY.en;

  const [templates, setTemplates] = useState(UI_DICTIONARY);

  const handleLangChange = (langCode: 'en' | 'de' | 'es') => {
    setCurrentLang(langCode);
  };

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const updateTemplateField = (field: string, value: string) => {
    setTemplates(prev => ({
      ...prev,
      [currentLang]: {
        ...prev[currentLang],
        [field]: value
      }
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-sans">
      {/* Top Header Controls / Sync Dropdown */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2">
          <Globe className="w-5 h-5 text-indigo-600" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active App Language:</span>
        </div>
        <select 
          value={currentLang} 
          onChange={(e) => handleLangChange(e.target.value as any)}
          className="bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
        >
          {LANGUAGES.map(l => (
            <option key={l.code} value={l.code}>{l.flag} {l.label}</option>
          ))}
        </select>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center space-x-2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-bold">{t.toastSuccess}</span>
        </div>
      )}

      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t.title}</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">{t.subtitle}</p>
      </div>

      {/* 1. General Configuration Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-base">{t.genConfig}</h2>
            <p className="text-xs text-slate-400">{t.genSub}</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">{t.hotelName}</label>
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
              <label className="block text-xs font-bold text-slate-600 mb-1.5">{t.wifiName}</label>
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
              <label className="block text-xs font-bold text-slate-600 mb-1.5">{t.wifiPass}</label>
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
              <label className="block text-xs font-bold text-slate-600 mb-1.5">{t.bfTime}</label>
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
              <label className="block text-xs font-bold text-slate-600 mb-1.5">{t.coTime}</label>
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
        </div>
      </div>

      {/* 2. Multi-Language Translations & Dynamic Template Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-base">{t.multiLang}</h2>
            <p className="text-xs text-slate-400">{t.multiSub}</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Language Selector Tabs */}
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((item) => {
              const active = currentLang === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleLangChange(item.code as any)}
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

          {/* Active Template Editor Box */}
          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-5">
            <div className="flex items-center space-x-2 text-indigo-700 font-extrabold text-xs tracking-wider uppercase">
              <Sparkles className="w-4 h-4" />
              <span>{t.editing}: {LANGUAGES.find(l => l.code === currentLang)?.label.toUpperCase()}</span>
            </div>

            {/* Template 1: Welcome Greeting */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">{t.welMsg}</label>
              <textarea
                rows={3}
                value={templates[currentLang]?.welPlaceholderVal || t.welPlaceholder}
                onChange={(e) => updateTemplateField('welPlaceholderVal', e.target.value)}
                className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition leading-relaxed"
              />
            </div>

            {/* Template 2: Input Placeholder */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">{t.askPlaceholder}</label>
              <input
                type="text"
                value={templates[currentLang]?.askPlaceholderVal || t.askPlaceholderVal}
                onChange={(e) => updateTemplateField('askPlaceholderVal', e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Template 3: WiFi Template Message */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">{t.wifiTemplate}</label>
              <input
                type="text"
                value={templates[currentLang]?.wifiTemplateVal || t.wifiTemplateVal}
                onChange={(e) => updateTemplateField('wifiTemplateVal', e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Template 4: Checkout Template Message */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">{t.checkoutTemplate}</label>
              <input
                type="text"
                value={templates[currentLang]?.checkoutTemplateVal || t.checkoutTemplateVal}
                onChange={(e) => updateTemplateField('checkoutTemplateVal', e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          <button
            onClick={triggerToast}
            type="button"
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition flex items-center justify-center space-x-2 shadow-md shadow-indigo-100"
          >
            <Save className="w-4 h-4" />
            <span>{t.saveBtn}</span>
          </button>
        </div>
      </div>

      {/* 3. Account Security Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-base">{t.secTitle}</h2>
            <p className="text-xs text-slate-400">{t.secSub}</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">{t.newPass}</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">{t.confPass}</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>
          </div>

          <button
            onClick={triggerToast}
            type="button"
            className="px-5 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition flex items-center space-x-2 shadow-sm"
          >
            <KeyRound className="w-4 h-4" />
            <span>{t.updatePassBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
            }
