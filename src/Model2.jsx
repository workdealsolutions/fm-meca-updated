import React, { useEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model({ position, scale, ...props }) {
  const [hasError, setHasError] = useState(false);
  const { nodes, materials } = useGLTF('/machine_model.glb', 
    undefined,
    (error) => {
      console.error('Error loading model:', error);
      setHasError(true);
    }
  );

  // Enhanced material properties
  useEffect(() => {
    if (materials) {
      Object.values(materials).forEach(material => {
        material.roughness = 0.2; // Lower roughness for sharper reflections
        material.metalness = 0.9; // Higher metalness for metallic look
        material.envMapIntensity = 2.0; // Stronger environment reflections
        material.clearcoat = 0.5; // Add clear coat for extra shine
        material.clearcoatRoughness = 0.1; // Smooth clear coat
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
              scale={scale ? scale : [0.3, 0.3, 0.3]} // Changed from 0.2 to 0.05
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

useGLTF.preload('/machine_model.glb')