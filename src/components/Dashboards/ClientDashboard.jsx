import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Sidebar from '../Sidebar/Sidebar';
import ProjectCard from '../ProjectCard/ProjectCard';
import Messages from '../Messages/Messages';
import Profile from '../Profile/Profile';
import SampleProjects from '../SampleProjects/SampleProjects';
import ProjectStepsDisplay from '../ProjectStepsDisplay/ProjectStepsDisplay';
import './ClientDashboard.css';

const getProgressColor = (progress) => {
  if (progress >= 80) return '#4CAF50';
  if (progress >= 40) return '#FFA726';
  return '#FF5722';
};

// Updated to calculate progress using the steps in the project (using "approved" as completed)
const calculateProgress = (project) => {
  if (!project.steps || project.steps.length === 0) return 0;
  const completedStepsCount = project.steps.filter(step => step.status === 'approved').length;
  return (completedStepsCount / project.steps.length) * 100;
};

const ClientDashboard = ({ user, setProjects, sendNotification }) => {
  const { isDark } = useTheme();
  const theme = isDark ? 'dark' : 'light';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('projects'); // default tab remains "projects"
  const [projects, setLocalProjects] = useState([]); // dynamic projects state
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [inputMethod, setInputMethod] = useState('manual');
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    requirements: ''
  });

  // Fetch projects from the backend endpoint
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:5000/api/projects/my-requests', {
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
        // If steps are stored as a JSON string, parse them
        const parsedProjects = data.projects.map(project => {
          if (project.steps && typeof project.steps === 'string') {
            try {
              project.steps = JSON.parse(project.steps);
            } catch (e) {
              console.error('Error parsing steps for project', project.id, e);
              project.steps = [];
            }
          }
          return project;
        });
        setLocalProjects(parsedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // For now, we only handle the manual input method because the backend expects text fields.
    try {
      const token = localStorage.getItem('authToken');
      const payload = {
        title: formData.title,
        description: formData.description,
        budget: parseFloat(formData.budget),
        requirements: formData.requirements
      };

      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
            errorData.error ||
            (errorData.errors && JSON.stringify(errorData.errors)) ||
            'Failed to submit project request'
        );
      }

      const data = await response.json();
      alert(data.message);

      // Re-fetch projects after successful submission
      const projectsResponse = await fetch('http://localhost:5000/api/projects/my-requests', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        setLocalProjects(projectsData.projects);
      }

      // Also update parent's state if available
      setProjects?.(projects);

      // Reset form
      setFormData({ title: '', description: '', budget: '', requirements: '' });
      setSelectedFile(null);
    } catch (error) {
      console.error("Error submitting project request:", error);
      alert("Error submitting project request: " + error.message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending_approval: '#808080',
      approved: '#333333',
      rejected: '#4d4d4d',
      in_progress: '#666666',
      completed: '#1a1a1a'
    };
    return colors[status] || '#808080';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const sortProjects = (projects) => {
    return [...projects].sort((a, b) => {
      const statusPriority = {
        in_progress: 1,
        pending_approval: 2,
        completed: 3,
        rejected: 4
      };
      return statusPriority[a.status] - statusPriority[b.status];
    });
  };

  const renderNewProjectSection = () => (
      <div className={`new-project-section ${theme}`}>
        <h2>Submit New Project</h2>
        <div className="input-method-toggle">
          <button
              className={`toggle-button ${inputMethod === 'manual' ? 'active' : ''}`}
              onClick={() => setInputMethod('manual')}
          >
            Manual Input
          </button>
          <button
              className={`toggle-button ${inputMethod === 'file' ? 'active' : ''}`}
              onClick={() => setInputMethod('file')}
          >
            Upload File
          </button>
        </div>
        <form onSubmit={handleSubmit} className="project-form">
          {inputMethod === 'manual' ? (
              <>
                <div className="form-group">
                  <label>Title</label>
                  <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Project Title"
                      required
                  />
                </div>
                <div className="form-group">
                  <label>Project Description</label>
                  <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your project in detail"
                      required
                  />
                </div>
                <div className="form-group">
                  <label>Requirements</label>
                  <textarea
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleInputChange}
                      placeholder="List your specific requirements"
                      required
                  />
                </div>
              </>
          ) : (
              <div className="form-group">
                <label>Project File</label>
                <div
                    className="file-upload-container"
                    onClick={() => document.getElementById('project-file').click()}
                >
                  <input
                      id="project-file"
                      type="file"
                      className="file-input"
                      onChange={handleFileChange}
                      required
                  />
                  {selectedFile ? (
                      <div className="file-info">Selected file: {selectedFile.name}</div>
                  ) : (
                      <p>Click to upload project file</p>
                  )}
                </div>
              </div>
          )}
          <div className="form-group">
            <label>Budget (USD)</label>
            <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                placeholder="Enter your budget"
                required
            />
          </div>
          <button type="submit">Submit Project</button>
        </form>
      </div>
  );

  // Render content based on the active tab.
  // The "projects" tab remains as originally provided (using SampleProjects),
  // and the "progress" tab shows each project's progress with completion percentage.
  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <Profile user={user} theme={theme} />;
      case 'messages':
        return <Messages user={user} sendNotification={sendNotification} theme={theme} />;
      case 'progress':
        return (
            <div className="progress-tracking-section">
              <h2>Project Progress Tracking</h2>
              {projects.map(project => (
                  <div key={project.id}>
                    <h3>{project.title}</h3>
                    <p>Progress: {calculateProgress(project).toFixed(2)}%</p>
                    <ProjectStepsDisplay
                        theme={theme}
                        steps={project.steps}
                        completedSteps={project.steps ? project.steps.filter(step => step.status === 'approved').map(step => step.id) : []}
                    />
                  </div>
              ))}
            </div>
        );
      case 'new':
        return renderNewProjectSection();
      default: // 'projects' tab remains unchanged
        return (
            <div className="projects-section">
              <h2>My Projects</h2>
              {loadingProjects ? (
                  <p>Loading projects...</p>
              ) : (
                  <SampleProjects
                      user={user}
                      projects={sortProjects(projects)}
                      getStatusColor={getStatusColor}
                      getProgressColor={getProgressColor}
                      formatDate={formatDate}
                  />
              )}
            </div>
        );
    }
  };

  return (
      <div className={`dashboard-container ${theme}`}>
        <div className="menu-toggle">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? '×' : '≡'}
          </button>
        </div>
        <Sidebar
            user={user}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isOpen={sidebarOpen}
            setIsOpen={setSidebarOpen}
        />
        <div className={`main-content ${theme}`}>
          {renderContent()}
        </div>
      </div>
  );
};

export default ClientDashboard;
