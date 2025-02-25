import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useIsMobile } from '../../hooks/useIsMobile';
import CoworkerSidebar from '../Sidebar/CoworkerSidebar';
import CoworkerSettings from '../Settings/CoworkerSettings';
import './CoWorkerDashboard.css';
import { useTheme } from '../../context/ThemeContext';

const CoWorkerDashboard = ({ user = {}, sendNotification }) => {
  const isMobile = useIsMobile();
  const { isDark } = useTheme();
  const theme = isDark ? 'dark' : 'light';

  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [activeTab, setActiveTab] = useState('projects'); // Tabs: 'projects', 'inProgress', 'pending', 'completed', 'profile'
  const [projects, setProjects] = useState([]); // Fetched from backend
  const [stepContent, setStepContent] = useState({}); // To hold submission text, URL, and files
  const [expandedSteps, setExpandedSteps] = useState({});

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
        // Assuming response.data.projects contains an array of projects
        setProjects(response.data.projects);
      } catch (error) {
        console.error('Error fetching assigned projects:', error);
      }
    }
    if (user?.id) {
      fetchProjects();
    }
  }, [user?.id]);

  // Handle file upload for a given project (update local state)
  const handleFileUpload = (projectId, files) => {
    setStepContent(prev => ({
      ...prev,
      [projectId]: { ...prev[projectId], files }
    }));
  };

  // Handle submission of a step
  const handleStepComplete = async (projectId, stepIndex, content, projectUrl) => {
    try {
      const config = getAuthConfig();
      // Assuming your backend endpoint to update a step is:
      // PUT /api/projects/:id/steps/:stepNumber
      // We add 1 to stepIndex (since steps are numbered starting at 1)
      await axios.put(
          `http://localhost:5000/api/projects/${projectId}/steps/${stepIndex + 1}`,
          { content, projectUrl },
          config
      );
      // Update local state: mark the step as "pending-review" and store submission data
      setProjects(prevProjects =>
          prevProjects.map(project =>
              project.id === projectId
                  ? {
                    ...project,
                    steps: project.steps.map((step, idx) =>
                        idx === stepIndex
                            ? { ...step, status: 'pending-review', submission: content, projectUrl }
                            : step
                    )
                  }
                  : project
          )
      );
      sendNotification({
        userId: 'admin',
        message: `Step ${stepIndex + 1} completed for project ${projectId}`,
        type: 'info'
      });
    } catch (error) {
      console.error('Error submitting step for review:', error);
    }
  };

  // Add this new function to toggle step expansion
  const toggleStepExpansion = (projectId, stepIndex) => {
    setExpandedSteps(prev => ({
      ...prev,
      [`${projectId}-${stepIndex}`]: !prev[`${projectId}-${stepIndex}`]
    }));
  };

  // Render the project card for each project
  const renderProjectContent = (project) => {
    const completedSteps = project.steps ? project.steps.filter(step => step.status === 'completed').length : 0;
    const progress = project.steps && project.steps.length ? (completedSteps / project.steps.length) * 100 : 0;
    return (
        <div className="project-card" key={project.id}>
          <div className="project-header">
            <h3>{project.title}</h3>
            <div className="project-details">
              <span className="deadline">Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
              <span className="project-status" data-status={project.status}>
              Status: {project.status}
            </span>
            </div>
          </div>
          <div className="project-description">
            <p>{project.description}</p>
          </div>
          <div className="project-meta">
            <span>Assigned by: {project.assignedBy}</span>
            <span>Date Assigned: {new Date(project.assignedDate).toLocaleDateString()}</span>
          </div>
          {/* Display progress and steps if the project is not pending */}
          {project.status !== 'pending' && project.steps && (
              <>
                <div className="project-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <div className="project-steps">
                  {project.steps.map((step, index) => (
                      <div key={index} className={`step-card ${step.status}`}>
                        <div 
                          className="step-header" 
                          onClick={() => toggleStepExpansion(project.id, index)}
                        >
                          <h4>Step {index + 1}: {step.title}</h4>
                          <span className="expand-icon">
                            {expandedSteps[`${project.id}-${index}`] ? '▼' : '▶'}
                          </span>
                        </div>
                        
                        {expandedSteps[`${project.id}-${index}`] && (
                          <div className="step-content">
                            <p>{step.description}</p>
                            {step.requirements && (
                              <div className="step-requirements">
                                <h5>Requirements:</h5>
                                <ul>
                                  {step.requirements.map((req, reqIndex) => (
                                    <li key={reqIndex}>{req}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {step.status === 'in-progress' && (
                              <div className="step-submission">
                                <div className="submission-form">
                                  <label>Description of Work:</label>
                                  <textarea
                                    placeholder="Describe how you completed this step..."
                                    onChange={(e) =>
                                      setStepContent(prev => ({
                                        ...prev,
                                        [project.id]: { 
                                          ...prev[project.id], 
                                          text: e.target.value 
                                        }
                                      }))
                                    }
                                    value={stepContent[project.id]?.text || ''}
                                  />
                                  
                                  <label>Project URL:</label>
                                  <input
                                    type="url"
                                    placeholder="https://..."
                                    onChange={(e) =>
                                      setStepContent(prev => ({
                                        ...prev,
                                        [project.id]: { 
                                          ...prev[project.id], 
                                          projectUrl: e.target.value 
                                        }
                                      }))
                                    }
                                    value={stepContent[project.id]?.projectUrl || ''}
                                  />
                                  
                                  <label>Supporting Files (optional):</label>
                                  <input
                                    type="file"
                                    multiple
                                    onChange={(e) => handleFileUpload(project.id, e.target.files)}
                                  />
                                  
                                  <button
                                    className="submit-step-btn"
                                    onClick={() =>
                                      handleStepComplete(
                                        project.id,
                                        index,
                                        stepContent[project.id]?.text,
                                        stepContent[project.id]?.projectUrl
                                      )
                                    }
                                    disabled={
                                      !stepContent[project.id]?.text || 
                                      !stepContent[project.id]?.projectUrl
                                    }
                                  >
                                    Submit for Review
                                  </button>
                                </div>
                              </div>
                            )}

                            {step.status === 'pending-review' && (
                              <div className="step-status pending">
                                <p>Under Review</p>
                                <div className="submission-details">
                                  <p>Submitted work: {step.submission}</p>
                                  {step.projectUrl && (
                                    <p>
                                      Project URL:{' '}
                                      <a href={step.projectUrl} target="_blank" rel="noopener noreferrer">
                                        {step.projectUrl}
                                      </a>
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}

                            {step.status === 'revision-needed' && (
                              <div className="step-feedback">
                                <div className="feedback-content">
                                  <h5>Revision Required</h5>
                                  <p>{step.feedback}</p>
                                  <button
                                    className="revision-btn"
                                    onClick={() => {
                                      setProjects(prevProjects =>
                                        prevProjects.map(p =>
                                          p.id === project.id
                                            ? {
                                                ...p,
                                                steps: p.steps.map((s, i) =>
                                                  i === index ? { ...s, status: 'in-progress' } : s
                                                )
                                              }
                                            : p
                                        )
                                      );
                                    }}
                                  >
                                    Start Revision
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                  ))}
                </div>
              </>
          )}
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
