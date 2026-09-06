import React, { useState } from 'react';
import { supabase } from './supabaseClient';

export const QuickCheckIn: React.FC = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    room_number: '',
    check_in: '',
    check_out: '',
    language: 'en'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Direct payload sending
      const { error } = await supabase.from('guests').insert([
        {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          room_number: formData.room_number,
          language: formData.language,
          // Support for both naming conventions in database
          created_at: new Date().toISOString()
        }
      ]);

      if (error) throw error;
      alert('Guest Registered Successfully!');
      setFormData({
        first_name: '', last_name: '', email: '', phone: '',
        room_number: '', check_in: '', check_out: '', language: 'en'
      });
    } catch (err: any) {
      alert('Error adding guest: ' + (err.message || 'Check database schema'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border max-w-xl mx-auto my-4">
      <h2 className="text-xl font-bold mb-4">Quick Guest Check-In</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="First Name"
            required
            className="p-2 border rounded-lg w-full"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Last Name"
            required
            className="p-2 border rounded-lg w-full"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
          />
        </div>
        <input
          type="email"
          placeholder="Email Address"
          required
          className="p-2 border rounded-lg w-full"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="tel"
          placeholder="Phone Number"
          className="p-2 border rounded-lg w-full"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <input
          type="text"
          placeholder="Room Number (e.g. 101)"
          required
          className="p-2 border rounded-lg w-full"
          value={formData.room_number}
          onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Registering...' : 'Register Guest'}
        </button>
      </form>
    </div>
  );
};

export default QuickCheckIn;
