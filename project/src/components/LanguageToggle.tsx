import React from 'react';
import { Languages } from 'lucide-react';

interface LanguageToggleProps {
  language: 'en' | 'lt';
  onToggle: () => void;
}

export function LanguageToggle({ language, onToggle }: LanguageToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
    >
      <Languages className="w-5 h-5" />
      <span className="font-medium">
        {language === 'en' ? 'EN' : 'LT'}
      </span>
    </button>
  );
}