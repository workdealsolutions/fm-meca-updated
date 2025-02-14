import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../Footer/Footer';
import './Reviews.css';
import { useMediaQuery } from 'react-responsive';

const Reviews = () => {
  const { isDark } = useTheme();
  const heroImageUrl = "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1800";

  // Add mobile breakpoint detection
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });
  const isLargeScreen = useMediaQuery({ minWidth: 1025 });

  // Move static data declarations here, before the hooks
  const testimonials = [
    {
      stars: 5,
      quote: "Amazing service! Really professional and efficient.",
      name: "John Doe",
      location: "New York",
      project: "Website Development"
    },
    {
      stars: 5,
      quote: "Exceeded my expectations in every way possible.",
      name: "Jane Smith",
      location: "London",
      project: "Mobile App"
    },
    {
      stars: 5,
      quote: "They understood our vision perfectly and delivered beyond expectations.",
      name: "Tom Chen",
      location: "Tokyo",
      project: "Digital Transformation"
    },
    {
      stars: 5,
      quote: "Innovative solutions that helped scale our business rapidly.",
      name: "Lisa Wong",
      location: "Singapore",
      project: "AI Integration"
    },
    {
      stars: 5,
      quote: "Outstanding technical expertise and customer service.",
      name: "Ahmed Hassan",
      location: "Dubai",
      project: "Cloud Migration"
    },
    {
      stars: 5,
      quote: "Remarkable attention to detail and timely delivery.",
      name: "Isabella Martinez",
      location: "Madrid",
      project: "E-commerce Platform"
    },
    {
      stars: 5,
      quote: "Their creative solutions transformed our user experience.",
      name: "Klaus Mueller",
      location: "Berlin",
      project: "UX Redesign"
    },
    {
      stars: 5,
      quote: "Professional team that delivers exceptional results.",
      name: "Sophie Dubois",
      location: "Paris",
      project: "Brand Identity"
    }
  ];

  const featuredTestimonials = [
    {
      stars: 5,
      quote: "The attention to detail and the quality of work is outstanding. A truly exceptional service that exceeded all my expectations.",
      name: "Michael Johnson",
      location: "California",
      project: "E-commerce Platform",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
    },
    {
      stars: 5,
      quote: "Working with this team was a game-changer for our business. Their innovative solutions helped us reach new heights.",
      name: "Sarah Williams",
      location: "Toronto",
      project: "Mobile Application",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
    },
    {
      stars: 5,
      quote: "Professional, responsive, and incredibly talented. They turned our vision into reality with remarkable precision.",
      name: "David Chen",
      location: "Singapore",
      project: "Web Platform",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
    }
  ];

  // State declarations
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeStep, setActiveStep] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Refs
  const containerRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    // Adjust items per page based on screen size
    if (isMobile) {
      setItemsPerPage(2);
    } else if (isTablet) {
      setItemsPerPage(3);
    } else {
      setItemsPerPage(4);
    }
  }, [isMobile, isTablet]);

  // Calculate pagination
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  const paginatedTestimonials = testimonials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > window.innerHeight / 3;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useLayoutEffect(() => {
    if (isMobile) return; // Don't apply GSAP animations on mobile

    gsap.registerPlugin(ScrollTrigger);
    
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        pin: true,
        scrub: 1,
        snap: 1 / (testimonials.length - 1),
        end: "+=3000",
        onUpdate: self => {
          const progress = self.progress;
          const newStep = Math.ceil(progress * testimonials.length);
          setActiveStep(newStep === 0 ? 1 : newStep);

          // Update progress line width
          const progressLine = document.querySelector('.progress-line-fill');
          if (progressLine) {
            progressLine.style.width = `${progress * 100}%`;
          }
        }
      }
    });

    // Add extra padding to ensure last card is fully visible
    timeline.to(containerRef.current, {
      x: () => -(containerRef.current.scrollWidth - window.innerWidth + 400), // Increased from 100 to 400
      ease: "none"
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [testimonials.length, isMobile]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredTestimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredTestimonials.length) % featuredTestimonials.length);
  };

  return (
    <div className="reviews-page">
      <Navbar />
      
      {/* Fixed background */}
      <motion.div 
        className="reviews-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          backgroundImage: `url(${heroImageUrl})`,
          backgroundColor: isDark ? '#000000' : 'var(--bg-primary)' // Add fallback color
        }}
      />
      <div className="reviews-hero-overlay" />
      
      {/* Hero Title */}
      <motion.h1 
        className={`reviews-hero-title ${isScrolled ? 'scrolled' : ''}`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        REVIEWS & TESTIMONIALS
      </motion.h1>

      {/* Content Wrapper */}
      <div className="reviews-content-wrapper">
        <main className="reviews-content">
          <div className="featured-testimonial-section">
            <h2 className="featured-title">What Our Customers Say</h2>
            <div className="featured-testimonial-container">
              <button className="slider-button prev" onClick={prevSlide}>‹</button>
              <AnimatePresence mode='wait'>
                <motion.div
                  key={currentSlide}
                  className="featured-testimonial"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="featured-content">
                    <img 
                      src={featuredTestimonials[currentSlide].image || "/placeholder.svg"} 
                      alt={featuredTestimonials[currentSlide].name} 
                      className="featured-image" 
                    />
                    <div className="featured-text">
                      <div className="featured-stars">
                        {[...Array(featuredTestimonials[currentSlide].stars)].map((_, i) => (
                          <span key={i} className="testimonials-star">★</span>
                        ))}
                      </div>
                      <p className={`featured-quote ${!isDark ? 'light-mode' : ''}`}>
                        "{featuredTestimonials[currentSlide].quote}"
                      </p>
                      <div className="featured-footer">
                        <div className="featured-client-info">
                          <h3 className={`featured-client-name ${!isDark ? 'light-mode' : ''}`}>
                            {featuredTestimonials[currentSlide].name}
                          </h3>
                          <p className={`featured-client-location ${!isDark ? 'light-mode' : ''}`}>
                            {featuredTestimonials[currentSlide].location}
                          </p>
                        </div>
                        <p className="featured-project">{featuredTestimonials[currentSlide].project}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              <button className="slider-button next" onClick={nextSlide}>›</button>
              <div className="slider-dots">
                {featuredTestimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`slider-dot ${currentSlide === index ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="horizontal-scroll-section" ref={sectionRef}>
            <h2 className="featured-title">All Reviews</h2>
            {!isMobile && (
              <div className="progress-line">
                <div className="progress-line-fill"></div>
                {testimonials.map((_, index) => (
                  <div 
                    key={index} 
                    className={`progress-dot ${index + 1 === activeStep ? 'active' : ''}`}
                    style={{
                      left: `${(index / (testimonials.length - 1)) * 100}%`
                    }}
                  >
                    <span className="dot-number">{index + 1}</span>
                  </div>
                ))}
              </div>
            )}
            <div className={`reviews-grid ${isMobile ? 'mobile-grid' : 'horizontal'}`} ref={containerRef}>
              {(isMobile ? paginatedTestimonials : testimonials).map((testimonial, index) => (
                <motion.div
                  key={index}
                  className={`testimonials-card ${!isMobile && index + 1 === activeStep ? 'active' : ''}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: isMobile ? 1 : (index + 1 === activeStep ? 1 : 0.5),
                    scale: isMobile ? 1 : (index + 1 === activeStep ? 1 : 0.8)
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="testimonials-stars">
                    {[...Array(testimonial.stars)].map((_, i) => (
                      <span key={i} className="testimonials-star">★</span>
                    ))}
                  </div>
                  <p className="testimonials-quote">"{testimonial.quote}"</p>
                  <div className="testimonials-footer">
                    <div className="testimonials-client-info">
                      <h3 className="testimonials-client-name">{testimonial.name}</h3>
                      <p className="testimonials-client-location">{testimonial.location}</p>
                    </div>
                    <p className="testimonials-project">{testimonial.project}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            {isMobile && (
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Reviews;