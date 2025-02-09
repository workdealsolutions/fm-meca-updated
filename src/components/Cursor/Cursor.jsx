import { useEffect, useState } from 'react';
import './Cursor.css';

const Cursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    const hoverCheck = () => {
      // Convert NodeList to Array
      const hoveredElements = Array.from(document.querySelectorAll(':hover'));
      setIsHovering(hoveredElements.some(el => el.classList.contains('hover-effect')));
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', hoverCheck);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', hoverCheck);
    };
  }, []);

  return (
    <div 
      className={`cursor ${isHovering ? 'hover' : ''}`} 
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        transition: 'transform 0.1s ease-out, width 0.2s ease, height 0.2s ease'
      }}
    />
  );
};

export default Cursor;