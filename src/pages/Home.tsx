import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TECHNIQUES, Goal, GOAL_META, getTechniquesForGoal, getTechniqueById } from '../data/techniques';
import { getStreakInfo } from '../lib/storage';
import { useStore } from '../lib/store';

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

function recommended() {
  const h = new Date().getHours();
  if (h < 10) return 'wim-hof';
  if (h < 14) return 'box-breathing';
  if (h < 18) return 'cyclic-sighing';
  return 'breathing-478';
}

const GOALS: Goal[] = ['calm', 'focus', 'energy', 'sleep', 'daily'];

export default function Home() {
  const navigate = useNavigate();
  const lastId = useStore(s => s.lastTechniqueId);
  const [streak, setStreak] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  useEffect(() => { setStreak(getStreakInfo().current); }, []);

  const quickTechnique = (lastId ? getTechniqueById(lastId) : null) ?? getTechniqueById(recommended()) ?? TECHNIQUES[0];
  const goalResults = selectedGoal ? getTechniquesForGoal(selectedGoal) : null;

  return (
    <div className="page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1>{greeting()}</h1>
          <p className="text-secondary">Ready to breathe?</p>
        </div>
        {streak > 0 && (
          <div className="card" style={{ padding: '10px 14px', textAlign: 'center', minWidth: 56 }}>
            <div style={{ fontSize: 20 }}>🔥</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#F59E0B' }}>{streak}</div>
          </div>
        )}
      </div>

      {/* Quick start */}
      <div style={{ marginBottom: 24 }}>
        <div className="section-label">{lastId ? 'Continue where you left off' : 'Recommended for now'}</div>
        <button
          onClick={() => navigate(`/technique/${quickTechnique.id}`)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 14,
            background: 'var(--bg-card)', border: `1px solid ${quickTechnique.color}55`,
            borderRadius: 20, padding: '14px 16px', cursor: 'pointer', textAlign: 'left',
          }}
        >
          <span style={{ fontSize: 28 }}>{quickTechnique.emoji}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 16 }}>{quickTechnique.name}</div>
            <div className="text-secondary" style={{ marginTop: 2 }}>{quickTechnique.tagline}</div>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: 20, background: quickTechnique.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 18 }}>▶</span>
          </div>
        </button>
      </div>

      {/* Goal picker */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12 }}>How do you want to feel?</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {GOALS.map(goal => {
            const { emoji, label, description } = GOAL_META[goal];
            const isSelected = selectedGoal === goal;
            return (
              <button
                key={goal}
                onClick={() => setSelectedGoal(isSelected ? null : goal)}
                style={{
                  background: 'var(--bg-card)', border: `1px solid ${isSelected ? 'var(--blue)' : 'var(--border)'}`,
                  borderRadius: 16, padding: 14, cursor: 'pointer', textAlign: 'left',
                  outline: 'none',
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 6 }}>{emoji}</div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 15 }}>{label}</div>
                <div className="text-secondary" style={{ fontSize: 12, marginTop: 2 }}>{description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Goal results */}
      {goalResults && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div className="section-label">Best for {selectedGoal}</div>
            <button onClick={() => setSelectedGoal(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18 }}>✕</button>
          </div>
          {goalResults.map(t => (
            <button
              key={t.id}
              onClick={() => navigate(`/technique/${t.id}`)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderLeft: `4px solid ${t.color}`, borderRadius: 12, padding: '12px 14px',
                cursor: 'pointer', textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 24 }}>{t.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.name}</div>
                <div className="text-secondary" style={{ fontSize: 13 }}>{t.tagline}</div>
              </div>
              <span style={{ color: 'var(--text-muted)' }}>›</span>
            </button>
          ))}
        </div>
      )}

      {/* Browse all */}
      <button
        onClick={() => navigate('/explore')}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '13px 20px', cursor: 'pointer', color: 'var(--blue)', fontWeight: 500, fontSize: 15 }}
      >
        Browse all 8 techniques →
      </button>
    </div>
  );
}
