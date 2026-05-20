import React, { memo, useEffect, useRef } from 'react';

function StarfieldCanvas() {
  const canvasRef = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let animationFrame;
    let stars = [];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: 130 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 1.7 + 0.25,
        alpha: Math.random() * 0.65 + 0.25,
        speed: Math.random() * 0.12 + 0.03,
        gold: Math.random() > 0.72
      }));
    }

    function movePointer(event) {
      pointer.current = {
        x: (event.clientX / window.innerWidth - 0.5) * 16,
        y: (event.clientY / window.innerHeight - 0.5) * 16
      };
    }

    function draw() {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const gradient = context.createLinearGradient(0, 0, 0, window.innerHeight);
      gradient.addColorStop(0, '#07162b');
      gradient.addColorStop(0.58, '#06111f');
      gradient.addColorStop(1, '#020611');
      context.fillStyle = gradient;
      context.fillRect(0, 0, window.innerWidth, window.innerHeight);

      stars.forEach((star) => {
        star.y += star.speed;
        if (star.y > window.innerHeight + 8) star.y = -8;
        context.beginPath();
        context.fillStyle = star.gold
          ? `rgba(246, 217, 139, ${star.alpha})`
          : `rgba(255, 248, 231, ${star.alpha})`;
        context.arc(star.x + pointer.current.x * star.radius, star.y + pointer.current.y * star.radius, star.radius, 0, Math.PI * 2);
        context.fill();
      });

      animationFrame = window.requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', movePointer);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', movePointer);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}

export default memo(StarfieldCanvas);
