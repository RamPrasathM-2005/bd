import { motion } from 'framer-motion';
import React, { useEffect } from 'react';
import { childhoodColorPhoto } from '../lib/assets.js';
import { useBirthday } from '../context/BirthdayContext.jsx';
import AudioManager from './AudioManager.jsx';
import BalloonField from './BalloonField.jsx';
import PhotoFrame from './PhotoFrame.jsx';

export default function Awakening() {
  const { startRituals } = useBirthday();

  useEffect(() => {
    const timer = window.setTimeout(startRituals, 8000);
    return () => window.clearTimeout(timer);
  }, [startRituals]);

  return (
    <motion.section
      className="relative grid min-h-screen place-items-center overflow-hidden px-5 py-16"
      initial={{ opacity: 0, filter: 'saturate(0%) blur(16px)' }}
      animate={{ opacity: 1, filter: 'saturate(100%) blur(0px)' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <AudioManager active />
      <BalloonField />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(246,217,139,0.28),transparent_30%),linear-gradient(180deg,#06111f_0%,#10213a_55%,#050912_100%)]" />

      <motion.div
        className="relative z-40 mx-auto grid max-w-5xl items-center gap-9 text-center"
        initial={{ scale: 0.96 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2 }}
      >
        <motion.div
          className="mx-auto w-full max-w-sm"
          initial={{ filter: 'grayscale(1) brightness(0.7)' }}
          animate={{ filter: 'grayscale(0) brightness(1.08)' }}
          transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] }}
        >
          <PhotoFrame src={childhoodColorPhoto} alt="Sri Devi in traditional attire with flowers and bangles" mode="reveal" className="aspect-[4/5]" />
        </motion.div>

        <div>
          <p className="text-xs uppercase tracking-[0.45em] text-celestial">The midnight bloom</p>
          <h1 className="mt-5 font-serif text-6xl leading-none text-pearl sm:text-8xl">Sri Devi</h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-8 text-moon/85">
            The sketch becomes color. The quiet sky opens. Tonight, every star remembers her name.
          </p>
          <button
            type="button"
            onClick={startRituals}
            className="mt-8 rounded-full border border-celestial/40 bg-celestial px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-midnight shadow-halo"
          >
            Begin the birthday rituals
          </button>
        </div>
      </motion.div>
    </motion.section>
  );
}
