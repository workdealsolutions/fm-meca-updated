import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { FaMoon, FaSun } from 'react-icons/fa';
import './Navbar.css';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';
import LoginButton from '../LoginButton/LoginButton';

const Navbar = ({ onNavigate, currentSection }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { isDark, toggleTheme } = useTheme();

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
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'Partners', href: '#partners' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' }
  ];

  const renderNavControls = () => (
    <motion.li className="nav-controls">
      <LoginButton />
      <motion.button
        className="theme-toggle"
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