import React from 'react';
import './CoworkerModal.css';

const CoworkerModal = ({ coworker, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="coworker-modal" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>
        <div className="coworker-header">
          <div className="coworker-avatar">
            <img src={coworker.avatar || '/default-avatar.png'} alt={coworker.name} />
          </div>
          <h2>{coworker.name}</h2>
          <span className={`status-indicator ${coworker.status}`}>
            {coworker.status}
          </span>
        </div>
        
        <div className="coworker-info">
          <div className="info-group">
            <label>Email:</label>
            <p>{coworker.email}</p>
          </div>
          <div className="info-group">
            <label>Specialization:</label>
            <p>{coworker.specialization}</p>
          </div>
          <div className="info-group">
            <label>Active Projects:</label>
            <p>{coworker.activeProjects || 0}</p>
          </div>
          <div className="info-group">
            <label>Completed Projects:</label>
            <p>{coworker.completedProjects || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoworkerModal;
