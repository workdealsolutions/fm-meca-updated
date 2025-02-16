import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './Messages.css';

// Sample messages data
const sampleMessages = [
  {
    id: 1,
    sender: 'Project Manager',
    content: 'Your project proposal has been reviewed and approved.',
    date: new Date('2024-01-15T10:30:00'),
    unread: true
  },
  {
    id: 2,
    sender: 'Technical Lead',
    content: 'Can you provide more details about the technical requirements?',
    date: new Date('2024-01-14T15:45:00'),
    unread: false
  },
  {
    id: 3,
    sender: 'Design Team',
    content: 'The initial mockups are ready for your review.',
    date: new Date('2024-01-13T09:20:00'),
    unread: false
  }
];

const Messages = ({ user, sendNotification }) => {
  const { isDark } = useTheme();
  const theme = isDark ? 'dark' : 'light';
  const [messages, setMessages] = useState(sampleMessages);
  const [newMessage, setNewMessage] = useState('');

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: user.email,
      content: newMessage,
      date: new Date(),
      unread: false
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
    sendNotification?.('Message sent successfully!', 'success');
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
