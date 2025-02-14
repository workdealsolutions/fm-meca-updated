import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './Partners.css';
import { useTheme } from '../../context/ThemeContext';

const Partners = () => {
  const { isDark } = useTheme();
  const scrollRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const partners = [
    { 
      name: 'ABBK Physicsworks', 
      logo: 'https://scontent.ftun14-1.fna.fbcdn.net/v/t39.30808-6/359404056_10160046588761379_3758527357639452835_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=pCoEJzp8lmMQ7kNvgHKRvti&_nc_oc=AdiXBM4KPIpbUZcHyXy3Rfcj_WcRcB3CbtCbOmywNUWWJ_nIuOsPYH0GnSPElljKxno&_nc_zt=23&_nc_ht=scontent.ftun14-1.fna&_nc_gid=AieOpOEjy0n5IZvDBSE1_Ba&oh=00_AYB7qfJfHEDhNQWIcs6kQ45Y6bMufQkurU57aBEEwYo4zA&oe=67ACF9F4',
      isLight: false 
    },
    { 
      name: 'OIT', 
      logo: 'https://www.ilo.org/themes/custom/ilo/node_modules/@ilo-org/brand-assets/dist/assets/logo_fr_horizontal_white.svg',
      isLight: true 
    },
    { 
      name: '3DEXPERIENCE', 
      logo: '/3D-experience-logo2.webp',
      isLight: false 
    },
    { 
      name: 'ENISO', 
      logo: 'https://static.cdnlogo.com/logos/e/50/eniso-tunisie.svg',
      isLight: true 
    },
    { 
      name: 'SMARTEC', 
      logo: 'https://www.smartec.tn/css/front/images/logo-mobile-white.png',
      isLight: true 
    },
    { 
      name: 'Markabte', 
      isText: true
    },
    { 
      name: 'SIP', 
      isText: true
    },
    { 
      name: 'Phoenixmicron', 
      logo: 'https://phoenixmicron.com/wp-content/themes/phoenixtech/assets/images/Phoenix-Micron-Color-on-Transparent_RGB-02.png',
      isLight: false 
    },
    { 
      name: 'TransitFare', 
      logo: '/TransitFare3-300x76.png',
      isLight: false 
    },
    { 
      name: 'Meek Bathware', 
      logo: '/db8bea_d9649bde5512477e997b373b242c4427~mv2.avif',
      isLight: false 
    }
  ];

  // Double the partners array for seamless scrolling
  const displayPartners = [...partners, ...partners];

  useEffect(() => {
    const scrollContent = scrollRef.current;
    if (!scrollContent) return;

    // Create exactly one copy of the partners for smooth infinite scroll
    const items = Array.from(scrollContent.children).slice(0, partners.length);
    items.forEach(item => {
      const clone = item.cloneNode(true);
      clone.classList.add('clone');
      scrollContent.appendChild(clone);
    });

    return () => {
      const clones = scrollContent.querySelectorAll('.clone');
      clones.forEach(clone => clone.remove());
    };
  }, [partners.length]);

  return (
    <section 
      id="partners" 
      className="partners-section"
      style={{
        background: isDark ? '#111111' : '#f5f5f5',
      }}
    >
      <h2 className="partners-section-title" style={{ color: isDark ? '#ffffff' : '#000000' }}>
        Our Partners
      </h2>
      <div className="partners-container">
        <div className="scroll-container">
          <div 
            ref={scrollRef}
            className="scroll-content"
          >
            {displayPartners.map((partner, index) => (
              <div 
                key={index} 
                className="partner-item"
                style={{
                  background: 'transparent',
                }}
              >
                {partner.isText ? (
                  <span style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: isDark ? '#ffffff' : '#000000',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    {partner.name}
                  </span>
                ) : (
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    style={{
                      filter: partner.isLight
                        ? isDark
                          ? 'brightness(1)' // Light logo in dark mode
                          : 'brightness(0.1)' // Light logo in light mode
                        : isDark
                          ? 'brightness(2) invert(1)' // Dark logo in dark mode
                          : 'brightness(1)' // Dark logo in light mode
                    }}
                    className="partner-logo"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
