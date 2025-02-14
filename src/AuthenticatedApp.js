import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './Dashboards/AdminDashboard';
import CoWorkerDashboard from './Dashboards/CoWorkerDashboard';
import ClientDashboard from './Dashboards/ClientDashboard';

const AuthenticatedApp = ({ userRole }) => {
  const [projects, setProjects] = useState([]);
  const [coworkers] = useState([
    { id: 1, name: 'Coworker 1' },
    { id: 2, name: 'Coworker 2' },
  ]);

  const mockUser = {
    id: 1,
    email: 'guest@example.com'
  };

  // Redirect to appropriate dashboard based on role
  const DefaultRedirect = () => {
    switch(userRole) {
      case 'admin':
        return <Navigate to="/admin-dashboard" replace />;
      case 'coworker':
        return <Navigate to="/coworker-dashboard" replace />;
      case 'client':
        return <Navigate to="/client-dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  };

  return (
    <Routes>
      <Route path="/" element={<DefaultRedirect />} />
      
      <Route 
        path="/admin-dashboard" 
        element={
          <AdminDashboard 
            projects={projects}
            setProjects={setProjects}
            coworkers={coworkers}
          />
        }
      />
      
      <Route 
        path="/coworker-dashboard" 
        element={
          <CoWorkerDashboard
            user={mockUser}
            projects={projects}
            setProjects={setProjects}
          />
        }
      />
      
      <Route 
        path="/client-dashboard" 
        element={
          <ClientDashboard
            user={mockUser}
            projects={projects}
            setProjects={setProjects}
          />
        }
      />

      {/* Catch all route - redirect to appropriate dashboard */}
      <Route path="*" element={<DefaultRedirect />} />
    </Routes>
  );
};

export default AuthenticatedApp;
