import React from 'react';
import './Sidebar.css';
import { useIsMobile } from '../../hooks/useIsMobile';

const Sidebar = ({ user, activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const isMobile = useIsMobile();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''} ${isMobile ? 'mobile' : ''}`}>
      <div className="user-info">
        <div className="user-avatar">
          {user.email.charAt(0).toUpperCase()}
        </div>
        <h3>{user.email}</h3>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {['projects', 'new', 'messages', 'settings'].map((tab) => (
            <li 
              key={tab}
              className={activeTab === tab ? 'active' : ''} 
              onClick={() => handleTabClick(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
