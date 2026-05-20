import { motion } from 'framer-motion';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useBirthday } from '../context/BirthdayContext.jsx';
import { playBangleJingle, playHappyBirthdaySong } from '../lib/sound.js';
import ConfettiBurst from './ConfettiBurst.jsx';

const KNIFE_START_Y = 118;
const KNIFE_TRAVEL_Y = 192;
const KNIFE_ORIGIN_X = 386;
const KNIFE_HANDLE_X = KNIFE_ORIGIN_X + 41;
const SVG_HEIGHT = 420;
const SVG_WIDTH = 480;

function AmbientMagic() {
  const motes = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: Math.random() * 7,
        duration: Math.random() * 8 + 8,
        size: Math.random() * 4 + 2
      })),
    []
  );

  return (
    <div className="cake-ambient-magic" aria-hidden="true">
      {motes.map((mote) => (
        <span
          key={mote.id}
          style={{
            left: mote.left,
            top: mote.top,
            width: mote.size,
            height: mote.size,
            animationDelay: `${mote.delay}s`,
            animationDuration: `${mote.duration}s`
          }}
        />
      ))}
    </div>
  );
}

function CelebrationFX({ active }) {
  const ribbons = useMemo(
    () =>
      Array.from({ length: 46 }, (_, index) => ({
        id: index,
        left: index % 2 === 0 ? `${8 + Math.random() * 18}%` : `${74 + Math.random() * 18}%`,
        top: `${38 + Math.random() * 22}%`,
        rotate: `${Math.random() * 260 - 130}deg`,
        delay: Math.random() * 0.38,
        color: ['#f6d98b', '#fff8e7', '#f3b7a8', '#dbe7f3', '#f4b6b6'][Math.floor(Math.random() * 5)]
      })),
    []
  );
  const sparkles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: Math.random() * 2.8
      })),
    []
  );
  const hearts = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => ({
        id: index,
        left: `${8 + Math.random() * 84}%`,
        delay: Math.random() * 4.8
      })),
    []
  );

  return (
    <div className={`cake-celebration-fx ${active ? 'is-active' : ''}`} aria-hidden="true">
      <div className="popper popper-left" />
      <div className="popper popper-right" />
      <div className="cake-light-flash" />
      <div className="cake-light-rays" />
      {ribbons.map((ribbon) => (
        <span
          key={ribbon.id}
          className="party-ribbon"
          style={{
            left: ribbon.left,
            top: ribbon.top,
            background: ribbon.color,
            rotate: ribbon.rotate,
            animationDelay: `${ribbon.delay}s`
          }}
        />
      ))}
      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className="cake-sparkle"
          style={{ left: sparkle.left, top: sparkle.top, animationDelay: `${sparkle.delay}s` }}
        />
      ))}
      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="floating-heart"
          style={{ left: heart.left, animationDelay: `${heart.delay}s` }}
        />
      ))}
      <span className="cake-soft-wish cake-soft-wish-1">Happy Birthday</span>
      <span className="cake-soft-wish cake-soft-wish-2">Sri Devi</span>
    </div>
  );
}

