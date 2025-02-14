import React, { useState } from 'react';
import './Profile.css';

const Profile = ({ user, theme }) => {
  const [profileData, setProfileData] = useState({
    fullName: user.fullName || '',
    email: user.email || '',
    phone: user.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updated profile:', profileData);
    // Handle profile update logic here
  };

  return (
    <div className={`profile-container ${theme}`}>
      <div className="profile-header">
        <h2>My Profile</h2>
        <p>Manage your personal information and security</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="profile-grid">
          <div className="profile-section">
            <h3>Personal Information</h3>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={profileData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                disabled
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          <div className="profile-section">
            <h3>Security Settings</h3>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={profileData.currentPassword}
                onChange={handleInputChange}
                placeholder="Enter current password"
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={profileData.newPassword}
                onChange={handleInputChange}
                placeholder="Enter new password"
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={profileData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm new password"
              />
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button type="submit" className="save-button">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
