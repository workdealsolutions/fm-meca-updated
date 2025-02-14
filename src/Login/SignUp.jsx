import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaUserTie, FaUsers, FaEnvelope, FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Login.css';

const SignUp = ({ onSignUp }) => {
  const [formData, setFormData] = useState({
    role: 'client',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
  });

  const roles = [
    { id: 'client', icon: FaUser, label: 'Client' },
    { id: 'coworker', icon: FaUsers, label: 'Coworker' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignUp(formData);
  };

  return (
    <motion.div 
      className="login-container signup-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2>Create Account</motion.h2>
      <form onSubmit={handleSubmit}>
        <div className="role-selector">
          {roles.map(({ id, icon: Icon, label }) => (
            <motion.button
              key={id}
              type="button"
              className={`role-button ${formData.role === id ? 'active' : ''}`}
              onClick={() => setFormData({ ...formData, role: id })}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="role-icon" />
              <span>{label}</span>
            </motion.button>
          ))}
        </div>

        <div className="input-group">
          <FaEnvelope className="input-icon" />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        {formData.role === 'coworker' && (
          <div className="input-group">
            <FaUserTie className="input-icon" />
            <input
              type="text"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              required
            />
          </div>
        )}

        <div className="input-group">
          <FaLock className="input-icon" />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        <div className="input-group">
          <FaLock className="input-icon" />
          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
          />
        </div>

        <motion.button
          type="submit"
          className="submit-button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Sign Up
        </motion.button>

        <motion.div 
          className="auth-links"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Link to="/login">
            Already have an account? Login
          </Link>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default SignUp;
