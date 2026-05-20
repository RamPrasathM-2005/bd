import { AnimatePresence } from 'framer-motion';
import React from 'react';
import Awakening from './components/Awakening.jsx';
import CakeCutting from './components/CakeCutting.jsx';
import CandleRitual from './components/CandleRitual.jsx';
import EmotionalJourney from './components/EmotionalJourney.jsx';
import JasmineTrail from './components/JasmineTrail.jsx';
import WaitingPrelude from './components/WaitingPrelude.jsx';
import { BirthdayProvider, useBirthday } from './context/BirthdayContext.jsx';

function AscensionExperience() {
  const { phase } = useBirthday();

  return (
    <main id="birthday-root" className="min-h-screen overflow-x-hidden bg-midnight text-pearl selection:bg-celestial selection:text-midnight">
      <JasmineTrail />
      <AnimatePresence mode="wait">
        {phase === 'WAITING' && <WaitingPrelude key="waiting" />}
        {phase === 'AWAKENING' && <Awakening key="awakening" />}
        {(phase === 'CANDLE_LIT' || phase === 'CANDLE_OFF') && <CandleRitual key="candles" />}
        {phase === 'CAKE_CUTTING' && <CakeCutting key="cake-cutting" />}
        {phase === 'THE_JOURNEY' && <EmotionalJourney key="journey" />}
      </AnimatePresence>
    </main>
  );
}

export default function App() {
  return (
    <BirthdayProvider>
      <AscensionExperience />
    </BirthdayProvider>
  );
}
