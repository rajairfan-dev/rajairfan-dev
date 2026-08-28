import { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  KeyRound, 
  Boxes, 
  MessageSquare, 
  CreditCard, 
  Globe, 
  Menu, 
  X,
  Building2,
  Sparkles
} from 'lucide-react';

type ViewKey = 'dashboard' | 'guests' | 'checkin' | 'inventory' | 'messaging' | 'billing';

export default function App() {
  const [view, setView] = useState<ViewKey>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPortal, setIsPortal] = useState(false);

  if (isPortal) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center">
          <Building2 className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Guest Portal</h1>
          <p className="text-slate-600 mb-6">Welcome to AlpineStay! Your check-in details and room keys are ready.</p>
          <button 
            onClick={() => setIsPortal(false)}
            className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition"
          >
            Back to App
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
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
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
                onClick={() => {
                  setView(item.key);
                  setSidebarOpen(false);
                }}
                className={`
                  flex items-center space-x-3 w-full px-4 py-3 rounded-xl font-medium text-sm transition
                  ${active ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </button>
            );
          })}

          <div className="pt-4 border-t border-slate-800 mt-4">
            <button
              onClick={() => setIsPortal(true)}
              className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl font-medium text-sm text-indigo-400 hover:bg-slate-800 transition"
            >
              <Globe className="w-5 h-5" />
              <span>Preview Guest Portal</span>
            </button>
          </div>
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <Menu className="w-6 h-6" />
          </button>

          <h2 className="text-xl font-semibold text-slate-800 capitalize">{view}</h2>

          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100">
              PRO MANAGER
            </span>
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm">
              MI
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {view === 'dashboard' && (
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl text-white shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">Welcome back, Irfan!</h3>
                    <p className="text-indigo-100">Here's your property overview for today.</p>
                  </div>
                  <Sparkles className="w-8 h-8 text-indigo-300" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-slate-500 text-sm font-medium">Occupancy</span>
                  <p className="text-2xl font-bold text-slate-800 mt-1">84%</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-slate-500 text-sm font-medium">Active Bookings</span>
                  <p className="text-2xl font-bold text-slate-800 mt-1">12</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-slate-500 text-sm font-medium">Pending Check-ins</span>
                  <p className="text-2xl font-bold text-slate-800 mt-1">3</p>
                </div>
              </div>
            </div>
          )}

          {view === 'guests' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Guest Directory</h3>
              <p className="text-slate-600">No recent guest issues reported today.</p>
            </div>
          )}

          {view === 'checkin' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Express Check-In Desk</h3>
              <p className="text-slate-600">All guest registrations are synchronized.</p>
            </div>
          )}

          {view === 'inventory' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Property Inventory</h3>
              <p className="text-slate-600">Supplies & maintenance stock tracking active.</p>
            </div>
          )}

          {view === 'messaging' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Guest Messages</h3>
              <p className="text-slate-600">Inbound chat channels are online.</p>
            </div>
          )}

          {view === 'billing' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Billing & Subscriptions</h3>
              <p className="text-slate-600">Manage invoices, payments, and plan tier settings.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
                    }
