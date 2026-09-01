import React from 'react';
import { TrendingUp } from 'lucide-react';

interface AnalyticsProps {
  guestsCount: number;
  totalRooms?: number;
  requests: any[];
}

export default function Analytics({ guestsCount, totalRooms = 50, requests }: AnalyticsProps) {
  const occupancyRate = Math.min(Math.round((guestsCount / totalRooms) * 100), 100);
  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const completedCount = requests.filter(r => r.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Occupancy Rate</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{occupancyRate}%</h3>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${occupancyRate}%` }} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Active Guests</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{guestsCount}</h3>
          <p className="text-xs text-slate-400 mt-1">Checked-in</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Pending Requests</p>
          <h3 className="text-2xl font-bold text-amber-600 mt-1">{pendingCount}</h3>
          <p className="text-xs text-amber-600 font-medium mt-1">Action required</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Resolution Efficiency</p>
          <h3 className="text-2xl font-bold text-emerald-600 mt-1">
            {requests.length ? Math.round((completedCount / requests.length) * 100) : 100}%
          </h3>
          <p className="text-xs text-emerald-600 font-medium mt-1">Requests done</p>
        </div>
      </div>

      {/* Analytics Visual Distribution */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <span>Live Service Demand Distribution</span>
          </h3>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
              <span>Housekeeping & Amenities</span>
              <span>65%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: '65%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
              <span>Dining & Room Service</span>
              <span>20%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '20%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
              <span>Concierge, Ski & Tours</span>
              <span>15%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '15%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
    }
