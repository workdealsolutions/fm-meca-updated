import React, { useState, useEffect } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import CoworkerSidebar from '../Sidebar/CoworkerSidebar';
import CoworkerSettings from '../Settings/CoworkerSettings';
import { sampleProjects } from '../../mockData/sampleProjects';
import './CoWorkerDashboard.css';
import { useTheme } from '../../context/ThemeContext';

const CoWorkerDashboard = ({ user = {}, sendNotification }) => {
  const isMobile = useIsMobile();
  const { isDark } = useTheme();
  const theme = isDark ? 'dark' : 'light';
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [activeTab, setActiveTab] = useState('projects');
  const [currentStep, setCurrentStep] = useState({});
  const [stepContent, setStepContent] = useState({});
  const [projects, setProjects] = useState([]); // Initialize with empty array

  // Load sample projects when component mounts
  useEffect(() => {
    try {
      // Set a default user ID if not provided
      const defaultUserId = 'coworker1';
      const currentUserId = user?.id || defaultUserId;
      
      // Assign the user ID to the sample projects
      const projectsWithAssignee = sampleProjects.map(project => ({
        ...project,
        assignedTo: currentUserId
      }));
      
      setProjects(projectsWithAssignee);
      console.log('Loaded sample projects:', projectsWithAssignee);
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]); // Set empty array on error
    }
  }, [user?.id]);

  const handleStepComplete = (projectId, stepIndex, content, projectUrl) => {
    const formData = new FormData();
    formData.append('content', content);
    formData.append('projectUrl', projectUrl);
    formData.append('files', stepContent[projectId]?.files);

    // In a real application, you would make an API call here
    sendNotification({
      userId: 'admin',
      message: `Step ${stepIndex + 1} completed for project ${projectId}`,
      type: 'info'
    });

    setProjects(projects.map(project =>
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
    ));
  };

  const handleFileUpload = (projectId, files) => {
    setStepContent(prev => ({
      ...prev,
      [projectId]: { ...prev[projectId], files }
    }));
  };

  const renderProjectContent = (project) => {
    const completedSteps = project.steps.filter(step => step.status === 'completed').length;
    const progress = (completedSteps / project.steps.length) * 100;

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
        
        {/* Only show progress and steps if project is accepted */}
        {project.status !== 'pending' && (
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
                  <h4>Step {index + 1}: {step.title}</h4>
                  <p>{step.description}</p>
                  
                  {step.status === 'in-progress' && (
                    <div className="step-submission">
                      <textarea
                        placeholder="Describe your work for this step..."
                        onChange={(e) => setStepContent(prev => ({
                          ...prev,
                          [project.id]: { ...prev[project.id], text: e.target.value }
                        }))}
                      />
                      <input
                        type="url"
                        placeholder="Enter project URL"
                        onChange={(e) => setStepContent(prev => ({
                          ...prev,
                          [project.id]: { ...prev[project.id], projectUrl: e.target.value }
                        }))}
                      />
                      <input
                        type="file"
                        multiple
                        onChange={(e) => handleFileUpload(project.id, e.target.files)}
                      />
                      <button
                        onClick={() => handleStepComplete(
                          project.id,
                          index,
                          stepContent[project.id]?.text,
                          stepContent[project.id]?.projectUrl
                        )}
                      >
                        Submit for Review
                      </button>
                    </div>
                  )}

                  {step.status === 'pending-review' && (
                    <div className="step-status">
                      <p>Waiting for admin review...</p>
                      {step.projectUrl && (
                        <p>Project URL: <a href={step.projectUrl} target="_blank" rel="noopener noreferrer">{step.projectUrl}</a></p>
                      )}
                    </div>
                  )}

                  {step.status === 'revision-needed' && (
                    <div className="step-feedback">
                      <p>Revision needed: {step.feedback}</p>
                      <button
                        onClick={() => {
                          // Reset step status to in-progress
                          const updatedProjects = projects.map(p =>
                            p.id === project.id
                              ? {
                                  ...p,
                                  steps: p.steps.map((s, i) =>
                                    i === index
                                      ? { ...s, status: 'in-progress' }
                                      : s
                                  )
                                }
                              : p
                          );
                          setProjects(updatedProjects);
                        }}
                      >
                        Start Revision
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Show accept/reject buttons for pending projects */}
        {project.status === 'pending' && (
          <div className="project-actions">
            <button 
              className="accept-btn"
              onClick={() => handleProjectAction(project.id, 'accept')}
            >
              Accept Project
            </button>
            <button 
              className="reject-btn"
              onClick={() => handleProjectAction(project.id, 'reject')}
            >
              Decline Project
            </button>
          </div>
        )}
      </div>
    );
  };

  // Add project action handler
  const handleProjectAction = (projectId, action) => {
    setProjects(projects.map(project => 
      project.id === projectId
        ? {
            ...project,
            status: action === 'accept' ? 'in-progress' : 'rejected'
          }
        : project
    ));

    sendNotification({
      userId: 'admin',
      message: `Project ${projectId} was ${action}ed by ${user.name}`,
      type: 'info'
    });
  };

  // Update filtered projects logic with null check
  const filteredProjects = projects?.filter(project => {
    if (!project || !user) return false;
    
    const isAssignedToUser = project.assignedTo === user.id;
    
    switch (activeTab) {
      case 'projects':
        // Show all assigned projects that are either new/pending or in progress
        return isAssignedToUser && (project.status === 'pending' || project.status === 'new' || !project.status);
      case 'inProgress':
        return isAssignedToUser && project.status === 'in-progress';
      case 'pending':
        return isAssignedToUser && project.steps?.some(step => step.status === 'pending-review');
      case 'completed':
        return isAssignedToUser && project.status === 'completed';
      default:
        return false;
    }
  }) || [];

  // Add a message when no projects are found
  const renderContent = () => {
    if (filteredProjects.length === 0) {
      return (
        <div className="no-projects">
          <h3>No projects found</h3>
          <p>There are currently no projects in this category.</p>
        </div>
      );
    }
    return (
      <div className="projects-grid">
        {filteredProjects.map(renderProjectContent)}
      </div>
    );
  };

  // Update the return statement to use renderContent
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
              // Handle profile update
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
