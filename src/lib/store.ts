import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppStore {
  lastTechniqueId: string | null;
  defaultDuration: number;
  hapticsEnabled: boolean;
  reminders: {
    morning: { enabled: boolean; time: string };
    midday: { enabled: boolean; time: string };
    evening: { enabled: boolean; time: string };
  };
  setLastTechnique: (id: string) => void;
  setDefaultDuration: (m: number) => void;
  setHaptics: (v: boolean) => void;
  setReminder: (key: 'morning' | 'midday' | 'evening', enabled: boolean, time: string) => void;
}

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      lastTechniqueId: null,
      defaultDuration: 5,
      hapticsEnabled: true,
      reminders: {
        morning: { enabled: false, time: '08:00' },
        midday: { enabled: false, time: '12:30' },
        evening: { enabled: false, time: '21:00' },
      },
      setLastTechnique: (id) => set({ lastTechniqueId: id }),
      setDefaultDuration: (m) => set({ defaultDuration: m }),
      setHaptics: (v) => set({ hapticsEnabled: v }),
      setReminder: (key, enabled, time) =>
        set(s => ({ reminders: { ...s.reminders, [key]: { enabled, time } } })),
    }),
    { name: 'aire-settings' }
  )
);
