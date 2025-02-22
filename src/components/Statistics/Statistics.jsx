import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { FaUsers, FaChartLine, FaStar, FaClock, FaGlobe, FaAward } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import './Statistics.css';

const Statistics = () => {
  const { isDark } = useTheme();

  const keyMetrics = [
    {
      id: 1,
      value: 98,
      suffix: '%',
      label: 'Success Rate',
      description: 'Project Completion Success',
      icon: <FaChartLine />,
      trend: '+15% from last year'
    },
    {
      id: 2,
      value: 250,
      label: 'Active Projects',
      description: 'Ongoing Global Projects',
      icon: <FaGlobe />,
      trend: '+28% growth'
    },
    {
      id: 3,
      value: 95,
      suffix: '%',
      label: 'Client Satisfaction',
      description: 'Overall Satisfaction Rate',
      icon: <FaStar />,
      trend: 'Consistently above 90%'
    }
  ];

  const additionalStats = [
    {
      id: 4,
      value: 15000,
      label: 'Work Hours',
      description: 'Dedicated Engineering Hours',
      icon: <FaClock />
    },
    {
      id: 5,
      value: 50,
      label: 'Expert Team',
      suffix: '+',
      description: 'Specialized Engineers',
      icon: <FaUsers />
    },
    {
      id: 6,
      value: 25,
      label: 'Industry Awards',
      description: 'Recognition of Excellence',
      icon: <FaAward />
    }
  ];

  const comparativeStats = {
    industryAverage: 85,
    ourPerformance: 98,
    completionTime: {
      industry: 120,
      ours: 90
    }
  };

  return (
    <section className={`statistics-section ${isDark ? 'dark' : 'light'}`}>
      <div className="statistics-container">
        <div className="statistics-header">
          <motion.h2 
            className="statistics-title"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Our Impact in Numbers
          </motion.h2>
          <motion.p 
            className="statistics-subtitle"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Measuring excellence through verified metrics and real results
          </motion.p>
        </div>

        <div className="stats-main-grid">
          {keyMetrics.map((stat, index) => (
            <motion.div
              key={stat.id}
              className="stat-card primary"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-content">
                <div className="stat-value">
                  <CountUp
                    end={stat.value}
                    duration={3}
                    suffix={stat.suffix}
                    enableScrollSpy
                    scrollSpyOnce
                  />
                </div>
                <h3 className="stat-label">{stat.label}</h3>
                <p className="stat-description">{stat.description}</p>
                <span className="stat-trend">{stat.trend}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="stats-secondary-grid">
          {additionalStats.map((stat, index) => (
            <motion.div
              key={stat.id}
              className="stat-card secondary"
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-content">
                <div className="stat-value">
                  <CountUp
                    end={stat.value}
                    duration={2}
                    suffix={stat.suffix}
                    enableScrollSpy
                    scrollSpyOnce
                  />
                </div>
                <h3 className="stat-label">{stat.label}</h3>
                <p className="stat-description">{stat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="comparative-section">
          <h3 className="comparative-title">Industry Comparison</h3>
          <div className="comparison-grid">
            <div className="comparison-item">
              <div className="comparison-label">Success Rate</div>
              <div className="comparison-bars">
                <div className="bar-container">
                  <div className="bar industry" style={{width: `${comparativeStats.industryAverage}%`}}></div>
                  <span>Industry: {comparativeStats.industryAverage}%</span>
                </div>
                <div className="bar-container">
                  <div className="bar ours" style={{width: `${comparativeStats.ourPerformance}%`}}></div>
                  <span>Our Performance: {comparativeStats.ourPerformance}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Statistics;
