import { useState } from 'react';
import { useStore } from '../lib/store';

const DURATIONS = [1, 3, 5, 10, 15, 20];
const REMINDERS = [
  { key: 'morning' as const, emoji: '🌅', label: 'Morning', defaultTime: '08:00' },
  { key: 'midday' as const, emoji: '☀️', label: 'Midday', defaultTime: '12:30' },
  { key: 'evening' as const, emoji: '🌙', label: 'Evening', defaultTime: '21:00' },
];

export default function Settings() {
  const { defaultDuration, setDefaultDuration, hapticsEnabled, setHaptics, reminders, setReminder } = useStore();
  const [notifStatus, setNotifStatus] = useState<string | null>(null);

  const handleReminderToggle = async (key: 'morning' | 'midday' | 'evening', enabled: boolean) => {
    const r = reminders[key];
    if (enabled) {
      if (!('Notification' in window)) { setNotifStatus('Notifications not supported in this browser'); return; }
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') { setNotifStatus('Please allow notifications in Safari settings'); return; }
      setNotifStatus('Reminder set! Note: Web reminders only fire when Safari is open on iOS.');
    }
    setReminder(key, enabled, r.time);
  };

  return (
    <div className="page">
      <h1 style={{ marginBottom: 24 }}>Settings</h1>

      {/* Reminders */}
      <div className="section-label">REMINDERS</div>
      {notifStatus && <p style={{ color: '#F59E0B', fontSize: 13, marginBottom: 12 }}>{notifStatus}</p>}
      <div className="card" style={{ marginBottom: 24, padding: 0, overflow: 'hidden' }}>
        {REMINDERS.map((r, i) => {
          const config = reminders[r.key];
          return (
            <div key={r.key} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderBottom: i < REMINDERS.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ fontSize: 20 }}>{r.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.label}</div>
                <input
                  type="time"
                  value={config.time}
                  onChange={e => setReminder(r.key, config.enabled, e.target.value)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 13, padding: 0, cursor: 'pointer' }}
                />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={config.enabled}
                  onChange={e => handleReminderToggle(r.key, e.target.checked)}
                  style={{ width: 20, height: 20, accentColor: 'var(--blue)', cursor: 'pointer' }}
                />
              </label>
            </div>
          );
        })}
      </div>

      {/* Default duration */}
      <div className="section-label">DEFAULT SESSION DURATION</div>
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="scroll-row">
          {DURATIONS.map(d => (
            <button
              key={d}
              className={`chip ${defaultDuration === d ? 'active' : ''}`}
              onClick={() => setDefaultDuration(d)}
            >
              {d}m
            </button>
          ))}
        </div>
      </div>

      {/* Haptics */}
      <div className="section-label">FEEDBACK</div>
      <div className="card" style={{ marginBottom: 24 }}>
        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Vibration feedback</div>
            <div className="text-secondary" style={{ fontSize: 13 }}>Vibrate on each phase change</div>
          </div>
          <input
            type="checkbox"
            checked={hapticsEnabled}
            onChange={e => setHaptics(e.target.checked)}
            style={{ width: 20, height: 20, accentColor: 'var(--blue)', cursor: 'pointer' }}
          />
        </label>
      </div>

      {/* Install hint */}
      <div style={{ background: 'var(--blue)15', border: '1px solid var(--blue)44', borderRadius: 14, padding: 16, marginBottom: 24 }}>
        <h3 style={{ marginBottom: 6, color: 'var(--blue)' }}>📱 Add to Home Screen</h3>
        <p className="text-secondary" style={{ fontSize: 13, lineHeight: 1.6 }}>
          In Safari, tap the Share button (□↑) then "Add to Home Screen" to install Aire as a standalone app with no browser chrome.
        </p>
      </div>

      <p className="text-muted" style={{ textAlign: 'center', marginTop: 8 }}>Aire — personal breathing companion</p>
    </div>
  );
}
