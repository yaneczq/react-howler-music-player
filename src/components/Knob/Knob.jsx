import { useState, useEffect, useRef } from 'react';
import { handleMouseDown, handleMouseMove, handleMouseUp } from './utils';
import "./styles.css";
import backgroundImage from '../../../public/images/knob-bg.svg'; // Adjust the path accordingly

const Knob = ({ onChange, maxAngle, startAngle }) => {
  const [angle, setAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
  const [initialMouseY, setInitialMouseY] = useState(0);
  const [initialAngle, setInitialAngle] = useState(0);

  const canvasRef = useRef(null);
  const centerRef = useRef({ x: 0, y: 0 });
  const indicatorRef = useRef({ x: 0, y: 0 });
  const RESIZE = 22;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = backgroundImage;

    img.onload = () => {
      const width = canvas.width;
      const height = canvas.height;


      const radius = RESIZE;
      const centerX = width / 2;
      const centerY = height / 2;
      const indicatorRadius = RESIZE - 8;
      const indicatorColor = '#4791FF';
      const arcColor = '#4791FF';
      const arcStartAngle = startAngle;
      const arcEndAngle = Math.min(angle + startAngle, startAngle + maxAngle);

      centerRef.current = { x: centerX, y: centerY };
      indicatorRef.current = {
        x: centerX + indicatorRadius * Math.cos(((angle + startAngle) * Math.PI) / 180),
        y: centerY + indicatorRadius * Math.sin(((angle + startAngle) * Math.PI) / 180),
      };

      ctx.clearRect(0, 0, width, height);

      // Draw the background image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const endAngleRad = (arcEndAngle * Math.PI) / 180;
      const startAngleRad = (arcStartAngle * Math.PI) / 180;
      // Draw the knob's outer circle
      ctx.beginPath();

      //CHANGE IT
      ctx.arc(centerX, centerY, 22, startAngleRad, 0.85);
      ctx.strokeStyle = '#242424';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngleRad, endAngleRad);
      ctx.strokeStyle = arcColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      const angleRad = ((angle + startAngle) * Math.PI) / 180;
      const endX = centerX + indicatorRadius * Math.cos(angleRad);
      const endY = centerY + indicatorRadius * Math.sin(angleRad);

      ctx.beginPath();
      ctx.arc(endX, endY, 2.15, 0, 2 * Math.PI);
      ctx.fillStyle = indicatorColor;
      ctx.fill();
    };

    if (onChange) {
      onChange(angle);
    }
  }, [angle, startAngle, maxAngle, onChange]);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleReset = () => {
    setAngle(0);
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleClick = (e) => {
    if (contextMenu.visible && !e.target.closest('.context-menu')) {
      setContextMenu({ ...contextMenu, visible: false });
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  });

  return (
    <div className='knob'>
      <canvas
      
        ref={canvasRef}
        // CHANGE IT 
        width={(2 * RESIZE) + 12}
        height={(2 * RESIZE) + 12}
        onMouseDown={(e) => handleMouseDown(e, setIsDragging, setInitialMouseY, setInitialAngle, angle)}
        onMouseMove={(e) => handleMouseMove(e, isDragging, setAngle, initialMouseY, initialAngle, maxAngle)}
        onMouseUp={() => handleMouseUp(setIsDragging)}
        onMouseLeave={() => setIsDragging(false)}
        onContextMenu={handleContextMenu}
      />
      <div>
        <span>Volume: {Math.round((angle) / 2.85)}%</span>
      </div>
      {contextMenu.visible && (
        <div
        className="context-menu"
        style={{
          left: contextMenu.x,
          top: contextMenu.y,
        }}
        >
          <button onClick={handleReset}>Reset</button>
        </div>
      )}
    </div>
  );
};

export default Knob;
