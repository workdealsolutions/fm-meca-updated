"use client"

import { useEffect, useRef, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay, EffectCoverflow } from "swiper/modules"
import { useTheme } from "../../context/ThemeContext"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/autoplay"
import "swiper/css/effect-coverflow"
import "./PartnersShowcase.css"

const partners = [
    {
        name: 'SMARTEC',
        logo: 'https://www.smartec.tn/css/front/images/logo-mobile-white.png',
        lightModeLogo: 'https://www.smartec.tn/css/front/images/logo-mobile.png' // Add light version
    },
    {
        name: 'Markabte',
        logo: 'https://public.readdy.ai/ai/img_res/15df35435fc3e9a050b21e6f7d0782e8.jpg'
    },
    {
        name: 'SIP',
        logo: 'https://public.readdy.ai/ai/img_res/4e40bac974b414cd58e4a43e259ac880.jpg'
    },
    {
        name: 'Phoenix MICRONE',
        logo: 'https://phoenixmicron.com/wp-content/themes/phoenixtech/assets/images/Phoenix-Micron-Color-on-Transparent_RGB-02.png'
    },
    {
        name: 'TransitFare',
        logo: '/TransitFare3-300x76.png',
        darkModeLogo: '/TransitFare3-white.png' // Add dark version of logo if available
    },
    {
        name: 'MEEK',
        logo: '/db8bea_d9649bde5512477e997b373b242c4427~mv2.avif',
        darkModeLogo: '/meek-white.png' // Add dark version of logo if available
    },
    {
        name: 'ABBK PhysicsWorks',
        logo: 'https://scontent.ftun14-1.fna.fbcdn.net/v/t39.30808-6/359404056_10160046588761379_3758527357639452835_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=pCoEJzp8lmMQ7kNvgHKRvti&_nc_oc=AdiXBM4KPIpbUZcHyXy3Rfcj_WcRcB3CbtCbOmywNUWWJ_nIuOsPYH0GnSPElljKxno&_nc_zt=23&_nc_ht=scontent.ftun14-1.fna&_nc_gid=AieOpOEjy0n5IZvDBSE1_Ba&oh=00_AYB7qfJfHEDhNQWIcs6kQ45Y6bMufQkurU57aBEEwYo4zA&oe=67ACF9F4'
    },
    {
        name: 'OIT',
        logo: '/oit-dark.svg', // Add dark version
        darkModeLogo: 'https://www.ilo.org/themes/custom/ilo/node_modules/@ilo-org/brand-assets/dist/assets/logo_fr_horizontal_white.svg'
    },
    {
        name: '3DExperience',
        logo: '/3D-experience-logo2.webp'
    },
    {
        name: 'ENISO',
        logo: 'https://static.cdnlogo.com/logos/e/50/eniso-tunisie.svg'
    }
]

const PartnersSection = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isGrid, setIsGrid] = useState(window.innerWidth >= 1600)
  const sectionRef = useRef(null)
  const { isDark } = useTheme()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )

    const handleResize = () => setIsGrid(window.innerWidth >= 1600)

    if (sectionRef.current) observer.observe(sectionRef.current)
    window.addEventListener('resize', handleResize)

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const renderPartnerCard = (partner, index) => (
    <div
      className={`partners-showcase__card ${isVisible ? "visible" : ""}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className={`partners-showcase__card-inner ${isDark ? 'dark' : 'light'}`}>
        <div className={`partners-showcase__logo-wrapper ${isDark ? 'dark' : 'light'}`}>
          <img 
            className="partners-showcase__logo-image" 
            src={isDark ? 
              (partner.darkModeLogo || partner.logo) : 
              (partner.lightModeLogo || partner.logo)
            } 
            alt={partner.name}
            loading="lazy"
          />
        </div>
        <div className={`partners-showcase__content ${isDark ? 'dark' : 'light'}`}>
          <h3 className={`partners-showcase__partner-name ${isDark ? 'dark' : 'light'}`}>
            {partner.name}
          </h3>
        </div>
      </div>
    </div>
  )

  return (
    <div ref={sectionRef} className={`partners-showcase__section ${isDark ? 'dark' : 'light'}`}>
      <div className={`partners-showcase__container ${isDark ? 'dark' : 'light'}`}>
        <div className={`partners-showcase__header ${isVisible ? "visible" : ""}`}>
          <h2 className="partners-showcase__title">Our Global Partners</h2>
          <p className="partners-showcase__description">
            Collaborating with industry leaders to shape the future of technology and innovation.
          </p>
        </div>
        
        {isGrid ? (
          <div className="partners-showcase__grid">
            {partners.map((partner, index) => renderPartnerCard(partner, index))}
          </div>
        ) : (
          <Swiper
            modules={[Pagination, Autoplay, EffectCoverflow]}
            effect="coverflow"
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: false,
            }}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            className="partners-showcase__swiper"
          >
            {partners.map((partner, index) => (
              <SwiperSlide key={partner.name}>
                {renderPartnerCard(partner, index)}
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  )
}

const PartnersShowCase = () => {
  const [scrollY, setScrollY] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { isDark } = useTheme()

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 20
      setMousePosition({ x, y })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("mousemove", handleMouseMove)
    document.documentElement.style.scrollBehavior = "smooth"

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
      document.documentElement.style.scrollBehavior = "auto"
    }
  }, [])

  return (
    <div id="partners" className={`partners-showcase__wrapper ${isDark ? 'dark' : 'light'}`}>
      <div
        className="partners-showcase__background"
        id="home"
        style={{
          transform: `translate3d(${-mousePosition.x * 2}px, ${-mousePosition.y * 2}px, 0) scale(1.1)`,
        }}
      >
        <img
          src="/e105c770-c564-49eb-a18c-d8737078d3dd.png"
          alt="Partners background"
          className="partners-showcase__bg-image"
        />
        <div className="partners-showcase__overlay" />
      </div>
      <div
        className="partners-showcase__hero"
        style={{
          transform: `translate3d(0, ${Math.min(scrollY * 0.3, 60)}px, 0) scale(${1 - scrollY * 0.0005})`,
          opacity: Math.max(0, Math.min(1, 1 - scrollY / 900)),
        }}
      >
        <div className="partners-showcase__hero-content">
          <h1 className="partners-showcase__hero-title">Our Partners</h1>
          <p className="partners-showcase__hero-text">
            Discover how we're collaborating with industry leaders to shape the future of innovation
          </p>
          <button 
            className="partners-showcase__hero-btn" 
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
          >
            Explore Partnerships
          </button>
        </div>
      </div>
      <div id="services" className="partners-showcase__main">
        <PartnersSection />
      </div>
      <div id="testimonials"></div>
      <div id="contact"></div>
    </div>
  )
}

export default PartnersShowCase

