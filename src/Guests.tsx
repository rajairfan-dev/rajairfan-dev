import React from 'react';
import { Search, RotateCw, QrCode, LogOut } from 'lucide-react';

interface GuestsProps {
  filteredGuests: any[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  fetchGuests: () => void;
  loadingGuests: boolean;
  setSelectedQRRoom: (room: string) => void;
  handleCheckOutGuest: (id: string) => void;
  t: any;
}

export default function Guests({
  filteredGuests,
  searchQuery,
  setSearchQuery,
  fetchGuests,
  loadingGuests,
  setSelectedQRRoom,
  handleCheckOutGuest,
  t,
}: GuestsProps) {
  return (
    <div className="p-3 sm:p-6 w-full max-w-full overflow-hidden">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm w-full overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-slate-800 text-base">{t?.activeGuests || 'Active Guests'}</h3>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={t?.searchPlaceholder || 'Search name, surname or room...'}
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
              <span>{t?.refresh || 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Clean Responsive Horizontal Scroll */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm text-slate-600 border-collapse">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 whitespace-nowrap">
              <tr>
                <th className="p-3.5 pl-4">Guest Name</th>
                <th className="p-3.5">Contact</th>
                <th className="p-3.5">Room #</th>
                <th className="p-3.5">Check-In / Out</th>
                <th className="p-3.5">Document</th>
                <th className="p-3.5 text-right pr-4">{t?.actions || 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400">
                    {t?.noGuests || 'No active guests registered yet.'}
                  </td>
                </tr>
              ) : (
                filteredGuests.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 pl-4 font-bold text-slate-800 whitespace-nowrap">{g.name}</td>
                    <td className="p-3.5 text-xs text-slate-500 whitespace-nowrap">
                      <div>{g.email || '-'}</div>
                      <div className="text-[11px] text-slate-400">{g.phone || '-'}</div>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-full border border-indigo-200/50">
                        Room {g.room_number}
                      </span>
                    </td>
                    <td className="p-3.5 text-xs text-slate-500 whitespace-nowrap">
                      {g.check_in_date || new Date(g.created_at).toLocaleDateString()} {g.check_out_date ? `→ ${g.check_out_date}` : ''}
                    </td>
                    <td className="p-3.5 text-xs whitespace-nowrap">
                      {g.passport_url ? (
                        <a href={g.passport_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-semibold hover:underline">
                          View Passport
                        </a>
                      ) : (
                        <span className="text-slate-400">N/A</span>
                      )}
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
  );
}
