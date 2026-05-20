import { AnimatePresence, motion } from 'framer-motion';
import React, { memo, useMemo, useState } from 'react';

const colors = ['#f6d98b', '#f3b7a8', '#fff8e7', '#dbe7f3'];

function BalloonField({ count = 54 }) {
  const [popped, setPopped] = useState([]);
  const balloons = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        size: 34 + Math.random() * 36,
        duration: 7 + Math.random() * 7,
        color: colors[index % colors.length]
      })),
    [count]
  );

  function pop(id) {
    setPopped((items) => [...items, id]);
    if (navigator.vibrate) navigator.vibrate(20);
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      <AnimatePresence>
        {balloons
          .filter((balloon) => !popped.includes(balloon.id))
          .map((balloon) => (
            <motion.button
              key={balloon.id}
              type="button"
              className="balloon pointer-events-auto absolute bottom-[-120px]"
              style={{
                left: `${balloon.left}%`,
                width: balloon.size,
                height: balloon.size * 1.22,
                background: `radial-gradient(circle at 35% 25%, #ffffffcc, ${balloon.color} 38%, #6d4b63 120%)`
              }}
              initial={{ y: 0, x: 0, opacity: 0 }}
              animate={{ y: '-122vh', x: [0, -16, 18, -8, 0], opacity: [0, 1, 1, 0.95] }}
              exit={{ scale: [1, 1.35, 0], opacity: 0 }}
              transition={{ duration: balloon.duration, delay: balloon.delay, repeat: Infinity, ease: 'linear' }}
              onClick={() => pop(balloon.id)}
              aria-label="Pop balloon"
            />
          ))}
      </AnimatePresence>
    </div>
  );
}

export default memo(BalloonField);
