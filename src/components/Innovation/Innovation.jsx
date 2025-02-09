import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Model from '../../Model';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { useNavigate } from 'react-router-dom';

const Innovation = () => {
  const { isDark } = useTheme();
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
            camera={{ position: [5, 5, 5], fov: 45 }}
            style={{ 
              background: isDark ? '#000000' : '#ffffff',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }}
            shadows
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.4} /> {/* Reduced ambient light */}
              <pointLight 
                position={[10, 10, 10]} 
                intensity={2}
                castShadow
              />
              <spotLight
                position={[-10, 15, -10]}
                angle={0.3}
                penumbra={1}
                intensity={1}
                castShadow
              />
              <Model 
                scale={[5, 5, 5]}
                position={[0, 0, 0]}
                rotation={[0, Math.PI / 4, 0]}
              />
              <OrbitControls 
                autoRotate
                enableZoom={true}
                enablePan={true}
                minDistance={2}
                maxDistance={15}
              />
              <Environment preset="warehouse" intensity={1.5} />
              <gridHelper args={[20, 40]} position={[0, -0.01, 0]} />
            </Suspense>
          </Canvas>
        </div>
      </motion.div>
      
      <Footer />
    </div>
  );
};

export default Innovation;
