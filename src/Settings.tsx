import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const LANGUAGES = [
  { code: 'en', name: 'English 🇬🇧' },
  { code: 'de', name: 'German 🇩🇪' },
  { code: 'it', name: 'Italian 🇮🇹' },
  { code: 'nl', name: 'Dutch 🇳🇱' },
  { code: 'fr', name: 'French 🇫🇷' },
  { code: 'es', name: 'Spanish 🇪🇸' },
  { code: 'pl', name: 'Polish 🇵🇱' },
  { code: 'ru', name: 'Russian 🇷🇺' },
  { code: 'ar', name: 'Arabic 🇸🇦' },
  { code: 'zh', name: 'Chinese 🇨🇳' },
  { code: 'sv', name: 'Swedish 🇸🇪' }
];

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeLang, setActiveLang] = useState('en');
  const [recordId, setRecordId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    hotel_name: 'AlpineStay',
    wifi_name: 'AlpineStay_Guest',
    wifi_password: 'alpine2026',
    checkout_time: '11:00 AM'
  });

  const [translations, setTranslations] = useState<Record<string, { welcome: string; breakfast: string }>>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await supabase.from('hotel_settings').select('*').limit(1).single();

      if (data) {
        setRecordId(data.id);
        setFormData({
          hotel_name: data.hotel_name || '',
          wifi_name: data.wifi_name || '',
          wifi_password: data.wifi_password || '',
          checkout_time: data.checkout_time || ''
        });
        if (data.translations) {
          setTranslations(data.translations);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTranslationChange = (field: 'welcome' | 'breakfast', value: string) => {
    setTranslations(prev => ({
      ...prev,
      [activeLang]: {
        ...prev[activeLang],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.from('hotel_settings').upsert({
        id: recordId,
        ...formData,
        translations
      });

      if (error) throw error;
      alert('Settings and translations saved successfully!');
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading Multi-Language Settings...</div>;

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Hotel Settings & Multi-Language Support</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* General Hotel Info */}
        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '12px' }}>General Configuration</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Hotel Name</label>
              <input type="text" value={formData.hotel_name} onChange={e => setFormData({ ...formData, hotel_name: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Wi-Fi Name</label>
              <input type="text" value={formData.wifi_name} onChange={e => setFormData({ ...formData, wifi_name: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Wi-Fi Password</label>
              <input type="text" value={formData.wifi_password} onChange={e => setFormData({ ...formData, wifi_password: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Checkout Time</label>
              <input type="text" value={formData.checkout_time} onChange={e => setFormData({ ...formData, checkout_time: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
            </div>
          </div>
        </div>

        {/* Language Tabs */}
        <div>
          <h3 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Supported Languages (11 Languages)</h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setActiveLang(lang.code)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: activeLang === lang.code ? '#4F46E5' : '#fff',
                  color: activeLang === lang.code ? '#fff' : '#0f172a',
                  cursor: 'pointer',
                  fontWeight: activeLang === lang.code ? 'bold' : 'normal'
                }}
              >
                {lang.name}
              </button>
            ))}
          </div>

          {/* Active Language Specific Fields */}
          <div style={{ padding: '16px', border: '1px solid #6366f1', borderRadius: '8px', backgroundColor: '#f5f3ff' }}>
            <h4 style={{ fontWeight: 'bold', marginBottom: '10px', color: '#4338ca' }}>
              Editing details for: {LANGUAGES.find(l => l.code === activeLang)?.name}
            </h4>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Welcome Greeting Message</label>
              <input
                type="text"
                value={translations[activeLang]?.welcome || ''}
                onChange={e => handleTranslationChange('welcome', e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Breakfast Timings Description</label>
              <input
                type="text"
                value={translations[activeLang]?.breakfast || ''}
                onChange={e => handleTranslationChange('breakfast', e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          style={{ padding: '12px', backgroundColor: '#10B981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {saving ? 'Saving Everything...' : 'Save All Settings & Languages'}
        </button>
      </form>
    </div>
  );
    }
