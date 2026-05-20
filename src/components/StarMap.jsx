import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { memories } from '../lib/assets.js';
import { playBangleJingle } from '../lib/sound.js';

const orbitPositions = [
  { top: '12%', left: '74%', duration: 11 },
  { top: '69%', left: '82%', duration: 14 },
  { top: '78%', left: '18%', duration: 12.5 }
];

export default function StarMap() {
  const [activeMemory, setActiveMemory] = useState(null);

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {memories.map((memory, index) => (
        <motion.button
          key={memory.id}
          type="button"
          aria-label={`Open ${memory.title}`}
          className="pointer-events-auto absolute h-4 w-4 rounded-full bg-celestial shadow-[0_0_22px_rgba(246,217,139,0.95)] focus:outline-none focus:ring-2 focus:ring-pearl"
          style={{ top: orbitPositions[index].top, left: orbitPositions[index].left }}
          animate={{ rotate: 360, scale: [1, 1.35, 1] }}
          transition={{
            rotate: { duration: orbitPositions[index].duration, repeat: Infinity, ease: 'linear' },
            scale: { duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: index * 0.25 }
          }}
          onClick={() => {
            playBangleJingle();
            setActiveMemory(memory);
          }}
        />
      ))}

      <AnimatePresence>
        {activeMemory && (
          <motion.div
            className="pointer-events-auto fixed inset-0 z-50 grid place-items-center bg-midnight/72 px-5 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveMemory(null)}
          >
            <motion.article
              className="w-full max-w-xs rotate-[-2deg] bg-pearl p-3 text-midnight shadow-2xl"
              initial={{ opacity: 0, y: 26, scale: 0.92, rotate: -8 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: -2 }}
              exit={{ opacity: 0, y: 18, scale: 0.94 }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.55 }}
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={activeMemory.image}
                alt={activeMemory.title}
                className="aspect-[4/5] w-full bg-gradient-to-br from-nebula to-roseglow object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
              <h3 className="mt-4 font-serif text-2xl">{activeMemory.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">{activeMemory.note}</p>
              <button
                type="button"
                className="mt-4 w-full rounded-full border border-midnight/15 px-4 py-2 text-sm"
                onClick={() => setActiveMemory(null)}
              >
                Keep this memory close
              </button>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
