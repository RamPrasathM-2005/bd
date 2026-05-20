import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function PhotoFrame({ src, hoverSrc, alt, mode = 'color', className = '' }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isTouchReveal, setIsTouchReveal] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [ripples, setRipples] = useState([]);
  const canReveal = mode === 'sketch' && hoverSrc;
  const isSketch = mode === 'sketch';
  const imageFitClass = isSketch ? 'object-contain' : 'object-cover';

  const startReveal = (x, y, withRipples = true, isTouch = false) => {
    setMousePos({ x, y });
    setIsTouchReveal(isTouch);
    setIsRevealed(true);

    setRipples(
      withRipples
        ? [
            { id: Date.now(), x, y, delay: 0 },
            { id: Date.now() + 1, x, y, delay: 0.2 },
            { id: Date.now() + 2, x, y, delay: 0.4 }
          ]
        : []
    );
  };

  const getPointerPosition = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    };
  };

  const handlePointerEnter = (e) => {
    if (!canReveal || e.pointerType !== 'mouse') return;
    const { x, y } = getPointerPosition(e);
    startReveal(x, y, true, false);
  };

  const handlePointerLeave = (e) => {
    if (!canReveal || e.pointerType !== 'mouse') return;
    setIsRevealed(false);
    setIsTouchReveal(false);
    setRipples([]);
  };

  const handlePointerDown = (e) => {
    const { x, y } = getPointerPosition(e);

    if (canReveal && e.pointerType !== 'mouse') {
      startReveal(x, y, false, true);
    }
  };

  const endTouchReveal = (e) => {
    if (!canReveal || e.pointerType === 'mouse') return;
    setIsRevealed(false);
    setIsTouchReveal(false);
    setRipples([]);
  };

  const handleKeyDown = (e) => {
    if (!canReveal || (e.key !== 'Enter' && e.key !== ' ')) return;
    e.preventDefault();
    isRevealed ? setIsRevealed(false) : startReveal(50, 50, true, false);
  };

  return (
    <motion.figure
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={endTouchReveal}
      onPointerCancel={endTouchReveal}
      onKeyDown={handleKeyDown}
      role={canReveal ? 'button' : undefined}
      tabIndex={canReveal ? 0 : undefined}
      aria-pressed={canReveal ? isRevealed : undefined}
      className={`proper-photo-frame group relative isolate overflow-hidden bg-[#06111f] shadow-2xl ${className}`}
      style={{ perspective: 1000 }}
      whileHover={canReveal ? { scale: 1.02 } : undefined}
      transition={{ duration: 0.4 }}
    >
      {/* 1. BASE LAYER: The Sketch (Always in background) */}
      <img
        src={src}
        alt={alt}
        className={`h-full w-full ${imageFitClass} ${isSketch ? 'sketch-image' : 'color-image'} transition-transform duration-700`}
      />

      {/* 2. REVEAL LAYER: The Color Image (Expands to cover everything) */}
      {canReveal && (
        <motion.div
          className="absolute inset-0 z-10"
          initial={{ clipPath: 'circle(0% at 50% 50%)' }}
          animate={{
            clipPath: isRevealed
              ? isTouchReveal
                ? 'inset(0%)'
                : `circle(150% at ${mousePos.x}% ${mousePos.y}%)`
              : `circle(0% at ${mousePos.x}% ${mousePos.y}%)`
          }}
          transition={{
            duration: isTouchReveal ? 0 : 1.2,
            ease: [0.25, 1, 0.5, 1]
          }}
        >
          <img
            src={hoverSrc}
            alt=""
            className={`h-full w-full ${imageFitClass} color-bleed-image`}
          />
        </motion.div>
      )}

      {/* 3. RIPPLE EFFECTS: Expanding "Water" Rings */}
      <AnimatePresence>
        {isRevealed && ripples.map((ripple) => (
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
      {isSketch && (
        <div className={`sketch-lines absolute inset-0 z-30 pointer-events-none transition-opacity duration-700 ${isRevealed ? 'opacity-10' : 'opacity-40'}`} />
      )}
      
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
          scale: isRevealed && !isTouchReveal ? [1, 1.5, 1] : 0,
          opacity: isRevealed && !isTouchReveal ? 0.6 : 0
        }}
        style={{ x: '-50%', y: '-50%' }}
      />
    </motion.figure>
  );
}
