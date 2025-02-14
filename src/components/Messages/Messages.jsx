import React, { useState } from 'react';
import './Messages.css';

const Messages = ({ user, sendNotification }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Send notification to admin
    sendNotification({
      userId: 'admin',
      message: `New message from ${user.email}: ${message}`,
      type: 'message'
    });

    // Clear the message input
    setMessage('');
  };

  return (
    <div className="messages-container">
      <h2>Messages</h2>
      <div className="message-form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Send Message to Admin</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              required
            />
          </div>
          <button type="submit" className="send-message-btn">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Messages;
