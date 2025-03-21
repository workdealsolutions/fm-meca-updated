import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiArrowUpRight } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import './Footer.css';
import { useIsMobile } from '../../hooks/useIsMobile';

const Footer = () => {
  const { isDark } = useTheme();
  const { language, translations } = useLanguage();
  const isMobile = useIsMobile();

  const contactInfo = [
    {
      icon: <FiMapPin />,
      text: 'Avenue Yasser Arafet Imm Fraj2 Sahloul 1, Sousse 4054, Tunisia',
      link: 'https://maps.app.goo.gl/BZafJnKEm1Pbu5Q78'
    },
    {
      icon: <FiPhone />,
      text: '(+216) 50600465',
      link: 'https://wa.me/21650600465'
    },
    {
      icon: <FiMail />,
      text: 'Contact@fmmeca.com',
      link: 'mailto:Contact@fmmeca.com'
    }
  ];

  const services = [
    {
      title: 'Industrial & Production Solutions',
      link: '#service-1'
    },
    {
      title: 'Product Development & Innovation',
      link: '#service-2'
    },
    {
      title: 'Engineering Data & Documentation',
      link: '#service-3'
    },
    {
      title: 'Engineering Data',
      link: '#service-4'
    }
  ];

  return (
    <footer className={`footer ${isMobile ? 'footer-mobile' : ''}`}>
      <div className={`footer-container ${isDark ? 'dark' : 'light'}`}>
        <div className="footer-section brand-section">
          <img src="/jpg_to_png-removebg-preview.png" alt="FM MECA" className="footer-logo" />
          <h3 className="modern-text">FM MECA</h3>
          <p className="subtitle footer-description">FM MECA is an engineering consulting agency with a team of experts in manufacturing engineering, custom machinery design, and technical documents management. We pride ourselves on building long-term relationships with clients and providing them with the support and guidance they need to succeed.</p>
        </div>

        <div className="footer-section">
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
                {item.link ? (
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text"
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    {item.text}
                  </a>
                ) : (
                  <span className="text">{item.text}</span>
                )}
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="section-title">{translations[language].ourServices}</h4>
          <ul className="services-list">
            {services.map((service, index) => (
              <motion.li
                key={index}
                className="service-item"
                whileHover={{ 
                  x: 15,
                  color: 'rgb(88, 73, 73)',
                  scale: 1.02,
                  backgroundColor: "rgba(88, 73, 73, 0.05)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const element = document.querySelector(service.link);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <span>{service.title}</span>
                <FiArrowUpRight className="arrow-icon" />
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer-bottom glass-effect">
        <div className="footer-bottom-content">
          <p>© {new Date().getFullYear()} FM MECA. {translations[language].rights}</p>
          <p>Created by <a>workdealsolution@gmail.com</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
