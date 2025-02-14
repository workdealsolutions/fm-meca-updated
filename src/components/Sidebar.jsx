import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import CoworkerModal from './CoworkerModal';
import './Sidebar.css';

const Sidebar = ({ 
  activeTab, 
  setActiveTab, 
  adminName = "David Smith", // Updated default name
  adminImage = "/admin-avatar.jpg", 
  coworkers, 
  clients, // Add this prop
  onCoworkerSelect,
  onClientSelect, // Add this prop
  onSettingsClick,
  className,
  onClose 
}) => {
  const { theme, toggleTheme } = useTheme();
  const [showCoworkers, setShowCoworkers] = useState(false);
  const [showClients, setShowClients] = useState(false);
  const navigate = useNavigate();

  const handleThemeToggle = () => {
    toggleTheme();
    // Optionally save theme preference to localStorage
    localStorage.setItem('theme', theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`sidebar ${theme} ${className || ''}`}>
      <div className="sidebar-header">
        <div className="admin-profile">
          <div className={`admin-image ${theme}`}>
            <img src={adminImage} alt="Admin" />
          </div>
          <h3 className={theme}>Hello, {adminName}</h3>
        </div>
      </div>

      <button className={`close-mobile-menu ${theme}`} onClick={onClose}>×</button>

      <nav className={`sidebar-nav ${theme}`}>
        <button 
          className={`${activeTab === 'pending' ? 'active' : ''} ${theme}`} 
          onClick={() => setActiveTab('pending')}
        >
          Pending Projects
        </button>
        <button 
          className={`${activeTab === 'completed' ? 'active' : ''} ${theme}`} 
          onClick={() => setActiveTab('completed')}
        >
          Completed Projects
        </button>

        <div className={`sidebar-section ${theme}`}>
          <button 
            className={`section-toggle ${theme}`}
            onClick={() => setShowCoworkers(!showCoworkers)}
          >
            Coworkers List {showCoworkers ? '▼' : '▶'}
          </button>
          {showCoworkers && (
            <div className={`coworkers-list ${theme}`}>
              {coworkers.map(coworker => (
                <div 
                  key={coworker.id} 
                  className={`coworker-item ${theme}`}
                  onClick={() => onCoworkerSelect(coworker)}
                >
                  <span className={`coworker-name ${theme}`}>{coworker.name}</span>
                  <span className={`coworker-status ${theme}`}></span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Clients List Section */}
        <div className={`sidebar-section ${theme}`}>
          <button 
            className={`section-toggle ${theme}`}
            onClick={() => setShowClients(!showClients)}
          >
            Clients List {showClients ? '▼' : '▶'}
          </button>
          {showClients && (
            <div className={`clients-list ${theme}`}>
              {clients?.map(client => (
                <div 
                  key={client.id} 
                  className={`client-item ${theme}`}
                  onClick={() => onClientSelect(client)}
                >
                  <div className="client-info">
                    <span className={`client-name ${theme}`}>{client.name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>

      <div className={`sidebar-footer ${theme}`}>
        <button 
          className={`settings-button ${theme}`}
          onClick={onSettingsClick}
        >
          <i className="fas fa-cog"></i>
          Profile Settings
        </button>
        <button 
          className={`theme-toggle ${theme}`}
          onClick={toggleTheme}
        >
          {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
