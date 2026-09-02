import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Settings as SettingsIcon, 
  Menu, 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  LogOut, 
  Bell, 
  RotateCw,
  Trash2,
  Globe,
  Upload,
  FileText
} from 'lucide-react';
import { supabase } from './supabaseClient';
import { askHotelAI, ChatMessage } from './aiAgent';
import Settings from './Settings';
import Login from './Login';
import Analytics from './Analytics';

// --- MULTILINGUAL TRANSLATIONS (13 Languages) ---
type Language = 'en' | 'de' | 'it' | 'nl' | 'fr' | 'es' | 'pl' | 'ru' | 'ar' | 'zh' | 'sv' | 'ja' | 'ko';

const LANGUAGES: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
];

const translations: Record<Language, Record<string, string>> = {
  en: {
    dashboard: "Dashboard",
    guests: "Guests List",
    requests: "Requests",
    ai: "AI Concierge",
    settings: "Settings",
    checkInTitle: "Quick Guest Check-In",
    firstName: "First Name",
    surname: "Surname",
    email: "Email Address",
    phone: "Phone Number",
    room: "Room Number",
    passport: "Upload Passport/ID",
    register: "Register Guest",
    uploading: "Uploading...",
    refresh: "Refresh",
    done: "Done",
    reopen: "Re-open",
    delete: "Delete"
  },
  de: {
    dashboard: "Dashboard",
    guests: "Gästeliste",
    requests: "Anfragen",
    ai: "KI Concierge",
    settings: "Einstellungen",
    checkInTitle: "Schneller Gäste-Check-in",
    firstName: "Vorname",
    surname: "Nachname",
    email: "E-Mail-Adresse",
    phone: "Telefonnummer",
    room: "Zimmernummer",
    passport: "Reisepass/Ausweis hochladen",
    register: "Gast registrieren",
    uploading: "Wird hochgeladen...",
    refresh: "Aktualisieren",
    done: "Erledigt",
    reopen: "Wiederöffnen",
    delete: "Löschen"
  },
  it: {
    dashboard: "Dashboard",
    guests: "Lista Ospiti",
    requests: "Richieste",
    ai: "AI Concierge",
    settings: "Impostazioni",
    checkInTitle: "Check-In Rapido Ospiti",
    firstName: "Nome",
    surname: "Cognome",
    email: "Indirizzo Email",
    phone: "Numero di Telefono",
    room: "Numero di Camera",
    passport: "Carica Passaporto/ID",
    register: "Registra Ospite",
    uploading: "Caricamento...",
    refresh: "Aggiorna",
    done: "Fatto",
    reopen: "Riapri",
    delete: "Elimina"
  },
  nl: {
    dashboard: "Dashboard",
    guests: "Gastenlijst",
    requests: "Verzoeken",
    ai: "AI Concierge",
    settings: "Instellingen",
    checkInTitle: "Snelle Gast Inchecken",
    firstName: "Voornaam",
    surname: "Achternaam",
    email: "E-mailadres",
    phone: "Telefoonnummer",
    room: "Kamernummer",
    passport: "Paspoort/ID Uploaden",
    register: "Gast Registreren",
    uploading: "Uploaden...",
    refresh: "Vernieuwen",
    done: "Klaar",
    reopen: "Heropenen",
    delete: "Verwijderen"
  },
  fr: {
    dashboard: "Tableau de bord",
    guests: "Liste des Clients",
    requests: "Demandes",
    ai: "Concierge IA",
    settings: "Paramètres",
    checkInTitle: "Enregistrement Rapide",
    firstName: "Prénom",
    surname: "Nom",
    email: "Adresse Email",
    phone: "Numéro de Téléphone",
    room: "Numéro de Chambre",
    passport: "Télécharger Passeport/PI",
    register: "Enregistrer le Client",
    uploading: "Envoi...",
    refresh: "Actualiser",
    done: "Terminé",
    reopen: "Rouvrir",
    delete: "Supprimer"
  },
  es: {
    dashboard: "Panel de Control",
    guests: "Lista de Huéspedes",
    requests: "Solicitudes",
    ai: "Conserje IA",
    settings: "Configuración",
    checkInTitle: "Registro Rápido de Huéspedes",
    firstName: "Nombre",
    surname: "Apellido",
    email: "Correo Electrónico",
    phone: "Teléfono",
    room: "Número de Habitación",
    passport: "Subir Pasaporte/DNI",
    register: "Registrar Huésped",
    uploading: "Subiendo...",
    refresh: "Actualizar",
    done: "Hecho",
    reopen: "Reabrir",
    delete: "Eliminar"
  },
  pl: {
    dashboard: "Pulpit",
    guests: "Lista Gości",
    requests: "Prośby",
    ai: "Konjerż AI",
    settings: "Ustawienia",
    checkInTitle: "Szybka Rejestracja Gościa",
    firstName: "Imię",
    surname: "Nazwisko",
    email: "Adres E-mail",
    phone: "Numer Telefonu",
    room: "Numer Pokoju",
    passport: "Prześlij Paszport/Dowód",
    register: "Zarejestruj Gościa",
    uploading: "Przesyłanie...",
    refresh: "Odśwież",
    done: "Gotowe",
    reopen: "Otwórz ponownie",
    delete: "Usuń"
  },
  ru: {
    dashboard: "Панель управления",
    guests: "Список гостей",
    requests: "Запросы",
    ai: "ИИ Консьерж",
    settings: "Настройки",
    checkInTitle: "Быстрая регистрация гостя",
    firstName: "Имя",
    surname: "Фамилия",
    email: "Эл. почта",
    phone: "Номер телефона",
    room: "Номер комнаты",
    passport: "Загрузить паспорт/ID",
    register: "Зарегистрировать гостя",
    uploading: "Загрузка...",
    refresh: "Обновить",
    done: "Готово",
    reopen: "Открыть заново",
    delete: "Удалить"
  },
  ar: {
    dashboard: "لوحة التحكم",
    guests: "قائمة الضيوف",
    requests: "الطلبات",
    ai: "المساعد الذكي",
    settings: "الإعدادات",
    checkInTitle: "تسجيل دخول سريع للضيف",
    firstName: "الاسم الأول",
    surname: "اسم العائلة",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    room: "رقم الغرفة",
    passport: "تحميل الجواز/الهوية",
    register: "تسجيل الضيف",
    uploading: "جاري التحميل...",
    refresh: "تحديث",
    done: "تم",
    reopen: "إعادة فتح",
    delete: "حذف"
  },
  zh: {
    dashboard: "仪表板",
    guests: "客人列表",
    requests: "服务请求",
    ai: "AI 礼宾",
    settings: "设置",
    checkInTitle: "快速办理入住",
    firstName: "名",
    surname: "姓",
    email: "电子邮件",
    phone: "电话号码",
    room: "房间号",
    passport: "上传护照/身份证",
    register: "登记客人",
    uploading: "上传中...",
    refresh: "刷新",
    done: "完成",
    reopen: "重新打开",
    delete: "删除"
  },
  sv: {
    dashboard: "Översikt",
    guests: "Gästlista",
    requests: "Begäranden",
    ai: "AI Concierge",
    settings: "Inställningar",
    checkInTitle: "Snabb Incheckning",
    firstName: "Förnamn",
    surname: "Efternamn",
    email: "E-postadress",
    phone: "Telefonnummer",
    room: "Rumsnummer",
    passport: "Ladda upp Pass/ID",
    register: "Registrera Gäst",
    uploading: "Laddar upp...",
    refresh: "Uppdatera",
    done: "Klar",
    reopen: "Öppna igen",
    delete: "Ta bort"
  },
  ja: {
    dashboard: "ダッシュボード",
    guests: "ゲスト一覧",
    requests: "リクエスト",
    ai: "AIコンシェルジュ",
    settings: "設定",
    checkInTitle: "クイックチェックイン",
    firstName: "名",
    surname: "姓",
    email: "メールアドレス",
    phone: "電話番号",
    room: "部屋番号",
    passport: "パスポート/IDをアップロード",
    register: "ゲストを登録",
    uploading: "アップロード中...",
    refresh: "更新",
    done: "完了",
    reopen: "再オープン",
    delete: "削除"
  },
  ko: {
    dashboard: "대시보드",
    guests: "투숙객 목록",
    requests: "요청 사항",
    ai: "AI 컨시어지",
    settings: "설정",
    checkInTitle: "빠른 체크인",
    firstName: "이름",
    surname: "성",
    email: "이메일 주소",
    phone: "전화번호",
    room: "객실 번호",
    passport: "여권/ID 업로드",
    register: "투숙객 등록",
    uploading: "업로드 중...",
    refresh: "새로고침",
    done: "완료",
    reopen: "다시 열기",
    delete: "삭제"
  }
};

