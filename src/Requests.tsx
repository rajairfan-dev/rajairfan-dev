import React from 'react';
import { RefreshCw, CheckCircle, Clock, Trash2 } from 'lucide-react';

interface RequestsProps {
  requests: any[];
  fetchRequests: () => void;
  refreshingRequests: boolean;
  handleUpdateReqStatus: (id: string, newStatus: string) => void;
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
    <div className="p-4 sm:p-6 space-y-6 w-full max-w-full min-w-0 overflow-x-hidden">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{t?.requestsTitle || 'Guest Service Requests'}</h2>
          <p className="text-xs text-slate-500 mt-1">{t?.requestsSub || 'Real-time housekeeping and concierge service requests'}</p>
        </div>

        <button
          onClick={fetchRequests}
          title="Refresh Requests"
          className="p-2 border border-slate-300 rounded-lg bg-white text-slate-600 hover:bg-slate-50 transition"
        >
          <RefreshCw className={`w-4 h-4 ${refreshingRequests ? 'animate-spin text-indigo-600' : ''}`} />
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden w-full max-w-full">
        <div className="overflow-x-auto w-full max-w-full">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">{t?.roomNumber || 'Room'}</th>
                <th className="py-3.5 px-4">{t?.requestDetails || 'Request Details'}</th>
                <th className="py-3.5 px-4">{t?.status || 'Status'}</th>
                <th className="py-3.5 px-4">{t?.time || 'Received'}</th>
                <th className="py-3.5 px-4 text-right">{t?.actions || 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                    No active service requests right now.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-md">
                        #{req.room_number}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 font-medium max-w-xs truncate">
                      {req.request_text}
                    </td>
                    <td className="py-3.5 px-4">
                      {req.status === 'completed' ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-full text-[11px]">
                          <CheckCircle className="w-3 h-3" />
                          <span>Completed</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-50 text-amber-700 font-bold rounded-full text-[11px]">
                          <Clock className="w-3 h-3" />
                          <span>Pending</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(req.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {req.status !== 'completed' && (
                          <button
                            onClick={() => handleUpdateReqStatus(req.id, 'completed')}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition"
                          >
                            Mark Complete
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteRequest(req.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition rounded-lg hover:bg-slate-100"
                        >
                          <Trash2 className="w-4 h-4" />
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
