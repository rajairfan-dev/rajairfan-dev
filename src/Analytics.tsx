import React from 'react';

interface AnalyticsProps {
  guestsCount: number;
  requests: any[];
  t: Record<string, string>;
}

export default function Analytics({ guestsCount, requests, t }: AnalyticsProps) {
  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const completedCount = requests.filter(r => r.status === 'completed').length;
  const totalRequests = requests.length;
  const resolutionEfficiency = totalRequests > 0 ? Math.round((completedCount / totalRequests) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.occupancyRate}</p>
          <p className="text-2xl font-black text-slate-900 mt-1">2%</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.activeGuests}</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{guestsCount}</p>
          <span className="text-[11px] text-slate-400 font-medium">{t.checkedIn}</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.pendingRequests}</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</p>
          <span className="text-[11px] text-amber-500 font-medium">{t.actionRequired}</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.resolutionEfficiency}</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{resolutionEfficiency}%</p>
          <span className="text-[11px] text-emerald-600 font-medium">{t.requestsDone}</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h4 className="font-bold text-slate-800 text-sm mb-4">{t.liveDemandTitle}</h4>
        <div className="space-y-4 text-xs font-semibold">
          <div>
            <div className="flex justify-between mb-1.5 text-slate-700">
              <span>{t.housekeepingDemand}</span>
              <span className="font-bold">65%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1.5 text-slate-700">
              <span>{t.diningDemand}</span>
              <span className="font-bold">20%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '20%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1.5 text-slate-700">
              <span>{t.conciergeDemand}</span>
              <span className="font-bold">15%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-amber-500 h-2 rounded-full" style={{ width: '15%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
