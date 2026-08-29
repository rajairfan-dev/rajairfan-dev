import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    hotel_name: '',
    wifi_name: '',
    wifi_password: '',
    breakfast_hours: '',
    checkout_time: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('hotel_settings')
        .select('*')
        .limit(1)
        .single();

      if (data) {
        setFormData(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from('hotel_settings')
        .upsert({ id: formData.id, ...formData });

      if (error) throw error;
      alert('Hotel Settings updated successfully!');
    } catch (error: any) {
      alert('Error updating settings: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading Settings...</div>;

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>Hotel Knowledge Base Settings</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Hotel Name</label>
          <input
            type="text"
            name="hotel_name"
            value={formData.hotel_name || ''}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Wi-Fi Network Name</label>
          <input
            type="text"
            name="wifi_name"
            value={formData.wifi_name || ''}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Wi-Fi Password</label>
          <input
            type="text"
            name="wifi_password"
            value={formData.wifi_password || ''}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Breakfast Hours</label>
          <input
            type="text"
            name="breakfast_hours"
            value={formData.breakfast_hours || ''}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Check-Out Time</label>
          <input
            type="text"
            name="checkout_time"
            value={formData.checkout_time || ''}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          style={{
            padding: '12px',
            backgroundColor: '#4F46E5',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
