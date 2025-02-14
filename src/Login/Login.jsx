import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGoogle, FaEnvelope, FaLock } from 'react-icons/fa';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin, onGoogleLogin, onCompanyLogin }) => {
  const { role } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const handleGuestLogin = () => {
    switch(role) {
      case 'admin':
        navigate('/admin-dashboard');
        break;
      case 'coworker':
        navigate('/coworker-dashboard');
        break;
      case 'client':
        navigate('/client-dashboard');
        break;
      default:
        navigate('/login');
        break;
    }
  };

  const getRoleTitle = () => {
    switch(role) {
      case 'admin':
        return 'Admin Login';
      case 'coworker':
        return 'Coworker Login';
      case 'client':
        return 'Client Login';
      default:
        return 'Welcome Back';
    }
  };

  return (
    <motion.div 
      className="login-container"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        {getRoleTitle()}
      </motion.h2>
      
      <form onSubmit={(e) => { e.preventDefault(); onLogin({ role, email, password }); }}>
        <div className="input-group">
          <FaEnvelope className="input-icon" />
          <motion.input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            required
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              scale: focusedField === 'email' ? 1.02 : 1
            }}
            transition={{ delay: 0.5, duration: 0.5 }}
          />
        </div>
        
        <div className="input-group">
          <FaLock className="input-icon" />
          <motion.input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
            required
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              scale: focusedField === 'password' ? 1.02 : 1
            }}
            transition={{ delay: 0.6, duration: 0.5 }}
          />
        </div>

        <div className="auth-links">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
        
        <motion.button
          type="submit"
          className="submit-button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)"
          }}
          whileTap={{ scale: 0.98 }}
        >
          Login
        </motion.button>

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
          Continue as Guest
        </motion.button>

        <div className="social-login">
          <div className="divider">
            <span>Or continue with</span>
          </div>
          
          <div className="social-buttons">
            <motion.button
              type="button"
              className="google-button"
              onClick={onGoogleLogin}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaGoogle className="button-icon" />
              <span>Google</span>
            </motion.button>

            <motion.button
              type="button"
              className="company-button"
              onClick={onCompanyLogin}
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
          <Link to="/signup">
            Don't have an account? Sign Up
          </Link>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default Login;