import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { PHASES, useBirthday } from '../context/BirthdayContext.jsx';

export default function CandleRitual() {
  const { phase, extinguishCandles, startCakeCutting } = useBirthday();
  const [micStatus, setMicStatus] = useState('Tap Enable Mic, then blow gently.');
  const [volume, setVolume] = useState(0);
  const [blowProgress, setBlowProgress] = useState(0);
  const blowStartedAt = useRef(null);
  const rafRef = useRef(null);
  const streamRef = useRef(null);
  const audioRef = useRef(null);
  const baselineRef = useRef(0);
  const calibrationRef = useRef([]);
  const candlesOff = phase === PHASES.CANDLE_OFF;

  useEffect(() => {
    if (!candlesOff) return undefined;
    const next = window.setTimeout(startCakeCutting, 2600);
    return () => window.clearTimeout(next);
  }, [candlesOff, startCakeCutting]);

  async function enableMic() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const context = new AudioContext();
      const analyser = context.createAnalyser();
      const source = context.createMediaStreamSource(stream);
      const data = new Uint8Array(analyser.frequencyBinCount);
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.82;
      source.connect(analyser);
      streamRef.current = stream;
      audioRef.current = context;
      calibrationRef.current = [];
      blowStartedAt.current = null;
      setBlowProgress(0);
      setMicStatus('Calibrating room sound... stay quiet for a moment.');
      const startedAt = performance.now();

      function readVolume() {
        analyser.getByteFrequencyData(data);
        const average = data.reduce((sum, value) => sum + value, 0) / data.length;
        setVolume(average);
        const elapsed = performance.now() - startedAt;

        if (elapsed < 1500) {
          calibrationRef.current.push(average);
          setMicStatus('Calibrating room sound... stay quiet for a moment.');
          rafRef.current = window.requestAnimationFrame(readVolume);
          return;
        }

        if (!baselineRef.current) {
          const samples = calibrationRef.current;
          const baseline = samples.reduce((sum, value) => sum + value, 0) / Math.max(1, samples.length);
          baselineRef.current = baseline;
          setMicStatus('Ready. Now blow steadily into the microphone.');
        }

        const threshold = Math.max(58, baselineRef.current + 34);
        const isBlowing = average > threshold;

        if (isBlowing) {
          if (!blowStartedAt.current) blowStartedAt.current = performance.now();
          const sustained = performance.now() - blowStartedAt.current;
          setBlowProgress(Math.min(100, Math.round((sustained / 1200) * 100)));
          setMicStatus('Keep blowing...');

          if (sustained > 1200) {
            extinguishCandles();
            cleanupMic();
            return;
          }
        } else {
          blowStartedAt.current = null;
          setBlowProgress(0);
          setMicStatus('Ready. Blow steadily into the microphone.');
        }


        rafRef.current = window.requestAnimationFrame(readVolume);
      }

      readVolume();
    } catch {
      setMicStatus('Mic blocked. Use the manual blow button below.');
    }
  }

  function cleanupMic() {
    if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    audioRef.current?.close();
    rafRef.current = null;
    streamRef.current = null;
    audioRef.current = null;
    baselineRef.current = 0;
    calibrationRef.current = [];
  }

  useEffect(() => cleanupMic, []);

  return (
    <motion.section
      className="relative grid min-h-screen place-items-center overflow-hidden px-5 py-16 text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(246,217,139,0.18),transparent_32%),linear-gradient(180deg,#07162b,#050912)]" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <p className="text-xs uppercase tracking-[0.42em] text-celestial">The breath of life</p>
        <h2 className="mt-4 font-serif text-5xl text-pearl sm:text-7xl">Make a wish first.</h2>

        <div className="cake-stage mx-auto mt-10">
          <div className="candles">
            {[0, 1, 2, 3, 4].map((candle) => (
              <div key={candle} className="candle">
                {!candlesOff && <div className={`flame ${blowProgress > 0 ? 'flame-wild' : ''}`} />}
                {candlesOff && <div className="smoke-puff" />}
              </div>
            ))}
          </div>
          <div className="cake">
            <div className="cake-top" />
            <div className="cake-body" />
            <div className="cake-base" />
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-xl text-sm leading-7 text-moon/80">{candlesOff ? 'The candles are out. A soft smoke rises.' : micStatus}</p>

        {!candlesOff && (
          <div className="mx-auto mt-4 h-2 w-full max-w-xs overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-celestial transition-all duration-150" style={{ width: `${blowProgress}%` }} />
          </div>
        )}

        {!candlesOff ? (
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={enableMic} className="rounded-full bg-celestial px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-midnight">
              Enable mic
            </button>
            <button type="button" onClick={extinguishCandles} className="rounded-full border border-celestial/40 px-6 py-3 text-sm uppercase tracking-[0.18em] text-celestial">
              Manual blow
            </button>
          </div>
        ) : (
          <button type="button" onClick={startCakeCutting} className="mt-7 rounded-full bg-celestial px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-midnight">
            Cut the cake
          </button>
        )}
      </div>
    </motion.section>
  );
}
