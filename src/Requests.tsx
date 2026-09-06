import React from 'react';

export default function Requests({ requests = [] }: { requests?: any[] }) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Guest Service Requests</h2>

        {/* Outer Wrapper with overflow-x-auto to prevent mobile cut-off */}
        <div className="w-full overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full min-w-[650px] text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-3 px-4">Request</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {requests.length > 0 ? (
                requests.map((req, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-medium text-slate-800">{req.request || req.text}</td>
                    <td className="py-3.5 px-4 text-slate-500 text-xs whitespace-nowrap">{req.time}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 capitalize">
                        {req.status || 'Pending'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition">
                        Done
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-400 text-xs">No pending requests</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
