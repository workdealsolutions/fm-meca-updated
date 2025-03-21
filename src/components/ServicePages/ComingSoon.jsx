
import React from 'react';
import './ComingSoon.css'; // Import the CSS file

const ComingSoon = () => {
  return (
    <div className="coming-soon-container">
      <h1 className="coming-soon-title">Coming Soon</h1>
      <p className="coming-soon-message">
        We're working hard to bring you something amazing! Stay tuned for updates.
      </p>
      <div className="spinner"></div>
    </div>
  );
};

export default ComingSoon;
