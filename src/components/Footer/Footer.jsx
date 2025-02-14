import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiArrowUpRight } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import LanguageToggle from '../../context/LanguageToggle';
import './Footer.css';

const Footer = () => {
  const { isDark } = useTheme();
  const { language, translations } = useLanguage();

  const contactInfo = [
    {
      icon: <FiMapPin />,
      text: 'Avenue Yasser Arafet Imm Fraj2 Sahloul 1, Sousse 4054, Tunisia',
      link: 'https://www.google.com/maps/search/?api=1&query=35.83145383768949+10.62516113902816'
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

  const services = translations[language].services;

  return (
    <footer className="footer">
      <div className={`footer-container ${isDark ? 'dark' : 'light'}`}>
        <div className="footer-section brand-section">
          <img src="/jpg_to_png-removebg-preview.png" alt="FM MECA" className="footer-logo" />
          <h3 className="modern-text">FM MECA</h3>
          <p className="subtitle">FM MECA is an engineering consulting agency with a team of experts in manufacturing engineering, custom machinery design, and technical documents management. We pride ourselves on building long-term relationships with clients and providing them with the support and guidance they need to succeed.</p>
          <LanguageToggle />
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
              >
                <span>{service}</span>
                <FiArrowUpRight className="arrow-icon" />
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer-bottom glass-effect">
        <div className="footer-bottom-content">
          <p>© {new Date().getFullYear()} FM MECA. {translations[language].rights}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;