import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MiniOrb } from '../components/BreathingOrb';
import { getTechniqueById, getCycleDuration, getRoundsForDuration } from '../data/techniques';
import { useStore } from '../lib/store';

const DURATIONS = [1, 3, 5, 10, 15, 20];
type Tab = 'overview' | 'science' | 'howto';

export default function TechniqueDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const t = getTechniqueById(id!);
  const defaultDuration = useStore(s => s.defaultDuration);
  const [duration, setDuration] = useState(defaultDuration);
  const [tab, setTab] = useState<Tab>('overview');

  if (!t) return <div className="page"><p>Not found</p></div>;

  const rounds = getRoundsForDuration(t, duration);
  const cycleSecs = getCycleDuration(t);

  return (
    <div className="page" style={{ paddingBottom: 200 }}>
      {/* Back */}
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 16, marginBottom: 16, padding: 0 }}>
        ← Back
      </button>

      {/* Hero */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, background: t.color + '15', borderRadius: 20, padding: 20, marginBottom: 20 }}>
        <MiniOrb color={t.color} size={64} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: t.color, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{t.difficulty}</div>
          <h1 style={{ marginBottom: 4, fontSize: 22 }}>{t.name}</h1>
          <p className="text-secondary" style={{ fontSize: 14 }}>{t.tagline}</p>
        </div>
      </div>

      {/* Cycle breakdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {t.phases.filter(p => p.duration > 0).map((p, i, arr) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: t.color }}>{p.duration}s</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{p.label.replace('hold2', 'hold')}</div>
            </span>
            {i < arr.length - 1 && <span style={{ color: 'var(--text-muted)' }}>→</span>}
          </span>
        ))}
        <span className="text-muted" style={{ marginLeft: 4 }}>= {cycleSecs}s cycle</span>
      </div>

      {/* Goal tags */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {t.goals.map(g => (
          <span key={g} style={{ fontSize: 12, color: 'var(--text-secondary)', background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '4px 12px', borderRadius: 99 }}>
            {g}
          </span>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
        {(['overview', 'science', 'howto'] as Tab[]).map(tabKey => (
          <button
            key={tabKey}
            onClick={() => setTab(tabKey)}
            style={{
              flex: 1, padding: '10px 4px', background: 'none', border: 'none', cursor: 'pointer',
              color: tab === tabKey ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: tab === tabKey ? 700 : 500, fontSize: 14,
              borderBottom: tab === tabKey ? `2px solid var(--blue)` : '2px solid transparent',
              marginBottom: -1,
            }}
          >
            {tabKey === 'overview' ? 'Overview' : tabKey === 'science' ? 'Science' : 'How To Use'}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>{t.overview}</p>
          {t.contraindications && (
            <div style={{ background: '#F59E0B15', border: '1px solid #F59E0B44', borderRadius: 12, padding: 14, display: 'flex', gap: 10 }}>
              <span>⚠️</span>
              <p style={{ color: '#F59E0B', fontSize: 13, lineHeight: 1.6 }}>{t.contraindications}</p>
            </div>
          )}
        </div>
      )}

      {tab === 'science' && (
        <div>
          <h3 style={{ marginBottom: 8 }}>How it works</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>{t.mechanism}</p>
          <h3 style={{ marginBottom: 8 }}>Research</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{t.science}</p>
        </div>
      )}

      {tab === 'howto' && (
        <div>
          <h3 style={{ marginBottom: 12 }}>Best situations</h3>
          <ul style={{ marginBottom: 24, paddingLeft: 0, listStyle: 'none' }}>
            {t.bestFor.map((b, i) => (
              <li key={i} style={{ color: 'var(--text-secondary)', marginBottom: 8, fontSize: 14, display: 'flex', gap: 8 }}>
                <span style={{ color: t.color }}>•</span> {b}
              </li>
            ))}
          </ul>
          <h3 style={{ marginBottom: 12 }}>Tips</h3>
          <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
            {t.tips.map((tip, i) => (
              <li key={i} style={{ color: 'var(--text-secondary)', marginBottom: 10, fontSize: 14, display: 'flex', gap: 10 }}>
                <span style={{ color: t.color, fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span> {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer: duration + start */}
      <div style={{ position: 'fixed', bottom: 'var(--tab-height)', left: 0, right: 0, maxWidth: 480, margin: '0 auto', background: 'var(--bg)', borderTop: '1px solid var(--border)', padding: '16px 16px 16px' }}>
        <div style={{ marginBottom: 12 }}>
          <div className="section-label" style={{ marginBottom: 8 }}>Duration</div>
          <div className="scroll-row">
            {DURATIONS.map(d => (
              <button
                key={d}
                className={`chip ${duration === d ? 'active' : ''}`}
                style={duration === d ? { background: t.color + '33', borderColor: t.color, color: t.color } : {}}
                onClick={() => setDuration(d)}
              >
                {d}m
              </button>
            ))}
          </div>
          <div className="text-muted" style={{ marginTop: 6 }}>{rounds} rounds · {cycleSecs}s per cycle</div>
        </div>
        <button
          className="btn btn-primary"
          style={{ background: t.color }}
          onClick={() => navigate(`/session/${t.id}?rounds=${rounds}`)}
        >
          ▶ Start Session
        </button>
      </div>
    </div>
  );
}
