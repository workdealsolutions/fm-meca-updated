import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';
import './Testimonials.css';

const Testimonials = () => {
  const { isDark } = useTheme();

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

  return (
    <motion.section 
      className="testimonials-section"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      style={{
        background: isDark ? '#000000' : 'var(--bg-primary)'
      }}
    >
      <motion.h2 className="testimonials-title">
        What Our Clients Say
      </motion.h2>

      <div className="testimonials-scroll-container">
        <div className="testimonials-container">
          <div className="testimonials-track">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="testimonials-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.2,
                  duration: 0.8,
                  type: "spring"
                }}
                whileHover={{ 
                  scale: 1.02,
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)"
                }}
              >
                <motion.div 
                  className="testimonials-stars"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.2 }}
                >
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <motion.span 
                      key={i} 
                      className="testimonials-star"
                      style={{ '--i': i }} // Add this line for star animation delay
                      initial={{ rotate: -180 }}
                      animate={{ rotate: 0 }}
                      transition={{ delay: 0.1 * i }}
                    >
                      ★
                    </motion.span>
                  ))}
                </motion.div>

                <motion.p 
                  className="testimonials-quote"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  "{testimonial.quote}"
                </motion.p>

                <div className="testimonials-footer">
                  <motion.div 
                    className="testimonials-client-info"
                    whileHover={{ color: "var(--accent-color)" }}
                  >
                    <h3 className="testimonials-client-name">{testimonial.name}</h3>
                    <p className="testimonials-client-location">{testimonial.location}</p>
                  </motion.div>
                  <motion.p 
                    className="testimonials-project"
                    whileHover={{ scale: 1.05 }}
                  >
                    {testimonial.project}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <motion.div 
        className="explore-more-container"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Link to="/reviews" className="explore-more-button">
          Explore More Reviews
        </Link>
      </motion.div>
    </motion.section>
  );
};

export default Testimonials;