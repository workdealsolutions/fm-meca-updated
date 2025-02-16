import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useIsMobile } from '../../hooks/useIsMobile';
import Sidebar from '../Sidebar/Sidebar';
import ProjectCard from '../ProjectCard/ProjectCard';
import Messages from '../Messages/Messages';
import Profile from '../Profile/Profile';
import SampleProjects, { sampleProjects } from '../SampleProjects/SampleProjects';
import './ClientDashboard.css';

const getProgressColor = (progress) => {
  if (progress >= 80) return '#4CAF50';
  if (progress >= 40) return '#FFA726';
  return '#FF5722';
};

const ClientDashboard = ({ user, setProjects, sendNotification }) => {
  const { isDark } = useTheme();
  const theme = isDark ? 'dark' : 'light';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('projects'); // Ensure this is set to 'projects' by default
  const [projects, setLocalProjects] = useState(sampleProjects);
  const [inputMethod, setInputMethod] = useState('manual');
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    budget: '',
    requirements: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newProject;

    if (inputMethod === 'manual') {
      newProject = {
        id: Date.now(),
        ...formData,
        status: 'pending_approval',
        client: user.email,
        progress: 0,
        submittedDate: new Date().toISOString()
      };
    } else {
      newProject = {
        id: Date.now(),
        description: selectedFile ? selectedFile.name : 'Uploaded project file',
        budget: formData.budget,
        requirements: `File uploaded: ${selectedFile ? selectedFile.name : 'No file'}`,
        status: 'pending_approval',
        client: user.email,
        progress: 0,
        submittedDate: new Date().toISOString()
      };
    }

    const updatedProjects = [...projects, newProject];
    setLocalProjects(updatedProjects);
    setProjects?.(updatedProjects);
    setFormData({ description: '', budget: '', requirements: '' });
    setSelectedFile(null);
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

  const renderNewProjectSection = () => {
    return (
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
                  <div className="file-info">
                    Selected file: {selectedFile.name}
                  </div>
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
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'profile':
        return <Profile user={user} theme={theme} />;
      case 'messages':
        return <Messages user={user} sendNotification={sendNotification} theme={theme} />;
      case 'progress':
        return (
          <div className="progress-tracking-section">
            <h2>Project Progress Tracking</h2>
            <SampleProjects
              user={user}
              getStatusColor={getStatusColor}
              getProgressColor={getProgressColor}
              formatDate={formatDate}
            />
          </div>
        );
      case 'new':
        return renderNewProjectSection();
      default: // This case handles the 'projects' tab
        return (
          <div className="projects-section">
            <h2>My Projects</h2>
            <SampleProjects
              user={user}
              getStatusColor={getStatusColor}
              getProgressColor={getProgressColor}
              formatDate={formatDate}
            />
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