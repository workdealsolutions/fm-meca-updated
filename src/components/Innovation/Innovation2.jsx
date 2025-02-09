import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Model2 from '../../Model2';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { useNavigate } from 'react-router-dom';

const Innovation2 = () => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleNavigation = (href) => {
    if (href.startsWith('#')) {
      navigate('/' + href);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onNavigate={handleNavigation} />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="innovation-showcase"
        style={{
          flex: 1,
          width: '100%',
          position: 'relative',
          background: isDark ? '#000000' : '#ffffff',
        }}
      >
        <div style={{ 
          width: '100%', 
          height: 'calc(100vh - 140px)',
          position: 'relative'
        }}>
          <Canvas
            camera={{ position: [-3, 4, 3], fov: 50 }}
            style={{ background: isDark ? '#000000' : '#ffffff' }}
            shadows
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.3} />
              <pointLight 
                position={[10, 10, 10]} 
                intensity={2.5}
                castShadow
              />
              <spotLight
                position={[-10, 15, -10]}
                angle={0.3}
                penumbra={1}
                intensity={1.5}
                castShadow
              />
              <Model2 
                scale={[4, 4, 4]}
                position={[-5, 0.1, 0]}
              />
              <OrbitControls 
                autoRotate
                enableZoom={true}
                enablePan={true}
                minDistance={2}
                maxDistance={10}
              />
              <Environment preset="studio" intensity={2.0} />
              <gridHelper args={[20, 40]} position={[0, -0.01, 0]} />
            </Suspense>
          </Canvas>
        </div>
      </motion.div>
      
      <Footer />
    </div>
  );
};

export default Innovation2;
