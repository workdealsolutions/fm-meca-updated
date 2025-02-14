import React, { createContext, useContext, useState } from 'react';
import NotificationToast from '../components/NotificationToast';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const sendNotification = ({ userId, message, type }) => {
    const newNotification = {
      id: Date.now(),
      userId,
      message,
      type,
      timestamp: new Date()
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => 
        prev.filter(notif => notif.id !== newNotification.id)
      );
    }, 5000);
  };

  return (
    <NotificationContext.Provider value={{ sendNotification }}>
      {children}
      <div className="notification-container">
        {notifications.map(notification => (
          <NotificationToast key={notification.id} notification={notification} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
