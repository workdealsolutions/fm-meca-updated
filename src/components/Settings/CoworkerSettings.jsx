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
        <div className="settings-grid">
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

          {/* Security Section */}
          <div className="settings-section">
            <h3>
              <span className="section-icon">🔒</span>
              Security Settings
            </h3>
            <div className="form-group">
              <label>Current Password</label>
              <input
                className="form-control"
                type="password"
                placeholder="Enter current password"
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                className="form-control"
                type="password"
                placeholder="Enter new password"
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                className="form-control"
                type="password"
                placeholder="Confirm new password"
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
          </div>

          {/* Availability Section */}
          <div className="settings-section">
            <h3>
              <span className="section-icon">📅</span>
              Availability
            </h3>
            <div className="availability-grid">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                <div key={day} className="day-column">
                  <span className="day-label">{day}</span>
                  <div className="time-slots">
                    <button 
                      type="button"
                      className={`time-slot ${profileData.availability?.[day]?.morning ? 'available' : ''}`}
                      onClick={() => toggleAvailability(day, 'morning')}
                    >
                      AM
                    </button>
                    <button
                      type="button"
                      className={`time-slot ${profileData.availability?.[day]?.afternoon ? 'available' : ''}`}
                      onClick={() => toggleAvailability(day, 'afternoon')}
                    >
                      PM
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
