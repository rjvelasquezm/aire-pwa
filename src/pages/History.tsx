import { useEffect, useState } from 'react';
import { getTotalStats, getStreakInfo, getRecentSessions, getHeatMapData, getTechniqueBreakdown, Session } from '../lib/storage';
import { getTechniqueById } from '../data/techniques';

function HeatMap({ data }: { data: Record<string, number> }) {
  const weeks: string[][] = [];
  const today = new Date(); today.setHours(0,0,0,0);
  const start = new Date(today); start.setDate(start.getDate() - 15 * 7); start.setDate(start.getDate() - start.getDay());
  const cur = new Date(start);
  let week: string[] = [];
  while (cur <= today) {
    week.push(cur.toISOString().split('T')[0]);
    if (week.length === 7) { weeks.push(week); week = []; }
    cur.setDate(cur.getDate() + 1);
  }
  if (week.length) { while (week.length < 7) week.push(''); weeks.push(week); }

  function color(count: number) {
    if (!count) return 'var(--bg-elevated)';
    if (count === 1) return '#1D4E6B';
    if (count === 2) return '#1E6FA1';
    return '#3B82F6';
  }

  const todayStr = today.toISOString().split('T')[0];

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'flex', gap: 3, minWidth: 'max-content' }}>
        {weeks.map((w, wi) => (
          <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {w.map((day, di) => (
              <div key={di} style={{ width: 13, height: 13, borderRadius: 3, background: day ? color(data[day] || 0) : 'transparent', border: day === todayStr ? '1.5px solid var(--text-secondary)' : 'none' }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function fmt(d: Date) {
  const t = new Date(); t.setHours(0,0,0,0);
  const y = new Date(t); y.setDate(y.getDate() - 1);
  if (d.toDateString() === t.toDateString()) return 'Today';
  if (d.toDateString() === y.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function fmtDur(s: number) { return s < 60 ? `${s}s` : `${Math.floor(s/60)}m ${s%60 ? s%60+'s' : ''}`; }

export default function History() {
  const [stats, setStats] = useState({ totalSessions: 0, totalMinutes: 0 });
  const [streak, setStreak] = useState({ current: 0, best: 0 });
  const [heatMap, setHeatMap] = useState<Record<string, number>>({});
  const [sessions, setSessions] = useState<Session[]>([]);
  const [breakdown, setBreakdown] = useState<ReturnType<typeof getTechniqueBreakdown>>([]);

  useEffect(() => {
    setStats(getTotalStats());
    setStreak(getStreakInfo());
    setHeatMap(getHeatMapData());
    setSessions(getRecentSessions(20));
    setBreakdown(getTechniqueBreakdown());
  }, []);

  return (
    <div className="page">
      <h1 style={{ marginBottom: 20 }}>History</h1>

      {/* Stats */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 24 }}>
        {[
          { value: stats.totalSessions, label: 'Sessions' },
          { value: `${stats.totalMinutes}m`, label: 'Total time' },
          { value: streak.current || '—', label: '🔥 Streak', color: streak.current > 0 ? '#F59E0B' : undefined },
          { value: streak.best || '—', label: 'Best' },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color || 'var(--text-primary)' }}>{s.value}</div>
            <div className="text-muted" style={{ fontSize: 11, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Heat map */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12 }}>Activity</h3>
        <HeatMap data={heatMap} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', marginTop: 8 }}>
          <span className="text-muted" style={{ fontSize: 10 }}>Less</span>
          {[0,1,2,3].map(n => <div key={n} style={{ width: 11, height: 11, borderRadius: 2, background: ['var(--bg-elevated)','#1D4E6B','#1E6FA1','#3B82F6'][n] }} />)}
          <span className="text-muted" style={{ fontSize: 10 }}>More</span>
        </div>
      </div>

      {/* Breakdown */}
      {breakdown.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 12 }}>Techniques Used</h3>
          {breakdown.map(item => {
            const t = getTechniqueById(item.techniqueId);
            if (!t) return null;
            const pct = Math.round((item.count / breakdown[0].count) * 100);
            return (
              <div key={item.techniqueId} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{t.emoji} {t.name}</span>
                  <span className="text-muted" style={{ fontSize: 13 }}>{item.count} · {item.totalMins}m</span>
                </div>
                <div style={{ height: 6, background: 'var(--bg-elevated)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: t.color, borderRadius: 3 }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sessions list */}
      {sessions.length > 0 ? (
        <div>
          <h3 style={{ marginBottom: 12 }}>Recent Sessions</h3>
          {sessions.map(s => {
            const t = getTechniqueById(s.techniqueId);
            return (
              <div key={s.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, padding: '12px 14px' }}>
                <div style={{ width: 10, height: 10, borderRadius: 5, background: t?.color || 'var(--text-muted)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{t?.name || s.techniqueId}</div>
                  <div className="text-muted" style={{ fontSize: 12, marginTop: 2 }}>{fmt(new Date(s.startedAt))} · {fmtDur(s.duration)} · {s.rounds} rounds</div>
                </div>
                {s.completed && <span style={{ color: '#22C55E', fontWeight: 700 }}>✓</span>}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: 'center', paddingTop: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🫁</div>
          <h3 style={{ marginBottom: 8 }}>No sessions yet</h3>
          <p className="text-secondary">Complete your first breathing session to see history here.</p>
        </div>
      )}
    </div>
  );
}
