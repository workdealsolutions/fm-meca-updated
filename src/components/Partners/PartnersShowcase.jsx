"use client"

import { useEffect, useRef, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/autoplay"
import "./PartnersShowcase.css"

const partners = [
    {
        name: 'Quantum Dynamics',
        description: 'Pioneering advanced AI solutions with quantum computing integration, specializing in complex problem-solving and predictive analytics for enterprise-level applications.',
        logo: 'https://public.readdy.ai/ai/img_res/fae666b4497b2ead12a58d263cf38d20.jpg'
        },
        {
        name: 'NexaTech Global',
        description: 'Leading provider of enterprise-grade cloud infrastructure solutions, offering scalable and secure platforms for digital transformation and business innovation.',
        logo: 'https://public.readdy.ai/ai/img_res/15df35435fc3e9a050b21e6f7d0782e8.jpg'
        },
        {
        name: 'Stellar Systems',
        description: 'Revolutionary space technology solutions for satellite communications, orbital logistics, and deep space exploration, pushing the boundaries of human achievement.',
        logo: 'https://public.readdy.ai/ai/img_res/4e40bac974b414cd58e4a43e259ac880.jpg'
        },
        {
        name: 'CyberForge Industries',
        description: 'Next-generation cybersecurity solutions protecting global enterprises with AI-driven threat detection, blockchain security, and zero-trust architecture implementation.',
        logo: 'https://public.readdy.ai/ai/img_res/5be9c5eb7f3c987b0a1f5faf05e5775f.jpg'
        },
        {
        name: 'Fusion Dynamics',
        description: 'Innovative clean energy solutions leveraging fusion technology and smart grid systems for sustainable power generation and distribution worldwide.',
        logo: 'https://public.readdy.ai/ai/img_res/8a22c3c4468f9530886a489e1226e1a8.jpg'
        },
        {
        name: 'BioSynth Labs',
        description: 'Cutting-edge biotechnology research facility specializing in synthetic biology, genomics, and personalized medicine development for global healthcare advancement.',
        logo: 'https://public.readdy.ai/ai/img_res/b3e4809db4e3d09415b84bcd7a928027.jpg'
        },
        {
        name: 'Vertex Solutions',
        description: 'Expert software engineering consultancy delivering custom enterprise solutions, cloud-native applications, and digital transformation strategies.',
        logo: 'https://public.readdy.ai/ai/img_res/9394652df86430db3f43ae518087a3b4.jpg'
        },
        {
        name: 'Aurora Technologies',
        description: 'Digital innovation powerhouse creating immersive AR/VR experiences, IoT solutions, and advanced machine learning applications for the future of technology.',
        logo: 'https://public.readdy.ai/ai/img_res/f5e37addb87a935846c0e1db5333d58f.jpg'
        }
]

const PartnersSection = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        threshold: 0.1,
      },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <div ref={sectionRef} className="partners-showcase__section">
      <div className="partners-showcase__container">
        <div className={`partners-showcase__header ${isVisible ? "visible" : ""}`}>
          <h2 className="partners-showcase__title">Our Global Partners</h2>
          <p className="partners-showcase__description">
            Collaborating with industry leaders to shape the future of technology and innovation.
          </p>
        </div>
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet',
            bulletActiveClass: 'swiper-pagination-bullet-active',
          }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          className="partners-showcase__swiper"
        >
          {partners.map((partner, index) => (
            <SwiperSlide key={partner.name}>
              <div
                className={`partners-showcase__card ${isVisible ? "visible" : ""}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="partners-showcase__card-inner">
                  <div className="partners-showcase__logo-wrapper">
                    <img 
                      className="partners-showcase__logo-image" 
                      src={partner.logo || "/placeholder.svg"} 
                      alt={partner.name} 
                    />
                  </div>
                  <div className="partners-showcase__content">
                    <h3 className="partners-showcase__partner-name">{partner.name}</h3>
                    <p className="partners-showcase__description">
                      {partner.description}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

const PartnersShowcase = () => {
  const [scrollY, setScrollY] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

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
    <div className="partners-showcase__wrapper">
      <div
        className="partners-showcase__background"
        style={{
          transform: `translate3d(${-mousePosition.x * 2}px, ${-mousePosition.y * 2}px, 0) scale(1.1)`,
        }}
      >
        <img className="partners-showcase__bg-image" src="https://public.readdy.ai/ai/img_res/9f202f3a1ead8283d6b595d6081ce73b.jpg" alt="Background" />
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
          <h1 className="partners-showcase__hero-title">Our Technology Partners</h1>
          <p className="partners-showcase__hero-text">Discover how we're collaborating with industry leaders to shape the future of innovation</p>
          <button className="partners-showcase__hero-btn" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}>
            Explore Partnerships
          </button>
        </div>
      </div>
      <div className="partners-showcase__main">
        <PartnersSection />
      </div>
    </div>
  )
}

export default PartnersShowcase

