import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, Users, KeyRound, Boxes, MessageSquare, 
  CreditCard, Globe, Menu, X, Building2, Sparkles, Plus, Trash2 
} from 'lucide-react';
import { supabase } from './supabaseClient';

type ViewKey = 'dashboard' | 'guests' | 'checkin' | 'inventory' | 'messaging' | 'billing';

interface Guest {
  id: number;
  name: string;
  room_number: string;
  status: string;
  created_at?: string;
}

export default function App() {
  const [view, setView] = useState<ViewKey>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPortal, setIsPortal] = useState(false);

  // Supabase Database States
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [guestName, setGuestName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch Live Data from Supabase
  useEffect(() => {
    fetchGuests();
  }, []);

  async function fetchGuests() {
    setLoading(true);
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .order('id', { ascending: false });

    if (!error && data) {
      setGuests(data);
    }
    setLoading(false);
  }

  // Save new check-in directly to Supabase Database
  async function handleCheckIn(e: React.FormEvent) {
    e.preventDefault();
    if (!guestName || !roomNumber) return;

    setSubmitting(true);
    const { error } = await supabase.from('guests').insert([
      { name: guestName, room_number: roomNumber, status: 'Checked In' }
    ]);

    setSubmitting(false);

    if (!error) {
      setGuestName('');
      setRoomNumber('');
      await fetchGuests();
      setView('guests'); // Redirect to Guest directory
    } else {
      alert('Error saving to database: ' + error.message);
    }
  }

  // Delete guest from Supabase Database
  async function handleDeleteGuest(id: number) {
    const { error } = await supabase.from('guests').delete().eq('id', id);
    if (!error) {
      fetchGuests();
    }
  }

  if (isPortal) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center">
          <Building2 className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Guest Self-Portal</h1>
          <p className="text-slate-600 mb-6">Welcome to AlpineStay! Access your digital room key and hotel services.</p>
          <button 
            onClick={() => setIsPortal(false)}
            className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition"
          >
            Exit Portal Preview
          </button>
        </div>
      </div>
    );
  }

  const navigation = [
    { name: 'Dashboard', key: 'dashboard' as ViewKey, icon: LayoutDashboard },
    { name: 'Guests', key: 'guests' as ViewKey, icon: Users },
    { name: 'Check-In', key: 'checkin' as ViewKey, icon: KeyRound },
    { name: 'Inventory', key: 'inventory' as ViewKey, icon: Boxes },
    { name: 'Messaging', key: 'messaging' as ViewKey, icon: MessageSquare },
    { name: 'Billing', key: 'billing' as ViewKey, icon: CreditCard },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Building2 className="w-7 h-7 text-indigo-400" />
            <span className="text-lg font-bold tracking-wide">AlpineStay</span>
          </div>
          <button className="lg:hidden text-slate-400" onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = view === item.key;
            return (
              <button
                key={item.key}
                onClick={() => { setView(item.key); setSidebarOpen(false); }}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl font-medium text-sm transition ${active ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </button>
            );
          })}

          <div className="pt-4 border-t border-slate-800 mt-4">
            <button onClick={() => setIsPortal(true)} className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl font-medium text-sm text-indigo-400 hover:bg-slate-800 transition">
              <Globe className="w-5 h-5" />
              <span>Preview Guest Portal</span>
            </button>
          </div>
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100">
            <Menu className="w-6 h-6" />
          </button>

          <h2 className="text-xl font-semibold text-slate-800 capitalize">{view}</h2>

          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
              ● LIVE DB ACTIVE
            </span>
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm">
              MI
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {view === 'dashboard' && (
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl text-white shadow-lg flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold mb-1">Welcome back, Irfan!</h3>
                  <p className="text-indigo-100">AlpineStay SaaS is live and connected to Supabase Database.</p>
                </div>
                <Sparkles className="w-8 h-8 text-indigo-300" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-slate-500 text-sm font-medium">Occupancy Status</span>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{guests.length > 0 ? '85%' : '0%'}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-slate-500 text-sm font-medium">Live Checked-In Guests</span>
                  <p className="text-2xl font-bold text-indigo-600 mt-1">{guests.length}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-slate-500 text-sm font-medium">System Health</span>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">100% Online</p>
                </div>
              </div>
            </div>
          )}

          {view === 'guests' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800">Live Guest Directory (Supabase)</h3>
                <button onClick={fetchGuests} className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-slate-600">
                  Refresh List
                </button>
              </div>

              {loading ? (
                <p className="text-slate-500 py-4">Connecting to Database...</p>
              ) : guests.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-500 mb-2">No guests recorded in Supabase database yet.</p>
                  <button onClick={() => setView('checkin')} className="text-indigo-600 font-semibold text-sm hover:underline">
                    + Add First Check-In
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {guests.map((g) => (
                    <div key={g.id} className="py-3.5 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-slate-800">{g.name}</p>
                        <p className="text-sm text-slate-500">Room Number: <span className="font-medium text-slate-700">{g.room_number}</span></p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                          {g.status}
                        </span>
                        <button onClick={() => handleDeleteGuest(g.id)} className="text-slate-400 hover:text-red-500 transition p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {view === 'checkin' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-lg">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Express Check-In Desk</h3>
              <form onSubmit={handleCheckIn} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Guest Full Name</label>
                  <input 
                    type="text" 
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                    placeholder="e.g. Ahmad Raza" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Room Number</label>
                  <input 
                    type="text" 
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    required
                    placeholder="e.g. 204" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>{submitting ? 'Saving to Database...' : 'Complete Check-In'}</span>
                </button>
              </form>
            </div>
          )}

          {view === 'inventory' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Inventory Management</h3>
              <p className="text-slate-500">Live room amenities and stock tracking system ready.</p>
            </div>
          )}

          {view === 'messaging' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Guest Chat Inbox</h3>
              <p className="text-slate-500">Guest communication channel ready for real-time messaging.</p>
            </div>
          )}

          {view === 'billing' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-2">SaaS Subscription & Billing</h3>
              <p className="text-slate-600 mb-4">Active Plan: <span className="font-bold text-indigo-600">Enterprise SaaS Tier</span></p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
    }
