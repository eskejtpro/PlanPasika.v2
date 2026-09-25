import { AppSettingsData, DEFAULT_APP_SETTINGS, AppThemeId } from '../domain/settingsTypes';

const SETTINGS_STORAGE_KEY = 'planpasika_app_settings_v2';

type Listener = () => void;
const listeners = new Set<Listener>();

export const SettingsRepo = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  notify(): void {
    listeners.forEach((l) => l());
  },

  getSettings(): AppSettingsData {
    try {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!raw) return { ...DEFAULT_APP_SETTINGS };
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_APP_SETTINGS, ...parsed };
    } catch {
      return { ...DEFAULT_APP_SETTINGS };
    }
  },

  saveSettings(settings: AppSettingsData): void {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      this.notify();
    } catch (e) {
      console.error('Failed to save settings to localStorage:', e);
    }
  },

  updateSetting<K extends keyof AppSettingsData>(key: K, value: AppSettingsData[K]): void {
    const current = this.getSettings();
    const updated = { ...current, [key]: value };
    this.saveSettings(updated);
  },

  resetSettingsOnly(): void {
    this.saveSettings({ ...DEFAULT_APP_SETTINGS });
  },

  // Export full database JSON (workouts, plans, exercises, measurements, notes, events, substances)
  exportFullDatabase(): string {
    const data: Record<string, unknown> = {};
    const keys = [
      'gymtracker_active_workout',
      'gymtracker_plans',
      'gymtracker_exercises',
      'gymtracker_substances',
      'gymtracker_notes',
      'gymtracker_calendar_events',
      'gymtracker_cycles',
      'planpasika_cycle_data',
      'gymtracker_body_measurements',
      'gymtracker_body_weight',
      'planpasika_app_settings_v2',
    ];

    keys.forEach((key) => {
      const val = localStorage.getItem(key);
      if (val) {
        try {
          data[key] = JSON.parse(val);
        } catch {
          data[key] = val;
        }
      }
    });

    return JSON.stringify({
      appName: 'PlanPasika.v2',
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      data,
    }, null, 2);
  },

  importDatabase(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed.data || typeof parsed.data !== 'object') {
        throw new Error('Nieprawidłowa struktura pliku kopii zapasowej');
      }

      Object.entries(parsed.data).forEach(([key, val]) => {
        if (typeof val === 'string') {
          localStorage.setItem(key, val);
        } else {
          localStorage.setItem(key, JSON.stringify(val));
        }
      });

      this.notify();
      return true;
    } catch (e) {
      console.error('Błąd importu bazy danych:', e);
      return false;
    }
  },
};
