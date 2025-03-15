import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useIsMobile } from '../../hooks/useIsMobile';
import CoworkerSidebar from '../Sidebar/CoworkerSidebar';
import CoworkerSettings from '../Settings/CoworkerSettings';
import './CoWorkerDashboard.css';
import { useTheme } from '../../context/ThemeContext';
import NotificationIcon from '../Notifications/NotificationIcon';

// Add this helper function before the component
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const CoWorkerDashboard = ({ 
  user = {}, 
  sendNotification = () => {}, // Provide default empty function
  notifications = [] 
}) => {
  const isMobile = useIsMobile();
  const { isDark } = useTheme();
  const theme = isDark ? 'dark' : 'light';

  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [activeTab, setActiveTab] = useState('projects'); // Tabs: 'projects', 'inProgress', 'pending', 'completed', 'profile'
  const [projects, setProjects] = useState([]); // Fetched from backend
  const [stepContent, setStepContent] = useState({}); // To hold submission text, URL, and files
  const [expandedSteps, setExpandedSteps] = useState({});
  const [currentStep, setCurrentStep] = useState({}); // Track current active step for each project

// Define the formatDate function at the top of the CoWorkerDashboard component
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  // Helper: Get auth configuration
  const getAuthConfig = () => {
    const token = localStorage.getItem('authToken');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // Fetch projects assigned to the coworker when user is available
  useEffect(() => {
    async function fetchProjects() {
      try {
        const config = getAuthConfig();
        const response = await axios.get('http://localhost:5000/api/projects/assigned', config);
        // If steps are stored as JSON strings, parse them here
        const projectsData = response.data.projects.map((project) => {
          if (project.steps && typeof project.steps === 'string') {
            try {
              project.steps = JSON.parse(project.steps);
            } catch (e) {
              console.error(`Error parsing steps for project ${project.id}:`, e);
              project.steps = [];
            }
          }
          return project;
        });
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching assigned projects:', error);
      }
    }
    if (user?.id) {
      fetchProjects();
    }
  }, [user?.id]);

  // Add this useEffect for fetching notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const config = getAuthConfig();
        const response = await axios.get('http://localhost:5000/api/notifications', config);
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleNotificationRead = async (notificationId) => {
    try {
      const config = getAuthConfig();
      await axios.patch(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {},
        config
      );
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Handle file upload for a given project (update local state)
  const handleFileUpload = (projectId, files) => {
    setStepContent(prev => ({
      ...prev,
      [projectId]: { ...prev[projectId], files }
    }));
  };

  // Add this helper function
  const canAccessStep = (steps, index) => {
    if (index === 0) return true;
    return steps[index - 1]?.status === 'approved';
  };

  // Fix the handleStepComplete function
  const handleStepComplete = async (projectId, stepIndex, content, projectUrl) => {
    try {
      const config = getAuthConfig();
      const response = await axios.put(
        `http://localhost:5000/api/projects/${projectId}/steps/${stepIndex + 1}`,
        { 
          content, 
          projectUrl,
          status: 'pending-review'
        },
        config
      );

      if (response.data.success) {
        setProjects(prevProjects =>
          prevProjects.map(project =>
            project.id === projectId
              ? {
                  ...project,
                  steps: project.steps.map((step, idx) =>
                    idx === stepIndex
                      ? { 
                          ...step, 
                          status: 'pending-review', 
                          submission: content, 
                          projectUrl 
                        }
                      : step
                  )
                }
              : project
          )
        );
        
        if (typeof sendNotification === 'function') {
          sendNotification({
            userId: 'admin',
            message: `Step ${stepIndex + 1} submitted for review`,
            type: 'info'
          });
        }
      }
    } catch (error) {
      console.error('Error submitting step for review:', error);
      if (typeof sendNotification === 'function') {
        sendNotification({
          userId: user.id,
          message: 'Error submitting step. Please try again.',
          type: 'error'
        });
      }
    }
  };
  

  // Add this new function to toggle step expansion
  const toggleStepExpansion = (projectId, stepIndex) => {
    setExpandedSteps(prev => ({
      ...prev,
      [`${projectId}-${stepIndex}`]: !prev[`${projectId}-${stepIndex}`]
    }));
  };

  // Clean up the renderSteps function
  const renderSteps = (project) => (
    <div className="project-steps">
      {project.steps.map((step, index) => (
        <div 
          key={index} 
          className={`step-card ${step.status} ${!canAccessStep(project.steps, index) ? 'locked' : ''}`}
        >
          <div className="step-header">
            <div className="step-title">
              <span className="step-number">Step {index + 1}</span>
              <h4>{step.title}</h4>
            </div>
            <div className="step-status-indicator">
              {step.status === 'approved' && <span className="status-approved">✓</span>}
              {step.status === 'pending-review' && <span className="status-pending">⋯</span>}
              {step.status === 'revision-needed' && <span className="status-revision">⚠</span>}
            </div>
          </div>

          <div className="step-content">
            <p className="step-description">{step.description}</p>
            
            {canAccessStep(project.steps, index) && (
              <div className="step-submission-area">
                <div className="url-input-container">
                  <input
                    type="url"
                    placeholder="Enter work URL"
                    value={stepContent[`${project.id}-${index}`]?.url || ''}
                    onChange={(e) =>
                      setStepContent(prev => ({
                        ...prev,
                        [`${project.id}-${index}`]: { 
                          ...prev[`${project.id}-${index}`],
                          url: e.target.value 
                        }
                      }))
                    }
                    className="url-input"
                  />
                  <button
                    className="submit-url-btn"
                    onClick={() => handleStepComplete(
                      project.id,
                      index,
                      step.description,
                      stepContent[`${project.id}-${index}`]?.url
                    )}
                    disabled={!stepContent[`${project.id}-${index}`]?.url}
                  >
                    Submit for Review
                  </button>
                </div>

                {step.status === 'pending-review' && (
                  <div className="step-pending">
                    <p>Under review by admin</p>
                    <p>Submitted URL: <a href={step.projectUrl} target="_blank" rel="noopener noreferrer">{step.projectUrl}</a></p>
                  </div>
                )}

                {step.status === 'approved' && (
                  <div className="step-approved">
                    <p>✓ Completed</p>
                    <p>Approved URL: <a href={step.projectUrl} target="_blank" rel="noopener noreferrer">{step.projectUrl}</a></p>
                  </div>
                )}

                {step.status === 'revision-needed' && (
                  <div className="step-revision">
                    <p className="revision-message">{step.feedback}</p>
                    <div className="url-input-container">
                      <input
                        type="url"
                        placeholder="Enter revised work URL"
                        value={stepContent[`${project.id}-${index}`]?.url || ''}
                        onChange={(e) =>
                          setStepContent(prev => ({
                            ...prev,
                            [`${project.id}-${index}`]: { 
                              ...prev[`${project.id}-${index}`],
                              url: e.target.value 
                            }
                          }))
                        }
                        className="url-input"
                      />
                      <button
                        className="submit-url-btn"
                        onClick={() => handleStepComplete(
                          project.id,
                          index,
                          step.description,
                          stepContent[`${project.id}-${index}`]?.url
                        )}
                        disabled={!stepContent[`${project.id}-${index}`]?.url}
                      >
                        Submit Revision
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  // Update the renderProjectContent function to use the new renderSteps
  const renderProjectContent = (project) => {
    const completedStepsCount = project.steps ? project.steps.filter(step => step.status === 'approved').length : 0;
    const progress = project.steps && project.steps.length ? (completedStepsCount / project.steps.length) * 100 : 0;
    return (
      <div className="project-card" key={project.id}>
        <div className="project-header">
          <h3>{project.title}</h3>
          <div className="project-details">
            <span className="deadline">
              Deadline: {formatDate(project.deadline)}
            </span>
            <span className="project-status" data-status={project.status}>
              Status: {project.status}
            </span>
          </div>
        </div>
        <div className="project-description">
          <p>{project.description}</p>
        </div>
        <div className="project-meta">
          <span>Assigned by: {project.assignedBy || 'N/A'}</span>
          <span>Date Assigned: {formatDate(project.assignedDate)}</span>
        </div>
        {/* Display progress and steps if the project is not pending */}
        {project.status !== 'pending' && project.steps && renderSteps(project)}
      </div>
    );
  };

  // Filter projects based on the active tab
  const filteredProjects = projects.filter(project => {
    switch (activeTab) {
      case 'projects':
        // Show all projects that are not marked completed
        return project.status !== 'completed';
      case 'inProgress':
        return project.status === 'in-progress';
      case 'pending':
        // Show projects that have at least one step pending review
        return project.steps && project.steps.some(step => step.status === 'pending-review');
      case 'completed':
        return project.status === 'completed';
      default:
        return true;
    }
  });

  const renderContent = () => {
    if (filteredProjects.length === 0) {
      return (
        <div className="no-projects">
          <h3>No projects found</h3>
          <p>There are currently no projects in this category.</p>
        </div>
      );
    }
    return <div className="projects-grid">{filteredProjects.map(renderProjectContent)}</div>;
  };

  return (
    <div className="dashboard-container" data-theme={theme}>
      {isMobile && (
        <div className="menu-toggle">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? '×' : '≡'}
          </button>
        </div>
      )}
      <CoworkerSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className={`main-content ${theme}`}>
        <div className="dashboard-header">
          <h2>Dashboard</h2>
          <NotificationIcon 
            notifications={notifications}
            onNotificationRead={handleNotificationRead}
          />
        </div> 
        {activeTab === 'profile' ? (
          <CoworkerSettings
            user={user}
            onUpdateProfile={(updatedProfile) => {
              console.log('Profile updated:', updatedProfile);
              sendNotification({
                userId: user.id,
                message: 'Profile updated successfully',
                type: 'success'
              });
            }}
          />
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

export default CoWorkerDashboard;
