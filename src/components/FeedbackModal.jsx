import React, { useState } from 'react';
import './FeedbackModal.css';

const FeedbackModal = ({ onClose, onSubmit }) => {
  const [feedback, setFeedback] = useState('');

  return (
    <div className="modal-overlay">
      <div className="feedback-modal">
        <h3>Provide Feedback</h3>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Please provide reason for declining..."
          rows={4}
        />
        <div className="modal-buttons">
          <button 
            className="button cancel-button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="button submit-button"
            onClick={() => onSubmit(feedback)}
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
