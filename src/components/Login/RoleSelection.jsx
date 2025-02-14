import React from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaUserTie, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const RoleSelection = () => {
  const navigate = useNavigate();

  const roles = [
    { 
      id: 'client', 
      icon: FaUser, 
      label: 'Client',
      description: 'Submit and track your projects',
      path: '/login/client'
    },
    { 
      id: 'admin', 
      icon: FaUserTie, 
      label: 'Admin',
      description: 'Manage projects and users',
      path: '/login/admin'
    },
    { 
      id: 'coworker', 
      icon: FaUsers, 
      label: 'Coworker',
      description: 'Work on assigned projects',
      path: '/login/coworker'
    }
  ];

  return (
    <motion.div 
      className="role-selection-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Choose Your Role
      </motion.h2>
      
      <div className="roles-grid">
        {roles.map(({ id, icon: Icon, label, description, path }) => (
          <motion.div
            key={id}
            className="role-card"
            onClick={() => navigate(path)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Icon className="role-icon" />
            <h3>{label}</h3>
            <p>{description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RoleSelection;
