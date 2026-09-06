import React from 'react';
import { languageList, Language } from './translations';

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (lang: Language) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
}) => {
  return (
    <select
      value={currentLanguage}
      onChange={(e) => onLanguageChange(e.target.value as Language)}
      className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer"
    >
      {languageList.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.label}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector;
