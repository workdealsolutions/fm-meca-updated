import React from 'react';
import './ProjectCard.css';

const ProjectCard = ({ project, getStatusColor, getProgressColor, formatDate }) => {
  return (
    <div className="project-card">
      <div className="project-header">
        <h3>{project.description}</h3>
        <span 
          className="status-badge"
          style={{ backgroundColor: getStatusColor(project.status) }}
        >
          {project.status.replace('_', ' ')}
        </span>
      </div>
      
      <div className="project-info">
        <p><strong>Budget:</strong> ${project.budget.toLocaleString()}</p>
        <p><strong>Submitted:</strong> {formatDate(project.submittedDate)}</p>
      </div>

      <div className="project-details">
        <h4>Requirements</h4>
        <p className="requirements-text">{project.requirements}</p>
      </div>

      <div className="progress-section">
        <div className="progress-header">
          <span className="progress-title">Project Progress</span>
          <span className="progress-percentage" 
                style={{ color: getProgressColor(project.progress) }}>
            {project.progress}%
          </span>
        </div>
        <progress 
          value={project.progress} 
          max="100" 
          style={{ '--progress-color': getProgressColor(project.progress) }}
        />
        <div className="progress-details">
          <div className="progress-stat">
            <span>Status</span>
            <strong>{project.status.replace('_', ' ')}</strong>
          </div>
          <div className="progress-stat">
            <span>Start Date</span>
            <strong>{formatDate(project.submittedDate)}</strong>
          </div>
          <div className="progress-stat">
            <span>Estimated Completion</span>
            <strong>{project.status === 'completed' ? 'Completed' : 'In Progress'}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
