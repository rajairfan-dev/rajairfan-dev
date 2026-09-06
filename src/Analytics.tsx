import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { TrendingUp, Users, DollarSign, Bed, Calendar } from 'lucide-react';

interface AnalyticsProps {
  currentLanguage?: string;
}

export const Analytics: React.FC<AnalyticsProps> = ({ currentLanguage = 'en' }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    occupancyRate: 0,
    totalGuests: 0,
    monthlyRevenue: 0,
    activeBookings: 0
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const { data: guests, error } = await supabase.from('guests').select('*');
      
      if (error) throw error;

      const total = guests?.length || 0;
      setStats({
        occupancyRate: total > 0 ? Math.min(Math.round((total / 20) * 100), 100) : 0,
        totalGuests: total,
        monthlyRevenue: total * 120, // Sample dynamic calculation
        activeBookings: total
      });
    } catch (err) {
      console.error('Analytics Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Safe fallback to prevent white screen crash
  const safeStats = stats || {
    occupancyRate: 0,
    totalGuests: 0,
    monthlyRevenue: 0,
    activeBookings: 0
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading Analytics...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Analytics Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Occupancy Rate */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Bed className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Occupancy Rate</p>
            <h3 className="text-2xl font-bold text-gray-800">{safeStats.occupancyRate}%</h3>
          </div>
        </div>

        {/* Total Guests */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Guests</p>
            <h3 className="text-2xl font-bold text-gray-800">{safeStats.totalGuests}</h3>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Est. Revenue</p>
            <h3 className="text-2xl font-bold text-gray-800">${safeStats.monthlyRevenue}</h3>
          </div>
        </div>

        {/* Active Bookings */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Active Bookings</p>
            <h3 className="text-2xl font-bold text-gray-800">{safeStats.activeBookings}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
