import { useState } from 'react';
import { I18nProvider } from '@/i18n/I18nContext';
import { useRoute } from '@/lib/router';
import { Sidebar, type ViewKey } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { DashboardView } from '@/views/DashboardView';
import { GuestsView } from '@/views/GuestsView';
import { CheckInView } from '@/views/CheckInView';
import { InventoryView } from '@/views/InventoryView';
import { MessagingView } from '@/views/MessagingView';
import { GuestPortalView } from '@/views/GuestPortalView';
import { LandingView } from '@/views/LandingView';
import { BillingView } from '@/views/BillingView';

function AppContent() {
  const [route, navigate] = useRoute();
  const [view, setView] = useState<ViewKey>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (route.kind === 'portal' && route.guestId) {
    return (
      <I18nProvider>
        <GuestPortalView guestId={route.guestId} />
      </I18nProvider>
    );
  }

  if (route.kind === 'pricing') {
    return (
      <I18nProvider>
        <LandingView onEnterApp={() => navigate('/')} />
      </I18nProvider>
    );
  }

  if (route.kind === 'billing') {
    return (
      <I18nProvider>
        <BillingView onBackToApp={() => navigate('/')} />
      </I18nProvider>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        current={view}
        onNavigate={setView}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {view === 'dashboard' && <DashboardView />}
          {view === 'guests' && <GuestsView />}
          {view === 'checkin' && <CheckInView />}
          {view === 'inventory' && <InventoryView />}
          {view === 'messaging' && <MessagingView />}
          {view === 'billing' && <BillingView onBackToApp={() => navigate('/')} />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
