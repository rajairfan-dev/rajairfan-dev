import React, { useState } from 'react';

export const Settings: React.FC = () => {
  const [hotelName, setHotelName] = useState('AlpineStay');
  const [wifiName, setWifiName] = useState('AlpineStay_Guest');
  const [wifiPass, setWifiPass] = useState('alpine2026');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Settings Saved Successfully!');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-sm border my-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Hotel & App Settings</h2>
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property / Hotel Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            value={hotelName}
            onChange={(e) => setHotelName(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wi-Fi Network Name (SSID)</label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg"
              value={wifiName}
              onChange={(e) => setWifiName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wi-Fi Password</label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg"
              value={wifiPass}
              onChange={(e) => setWifiPass(e.target.value)}
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default Settings;
