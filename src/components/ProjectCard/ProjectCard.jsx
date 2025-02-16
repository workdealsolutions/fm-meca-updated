import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './ProjectCard.css';

const ProjectCard = ({ project, getStatusColor, getProgressColor, formatDate }) => {
  const { isDark } = useTheme();
  const theme = isDark ? 'dark' : 'light';

  return (
    <div className={`project-card ${theme}`}>
      <div className="project-header">
        <h3>{project.description}</h3>
        <span 
          className="status-badge"
          style={{ backgroundColor: getStatusColor(project.status) }}
        >
          {project.status.replace('_', ' ')}
        </span>
      </div>
      
      <div className="project-details">
        <div className="info-row">
          <span>Budget:</span>
          <strong>${project.budget}</strong>
        </div>
        <div className="info-row">
          <span>Submitted:</span>
          <strong>{formatDate(project.submittedDate)}</strong>
        </div>
      </div>

      <div className="requirements">
        <h4>Requirements:</h4>
        <pre className="requirements-text">{project.requirements}</pre>
      </div>

      {project.status === 'completed' && project.projectUrl && (
        <div className="project-urls">
          <h4>Project Links:</h4>
          <div className="url-links">
            <a 
              href={project.projectUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="project-link"
            >
              <span>🌐</span> View Project
            </a>
            {project.projectRepository && (
              <a 
                href={project.projectRepository} 
                target="_blank" 
                rel="noopener noreferrer"
                className="project-link"
              >
                <span>📁</span> Repository
              </a>
            )}
          </div>
        </div>
      )}

      {project.status === 'rejected' && project.rejectionReason && (
        <div className="rejection-reason">
          <h4>Rejection Reason:</h4>
          <p className="rejection-text">{project.rejectionReason}</p>
        </div>
      )}

      {project.status === 'in_progress' && (
        <div className="progress-section">
          <div className="progress-header">
            <span className="progress-title">Progress</span>
            <span 
              className="progress-percentage"
              style={{ color: getProgressColor(project.progress) }}
            >
              {project.progress}%
            </span>
          </div>
          <progress 
            value={project.progress} 
            max="100"
            style={{ '--progress-color': getProgressColor(project.progress) }}
          />
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
