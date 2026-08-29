import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, KeyRound, Globe, Send, Bot } from 'lucide-react';
import { supabase } from './supabaseClient';
import { askHotelAI } from './aiAgent';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
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

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 font-bold text-xl tracking-wide flex items-center gap-2 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black">A</div>
          AlpineStay
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'guests', label: 'Guests', icon: Users },
            { id: 'checkin', label: 'Check-In', icon: KeyRound },
            { id: 'portal', label: 'AI Concierge Portal', icon: Globe },
          ].map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
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
      <main className="flex-1 overflow-y-auto p-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="grid grid-cols-3 gap-6">
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
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <h2 className="text-xl font-bold">Live Guest Directory</h2>
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
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 max-w-md space-y-4">
            <h2 className="text-xl font-bold">Guest Express Check-In</h2>
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
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 max-w-2xl h-[600px] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-indigo-600 text-white rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Bot size={24} />
                <span className="font-bold">AlpineStay AI Concierge</span>
              </div>
              <input 
                type="text" 
                placeholder="Your Room # (e.g. 204)" 
                value={chatRoom} 
                onChange={e => setChatRoom(e.target.value)}
                className="px-3 py-1 text-slate-900 text-sm rounded-lg border-none"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs md:max-w-md p-3 rounded-2xl text-sm ${m.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {aiLoading && <p className="text-xs text-slate-400 italic">AI Assistant is thinking...</p>}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
              <input 
                type="text" 
                placeholder="Ask Wi-Fi pass, breakfast time, or room info..." 
                value={chatInput} 
                onChange={e => setChatInput(e.target.value)} 
                className="flex-1 p-3 border rounded-xl text-sm focus:outline-none focus:border-indigo-600"
              />
              <button type="submit" className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
                <Send size={18} />
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
              }
