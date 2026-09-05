import React, { useState } from 'react';
import { languageList } from './translations';

interface QuickCheckInProps {
  t: Record<string, string>;
  onCheckIn?: (guest: any) => void;
}

export default function QuickCheckIn({ t, onCheckIn }: QuickCheckInProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [prefLang, setPrefLang] = useState('en');
  const [passportFile, setPassportFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onCheckIn) {
      onCheckIn({
        firstName,
        lastName,
        email,
        phone,
        roomNumber,
        checkIn,
        checkOut,
        prefLang,
        passportFile
      });
      // Form Reset
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setRoomNumber('');
      setCheckIn('');
      setCheckOut('');
      setPassportFile(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-xl">
      <h3 className="text-base font-bold text-slate-800 mb-4">{t.quickCheckIn}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Name & Surname */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="John"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Surname / Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Doe"
              required
            />
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="john@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="+39 333 1234567"
              required
            />
          </div>
        </div>

        {/* Room Number & Preferred Language */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">{t.roomNumber}</label>
            <input
              type="text"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="104"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">{t.preferredLang}</label>
            <select
              value={prefLang}
              onChange={(e) => setPrefLang(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm bg-white"
            >
              {languageList.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.flag} {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Check-In & Check-Out Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">{t.checkInDate}</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full p-2 border rounded-lg text-xs"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">{t.checkOutDate}</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full p-2 border rounded-lg text-xs"
              required
            />
          </div>
        </div>

        {/* Passport / ID Upload */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Passport / ID Photo Upload</label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setPassportFile(e.target.files ? e.target.files[0] : null)}
            className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 border rounded-lg p-1 cursor-pointer"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition"
        >
          {t.registerGuest}
        </button>
      </form>
    </div>
  );
          }
