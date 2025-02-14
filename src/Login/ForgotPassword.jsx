import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Login.css';

const ForgotPassword = ({ onResetPassword }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onResetPassword(email);
    setSubmitted(true);
  };

  return (
    <motion.div 
      className="login-container forgot-password-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2>Reset Password</motion.h2>
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <p className="form-description">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <motion.button
            type="submit"
            className="submit-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Send Reset Link
          </motion.button>

          <div className="auth-links">
            <Link to="/login">Back to Login</Link>
          </div>
        </form>
      ) : (
        <motion.div 
          className="success-message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3>Check Your Email</h3>
          <p>We've sent a password reset link to {email}</p>
          <Link to="/login" className="back-to-login">
            Return to Login
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ForgotPassword;
