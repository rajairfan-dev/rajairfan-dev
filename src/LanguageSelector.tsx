import React, { useState, useRef, useEffect } from 'react';
import { Language, languageList } from './translations';

interface LanguageSelectorProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function LanguageSelector({ currentLang, onLanguageChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = languageList.find(l => l.code === currentLang) || languageList[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded-xl shadow-sm hover:border-slate-400 text-xs font-semibold text-slate-700 transition"
      >
        <span className="text-base">{selected.flag}</span>
        <span>{selected.label}</span>
        <span className="text-[10px] text-slate-400">▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden py-1 max-h-72 overflow-y-auto">
          {languageList.map((item) => (
            <button
              key={item.code}
              onClick={() => {
                onLanguageChange(item.code);
                setIsOpen(false);
              }}
              className={`flex items-center justify-between w-full px-4 py-2 text-left text-xs transition ${
                currentLang === item.code
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">{item.flag}</span>
                <span>{item.label}</span>
              </div>
              <input
                type="radio"
                name="language"
                checked={currentLang === item.code}
                readOnly
                className="h-3.5 w-3.5 text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
      }
