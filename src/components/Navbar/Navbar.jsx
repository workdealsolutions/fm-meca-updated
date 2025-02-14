import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiSettings } from 'react-icons/fi';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import LanguageToggle from '../../context/LanguageToggle';
import './Navbar.css';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = ({ onNavigate, currentSection }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { isDark, toggleTheme } = useTheme();
  const { language, translations } = useLanguage();
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Calculate scroll progress
      const sections = document.querySelectorAll('section');
      let currentSectionIndex = 0;
      
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2) {
          currentSectionIndex = index;
        }
      });
      
      const progress = (currentSectionIndex / (sections.length - 1)) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (href) => {
    if (window.location.pathname !== '/' && href === '#home') {
      // If we're not on homepage and user clicks home, navigate to root
      navigate('/', { replace: true });
      return;
    }
    
    // Otherwise use existing navigation
    if (onNavigate) {
      onNavigate(href);
    }
    setIsOpen(false);
  };

  const navLinks = [
    { name: translations[language]?.navigation?.home || 'Home', href: '#home' },
    { name: translations[language]?.navigation?.services || 'Services', href: '#services' },
    { name: translations[language]?.navigation?.partners || 'Partners', href: '#partners' },
    { name: translations[language]?.navigation?.testimonials || 'Testimonials', href: '#testimonials' },
    { name: translations[language]?.navigation?.contact || 'Contact', href: '#contact' }
  ];

  const renderNavControls = () => (
    <motion.li className="nav-controls">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Link to="/login" className="fm-login-button">
          <span>Login</span>
        </Link>
      </motion.div>
      <div className="settings-container" ref={settingsRef}>
        <motion.button
          className="settings-toggle"
          onClick={() => setShowSettings(!showSettings)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiSettings className={showSettings ? 'rotating' : ''} />
        </motion.button>
        {showSettings && (
          <div className="settings-dropdown">
            <motion.button
              className="theme-toggle"
              onClick={toggleTheme}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isDark ? <FaSun /> : <FaMoon />}
            </motion.button>
            <LanguageToggle />
          </div>
        )}
      </div>
    </motion.li>
  );

  return (
    <nav className={`navbar ${isOpen ? 'open' : ''} ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <motion.a 
          href="#home" 
          className="logo"
          whileHover={{ scale: 1.03 }}  // Reduced scale effect
          transition={{ type: "spring", stiffness: 400 }}
        >
          <img src="/jpg_to_png-removebg-preview.png" alt="FM MECA" />
        </motion.a>

        <div className="menu-icon ${isOpen ? 'open' : ''}" onClick={toggleMenu}>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </motion.div>
        </div>

        <motion.ul 
          className={`nav-links ${isOpen ? 'active' : ''}`}
          initial={{ opacity: 1, x: 0 }}  // Start visible on desktop
          animate={
            window.innerWidth <= 768  // Only animate on mobile
              ? { 
                  x: isOpen ? 0 : "100%",
                  opacity: isOpen ? 1 : 0,
                  transition: { duration: 0.2 }  // Faster transition
                }
              : { opacity: 1, x: 0 }
          }
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {navLinks.map((link, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 1 }}  // Start visible
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a 
                href={link.href} 
                className={currentSection === link.href.replace('#', '') ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation(link.href);
                }}
              >
                <span>{link.name}</span>
                <span>{link.name}</span>
              </a>
            </motion.li>
          ))}
          {renderNavControls()}
        </motion.ul>
        <motion.div 
          className="scroll-indicator"
          style={{ width: `${scrollProgress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.2 }}  // Faster transition
        />
      </div>
    </nav>
  );
};

export default Navbar;