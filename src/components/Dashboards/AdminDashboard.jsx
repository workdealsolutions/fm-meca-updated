import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Sidebar from '../Sidebar';
import FeedbackModal from '../FeedbackModal';
import { sampleProjects } from '../../utils/sampleProjects';
import './AdminDashboard.css';
import ProfileSettings from '../pages/ProfileSettings';

const AdminDashboard = ({ projects, setProjects, coworkers, sendNotification }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('pending');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCoworker, setSelectedCoworker] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  // Initialize with sample projects if no projects are provided
  useEffect(() => {
    if (!projects || projects.length === 0) {
      setProjects(sampleProjects);
    }
  }, [setProjects, projects]);

  const handleInitialReview = (projectId, isApproved, feedback = '') => {
    setProjects(prevProjects => prevProjects.map(project =>
      project.id === projectId 
        ? { 
            ...project, 
            status: isApproved ? 'admin-approved' : 'declined',
            adminFeedback: feedback,
            reviewDate: new Date().toISOString()
          }
        : project
    ));

    // Send notification to client
    const project = projects.find(p => p.id === projectId);
    if (project) {
      sendNotification({
        userId: project.clientId,
        message: isApproved 
          ? 'Your project has been approved and will be assigned to a coworker.'
          : `Your project has been declined. Reason: ${feedback}`,
        type: isApproved ? 'success' : 'error'
      });
    }
  };

  // Update other handlers to use prevProjects
  const handleAssignToCoworker = (projectId, coworkerId, deadline) => {
    setProjects(prevProjects => prevProjects.map(project =>
      project.id === projectId 
        ? { 
            ...project, 
            status: 'in-progress',
            assignedTo: coworkerId,
            deadline: deadline,
            assignedDate: new Date().toISOString()
          }
        : project
    ));

    // Notify coworker
    sendNotification({
      userId: coworkerId,
      message: 'A new project has been assigned to you',
      type: 'info'
    });
  };

  const handleFinalReview = (projectId, isApproved, feedback = '') => {
    const project = projects.find(p => p.id === projectId);
    
    setProjects(prevProjects => prevProjects.map(p =>
      p.id === projectId
        ? {
            ...p,
            status: isApproved ? 'completed' : 'revision-needed',
            adminFeedback: feedback,
            reviewDate: new Date().toISOString()
          }
        : p
    ));

    if (project) {
      // Send notifications
      if (isApproved) {
        sendNotification({
          userId: project.clientId,
          message: 'Your project has been completed and is ready for review',
          type: 'success'
        });
      } else {
        sendNotification({
          userId: project.assignedTo,
          message: `Project needs revision. Reason: ${feedback}`,
          type: 'warning'
        });
      }
    }
  };

  const openFeedbackModal = (project, type) => {
    setSelectedProject({ ...project, reviewType: type });
    setShowFeedbackModal(true);
  };

  const renderProjectCard = (project) => (
    <div className={`project-card ${theme}`}>
      <div className="project-header">
        <h4>{project.client}</h4>
        <span className={`status-badge ${project.status}`}>
          {project.status.replace(/-/g, ' ')}
        </span>
      </div>

      <div className="project-details">
        <p><strong>Description:</strong> {project.description}</p>
        <p><strong>Budget:</strong> ${project.budget.toLocaleString()}</p>
        <p><strong>Submitted:</strong> {new Date(project.submissionDate).toLocaleDateString()}</p>
        
        <div className="requirements-section">
          <strong>Requirements:</strong>
          <ul className="requirements-list">
            {project.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>

        {project.status === 'pending' && (
          <div className="action-buttons">
            <button 
              className="button approve-button"
              onClick={() => handleInitialReview(project.id, true)}
            >
              Approve Project
            </button>
            <button 
              className="button reject-button"
              onClick={() => openFeedbackModal(project, 'initial')}
            >
              Decline Project
            </button>
          </div>
        )}

        {project.status === 'admin-approved' && (
          <div className="assignment-section">
            <select 
              onChange={(e) => project.selectedCoworker = e.target.value}
              className="select-coworker"
            >
              <option value="">Select Coworker</option>
              {coworkers.map(coworker => (
                <option key={coworker.id} value={coworker.id}>
                  {coworker.name}
                </option>
              ))}
            </select>
            <input 
              type="date"
              onChange={(e) => project.deadline = e.target.value}
              min={new Date().toISOString().split('T')[0]}
              className="deadline-input"
            />
            <button 
              className="button approve-button"
              onClick={() => handleAssignToCoworker(
                project.id,
                project.selectedCoworker,
                project.deadline
              )}
            >
              Assign to Coworker
            </button>
          </div>
        )}

        {project.status === 'completed-pending-review' && (
          <div className="review-buttons">
            <button 
              className="button approve-button"
              onClick={() => handleFinalReview(project.id, true)}
            >
              Approve & Send to Client
            </button>
            <button 
              className="button reject-button"
              onClick={() => openFeedbackModal(project, 'final')}
            >
              Request Revision
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderCoworkerDetails = (coworker) => (
    <div className={`coworker-details ${theme}`}>
      <button className="back-button" onClick={() => setSelectedCoworker(null)}>
        ← Back to Projects
      </button>
      <div className="coworker-profile">
        <div className="coworker-header">
          <div className="coworker-avatar">
            <img src={coworker.avatar || '/default-avatar.png'} alt={coworker.name} />
          </div>
          <h2>{coworker.name}</h2>
          <span className={`status-indicator ${coworker.status}`}>
            {coworker.status || 'Active'}
          </span>
        </div>
        
        <div className="coworker-stats">
          <div className="stat-card">
            <h3>Active Projects</h3>
            <p>{coworker.activeProjects || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Completed Projects</h3>
            <p>{coworker.completedProjects || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Success Rate</h3>
            <p>{coworker.successRate || '100%'}</p>
          </div>
        </div>

        <div className="coworker-info-grid">
          <div className="info-card">
            <label>Email</label>
            <p>{coworker.email || 'No email provided'}</p>
          </div>
          <div className="info-card">
            <label>Specialization</label>
            <p>{coworker.specialization || 'General'}</p>
          </div>
          <div className="info-card">
            <label>Join Date</label>
            <p>{coworker.joinDate || 'Not specified'}</p>
          </div>
          <div className="info-card">
            <label>Skills</label>
            <div className="skills-list">
              {(coworker.skills || ['No skills listed']).map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Add admin info - replace with actual admin data from your auth system
  const adminInfo = {
    name: "David Smith",
    email: "david.smith@example.com",
    avatar: "/path-to-admin-image.jpg",
    role: "Administrator"
  };

  const handleSettingsSave = (updatedSettings) => {
    console.log('Saving settings:', updatedSettings);
    // Implement your settings update logic here
    setShowSettings(false);
  };

  const getMainContent = () => {
    if (showSettings) {
      return (
        <ProfileSettings 
          admin={adminInfo} 
          onSave={handleSettingsSave}
          onBack={() => setShowSettings(false)}
        />
      );
    }
    if (selectedCoworker) {
      return renderCoworkerDetails(selectedCoworker);
    }
    return (
      <div className="projects-grid">
        {(projects || [])
          .filter(p => {
            if (activeTab === 'pending') {
              return p.status === 'pending' || p.status === 'admin-approved';
            }
            return p.status === 'completed-pending-review';
          })
          .map(renderProjectCard)}
      </div>
    );
  };

  return (
    <div className={`admin-dashboard ${theme}`}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        adminName={adminInfo.name}
        adminImage={adminInfo.image}
        coworkers={coworkers}
        onCoworkerSelect={setSelectedCoworker}
        onSettingsClick={() => {
          setShowSettings(true);
          setSelectedCoworker(null);
        }}
      />
      <div className="dashboard-content">
        <h2>
          {showSettings ? 'Profile Settings' :
           selectedCoworker ? 'Coworker Profile' :
           activeTab === 'pending' ? 'New Projects' : 'Projects Under Review'}
        </h2>
        {getMainContent()}
      </div>

      {showFeedbackModal && (
        <FeedbackModal
          onClose={() => setShowFeedbackModal(false)}
          onSubmit={(feedback) => {
            if (selectedProject.reviewType === 'initial') {
              handleInitialReview(selectedProject.id, false, feedback);
            } else {
              handleFinalReview(selectedProject.id, false, feedback);
            }
            setShowFeedbackModal(false);
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
