import React from 'react';
import { languageList, Language } from '../translations';

interface Props {
  currentLang: Language;
  onSelectLang: (lang: Language) => void;
}

export const LanguageSelector: React.FC<Props> = ({ currentLang, onSelectLang }) => {
  return (
    <select
      value={currentLang}
      onChange={(e) => onSelectLang(e.target.value as Language)}
      className="bg-white border border-indigo-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
    >
      {languageList.map((item) => (
        <option key={item.code} value={item.code}>
          {item.flag} {item.label}
        </option>
      ))}
    </select>
  );
};
