import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Services from './components/Services/Services';
import Testimonials from './components/Testimonials/Testimonials';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { ThemeProvider } from './context/ThemeContext';
import './styles/theme.css';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Reviews from './components/pages/Reviews/Reviews';
import Login from './components/Login/Login';
import LoginBackground from './components/Login/LoginBackground';
import SignUp from './components/Login/SignUp';
import ForgotPassword from './components/Login/ForgotPassword';
import AdminDashboard from './components/Dashboards/AdminDashboard';
import CoWorkerDashboard from './components/Dashboards/CoWorkerDashboard';
import ClientDashboard from './components/Dashboards/ClientDashboard';
import RoleSelection from './components/Login/RoleSelection';
import { NotificationProvider } from './context/NotificationContext';
import HubSpotChat from './components/HubSpotChat/HubSpotChat';
import PartnersPage from './components/Partners/Partners/PartnersPage';
import InnovationCooperation from './components/InnovationCooperation/InnovationCooperation';
import {jwtDecode} from 'jwt-decode';
import IndustrialSolution from './components/ServicePages/IndustrialSolution/IndustrialSolution';
import ProductDevelopment from './components/ServicePages/ProductDevelopment/ProductDevelopment';
import EngineeringData from './components/ServicePages/EngineeringData/EngineeringData';
import TechnicalSupport from './components/ServicePages/TechnicalSupport/TechnicalSupport';
import Statistics from './components/Statistics/Statistics';

  

// Add ScrollToTop component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppContent = ({ sendNotification }) => {
  // useNavigate now works because we're under a single Router (from index.js)
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSection, setCurrentSection] = useState('home');
  const [isManualNavigation, setIsManualNavigation] = useState(false);
  const [projects, setProjects] = useState([]);
  const [coworkers] = useState([
    { id: 1, name: 'Coworker 1' },
    { id: 2, name: 'Coworker 2' },
    // Add more coworkers as needed
  ]);

  const mockUser = {
    id: 1,
    email: 'guest@example.com'
  };

  useEffect(() => {
    const handleLoad = async () => {
      // Decrease loading time to 3 seconds
      await new Promise(resolve => setTimeout(resolve, 3000));
      setIsLoading(false);
      
      // Wait for loading screen transition
      setTimeout(() => {
        setShowContent(true);
      }, 800);
    };

    handleLoad();
    
    const handleScroll = () => {
      if (!isManualNavigation) {  // Only update scroll state if not manually navigating
        setIsScrolled(window.scrollY > 50);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isManualNavigation]);

  const handleSectionChange = (href) => {
    setIsManualNavigation(true);
    const sectionId = href.replace('#', '');
    setCurrentSection(sectionId);
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      
      // Reset manual navigation after scroll completes
      setTimeout(() => {
        setIsManualNavigation(false);
      }, 1000);
    }
  };

  const handleLogin = async ({ role, email, password }) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Login failed'}`);
        return;
      }

      const data = await response.json();
      console.log("Login successful", data);

      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      // Decode the token to extract the role
      const decodedToken = jwtDecode(data.token);
      const userRole = decodedToken.role; // Make sure your token includes this property

      // Redirect based on the decoded role
      switch (userRole) {
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
          navigate('/');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleSignUp = (formData) => {
    console.log('Sign up data:', formData);
    // Add your signup logic here
  };

  const handleResetPassword = (email) => {
    console.log('Reset password for:', email);
    // Add your password reset logic here
  };

  return (
      <>
        <ScrollToTop />
        <HubSpotChat />
        <Routes>
          <Route path="/" element={
            <div className="App">
              <LoadingScreen isLoading={isLoading} />
              <AnimatePresence>
                {showContent && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                      <motion.div
                          className={`navbar ${isScrolled ? 'scrolled' : ''}`}
                          initial={{ y: -100 }}
                          animate={{ y: 0 }}
                          transition={{ type: "spring", stiffness: 100 }}
                      >
                        <Navbar onNavigate={handleSectionChange} currentSection={currentSection} />
                      </motion.div>
                      <main>
                        <section id="home"><Hero /></section>
                        <section id="services"><Services /></section>
                        <section id="statistics"><Statistics /></section>
                        <section id="testimonials"><Testimonials /></section>
                        <section id="contact"><Contact /></section>
                      </main>
                      <Footer />
                    </motion.div>
                )}
              </AnimatePresence>
            </div>
          } />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/login" element={
            <>
              <LoginBackground />
              <Navbar onNavigate={handleSectionChange} currentSection={currentSection} />
              <Login onLogin={handleLogin} />
            </>
          } />
          <Route path="/signup" element={
            <>
              <LoginBackground />
              <Navbar onNavigate={handleSectionChange} currentSection={currentSection} />
              <RoleSelection isSignUp={true} />
            </>
          } />
          <Route path="/signup/:role" element={
            <>
              <LoginBackground />
              <Navbar onNavigate={handleSectionChange} currentSection={currentSection} />
              <SignUp onSignUp={handleSignUp} />
            </>
          } />
          <Route path="/forgot-password" element={
            <>
              <LoginBackground />
              <Navbar onNavigate={handleSectionChange} currentSection={currentSection} />
              <ForgotPassword onResetPassword={handleResetPassword} />
            </>
          } />
          <Route path="/admin-dashboard" element={
            <AdminDashboard
                projects={projects}
                setProjects={setProjects}
                coworkers={coworkers}
                sendNotification={sendNotification}
            />
          } />
          <Route path="/coworker-dashboard" element={
            <CoWorkerDashboard
                user={mockUser}
                projects={projects}
                setProjects={setProjects}
            />
          } />
          <Route path="/client-dashboard" element={
            <ClientDashboard
                user={mockUser}
                projects={projects}
                setProjects={setProjects}
                sendNotification={sendNotification}
            />
          } />
          <Route path="/partners" element={
            <>
              <Navbar onNavigate={handleSectionChange} currentSection={currentSection} />
              <PartnersPage />
            </>
          } />
          <Route path="/innovation" element={
            <AnimatePresence mode="wait">
              <motion.div
                  key="innovation"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
              >
                <Navbar onNavigate={handleSectionChange} currentSection={currentSection} />
                <InnovationCooperation />
              </motion.div>
            </AnimatePresence>
          } />
          <Route path="/services/industrial-solution" element={<IndustrialSolution />} />
          <Route path="/services/product-development" element={<ProductDevelopment />} />
          <Route path="/services/engineering-data" element={<EngineeringData />} />
          <Route path="/services/technical-support" element={<TechnicalSupport />} />
        </Routes>
      </>
  );
};

const App = () => {
  const sendNotification = ({ userId, message, type }) => {
    console.log(`Notification for user ${userId}: ${message} (${type})`);
  };

  return (
      <ThemeProvider>
        <NotificationProvider>
          <AppContent sendNotification={sendNotification} />
        </NotificationProvider>
      </ThemeProvider>
  );
};

export default App;
