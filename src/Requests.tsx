import React, { useState } from 'react';
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
  fetchRequests: () => Promise<void> | void;
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
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await fetchRequests();
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500); // Keeps rotation visible smoothly
    }
  };

  const isLoading = refreshingRequests || isRefreshing;

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-full overflow-hidden">
      <div className="flex items-center justify-between gap-3 w-full">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-extrabold text-slate-900 truncate">{t?.guestRequests || 'Guest Service Requests'}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t?.guestRequestsSub || 'Real-time housekeeping and concierge service requests'}
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isLoading}
          className="shrink-0 p-3 min-w-[44px] min-h-[44px] flex items-center justify-center bg-white border border-slate-200 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition shadow-sm text-slate-600 disabled:opacity-50 touch-manipulation cursor-pointer select-none"
          title="Refresh Requests"
        >
          <RotateCw className={`w-4 h-4 transition-transform ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="p-8 text-center text-slate-500 text-sm font-medium bg-white rounded-2xl border border-slate-200 shadow-sm">
          No active service requests right now.
        </div>
      ) : (
        <>
          {/* Mobile Card Layout */}
          <div className="space-y-3 md:hidden">
            {requests.map((req) => (
              <div key={req.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-extrabold">
                    #{req.room_number}
                  </span>
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
                </div>

                <p className="text-sm font-semibold text-slate-800 border-l-2 border-indigo-500 pl-2">
                  {req.request_text}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">
                    {new Date(req.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div className="flex items-center space-x-2">
                    {req.status !== 'completed' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateReqStatus(req.id, 'completed')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition shadow-sm"
                      >
                        Mark Complete
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteRequest(req.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-100 rounded-lg transition"
                      title="Delete Request"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
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
                    <td className="py-4 px-4 font-medium text-slate-800">
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
                            type="button"
                            onClick={() => handleUpdateReqStatus(req.id, 'completed')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition shadow-sm"
                          >
                            Mark Complete
                          </button>
                        )}
                        <button
                          type="button"
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
        </>
      )}
    </div>
  );
                    }
