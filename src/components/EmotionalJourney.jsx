import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { childhoodPhoto } from '../lib/assets.js';
import DigitalHug from './DigitalHug.jsx';

const letterParagraphs = [
  'My dearest Sri Devi,',
  'There are people who enter life like a season, and then there is you. You arrived like light finding a window, quietly changing the color of everything around you.',
  'When I look at you, I do not just see beauty. I see patience, softness, courage, and a heart that keeps choosing love even on days when the world forgets how gentle it should be.',
  'This little page is only a digital love letter, but every shimmer, every pause, every glowing particle is trying to say one thing: you are deeply precious to me.',
  'May this birthday feel like a sky opening just for you. May the coming year hold you tenderly, surprise you kindly, and remind you again and again how loved you are.'
];

const fullLetter = letterParagraphs.join('\n\n');

function FloatingLights() {
  const lights = useMemo(
    () =>
      Array.from({ length: 36 }, (_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 5 + 3,
        duration: Math.random() * 9 + 11,
        delay: Math.random() * 7
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
      {lights.map((light) => (
        <motion.span
          key={light.id}
          className="love-light"
          style={{
            left: light.left,
            top: light.top,
            width: light.size,
            height: light.size
          }}
          animate={{
            y: [0, -90, -160],
            x: [0, 18, -12],
            opacity: [0, 0.78, 0],
            scale: [0.8, 1.25, 0.9]
          }}
          transition={{
            duration: light.duration,
            delay: light.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
}

function TypedLetter() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const [visibleText, setVisibleText] = useState('');

  useEffect(() => {
    if (!inView) return undefined;

    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setVisibleText(fullLetter.slice(0, index));
      if (index >= fullLetter.length) window.clearInterval(timer);
    }, 28);

    return () => window.clearInterval(timer);
  }, [inView]);

  const paragraphs = visibleText.split('\n\n');

  return (
    <section ref={ref} className="relative z-10 min-h-screen px-5 py-24 sm:py-32">
      <motion.div
        className="love-letter-panel mx-auto max-w-4xl"
        initial={{ opacity: 0, y: 44, filter: 'blur(18px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="love-letter-photo" aria-hidden="true">
          <img src={childhoodPhoto} alt="" />
        </div>
        <p className="text-xs uppercase tracking-[0.34em] text-[#8b6b2e]/70">Written with love</p>
        <div className="letter-handwriting mt-8 min-h-[30rem] text-[#2e1c21]/90">
          {paragraphs.map((paragraph, index) => (
            <motion.p
              key={`${index}-${paragraph.slice(0, 8)}`}
              className="mb-7"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {paragraph}
              {index === paragraphs.length - 1 && (
                <span className="live-pen" aria-hidden="true">
                  <span className="pen-body" />
                  <span className="pen-nib" />
                </span>
              )}
            </motion.p>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default function EmotionalJourney() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.22], [1.08, 1.22]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.18, 0.3], [1, 0.9, 0.28]);
  const heroBlur = useTransform(scrollYProgress, [0, 0.28], ['blur(0px)', 'blur(5px)']);
  const heroY = useTransform(scrollYProgress, [0, 0.34], ['0%', '10%']);
  const veilOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.18, 0.42, 0.58]);

  return (
    <motion.div
      ref={containerRef}
      className="romantic-journey relative min-h-[300vh] overflow-hidden bg-[#080711]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <FloatingLights />

      <motion.div className="fixed inset-0 z-[1] pointer-events-none love-cinematic-veil" style={{ opacity: veilOpacity }} />

      <section className="relative z-10 grid min-h-screen place-items-center overflow-hidden px-5 py-16 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(244,182,182,0.24),transparent_34%),linear-gradient(180deg,#100916_0%,#080711_100%)]" />
        <motion.div
          className="relative z-10 mx-auto grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:text-left"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="proper-photo-frame mx-auto w-full max-w-[22rem] sm:max-w-[26rem] lg:max-w-[28rem]"
            style={{ scale: heroScale, opacity: heroOpacity, filter: heroBlur, y: heroY }}
          >
            <img src={childhoodPhoto} alt="Sri Devi" className="h-full w-full object-contain" />
          </motion.div>
          <div>
            <p className="font-serif text-4xl leading-tight text-rose-50 drop-shadow-[0_8px_26px_rgba(0,0,0,0.55)] sm:text-6xl lg:text-7xl">
              For the most beautiful person in my life...
            </p>
          </div>
        </motion.div>
      </section>

      <TypedLetter />

      <DigitalHug />
    </motion.div>
  );
}
