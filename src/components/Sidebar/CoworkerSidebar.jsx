import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useIsMobile } from '../../hooks/useIsMobile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faProjectDiagram, 
  faSpinner, 
  faClock, 
  faCheckCircle, 
  faUser,
  faBars 
} from '@fortawesome/free-solid-svg-icons';
import './CoworkerSidebar.css';

export const CoworkerSidebar = ({ activeTab, setActiveTab, user, isOpen, setIsOpen }) => {
  const isMobile = useIsMobile();
  const { isDark, toggleTheme } = useTheme();
  const theme = isDark ? 'dark' : 'light';

  const menuItems = [
    { id: 'projects', label: 'My Projects', icon: faProjectDiagram },
    { id: 'inProgress', label: 'In Progress', icon: faSpinner },
    { id: 'pending', label: 'Pending Review', icon: faClock },
    { id: 'completed', label: 'Completed', icon: faCheckCircle },
    { id: 'profile', label: 'Profile', icon: faUser },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (isMobile) setIsOpen(false);
  };

  return (
    <aside 
      className={`coworker-sidebar ${isOpen ? 'open' : ''} ${isMobile ? 'mobile' : ''}`}
      data-theme={theme}
    >
      {isMobile && (
        <div className="mobile-header">
          <button className="mobile-close" onClick={() => setIsOpen(false)}>
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      )}
      
      <div className="sidebar-header">
        <div className="user-info">
          <div className="user-avatar">
            <img src={user?.avatar || '/default-avatar.png'} alt="Profile" />
          </div>
          <div className="user-details">
            <h3>{user?.name || 'User Name'}</h3>
            <p>{user?.role || 'Member'}</p>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => handleTabClick(item.id)}
          >
            <FontAwesomeIcon icon={item.icon} className="icon" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="theme-toggle">
        <button 
          onClick={toggleTheme} 
          className="theme-toggle-btn"
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
    </aside>
  );
};

export default CoworkerSidebar;
