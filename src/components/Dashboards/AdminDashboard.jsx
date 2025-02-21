import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Sidebar from '../Sidebar';
import FeedbackModal from '../FeedbackModal';
import ProfileSettings from '../pages/ProfileSettings';
import './AdminDashboard.css';
import { jwtDecode } from 'jwt-decode'; // Named import

// Helper function to extract admin name from JWT token
const getAdminInfo = () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    try {
      const decoded = jwtDecode(token);
      const name = `${decoded.firstname || ''} ${decoded.lastname || ''}`.trim();
      return {
        name: name || "David Smith",
        email: "david.smith@example.com",         // Keep avatar and email as is
        avatar: "/path-to-admin-image.jpg",
        role: "Administrator"
      };
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }
  return {
    name: "David Smith",
    email: "david.smith@example.com",
    avatar: "/path-to-admin-image.jpg",
    role: "Administrator"
  };
};

const AdminDashboard = ({ projects, setProjects, sendNotification }) => {
  const { isDark } = useTheme();
  const theme = isDark ? 'dark' : 'light';
  const [activeTab, setActiveTab] = useState('pending');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);// Add these state variables at the top of your component:
  const [selectedCoworkers, setSelectedCoworkers] = useState({});
  const [selectedCoworker, setSelectedCoworker] = useState(null);
  const [deadlines, setDeadlines] = useState({});

  const [showSettings, setShowSettings] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [localProjects, setLocalProjects] = useState([]);

  // New state for fetched coworkers and clients
  const [coworkersData, setCoworkersData] = useState([]);
  const [clientsData, setClientsData] = useState([]);

  // Fetch projects from the backend
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch projects');
      }
      const data = await response.json();
      setLocalProjects(data.projects);
      setProjects(data.projects);
    } catch (error) {
      console.error('Error fetching project requests:', error);
    }
  };

  // Fetch coworkers from the backend
  useEffect(() => {
    const fetchCoworkers = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:5000/api/coworkers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch coworkers');
        }
        const data = await response.json();
        setCoworkersData(data.coworkers);
      } catch (error) {
        console.error('Error fetching coworkers:', error);
      }
    };

    fetchCoworkers();
  }, []);

  // Fetch clients from the backend
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:5000/api/clients', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch clients');
        }
        const data = await response.json();
        setClientsData(data.clients);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    closeMobileMenu();
  }, [activeTab]);

  const handleInitialReview = async (projectId, isApproved, feedback = '') => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: isApproved ? 'approved' : 'declined' })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update project status');
      }
      await fetchProjects();
      const project = localProjects.find(p => p.id === projectId);
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

  const handleAssignToCoworker = async (projectId, coworkerId, deadline) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ coworker_id: coworkerId })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to assign project');
      }
      await fetchProjects();
      sendNotification({
        userId: coworkerId,
        message: 'A new project has been assigned to you',
        type: 'info'
      });
    } catch (error) {
      console.error('Error assigning project:', error);
    }
  };

  const handleFinalReview = async (projectId, isApproved, feedback = '') => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: isApproved ? 'approved' : 'declined' })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update project status');
      }
      await fetchProjects();
      const project = localProjects.find(p => p.id === projectId);
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

  const openFeedbackModal = (project, type) => {
    setSelectedProject({ ...project, reviewType: type });
    setShowFeedbackModal(true);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    closeMobileMenu();
  };

  const renderProjectCard = (project) => (
      <div className={`project-card ${theme}`} key={project.id}>
        <div className="project-header">
          <h4 className={theme}>{project.client}</h4>
          <div className="header-right">
            {project.status === 'completed-pending-review' && project.completedWorkUrl && (
                <span className={`url-indicator ${theme}`}>
              📎 Work Attached
            </span>
            )}
            <span className={`status-badge ${project.status} ${theme}`}>
            {project.status.replace(/-/g, ' ')}
          </span>
          </div>
        </div>
        <div className={`project-details ${theme}`}>
          <p><strong>Description:</strong> {project.description}</p>
          <p><strong>Budget:</strong> ${project.budget?.toLocaleString()}</p>
          <p><strong>Submitted:</strong> {new Date(project.created_at).toLocaleDateString()}</p>
          {project.status === 'completed-pending-review' && project.completedWorkUrl && (
              <p>
                <strong>Completed Work:</strong>{' '}
                <a
                    href={project.completedWorkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`work-url ${theme}`}
                >
                  View Work
                </a>
              </p>
          )}
          <div className="requirements-section">
            <strong>Requirements:</strong>
            <p style={{ whiteSpace: 'pre-line' }}>{project.requirements}</p>
          </div>
          {project.status === 'pending' && (
              <div className={`action-buttons ${theme}`}>
                <button
                    className="button approve-button"
                    onClick={() => handleInitialReview(project.id, true)}
                >
                  Approve Project
                </button>
                <button
                    className={`button reject-button ${theme}`}
                    onClick={() => openFeedbackModal(project, 'initial')}
                >
                  Decline Project
                </button>
              </div>
          )}
          {project.status === 'approved' && (
              <div className="assignment-section">
                <select
                    onChange={(e) =>
                        setSelectedCoworkers(prev => ({ ...prev, [project.id]: e.target.value }))
                    }
                    className="select-coworker"
                    value={selectedCoworkers[project.id] || ''}
                >
                  <option value="">Select Coworker</option>
                  {coworkersData.map(coworker => (
                      <option key={coworker.id} value={coworker.id}>
                        {coworker.firstname + " " + coworker.lastname}
                      </option>
                  ))}
                </select>
                <input
                    type="date"
                    onChange={(e) =>
                        setDeadlines(prev => ({ ...prev, [project.id]: e.target.value }))
                    }
                    value={deadlines[project.id] || ''}
                    min={new Date().toISOString().split('T')[0]}
                    className="deadline-input"
                />
                <button
                    className="button approve-button"
                    onClick={() => {
                      const coworkerId = selectedCoworkers[project.id];
                      const deadline = deadlines[project.id];
                      if (!coworkerId) {
                        alert("Please select a coworker before assigning the project.");
                        return;
                      }
                      handleAssignToCoworker(project.id, coworkerId, deadline);
                    }}
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
        <button className={`back-button ${theme}`} onClick={() => setSelectedCoworker(null)}>
          Back to Projects
        </button>
        <div className={`coworker-profile ${theme}`}>
          <div className="coworker-header">
            <div className="coworker-avatar">
              <img src={coworker.avatar || '/default-avatar.png'} alt={coworker.firstname} />
            </div>
            <h2>{coworker.firstname + ' ' + coworker.lastname}</h2>
            <span className={`status-indicator ${coworker.status || 'active'} ${theme}`}>
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
            <div className="info-card availability-card">
              <label>Availability</label>
              <div className="availability-grid">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                    <div key={day} className="day-slot">
                      <span className="day-label">{day}</span>
                      <div className="time-slots">
                        <div className={`time-slot ${coworker.availability?.[day]?.morning ? 'available' : 'unavailable'}`}>
                          AM
                        </div>
                        <div className={`time-slot ${coworker.availability?.[day]?.afternoon ? 'available' : 'unavailable'}`}>
                          PM
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
  );

  const renderClientDetails = (client) => (
      <div className={`client-details ${theme}`}>
        <button className={`back-button ${theme}`} onClick={() => setSelectedClient(null)}>
          Back to Projects
        </button>
        <div className={`client-profile ${theme}`}>
          <div className="client-header">
            <h2>{client.firstname + " " + client.lastname}</h2>
            <div className="client-overview">
              <div className="stat-card">
                <h3>Total Projects</h3>
                <p>{client.projectsCount}</p>
              </div>
              <div className="stat-card">
                <h3>Satisfaction Level</h3>
                <p>{client.satisfactionLevel}%</p>
              </div>
            </div>
          </div>
          <div className="client-feedback-section">
            <h3>Latest Feedback</h3>
            <blockquote className={`feedback-quote ${theme}`}>
              "{client.latestFeedback}"
            </blockquote>
          </div>
          <div className="client-projects">
            <h3>Projects History</h3>
            <div className="projects-list">
              {localProjects
                  .filter(project => project.client === client.firstname)
                  .map(project => (
                      <div key={project.id} className={`project-item ${theme}`}>
                        <h4>{project.description}</h4>
                        <div className="project-meta">
                          <span>Status: {project.status}</span>
                          <span>Budget: ${project.budget}</span>
                          <span>Date: {new Date(project.submissionDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
  );

  const adminInfo = getAdminInfo();

  const handleSettingsSave = (updatedSettings) => {
    console.log('Saving settings:', updatedSettings);
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
    if (selectedClient) {
      return renderClientDetails(selectedClient);
    }
    if (selectedCoworker) {
      return renderCoworkerDetails(selectedCoworker);
    }
    return (
        <div className="projects-grid">
          {(localProjects || [])
              .filter(p => {
                if (activeTab === 'pending') {
                  return p.status === 'pending' || p.status === 'approved';
                }
                return p.status === 'completed-pending-review';
              })
              .map(renderProjectCard)}
        </div>
    );
  };

  return (
      <div className={`dashboard-container ${theme}`}>
        <div className="menu-toggle">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? '×' : '≡'}
          </button>
        </div>
        <Sidebar
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            adminName={adminInfo.name}
            adminImage={adminInfo.avatar}
            coworkers={coworkersData}
            clients={clientsData}
            onCoworkerSelect={(coworker) => {
              setSelectedCoworker(coworker);
              closeMobileMenu();
            }}
            onClientSelect={(client) => {
              setSelectedClient(client);
              setSelectedCoworker(null);
              setShowSettings(false);
              closeMobileMenu();
            }}
            onSettingsClick={() => {
              setShowSettings(true);
              setSelectedCoworker(null);
              closeMobileMenu();
            }}
            className={`${isMobileMenuOpen ? 'mobile-visible' : ''}`}
            onClose={closeMobileMenu}
            isOpen={sidebarOpen}
            setIsOpen={setSidebarOpen}
        />
        <div className={`main-content ${theme}`}>
          <h2 className={`dashboard-title ${theme}`}>
            {showSettings
                ? 'Profile Settings'
                : selectedClient
                    ? `Client: ${selectedClient.firstname + " " + selectedClient.lastname}`
                    : selectedCoworker
                        ? 'Coworker Profile'
                        : activeTab === 'pending'
                            ? 'New Projects'
                            : 'Projects Under Review'}
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
      </div>
  );
};

export default AdminDashboard;
