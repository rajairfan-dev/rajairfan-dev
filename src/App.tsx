import React, { useState, useEffect, useRef } from 'react';
import { askHotelAI } from './aiAgent';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Welcome to AlpineStay! I am your 24/7 digital concierge for Northern Italy (Lombardy, Dolomites, Veneto, Emilia-Romagna & Piedmont).\n\n• Wi-Fi: AlpineStay_Guest | Pass: alpine2026\n• Breakfast: 7:00 AM – 10:30 AM\n• Checkout: 11:00 AM\n\nHow may I assist your luxury stay today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    { label: '📶 Wi-Fi & Breakfast', query: 'What is the Wi-Fi password and breakfast timing?' },
    { label: '🏎️ Lombardy & Modena', query: 'Suggest a luxury trip for Lombardy (Milan) and Emilia-Romagna (Ferrari/Modena).' },
    { label: '🏔️ Dolomites Skiing', query: 'Recommend premier ski resorts and luxury chalets in the Dolomites.' },
    { label: '🍷 Barolo & Wine Tours', query: 'Recommend exclusive wine tasting tours in Piedmont and Veneto.' },
    { label: '🍝 Michelin Dining', query: 'What are the top Michelin-starred restaurants near Lake Garda?' }
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const aiResponse = await askHotelAI(query, roomNumber);
      const aiMsg: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: aiResponse };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: "Sorry, I encountered an issue connection. Please try again." };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 font-sans">
      <header className="bg-indigo-600 text-white p-4 shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="w-6 h-6" />
          <h1 className="text-xl font-bold tracking-wide">AlpineStay AI Concierge</h1>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium text-indigo-200">Room</span>
          <input
            type="text"
            placeholder="#"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            className="w-16 px-2 py-1 text-sm rounded bg-indigo-700 text-white placeholder-indigo-300 focus:outline-none focus:ring-1 focus:ring-white"
          />
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
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white flex-shrink-0">
                <Bot className="w-5 h-5" />
              </div>
            )}
            <div
              className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-white text-slate-800 shadow-sm border border-slate-200 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white flex-shrink-0">
                <User className="w-5 h-5" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-slate-400 text-sm">
            <Sparkles className="w-4 h-4 animate-spin text-indigo-600" />
            <span>AlpineStay Concierge is thinking...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 overflow-x-auto flex space-x-2 no-scrollbar">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt.query)}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-medium rounded-full bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 active:bg-indigo-100 whitespace-nowrap shadow-sm transition"
          >
            {prompt.label}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
      >
        <input
          type="text"
          placeholder="Ask Wi-Fi pass, luxury tours, Michelin dining..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2.5 text-sm bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
              }
