export type AppThemeId =
  | 'amoled'
  | 'dark_blue'
  | 'graphite'
  | 'purple'
  | 'red'
  | 'light'
  | 'system';

export interface ThemeConfig {
  id: AppThemeId;
  name: string;
  description: string;
  isDark: boolean;
  colors: {
    bg: string;
    surface: string;
    surfaceElevated: string;
    primary: string;
    secondary: string;
    outline: string;
    textPrimary: string;
    textSecondary: string;
    glow: string;
    navBg: string;
    badgeBg: string;
  };
}

export const THEME_PRESETS: Record<AppThemeId, ThemeConfig> = {
  amoled: {
    id: 'amoled',
    name: 'PlanPasika AMOLED',
    description: 'Czysta czerń, neonowa zieleń i turkus',
    isDark: true,
    colors: {
      bg: '#000000',
      surface: '#06090E',
      surfaceElevated: '#0D1420',
      primary: '#00F59B',
      secondary: '#06D6A0',
      outline: '#1E293B',
      textPrimary: '#F8FAFC',
      textSecondary: '#94A3B8',
      glow: 'rgba(0, 245, 155, 0.4)',
      navBg: '#070B12',
      badgeBg: '#064E3B',
    },
  },
  dark_blue: {
    id: 'dark_blue',
    name: 'Dark Blue',
    description: 'Ciemny granat z błękitnymi akcentami',
    isDark: true,
    colors: {
      bg: '#070F1E',
      surface: '#0D192E',
      surfaceElevated: '#152644',
      primary: '#38BDF8',
      secondary: '#60A5FA',
      outline: '#1E3A8A',
      textPrimary: '#F0F9FF',
      textSecondary: '#93C5FD',
      glow: 'rgba(56, 189, 248, 0.4)',
      navBg: '#091326',
      badgeBg: '#0C4A6E',
    },
  },
  graphite: {
    id: 'graphite',
    name: 'Graphite',
    description: 'Grafitowe tło ze szmaragdowym akcentem',
    isDark: true,
    colors: {
      bg: '#121214',
      surface: '#18181B',
      surfaceElevated: '#27272A',
      primary: '#10B981',
      secondary: '#34D399',
      outline: '#3F3F46',
      textPrimary: '#FAFAFA',
      textSecondary: '#A1A1AA',
      glow: 'rgba(16, 185, 129, 0.4)',
      navBg: '#18181B',
      badgeBg: '#064E3B',
    },
  },
  purple: {
    id: 'purple',
    name: 'Purple Dark',
    description: 'Ciemny fiolet i purpurowy neon',
    isDark: true,
    colors: {
      bg: '#0B0714',
      surface: '#130D24',
      surfaceElevated: '#20163B',
      primary: '#A855F7',
      secondary: '#C084FC',
      outline: '#4C1D95',
      textPrimary: '#FAF5FF',
      textSecondary: '#D8B4FE',
      glow: 'rgba(168, 85, 247, 0.4)',
      navBg: '#0F091C',
      badgeBg: '#581C87',
    },
  },
  red: {
    id: 'red',
    name: 'Red Performance',
    description: 'Agresywna czerwień i głęboki karmazyn',
    isDark: true,
    colors: {
      bg: '#100608',
      surface: '#1C0A0E',
      surfaceElevated: '#2E1017',
      primary: '#EF4444',
      secondary: '#F87171',
      outline: '#7F1D1D',
      textPrimary: '#FEF2F2',
      textSecondary: '#FCA5A5',
      glow: 'rgba(239, 68, 68, 0.4)',
      navBg: '#17080B',
      badgeBg: '#7F1D1D',
    },
  },
  light: {
    id: 'light',
    name: 'Light',
    description: 'Jasne tło, ciemny tekst i zielony akcent',
    isDark: false,
    colors: {
      bg: '#F8FAFC',
      surface: '#FFFFFF',
      surfaceElevated: '#F1F5F9',
      primary: '#059669',
      secondary: '#0D9488',
      outline: '#E2E8F0',
      textPrimary: '#0F172A',
      textSecondary: '#475569',
      glow: 'rgba(5, 150, 105, 0.25)',
      navBg: '#FFFFFF',
      badgeBg: '#D1FAE5',
    },
  },
  system: {
    id: 'system',
    name: 'System',
    description: 'Automatycznie według ustawień systemu Android',
    isDark: true,
    colors: {
      bg: '#000000',
      surface: '#06090E',
      surfaceElevated: '#0D1420',
      primary: '#00F59B',
      secondary: '#06D6A0',
      outline: '#1E293B',
      textPrimary: '#F8FAFC',
      textSecondary: '#94A3B8',
      glow: 'rgba(0, 245, 155, 0.4)',
      navBg: '#070B12',
      badgeBg: '#064E3B',
    },
  },
};

export interface AppSettingsData {
  // 1. Wygląd
  themeId: AppThemeId;
  uiDensity: 'compact' | 'standard' | 'large';
  fontSize: 'small' | 'standard' | 'large';
  cardRadius: 'small' | 'standard' | 'large';
  animationsEnabled: boolean;
  glowEffectsEnabled: boolean;
  amoledPureBlack: boolean;

  // 2. Trening & Timery
  autoRestTimer: boolean;
  defaultRestDuration: number;
  vibrationOnTimerEnd: boolean;
  soundOnTimerEnd: boolean;
  quickAddSeconds: number;
  autoAdvanceNextSet: boolean;

  // 3. Plan
  firstDayOfWeek: 'monday' | 'sunday';
  confirmDeleteExercise: boolean;
  confirmDeleteDay: boolean;
  confirmDeleteWeek: boolean;
  defaultNewDayStatus: 'UNRESOLVED' | 'COMPLETED' | 'NOT_COMPLETED';

  // 4. Kalendarz
  calendarReminders: boolean;
  calendarReminderTime: string;
  calendarVibration: boolean;
  calendarSound: boolean;
  calendarNeutralContent: boolean;

  // 5. Pomiary
  weightUnit: 'kg' | 'lbs';
  lengthUnit: 'cm' | 'in';
  decimalPlaces: 1 | 2;

  // 6. Aplikacja
  startScreen: 'today' | 'plans' | 'workout' | 'calendar' | 'analytics' | 'measurements';
  rememberLastScreen: boolean;
}

export const DEFAULT_APP_SETTINGS: AppSettingsData = {
  themeId: 'amoled',
  uiDensity: 'standard',
  fontSize: 'standard',
  cardRadius: 'standard',
  animationsEnabled: true,
  glowEffectsEnabled: true,
  amoledPureBlack: true,

  autoRestTimer: true,
  defaultRestDuration: 90,
  vibrationOnTimerEnd: true,
  soundOnTimerEnd: true,
  quickAddSeconds: 30,
  autoAdvanceNextSet: false,

  firstDayOfWeek: 'monday',
  confirmDeleteExercise: true,
  confirmDeleteDay: true,
  confirmDeleteWeek: true,
  defaultNewDayStatus: 'UNRESOLVED',

  calendarReminders: false,
  calendarReminderTime: '18:00',
  calendarVibration: true,
  calendarSound: true,
  calendarNeutralContent: true,

  weightUnit: 'kg',
  lengthUnit: 'cm',
  decimalPlaces: 1,

  startScreen: 'today',
  rememberLastScreen: true,
};
