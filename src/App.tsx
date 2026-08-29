import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, KeyRound, Globe, Settings as SettingsIcon, Send, Bot, Menu, X } from 'lucide-react';
import { supabase } from './supabaseClient';
import { askHotelAI } from './aiAgent';
import Settings from './Settings';

export default function App() {
  const [activeTab, setActiveTab] = useState('portal');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // AI Chat States
  const [chatInput, setChatInput] = useState('');
  const [chatRoom, setChatRoom] = useState('');
  const [messages, setMessages] = useState<Array<{sender: 'user' | 'ai', text: string}>>([
    { sender: 'ai', text: 'Hello! I am your AlpineStay AI Assistant. How can I help you today?' }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    const { data } = await supabase.from('guests').select('*').order('created_at', { ascending: false });
    if (data) setGuests(data);
  };

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !room) return;
    setLoading(true);
    const { error } = await supabase.from('guests').insert([{ name, room_number: room, status: 'Checked In' }]);
    setLoading(false);
    if (!error) {
      setName('');
      setRoom('');
      fetchGuests();
      setActiveTab('guests');
      setIsSidebarOpen(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setAiLoading(true);

    const aiReply = await askHotelAI(userText, chatRoom);
    setMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
    setAiLoading(false);
  };

  // Helper function to render **bold** text nicely
  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center z-20">
        <div className="font-bold text-lg flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-sm">A</div>
          AlpineStay
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 rounded-lg bg-slate-800">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed md:static inset-y-0 left-0 w-64 bg-slate-900 text-white flex flex-col z-40 transform transition-transform duration-200 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="p-6 font-bold text-xl tracking-wide hidden md:flex items-center gap-2 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black">A</div>
          AlpineStay
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'guests', label: 'Guests', icon: Users },
            { id: 'checkin', label: 'Check-In', icon: KeyRound },
            { id: 'portal', label: 'AI Concierge Portal', icon: Globe },
            { id: 'settings', label: 'Settings & Languages', icon: SettingsIcon },
          ].map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h1 className="text-xl md:text-2xl font-bold">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-sm text-slate-500">Total Checked-In Guests</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-2">{guests.length}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-sm text-slate-500">System Status</p>
                <p className="text-3xl font-extrabold text-emerald-600 mt-2">Live & Active</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'guests' && (
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <h2 className="text-lg md:text-xl font-bold">Live Guest Directory</h2>
            {guests.map((g) => (
              <div key={g.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-bold text-slate-900">{g.name}</p>
                  <p className="text-sm text-slate-500">Room: {g.room_number}</p>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-semibold text-xs rounded-full">{g.status}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'checkin' && (
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 max-w-md space-y-4">
            <h2 className="text-lg md:text-xl font-bold">Guest Express Check-In</h2>
            <form onSubmit={handleCheckIn} className="space-y-4">
              <input type="text" placeholder="Guest Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border rounded-xl" required />
              <input type="text" placeholder="Room Number" value={room} onChange={e => setRoom(e.target.value)} className="w-full p-3 border rounded-xl" required />
              <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition">
                {loading ? 'Saving...' : 'Complete Check-In'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'portal' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 w-full max-w-2xl h-[calc(100vh-100px)] md:h-[600px] flex flex-col">
            <div className="p-3 md:p-4 border-b flex justify-between items-center bg-indigo-600 text-white rounded-t-2xl gap-2">
              <div className="flex items-center gap-2">
                <Bot size={20} />
                <span className="font-bold text-sm md:text-base">AlpineStay AI Concierge</span>
              </div>
              <input 
                type="text" 
                placeholder="Room #" 
                value={chatRoom} 
                onChange={e => setChatRoom(e.target.value)}
                className="w-20 md:w-32 px-2 py-1 text-slate-900 text-xs md:text-sm rounded-lg border-none focus:outline-none"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] md:max-w-md p-3.5 rounded-2xl text-xs md:text-sm whitespace-pre-wrap leading-relaxed ${m.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/60 shadow-sm'}`}>
                    {renderFormattedText(m.text)}
                  </div>
                </div>
              ))}
              {aiLoading && <p className="text-xs text-slate-400 italic">AI Assistant is thinking...</p>}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 md:p-4 border-t flex gap-2">
              <input 
                type="text" 
                placeholder="Ask Wi-Fi pass, breakfast time..." 
                value={chatInput} 
                onChange={e => setChatInput(e.target.value)} 
                className="flex-1 p-2 md:p-3 border rounded-xl text-xs md:text-sm focus:outline-none focus:border-indigo-600"
              />
              <button type="submit" className="p-2 md:p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
                <Send size={16} />
              </button>
            </form>
          </div>
        )}

        {activeTab === 'settings' && <Settings />}
      </main>
    </div>
  );
      }
