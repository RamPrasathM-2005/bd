import React, { useEffect, useRef } from 'react';

export default function ConfettiBurst({ active }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return undefined;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const particles = Array.from({ length: 170 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 2;
      return {
        x: window.innerWidth / 2,
        y: window.innerHeight * 0.42,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: Math.random() * 5 + 3,
        life: 1,
        color: ['#f6d98b', '#fff8e7', '#f3b7a8', '#dbe7f3'][Math.floor(Math.random() * 4)]
      };
    });

    let frame;
    function draw() {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.12;
        particle.life -= 0.012;
        context.globalAlpha = Math.max(0, particle.life);
        context.fillStyle = particle.color;
        context.fillRect(particle.x, particle.y, particle.size, particle.size * 0.5);
      });
      context.globalAlpha = 1;
      if (particles.some((particle) => particle.life > 0)) {
        frame = window.requestAnimationFrame(draw);
      }
    }

    draw();
    return () => window.cancelAnimationFrame(frame);
  }, [active]);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[70]" aria-hidden="true" />;
}
