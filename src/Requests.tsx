import React from 'react';
import { RotateCw, Trash2 } from 'lucide-react';

interface RequestsProps {
  requests: any[];
  fetchRequests: () => void;
  refreshingRequests: boolean;
  handleUpdateReqStatus: (id: string, status: string) => void;
  handleDeleteRequest: (id: string) => void;
  t: any;
}

export default function Requests({
  requests,
  fetchRequests,
  refreshingRequests,
  handleUpdateReqStatus,
  handleDeleteRequest,
  t,
}: RequestsProps) {
  return (
    <div className="p-3 sm:p-6 w-full max-w-full overflow-hidden">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm w-full overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-800 text-base">{t?.guestRequests || 'Guest Service Requests'}</h3>
            <p className="text-xs text-slate-400">{t?.manageRequests || 'Manage pending and completed requests'}</p>
          </div>
          <button
            onClick={fetchRequests}
            disabled={refreshingRequests}
            className="px-3.5 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition flex items-center space-x-1.5 border border-indigo-200 active:scale-95 disabled:opacity-50 shrink-0"
          >
            <RotateCw className={`w-3.5 h-3.5 ${refreshingRequests ? 'animate-spin' : ''}`} />
            <span>{t?.refresh || 'Refresh'}</span>
          </button>
        </div>

        {/* Clean Responsive Horizontal Scroll */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm text-slate-600 border-collapse">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 whitespace-nowrap">
              <tr>
                <th className="p-3.5 pl-4 w-28">Room #</th>
                <th className="p-3.5">Request</th>
                <th className="p-3.5 w-28">Time</th>
                <th className="p-3.5 w-28">Status</th>
                <th className="p-3.5 text-right pr-4 w-36">{t?.actions || 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400">
                    No requests received yet.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5 pl-4 font-bold text-slate-800 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-full border border-indigo-200/50">
                        Room {req.room_number || 'N/A'}
                      </span>
                    </td>
                    <td className="p-3.5 min-w-[200px] text-slate-800 font-medium">{req.request_text}</td>
                    <td className="p-3.5 text-xs text-slate-400 whitespace-nowrap">
                      {new Date(req.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          req.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right pr-4 whitespace-nowrap space-x-2">
                      {req.status === 'pending' ? (
                        <button
                          onClick={() => handleUpdateReqStatus(req.id, 'completed')}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold shadow-sm transition"
                        >
                          {t?.done || 'Done'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateReqStatus(req.id, 'pending')}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md text-xs font-medium transition"
                        >
                          {t?.reopen || 'Re-open'}
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteRequest(req.id)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-md transition border border-rose-200/50 inline-flex items-center align-middle"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
