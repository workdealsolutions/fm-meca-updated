import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './Sidebar.css';
import { useIsMobile } from '../../hooks/useIsMobile';

const getIcon = (tab) => {
  const icons = {
    projects: '📂',
    new: '➕',
    messages: '💬',
    progress: '📊',
    profile: '👤'  // Add profile icon
  };
  return icons[tab] || '📄';
};

const Sidebar = ({ user, activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const isMobile = useIsMobile();
  const { isDark, toggleTheme } = useTheme();
  const theme = isDark ? 'dark' : 'light';

  const handleTabClick = (tab) => {
    console.log('Sidebar tab clicked:', tab);
    setActiveTab(tab);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const tabs = [
    { id: 'projects', label: 'Projects' }, // This should be first in the array
    { id: 'new', label: 'New Project' },
    { id: 'progress', label: 'Track Progress' },
    { id: 'messages', label: 'Messages' },
    { id: 'profile', label: 'Profile' }  // Add profile tab
  ];

  return (
    <div 
      className={`sidebar ${isOpen ? 'open' : ''} ${isMobile ? 'mobile' : ''} ${theme}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="user-info">
        <div className="user-avatar">
          {user.email.charAt(0).toUpperCase()}
        </div>
        <h3>{user.email}</h3>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {tabs.map(({ id, label }) => (
            <li 
              key={id}
              className={activeTab === id ? 'active' : ''} 
              onClick={() => handleTabClick(id)}
            >
              <span style={{ marginRight: '12px' }}>{getIcon(id)}</span>
              {label}
            </li>
          ))}
        </ul>
      </nav>
      <div className="theme-toggle">
        <button 
          onClick={toggleTheme} 
          className={`theme-toggle-btn ${theme}`}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          {isDark ? (
            <>
              <span role="img" aria-hidden="true">☀️</span>
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <span role="img" aria-hidden="true">🌙</span>
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
