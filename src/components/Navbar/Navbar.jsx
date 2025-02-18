import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { FaMoon, FaSun } from 'react-icons/fa';
import './Navbar.css';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import LoginButton from './LoginButton/LoginButton'; 

const Navbar = ({ onNavigate, currentSection }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Add this hook
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { isDark, toggleTheme } = useTheme();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigation = (href, isPage) => {
    setIsOpen(false); // Close mobile menu

    if (isPage) {
      navigate(href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const sectionId = href.replace('#', '');

    // If we're not on the home page and trying to navigate to a section
    if (location.pathname !== '/' && !isPage) {
      navigate('/', { replace: true });
      // Wait for navigation to complete before scrolling
      setTimeout(() => scrollToSection(sectionId), 100);
      return;
    }

    // If we're already on the home page
    if (location.pathname === '/') {
      scrollToSection(sectionId);
    }

    if (onNavigate) {
      onNavigate(href);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Only calculate scroll progress on home page
      if (location.pathname === '/') {
        const sections = document.querySelectorAll('section');
        let currentSectionIndex = 0;
        
        sections.forEach((section, index) => {
          const rect = section.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 3) {
            currentSectionIndex = index;
          }
        });
        
        const progress = (currentSectionIndex / (sections.length - 1)) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const isLinkActive = (href) => {
    if (href.startsWith('#')) {
      return currentSection === href.replace('#', '') && location.pathname === '/';
    } else {
      return location.pathname === href;
    }
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'Partners', href: '/partners', isPage: true },
    { name: 'Innovation & Cooperation', href: '/innovation', isPage: true },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' }
  ];

  const renderNavControls = () => (
    <motion.li className="nav-controls">
      <div className="navbar-login-button">
        <LoginButton />
      </div>
      <motion.button
        className="navbar-theme-toggle"
        onClick={toggleTheme}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isDark ? <FaSun /> : <FaMoon />}
      </motion.button>
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

        <div 
          className={`menu-icon ${isOpen ? 'open' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
        >
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
                className={isLinkActive(link.href) ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation(link.href, link.isPage);
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