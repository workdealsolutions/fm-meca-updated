import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import Model from '../../Model';
import Model2 from '../../Model2';
import Model3 from '../../Model3';  // Add this import

const Modal = ({ isOpen, onClose, modelType }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          zIndex: 1000
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            width: '100vw',
            height: '100vh'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Canvas
            camera={{ 
              position: [0, 2, 30],
              fov: 45,
              near: 0.1,
              far: 1000
            }}
            style={{ 
              width: '100%',
              height: '100%'
            }}
          >
            <ambientLight intensity={1.2} />
            <pointLight position={[10, 10, 10]} intensity={2} castShadow />
            <spotLight
              position={[0, 15, 10]}
              angle={0.4}
              penumbra={1}
              intensity={2}
              castShadow
            />
            
            {modelType === 'model1' ? (
              <Model 
                scale={[20, 20, 20]}
                position={[0, 0, 0]}
                rotation={[0, Math.PI / 4, 0]}
              />
            ) : modelType === 'model2' ? (
              <Model2
                scale={[15, 15, 15]}
                position={[-3, 0, -3]}
                rotation={[0, Math.PI / 4, 0]}
              />
            ) : (
              <Model3
                scale={[1, 1, 1]}
                position={[0, 0, 0]}
                rotation={[0, Math.PI / 4, 0]}
              />
            )}

            <Grid
              args={[100, 100]}
              cellSize={2}
              cellThickness={1}
              cellColor="#ffffff"
              sectionSize={5}
              sectionThickness={1.5}
              sectionColor="#ffffff"
              fadeDistance={100}
              fadeStrength={1}
              followCamera={false}
              infiniteGrid={true}
            />

            <OrbitControls
              autoRotate
              autoRotateSpeed={1}
              enableZoom={true}
              minDistance={15}
              maxDistance={50}
              target={[0, 0, 0]}
              enableDamping={true}
              dampingFactor={0.05}
            />
            <Environment preset="warehouse" intensity={1.5} />
          </Canvas>

          {/* Enhanced Close button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              position: 'absolute',
              top: '30px',
              right: '30px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '50px',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              fontSize: '16px',
              fontWeight: '500',
              letterSpacing: '1px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease',
            }}
            onClick={onClose}
            whileHover={{ 
              scale: 1.05,
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)',
            }}
            whileTap={{ scale: 0.95 }}
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            Close View
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;
