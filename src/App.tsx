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
  Search, 
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

// Fixed Type Definition here to prevent TypeScript compilation error
const translations: Record<string, Record<string, string>> = {
  en: {
    dashboard: "Dashboard", guests: "Guests List", requests: "Requests", ai: "AI Concierge", settings: "Settings",
    checkInTitle: "Quick Guest Check-In", firstName: "First Name", surname: "Surname", email: "Email Address",
    phone: "Phone Number", room: "Room Number", passport: "Upload Passport/ID", register: "Register Guest",
    uploading: "Uploading...", refresh: "Refresh", done: "Done", reopen: "Re-open", delete: "Delete"
  },
  de: {
    dashboard: "Dashboard", guests: "Gästeliste", requests: "Anfragen", ai: "KI Concierge", settings: "Einstellungen",
    checkInTitle: "Schneller Gäste-Check-in", firstName: "Vorname", surname: "Nachname", email: "E-Mail-Adresse",
    phone: "Telefonnummer", room: "Zimmernummer", passport: "Reisepass/Ausweis hochladen", register: "Gast registrieren",
    uploading: "Wird hochgeladen...", refresh: "Aktualisieren", done: "Erledigt", reopen: "Wiederöffnen", delete: "Löschen"
  },
  it: {
    dashboard: "Dashboard", guests: "Lista Ospiti", requests: "Richieste", ai: "AI Concierge", settings: "Impostazioni",
    checkInTitle: "Check-In Rapido Ospiti", firstName: "Nome", surname: "Cognome", email: "Indirizzo Email",
    phone: "Numero di Telefono", room: "Numero di Camera", passport: "Carica Passaporto/ID", register: "Registra Ospite",
    uploading: "Caricamento...", refresh: "Aggiorna", done: "Fatto", reopen: "Riapri", delete: "Elimina"
  },
  nl: {
    dashboard: "Dashboard", guests: "Gastenlijst", requests: "Verzoeken", ai: "AI Concierge", settings: "Instellingen",
    checkInTitle: "Snelle Gast Inchecken", firstName: "Voornaam", surname: "Achternaam", email: "E-mailadres",
    phone: "Telefoonnummer", room: "Kamernummer", passport: "Paspoort/ID Uploaden", register: "Gast Registreren",
    uploading: "Uploaden...", refresh: "Vernieuwen", done: "Klaar", reopen: "Heropenen", delete: "Verwijderen"
  },
  fr: {
    dashboard: "Tableau de bord", guests: "Liste des Clients", requests: "Demandes", ai: "Concierge IA", settings: "Paramètres",
    checkInTitle: "Enregistrement Rapide", firstName: "Prénom", surname: "Nom", email: "Adresse Email",
    phone: "Numéro de Téléphone", room: "Numéro de Chambre", passport: "Télécharger Passeport/PI", register: "Enregistrer le Client",
    uploading: "Envoi...", refresh: "Actualiser", done: "Terminé", reopen: "Rouvrir", delete: "Supprimer"
  },
  es: {
    dashboard: "Panel de Control", guests: "Lista de Huéspedes", requests: "Solicitudes", ai: "Conserje IA", settings: "Configuración",
    checkInTitle: "Registro Rápido de Huéspedes", firstName: "Nombre", surname: "Apellido", email: "Correo Electrónico",
    phone: "Teléfono", room: "Número de Habitación", passport: "Subir Pasaporte/DNI", register: "Registrar Huésped",
    uploading: "Subiendo...", refresh: "Actualizar", done: "Hecho", reopen: "Reabrir", delete: "Eliminar"
  },
  pl: {
    dashboard: "Pulpit", guests: "Lista Gości", requests: "Prośby", ai: "Konjerż AI", settings: "Ustawienia",
    checkInTitle: "Szybka Rejestracja Gościa", firstName: "Imię", surname: "Nazwisko", email: "Adres E-mail",
    phone: "Numer Telefonu", room: "Numer Pokoju", passport: "Prześlij Paszport/Dowód", register: "Zarejestruj Gościa",
    uploading: "Przesyłanie...", refresh: "Odśwież", done: "Gotowe", reopen: "Otwórz ponownie", delete: "Usuń"
  },
  ru: {
    dashboard: "Панель управления", guests: "Список гостей", requests: "Запросы", ai: "ИИ Консьерж", settings: "Настройки",
    checkInTitle: "Быстрая регистрация гостя", firstName: "Имя", surname: "Фамилия", email: "Эл. почта",
    phone: "Номер телефона", room: "Номер комнаты", passport: "Загрузить паспорт/ID", register: "Зарегистрировать гостя",
    uploading: "Загрузка...", refresh: "Обновить", done: "Готово", reopen: "Открыть заново", delete: "Удалить"
  },
  ar: {
    dashboard: "لوحة التحكم", guests: "قائمة الضيوف", requests: "الطلبات", ai: "المساعد الذكي", settings: "الإعدادات",
    checkInTitle: "تسجيل دخول سريع للضيف", firstName: "الاسم الأول", surname: "اسم العائلة", email: "البريد الإلكتروني",
    phone: "رقم الهاتف", room: "رقم الغرفة", passport: "تحميل الجواز/الهوية", register: "تسجيل الضيف",
    uploading: "جاري التحميل...", refresh: "تحديث", done: "تم", reopen: "إعادة فتح", delete: "حذف"
  },
  zh: {
    dashboard: "仪表板", guests: "客人列表", requests: "服务请求", ai: "AI 礼宾", settings: "设置",
    checkInTitle: "快速办理入住", firstName: "名", surname: "姓", email: "电子邮件",
    phone: "电话号码", room: "房间号", passport: "上传护照/身份证", register: "登记客人",
    uploading: "上传中...", refresh: "刷新", done: "完成", reopen: "重新打开", delete: "删除"
  },
  sv: {
    dashboard: "Översikt", guests: "Gästlista", requests: "Begäranden", ai: "AI Concierge", settings: "Inställningar",
    checkInTitle: "Snabb Incheckning", firstName: "Förnamn", surname: "Efternamn", email: "E-postadress",
    phone: "Telefonnummer", room: "Rumsnummer", passport: "Ladda upp Pass/ID", register: "Registrera Gäst",
    uploading: "Laddar upp...", refresh: "Uppdatera", done: "Klar", reopen: "Öppna igen", delete: "Ta bort"
  },
  ja: {
    dashboard: "ダッシュボード", guests: "ゲスト一覧", requests: "リクエスト", ai: "AIコンシェルジュ", settings: "設定",
    checkInTitle: "クイックチェックイン", firstName: "名", surname: "姓", email: "メールアドレス",
    phone: "電話番号", room: "部屋番号", passport: "パスポート/IDをアップロード", register: "ゲストを登録",
    uploading: "アップロード中...", refresh: "更新", done: "完了", reopen: "再オープン", delete: "削除"
  },
  ko: {
    dashboard: "대시보드", guests: "투숙객 목록", requests: "요청 사항", ai: "AI 컨시어지", settings: "설정",
    checkInTitle: "빠른 체크인", firstName: "이름", surname: "성", email: "이메일 주소",
    phone: "전화번호", room: "객실 번호", passport: "여권/ID 업로드", register: "투숙객 등록",
    uploading: "업로드 중...", refresh: "새로고침", done: "완료", reopen: "다시 열기", delete: "삭제"
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

const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  const parseInlineMarkdown = (content: string) => {
    const parts = content.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="italic text-slate-700">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  const lines = text.split('\n');

  return (
    <div className="space-y-1">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;
        if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
          const content = trimmed.substring(1).trim();
          return (
            <div key={idx} className="flex items-start space-x-2 my-0.5">
              <span className="text-indigo-600 font-bold select-none">•</span>
              <span className="flex-1">{parseInlineMarkdown(content)}</span>
            </div>
          );
        }
        return (
          <p key={idx} className="leading-relaxed">
            {parseInlineMarkdown(line)}
          </p>
        );
      })}
    </div>
  );
};

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const t = (key: string) => translations[lang]?.[key] || translations['en']?.[key] || key;

  const [session, setSession] = useState<any>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'guests' | 'requests' | 'ai' | 'settings'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Form States
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
  const [loadingGuests, setLoadingGuests] = useState(false);
  const [refreshingRequests, setRefreshingRequests] = useState(false);

  // AI Chat States
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Welcome to AlpineStay! I am your 24/7 digital concierge."
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatRoom, setChatRoom] = useState('101');
  const [aiLoading, setAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

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
    }
  }, [session]);

  async function fetchGuests() {
    try {
      setLoadingGuests(true);
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setGuests(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingGuests(false);
    }
  }

  async function fetchRequests() {
    try {
      setRefreshingRequests(true);
      const { data, error } = await supabase
        .from('guest_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setRequests(data || []);
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
        const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
        const { data, error: uploadError } = await supabase.storage
          .from('passports')
          .upload(fileName, passportFile);

        if (!uploadError && data) {
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
        alert('Error adding guest: ' + error.message);
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
    if (!window.confirm('Check out guest?')) return;
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

  const handleSendAIChat = async (textToSend?: string) => {
    const query = textToSend || chatInput;
    if (!query.trim() || aiLoading) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setChatInput('');
    setAiLoading(true);

    try {
      const historyForAI: ChatMessage[] = messages.slice(-6).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const aiResponse = await askHotelAI(query, chatRoom, historyForAI);
      setMessages((prev) => [...prev, { id: Date.now().toString(), sender: 'ai', text: aiResponse }]);
    } catch (err) {
      setMessages((prev) => [...prev, { id: Date.now().toString(), sender: 'ai', text: "Error fetching response." }]);
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
      
      {/* Sidebar */}
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
            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm ${activeTab === 'dashboard' ? 'bg-indigo-600' : 'text-slate-400'}`}>
              <LayoutDashboard className="w-5 h-5" />
              <span>{t('dashboard')}</span>
            </button>
            <button onClick={() => setActiveTab('guests')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm ${activeTab === 'guests' ? 'bg-indigo-600' : 'text-slate-400'}`}>
              <Users className="w-5 h-5" />
              <span>{t('guests')}</span>
            </button>
            <button onClick={() => setActiveTab('requests')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm ${activeTab === 'requests' ? 'bg-indigo-600' : 'text-slate-400'}`}>
              <Bell className="w-5 h-5" />
              <span>{t('requests')}</span>
            </button>
            <button onClick={() => setActiveTab('ai')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm ${activeTab === 'ai' ? 'bg-indigo-600' : 'text-slate-400'}`}>
              <MessageSquare className="w-5 h-5" />
              <span>{t('ai')}</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button onClick={() => supabase.auth.signOut()} className="flex items-center space-x-2 text-xs text-slate-400 hover:text-rose-400">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header with Language Switcher */}
        <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-slate-600">
            <Menu className="w-6 h-6" />
          </button>

          <h2 className="text-lg font-bold text-slate-800 capitalize">{t(activeTab)}</h2>

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

        {/* View Switcher */}
        <div className="flex-1 overflow-y
