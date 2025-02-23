import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';
import Sidebar from '../Sidebar';
import FeedbackModal from '../FeedbackModal';
import './AdminDashboard.css';
import ProfileSettings from '../pages/ProfileSettings';
import ProjectSteps from '../ProjectSteps';

const AdminDashboard = ({ sendNotification }) => {
  const { isDark } = useTheme();
  const theme = isDark ? 'dark' : 'light';

  // Local state for projects, clients, and coworkers
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [coworkers, setCoworkers] = useState([]);

  const [activeTab, setActiveTab] = useState('pending'); // "pending" or "completed"
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCoworker, setSelectedCoworker] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showStepsModal, setShowStepsModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // Helper to get auth config with token
  const getAuthConfig = () => {
    const token = localStorage.getItem('authToken'); // adjust as needed
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  // Fetch projects for admin on mount
  useEffect(() => {
    async function fetchProjects() {
      try {
        const config = getAuthConfig();
        const response = await axios.get('http://localhost:5000/api/projects', config);
        // Expecting response { projects: [...] }
        setProjects(response.data.projects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    }
    fetchProjects();
  }, []);

  // Fetch clients list
  useEffect(() => {
    async function fetchClients() {
      try {
        const config = getAuthConfig();
        const response = await axios.get('http://localhost:5000/api/clients', config);
        const fetchedClients = response.data.clients.map(client => ({
          ...client,
          name: `${client.firstname} ${client.lastname}`
        }));
        setClients(fetchedClients);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    }
    fetchClients();
  }, []);

  // Fetch coworkers list
  useEffect(() => {
    async function fetchCoworkers() {
      try {
        const config = getAuthConfig();
        const response = await axios.get('http://localhost:5000/api/coworkers', config);
        setCoworkers(response.data.coworkers);
      } catch (error) {
        console.error('Error fetching coworkers:', error);
      }
    }
    fetchCoworkers();
  }, []);

  // Handle mobile menu scroll behavior
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    closeMobileMenu();
  }, [activeTab]);

  useEffect(() => {
    if (showStepsModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => { document.body.classList.remove('modal-open'); };
  }, [showStepsModal]);

  // API calls for project actions

  // Initial review (admin approves or declines)
  const handleInitialReview = async (projectId, isApproved, feedback = '') => {
    try {
      const config = getAuthConfig();
      const response = await axios.patch(
          `http://localhost:5000/api/projects/${projectId}/review`,
          { status: isApproved ? 'admin-approved' : 'declined', adminFeedback: feedback },
          config
      );
      setProjects(prevProjects =>
          prevProjects.map(project =>
              project.id === projectId ? response.data : project
          )
      );
      const project = response.data;
      if (project) {
        sendNotification({
          userId: project.clientId,
          message: isApproved
              ? 'Your project has been approved and will be assigned to a coworker.'
              : `Your project has been declined. Reason: ${feedback}`,
          type: isApproved ? 'success' : 'error'
        });
      }
    } catch (error) {
      console.error('Error during initial review:', error);
    }
  };

  // Final review (admin marks project as completed or revision-needed)
  const handleFinalReview = async (projectId, isApproved, feedback = '') => {
    try {
      const config = getAuthConfig();
      const response = await axios.patch(
          `http://localhost:5000/api/projects/${projectId}/final-review`,
          { status: isApproved ? 'completed' : 'revision-needed', adminFeedback: feedback },
          config
      );
      setProjects(prevProjects =>
          prevProjects.map(project =>
              project.id === projectId ? response.data : project
          )
      );
      const project = response.data;
      if (project) {
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
    } catch (error) {
      console.error('Error during final review:', error);
    }
  };

  // Save steps and assign project to coworker
  const handleSaveSteps = async (projectId, { steps, coworkerId, deadline }) => {
    try {
      const config = getAuthConfig();
      const response = await axios.patch(
          `http://localhost:5000/api/projects/${projectId}/steps`,
          { steps, coworkerId, deadline },
          config
      );
      setProjects(prevProjects =>
          prevProjects.map(project =>
              project.id === projectId ? response.data : project
          )
      );
      sendNotification({
        userId: coworkerId,
        message: 'A new project has been assigned to you',
        type: 'info'
      });
      setShowStepsModal(false);
      setSelectedProjectId(null);
    } catch (error) {
      console.error('Error saving steps:', error);
    }
  };

  // UI Helpers
  const openFeedbackModal = (project, type) => {
    setSelectedProject({ ...project, reviewType: type });
    setShowFeedbackModal(true);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const handleTabChange = (tab) => { setActiveTab(tab); closeMobileMenu(); };

  // Sample admin info (replace with your actual admin data)
  const adminInfo = {
    name: "David Smith",
    email: "david.smith@example.com",
    avatar: "/path-to-admin-image.jpg",
    role: "Administrator"
  };

  // Render project card
  const renderProjectCard = (project) => (
      <div className={`project-card ${theme}`} key={project.id}>
        <div className="project-header">
          <h4 className={theme}>{project.client}</h4>
          <div className="header-right">
            {project.status === 'completed-pending-review' && project.completedWorkUrl && (
                <span className={`url-indicator ${theme}`}>📎 Work Attached</span>
            )}
            <span className={`status-badge ${project.status} ${theme}`}>
            {project.status.replace(/-/g, ' ')}
          </span>
          </div>
        </div>
        <div className={`project-details ${theme}`}>
          <p><strong>Description:</strong> {project.description}</p>
          <p><strong>Budget:</strong> ${project.budget.toLocaleString()}</p>
          <p><strong>Submitted:</strong> {new Date(project.created_at).toLocaleDateString()}</p>
          {project.status === 'pending' && (
              <div className="action-buttons">
                <button onClick={() => handleInitialReview(project.id, true)}>Approve Project</button>
                <button onClick={() => openFeedbackModal(project, 'initial')}>Decline Project</button>
              </div>
          )}
          {project.status === 'admin-approved' && (
              <button onClick={() => { setSelectedProjectId(project.id); setShowStepsModal(true); }}>
                Define Steps &amp; Assign Project
              </button>
          )}
          {project.status === 'completed-pending-review' && (
              <div className="review-buttons">
                <button onClick={() => handleFinalReview(project.id, true)}>Approve &amp; Send to Client</button>
                <button onClick={() => openFeedbackModal(project, 'final')}>Request Revision</button>
              </div>
          )}
        </div>
      </div>
  );

  // Updated getMainContent: "pending" tab shows all projects not yet completed;
  // "completed" tab shows only completed projects.
  const getMainContent = () => {
    if (showSettings) {
      return (
          <ProfileSettings
              admin={adminInfo}
              onSave={() => setShowSettings(false)}
              onBack={() => setShowSettings(false)}
          />
      );
    }
    if (selectedClient) {
      // Render client details (if implemented)
      return <div>Client Details</div>;
    }
    if (selectedCoworker) {
      // Render coworker details (if implemented)
      return <div>Coworker Details</div>;
    }
    const filteredProjects = projects.filter(p =>
        activeTab === 'pending'
            ? p.status !== 'completed'
            : p.status === 'completed'
    );
    return (
        <div className="projects-grid">
          {filteredProjects.map(renderProjectCard)}
        </div>
    );
  };

  return (
      <div className={`dashboard-container ${theme}`}>
        <div className="menu-toggle">
          <button onClick={toggleMobileMenu}>
            {sidebarOpen ? '×' : '≡'}
          </button>
        </div>
        <Sidebar
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            adminName={adminInfo.name}
            adminImage={adminInfo.avatar}
            coworkers={coworkers}
            clients={clients}
            onCoworkerSelect={(cw) => { setSelectedCoworker(cw); closeMobileMenu(); }}
            onClientSelect={(client) => { setSelectedClient(client); setSelectedCoworker(null); setShowSettings(false); closeMobileMenu(); }}
            onSettingsClick={() => { setShowSettings(true); setSelectedCoworker(null); closeMobileMenu(); }}
            className={isMobileMenuOpen ? 'mobile-visible' : ''}
            onClose={closeMobileMenu}
            isOpen={sidebarOpen}
            setIsOpen={setSidebarOpen}
        />
        <div className={`main-content ${theme}`}>
          <h2 className={`dashboard-title ${theme}`}>
            {showSettings
                ? 'Profile Settings'
                : selectedClient
                    ? `Client: ${selectedClient.name}`
                    : selectedCoworker
                        ? 'Coworker Profile'
                        : activeTab === 'pending'
                            ? 'Active Projects'
                            : 'Completed Projects'}
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
                theme={theme}
            />
        )}

        {showStepsModal && (
            <div className={`modal ${theme}`}>
              <div className="modal-content">
                <ProjectSteps
                    theme={theme}
                    coworkers={coworkers}
                    onSaveSteps={(data) => handleSaveSteps(selectedProjectId, data)}
                />
                <button className={`close-modal ${theme}`} onClick={() => setShowStepsModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
        )}
      </div>
  );
};

export default AdminDashboard;
