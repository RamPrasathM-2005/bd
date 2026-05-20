import { motion } from 'framer-motion';
import { useState } from 'react';

export default function PhotoFrame({ src, alt, mode = 'color', className = '' }) {
  const [hasImage, setHasImage] = useState(true);
  const isReveal = mode === 'reveal';

  return (
    <motion.figure
      className={`photo-frame relative isolate overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-br from-slate-800 via-slate-950 to-amber-950 shadow-halo ${className}`}
      layout
    >
      {hasImage ? (
        <>
          <img
            src={src}
            alt={alt}
            onError={() => setHasImage(false)}
            className={`h-full w-full object-cover ${mode === 'sketch' || isReveal ? 'sketch-image' : 'color-image'}`}
          />
          {isReveal && (
            <motion.img
              src={src}
              alt=""
              aria-hidden="true"
              className="color-bleed-image absolute inset-0 h-full w-full object-cover"
              initial={{ clipPath: 'circle(0% at 54% 12%)', opacity: 0.2 }}
              animate={{ clipPath: 'circle(145% at 54% 12%)', opacity: 1 }}
              transition={{ duration: 4.2, ease: [0.16, 1, 0.3, 1] }}
            />
          )}
        </>
      ) : (
        <div className="grid h-full min-h-[360px] place-items-center px-8 text-center">
          <div>
            <p className="font-serif text-3xl text-pearl">Sri Devi</p>
            <p className="mt-3 text-sm text-moon/75">Add this photo as public/childhood.jpeg</p>
          </div>
        </div>
      )}

      {(mode === 'sketch' || isReveal) && (
        <>
          <motion.div
            className="absolute inset-0 bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,255,0.22)_45%,transparent_70%)]"
            animate={{ x: ['-130%', '130%'] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="sketch-lines absolute inset-0"
            animate={{ opacity: [0.25, 0.75, 0.35] }}
            transition={{ duration: 2.7, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/15" />
    </motion.figure>
  );
}
