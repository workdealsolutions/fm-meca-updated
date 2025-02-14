import React, { useState } from 'react';
import './CoworkerSettings.css';

const CoworkerSettings = ({ user, onUpdateProfile }) => {
  const [profileData, setProfileData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    skills: user.skills || [],
    availability: user.availability || 'full-time',
    bio: user.bio || '',
    newSkill: ''
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    projectUpdates: true,
    deadlineReminders: true,
    adminMessages: true
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    onUpdateProfile({ ...profileData, notifications });
  };

  const handleAddSkill = () => {
    if (profileData.newSkill.trim()) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, prev.newSkill.trim()],
        newSkill: ''
      }));
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  return (
    <div className="coworker-settings">
      <div className="settings-header">
        <h2>Profile Settings</h2>
        <p>Manage your account preferences and personal information</p>
      </div>
      
      <form onSubmit={handleProfileUpdate}>
        {/* Personal Information Section */}
        <div className="settings-section">
          <h3>
            <span className="section-icon">👤</span>
            Personal Information
          </h3>
          <div className="profile-picture-upload">
            <div className="profile-picture">
              <img src={user.avatar || '/default-avatar.png'} alt="Profile" />
              <div className="upload-overlay">
                <span>📷</span>
                <input type="file" accept="image/*" style={{ display: 'none' }} />
              </div>
            </div>
            <div className="upload-info">
              <h4>{user.name}</h4>
              <p>Upload a new profile picture</p>
            </div>
          </div>
          
          <div className="form-group">
            <label>Full Name</label>
            <input
              className="form-control"
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData(prev => ({
                ...prev,
                name: e.target.value
              }))}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              className="form-control"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData(prev => ({
                ...prev,
                email: e.target.value
              }))}
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              className="form-control"
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData(prev => ({
                ...prev,
                phone: e.target.value
              }))}
            />
          </div>
        </div>

        {/* Professional Details Section */}
        <div className="settings-section">
          <h3>
            <span className="section-icon">💼</span>
            Professional Details
          </h3>
          <div className="form-group">
            <label>Bio</label>
            <textarea
              className="form-control"
              value={profileData.bio}
              onChange={(e) => setProfileData(prev => ({
                ...prev,
                bio: e.target.value
              }))}
              rows="4"
            />
          </div>

          <div className="skills-container">
            <div className="skills-input">
              <input
                className="form-control"
                type="text"
                value={profileData.newSkill}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  newSkill: e.target.value
                }))}
                placeholder="Add a new skill"
              />
              <button type="button" className="add-skill-btn" onClick={handleAddSkill}>
                Add Skill
              </button>
            </div>
            <div className="skills-list">
              {profileData.skills.map(skill => (
                <span key={skill} className="skill-tag">
                  {skill}
                  <button className="remove-skill" onClick={() => removeSkill(skill)}>×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Availability</label>
            <select
              className="form-control"
              value={profileData.availability}
              onChange={(e) => setProfileData(prev => ({
                ...prev,
                availability: e.target.value
              }))}
            >
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
            </select>
          </div>
        </div>

        {/* Notification Section */}
        <div className="settings-section">
          <h3>
            <span className="section-icon">🔔</span>
            Notification Preferences
          </h3>
          <div className="notification-settings">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="notification-option">
                <div 
                  className={`custom-checkbox ${value ? 'checked' : ''}`}
                  onClick={() => setNotifications(prev => ({
                    ...prev,
                    [key]: !prev[key]
                  }))}
                />
                <span>{key.split(/(?=[A-Z])/).join(' ')}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="settings-actions">
          <button type="submit" className="save-button">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default CoworkerSettings;
