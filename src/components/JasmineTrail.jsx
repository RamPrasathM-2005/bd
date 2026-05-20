import React, { memo, useEffect, useRef } from 'react';

function JasmineTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const petals = [];
    let animationFrame;
    let lastMove = 0;
    let lastPetal = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function addPetal(x, y) {
      petals.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.75,
        vy: Math.random() * 0.25 + 0.08,
        rotation: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.025,
        size: Math.random() * 4 + 4.5,
        life: 0.9
      });
      if (petals.length > 28) petals.shift();
    }

    function onMove(event) {
      const point = event.touches?.[0] || event;
      const now = performance.now();
      if (now - lastPetal < 90) return;
      lastMove = performance.now();
      lastPetal = now;
      addPetal(point.clientX + (Math.random() - 0.5) * 8, point.clientY + (Math.random() - 0.5) * 8);
    }

    function drawPetal(petal) {
      context.save();
      context.translate(petal.x, petal.y);
      context.rotate(petal.rotation);
      context.globalAlpha = Math.max(0, petal.life) * 0.72;
      context.fillStyle = '#fffdf3';
      context.shadowColor = 'rgba(255, 248, 231, 0.78)';
      context.shadowBlur = 10;
      context.beginPath();
      context.ellipse(0, 0, petal.size * 0.55, petal.size, 0, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = 'rgba(246, 217, 139, 0.94)';
      context.beginPath();
      context.arc(0, 1, petal.size * 0.14, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }

    function animate() {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const moving = performance.now() - lastMove < 120;

      for (let index = petals.length - 1; index >= 0; index -= 1) {
        const petal = petals[index];
        petal.x += petal.vx + Math.sin(performance.now() / 900 + index) * 0.08;
        petal.y += moving ? petal.vy : petal.vy + 0.38;
        petal.rotation += petal.spin;
        petal.life -= petal.y > window.innerHeight - 18 ? 0.012 : 0.006;
        if (petal.life <= 0) petals.splice(index, 1);
        else drawPetal(petal);
      }

      animationFrame = window.requestAnimationFrame(animate);
    }

    resize();
    animate();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('touchmove', onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[8]" aria-hidden="true" />;
}

export default memo(JasmineTrail);
