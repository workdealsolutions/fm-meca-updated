"use client"

import { useState, useEffect, useRef } from "react"
import * as echarts from "echarts"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import "./InnovationCooperation.css"
import { useTheme } from "../../context/ThemeContext"
import Footer from "../Footer/Footer"
import Spline from '@splinetool/react-spline'
import { motion, AnimatePresence } from "framer-motion" // Add this import

const InnovationCooperation = () => {
  const { isDark } = useTheme()
  const [isVisible, setIsVisible] = useState(false)
  const [isPageVisible, setIsPageVisible] = useState(false)
  const sectionRef = useRef(null)
  const chartRef = useRef(null)
  const [chartData, setChartData] = useState({
    years: ["2020", "2021", "2022", "2023", "2024", "2025"],
    values: [45, 58, 71, 82, 91, 97]
  })
  const [isModelAnimating, setIsModelAnimating] = useState(true);

  // Add a scroll lock while the model is animating
  useEffect(() => {
    if (isModelAnimating) {
      document.body.style.overflow = 'hidden';
      // Release scroll lock after animation
      const timer = setTimeout(() => {
        setIsModelAnimating(false);
        document.body.style.overflow = 'auto';
      }, 5000); // Changed from 3000 to 5000 for 5 seconds

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'auto';
      };
    }
  }, [isModelAnimating]);

  // Add Spline load handler
  const onSplineLoad = () => {
    setTimeout(() => {
      setIsModelAnimating(false);
    }, 4000); // Changed from 3000 to 5000 to match the above timeout
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 },
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

  const projectData = [
    {
      id: 1,
      title: "Quantum Computing Integration",
      description: "Revolutionary quantum computing system with 99.9% accuracy",
      image: "https://public.readdy.ai/ai/img_res/7ef64b28f9e795d92fc0c773ef90878d.jpg",
    },
    {
      id: 2,
      title: "AI-Powered Healthcare Solutions",
      description: "Advanced diagnostic system using artificial intelligence",
      image: "https://public.readdy.ai/ai/img_res/81e2656a78350be3478e6da7ee2526c7.jpg",
    },
    {
      id: 3,
      title: "Smart City Infrastructure",
      description: "Integrated urban management system for future cities",
      image: "https://public.readdy.ai/ai/img_res/0513e318616f3625f551ebcafd72b15d.jpg",
    },
  ]

  const partnerData = [
    {
      id: 1,
      name: "TechVision Global",
      status: "Active",
      description: "Pioneering quantum computing research and development",
      achievements: ["Quantum Supremacy Achievement", "Patent Portfolio: 250+"],
      image: "https://public.readdy.ai/ai/img_res/ad27300841e38e3de1af8451d12d07ef.jpg",
    },
    {
      id: 2,
      name: "BioTech Solutions",
      status: "Active",
      description: "Leading healthcare AI implementation partner",
      achievements: ["FDA Approval for AI Diagnostics", "100M+ Analyses Performed"],
      image: "https://public.readdy.ai/ai/img_res/5e855e7f9ca522b07a0a9c048c3cc6ba.jpg",
    },
    {
      id: 3,
      name: "SmartCity Innovations",
      status: "Active",
      description: "Smart infrastructure development and integration",
      achievements: ["15 Smart Cities Deployed", "Sustainability Award 2024"],
      image: "https://public.readdy.ai/ai/img_res/5344bc8ce05001ad5b873ece9670ae6f.jpg",
    },
  ]

  useEffect(() => {
    const chartDom = document.getElementById("growthChart")
    if (!chartDom) return

    const chart = echarts.init(chartDom, isDark ? 'dark' : 'default')
    chartRef.current = chart

    const options = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        borderColor: isDark ? 'rgba(128, 128, 128, 0.5)' : 'rgba(128, 128, 128, 0.2)',
        textStyle: { color: isDark ? '#ffffff' : '#000000' },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
        backgroundColor: isDark ? 'rgba(40, 40, 40, 0.3)' : 'rgba(255, 255, 255, 0.3)'
      },
      xAxis: {
        type: 'category',
        data: chartData.years,
        axisLabel: {
          color: isDark ? '#d1d1d1' : '#4a4a4a'
        },
        axisLine: {
          lineStyle: { color: isDark ? 'rgba(128, 128, 128, 0.5)' : 'rgba(128, 128, 128, 0.3)' }
        }
      },
      yAxis: {
        type: 'value',
        max: 100,
        axisLabel: {
          color: isDark ? '#d1d1d1' : '#4a4a4a',
          formatter: '{value}%'
        },
        axisLine: {
          lineStyle: { color: isDark ? 'rgba(128, 128, 128, 0.5)' : 'rgba(128, 128, 128, 0.3)' }
        },
        splitLine: {
          lineStyle: { color: isDark ? 'rgba(128, 128, 128, 0.2)' : 'rgba(128, 128, 128, 0.1)' }
        }
      },
      series: [{
        name: 'Innovation Growth',
        type: 'line',
        data: chartData.values,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: isDark ? '#ffffff' : '#000000'
        },
        lineStyle: {
          width: 4,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: isDark ? '#ffffff' : '#000000' },
            { offset: 1, color: isDark ? '#808080' : '#a0a0a0' }
          ])
        },
        areaStyle: {
          opacity: 0.3,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' },
            { offset: 1, color: isDark ? 'rgba(128, 128, 128, 0.05)' : 'rgba(128, 128, 128, 0.05)' }
          ])
        },
        emphasis: {
          itemStyle: {
            color: '#ffffff',
            borderWidth: 3,
            borderColor: '#404040'
          }
        }
      }],
      backgroundColor: 'transparent'
    }

    chart.setOption(options)

    const handleResize = () => {
      chart && chart.resize()
    }

    window.addEventListener('resize', handleResize)

    // Gradual data update every 5 seconds
    const updateInterval = setInterval(() => {
      setChartData(prevData => {
        const newValues = [...prevData.values]
        // Smooth random adjustment between -2 and +2
        const adjustment = (Math.random() - 0.5) * 4
        const lastValue = newValues[newValues.length - 1]
        // Ensure value stays within reasonable bounds
        const newValue = Math.min(100, Math.max(0, lastValue + adjustment))
        newValues.shift()
        newValues.push(Number(newValue.toFixed(1)))
        return {
          ...prevData,
          values: newValues
        }
      })
    }, 5000)

    return () => {
      chart.dispose()
      window.removeEventListener('resize', handleResize)
      clearInterval(updateInterval)
    }
  }, [isDark]) // Add isDark to dependency array

  // Update chart when data changes
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.setOption({
        series: [{
          data: chartData.values
        }]
      })
    }
  }, [chartData])

  useEffect(() => {
    // Add a small delay to trigger enter animation
    setTimeout(() => {
      setIsPageVisible(true)
    }, 100)

    return () => {
      setIsPageVisible(false)
    }
  }, [])

  return (
    <AnimatePresence>
      {isPageVisible && (
        <motion.div
          className={`inco-container ${isDark ? 'dark' : 'light'} ${isModelAnimating ? 'no-scroll' : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="inco-hero-section">
            <div className="inco-spline-background">
              <Spline 
                scene="https://prod.spline.design/QZBk5nVoFmn8-K1W/scene.splinecode"
                onLoad={onSplineLoad}
              />
            </div>
            <motion.div 
              className="inco-hero-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="inco-hero-title">
                <h1>Innovation & Cooperation</h1>
              </div>
              <div className="inco-hero-description">
                <p>Pioneering the future through collaborative innovation and groundbreaking technological advancements</p>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="inco-content-overlay"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: isModelAnimating ? 0 : 1,
              y: isModelAnimating ? 50 : 0
            }}
            transition={{ 
              duration: 0.5,
              delay: isModelAnimating ? 3 : 0 // Delay content appearance
            }}
          >
            <section ref={sectionRef} className="inco-content">
              <div className="inco-projects">
                <h2>Successful Projects</h2>
                <Swiper
                  modules={[Pagination, Autoplay]}
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 5000 }}
                  spaceBetween={30}
                  slidesPerView={1}
                  className="inco-project-swiper"
                >
                  {projectData.map((project) => (
                    <SwiperSlide key={project.id}>
                      <motion.div 
                        className="inco-project-slide"
                        initial={{ opacity: 1 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                      >
                        <img src={project.image || "/placeholder.svg"} alt={project.title} />
                        <div className="project-info">
                          <h3>{project.title}</h3>
                          <p>{project.description}</p>
                        </div>
                      </motion.div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className="inco-partners">
                <h2>Engineering Cooperation</h2>
                <div className="inco-partner-grid">
                  {partnerData.map((partner) => (
                    <motion.div
                      key={partner.id}
                      className="inco-partner-card"
                      initial={{ opacity: 1 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                    >
                      <img src={partner.image || "/placeholder.svg"} alt={partner.name} />
                      <div className="partner-header">
                        <h3>{partner.name}</h3>
                        <span className="partner-status">{partner.status}</span>
                      </div>
                      <p>{partner.description}</p>
                      <div className="partner-achievements">
                        {partner.achievements.map((achievement, index) => (
                          <div key={index} className="achievement">
                            <i className="fas fa-check-circle"></i>
                            <span>{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="inco-growth-analysis">
                <h2>Growth Trajectory Analysis</h2>
                <div className="chart-container">
                  <div id="growthChart"></div>
                </div>
              </div>
            </section>
            <Footer />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default InnovationCooperation

