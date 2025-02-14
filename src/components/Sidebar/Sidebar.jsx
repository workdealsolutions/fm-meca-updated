import React from 'react';
import './Sidebar.css';

const Sidebar = ({ user, activeTab, setActiveTab }) => {
  return (
    <div className="sidebar">
      <div className="user-info">
        <div className="user-avatar">
          {user.email.charAt(0).toUpperCase()}
        </div>
        <h3>{user.email}</h3>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li 
            className={activeTab === 'projects' ? 'active' : ''} 
            onClick={() => setActiveTab('projects')}
          >
            My Projects
          </li>
          <li 
            className={activeTab === 'new' ? 'active' : ''} 
            onClick={() => setActiveTab('new')}
          >
            New Project
          </li>
          <li 
            className={activeTab === 'messages' ? 'active' : ''} 
            onClick={() => setActiveTab('messages')}
          >
            Messages
          </li>
          <li 
            className={activeTab === 'settings' ? 'active' : ''} 
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
