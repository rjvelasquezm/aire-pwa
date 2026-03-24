import { useEffect, useRef, useState, useCallback } from 'react';
import { Technique, Phase } from '../data/techniques';

export interface TimerState {
  phaseIndex: number;
  phase: Phase;
  countdown: number;
  round: number;
  totalRounds: number;
  isActive: boolean;
  isPaused: boolean;
  isComplete: boolean;
  elapsedSeconds: number;
}

interface Options {
  technique: Technique;
  totalRounds: number;
  onPhaseChange?: (phase: Phase) => void;
  onComplete?: (elapsed: number) => void;
}

export function useBreathingTimer({ technique, totalRounds, onPhaseChange, onComplete }: Options) {
  const phases = technique.phases.filter(p => p.duration > 0);

  const [state, setState] = useState<TimerState>({
    phaseIndex: 0,
    phase: phases[0],
    countdown: phases[0].duration,
    round: 1,
    totalRounds,
    isActive: false,
    isPaused: false,
    isComplete: false,
    elapsedSeconds: 0,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }, []);

  const tick = useCallback(() => {
    setState(prev => {
      if (!prev.isActive || prev.isPaused || prev.isComplete) return prev;
      const elapsed = prev.elapsedSeconds + 1;
      if (prev.countdown > 1) return { ...prev, countdown: prev.countdown - 1, elapsedSeconds: elapsed };

      const nextIndex = (prev.phaseIndex + 1) % phases.length;
      const newRound = nextIndex === 0 ? prev.round + 1 : prev.round;
      if (nextIndex === 0 && prev.round >= totalRounds) {
        return { ...prev, isActive: false, isComplete: true, countdown: 0, elapsedSeconds: elapsed };
      }
      const next = phases[nextIndex];
      return { ...prev, phaseIndex: nextIndex, phase: next, countdown: next.duration, round: newRound, elapsedSeconds: elapsed };
    });
  }, [phases, totalRounds]);

  // Fire callbacks
  const prevPhaseRef = useRef<number>(-1);
  const prevCompleteRef = useRef(false);

  useEffect(() => {
    if (state.isComplete && !prevCompleteRef.current) {
      prevCompleteRef.current = true;
      clear();
      onComplete?.(state.elapsedSeconds);
    }
    if (state.isActive && !state.isPaused && state.phaseIndex !== prevPhaseRef.current) {
      prevPhaseRef.current = state.phaseIndex;
      onPhaseChange?.(state.phase);
    }
  });

  // Manage interval
  useEffect(() => {
    if (state.isActive && !state.isPaused && !state.isComplete) {
      if (!intervalRef.current) intervalRef.current = setInterval(tick, 1000);
    } else {
      clear();
    }
    return clear;
  }, [state.isActive, state.isPaused, state.isComplete, tick, clear]);

  const start = useCallback(() => {
    prevPhaseRef.current = 0;
    prevCompleteRef.current = false;
    setState({
      phaseIndex: 0,
      phase: phases[0],
      countdown: phases[0].duration,
      round: 1,
      totalRounds,
      isActive: true,
      isPaused: false,
      isComplete: false,
      elapsedSeconds: 0,
    });
    onPhaseChange?.(phases[0]);
  }, [phases, totalRounds, onPhaseChange]);

  const pause = useCallback(() => setState(p => ({ ...p, isPaused: true })), []);
  const resume = useCallback(() => setState(p => ({ ...p, isPaused: false })), []);
  const stop = useCallback(() => { clear(); setState(p => ({ ...p, isActive: false, isPaused: false })); }, [clear]);

  return { state, start, pause, resume, stop };
}

export function getPhaseLabelText(label: string): string {
  if (label === 'inhale') return 'INHALE';
  if (label === 'exhale') return 'EXHALE';
  return 'HOLD';
}
