import { motion, useScroll, useTransform } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiArrowUpRight } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import LanguageToggle from '../../context/LanguageToggle';
import './Footer.css';

const Footer = () => {
  const { isDark } = useTheme();
  const { language, translations } = useLanguage();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0.8, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0.8, 1], [100, 0]);

  const contactInfo = [
    {
      icon: <FiMapPin />,
      text: '20 Mars IM AOUN AP501, SOUSSE 4000 - Tunisia'
    },
    {
      icon: <FiPhone />,
      text: '(+216) 50600465'
    },
    {
      icon: <FiMail />,
      text: 'Contact@fmmeca.com'
    }
  ];

  const services = translations[language].services;

  return (
    <motion.footer 
      className="footer"
      style={{ 
        opacity, 
        y,
        background: '#000000', // Keep footer always dark
        color: '#ffffff'
      }}
    >
      <div className={`footer-container ${isDark ? 'dark' : 'light'}`}>
        <motion.div 
          className="footer-section brand-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <img src="/jpg_to_png-removebg-preview.png" alt="FM MECA" className="footer-logo" />
          <h3 className="modern-text">FM MECA</h3>
          <p className="subtitle">FM MECA is an engineering consulting agency with a team of experts in manufacturing engineering, custom machinery design, and technical documents management. We pride ourselves on building long-term relationships with clients and providing them with the support and guidance they need to succeed.</p>
          <LanguageToggle />
        </motion.div>

        <motion.div 
          className="footer-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h4 className="section-title">{translations[language].contactInfo}</h4>
          <ul className="contact-info">
            {contactInfo.map((item, index) => (
              <motion.li
                key={index}
                className="contact-item glass-card"
                whileHover={{ 
                  x: 10,
                  backgroundColor: "rgba(255, 215, 0, 0.05)",
                  scale: 1.02
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.span 
                  className="icon"
                  whileHover={{ rotate: 15, scale: 1.2 }}
                >{item.icon}</motion.span>
                <span className="text">{item.text}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div 
          className="footer-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h4 className="section-title">{translations[language].ourServices}</h4>
          <ul className="services-list">
            {services.map((service, index) => (
              <motion.li
                key={index}
                className="service-item"
                whileHover={{ 
                  x: 15,
                  color: '#FF0000',
                  scale: 1.02,
                  backgroundColor: "rgba(255, 0, 0, 0.05)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{service}</span>
                <FiArrowUpRight className="arrow-icon" />
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      <motion.div 
        className="footer-bottom glass-effect"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="footer-bottom-content">
          <p>© {new Date().getFullYear()} FM MECA. {translations[language].rights}</p>
        </div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;