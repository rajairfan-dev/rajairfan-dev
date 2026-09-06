import React from 'react';
import { Search, RotateCw, QrCode, LogOut, Globe } from 'lucide-react';

interface Guest {
  id: string;
  name: string;
  surname?: string;
  email?: string;
  phone?: string;
  room_number: string | number;
  check_in_date?: string;
  check_out_date?: string;
  language?: string;
  passport_url?: string;
  created_at: string;
}

interface GuestsProps {
  filteredGuests: Guest[];
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
    <div className="p-4 sm:p-6 space-y-5 max-w-full overflow-hidden">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">{t?.guestRecords || 'Guest Records'}</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {t?.guestRecordsSub || 'Manage current checked-in guests and access room QR codes'}
        </p>
      </div>

      <div className="flex items-center gap-2 w-full">
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t?.searchPlaceholder || 'Search by name or room...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>
        <button
          type="button"
          onClick={fetchGuests}
          disabled={loadingGuests}
          className="shrink-0 p-3 min-w-[44px] min-h-[44px] flex items-center justify-center bg-white border border-slate-200 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition shadow-sm text-slate-600 disabled:opacity-50 touch-manipulation cursor-pointer"
          title="Refresh Guests"
        >
          <RotateCw className={`w-4 h-4 ${loadingGuests ? 'animate-spin text-indigo-600' : ''}`} />
        </button>
      </div>

      {filteredGuests.length === 0 ? (
        <div className="p-8 text-center text-slate-500 text-sm font-medium bg-white rounded-2xl border border-slate-200 shadow-sm">
          No active guest records found.
        </div>
      ) : (
        <>
          {/* Mobile Card Layout */}
          <div className="space-y-3 md:hidden">
            {filteredGuests.map((guest) => (
              <div key={guest.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{guest.name}</h3>
                    <p className="text-xs text-slate-400">{guest.email || 'No contact provided'}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-extrabold">
                    #{guest.room_number}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-3 text-slate-500">
                  <div className="flex items-center space-x-1">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span>{guest.language || 'English'}</span>
                  </div>
                  {guest.check_in_date && (
                    <div>
                      <span>{guest.check_in_date}</span>
                      <span className="text-slate-400"> → {guest.check_out_date || 'N/A'}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedQRRoom(guest.room_number.toString())}
                    className="flex-1 flex items-center justify-center space-x-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>QR Code</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCheckOutGuest(guest.id)}
                    className="flex-1 flex items-center justify-center space-x-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-lg transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Check Out</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] uppercase tracking-wider font-bold text-slate-400">
                  <th className="py-3.5 px-4">{t?.guestName || 'Guest Name'}</th>
                  <th className="py-3.5 px-4">{t?.roomNumber || 'Room'}</th>
                  <th className="py-3.5 px-4">{t?.checkInOut || 'Check-In / Out'}</th>
                  <th className="py-3.5 px-4">{t?.preferredLang || 'Language'}</th>
                  <th className="py-3.5 px-4 text-right">{t?.actions || 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-4 font-semibold text-slate-900">
                      <div>{guest.name}</div>
                      <div className="text-xs font-normal text-slate-400">
                        {guest.email || 'No contact provided'}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-extrabold">
                        #{guest.room_number}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-500">
                      {guest.check_in_date ? (
                        <div>
                          <div>{guest.check_in_date}</div>
                          <div className="text-[11px] text-slate-400">To: {guest.check_out_date || 'N/A'}</div>
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-4 px-4 text-xs font-medium text-slate-600">
                      <div className="flex items-center space-x-1">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        <span>{guest.language || 'English'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setSelectedQRRoom(guest.room_number.toString())}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>QR</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCheckOutGuest(guest.id)}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-lg transition"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Check Out</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
                  }
