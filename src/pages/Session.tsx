import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BreathingOrb } from '../components/BreathingOrb';
import { useBreathingTimer } from '../hooks/useBreathingTimer';
import { getTechniqueById, Phase } from '../data/techniques';
import { saveSession } from '../lib/storage';
import { useStore } from '../lib/store';
import { unlockAudio, AudioCues } from '../lib/audio';

export default function Session() {
  const { id } = useParams<{ id: string }>();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const totalRounds = parseInt(params.get('rounds') || '10', 10);
  const technique = getTechniqueById(id!);
  const setLastTechnique = useStore(s => s.setLastTechnique);
  const [isComplete, setIsComplete] = useState(false);
  const [savedElapsed, setSavedElapsed] = useState(0);
  const [started, setStarted] = useState(false);

  const handlePhaseChange = useCallback((phase: Phase) => {
    switch (phase.label) {
      case 'inhale':  AudioCues.inhale();  break;
      case 'hold':    AudioCues.hold();    break;
      case 'exhale':  AudioCues.exhale();  break;
      case 'hold2':   AudioCues.hold2();   break;
    }
  }, []);

  const handleComplete = useCallback((elapsed: number) => {
    if (technique) {
      saveSession({ techniqueId: technique.id, startedAt: Date.now() - elapsed * 1000, duration: elapsed, rounds: totalRounds, completed: true });
      setLastTechnique(technique.id);
    }
    setSavedElapsed(elapsed);
    AudioCues.complete();
    setIsComplete(true);
  }, [technique, totalRounds, setLastTechnique]);

  const { state, start, pause, resume, stop } = useBreathingTimer({
    technique: technique!,
    totalRounds,
    onPhaseChange: handlePhaseChange,
    onComplete: handleComplete,
  });

  // Tap-to-begin: unlocks iOS audio (must happen inside a user gesture handler)
  const handleBegin = useCallback(async () => {
    await unlockAudio();
    setStarted(true);
    start();
    AudioCues.inhale();
  }, [start]);

  const handleStop = () => {
    if (window.confirm('End session and save progress?')) {
      if (technique && state.elapsedSeconds > 10) {
        saveSession({ techniqueId: technique.id, startedAt: Date.now() - state.elapsedSeconds * 1000, duration: state.elapsedSeconds, rounds: state.round, completed: false });
        setLastTechnique(technique.id);
      }
      stop();
      navigate(-1);
    }
  };

  if (!technique) return <div className="page"><p>Not found</p></div>;

  const progress = state.isActive ? (state.round - 1) / state.totalRounds : 0;
  const mins = Math.floor(savedElapsed / 60);
  const secs = savedElapsed % 60;

  return (
    <div style={{ height: '100dvh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: 'calc(env(safe-area-inset-top) + 12px) 16px 12px', justifyContent: 'space-between' }}>
        <button onClick={handleStop} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 22, padding: 8, lineHeight: 1 }}>✕</button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{technique.name}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {!started ? 'Tap the orb to begin' : state.isComplete ? 'Complete!' : `Round ${state.round} of ${state.totalRounds}`}
          </div>
        </div>
        <button
          onClick={state.isPaused ? resume : pause}
          disabled={!started || state.isComplete}
          style={{ background: 'none', border: 'none', color: started && !state.isComplete ? 'var(--text-secondary)' : 'transparent', cursor: 'pointer', fontSize: 22, padding: 8, lineHeight: 1 }}
        >
          {state.isPaused ? '▶' : '⏸'}
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: 'var(--bg-elevated)', margin: '0 16px' }}>
        <motion.div animate={{ width: `${progress * 100}%` }} transition={{ duration: 0.5 }} style={{ height: '100%', background: technique.color, borderRadius: 1 }} />
      </div>

      {/* Orb — tappable before start */}
      <div
        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: !started ? 'pointer' : 'default' }}
        onClick={!started ? handleBegin : undefined}
      >
        <BreathingOrb
          phase={state.phase?.label ?? 'inhale'}
          phaseDuration={state.phase?.duration ?? 4}
          countdown={started ? state.countdown : 0}
          techniqueColor={technique.color}
          size={200}
          isActive={state.isActive && !state.isPaused}
        />
      </div>

      {/* Pre-start instruction */}
      {!started && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '0 40px 32px' }}>
          <p style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Tap the orb to begin</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Audio cues will guide you — close your eyes</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 8 }}>{totalRounds} rounds · {technique.phases.filter(p => p.duration > 0).map(p => `${p.duration}s`).join(' · ')}</p>
        </motion.div>
      )}

      {/* In-session instruction */}
      {started && state.phase?.instruction && !state.isComplete && (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '0 40px 16px', fontSize: 14 }}>
          {state.phase.instruction}
        </p>
      )}

      {started && state.isPaused && !state.isComplete && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', paddingBottom: 16, fontSize: 13, letterSpacing: 1 }}>
          PAUSED — tap ▶ to continue
        </p>
      )}

      {/* Completion overlay */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ position: 'absolute', inset: 0, background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32 }}
          >
            <div style={{ fontSize: 72, marginBottom: 20 }}>🌬️</div>
            <h1 style={{ marginBottom: 8 }}>Session complete</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>{state.totalRounds} rounds · {mins}m {secs > 0 ? `${secs}s` : ''}</p>
            <p style={{ color: 'var(--text-muted)', marginBottom: 40 }}>{technique.name}</p>
            <div style={{ display: 'flex', gap: 12, width: '100%' }}>
              <button
                className="btn"
                style={{ flex: 1, background: technique.color, color: '#fff' }}
                onClick={() => { setIsComplete(false); setStarted(false); }}
              >
                ↺ Again
              </button>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => navigate('/')}>
                ✓ Done
              </button>
            </div>
            <p style={{ color: 'var(--text-muted)', marginTop: 20, fontSize: 13 }}>Session saved to history</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
