import { motion } from 'framer-motion';
import { PhaseLabel } from '../data/techniques';
import { getPhaseLabelText } from '../hooks/useBreathingTimer';

const PHASE_COLORS: Record<PhaseLabel, string> = {
  inhale: '', // filled from technique color
  hold: '#8B5CF6',
  exhale: '#14B8A6',
  hold2: '#6D28D9',
};

function getColor(phase: PhaseLabel, techniqueColor: string): string {
  return phase === 'inhale' ? techniqueColor : PHASE_COLORS[phase];
}

function getScale(phase: PhaseLabel): number {
  return phase === 'inhale' || phase === 'hold' ? 1.0 : 0.38;
}

interface Props {
  phase: PhaseLabel;
  phaseDuration: number;
  countdown: number;
  techniqueColor: string;
  size?: number;
  isActive?: boolean;
}

export function BreathingOrb({ phase, phaseDuration, countdown, techniqueColor, size = 200, isActive = true }: Props) {
  const color = getColor(phase, techniqueColor);
  const scale = getScale(phase);
  const duration = isActive ? phaseDuration : 0.3;

  return (
    <div style={{ width: size * 1.6, height: size * 1.6, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      {/* Glow */}
      <motion.div
        animate={{ scale, opacity: phase === 'exhale' || phase === 'hold2' ? 0.15 : 0.25 }}
        transition={{ duration, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: '50%',
          background: color,
          filter: 'blur(32px)',
        }}
      />
      {/* Orb */}
      <motion.div
        animate={{ scale, backgroundColor: color }}
        transition={{ duration, ease: [0.4, 0, 0.2, 1] }}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: color,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 40px ${color}44`,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <span style={{ fontSize: size * 0.28, fontWeight: 200, color: 'rgba(255,255,255,0.95)', lineHeight: 1 }}>
          {countdown}
        </span>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: 3, marginTop: 4 }}>
          {getPhaseLabelText(phase)}
        </span>
      </motion.div>
    </div>
  );
}

// Mini pulsing orb for technique cards
export function MiniOrb({ color, size = 48 }: { color: string; size?: number }) {
  return (
    <motion.div
      animate={{ scale: [0.85, 1.05, 0.85] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: size, height: size, borderRadius: '50%', background: color, opacity: 0.85 }}
    />
  );
}
