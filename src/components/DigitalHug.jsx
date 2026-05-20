import { motion } from 'framer-motion';
import { useState } from 'react';

export default function DigitalHug() {
  const [hugging, setHugging] = useState(false);
  const [message, setMessage] = useState('');

  function sendHug() {
    const root = document.getElementById('birthday-root');

    root?.classList.remove('hug-squeeze');
    window.requestAnimationFrame(() => root?.classList.add('hug-squeeze'));
    setHugging(true);
    setMessage('Hug sent');

    window.setTimeout(() => {
      setHugging(false);
      root?.classList.remove('hug-squeeze');
    }, 1100);

    window.setTimeout(() => setMessage(''), 2200);

    if (navigator.vibrate) {
      navigator.vibrate([45, 35, 70]);
    }
  }

  return (
    <motion.div className="fixed inset-x-0 bottom-5 z-50 mx-auto flex w-fit flex-col items-center justify-center gap-3 px-4">
      {hugging && (
        <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden">
          <div className="hug-arm hug-arm-left" />
          <div className="hug-arm hug-arm-right" />
          <div className="hug-center-glow" />
        </div>
      )}

      <motion.div
        aria-live="polite"
        className="min-h-6 rounded-full bg-celestial/15 px-4 py-1 text-xs uppercase tracking-[0.24em] text-celestial backdrop-blur"
        initial={false}
        animate={{ opacity: message ? 1 : 0, y: message ? 0 : 8 }}
      >
        {message || ' '}
      </motion.div>

      <button
        type="button"
        onClick={sendHug}
        className="group rounded-full border border-celestial/40 bg-midnight/70 px-5 py-3 text-sm font-medium text-pearl shadow-2xl shadow-black/35 backdrop-blur-xl transition hover:border-celestial hover:bg-celestial hover:text-midnight focus:outline-none focus:ring-2 focus:ring-celestial"
      >
        <motion.span
          className="inline-block"
          animate={hugging ? { scale: [1, 0.9, 1.08, 1] } : { scale: 1 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          Send a digital hug
        </motion.span>
      </button>
    </motion.div>
  );
}
