import React from 'react';
import './NotificationToast.css';

const NotificationToast = ({ notification }) => {
  return (
    <div className={`notification-toast ${notification.type}`}>
      <span className="notification-icon">
        {notification.type === 'success' && '✓'}
        {notification.type === 'error' && '✕'}
        {notification.type === 'warning' && '⚠'}
        {notification.type === 'info' && 'ℹ'}
      </span>
      <p className="notification-message">{notification.message}</p>
    </div>
  );
};

export default NotificationToast;
