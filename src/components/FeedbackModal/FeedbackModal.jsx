import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import './FeedbackModal.css';

const FeedbackModal = ({ onClose, onSubmit, theme }) => {
  const [feedback, setFeedback] = useState('');
  const [selectedReason, setSelectedReason] = useState('');

  const commonReasons = [
    'Budget constraints',
    'Timeline not feasible',
    'Insufficient project details',
    'Resource unavailability',
    'Scope too broad',
    'Technical limitations'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalFeedback = selectedReason 
      ? `${selectedReason}: ${feedback}`
      : feedback;
    onSubmit(finalFeedback);
  };

  return (
    <AnimatePresence>
      <motion.div 
        className={`modal-overlay ${theme}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className={`feedback-modal ${theme}`}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", damping: 15 }}
        >
          <button className={`close-button ${theme}`} onClick={onClose}>
            <FaTimes />
          </button>

          <div className={`modal-header ${theme}`}>
            <FaExclamationTriangle className={`warning-icon ${theme}`} />
            <h2>Decline Project</h2>
            <p>Please provide a reason for declining this project</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={`common-reasons ${theme}`}>
              <label>Common Reasons:</label>
              <div className="reason-buttons">
                {commonReasons.map((reason) => (
                  <motion.button
                    key={reason}
                    type="button"
                    className={`reason-chip ${theme} ${selectedReason === reason ? 'selected' : ''}`}
                    onClick={() => setSelectedReason(reason)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {reason}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className={`feedback-input ${theme}`}>
              <label>Additional Comments:</label>
              <textarea
                className={theme}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Please provide more details about your decision..."
                required
                rows="4"
              />
            </div>

            <div className="modal-actions">
              <motion.button
                type="button"
                className={`cancel-button ${theme}`}
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                className={`submit-button ${theme}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!feedback.trim()}
              >
                Submit Feedback
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FeedbackModal;
