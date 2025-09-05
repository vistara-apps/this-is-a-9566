import React from 'react'
import { Globe } from 'lucide-react'

const LanguageSwitcher = ({ currentLanguage, onLanguageChange, className = '' }) => {
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ]

  return (
    <div className={`relative ${className}`}>
      <select
        value={currentLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="appearance-none bg-surface border border-gray-300 rounded-md pl-10 pr-8 py-2 text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary pointer-events-none" />
    </div>
  )
}

export default LanguageSwitcher