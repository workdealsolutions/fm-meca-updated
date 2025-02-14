import React, { useEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model({ position, scale, rotation, ...props }) {
  const [hasError, setHasError] = useState(false);
  const { nodes, materials } = useGLTF('/manual_transmission_gear_box.glb', 
    undefined,
    (error) => {
      console.error('Error loading model:', error);
      setHasError(true);
    }
  );

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
              scale={scale}
              rotation={rotation}
            />
          );
        }
        return null;
      })}
    </group>
  )
}

useGLTF.preload('/manual_transmission_gear_box.glb')