import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import CoworkerModal from './CoworkerModal';
import './Sidebar.css';

const Sidebar = ({ 
  activeTab, 
  setActiveTab, 
  adminName = "John", 
  adminImage = "/admin-avatar.jpg", 
  coworkers, 
  onCoworkerSelect,
  onSettingsClick,
  className,
  onClose // Add this prop
}) => {
  const { theme, toggleTheme } = useTheme();
  const [showCoworkers, setShowCoworkers] = useState(false);
  const navigate = useNavigate();

  return (
    <div className={`sidebar ${theme} ${className || ''}`}>
      <div className="sidebar-header">
        <div className="admin-profile">
          <div className="admin-image">
            <img src={adminImage} alt="Admin" />
          </div>
          <h3>Hello, {adminName}</h3>
        </div>
      </div>

      {/* Close button for mobile */}
      <button className="close-mobile-menu" onClick={onClose}>×</button>

      <nav className="sidebar-nav">
        <button 
          className={activeTab === 'pending' ? 'active' : ''} 
          onClick={() => setActiveTab('pending')}
        >
          Pending Projects
        </button>
        <button 
          className={activeTab === 'completed' ? 'active' : ''} 
          onClick={() => setActiveTab('completed')}
        >
          Completed Projects
        </button>

        <div className="sidebar-section">
          <button 
            className="section-toggle"
            onClick={() => setShowCoworkers(!showCoworkers)}
          >
            Coworkers List {showCoworkers ? '▼' : '▶'}
          </button>
          {showCoworkers && (
            <div className="coworkers-list">
              {coworkers.map(coworker => (
                <div 
                  key={coworker.id} 
                  className="coworker-item"
                  onClick={() => onCoworkerSelect(coworker)}
                >
                  <span className="coworker-name">{coworker.name}</span>
                  <span className="coworker-status"></span>
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>

      <div className="sidebar-footer">
        <button 
          className="settings-button"
          onClick={onSettingsClick}
        >
          <i className="fas fa-cog"></i>
          Profile Settings
        </button>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
