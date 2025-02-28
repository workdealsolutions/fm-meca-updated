import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const NotificationPopup = ({ notifications, onClose, onNotificationRead }) => {
  return (
    <div className="notification-popup">
      <div className="notification-popup-header">
        <h3>Notifications</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="notification-list">
        {notifications.length === 0 ? (
          <p className="no-notifications">No notifications</p>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
              onClick={() => {
                if (!notification.read && onNotificationRead) {
                  onNotificationRead(notification.id);
                }
              }}
            >
              <div className="notification-content">
                <p>{notification.message}</p>
                <span className="notification-time">
                  {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                </span>
              </div>
              {!notification.read && <div className="unread-dot" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPopup;
