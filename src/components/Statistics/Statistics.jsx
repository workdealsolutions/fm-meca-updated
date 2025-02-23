<<<<<<< HEAD
import React from 'react';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import CountUp from 'react-countup';
import { FaUsers, FaChartLine, FaStar, FaClock, FaGlobe, FaAward, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { Chart, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './Statistics.css';
import initializeScrollReveal from './StatisticsScroll';


Chart.register(...registerables);

const Statistics = () => {
  const { isDark } = useTheme();
  const sectionRef = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const parallaxValue = rect.top / 10; // Adjust divisor for intensity
        sectionRef.current.style.backgroundPositionY = `${parallaxValue}px`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    initializeScrollReveal();
  }, []);
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
    clientRetention: {
      industry: 70,
      ours: 88
    },
    costEfficiency: {
      industry: 60,
      ours: 75
    }
  };

  const chartData = {
    labels: ['Success Rate', 'Client Retention', 'Cost Efficiency'],
    datasets: [
      {
        label: 'Industry Average',
        data: [comparativeStats.industryAverage, comparativeStats.clientRetention.industry, comparativeStats.costEfficiency.industry],
        backgroundColor: 'rgba(108, 117, 125, 0.6)',
      },
      {
        label: 'Our Performance',
        data: [comparativeStats.ourPerformance, comparativeStats.clientRetention.ours, comparativeStats.costEfficiency.ours],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <section className={`statistics-section ${isDark ? 'dark' : 'light'}`} ref={sectionRef}>
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
              transition={{ delay: index * 0.3 }} // Staggered delay
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
              transition={{ delay: index * 0.2 }} // Staggered delay
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
          <div className="chart-container">
            <Bar data={chartData} options={chartOptions} />
          </div>
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
            <div className="comparison-item">
              <div className="comparison-label">Client Retention</div>
              <div className="comparison-bars">
                <div className="bar-container">
                  <div className="bar industry" style={{ width: `${comparativeStats.clientRetention.industry}%` }}></div>
                  <span>Industry: {comparativeStats.clientRetention.industry}%</span>
                </div>
                <div className="bar-container">
                  <div className="bar ours" style={{ width: `${comparativeStats.clientRetention.ours}%` }}></div>
                  <span>Our Performance: {comparativeStats.clientRetention.ours}%</span>
                </div>
              </div>
            </div>
            <div className="comparison-item">
              <div className="comparison-label">Cost Efficiency</div>
              <div className="comparison-bars">
                <div className="bar-container">
                  <div className="bar industry" style={{ width: `${comparativeStats.costEfficiency.industry}%` }}></div>
                  <span>Industry: {comparativeStats.costEfficiency.industry}%</span>
                </div>
                <div className="bar-container">
                  <div className="bar ours" style={{ width: `${comparativeStats.costEfficiency.ours}%` }}></div>
                  <span>Our Performance: {comparativeStats.costEfficiency.ours}%</span>
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
=======
import React from 'react';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import CountUp from 'react-countup';
import { FaUsers, FaChartLine, FaStar, FaClock, FaGlobe, FaAward, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { Chart, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './Statistics.css';
import initializeScrollReveal from './StatisticsScroll';


Chart.register(...registerables);

const Statistics = () => {
  const { isDark } = useTheme();
  const sectionRef = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const parallaxValue = rect.top / 10; // Adjust divisor for intensity
        sectionRef.current.style.backgroundPositionY = `${parallaxValue}px`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    initializeScrollReveal();
  }, []);
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
    clientRetention: {
      industry: 70,
      ours: 88
    },
    costEfficiency: {
      industry: 60,
      ours: 75
    }
  };

  const chartData = {
    labels: ['Success Rate', 'Client Retention', 'Cost Efficiency'],
    datasets: [
      {
        label: 'Industry Average',
        data: [comparativeStats.industryAverage, comparativeStats.clientRetention.industry, comparativeStats.costEfficiency.industry],
        backgroundColor: 'rgba(108, 117, 125, 0.6)',
      },
      {
        label: 'Our Performance',
        data: [comparativeStats.ourPerformance, comparativeStats.clientRetention.ours, comparativeStats.costEfficiency.ours],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <section className={`statistics-section ${isDark ? 'dark' : 'light'}`} ref={sectionRef}>
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
              transition={{ delay: index * 0.3 }} // Staggered delay
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
              transition={{ delay: index * 0.2 }} // Staggered delay
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
          <div className="chart-container">
            <Bar data={chartData} options={chartOptions} />
          </div>
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
            <div className="comparison-item">
              <div className="comparison-label">Client Retention</div>
              <div className="comparison-bars">
                <div className="bar-container">
                  <div className="bar industry" style={{ width: `${comparativeStats.clientRetention.industry}%` }}></div>
                  <span>Industry: {comparativeStats.clientRetention.industry}%</span>
                </div>
                <div className="bar-container">
                  <div className="bar ours" style={{ width: `${comparativeStats.clientRetention.ours}%` }}></div>
                  <span>Our Performance: {comparativeStats.clientRetention.ours}%</span>
                </div>
              </div>
            </div>
            <div className="comparison-item">
              <div className="comparison-label">Cost Efficiency</div>
              <div className="comparison-bars">
                <div className="bar-container">
                  <div className="bar industry" style={{ width: `${comparativeStats.costEfficiency.industry}%` }}></div>
                  <span>Industry: {comparativeStats.costEfficiency.industry}%</span>
                </div>
                <div className="bar-container">
                  <div className="bar ours" style={{ width: `${comparativeStats.costEfficiency.ours}%` }}></div>
                  <span>Our Performance: {comparativeStats.costEfficiency.ours}%</span>
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
>>>>>>> d0fbf00912b44b96081dd9e02dd29abed141b98d
