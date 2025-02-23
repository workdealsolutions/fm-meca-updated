import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { FiSettings, FiBox, FiFileText, FiArrowRight, FiCpu, FiServer, FiHardDrive } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useIsMobile } from '../../hooks/useIsMobile';
import Spline from '@splinetool/react-spline';
import './Hero.css';

const Hero = () => {
  const { isDark } = useTheme();
  const { language, translations } = useLanguage();
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll();
  
  // Adjust animation values for mobile
  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, isMobile ? 50 : 150]), 
    {
      stiffness: 100,
      damping: 30
    }
  );

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', isMobile ? '25%' : '50%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', isMobile ? '15%' : '25%']);

  // Define theme-specific styles
  const themeStyles = {
    cardBg: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    cardBorder: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    gradientOverlay: isDark 
      ? `linear-gradient(135deg, rgba(88, 73, 73, 0.1), rgba(88, 73, 73, 0.05))`
      : 'linear-gradient(135deg, rgba(255, 240, 240, 0.9), rgba(255, 245, 245, 0.95))',
    iconColor: isDark ? 'rgb(88, 73, 73)' : 'rgb(88, 73, 73)'
  };

  const { hero } = translations[language];

  const scrollToSection = (elementId) => {
    const element = document.querySelector(elementId);
    const offset = 80; // Adjust this value based on your header height
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
        // Add custom easing
        options: {
          easing: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
        }
      });
    }
  };

  const handleGetStarted = () => {
    scrollToSection('#contact');
  };

  return (
    <section className={`hero ${isMobile ? 'mobile' : ''}`} style={{ background: isDark ? '#121212' : '#f5f5f5' }}>
      <motion.div 
        className="parallax-bg"
        style={{ 
          y: backgroundY,
          background: themeStyles.gradientOverlay
        }}
      />
      
      <motion.div 
        className="content-wrapper"
        style={{ y: contentY }}
      >
        <div className={`hero-content ${isMobile ? 'mobile' : ''}`}>
          {/* Left column - Hero text */}
          <motion.div 
            className="hero-text-container"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="hero-title"
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="typing-container">
                <span className="typing-text">{hero.title.line1}</span>
              </div>
              <br />
              <div className="typing-container">
                <span className="typing-text delay-1">{hero.title.line2}</span>
              </div>
              <br />
              <div className="typing-container">
                <span className="typing-text delay-2">{hero.title.line3}</span>
              </div>
            </motion.h1>
            
            <motion.p 
              className="hero-subtitle"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {hero.subtitle}
            </motion.p>

            <motion.button
              className="cta-primary"
              onClick={handleGetStarted}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              style={{
                '--accent-color': themeStyles.iconColor,
                color: isDark ? '#ffffff' : '#000000'
              }}
            >
              <span className="button-content">
                <span className="button-text">{hero.cta}</span>
                <span className="circle-arrow" style={{ background: themeStyles.iconColor }}>
                  <FiArrowRight color={isDark ? '#ffffff' : '#ffffff'} />
                </span>
              </span>
              <span className="button-gradient" />
              <span className="hover-effect" style={{ background: `linear-gradient(45deg, ${themeStyles.iconColor}, transparent)` }} />
            </motion.button>

          </motion.div>
          
          {/* Right column - Model and cards */}
          <div className={`hero-right-column ${isMobile ? 'mobile' : ''}`}>
            <motion.div 
              className="spline-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              style={{ background: 'transparent' }}  // Add this line
            >
              <Spline scene="https://prod.spline.design/Jz8-z0zKzsy0l7t8/scene.splinecode" />
              <div className="model-overlay-container">
                <span className="overlay-text">Experience in 3D</span>
              </div>
            </motion.div>

            <motion.div 
              className="services-preview"
              style={{ y }}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {hero.services.map((service, index) => (
                <motion.div 
                  key={index}
                  className="service-preview-card hover-line"
                  initial={{ x: 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ 
                    delay: index * 0.2, 
                    duration: 0.8, 
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                  style={{
                    background: themeStyles.cardBg,
                    borderColor: themeStyles.cardBorder,
                    color: isDark ? '#ffffff' : '#000000'
                  }}
                >
                  <span className="service-icon" style={{ color: themeStyles.iconColor }}>
                    {[<FiSettings />, <FiBox />, <FiFileText />][index]}
                  </span>
                  <div className="service-info">
                    <h3 style={{ color: isDark ? '#ffffff' : '#000000' }}>{service.title}</h3>
                    <p style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>
                      {service.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
