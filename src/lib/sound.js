export function playBangleJingle() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const context = new AudioContext();
  const master = context.createGain();
  master.gain.value = 0.045;
  master.connect(context.destination);

  [0, 0.045, 0.092, 0.145].forEach((delay, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.value = [1568, 1864, 1320, 2093][index];
    gain.gain.setValueAtTime(0.0001, context.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.45, context.currentTime + delay + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + delay + 0.18);
    oscillator.connect(gain).connect(master);
    oscillator.start(context.currentTime + delay);
    oscillator.stop(context.currentTime + delay + 0.2);
  });

  window.setTimeout(() => context.close(), 500);
}

let birthdaySongLoop = null;

export function playHappyBirthdaySong() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return 0;
  if (birthdaySongLoop) return 0;

  const context = new AudioContext();
  const master = context.createGain();
  master.gain.value = 0.105;
  master.connect(context.destination);

  const notes = {
    C4: 261.63,
    D4: 293.66,
    E4: 329.63,
    F4: 349.23,
    G4: 392.0,
    A4: 440.0,
    Bb4: 466.16,
    C5: 523.25
  };

  const melody = [
    ['G4', 0.36], ['G4', 0.18], ['A4', 0.54], ['G4', 0.54], ['C5', 0.54], ['Bb4', 0.96],
    ['G4', 0.36], ['G4', 0.18], ['A4', 0.54], ['G4', 0.54], ['D5', 0.54], ['C5', 0.96],
    ['G4', 0.36], ['G4', 0.18], ['G5', 0.54], ['E5', 0.54], ['C5', 0.54], ['Bb4', 0.54], ['A4', 0.96],
    ['F5', 0.36], ['F5', 0.18], ['E5', 0.54], ['C5', 0.54], ['D5', 0.54], ['C5', 1.18]
  ];

  notes.D5 = 587.33;
  notes.E5 = 659.25;
  notes.F5 = 698.46;
  notes.G5 = 783.99;

  const playLoop = () => {
    let cursor = context.currentTime + 0.05;

    melody.forEach(([note, duration]) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const filter = context.createBiquadFilter();

      oscillator.type = 'triangle';
      oscillator.frequency.value = notes[note];
      filter.type = 'lowpass';
      filter.frequency.value = 2600;

      gain.gain.setValueAtTime(0.0001, cursor);
      gain.gain.exponentialRampToValueAtTime(0.68, cursor + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, cursor + duration * 0.92);

      oscillator.connect(filter).connect(gain).connect(master);
      oscillator.start(cursor);
      oscillator.stop(cursor + duration);

      const harmony = context.createOscillator();
      const harmonyGain = context.createGain();
      harmony.type = 'sine';
      harmony.frequency.value = notes[note] / 2;
      harmonyGain.gain.setValueAtTime(0.0001, cursor);
      harmonyGain.gain.exponentialRampToValueAtTime(0.18, cursor + 0.035);
      harmonyGain.gain.exponentialRampToValueAtTime(0.0001, cursor + duration * 0.9);
      harmony.connect(harmonyGain).connect(master);
      harmony.start(cursor);
      harmony.stop(cursor + duration);

      cursor += duration;
    });

    const durationMs = Math.ceil((cursor - context.currentTime + 0.65) * 1000);
    birthdaySongLoop = window.setTimeout(playLoop, durationMs);
  };

  playLoop();
  return 0;
}
