import { motion } from 'framer-motion';
import React from 'react';
import { childhoodColorPhoto, childhoodPhoto } from '../lib/assets.js';
import { formatCountdown, useBirthday } from '../context/BirthdayContext.jsx';
import PhotoFrame from './PhotoFrame.jsx';
import StarfieldCanvas from './StarfieldCanvas.jsx';
import TypewriterText from './TypewriterText.jsx';

export default function WaitingPrelude() {
  const { now, targetDate } = useBirthday();
  const countdown = formatCountdown(targetDate, now);

  return (
    <motion.section
      className="heartbeat relative grid min-h-screen place-items-center overflow-hidden px-5 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, filter: 'brightness(1.8)' }}
      transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <StarfieldCanvas />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(246,217,139,0.16),transparent_28%)]" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          className="mx-auto w-full max-w-md"
          initial={{ opacity: 0, y: 26, rotate: -1.5 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="waiting-aura rounded-[2rem]">
            <PhotoFrame
              src={childhoodPhoto}
              hoverSrc={childhoodColorPhoto}
              alt="Childhood portrait of Sri Devi"
              mode="sketch"
              className="aspect-[4/5]"
            />
          </div>
        </motion.div>

        <div className="text-center lg:text-left">
          <p className="mb-5 text-xs uppercase tracking-[0.42em] text-celestial/80">Sri Devii!</p>
          <TypewriterText text="The countdown starts now. Only a few days to go." />

          <div className="mt-9 grid grid-cols-4 gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur sm:max-w-xl lg:mx-0">
            {[
              ['Days', countdown.days],
              ['Hours', countdown.hours],
              ['Mins', countdown.minutes],
              ['Secs', countdown.seconds]
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-midnight/60 px-2 py-4 text-center shadow-[0_0_28px_rgba(246,217,139,0.08)]">
                <div className="font-serif text-2xl text-pearl drop-shadow-[0_0_14px_rgba(246,217,139,0.4)] sm:text-4xl">
                  {String(value).padStart(2, '0')}
                </div>
                <div className="mt-1 text-[0.65rem] uppercase tracking-[0.24em] text-moon/65">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
