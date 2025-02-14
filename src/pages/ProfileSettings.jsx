import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import './ProfileSettings.css';

const ProfileSettings = ({ admin, onSave, onBack }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: admin.name,
    email: admin.email,
    avatar: admin.avatar,
    password: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    onSave(formData);
  };

  return (
    <div className={`profile-settings ${theme}`}>
      <button className="back-button" onClick={onBack}>
        Back to Projects
      </button>
      
      <h1>Profile Settings</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="avatar-section">
          <img src={formData.avatar || '/default-avatar.png'} alt="Profile" />
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setFormData(prev => ({ ...prev, avatar: reader.result }));
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </div>

        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          />
        </div>

        <div className="password-section">
          <h3>Change Password</h3>
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            />
          </div>
        </div>

        <button type="submit" className="save-button">Save Changes</button>
      </form>
    </div>
  );
};

export default ProfileSettings;
