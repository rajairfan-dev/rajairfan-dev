import React, { useState } from 'react';
import { Upload, UserCheck } from 'lucide-react';
import { supabase } from './supabaseClient';
import { Language, translations } from './translations';

interface Props {
  currentLang: Language;
  onGuestAdded: () => void;
}

export const QuickCheckIn: React.FC<Props> = ({ currentLang, onGuestAdded }) => {
  const t = translations[currentLang] || translations.en;

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [room, setRoom] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !room) return;

    setLoading(true);
    try {
      let passportUrl = '';

      // Upload Passport File to Supabase Storage if selected
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `passports/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('passports')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Passport upload error:', uploadError.message);
        } else {
          const { data } = supabase.storage.from('passports').getPublicUrl(filePath);
          passportUrl = data.publicUrl;
        }
      }

      // Insert Guest Data into Database
      const { error } = await supabase.from('guests').insert([
        {
          name: name,
          surname: surname,
          email: email,
          phone: phone,
          room_number: room,
          passport_url: passportUrl,
        },
      ]);

      if (error) {
        alert('Error: ' + error.message);
      } else {
        setName('');
        setSurname('');
        setEmail('');
        setPhone('');
        setRoom('');
        setFile(null);
        onGuestAdded();
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center space-x-2 mb-4">
        <UserCheck className="w-5 h-5 text-indigo-600" />
        <h3 className="text-base font-bold text-slate-800">{t.quickCheckIn}</h3>
      </div>

      <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder={t.firstName}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <input
          type="text"
          placeholder={t.surname}
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="email"
          placeholder={t.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="tel"
          placeholder={t.phone}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="text"
          placeholder={t.roomNumber}
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <div className="relative flex items-center">
          <input
            type="file"
            id="passport-upload"
            accept="image/*,.pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
          />
          <label
            htmlFor="passport-upload"
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-dashed border-slate-400 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer transition truncate"
          >
            <Upload className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span className="truncate">{file ? file.name : t.passportUpload}</span>
          </label>
        </div>

        <div className="md:col-span-3 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white py-2.5 px-6 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition shadow-sm"
          >
            {loading ? t.uploading : t.registerGuest}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuickCheckIn;
