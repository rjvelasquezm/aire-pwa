export interface Session {
  id: string;
  techniqueId: string;
  startedAt: number; // unix ms
  duration: number;  // seconds
  rounds: number;
  completed: boolean;
}

const KEY = 'aire_sessions';

export function getSessions(): Session[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}

export function saveSession(s: Omit<Session, 'id'>): Session {
  const session = { ...s, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}` };
  const all = getSessions();
  all.unshift(session);
  localStorage.setItem(KEY, JSON.stringify(all));
  return session;
}

export function getRecentSessions(limit = 20): Session[] {
  return getSessions().slice(0, limit);
}

export function getTotalStats() {
  const sessions = getSessions().filter(s => s.completed);
  return {
    totalSessions: sessions.length,
    totalMinutes: Math.floor(sessions.reduce((sum, s) => sum + s.duration, 0) / 60),
  };
}

export function getStreakInfo(): { current: number; best: number } {
  const sessions = getSessions().filter(s => s.completed);
  if (!sessions.length) return { current: 0, best: 0 };

  const days = [...new Set(sessions.map(s =>
    new Date(s.startedAt).toISOString().split('T')[0]
  ))].sort().reverse();

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let current = 0, best = 0, streak = 0;

  for (let i = 0; i < days.length; i++) {
    if (i === 0) {
      streak = (days[0] === today || days[0] === yesterday) ? 1 : 0;
    } else {
      const prev = new Date(days[i - 1]);
      const curr = new Date(days[i]);
      const diff = Math.round((prev.getTime() - curr.getTime()) / 86400000);
      streak = diff === 1 ? streak + 1 : 1;
    }
    best = Math.max(best, streak);
  }

  current = (days[0] === today || days[0] === yesterday) ? streak : 0;
  return { current, best };
}

export function getHeatMapData(weeksBack = 16): Record<string, number> {
  const cutoff = Date.now() - weeksBack * 7 * 86400000;
  const result: Record<string, number> = {};
  getSessions()
    .filter(s => s.completed && s.startedAt >= cutoff)
    .forEach(s => {
      const day = new Date(s.startedAt).toISOString().split('T')[0];
      result[day] = (result[day] || 0) + 1;
    });
  return result;
}

export function getTechniqueBreakdown() {
  const map: Record<string, { count: number; totalMins: number }> = {};
  getSessions().filter(s => s.completed).forEach(s => {
    if (!map[s.techniqueId]) map[s.techniqueId] = { count: 0, totalMins: 0 };
    map[s.techniqueId].count++;
    map[s.techniqueId].totalMins += Math.floor(s.duration / 60);
  });
  return Object.entries(map)
    .map(([techniqueId, v]) => ({ techniqueId, ...v }))
    .sort((a, b) => b.count - a.count);
}
