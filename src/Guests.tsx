import React from 'react';
import { Search, RefreshCw, QrCode, LogOut } from 'lucide-react';

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
  t
}: GuestsProps) {
  return (
    <div className="p-4 sm:p-6 space-y-6 w-full max-w-full min-w-0 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{t?.guestsListTitle || 'Guest Records'}</h2>
          <p className="text-xs text-slate-500 mt-1">{t?.guestsListSub || 'Manage current checked-in guests and access room QR codes'}</p>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t?.searchPlaceholder || "Search by name or room..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <button
            onClick={fetchGuests}
            title="Refresh Guests"
            className="p-2 border border-slate-300 rounded-lg bg-white text-slate-600 hover:bg-slate-50 transition shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${loadingGuests ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden w-full max-w-full">
        <div className="overflow-x-auto w-full max-w-full">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">{t?.guestName || 'Guest'}</th>
                <th className="py-3.5 px-4">{t?.roomNumber || 'Room'}</th>
                <th className="py-3.5 px-4">{t?.dates || 'Check-In / Out'}</th>
                <th className="py-3.5 px-4">{t?.preferredLang || 'Language'}</th>
                <th className="py-3.5 px-4 text-right">{t?.actions || 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                    {loadingGuests ? 'Loading guests...' : 'No guest records found.'}
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-semibold text-slate-800">{guest.name}</p>
                        <p className="text-[11px] text-slate-400">{guest.email || guest.phone || 'No contact provided'}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-md">
                        #{guest.room_number}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div>
                        <p>{guest.check_in_date || '-'}</p>
                        <p className="text-[11px] text-slate-400">{guest.check_out_date ? `To: ${guest.check_out_date}` : ''}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {guest.language || 'English'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setSelectedQRRoom(guest.room_number.toString())}
                          className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 font-semibold rounded-lg transition border border-slate-200"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>QR</span>
                        </button>
                        <button
                          onClick={() => handleCheckOutGuest(guest.id)}
                          className="flex items-center space-x-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold rounded-lg transition border border-rose-100"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Check Out</span>
                        </button>
                      </div>
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
