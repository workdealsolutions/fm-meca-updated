import React from 'react';
import './CoworkerSidebar.css';

export const CoworkerSidebar = ({ activeTab, setActiveTab, user }) => {
  const menuItems = [
    { id: 'projects', label: 'My Projects', icon: '📋' },
    { id: 'inProgress', label: 'In Progress', icon: '🔄' },
    { id: 'pending', label: 'Pending Review', icon: '⏳' },
    { id: 'completed', label: 'Completed', icon: '✅' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="coworker-sidebar">
      <div className="sidebar-header">
        <div className="user-info">
          <img src={user.avatar || '/default-avatar.png'} alt="Profile" />
          <h3>{user.name}</h3>
          <p>{user.role}</p>
        </div>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

// You can also keep the default export if needed
export default CoworkerSidebar;
