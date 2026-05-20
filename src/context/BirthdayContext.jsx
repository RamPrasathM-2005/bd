import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export const PHASES = {
  WAITING: 'WAITING',
  AWAKENING: 'AWAKENING',
  CANDLE_LIT: 'CANDLE_LIT',
  CANDLE_OFF: 'CANDLE_OFF',
  CAKE_CUTTING: 'CAKE_CUTTING',
  THE_JOURNEY: 'THE_JOURNEY'
};

export const BIRTHDAY_MONTH_INDEX = 7; // August. JavaScript months are zero-based: January is 0, August is 7.
export const BIRTHDAY_DAY = 10;
export const BIRTHDAY_HOUR = 0;
export const BIRTHDAY_MINUTE = 0;

const BirthdayContext = createContext(null);

function getUrlDateOverride() {
  const query = new URLSearchParams(window.location.search);
  const date = query.get('date');

  if (date === 'birthday') {
    const realNow = new Date();
    return new Date(realNow.getFullYear(), BIRTHDAY_MONTH_INDEX, BIRTHDAY_DAY, 0, 1, 0, 0);
  }

  if (date) {
    return new Date(date);
  }

  return null;
}

function getUrlPhaseOverride() {
  const phase = new URLSearchParams(window.location.search).get('phase')?.toUpperCase();
  return PHASES[phase] || null;
}

function getNow() {
  return getUrlDateOverride() || new Date();
}

function getBirthdayForYear(year) {
  return new Date(year, BIRTHDAY_MONTH_INDEX, BIRTHDAY_DAY, BIRTHDAY_HOUR, BIRTHDAY_MINUTE, 0, 0);
}

function getGate(now) {
  const target = getBirthdayForYear(now.getFullYear());
  const unlocked = now >= target;
  return { target, unlocked };
}

export function formatCountdown(targetDate, now) {
  const diff = Math.max(0, targetDate.getTime() - now.getTime());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000)
  };
}

export function BirthdayProvider({ children }) {
  const [now, setNow] = useState(() => getNow());
  const [manualPhase, setManualPhase] = useState(() => getUrlPhaseOverride());
  const gate = useMemo(() => getGate(now), [now]);
  const phase = manualPhase || (gate.unlocked ? PHASES.AWAKENING : PHASES.WAITING);
  const startRituals = useCallback(() => setManualPhase(PHASES.CANDLE_LIT), []);
  const extinguishCandles = useCallback(() => setManualPhase(PHASES.CANDLE_OFF), []);
  const startCakeCutting = useCallback(() => setManualPhase(PHASES.CAKE_CUTTING), []);
  const startJourney = useCallback(() => setManualPhase(PHASES.THE_JOURNEY), []);
  const resetToWaiting = useCallback(() => setManualPhase(null), []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(getNow()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (gate.unlocked && !manualPhase) {
      setManualPhase(PHASES.AWAKENING);
    }
  }, [gate.unlocked, manualPhase]);

  const value = useMemo(
    () => ({
      now,
      targetDate: gate.target,
      isUnlocked: gate.unlocked,
      phase,
      goToPhase: setManualPhase,
      startRituals,
      extinguishCandles,
      startCakeCutting,
      startJourney,
      resetToWaiting
    }),
    [extinguishCandles, gate.target, gate.unlocked, now, phase, resetToWaiting, startCakeCutting, startJourney, startRituals]
  );

  return <BirthdayContext.Provider value={value}>{children}</BirthdayContext.Provider>;
}

export function useBirthday() {
  const context = useContext(BirthdayContext);
  if (!context) {
    throw new Error('useBirthday must be used inside BirthdayProvider');
  }
  return context;
}
