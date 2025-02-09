import { useEffect, useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Services from './components/Services/Services';
import Testimonials from './components/Testimonials/Testimonials';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import Cursor from './components/Cursor/Cursor';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import Model from './Model';
import { ThemeProvider } from './context/ThemeContext';
import './styles/theme.css';
import Model2 from './Model2'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Innovation from './components/Innovation/Innovation';
import Innovation2 from './components/Innovation/Innovation2';
import Partners from './components/Partners/Partners';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSection, setCurrentSection] = useState('home'); // Fix state declaration
  const [isManualNavigation, setIsManualNavigation] = useState(false);

  useEffect(() => {
    const handleLoad = async () => {
      // Increase loading time to 5 seconds
      await new Promise(resolve => setTimeout(resolve, 5000));
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

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/innovation" element={<Innovation />} />
          <Route path="/innovation2" element={<Innovation2 />} />
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
                    <Cursor />
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
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;