import React, { useEffect, useRef, useState } from 'react';

export default function AudioManager({ active }) {
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!active || !enabled) return undefined;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return undefined;

    const context = new AudioContext();
    const gain = context.createGain();
    const oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = 392;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.052, context.currentTime + 1.5);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();

    audioContextRef.current = context;
    oscillatorRef.current = oscillator;
    gainRef.current = gain;

    return () => {
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.4);
      window.setTimeout(() => {
        oscillator.stop();
        context.close();
      }, 450);
    };
  }, [active, enabled]);

  if (!active) return null;

  return (
    <button
      type="button"
      onClick={() => setEnabled((value) => !value)}
      className="fixed right-4 top-4 z-[90] rounded-full border border-celestial/30 bg-midnight/70 px-4 py-2 text-xs uppercase tracking-[0.22em] text-celestial backdrop-blur transition hover:bg-celestial hover:text-midnight"
    >
      {enabled ? 'Sound On' : 'Enable Sound'}
    </button>
  );
}
