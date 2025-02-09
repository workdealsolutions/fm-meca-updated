import React from 'react';
import { useLanguage } from './LanguageContext';
import { US, FR } from 'country-flag-icons/react/3x2';
import './LanguageToggle.css';

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="language-toggle-container">
      <button 
        className={`language-flag ${language === 'en' ? 'active' : ''} usa-flag`} 
        onClick={() => language !== 'en' && toggleLanguage()}
      >
        <US className="flag-icon" title="USA flag" />
        <span>ENGLISH</span>
      </button>
      <button 
        className={`language-flag ${language === 'fr' ? 'active' : ''} french-flag`} 
        onClick={() => language !== 'fr' && toggleLanguage()}
      >
        <FR className="flag-icon" title="French flag" />
        <span>FRENCH</span>
      </button>
    </div>
  );
};

export default LanguageToggle;
