import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import './FeedbackModal.css';

const FeedbackModal = ({ onClose, onSubmit }) => {
  const [feedback, setFeedback] = useState('');
  const { isDark } = useTheme();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = () => {
    if (feedback.trim()) {
      onSubmit(feedback);
      setFeedback('');
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`feedback-modal ${isDark ? 'dark' : ''}`}>
        <h3>Provide Feedback</h3>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Please provide reason for declining..."
          rows={4}
          autoFocus
        />
        <div className="modal-buttons">
          <button 
            className="button feedback-decline-btn"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="button submit-button"
            onClick={handleSubmit}
            disabled={!feedback.trim()}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
