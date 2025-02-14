import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Services from './components/Services/Services';
import Partners from './components/Partners/Partners';
import Testimonials from './components/Testimonials/Testimonials';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import Reviews from './pages/Reviews/Reviews';
import Login from './Login/Login';
import SignUp from './Login/SignUp';
import ForgotPassword from './Login/ForgotPassword';
import RoleSelection from './Login/RoleSelection';
import LoginBackground from './Login/LoginBackground';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';

const PublicApp = ({ setIsAuthenticated, setUserRole }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [currentSection, setCurrentSection] = useState('home');

  // ...existing loading and scroll logic...

  const handleLogin = ({ role, email }) => {
    setUserRole(role);
    setIsAuthenticated(true);
    localStorage.setItem('token', 'your-auth-token');
    localStorage.setItem('userRole', role);
  };

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <main>
            <LoadingScreen isLoading={isLoading} />
            <Hero />
            <Services />
            <Partners />
            <Testimonials />
            <Contact />
            <Footer />
          </main>
        } />
        
        <Route path="/reviews" element={<Reviews />} />
        
        <Route path="/login" element={
          <>
            <LoginBackground />
            <RoleSelection />
          </>
        } />
        
        <Route path="/login/:role" element={
          <>
            <LoginBackground />
            <Login onLogin={handleLogin} />
          </>
        } />
        
        <Route path="/signup" element={
          <>
            <LoginBackground />
            <SignUp />
          </>
        } />
        
        <Route path="/forgot-password" element={
          <>
            <LoginBackground />
            <ForgotPassword />
          </>
        } />
      </Routes>
    </>
  );
};

export default PublicApp;
