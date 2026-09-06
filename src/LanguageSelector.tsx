import React from 'react';
import { languageList, Language } from './translations';

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (lang: Language) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
  isOpen,
  onClose,
}) => {
  return (
    <div className="p-4 bg-white rounded-xl max-w-sm w-full mx-auto">
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {languageList.map((lang) => (
          <label
            key={lang.code}
            onClick={() => {
              onLanguageChange(lang.code);
              if (onClose) onClose();
            }}
            className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-colors ${
              currentLanguage === lang.code
                ? 'border-indigo-600 bg-indigo-50/50'
                : 'border-gray-100 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{lang.flag}</span>
              <span className="font-semibold text-gray-800">{lang.label}</span>
            </div>
            <input
              type="radio"
              name="language"
              value={lang.code}
              checked={currentLanguage === lang.code}
              onChange={() => {}}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
          </label>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
