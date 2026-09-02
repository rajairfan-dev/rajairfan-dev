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
  CheckCircle, 
  Search, 
  Bell 
} from 'lucide-react';
import { supabase } from './supabaseClient';
import { askHotelAI, ChatMessage } from './aiAgent';
import Settings from './Settings';
import Login from './Login';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

// Custom Markdown Formatter Component to render raw markdown like **bold** & *italic* cleanly
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
  
  // Dashboard / Hotel Management States
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [guests, setGuests] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // AI Chat States
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Welcome to AlpineStay! I am your 24/7 digital concierge for Northern Italy (Lombardy, Dolomites, Veneto, Emilia-Romagna & Piedmont).\n\n• Wi-Fi: AlpineStay_Guest | Pass: alpine2026\n• Breakfast: 7:00 AM – 10:30 AM\n• Checkout: 11:00 AM\n\nHow may I assist your luxury stay today?"
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatRoom, setChatRoom] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    { id: 'wifi', label: '📶 Wi-Fi & Breakfast', query: 'What is the Wi-Fi password and breakfast timing?' },
    { id: 'lombardy', label: '🏎️ Lombardy & Modena', query: 'Suggest a luxury trip for Lombardy (Milan) and Emilia-Romagna (Ferrari/Modena).' },
    { id: 'dolomites', label: '🏔️ Dolomites Skiing', query: 'Recommend premier ski resorts and luxury chalets in the Dolomites.' },
    { id: 'barolo', label: '🍷 Barolo & Wine Tours', query: 'Recommend exclusive wine tasting tours in Piedmont and Veneto.' },
    { id: 'michelin', label: '🍝 Michelin Dining', query: 'What are the top Michelin-starred restaurants near Lake Garda?' }
  ];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthChecking(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session) {
      fetchGuests();
      fetchRequests();
    }
  }, [session]);

  useEffect(() => {
    if (activeTab === 'ai') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, aiLoading, activeTab]);

  async function fetchGuests() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) console.error('Error fetching guests:', error);
      else setGuests(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchRequests() {
    try {
      const { data, error } = await supabase
        .from('guest_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) console.error('Error fetching requests:', error);
      else setRequests(data || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAddGuest(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !room) return;

    try {
      const { error } = await supabase
        .from('guests')
        .insert([{ name, room_number: room }]);

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

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
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
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                activeTab === 'requests'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Bell className="w-5 h-5" />
              <span>Requests ({requests.filter(r => r.status === 'pending').length})</span>
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
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Active Guests</p>
                    <h3 className="text-2xl font-bold text-slate-800">{guests.length}</h3>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                    <Bell className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Pending Requests</p>
                    <h3 className="text-2xl font-bold text-amber-600">
                      {requests.filter(r => r.status === 'pending').length}
                    </h3>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">System Status</p>
                    <h3 className="text-xl font-bold text-emerald-600">Secured & Online</h3>
                  </div>
                </div>
              </div>

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
            <div className="p-6">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="font-bold text-slate-800">Checked-In Guests</h3>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search name or room..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
                      />
                    </div>
                    <button
                      onClick={fetchGuests}
                      disabled={loading}
                      className="text-xs text-indigo-600 hover:underline font-medium whitespace-nowrap disabled:opacity-50"
                    >
                      {loading ? 'Fetching...' : 'Refresh'}
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-4">Guest Name</th>
                        <th className="p-4">Room #</th>
                        <th className="p-4">Check-In Date</th>
                        <th className="p-4 text-right">Action</th>
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
                          <tr key={g.id} className="hover:bg-slate-50">
                            <td className="p-4 font-medium text-slate-800">{g.name}</td>
                            <td className="p-4">
                              <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-semibold text-xs rounded-full">
                                Room {g.room_number}
                              </span>
                            </td>
                            <td className="p-4 text-xs text-slate-400">
                              {new Date(g.created_at).toLocaleDateString()}
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => handleCheckOutGuest(g.id)}
                                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-semibold transition"
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
            <div className="p-6">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800">Guest Service Requests</h3>
                  <button onClick={fetchRequests} className="text-xs text-indigo-600 hover:underline">
                    Refresh
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-4">Room #</th>
                        <th className="p-4">Request</th>
                        <th className="p-4">Time</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Action</th>
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
                          <tr key={req.id} className="hover:bg-slate-50">
                            <td className="p-4 font-semibold text-slate-800">Room {req.room_number}</td>
                            <td className="p-4">{req.request_text}</td>
                            <td className="p-4 text-xs text-slate-400">
                              {new Date(req.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  req.status === 'completed'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-amber-50 text-amber-700'
                                }`}
                              >
                                {req.status}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              {req.status === 'pending' ? (
                                <button
                                  onClick={() => handleUpdateReqStatus(req.id, 'completed')}
                                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold transition"
                                >
                                  Mark Completed
                                </button>
                              ) : (
                                <span className="text-xs text-slate-400">Done</span>
                              )}
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
                    placeholder="Guest"
                    value={chatRoom}
                    onChange={(e) => setChatRoom(e.target.value)}
                    className="w-16 px-2 py-1 text-xs rounded bg-indigo-700 text-white placeholder-indigo-300 focus:outline-none"
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
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt.id}
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
                  className="flex-1 px-4 py-2.5 text-sm bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
                <button
                  type="submit"
                  disabled={aiLoading || !chatInput.trim()}
                  className="p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 transition"
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
