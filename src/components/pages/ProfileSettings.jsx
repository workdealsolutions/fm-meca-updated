import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';
import './ProfileSettings.css';

const ProfileSettings = ({ admin, onSave, onBack }) => {
  const { isDark } = useTheme();
  const theme = isDark ? 'dark' : 'light';
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: admin.name,
    email: admin.email,
    avatar: admin.avatar,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }
      if (!formData.currentPassword) {
        setError('Current password is required to set new password');
        return;
      }
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(
          'http://localhost:5000/api/auth/update-profile',
          {
            name: formData.name,
            email: formData.email,
            avatar: formData.avatar,
            currentPassword: formData.currentPassword || undefined,
            newPassword: formData.newPassword || undefined
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
      );

      setSuccess('Profile updated successfully');
      onSave({
        ...admin,
        name: formData.name,
        email: formData.email,
        avatar: formData.avatar
      });

      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
      <div className={`profile-settings ${theme}`}>
        <button className={`back-button ${theme}`} onClick={onBack}>
          Back to Projects
        </button>

        <h1>Profile Settings</h1>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className={`avatar-section ${theme}`}>
            <img
                src={formData.avatar || '/default-avatar.png'}
                alt="Profile"
                className="profile-avatar"
            />
            <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className={`file-input ${theme}`}
            />
          </div>

          <div className={`form-group ${theme}`}>
            <label>Name</label>
            <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={theme}
                required
            />
          </div>

          <div className={`form-group ${theme}`}>
            <label>Email</label>
            <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={theme}
                required
            />
          </div>

          <div className={`password-section ${theme}`}>
            <h3>Change Password</h3>
            <div className={`form-group ${theme}`}>
              <label>Current Password</label>
              <input
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    currentPassword: e.target.value
                  }))}
                  className={theme}
              />
            </div>

            <div className={`form-group ${theme}`}>
              <label>New Password</label>
              <input
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    newPassword: e.target.value
                  }))}
                  className={theme}
              />
            </div>

            <div className={`form-group ${theme}`}>
              <label>Confirm New Password</label>
              <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    confirmPassword: e.target.value
                  }))}
                  className={theme}
              />
            </div>
          </div>

          <button type="submit" className={`save-button ${theme}`}>
            Save Changes
          </button>
        </form>
      </div>
  );
};

export default ProfileSettings;