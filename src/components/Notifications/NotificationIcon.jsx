import React, { useState } from 'react';
import { FaBell } from 'react-icons/fa';
import NotificationPopup from './NotificationPopup';
import './Notifications.css';

const NotificationIcon = ({ notifications = [], onNotificationRead }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <div className="notification-icon-container">
      <button 
        className="notification-icon-button"
        onClick={() => setIsPopupVisible(!isPopupVisible)}
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isPopupVisible && (
        <NotificationPopup 
          notifications={notifications}
          onClose={() => setIsPopupVisible(false)}
          onNotificationRead={onNotificationRead}
        />
      )}
    </div>
  );
};

export default NotificationIcon;
