import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaUserTie, FaUsers, FaEnvelope, FaLock, FaGoogle, FaBuilding } from 'react-icons/fa';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './Login.css';
import './SignUp.css';

const SignUp = ({ onSignUp, onGoogleSignUp, onCompanySignUp }) => {
  const { role } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    firstName: '',
    lastName: '',
  });
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignUp({ ...formData, role });
  };

  const handleGuestLogin = () => {
    navigate('/admin-dashboard');
  };

  const inputFields = [
    {
      icon: FaUser,
      type: 'text',
      placeholder: 'First Name',
      name: 'firstName',
      required: true
    },
    {
      icon: FaUser,
      type: 'text',
      placeholder: 'Last Name',
      name: 'lastName',
      required: true
    },
    {
      icon: FaEnvelope,
      type: 'email',
      placeholder: 'Email',
      name: 'email',
      required: true
    },
    ...(role === 'coworker' ? [{
      icon: FaBuilding,
      type: 'text',
      placeholder: 'Company Name',
      name: 'companyName',
      required: true
    }] : []),
    {
      icon: FaLock,
      type: 'password',
      placeholder: 'Password',
      name: 'password',
      required: true
    },
    {
      icon: FaLock,
      type: 'password',
      placeholder: 'Confirm Password',
      name: 'confirmPassword',
      required: true
    }
  ];

  return (
    <motion.div 
      className="login-container signup-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Create Your {role.charAt(0).toUpperCase() + role.slice(1)} Account
      </motion.h2>

      <form onSubmit={handleSubmit} className="signup-form">
        <div className="name-inputs-container">
          <motion.div
            className="input-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="input-label">First Name</label>
            <div className="input-with-icon">
              <FaUser className="input-icon" />
              <motion.input
                type="text"
                placeholder="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                onFocus={() => setFocusedField('firstName')}
                onBlur={() => setFocusedField(null)}
                required
                animate={{ 
                  scale: focusedField === 'firstName' ? 1.02 : 1
                }}
              />
            </div>
          </motion.div>

          <motion.div
            className="input-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="input-label">Last Name</label>
            <div className="input-with-icon">
              <FaUser className="input-icon" />
              <motion.input
                type="text"
                placeholder="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                onFocus={() => setFocusedField('lastName')}
                onBlur={() => setFocusedField(null)}
                required
                animate={{ 
                  scale: focusedField === 'lastName' ? 1.02 : 1
                }}
              />
            </div>
          </motion.div>
        </div>

        <div className="input-grid">
          {inputFields
            .filter(field => !['firstName', 'lastName'].includes(field.name))
            .map(({ icon: Icon, ...field }, index) => (
            <motion.div
              key={field.name}
              className="input-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <label className="input-label">
                {field.name === 'companyName' ? 'Company Name' : 
                 field.name === 'confirmPassword' ? 'Confirm Password' :
                 field.name.charAt(0).toUpperCase() + field.name.slice(1)}
              </label>
              <div className="input-with-icon">
                <Icon className="input-icon" />
                <motion.input
                  {...field}
                  type={field.type}
                  value={formData[field.name]}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  onFocus={() => setFocusedField(field.name)}
                  onBlur={() => setFocusedField(null)}
                  animate={{ 
                    scale: focusedField === field.name ? 1.02 : 1
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button
          type="submit"
          className="submit-button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Sign Up
        </motion.button>

        {role === 'admin' && (
          <motion.button
            type="button"
            className="guest-button"
            onClick={handleGuestLogin}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue as Guest Admin
          </motion.button>
        )}

        <div className="social-login">
          <div className="divider">
            <span>Or Sign up with</span>
          </div>
          
          <div className="social-buttons">
            <motion.button
              type="button"
              className="google-button"
              onClick={onGoogleSignUp}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaGoogle className="button-icon" />
              <span>Google</span>
            </motion.button>

            <motion.button
              type="button"
              className="company-button"
              onClick={onCompanySignUp}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaEnvelope className="button-icon" />
              <span>Company Email</span>
            </motion.button>
          </div>
        </div>

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
