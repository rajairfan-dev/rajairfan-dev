import React from 'react';
import { RotateCw, CheckCircle, Trash2, Clock } from 'lucide-react';

interface GuestRequest {
  id: string;
  room_number: string | number;
  request_text: string;
  status: 'pending' | 'completed' | string;
  created_at: string;
}

interface RequestsProps {
  requests: GuestRequest[];
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
  t
}: RequestsProps) {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">{t?.guestRequests || 'Guest Service Requests'}</h2>
          <p className="text-xs text-slate-500 mt-1">
            {t?.guestRequestsSub || 'Real-time housekeeping and concierge service requests'}
          </p>
        </div>
        <button
          onClick={fetchRequests}
          disabled={refreshingRequests}
          className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-sm text-slate-600 disabled:opacity-50"
          title="Refresh Requests"
        >
          <RotateCw className={`w-4 h-4 ${refreshingRequests ? 'animate-spin text-indigo-600' : ''}`} />
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {requests.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm font-medium">
            No active service requests right now.
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] uppercase tracking-wider font-bold text-slate-400">
                  <th className="py-3.5 px-4">{t?.roomNumber || 'Room'}</th>
                  <th className="py-3.5 px-4">{t?.requestDetails || 'Request Details'}</th>
                  <th className="py-3.5 px-4">{t?.status || 'Status'}</th>
                  <th className="py-3.5 px-4">{t?.received || 'Received'}</th>
                  <th className="py-3.5 px-4 text-right">{t?.actions || 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-4 font-bold text-slate-900">
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-extrabold">
                        #{req.room_number}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-800 max-w-xs break-words">
                      {req.request_text}
                    </td>
                    <td className="py-4 px-4">
                      {req.status === 'completed' ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">
                          <CheckCircle className="w-3 h-3" />
                          <span>Completed</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600">
                          <Clock className="w-3 h-3" />
                          <span>Pending</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-400 whitespace-nowrap">
                      {new Date(req.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-2">
                        {req.status !== 'completed' && (
                          <button
                            onClick={() => handleUpdateReqStatus(req.id, 'completed')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition shadow-sm"
                          >
                            Mark Complete
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteRequest(req.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-100 rounded-lg transition"
                          title="Delete Request"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
