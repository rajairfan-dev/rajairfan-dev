import React from 'react';

export default function Guests({ guests = [] }: { guests?: any[] }) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Active Guests</h2>

        {/* Outer Wrapper with overflow-x-auto to prevent mobile cut-off */}
        <div className="w-full overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full min-w-[650px] text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-3 px-4">Guest</th>
                <th className="py-3 px-4">Room</th>
                <th className="py-3 px-4">Check-In / Out</th>
                <th className="py-3 px-4">Document</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {guests.length > 0 ? (
                guests.map((guest, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-slate-800">{guest.name || 'Guest'}</td>
                    <td className="py-3.5 px-4 text-indigo-600 font-bold">{guest.room || 'N/A'}</td>
                    <td className="py-3.5 px-4 text-slate-600">{guest.checkIn} → {guest.checkOut}</td>
                    <td className="py-3.5 px-4 text-indigo-600 font-semibold">{guest.document || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-400 text-xs">No active guests found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
