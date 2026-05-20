import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function PhotoFrame({ src, hoverSrc, alt, className = '' }) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [ripples, setRipples] = useState([]);

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePos({ x, y });
    setIsHovered(true);

    // Create 3 immediate shockwave ripples
    const newRipples = [
      { id: Date.now(), x, y, delay: 0 },
      { id: Date.now() + 1, x, y, delay: 0.2 },
      { id: Date.now() + 2, x, y, delay: 0.4 },
    ];
    setRipples(newRipples);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRipples([]);
  };

  return (
    <motion.figure
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`proper-photo-frame group relative isolate overflow-hidden bg-[#06111f] shadow-2xl ${className}`}
      style={{ perspective: 1000 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4 }}
    >
      {/* 1. BASE LAYER: The Sketch (Always in background) */}
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover sketch-image transition-transform duration-700"
      />

      {/* 2. REVEAL LAYER: The Color Image (Expands to cover everything) */}
      <motion.div
        className="absolute inset-0 z-10"
        initial={{ clipPath: 'circle(0% at 50% 50%)' }}
        animate={{ 
          clipPath: isHovered 
            ? `circle(150% at ${mousePos.x}% ${mousePos.y}%)` 
            : `circle(0% at ${mousePos.x}% ${mousePos.y}%)` 
        }}
        transition={{ 
          duration: 1.2, 
          ease: [0.25, 1, 0.5, 1] // Smooth liquid easing
        }}
      >
        <img
          src={hoverSrc || src}
          alt=""
          className="h-full w-full object-cover color-bleed-image"
        />
      </motion.div>

      {/* 3. RIPPLE EFFECTS: Expanding "Water" Rings */}
      <AnimatePresence>
        {isHovered && ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="pointer-events-none absolute z-20 rounded-full border-2 border-white/30"
            initial={{ 
              width: 0, 
              height: 0, 
              left: `${ripple.x}%`, 
              top: `${ripple.y}%`, 
              opacity: 0.5 
            }}
            animate={{ 
              width: '250%', // Covers entire photo
              height: '250%', 
              opacity: 0 
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 1.5, 
              delay: ripple.delay,
              ease: "easeOut" 
            }}
            style={{ x: '-50%', y: '-50%' }}
          />
        ))}
      </AnimatePresence>

      {/* 4. OVERLAYS (Your CSS classes) */}
      <div className={`sketch-lines absolute inset-0 z-30 pointer-events-none transition-opacity duration-700 ${isHovered ? 'opacity-10' : 'opacity-40'}`} />
      
      {/* Moving Shimmer Light */}
      <motion.div
        className="absolute inset-0 z-40 pointer-events-none bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,255,0.1)_45%,transparent_70%)]"
        animate={{ x: ['-150%', '150%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />

      {/* 5. THE FRAME BORDER */}
      <div className="pointer-events-none absolute inset-0 z-50 rounded-[24px] ring-1 ring-inset ring-white/20 shadow-[inset_0_0_100px_rgba(0,0,0,0.6)]" />

      {/* 6. CENTER GLOW (Focal point) */}
      <motion.div 
        className="absolute z-10 w-24 h-24 bg-white/20 blur-3xl rounded-full pointer-events-none"
        animate={{ 
          left: `${mousePos.x}%`, 
          top: `${mousePos.y}%`,
          scale: isHovered ? [1, 1.5, 1] : 0,
          opacity: isHovered ? 0.6 : 0
        }}
        style={{ x: '-50%', y: '-50%' }}
      />
    </motion.figure>
  );
}