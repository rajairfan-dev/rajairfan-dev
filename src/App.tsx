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
  Printer,
  Download,
  Globe
} from 'lucide-react';
import { supabase } from './supabaseClient';
import { askHotelAI, ChatMessage } from './aiAgent';
import Settings from './Settings';
import Login from './Login';
import Analytics from './Analytics';
import Guests from './Guests';
import Requests from './Requests';
import { languageList, translations, Language } from './translations';

interface Guest {
  id: string;
  name: string;
  surname?: string;
  email?: string;
  phone?: string;
  room_number: string | number;
  check_in_date?: string;
  check_out_date?: string;
  language?: string;
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
  const [session, setSession] = useState<any>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'guests' | 'requests' | 'ai' | 'settings'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);
  
  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang] || translations.en || {};

  const defaultPrompts = [
    { label: "🧹 Extra Towels", query: "Can you please bring extra towels to my room?" },
    { label: "💧 Water Bottles", query: "Please send fresh bottled water to my room." },
    { label: "🏔️ Dolomites Skiing", query: "What are the best skiing spots and tours in Dolomites?" },
    { label: "🍷 Michelin Dining", query: "Recommend top Michelin dining options near the hotel." },
    { label: "🏎️ Lombardy & Modena", query: "Tell me about day trips to Modena and Lombardy." },
  ];

  const promptsList = t?.prompts || defaultPrompts;
  const welcomeMsgText = t?.welcomeMsg || `Welcome to AlpineStay! I am your 24/7 digital concierge for Northern Italy.

• Wi-Fi: AlpineStay_Guest | Pass: alpine2026
• Breakfast: 7:00 AM – 10:30 AM
• Checkout: 11:00 AM

How may I assist your luxury stay today?`;
  
  const askPlaceholderText = t?.askPlaceholder || 'Ask Wi-Fi pass, luxury tours, Michelin dining...';

  // Check-In Form State
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [room, setRoom] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guestLang, setGuestLang] = useState('English');
  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [guests, setGuests] = useState<Guest[]>([]);
  const [requests, setRequests] = useState<GuestRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingGuests, setLoadingGuests] = useState(false);
  const [refreshingRequests, setRefreshingRequests] = useState(false);

  const [selectedQRRoom, setSelectedQRRoom] = useState<string | null>(null);

  // AI Chat States
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatRoom, setChatRoom] = useState('101');
  const [aiLoading, setAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: '1',
        sender: 'ai',
        text: welcomeMsgText
      }
    ]);
  }, [lang]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomFromUrl = urlParams.get('room');
    if (roomFromUrl) {
      setChatRoom(roomFromUrl);
      setIsGuestMode(true);
      setActiveTab('ai');
    }
  }, []);

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
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'guest_requests' },
          () => {
            fetchRequests();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session]);

  useEffect(() => {
    if (activeTab === 'ai' || isGuestMode) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, aiLoading, activeTab, isGuestMode]);

  async function fetchGuests() {
    try {
      setLoadingGuests(true);
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) console.error('Error fetching guests:', error);
      else setGuests(data || []);
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

      if (error) console.error('Error fetching requests:', error);
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

    setIsSubmitting(true);
    try {
      let passportUrl = '';

      if (passportFile) {
        const fileExt = passportFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `passports/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('guest-documents')
          .upload(filePath, passportFile);

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from('guest-documents')
            .getPublicUrl(filePath);
          passportUrl = publicUrlData.publicUrl;
        }
      }

      const fullName = surname.trim() ? `${firstName.trim()} ${surname.trim()}` : firstName.trim();

      const payload: any = { 
        name: fullName, 
        surname: surname.trim(),
        email: email.trim(),
        phone: phone.trim(),
        room_number: room.trim(),
        passport_url: passportUrl
      };

      if (checkInDate) payload.check_in_date = checkInDate;
      if (checkOutDate) payload.check_out_date = checkOutDate;
      if (guestLang) payload.language = guestLang;

      const { error } = await supabase
        .from('guests')
        .insert([payload]);

      if (error) {
        alert('Error adding guest: ' + error.message);
      } else {
        setFirstName('');
        setSurname('');
        setEmail('');
        setPhone('');
        setRoom('');
        setCheckInDate('');
        setCheckOutDate('');
        setPassportFile(null);
        fetchGuests();
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCheckOutGuest(id: string) {
    if (!window.confirm('Are you sure you want to check out this guest?')) return;

    try {
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', id);

      if (error) {
        alert('Error checking out guest: ' + error.message);
      } else {
        fetchGuests();
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  }

  async function handleUpdateReqStatus(id: string, newStatus: string) {
    try {
      const { error } = await supabase
        .from('guest_requests')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) console.error(error);
      else fetchRequests();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeleteRequest(id: string) {
    if (!window.confirm('Delete this request?')) return;
    try {
      const { error } = await supabase
        .from('guest_requests')
        .delete()
        .eq('id', id);

      if (error) console.error(error);
      else fetchRequests();
    } catch (err) {
      console.error(err);
    }
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

      const aiResponse = await askHotelAI(query, chatRoom, historyForAI, lang);
      const aiMsg: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: aiResponse };
      setMessages((prev) => [...prev, aiMsg]);
      
      if (session) {
        setTimeout(() => fetchRequests(), 1000);
      }
    } catch (err) {
      const errorMsg: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: "Sorry, I encountered an issue. Please try again." };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleDownloadQR = async (roomNum: string) => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(
      `${window.location.origin}?room=${roomNum}`
    )}`;
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `AlpineStay_Room_${roomNum}_QR.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      window.open(qrUrl, '_blank');
    }
  };

  if (isGuestMode) {
    return (
      <div className="flex flex-col h-screen bg-slate-50 font-sans">
        <header className="bg-indigo-600 text-white px-4 py-3 flex justify-between items-center shadow-md shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm leading-tight">AlpineStay Concierge</h1>
              <p className="text-[10px] text-indigo-200">24/7 Digital Concierge • Room #{chatRoom}</p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 bg-indigo-700/80 px-2 py-1 rounded-lg border border-indigo-400/30">
            <Globe className="w-3.5 h-3.5 text-indigo-200" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Language)}
              className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
            >
              {languageList.map((item) => (
                <option key={item.code} value={item.code} className="text-slate-800">
                  {item.flag} {item.label}
                </option>
              ))}
            </select>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-2 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white flex-shrink-0 shadow">
                  <Bot className="w-5 h-5" />
                </div>
              )}
              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none whitespace-pre-wrap shadow-md font-medium'
                    : 'bg-white text-slate-800 shadow-sm border border-slate-200/90 rounded-bl-none'
                }`}
              >
                {msg.sender === 'ai' ? (
                  <FormattedText text={msg.text} />
                ) : (
                  msg.text
                )}
              </div>
              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white flex-shrink-0 shadow">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}

          {aiLoading && (
            <div className="flex items-center space-x-2 text-slate-500 text-sm pl-2">
              <Sparkles className="w-4 h-4 animate-spin text-indigo-600" />
              <span>AlpineStay Concierge is typing...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="px-4 py-2 bg-white/80 backdrop-blur-md border-t border-slate-200 overflow-x-auto flex space-x-2 no-scrollbar shrink-0">
          {promptsList.map((prompt: any, idx: number) => (
            <button
              key={idx}
              onClick={() => handleSendAIChat(prompt.query)}
              disabled={aiLoading}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-slate-100 text-indigo-700 hover:bg-indigo-50 border border-indigo-100/80 transition disabled:opacity-50 shrink-0 shadow-sm"
            >
              {prompt.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendAIChat();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2 shadow-lg shrink-0"
        >
          <input
            type="text"
            placeholder={askPlaceholderText}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="flex-1 px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={aiLoading || !chatInput.trim()}
            className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 shadow-md shadow-indigo-200"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    );
  }

  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <Sparkles className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!session) {
    return <Login onLoginSuccess={() => fetchGuests()} />;
  }

  const filteredGuests = guests.filter(
    (g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.surname && g.surname.toLowerCase().includes(searchQuery.toLowerCase())) ||
      g.room_number.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden w-full max-w-full">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {selectedQRRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div id="printable-qr-modal" className="bg-white rounded-2xl max-w-sm w-full p-8 shadow-2xl relative text-center space-y-5 border border-slate-100">
            <button
              onClick={() => setSelectedQRRoom(null)}
              className="no-print absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="px-3.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-extrabold rounded-full tracking-wide uppercase">
                AlpineStay Concierge
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-3">Room {selectedQRRoom}</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Scan for 24/7 Room Service & Concierge</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl flex justify-center border border-slate-200/80 shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
                  `${window.location.origin}?room=${selectedQRRoom}`
                )}`}
                alt={`QR Code Room ${selectedQRRoom}`}
                className="w-48 h-48 rounded-xl shadow-md"
              />
            </div>

            <div className="no-print grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleDownloadQR(selectedQRRoom)}
                className="flex items-center justify-center space-x-2 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition"
              >
                <Download className="w-4 h-4" />
                <span>Save PNG</span>
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center space-x-2 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition shadow-md shadow-indigo-200"
              >
                <Printer className="w-4 h-4" />
                <span>Print Stand</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out flex flex-col justify-between shrink-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                A
              </div>
              <div>
                <h1 className="font-bold text-base leading-tight">AlpineStay</h1>
                <p className="text-xs text-slate-400">Hotel Management</p>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="p-4 space-y-1">
            <button
              onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>{t?.dashboard || 'Dashboard'}</span>
            </button>

            <button
              onClick={() => { setActiveTab('guests'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                activeTab === 'guests'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>{t?.guests || 'Guests List'}</span>
            </button>

            <button
              onClick={() => { setActiveTab('requests'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition ${
                activeTab === 'requests'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5" />
                <span>{t?.requests || 'Requests'}</span>
              </div>
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 text-xs bg-rose-500 text-white font-bold rounded-full animate-pulse">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('ai'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                activeTab === 'ai'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>{t?.aiConcierge || 'AI Concierge'}</span>
            </button>

            <button
              onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                activeTab === 'settings'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <SettingsIcon className="w-5 h-5" />
              <span>{t?.settings || 'Settings'}</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
              A
            </div>
            <div className="truncate max-w-[120px]">
              <p className="text-xs font-medium truncate">{session?.user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 text-slate-400 hover:text-rose-400 transition rounded-lg hover:bg-slate-800"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden w-full max-w-full">
        <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-slate-600 hover:text-slate-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-bold text-slate-800 capitalize">
              {t[activeTab as keyof typeof t] || activeTab}
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-indigo-600" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Language)}
              className="bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg p-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {languageList.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.flag} {item.label}
                </option>
              ))}
            </select>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 w-full max-w-full">
          {activeTab === 'dashboard' && (
            <div className="p-4 sm:p-6 space-y-6">
              <Analytics guestsCount={guests.length} requests={requests} />

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-base font-bold text-slate-800">{t?.quickCheckIn || 'Quick Guest Check-In'}</h3>
                </div>

                <form onSubmit={handleAddGuest} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">{t?.firstName || 'First Name'}</label>
                      <input
                        type="text"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">{t?.surname || 'Surname / Last Name'}</label>
                      <input
                        type="text"
                        placeholder="Doe"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">{t?.email || 'Email Address'}</label>
                      <input
                        type="email"
                        placeholder="john.doe@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">{t?.phone || 'Phone Number'}</label>
                      <input
                        type="tel"
                        placeholder="+39 333 1234567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">{t?.roomNumber || 'Room Number'}</label>
                      <input
                        type="text"
                        placeholder="104"
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">{t?.checkInDate || 'Check-In Date'}</label>
                      <input
                        type="date"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">{t?.checkOutDate || 'Check-Out Date'}</label>
                      <input
                        type="date"
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">{t?.preferredLang || 'Preferred Language'}</label>
                      <select
                        value={guestLang}
                        onChange={(e) => setGuestLang(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      >
                        {languageList.map((l) => (
                          <option key={l.code} value={l.label}>
                            {l.flag} {l.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">{t?.passportUpload || 'Upload Passport / ID Photo'}</label>
                      <div className="relative flex items-center">
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => setPassportFile(e.target.files ? e.target.files[0] : null)}
                          className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 border border-slate-300 rounded-lg p-1 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-indigo-600 text-white py-2.5 px-6 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition shadow-md shadow-indigo-100 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Registering...' : (t?.registerGuest || 'Register Guest')}
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'guests' && (
            <div className="w-full max-w-full overflow-x-hidden">
              <Guests
                filteredGuests={filteredGuests}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                fetchGuests={fetchGuests}
                loadingGuests={loadingGuests}
                setSelectedQRRoom={setSelectedQRRoom}
                handleCheckOutGuest={handleCheckOutGuest}
                t={t}
              />
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="w-full max-w-full overflow-x-hidden">
              <Requests
                requests={requests}
                fetchRequests={fetchRequests}
                refreshingRequests={refreshingRequests}
                handleUpdateReqStatus={handleUpdateReqStatus}
                handleDeleteRequest={handleDeleteRequest}
                t={t}
              />
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="flex flex-col h-[calc(100vh-65px)] bg-slate-100 min-w-0">
              <div className="bg-indigo-600 text-white px-4 py-3 flex justify-between items-center shadow-sm shrink-0">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5" />
                  <span className="font-bold text-sm">AlpineStay Guest AI Concierge</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 bg-indigo-700/80 px-2 py-1 rounded-lg border border-indigo-400/30">
                    <Globe className="w-3.5 h-3.5 text-indigo-200" />
                    <select
                      value={lang}
                      onChange={(e) => setLang(e.target.value as Language)}
                      className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
                    >
                      {languageList.map((item) => (
                        <option key={item.code} value={item.code} className="text-slate-800">
                          {item.flag} {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs text-indigo-200">Room #</span>
                    <input
                      type="text"
                      placeholder="101"
                      value={chatRoom}
                      onChange={(e) => setChatRoom(e.target.value)}
                      className="w-16 px-2 py-1 text-xs rounded bg-indigo-700 text-white placeholder-indigo-300 focus:outline-none font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start space-x-2 ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white flex-shrink-0">
                        <Bot className="w-5 h-5" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-none whitespace-pre-wrap font-medium shadow'
                          : 'bg-white text-slate-800 shadow-sm border border-slate-200 rounded-bl-none'
                      }`}
                    >
                      {msg.sender === 'ai' ? (
                        <FormattedText text={msg.text} />
                      ) : (
                        msg.text
                      )}
                    </div>
                    {msg.sender === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white flex-shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                ))}

                {aiLoading && (
                  <div className="flex items-center space-x-2 text-slate-400 text-sm pl-2">
                    <Sparkles className="w-4 h-4 animate-spin text-indigo-600" />
                    <span>AlpineStay Concierge is typing...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="px-4 py-2 bg-white/80 backdrop-blur-md border-t border-slate-200 overflow-x-auto flex space-x-2 no-scrollbar shrink-0">
                {promptsList.map((prompt: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => handleSendAIChat(prompt.query)}
                    disabled={aiLoading}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-slate-100 text-indigo-700 hover:bg-indigo-50 border border-indigo-100/80 transition disabled:opacity-50 shrink-0 shadow-sm"
                  >
                    {prompt.label}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendAIChat();
                }}
                className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2 shrink-0"
              >
                <input
                  type="text"
                  placeholder={askPlaceholderText}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={aiLoading || !chatInput.trim()}
                  className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-6">
              <Settings />
            </div>
          )}
        </div>
      </div>
    </div>
  );
          }
