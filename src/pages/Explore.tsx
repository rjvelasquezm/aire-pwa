import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TECHNIQUES, Goal, Difficulty } from '../data/techniques';

type Filter = 'all' | Goal | Difficulty;
const FILTERS: Array<{ label: string; value: Filter }> = [
  { label: 'All', value: 'all' },
  { label: '😌 Calm', value: 'calm' },
  { label: '🎯 Focus', value: 'focus' },
  { label: '⚡ Energy', value: 'energy' },
  { label: '😴 Sleep', value: 'sleep' },
  { label: '💚 Daily', value: 'daily' },
  { label: 'Beginner', value: 'beginner' },
  { label: 'Advanced', value: 'advanced' },
];

const DIFF_COLOR: Record<Difficulty, string> = {
  beginner: '#22C55E', intermediate: '#F59E0B', advanced: '#EF4444',
};

export default function Explore() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = TECHNIQUES.filter(t => {
    if (filter === 'all') return true;
    if (['beginner', 'intermediate', 'advanced'].includes(filter)) return t.difficulty === filter;
    return t.goals.includes(filter as Goal);
  });

  return (
    <div className="page">
      <h1>Techniques</h1>
      <p className="text-secondary" style={{ marginBottom: 20 }}>8 science-backed breathing practices, each with different effects on your nervous system.</p>

      <div className="scroll-row" style={{ marginBottom: 20 }}>
        {FILTERS.map(f => (
          <button key={f.value} className={`chip ${filter === f.value ? 'active' : ''}`} onClick={() => setFilter(f.value)}>
            {f.label}
          </button>
        ))}
      </div>

      {filtered.map(t => (
        <button
          key={t.id}
          onClick={() => navigate(`/technique/${t.id}`)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderLeft: `4px solid ${t.color}`, borderRadius: 14, padding: '14px 16px',
            cursor: 'pointer', textAlign: 'left', outline: 'none',
          }}
        >
          <span style={{ fontSize: 28, flexShrink: 0 }}>{t.emoji}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 15 }}>{t.name}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: DIFF_COLOR[t.difficulty], background: DIFF_COLOR[t.difficulty] + '22', padding: '2px 8px', borderRadius: 99 }}>
                {t.difficulty}
              </span>
            </div>
            <div className="text-secondary" style={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.tagline}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
              {t.goals.map(g => (
                <span key={g} style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg-elevated)', padding: '2px 8px', borderRadius: 99 }}>{g}</span>
              ))}
            </div>
          </div>
          <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>›</span>
        </button>
      ))}
    </div>
  );
}
