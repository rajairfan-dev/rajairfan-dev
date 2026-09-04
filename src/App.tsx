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
  QrCode, 
  Printer,
  Download,
  RotateCw,
  Trash2,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { supabase } from './supabaseClient';
import { askHotelAI, ChatMessage } from './aiAgent';
import Settings from './Settings';
import Login from './Login';
import Analytics from './Analytics';

interface Guest {
  id: string;
  name: string;
  room_number: string | number;
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
  
  // Dashboard / Hotel Management States
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [guests, setGuests] = useState<Guest[]>([]);
  const [requests, setRequests] = useState<GuestRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingGuests, setLoadingGuests] = useState(false);
  const [refreshingRequests, setRefreshingRequests] = useState(false);

  // Modal QR State
  const [selectedQRRoom, setSelectedQRRoom] = useState<string | null>(null);

  // AI Chat States
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Welcome to AlpineStay! I am your 24/7 digital concierge for Northern Italy.\n\n• Wi-Fi: AlpineStay_Guest | Pass: alpine2026\n• Breakfast: 7:00 AM – 10:30 AM\n• Checkout: 11:00 AM\n\nHow may I assist your luxury stay today?"
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatRoom, setChatRoom] = useState('101');
  const [aiLoading, setAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    { label: '🧹 Need Extra Towels', query: 'Please send 2 extra towels to my room.' },
    { label: '💧 Water Bottles', query: 'Can housekeeping bring extra bottled water?' },
    { label: '🏎️ Lombardy & Modena', query: 'Suggest a luxury trip for Lombardy (Milan) and Emilia-Romagna (Ferrari/Modena).' },
    { label: '🏔️ Dolomites Skiing', query: 'Recommend premier ski resorts and luxury chalets in the Dolomites.' },
    { label: '🍝 Michelin Dining', query: 'What are the top Michelin-starred restaurants near Lake Garda?' }
  ];

  // Detect URL query room
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
    if (activeTab === 'ai') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, aiLoading, activeTab]);

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
    } fontally {
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
    } fontally {
      setRefreshingRequests(false);
    }
  }

  async function handleAddGuest(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !room.trim()) return;

    try {
      const { error } = await supabase
        .from('guests')
        .insert([{ name: name.trim(), room_number: room.trim() }]);

      if (error) {
        alert('Error adding guest: ' + error.message);
      } else {
        setName('');
        setRoom('');
        fetchGuests();
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
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
    if (!window.confirm('Is request ko delete karna chahte hain?')) return;
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

      const aiResponse = await askHotelAI(query, chatRoom, historyForAI);
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
      <div className="flex flex-col h-screen bg-slate-100 font-sans">
        <header className="bg-indigo-600 text-white px-5 py-3.5 flex justify-between items-center shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight">AlpineStay Concierge</h1>
              <p className="text-[11px] text-indigo-200">24/7 Room Service & AI Assistance</p>
            </div>
          </div>
          <div className="bg-indigo-800/80 px-3 py-1 rounded-full text-xs font-bold border border-indigo-400/30">
            Room #{chatRoom}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none whitespace-pre-wrap shadow'
                    : 'bg-white text-slate-800 shadow-sm border border-slate-200/80 rounded-bl-none'
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
              <span>AlpineStay Concierge is replying...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 overflow-x-auto flex space-x-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendAIChat(prompt.query)}
              disabled={aiLoading}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-white text-indigo-600 border border-indigo-200/80 hover:bg-indigo-50 active:bg-indigo-100 whitespace-nowrap shadow-sm transition disabled:opacity-50"
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
          className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2 shadow-lg"
        >
          <input
            type="text"
            placeholder="Ask Wi-Fi pass, towels, food..."
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
      g.room_number.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-qr-modal, #printable-qr-modal * {
            visibility: visible !important;
          }
          #printable-qr-modal {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: 100% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: white !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

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

            <p className="text-[11px] text-slate-400 font-mono break-all px-2">
              {`${window.location.origin}?room=${selectedQRRoom}`}
            </p>

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

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out flex flex-col justify-between ${
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
              <span>Dashboard</span>
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
              <span>Guests List</span>
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
                <span>Requests</span>
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
              <span>AI Concierge</span>
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
              <span>Settings</span>
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

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden text-slate-600 hover:text-slate-900"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-bold text-slate-800 capitalize">
            {activeTab === 'ai' ? 'AI Concierge View' : activeTab}
          </h2>
          <div className="w-6 h-6 lg:hidden" />
        </header>

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <div className="p-4 sm:p-6 space-y-6">
              <Analytics guestsCount={guests.length} requests={requests} />

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-800 mb-4">Quick Guest Check-In</h3>
                <form onSubmit={handleAddGuest} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Guest Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Room Number (e.g. 104)"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                  >
                    Register Guest
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'guests' && (
            <div className="p-4 sm:p-6">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="font-bold text-slate-800 text-base">Checked-In Guests</h3>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search name or room..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                      />
                    </div>
                    <button
                      onClick={fetchGuests}
                      disabled={loadingGuests}
                      className="px-3.5 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition flex items-center space-x-1.5 border border-indigo-200 active:scale-95 disabled:opacity-50 shrink-0"
                    >
                      <RotateCw className={`w-3.5 h-3.5 ${loadingGuests ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>

                <div className="block sm:hidden divide-y divide-slate-100">
                  {filteredGuests.length === 0 ? (
                    <p className="p-6 text-center text-xs text-slate-400">No matching guests found.</p>
                  ) : (
                    filteredGuests.map((g) => (
                      <div key={g.id} className="p-4 space-y-3 bg-white">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-900 text-sm">{g.name}</span>
                          <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-full border border-indigo-200/50">
                            Room {g.room_number}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400">
                          Check-in: {new Date(g.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center justify-end space-x-2 pt-1">
                          <button
                            onClick={() => setSelectedQRRoom(g.room_number.toString())}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-semibold border border-indigo-200/50"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>QR</span>
                          </button>
                          <button
                            onClick={() => handleCheckOutGuest(g.id)}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-xs font-semibold border border-rose-200/50"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Check Out</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3.5 pl-4">Guest Name</th>
                        <th className="p-3.5">Room #</th>
                        <th className="p-3.5">Check-In Date</th>
                        <th className="p-3.5 text-right pr-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredGuests.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-6 text-center text-slate-400">
                            {searchQuery ? 'No matching guests found.' : 'No active guests registered yet.'}
                          </td>
                        </tr>
                      ) : (
                        filteredGuests.map((g) => (
                          <tr key={g.id} className="hover:bg-slate-50 transition">
                            <td className="p-3.5 pl-4 font-bold text-slate-800">{g.name}</td>
                            <td className="p-3.5">
                              <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-full border border-indigo-200/50">
                                Room {g.room_number}
                              </span>
                            </td>
                            <td className="p-3.5 text-xs text-slate-400 whitespace-nowrap">
                              {new Date(g.created_at).toLocaleDateString()}
                            </td>
                            <td className="p-3.5 text-right pr-4 space-x-2 whitespace-nowrap">
                              <button
                                onClick={() => setSelectedQRRoom(g.room_number.toString())}
                                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition border border-indigo-200/50"
                              >
                                <QrCode className="w-3.5 h-3.5" />
                                <span>QR Code</span>
                              </button>
                              <button
                                onClick={() => handleCheckOutGuest(g.id)}
                                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-semibold transition border border-rose-200/50"
                              >
                                <LogOut className="w-3.5 h-3.5" />
                                <span>Check Out</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="p-4 sm:p-6">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">Guest Service Requests</h3>
                    <p className="text-xs text-slate-400">Manage pending and completed requests</p>
                  </div>
                  <button 
                    onClick={fetchRequests} 
                    disabled={refreshingRequests}
                    className="px-3.5 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition flex items-center space-x-1.5 border border-indigo-200 active:scale-95 disabled:opacity-50"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${refreshingRequests ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>

                <div className="block sm:hidden divide-y divide-slate-100">
                  {requests.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      No requests received yet.
                    </div>
                  ) : (
                    requests.map((req) => (
                      <div key={req.id} className="p-4 space-y-2 bg-white">
                        <div className="flex justify-between items-start">
                          <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-full border border-indigo-200/50">
                            Room {req.room_number}
                          </span>
                          <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(req.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-800 font-medium py-1">
                          {req.request_text}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              req.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                            }`}
                          >
                            {req.status}
                          </span>

                          <div className="flex items-center space-x-2">
                            {req.status === 'pending' ? (
                              <button
                                onClick={() => handleUpdateReqStatus(req.id, 'completed')}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center space-x-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Done</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUpdateReqStatus(req.id, 'pending')}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium transition"
                              >
                                Re-open
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteRequest(req.id)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition border border-rose-200/50"
                              title="Delete Request"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3.5 pl-4 w-28">Room #</th>
                        <th className="p-3.5">Request</th>
                        <th className="p-3.5 w-24">Time</th>
                        <th className="p-3.5 w-28">Status</th>
                        <th className="p-3.5 text-right pr-4 w-36">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {requests.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-slate-400">
                            No requests received yet.
                          </td>
                        </tr>
                      ) : (
                        requests.map((req) => (
                          <tr key={req.id} className="hover:bg-slate-50/80 transition">
                            <td className="p-3.5 pl-4 font-bold text-slate-800 whitespace-nowrap">
                              Room {req.room_number}
                            </td>
                            <td className="p-3.5 min-w-[200px] break-words">
                              {req.request_text}
                            </td>
                            <td className="p-3.5 text-xs text-slate-400 whitespace-nowrap">
                              {new Date(req.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="p-3.5 whitespace-nowrap">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                  req.status === 'completed'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                                }`}
                              >
                                {req.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-right pr-4 whitespace-nowrap space-x-2">
                              {req.status === 'pending' ? (
                                <button
                                  onClick={() => handleUpdateReqStatus(req.id, 'completed')}
                                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold shadow-sm transition"
                                >
                                  Done
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUpdateReqStatus(req.id, 'pending')}
                                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md text-xs font-medium transition"
                                >
                                  Re-open
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteRequest(req.id)}
                                className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-md transition border border-rose-200/50 inline-flex items-center align-middle"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="flex flex-col h-[calc(100vh-65px)] bg-slate-100">
              <div className="bg-indigo-600 text-white px-4 py-3 flex justify-between items-center shadow-sm">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5" />
                  <span className="font-bold text-sm">AlpineStay Guest AI Concierge</span>
                </div>
                <div className="flex items-center space-x-2">
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

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                      className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-none whitespace-pre-wrap'
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
                  <div className="flex items-center space-x-2 text-slate-400 text-sm">
                    <Sparkles className="w-4 h-4 animate-spin text-indigo-600" />
                    <span>AlpineStay Concierge is responding...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 overflow-x-auto flex space-x-2">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendAIChat(prompt.query)}
                    disabled={aiLoading}
                    className="px-3 py-1.5 text-xs font-medium rounded-full bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 active:bg-indigo-100 whitespace-nowrap shadow-sm transition disabled:opacity-50"
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
                className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
              >
                <input
                  type="text"
                  placeholder="Ask Wi-Fi pass, luxury tours, Michelin dining..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 px-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={aiLoading || !chatInput.trim()}
                  className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
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
