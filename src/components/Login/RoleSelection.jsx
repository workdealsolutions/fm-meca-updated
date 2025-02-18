import React from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaUserTie, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const RoleSelection = ({ isSignUp = false }) => {
  const navigate = useNavigate();

  const roles = [
    { 
      id: 'client', 
      icon: FaUser, 
      label: 'Client',
      description: isSignUp ? 'Create an account to submit projects' : 'Submit and track your projects',
      path: isSignUp ? '/signup/client' : '/login/client'
    },
    { 
      id: 'coworker', 
      icon: FaUsers, 
      label: 'Coworker',
      description: isSignUp ? 'Create an account to work on projects' : 'Work on assigned projects',
      path: isSignUp ? '/signup/coworker' : '/login/coworker'
    }
  ];

  return (
    <motion.div 
      className="role-selection-container mobile-padding"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 className="role-title-mobile">
        {isSignUp ? 'Choose Your Role to Sign Up' : 'Choose Your Role to Login'}
      </motion.h2>
      
      <div className="roles-grid mobile-grid">
        {roles.map(({ id, icon: Icon, label, description, path }) => (
          <motion.div
            key={id}
            className="role-card mobile-card"
            onClick={() => navigate(path)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Icon className="role-icon mobile-icon" />
            <h3 className="mobile-heading">{label}</h3>
            <p className="mobile-description">{description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RoleSelection;
