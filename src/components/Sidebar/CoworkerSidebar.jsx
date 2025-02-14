import React from 'react';
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
    <div className={`coworker-sidebar ${isOpen ? 'open' : ''} ${isMobile ? 'mobile' : ''}`}>
      <div className="sidebar-logo">
        <img src="/logo.png" alt="Logo" />
        {isMobile && (
          <button className="mobile-close" onClick={() => setIsOpen(false)}>
            <FontAwesomeIcon icon={faBars} />
          </button>
        )}
      </div>
      
      <div className="sidebar-header">
        <div className="user-info">
          <div className="user-avatar">
            <img src={user.avatar || '/default-avatar.png'} alt="Profile" />
            <span className="status-indicator"></span>
          </div>
          <h3>{user.name}</h3>
          <p>{user.role}</p>
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
    </div>
  );
};

export default CoworkerSidebar;
