import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import LanguageToggle from '../../context/LanguageToggle';
import './Navbar.css';
import { useTheme } from '../../context/ThemeContext';

const Navbar = ({ onNavigate, currentSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { isDark, toggleTheme } = useTheme();
  const { language, translations } = useLanguage();

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
    onNavigate(href);
    setIsOpen(false);
  };

  const navLinks = [
    { name: translations[language]?.navigation?.home || 'Home', href: '#home' },
    { name: translations[language]?.navigation?.services || 'Services', href: '#services' },
    { name: translations[language]?.navigation?.partners || 'Partners', href: '#partners' },
    { name: translations[language]?.navigation?.testimonials || 'Testimonials', href: '#testimonials' },
    { name: translations[language]?.navigation?.contact || 'Contact', href: '#contact' }
  ];

  return (
    <nav className={`navbar ${isOpen ? 'open' : ''} ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <motion.a 
          href="#home" 
          className="logo"
          whileHover={{ scale: 1.05 }}
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
                  opacity: isOpen ? 1 : 0 
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
          <motion.li className="nav-controls">
            <motion.button
              className="theme-toggle"
              onClick={toggleTheme}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isDark ? <FaSun /> : <FaMoon />}
            </motion.button>
            <LanguageToggle />
          </motion.li>
        </motion.ul>
        <motion.div 
          className="scroll-indicator"
          style={{ width: `${scrollProgress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </nav>
  );
};

export default Navbar;