function PinkCakeSvg({ dragging, hovering, opened, progress }) {
  const knifeY = KNIFE_START_Y + progress * KNIFE_TRAVEL_Y;
  const cutEnd = 132 + progress * 206;
  const knifeTilt = dragging ? 2 - progress * 5 : hovering ? 0.5 : 2.5;
  const knifeTrackY = dragging ? knifeY : hovering ? knifeY - 8 : [knifeY, knifeY - 5, knifeY];
  const cutGlowOpacity = Math.min(1, progress * 1.35);
  const cutSparks = [0.18, 0.36, 0.54, 0.72, 0.9].filter((sparkProgress) => progress > sparkProgress);

  return (
    <svg className="pink-cut-cake-svg" viewBox="0 0 480 420" role="img" aria-label="Pink birthday cake">
      <defs>
        <linearGradient id="pinkPlate" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9b772a" />
          <stop offset="50%" stopColor="#f7d985" />
          <stop offset="100%" stopColor="#8b6b2e" />
        </linearGradient>
        <linearGradient id="pinkCakeBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8bbaa" />
          <stop offset="52%" stopColor="#c78191" />
          <stop offset="100%" stopColor="#9b5b75" />
        </linearGradient>
        <radialGradient id="pinkCakeTop" cx="50%" cy="28%" r="75%">
          <stop offset="0%" stopColor="#fff2df" />
          <stop offset="45%" stopColor="#f3b4a6" />
          <stop offset="100%" stopColor="#bf7187" />
        </radialGradient>
        <linearGradient id="pinkCakeInside" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff0d7" />
          <stop offset="48%" stopColor="#f7bdad" />
          <stop offset="100%" stopColor="#a45f7a" />
        </linearGradient>
      </defs>

      <ellipse cx="240" cy="366" rx="190" ry="24" fill="rgba(0,0,0,0.24)" />
      <ellipse cx="240" cy="342" rx="182" ry="23" fill="url(#pinkPlate)" />
      <ellipse cx="240" cy="336" rx="148" ry="10" fill="rgba(255,248,231,0.34)" />

      <motion.g
        animate={opened ? { x: -72, y: 9, rotate: -7 } : { x: 0, y: 0, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 90, damping: 15 }}
        style={{ transformOrigin: '192px 310px' }}
      >
        <path d="M100 166 H240 V320 H126 Q100 320 100 292 Z" fill="url(#pinkCakeBody)" />
        <path d="M100 166 Q136 118 240 118 V176 Q168 184 100 166 Z" fill="url(#pinkCakeTop)" />
        <path d="M222 174 H240 V320 H222 Z" fill="url(#pinkCakeInside)" opacity={opened ? 1 : 0} />
      </motion.g>

      <motion.g
        animate={opened ? { x: 72, y: 9, rotate: 7 } : { x: 0, y: 0, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 90, damping: 15 }}
        style={{ transformOrigin: '288px 310px' }}
      >
        <path d="M240 166 H380 V292 Q380 320 354 320 H240 Z" fill="url(#pinkCakeBody)" />
        <path d="M240 118 Q344 118 380 166 Q312 184 240 176 Z" fill="url(#pinkCakeTop)" />
        <path d="M240 174 H258 V320 H240 Z" fill="url(#pinkCakeInside)" opacity={opened ? 1 : 0} />
      </motion.g>

      <g className="cake-piping">
        {Array.from({ length: 18 }, (_, index) => (
          <circle key={index} cx={124 + index * 13.5} cy="304" r="6" fill={index % 2 ? '#fff8e7' : '#f6d98b'} opacity="0.92" />
        ))}
      </g>

      <line className="svg-cut-guide" x1="240" y1="132" x2="240" y2="338" opacity={opened ? 0 : 1} />

      {progress > 0.02 && (
        <>
          <line className="svg-cut-glow" x1="240" y1="132" x2="240" y2={cutEnd} opacity={opened ? 0 : cutGlowOpacity} />
          <line className="svg-cut-line" x1="240" y1="132" x2="240" y2={cutEnd} opacity={opened ? 0 : 1} />
          {dragging &&
            !opened &&
            cutSparks.map((sparkProgress, index) => (
              <circle
                key={sparkProgress}
                className="active-cut-spark"
                cx="240"
                cy={132 + sparkProgress * 206}
                r={3.5 + (index % 2)}
              />
            ))}
        </>
      )}

      <g transform={`translate(${KNIFE_ORIGIN_X} 0)`}>
        <motion.g
          animate={opened ? { opacity: 0, x: 42, y: 30, rotate: 4 } : { opacity: 1, x: 0, y: 0, rotate: 0 }}
          transition={{ duration: opened ? 0.62 : 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.g
            className="svg-knife-track"
            animate={{ y: knifeTrackY, scale: hovering || dragging ? 1.035 : 1 }}
            transition={
              dragging || hovering
                ? { type: 'spring', stiffness: dragging ? 560 : 260, damping: dragging ? 44 : 24 }
                : { y: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }, scale: { duration: 0.25 } }
            }
          >
            <motion.g
              className="svg-knife"
              animate={{ rotate: opened ? 3 : knifeTilt, x: dragging ? 0 : 3 }}
              transition={{ type: 'spring', stiffness: 210, damping: 18 }}
              style={{ transformOrigin: '0px 0px' }}
            >
              <path d="M6 -10 H-166 L-198 0 L-166 10 H6 Z" fill="#edf3f8" />
              <path d="M-13 -5 H-164 L-183 0 H-13 Z" fill="rgba(255,255,255,0.62)" />
              <path d="M-20 3 H-166 L-184 0 L-166 8 H-20 Z" fill="rgba(94,108,123,0.42)" />
              <rect x="0" y="-19" width="84" height="38" rx="14" fill="#3b1423" />
              <rect x="8" y="-14" width="18" height="28" rx="8" fill="rgba(255,255,255,0.13)" />
              <circle cx="34" cy="0" r="4.2" fill="#f6d98b" opacity="0.9" />
              <circle cx="56" cy="0" r="4.2" fill="#f6d98b" opacity="0.9" />
            </motion.g>
          </motion.g>
        </motion.g>
      </g>

      {opened && (
        <g transform="translate(240 0)">
          <path className="cake-crumb cake-crumb-1" d="M-16 178 q8 -7 16 0 q-5 10 -16 0" />
          <path className="cake-crumb cake-crumb-2" d="M18 206 q8 -7 16 0 q-5 10 -16 0" />
          <path className="cake-crumb cake-crumb-3" d="M-8 248 q7 -6 14 0 q-5 8 -14 0" />
        </g>
      )}

      {opened && (
        <g className="cake-cut-spark">
          <circle cx="240" cy="190" r="88" />
          <circle cx="240" cy="238" r="56" />
        </g>
      )}
    </svg>
  );
}

export default function CakeCutting() {
  const { startJourney } = useBirthday();
  const cakeRef = useRef(null);
  const handleRef = useRef(null);
  const hasOpenedRef = useRef(false);
  const [dragging, setDragging] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [opened, setOpened] = useState(false);
  const handleTop = `${((KNIFE_START_Y + progress * KNIFE_TRAVEL_Y) / SVG_HEIGHT) * 100}%`;
  const handleLeft = `${(KNIFE_HANDLE_X / SVG_WIDTH) * 100}%`;

  useEffect(() => {
    if (!opened) return undefined;
    const timer = window.setTimeout(startJourney, 6200);
    return () => window.clearTimeout(timer);
  }, [opened, startJourney]);

  function updateProgress(clientY) {
    if (clientY == null || !cakeRef.current || opened || hasOpenedRef.current) return;
    const rect = cakeRef.current.getBoundingClientRect();
    const cutTop = rect.top + rect.height * (KNIFE_START_Y / SVG_HEIGHT);
    const cutHeight = rect.height * (KNIFE_TRAVEL_Y / SVG_HEIGHT);
    const next = Math.min(1, Math.max(0, (clientY - cutTop) / cutHeight));
    setProgress(next);

    if (next > 0.96) {
      hasOpenedRef.current = true;
      setProgress(1);
      setDragging(false);
      setHovering(false);
      setOpened(true);
      playBangleJingle();
      playHappyBirthdaySong();
      if (navigator.vibrate) navigator.vibrate([80, 40, 120]);
    }
  }

  function startCut(event) {
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDragging(true);
    setHovering(true);
    updateProgress(event.clientY || event.touches?.[0]?.clientY);
  }

  function moveCut(event) {
    if (!dragging) return;
    updateProgress(event.clientY || event.touches?.[0]?.clientY);
  }

  function stopCut() {
    setDragging(false);
  }

  return (
    <motion.section
      className={`knife-cursor cake-cinematic-scene relative grid min-h-screen place-items-center overflow-hidden px-5 py-12 text-center ${opened ? 'cake-impact' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ConfettiBurst active={opened} />
      <AmbientMagic />
      <CelebrationFX active={opened} />
      <div className="cake-scene-bg absolute inset-0" />
      <div className="cake-balloon-burst pointer-events-none absolute inset-0 z-[4]" aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => (
          <span key={index} className={`pop-balloon pop-balloon-${index + 1} ${opened ? 'is-popping' : ''}`} />
        ))}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <p className="text-xs uppercase tracking-[0.42em] text-celestial">The birthday slice</p>
        <h2 className="mt-4 font-serif text-4xl leading-tight text-pearl sm:text-6xl">
          {opened ? 'A wish has been shared.' : 'Cut the birthday cake.'}
        </h2>

        <div
          ref={cakeRef}
          className={`real-cake-stage mx-auto mt-8 ${dragging ? 'is-dragging' : ''} ${hovering ? 'is-handle-hovered' : ''}`}
        >
          <PinkCakeSvg dragging={dragging} hovering={hovering} opened={opened} progress={progress} />
          {!opened && (
            <div
              ref={handleRef}
              className="knife-handle-grab"
              style={{ left: handleLeft, top: handleTop }}
              onPointerEnter={() => setHovering(true)}
              onPointerLeave={() => !dragging && setHovering(false)}
              onPointerDown={startCut}
              onPointerMove={moveCut}
              onPointerUp={stopCut}
              onPointerCancel={stopCut}
              onLostPointerCapture={stopCut}
            >
              <span />
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
