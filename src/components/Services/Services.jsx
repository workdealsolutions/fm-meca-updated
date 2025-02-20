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
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isTyping && !isComplete) {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.substring(0, currentIndex));
          if (currentIndex === text.length) {
            setIsComplete(true);
          }
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, delay);

      return () => clearInterval(interval);
    }
  }, [text, delay, isTyping, isComplete]);

  return (
    <span 
      onMouseEnter={() => !isComplete && setIsTyping(true)} 
      className={isComplete ? 'typing-complete' : ''}
    >
      {displayText || text}
    </span>
  );
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 50, // Reduced from 100
    scale: 0.95, // Changed from 0.9
    filter: 'blur(4px)' // Reduced blur amount
  },
  visible: index => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 200,
      delay: index * 0.1, // Reduced delay
      duration: 0.5, // Reduced duration
    }
  })
};

const Services = () => {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { 
    once: true, 
    threshold: 0.2,
    margin: "-50px"
  });
  const navigate = useNavigate();

  const themeStyles = {
    background: isDark 
      ? 'linear-gradient(135deg, #000000, #1a1a1a)'
      : 'linear-gradient(135deg, #f5f5f5, #ffffff)',
    textColor: isDark ? '#ffffff' : '#000000',
    cardBg: isDark 
      ? 'linear-gradient(165deg, rgba(40, 40, 40, 0.95), rgba(10, 10, 10, 0.98))'
      : 'linear-gradient(165deg, rgba(240, 240, 240, 0.95), rgba(220, 220, 220, 0.98))',
    cardBorder: isDark 
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.1)',
    cardShadow: isDark
      ? '0 20px 40px rgba(0, 0, 0, 0.3)'
      : '0 20px 40px rgba(0, 0, 0, 0.1)',
    titleGradient: isDark
      ? 'linear-gradient(135deg, #000000, rgba(255, 255, 255, 0.7))'
      : 'linear-gradient(135deg, #000000, rgba(0, 0, 0, 0.8))',
    accentColor: isDark ? '#ff4444' : 'rgb(88, 73, 73)',
    titleColor: isDark ? '#ffffff' : '#000000',
    cardTitle: isDark ? '#ffffff' : '#000000', // This line ensures black color in light mode
    titleUnderline: isDark 
      ? 'linear-gradient(90deg, #ffffff, transparent)'
      : 'linear-gradient(90deg, rgb(88, 73, 73), transparent)',
    descriptionColor: isDark 
      ? 'rgba(255, 255, 255, 0.7)' 
      : 'rgba(70, 70, 70, 0.9)',
    borderColor: isDark
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgb(88, 73, 73)',
    titleAfter: isDark 
      ? 'linear-gradient(90deg, #000000, transparent)'
      : 'linear-gradient(90deg, #000000, transparent)',
    subtitleColor: isDark
      ? 'rgba(255, 255, 255, 0.7)'
      : 'rgba(0, 0, 0, 0.7)',
  };

  // Add this for performance optimization
  const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Optimized animation controls
  useEffect(() => {
    if (inView) {
      controls.start("visible", {
        transition: {
          staggerChildren: shouldReduceMotion ? 0 : 0.1,
          delayChildren: shouldReduceMotion ? 0 : 0.2
        }
      });
    }
  }, [controls, inView]);

  const serviceIcons = [<FiSettings />, <FiBox />, <FiFileText />];

  const handleExploreClick = (index) => {
    switch(index) {
      case 0:
        navigate('/services/industrial-solution');
        break;
      case 1:
        navigate('/services/product-development');
        break;
      case 2:
        navigate('/services/engineering-data');
        break;
      case 3:
        navigate('/services/technical-support');
        break;
      default:
        break;
    }
  };

  const services = [
    {
      title: language === 'en' ? "Industrial & Production Solutions" : "Solutions Industrielles et de Production",
      description: language === 'en' 
        ? "⚙️Is your production too slow or facing quality problems? Inefficient processes waste time and increase costs.\n\n🔧We improve your production line to make manufacturing faster, more accurate, and more reliable—helping you produce more with fewer mistakes."
        : "⚙️Votre production est-elle trop lente ou rencontre-t-elle des problèmes de qualité? Les processus inefficaces gaspillent du temps et augmentent les coûts.\n\n🔧Nous améliorons votre ligne de production pour rendre la fabrication plus rapide, plus précise et plus fiable, vous aidant à produire plus avec moins d'erreurs.",
      buttonText: language === 'en' ? "Create Your Solution" : "Créez Votre Solution"
    },
    {
      title: language === 'en' ? "Product Development & Innovation" : "Développement de Produits et Innovation",
      description: language === 'en'
        ? "💡 Have a great idea? We turn it into a real, manufacturable product—ready for production and success.\n\n🔧  From concept to production, we work side by side in a confidential, cooperative process.\n\n 🔍 Our smart design approach ensures your product is easy to produce, high quality, and market-ready."
        : "💡 Vous avez une excellente idée? Nous la transformons en un produit réel et fabricable.\n\n🛠️ Du concept à la production, nous travaillons à vos côtés dans un processus confidentiel et coopératif.\n\n✨ Notre approche de conception intelligente garantit que votre produit est facile à produire, de haute qualité et prêt pour le marché.",
      buttonText: language === 'en' ? "Shape Your Vision" : "Façonnez Votre Vision"
    },
    {
      title: language === 'en' ? "Engineering Data & Documentation" : "Données et Documentation d'Ingénierie",
      description: language === 'en'
        ? "📑 Lost in a mess of files and outdated drawings? We bring structure and clarity with 3Dexperience and SOLIDWORKS PDM.\n\n 📂 With our expertise, we help you organize, track, and maintain your technical documents efficiently, making teamwork smoother and your data more reliable."
        : "📑 Besoin d'aide pour gérer votre documentation technique?\n\n🔍 Nous optimisons votre processus de documentation technique avec nos solutions de gestion expertes—vous aidant à rester organisé et conforme.",
      buttonText: language === 'en' ? "Talk To An Expert" : "Parlez à un Expert"
    },
    {
      title: language === 'en' ? "Engineering Data & Documentation" : "Données et Documentation d'Ingénierie",
      description: language === 'en'
        ? "📑 Lost in a mess of files and outdated drawings? We bring structure and clarity with 3Dexperience and SOLIDWORKS PDM.\n\n 📂 With our expertise, we help you organize, track, and maintain your technical documents efficiently, making teamwork smoother and your data more reliable."
        : "📑 Besoin d'aide pour gérer votre documentation technique?\n\n🔍 Nous optimisons votre processus de documentation technique avec nos solutions de gestion expertes—vous aidant à rester organisé et conforme.",
      buttonText: language === 'en' ? "Talk To An Expert" : "Parlez à un Expert"
    }
  ];

  return (
    <section ref={ref} id="services" className="services" style={{ background: themeStyles.background, paddingTop: '4rem' }}> {/* Reduced padding */}
      <div className="services-content">
        {/* Replace current title animations with simpler ones */}
        <motion.div 
          className="services-section-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="section-title-main"
            style={{
              '--title-gradient': themeStyles.titleGradient,
              '--subtitle-color': themeStyles.subtitleColor,
            }}
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Our Services
          </motion.h1>
          <motion.p 
            className="section-title-sub"
            style={{ color: themeStyles.subtitleColor }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Discover our comprehensive range of professional services designed to meet your needs
          </motion.p>
          <motion.div 
            className="title-line"
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: "100px", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
        </motion.div>

        <div className="services-list">
          {services.map((service, index) => (
            <motion.div
              key={index}
              id={`service-${index + 1}`} // Add ID for each service card
              className="service-item"
              style={{ 
                color: themeStyles.accentColor,
                willChange: 'transform, opacity' // Add will-change for performance
              }}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={cardVariants}
              custom={index}
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
                animate={inView ? "visible" : "hidden"}
                custom={index}
              >
                <motion.h3 
                  className="service-card-heading"
                  style={{ 
                    color: themeStyles.cardTitle,
                    borderBottom: `1px solid ${themeStyles.borderColor}`
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
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
                    borderLeft: `2px solid ${themeStyles.borderColor}`,
                    whiteSpace: 'pre-wrap' // Add this to preserve line breaks
                  }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
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
                    x: 15,
                    color: 'rgb(88, 73, 73)',
                    scale: 1.02,
                    backgroundColor: "rgba(88, 73, 73, 0.05)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0.9 }}
                  animate={{ opacity: 1 }}
                  onClick={() => handleExploreClick(index)}
                >
                  {service.buttonText}
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
                animate={inView ? "visible" : "hidden"}
                custom={index}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 30px 60px rgba(0,0,0,0.5)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img 
                  src={index === 0 ? "Alu profile equipment.6.png" : index === 1 ? "EVC-C3.1.png" : index === 2 ? "Docs mng.png" : "EVC-C2.1.png"} 
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

