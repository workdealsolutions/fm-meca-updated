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
  const [openDropdown, setOpenDropdown] = useState(null);
  
  const toggleDropdown = (linkName, e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDropdown(prevOpen => prevOpen === linkName ? null : linkName);
  };

  const scrollToServiceCard = (index) => {
    const targetCard = document.getElementById(`service-${index}`);
    
    if (targetCard) {
      const navbarHeight = 100; // Adjust based on your navbar height
      const cardTop = targetCard.getBoundingClientRect().top;
      const offsetPosition = window.pageYOffset + cardTop - navbarHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const servicesLinks = [
    { name: 'Industrial Solutions', href: '1' },
    { name: 'Product Development', href: '2' },
    { name: 'Engineering Data', href: '3' },
    { name: 'Technical Support', href: '4' }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigation = (href, isPage) => {
    setIsOpen(false); // Close mobile menu

    // Handle service card navigation
    const serviceMatch = /^[1-4]$/.exec(href);
    if (serviceMatch) {
      scrollToServiceCard(href);
      return;
    }

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
    { 
      name: 'Services', 
      href: '#services',
      dropdown: servicesLinks 
    },
    { name: 'Partners', href: '/partners', isPage: true },
    { name: 'Innovation', href: '/innovation', isPage: true },
    { 
      name: 'Testimonials', 
      href: '#testimonials',
      dropdown: [
        { name: 'Testimonials Section', href: '#testimonials' },
        { name: 'Reviews Page', href: '/reviews', isPage: true }
      ]
    },
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

        <motion.ul className={`nav-links ${isOpen ? 'active' : ''}`}>
          {navLinks.map((link, index) => (
            <motion.li
              key={index}
              className={`${link.dropdown ? 'has-dropdown' : ''} ${openDropdown === link.name ? 'dropdown-open' : ''}`}
            >
              <a 
                href={link.href} 
                className={`nav-link ${isLinkActive(link.href) ? 'active' : ''}`}
                onClick={(e) => {
                  if (link.dropdown) {
                    toggleDropdown(link.name, e);
                  } else {
                    e.preventDefault();
                    handleNavigation(link.href, link.isPage);
                  }
                }}
              >
                {link.name}
                {link.dropdown && <span className="dropdown-arrow">▼</span>}
              </a>
              {link.dropdown && (
                <div className={`nav-dropdown ${openDropdown === link.name ? 'show' : ''}`}>
                  {link.dropdown.map((dropItem, i) => (
                    <a
                      key={i}
                      href={dropItem.href}
                      className="dropdown-item"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigation(dropItem.href, dropItem.isPage);
                        setOpenDropdown(null);
                        setIsOpen(false);
                      }}
                    >
                      {dropItem.name}
                    </a>
                  ))}
                </div>
              )}
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