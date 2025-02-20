import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useState } from 'react';
import './Testimonials.css';

const Testimonials = () => {
  const { isDark } = useTheme();
  const isMobile = useIsMobile();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Temporary static data
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
      quote: "Exceeded my expectations in every way possible.",
      name: "Jane Smith",
      location: "London",
      project: "Mobile App"
    },
    // Add more testimonials as needed
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <motion.section 
      className="testimonials-section"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      style={{
        background: isDark ? '#000000' : 'var(--bg-primary)',
        padding: isMobile ? '3rem 0' : '6rem 0'
      }}
    >
      <motion.h2 
        className="testimonials-title"
        style={{ fontSize: isMobile ? '2rem' : '3rem' }}
      >
        What Our Clients Say
      </motion.h2>

      <div className="testimonials-scroll-container">
        <button className="testimonial-nav-button prev" onClick={prevTestimonial}>
          <span>&larr;</span>
        </button>
        <button className="testimonial-nav-button next" onClick={nextTestimonial}>
          <span>&rarr;</span>
        </button>

        <div className="testimonials-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="testimonials-card"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              style={{
                width: isMobile ? '85vw' : '380px',
                maxWidth: isMobile ? '300px' : '380px',
                margin: '0 auto'
              }}
            >
              <motion.div className="testimonials-stars">
                {[...Array(testimonials[currentIndex].stars)].map((_, i) => (
                  <motion.span 
                    key={i} 
                    className="testimonials-star"
                    style={{ '--i': i }}
                    initial={{ rotate: -180 }}
                    animate={{ rotate: 0 }}
                    transition={{ delay: 0.1 * i }}
                  >
                    ★
                  </motion.span>
                ))}
              </motion.div>

              <motion.p className="testimonials-quote">
                "{testimonials[currentIndex].quote}"
              </motion.p>

              <div className="testimonials-footer">
                <motion.div className="testimonials-client-info">
                  <h3 className="testimonials-client-name">
                    {testimonials[currentIndex].name}
                  </h3>
                  <p className="testimonials-client-location">
                    {testimonials[currentIndex].location}
                  </p>
                </motion.div>
                <motion.p className="testimonials-project">
                  {testimonials[currentIndex].project}
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <motion.div 
        className="explore-more-container"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ marginTop: isMobile ? '2rem' : '3rem' }}
      >
        <Link to="/reviews" className="explore-more-button">
          Explore More Reviews
        </Link>
      </motion.div>
    </motion.section>
  );
};

export default Testimonials;