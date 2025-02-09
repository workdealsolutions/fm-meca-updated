import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { FiSettings, FiBox, FiFileText } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import "./Services.css";


const TypeWriter = ({ text, delay = 50 }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isTyping) {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, delay);

      return () => clearInterval(interval);
    }
  }, [text, delay, isTyping]);

  return (
    <span onMouseEnter={() => setIsTyping(true)}>{displayText || text}</span>
  );
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 100,
    scale: 0.9,
    rotateX: -10,
    filter: 'blur(10px)'
  },
  visible: index => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100,
      delay: index * 0.2,
      duration: 0.8,
    }
  })
};

const Services = () => {
  const { isDark } = useTheme();
  const { language, translations } = useLanguage();
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, threshold: 0.2 });
  const navigate = useNavigate();

  const themeStyles = {
    background: isDark 
      ? 'linear-gradient(135deg, #000000, #1a1a1a)'
      : 'linear-gradient(135deg, #f5f5f5, #ffffff)',
    textColor: isDark ? '#ffffff' : '#000000',
    cardBg: isDark 
      ? 'linear-gradient(165deg, rgba(40, 40, 40, 0.95), rgba(10, 10, 10, 0.98))'
      : 'linear-gradient(165deg, rgba(255, 255, 255, 0.95), rgba(245, 245, 245, 0.98))',
    cardBorder: isDark 
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.1)',
    cardShadow: isDark
      ? '0 20px 40px rgba(0, 0, 0, 0.3)'
      : '0 20px 40px rgba(0, 0, 0, 0.1)',
    titleGradient: isDark
      ? 'linear-gradient(135deg, #000000, rgba(255, 255, 255, 0.7))'
      : 'linear-gradient(135deg, #000000, rgba(0, 0, 0, 0.8))',
    accentColor: isDark ? '#ff4444' : '#cc0000',
    titleColor: isDark ? '#ffffff' : '#000000',
    cardTitle: isDark ? '#ffffff' : '#000000', // This line ensures black color in light mode
    titleUnderline: isDark 
      ? 'linear-gradient(90deg, #ffffff, transparent)'
      : 'linear-gradient(90deg, #cc0000, transparent)',
    descriptionColor: isDark 
      ? 'rgba(255, 255, 255, 0.7)' 
      : 'rgba(70, 70, 70, 0.9)',
    borderColor: isDark
      ? 'rgba(255, 255, 255, 0.1)'
      : '#cc0000',
    titleAfter: isDark 
      ? 'linear-gradient(90deg, #000000, transparent)'
      : 'linear-gradient(90deg, #000000, transparent)',
    subtitleColor: isDark
      ? 'rgba(255, 255, 255, 0.7)'
      : 'rgba(0, 0, 0, 0.7)',
  };

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  const serviceIcons = [<FiSettings />, <FiBox />, <FiFileText />];
  const { title, services, exploreButton } = translations[language].servicesSection;

  const handleExploreClick = (index) => {
    if (index === 0) {
      navigate('/innovation');
    } else if (index === 1) {
      navigate('/innovation2');
    }
  };

  return (
    <section className="services" style={{ background: themeStyles.background }}>
      <div className="services-content">
        <div className="services-section-title">
          <motion.h1 
            className="section-title-main"
            style={{
              '--title-gradient': themeStyles.titleGradient,
              '--subtitle-color': themeStyles.subtitleColor,
            }}
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Our Services
          </motion.h1>
          <motion.p 
            className="section-title-sub"
            style={{ color: themeStyles.subtitleColor }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Discover our comprehensive range of professional services designed to meet your needs
          </motion.p>
          <motion.div 
            className="title-line"
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: "100px", opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
        </div>

        <motion.h2
          className="services-title"
          style={{ 
            background: themeStyles.titleGradient,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
          initial={{ opacity: 0, y: -50 }}
          animate={controls}
          variants={{
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 1.2,
                ease: "easeOut"
              }
            }
          }}
        >
          {title}
        </motion.h2>
        <div className="services-list">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="service-item"
              style={{ color: themeStyles.accentColor }}
            >
              <motion.div 
                className="service-card"
                style={{
                  background: themeStyles.cardBg,
                  borderColor: themeStyles.cardBorder,
                  boxShadow: themeStyles.cardShadow
                }}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                custom={index}
                viewport={{ margin: "-100px" }}
              >
                <motion.h3 
                  className="service-card-heading"
                  style={{ 
                    color: themeStyles.cardTitle,
                    borderBottom: `1px solid ${themeStyles.borderColor}`
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <TypeWriter text={service.title} />
                  <span 
                    className="title-underline" 
                    style={{ 
                      position: 'absolute',
                      bottom: '-1px',
                      left: 0,
                      width: '50px',
                      height: '2px',
                      background: themeStyles.titleAfter
                    }}
                  />
                </motion.h3>
                <motion.p 
                  className="service-card-description"
                  style={{ 
                    color: themeStyles.descriptionColor,
                    borderLeft: `2px solid ${themeStyles.borderColor}`
                  }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {service.description}
                </motion.p>
                <motion.button
                  className="service-button"
                  style={{
                    background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
                    color: themeStyles.textColor,
                    borderColor: themeStyles.cardBorder
                  }}
                  whileHover={{
                    scale: 1.05,
                    color: themeStyles.accentColor,
                    borderColor: themeStyles.accentColor
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0.9 }}
                  animate={{ opacity: 1 }}
                  onClick={() => handleExploreClick(index)}
                >
                  {exploreButton}
                </motion.button>
              </motion.div>
              <motion.div
                className="service-image"
                style={{
                  boxShadow: themeStyles.cardShadow,
                  borderColor: themeStyles.cardBorder
                }}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                exit="exit"
                custom={index}
                viewport={{ margin: "-100px" }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 30px 60px rgba(0,0,0,0.5)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img 
                  src={index === 0 ? "pics.jpg" : index === 1 ? "pic.jpg" : "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1080,h=883,fit=crop,trim=0;0;16.778985507246375;0/YlenyqBkyesbG2vB/mechanical-sealing.36-mP4ZMBGkJksywGZp.png"} 
                  alt={service.title} 
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

