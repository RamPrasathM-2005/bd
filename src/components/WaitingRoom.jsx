import { motion } from 'framer-motion';
import { childhoodColorPhoto, childhoodPhoto } from '../lib/assets.js';
import { formatTimeUntil } from '../lib/timeGate.js';
import PhotoFrame from './PhotoFrame.jsx';
import TypewriterText from './TypewriterText.jsx';

export default function WaitingRoom({ targetDate, now }) {
  const countdown = formatTimeUntil(targetDate, now);

  return (
    <section className="heartbeat relative grid min-h-screen place-items-center overflow-hidden px-5 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(246,217,139,0.16),transparent_28%),linear-gradient(180deg,#08172c_0%,#06111f_55%,#020611_100%)]" />
      <div className="night-grain absolute inset-0 opacity-35" />
      <div className="starscape absolute inset-0" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={{ opacity: 0, y: 28, rotate: -1.5 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto w-full max-w-md"
        >
          <PhotoFrame
            src={childhoodPhoto}
            hoverSrc={childhoodColorPhoto}
            alt="Childhood portrait of Sri Devii!"
            mode="sketch"
            className="aspect-[4/5]"
          />
        </motion.div>

        <div className="text-center lg:text-left">
          <motion.p
            className="mb-5 text-xs uppercase tracking-[0.42em] text-celestial/80"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8 }}
          >
            Sri Deviii!!!
          </motion.p>
          <TypewriterText text="The story of this masterpiece began years ago... The unveiling happens at midnight." />

          <motion.div
            className="mt-9 grid grid-cols-4 gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur sm:max-w-xl lg:mx-0"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4.1, duration: 0.9 }}
          >
            {[
              ['Days', countdown.days],
              ['Hours', countdown.hours],
              ['Mins', countdown.minutes],
              ['Secs', countdown.seconds]
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-midnight/55 px-2 py-4 text-center">
                <div className="font-serif text-2xl text-pearl sm:text-4xl">{String(value).padStart(2, '0')}</div>
                <div className="mt-1 text-[0.65rem] uppercase tracking-[0.24em] text-moon/65">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
