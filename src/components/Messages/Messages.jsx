import React, { useState } from 'react';
import './Messages.css';

const Messages = ({ user, sendNotification, theme }) => {
  const [newMessage, setNewMessage] = useState('');
  
  // Sample messages - replace with actual data
  const [messages] = useState([
    {
      id: 1,
      sender: 'Project Manager',
      content: 'Your project proposal has been reviewed and approved.',
      date: '2024-01-20T14:30:00Z',
      unread: true
    },
    {
      id: 2,
      sender: 'System',
      content: 'New feature update: Project tracking improvements are now live!',
      date: '2024-01-19T09:15:00Z',
      unread: false
    },
    {
      id: 3,
      sender: 'Support Team',
      content: 'Thank you for your inquiry. We have updated your ticket status.',
      date: '2024-01-18T16:45:00Z',
      unread: false
    }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`messages-container ${theme}`}>
      <div className="messages-header">
        <h2>Messages</h2>
        <p>Stay connected with your project team</p>
      </div>

      <div className="messages-main">
        <div className="messages-list">
          {messages.map(message => (
            <div key={message.id} className={`message-item ${message.unread ? 'unread' : ''}`}>
              <div className="message-avatar">
                {message.sender.charAt(0)}
              </div>
              <div className="message-content">
                <div className="message-top">
                  <span className="message-sender">{message.sender}</span>
                  <span className="message-date">{formatDate(message.date)}</span>
                </div>
                <p className="message-text">{message.content}</p>
              </div>
            </div>
          ))}
        </div>

        <form className="message-form" onSubmit={handleSubmit}>
          <div className="message-input-container">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="message-input"
            />
            <button type="submit" className="send-button">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Messages;
