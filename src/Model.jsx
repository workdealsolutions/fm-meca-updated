import React, { useEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model({ position, scale, rotation, ...props }) {
  const [hasError, setHasError] = useState(false);
  const { nodes, materials } = useGLTF('/electrical_demolder-concept1.glb', 
    undefined,
    (error) => {
      console.error('Error loading model:', error);
      setHasError(true);
    }
  );

  // Enhance material properties
  useEffect(() => {
    if (materials) {
      Object.values(materials).forEach(material => {
        material.roughness = 0.3; // Increase sharpness
        material.metalness = 0.8; // Enhance metallic look
        material.envMapIntensity = 1.5; // Boost environment reflections
        material.needsUpdate = true;
      });
    }
  }, [materials]);

  useEffect(() => {
    if (nodes) {
      console.log('Model structure:', nodes);
      console.log('Materials:', materials);
    }
  }, [nodes, materials]);

  if (hasError) {
    return null; // Or render a fallback 3D object
  }

  return (
    <group {...props} dispose={null}>
      {nodes && Object.keys(nodes).map((key) => {
        const node = nodes[key];
        if (node?.type === 'Mesh' && node.geometry) {
          return (
            <mesh 
              key={key}
              geometry={node.geometry}
              material={node.material || materials.default}
              position={position}
              scale={scale ? scale : [1.0, 1.0, 1.0]}
              rotation={rotation}
              castShadow
              receiveShadow
            />
          );
        }
        return null;
      })}
    </group>
  )
}

useGLTF.preload('/electrical_demolder-concept1.glb')