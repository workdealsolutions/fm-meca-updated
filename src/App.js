import { useEffect, useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Services from './components/Services/Services';
import Testimonials from './components/Testimonials/Testimonials';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import Partners from './components/Partners/Partners';
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { ThemeProvider } from './context/ThemeContext';
import './styles/theme.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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

// Add ScrollToTop component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppContent = ({ sendNotification }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSection, setCurrentSection] = useState('home'); // Fix state declaration
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

  const handleLogin = ({ role, email }) => {
    // Add your login logic here
    console.log('Logged in as:', role, email);
    // Redirect to appropriate dashboard based on role
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
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={
          <div className="App">
            <LoadingScreen isLoading={isLoading} />
            <AnimatePresence>
              {showContent && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className={`navbar ${isScrolled ? 'scrolled' : ''}`}
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    transition={{ type: "spring", stiffness: 100 }}
                  >
                    <Navbar 
                      onNavigate={handleSectionChange}
                      currentSection={currentSection}
                    />
                  </motion.div>

                  <main>
                    <section id="home">
                      <Hero />
                    </section>
                    

                    <section id="services">
                      <Services />
                    </section>

                    <section id="partners">
                      <Partners />
                    </section>
                    
                    <section id="testimonials">
                      <Testimonials />
                    </section>
                    
                    <section id="contact">
                      <Contact />
                    </section>
                  </main>

                  <Footer />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        } />
        <Route path="/reviews" element={<Reviews />} />
        <Route 
          path="/login" 
          element={
            <>
              <LoginBackground />
              <Navbar onNavigate={handleSectionChange} currentSection={currentSection} />
              <RoleSelection />
            </>
          } 
        />
        <Route 
          path="/login/:role" 
          element={
            <>
              <LoginBackground />
              <Navbar onNavigate={handleSectionChange} currentSection={currentSection} />
              <Login onLogin={handleLogin} />
            </>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <>
              <LoginBackground />
              <Navbar onNavigate={handleSectionChange} currentSection={currentSection} />
              <SignUp onSignUp={handleSignUp} />
            </>
          } 
        />
        <Route 
          path="/forgot-password" 
          element={
            <>
              <LoginBackground />
              <Navbar onNavigate={handleSectionChange} currentSection={currentSection} />
              <ForgotPassword onResetPassword={handleResetPassword} />
            </>
          } 
        />
        <Route 
          path="/admin-dashboard" 
          element={
            <AdminDashboard 
              projects={projects}
              setProjects={setProjects}
              coworkers={coworkers}
              sendNotification={sendNotification}
            />
          }
        />
        
        <Route 
          path="/coworker-dashboard" 
          element={
            <>
              <CoWorkerDashboard
                user={mockUser}
                projects={projects}
                setProjects={setProjects}
              />
            </>
          }
        />
        
        <Route 
          path="/client-dashboard" 
          element={
            <ClientDashboard
              user={mockUser}
              projects={projects}
              setProjects={setProjects}
              sendNotification={sendNotification}
            />
          }
        />
      </Routes>
    </Router>
  );
};

const App = () => {
  // Create a mock sendNotification function until context is available
  const sendNotification = ({ userId, message, type }) => {
    console.log(`Notification for user ${userId}: ${message} (${type})`);
    // You can implement actual notification logic here
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