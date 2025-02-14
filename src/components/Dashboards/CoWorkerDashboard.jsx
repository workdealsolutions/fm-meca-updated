import React, { useState } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import CoworkerSidebar from '../Sidebar/CoworkerSidebar';
import CoworkerSettings from '../Settings/CoworkerSettings';
import './CoWorkerDashboard.css';

const CoWorkerDashboard = ({ user, projects, setProjects, sendNotification }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [activeTab, setActiveTab] = useState('projects');
  const [currentStep, setCurrentStep] = useState({});
  const [stepContent, setStepContent] = useState({});

  const handleStepComplete = (projectId, stepIndex, content) => {
    const formData = new FormData();
    formData.append('content', content);
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
                ? { ...step, status: 'pending-review', submission: content }
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
          <span className="deadline">Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
        </div>
        
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
                    type="file"
                    multiple
                    onChange={(e) => handleFileUpload(project.id, e.target.files)}
                  />
                  <button
                    onClick={() => handleStepComplete(
                      project.id,
                      index,
                      stepContent[project.id]?.text
                    )}
                  >
                    Submit for Review
                  </button>
                </div>
              )}

              {step.status === 'pending-review' && (
                <div className="step-status">
                  Waiting for admin review...
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
      </div>
    );
  };

  const filteredProjects = projects.filter(project => {
    if (activeTab === 'projects') return project.assignedTo === user.id;
    if (activeTab === 'inProgress') return project.assignedTo === user.id && project.status === 'in-progress';
    if (activeTab === 'pending') return project.assignedTo === user.id && project.steps.some(step => step.status === 'pending-review');
    if (activeTab === 'completed') return project.assignedTo === user.id && project.status === 'completed';
    return false;
  });

  return (
    <div className={`dashboard-container ${isMobile ? 'mobile' : ''}`}>
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
      <div className={`main-content ${isMobile ? 'mobile' : ''}`}>
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
          <div className="projects-grid">
            {filteredProjects.map(renderProjectContent)}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoWorkerDashboard;
