import React, { useState } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import Sidebar from '../Sidebar/Sidebar';
import ProjectCard from '../ProjectCard/ProjectCard';
import ClientSettings from '../ClientSettings/ClientSettings';
import Messages from '../Messages/Messages';
import './ClientDashboard.css';

const sampleProjects = [
  {
    id: 1,
    description: "E-commerce Website Development",
    budget: 5000,
    requirements: "- React.js frontend\n- Node.js backend\n- Payment integration\n- Responsive design",
    status: "in_progress",
    client: "user@example.com",
    progress: 65,
    submittedDate: "2024-01-15T10:30:00.000Z"
  },
  {
    id: 2,
    description: "Mobile App UI Design",
    budget: 2500,
    requirements: "- Modern minimal design\n- iOS and Android layouts\n- 10 core screens\n- Design system",
    status: "pending_approval",
    client: "user@example.com",
    progress: 0,
    submittedDate: "2024-01-20T15:45:00.000Z"
  },
  {
    id: 3,
    description: "WordPress Blog Migration",
    budget: 800,
    requirements: "- Transfer existing content\n- Maintain SEO rankings\n- Update theme\n- Speed optimization",
    status: "completed",
    client: "user@example.com",
    progress: 100,
    submittedDate: "2023-12-01T09:00:00.000Z"
  },
  {
    id: 4,
    description: "Logo Design Package",
    budget: 1200,
    requirements: "- 3 concept options\n- Brand colors\n- Vector files\n- Brand guidelines",
    status: "rejected",
    client: "user@example.com",
    progress: 0,
    submittedDate: "2024-01-10T11:20:00.000Z"
  }
];

const getProgressColor = (progress) => {
  if (progress >= 80) return '#4CAF50';
  if (progress >= 40) return '#FFA726';
  return '#FF5722';
};

const ClientDashboard = ({ user, setProjects, sendNotification }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setLocalProjects] = useState(sampleProjects);
  const [inputMethod, setInputMethod] = useState('manual'); // Add this
  const [selectedFile, setSelectedFile] = useState(null); // Add this
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

  // Add this function
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // You could also read the file content here if needed
    }
  };

  // Update both local and parent state when adding new projects
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
        budget: formData.budget, // Still need budget even with file upload
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
      pending_approval: '#808080', // grey
      approved: '#333333',        // dark grey
      rejected: '#4d4d4d',        // medium grey
      in_progress: '#666666',     // lighter grey
      completed: '#1a1a1a'        // almost black
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
      // Sort by status priority
      const statusPriority = {
        in_progress: 1,
        pending_approval: 2,
        completed: 3,
        rejected: 4
      };
      return statusPriority[a.status] - statusPriority[b.status];
    });
  };

  return (
    <div className="dashboard-container">
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
      <div className="main-content">
        {activeTab === 'settings' ? (
          <ClientSettings user={user} />
        ) : activeTab === 'messages' ? (
          <Messages user={user} sendNotification={sendNotification} />
        ) : activeTab === 'new' ? (
          <div className="new-project-section">
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
        ) : (
          <div className="projects-section">
            <h2>My Projects</h2>
            <div className="projects-list">
              {sortProjects(projects)
                .filter(p => p.client === user.email)
                .map(project => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    getStatusColor={getStatusColor}
                    getProgressColor={getProgressColor}
                    formatDate={formatDate}
                  />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;