interface Guest {
  id: string;
  name: string;
  surname?: string;
  email?: string;
  phone?: string;
  room_number: string | number;
  passport_url?: string;
  created_at: string;
}

interface GuestRequest {
  id: string;
  room_number: string | number;
  request_text: string;
  status: 'pending' | 'completed' | string;
  created_at: string;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const t = (key: string) => translations[lang]?.[key] || key;

  const [session, setSession] = useState<any>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'guests' | 'requests' | 'ai' | 'settings'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Form Check-in
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [room, setRoom] = useState('');
  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [guests, setGuests] = useState<Guest[]>([]);
  const [requests, setRequests] = useState<GuestRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshingRequests, setRefreshingRequests] = useState(false);

  // Chat AI Concierge States
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Welcome! I am your 24/7 AI Concierge. How can I assist you today?"
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatRoom, setChatRoom] = useState('101');
  const [aiLoading, setAiLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'ai') {
      scrollToBottom();
    }
  }, [messages, activeTab]);

  useEffect(() => {
    let isMounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) {
        setSession(session);
        setAuthChecking(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setSession(session);
        setAuthChecking(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session) {
      fetchGuests();
      fetchRequests();

      const channel = supabase
        .channel('schema-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'guest_requests' }, () => {
          fetchRequests();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session]);

  async function fetchGuests() {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) console.error(error);
      else setGuests(data || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchRequests() {
    try {
      setRefreshingRequests(true);
      const { data, error } = await supabase
        .from('guest_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) console.error(error);
      else setRequests(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshingRequests(false);
    }
  }

  async function handleAddGuest(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !room.trim()) return;

    try {
      setUploading(true);
      let passportUrl = '';

      if (passportFile) {
        const fileExt = passportFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;
        
        const { data, error: uploadError } = await supabase.storage
          .from('passports')
          .upload(fileName, passportFile);

        if (uploadError) {
          console.error("Upload error:", uploadError.message);
        } else if (data) {
          const { data: pubUrl } = supabase.storage.from('passports').getPublicUrl(data.path);
          passportUrl = pubUrl.publicUrl;
        }
      }

      const { error } = await supabase.from('guests').insert([
        {
          name: firstName.trim(),
          surname: surname.trim(),
          email: email.trim(),
          phone: phone.trim(),
          room_number: room.trim(),
          passport_url: passportUrl
        }
      ]);

      if (error) {
        alert('Error: ' + error.message);
      } else {
        setFirstName('');
        setSurname('');
        setEmail('');
        setPhone('');
        setRoom('');
        setPassportFile(null);
        fetchGuests();
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleCheckOutGuest(id: string) {
    if (!window.confirm('Check-out this guest?')) return;
    await supabase.from('guests').delete().eq('id', id);
    fetchGuests();
  }

  async function handleUpdateReqStatus(id: string, newStatus: string) {
    await supabase.from('guest_requests').update({ status: newStatus }).eq('id', id);
    fetchRequests();
  }

  async function handleDeleteRequest(id: string) {
    if (!window.confirm('Delete this request?')) return;
    await supabase.from('guest_requests').delete().eq('id', id);
    fetchRequests();
  }

  // Handle Send Chat Message
  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || chatInput;
    if (!textToSend.trim() || aiLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setChatInput('');
    setAiLoading(true);

    try {
      const chatHistory: ChatMessage[] = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text
      }));

      const reply = await askHotelAI(textToSend, chatHistory, chatRoom);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: reply
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "Sorry, I am having trouble answering right now."
      }]);
    } finally {
      setAiLoading(false);
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <Sparkles className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!session) return <Login onLoginSuccess={() => fetchGuests()} />;

  const filteredGuests = guests.filter((g) =>
    g.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.surname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.room_number?.toString().includes(searchQuery)
  );

  return (
    <div className={`flex h-screen bg-slate-100 font-sans overflow-hidden ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
      
      {/* Sidebar Navigation */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-200 flex flex-col justify-between ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-lg">A</div>
              <h1 className="font-bold text-base leading-tight">AlpineStay</h1>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="p-4 space-y-1">
            <button onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
              <LayoutDashboard className="w-5 h-5" />
              <span>{t('dashboard')}</span>
            </button>
            <button onClick={() => { setActiveTab('guests'); setIsSidebarOpen(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'guests' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
              <Users className="w-5 h-5" />
              <span>{t('guests')}</span>
            </button>
            <button onClick={() => { setActiveTab('requests'); setIsSidebarOpen(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'requests' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
              <Bell className="w-5 h-5" />
              <span>{t('requests')}</span>
            </button>
            <button onClick={() => { setActiveTab('ai'); setIsSidebarOpen(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'ai' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
              <MessageSquare className="w-5 h-5" />
              <span>{t('ai')}</span>
            </button>
            <button onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
              <SettingsIcon className="w-5 h-5" />
              <span>{t('settings')}</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button onClick={() => supabase.auth.signOut()} className="flex items-center space-x-2 text-xs text-slate-400 hover:text-rose-400 transition">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header */}
        <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shadow-sm">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-slate-600">
            <Menu className="w-6 h-6" />
          </button>

          <h2 className="text-lg font-bold text-slate-800 capitalize">{t(activeTab)}</h2>

          {/* Language Selector */}
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <Globe className="w-4 h-4 text-indigo-600" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Language)}
              className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.name}
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* Dashboard Views */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeTab === 'dashboard' && (
            <>
              <Analytics guestsCount={guests.length} requests={requests} />

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-800 mb-4">{t('checkInTitle')}</h3>
                
                <form onSubmit={handleAddGuest} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder={t('firstName')}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder={t('surname')}
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    className="px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="email"
                    placeholder={t('email')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="tel"
                    placeholder={t('phone')}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder={t('room')}
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />

                  {/* Passport Upload */}
                  <div className="relative border border-dashed border-indigo-300 rounded-lg p-2 text-center bg-indigo-50/50 hover:bg-indigo-50 transition flex items-center justify-center">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => setPassportFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600">
                      <Upload className="w-4 h-4" />
                      <span className="truncate">{passportFile ? passportFile.name : t('passport')}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={uploading}
                    className="sm:col-span-2 md:col-span-3 bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {uploading ? t('uploading') : t('register')}
                  </button>
                </form>
              </div>
            </>
          )}

          {activeTab === 'guests' && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-800">{t('guests')}</h3>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="divide-y divide-slate-100">
                {filteredGuests.length === 0 ? (
                  <p className="p-6 text-center text-xs text-slate-400">No guests found.</p>
                ) : (
                  filteredGuests.map((g) => (
                    <div key={g.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{g.name} {g.surname}</p>
                        <p className="text-xs text-slate-400">{g.email} | {g.phone}</p>
                        <span className="inline-block mt-1 px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-full border border-indigo-200/50">
                          Room {g.room_number}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {g.passport_url && (
                          <a
                            href={g.passport_url}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium flex items-center space-x-1 hover:bg-slate-200 transition"
                          >
                            <FileText className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Passport</span>
                          </a>
                        )}
                        <button
                          onClick={() => handleCheckOutGuest(g.id)}
                          className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-xs font-semibold hover:bg-rose-100 transition"
                        >
                          Check Out
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-800">{t('requests')}</h3>
                <button onClick={fetchRequests} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold flex items-center space-x-1">
                  <RotateCw className={`w-3.5 h-3.5 ${refreshingRequests ? 'animate-spin' : ''}`} />
                  <span>{t('refresh')}</span>
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {requests.length === 0 ? (
                  <p className="p-6 text-center text-xs text-slate-400">No requests found.</p>
                ) : (
                  requests.map((req) => (
                    <div key={req.id} className="p-4 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-xs px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-full">Room {req.room_number}</span>
                        <p className="text-xs text-slate-800 mt-1 font-medium">{req.request_text}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateReqStatus(req.id, req.status === 'pending' ? 'completed' : 'pending')}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold ${req.status === 'pending' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                        >
                          {req.status === 'pending' ? t('done') : t('reopen')}
                        </button>
                        <button onClick={() => handleDeleteRequest(req.id)} className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* AI CONCIERGE TAB */}
          {activeTab === 'ai' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[calc(100vh-140px)]">
              {/* Header */}
              <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">AlpineStay AI Concierge</h3>
                    <p className="text-xs text-slate-500">Always active to assist guests</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-500 font-medium">Room:</span>
                  <input
                    type="text"
                    value={chatRoom}
                    onChange={(e) => setChatRoom(e.target.value)}
                    className="w-16 px-2 py-1 text-xs border border-slate-300 rounded font-bold text-center"
                  />
                </div>
              </div>

              {/* Chat Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-start space-x-2.5 ${m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.sender === 'user' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-800 text-white'}`}>
                      {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    <div className={`max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed ${m.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'}`}>
                      {m.text}
                    </div>
                  </div>
                ))}

                {aiLoading && (
                  <div className="flex items-center space-x-2 text-slate-400 text-xs italic pl-10">
                    <Sparkles className="w-4 h-4 animate-spin text-indigo-500" />
                    <span>AI is typing...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              <div className="px-4 py-2 border-t border-slate-100 flex flex-wrap gap-2 bg-slate-50/50">
                <button
                  onClick={() => handleSendMessage("Need extra towels for my room.")}
                  className="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 rounded-full text-[11px] font-medium hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition"
                >
                  🧹 Need Extra Towels
                </button>
                <button
                  onClick={() => handleSendMessage("What is the Wi-Fi password?")}
                  className="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 rounded-full text-[11px] font-medium hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition"
                >
                  📶 Wi-Fi Password
                </button>
                <button
                  onClick={() => handleSendMessage("What time is breakfast served?")}
                  className="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 rounded-full text-[11px] font-medium hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition"
                >
                  🍳 Breakfast Time
                </button>
              </div>

              {/* Chat Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 border-t border-slate-200 flex items-center space-x-2 bg-white rounded-b-xl"
              >
                <input
                  type="text"
                  placeholder="Type your request or question..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={aiLoading || !chatInput.trim()}
                  className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {activeTab === 'settings' && <Settings />}
        </div>
      </div>
    </div>
  );
    }
