export type ThemeName = 'light' | 'dark' | 'multicam' | 'multicam-black' | 'multicam-arid' | 'multicam-tropic' | 'multicam-alpine';

export interface Theme {
  name: ThemeName;
  background: string;
  surface: string;
  surfaceLight: string;
  primary: string;
  primaryDark: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  overlay: string;
  overlayStrong: string;
  reciprocity: {
    full: string;
    partial: string;
    none: string;
    home: string;
    permitless: string;
    unrestricted: string;
    default: string;
  };
  permitType: {
    unrestricted: string;
    'shall-issue': string;
    'may-issue': string;
    'no-issue': string;
  };
  compare: {
    stateA: string;
    stateB: string;
  };
  map: {
    borderColor: string;
    borderOpacity: number;
    fallback: string;
  };
}

// Theme metadata for the picker UI
export interface ThemeMeta {
  name: ThemeName;
  label: string;
  previewBg: string;
  previewBar: string;
  previewDots: [string, string];
}

export const themeList: ThemeMeta[] = [
  { name: 'light', label: 'Light', previewBg: '#f2f2f2', previewBar: '#ddd', previewDots: ['#d0d0d0', '#d0d0d0'] },
  { name: 'dark', label: 'Dark', previewBg: '#1a1a1a', previewBar: '#3a3a3a', previewDots: ['#555', '#555'] },
  { name: 'multicam', label: 'MultiCam', previewBg: '#a09784', previewBar: '#847a68', previewDots: ['#6b6252', '#bfb5a0'] },
  { name: 'multicam-black', label: 'MC Black', previewBg: '#1d1d1a', previewBar: '#353530', previewDots: ['#2a2a26', '#4a4a44'] },
  { name: 'multicam-arid', label: 'MC Arid', previewBg: '#b3a08a', previewBar: '#988470', previewDots: ['#c4b49e', '#8a7660'] },
  { name: 'multicam-tropic', label: 'MC Tropic', previewBg: '#696c50', previewBar: '#525540', previewDots: ['#3e4030', '#848868'] },
  { name: 'multicam-alpine', label: 'MC Alpine', previewBg: '#f0f1f3', previewBar: '#d0d2d6', previewDots: ['#b8bac0', '#e0e2e6'] },
];

export const lightTheme: Theme = {
  name: 'light',
  background: '#f2f2f2',
  surface: '#ffffff',
  surfaceLight: '#e8e8e8',
  primary: '#444444',
  primaryDark: '#333333',
  accent: '#e94560',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  text: '#1a1a1a',
  textSecondary: '#555555',
  textMuted: '#888888',
  border: '#d0d0d0',
  overlay: 'rgba(255, 255, 255, 0.92)',
  overlayStrong: 'rgba(255, 255, 255, 0.95)',
  reciprocity: {
    full: '#4caf50',
    partial: '#ff9800',
    none: '#f44336',
    home: '#4a90d9',
    permitless: '#8bc34a',
    unrestricted: '#2e7d32',
    default: '#d0d0d0',
  },
  permitType: {
    unrestricted: '#2e7d32',
    'shall-issue': '#4caf50',
    'may-issue': '#ff9800',
    'no-issue': '#f44336',
  },
  compare: {
    stateA: '#4a90d9',
    stateB: '#e94560',
  },
  map: {
    borderColor: '#ffffff',
    borderOpacity: 0.4,
    fallback: '#333355',
  },
};

export const darkTheme: Theme = {
  name: 'dark',
  background: '#1a1a1a',
  surface: '#2a2a2a',
  surfaceLight: '#3a3a3a',
  primary: '#cccccc',
  primaryDark: '#999999',
  accent: '#e94560',
  success: '#66bb6a',
  warning: '#ffa726',
  error: '#ef5350',
  text: '#e8e8e8',
  textSecondary: '#b0b0b0',
  textMuted: '#777777',
  border: '#444444',
  overlay: 'rgba(42, 42, 42, 0.94)',
  overlayStrong: 'rgba(42, 42, 42, 0.97)',
  reciprocity: {
    full: '#66bb6a',
    partial: '#ffa726',
    none: '#ef5350',
    home: '#5c9fdb',
    permitless: '#9ccc65',
    unrestricted: '#43a047',
    default: '#555555',
  },
  permitType: {
    unrestricted: '#43a047',
    'shall-issue': '#66bb6a',
    'may-issue': '#ffa726',
    'no-issue': '#ef5350',
  },
  compare: {
    stateA: '#5c9fdb',
    stateB: '#e94560',
  },
  map: {
    borderColor: '#555555',
    borderOpacity: 0.5,
    fallback: '#333333',
  },
};

// ─── MultiCam Original ── #a09784 ──────────────────
// Warm tan/brown woodland earth tones
export const multicamTheme: Theme = {
  name: 'multicam',
  background: '#47423a',
  surface: '#564f44',
  surfaceLight: '#6b6252',
  primary: '#c8bda8',
  primaryDark: '#a09784',
  accent: '#a09784',
  success: '#7a9a4a',
  warning: '#c4a23a',
  error: '#b85c3a',
  text: '#ece4d4',
  textSecondary: '#c8bda8',
  textMuted: '#8a7f6a',
  border: '#706656',
  overlay: 'rgba(71, 66, 58, 0.94)',
  overlayStrong: 'rgba(71, 66, 58, 0.97)',
  reciprocity: {
    full: '#7a9a4a',
    partial: '#c4a23a',
    none: '#b85c3a',
    home: '#5a8ab5',
    permitless: '#8aaa4a',
    unrestricted: '#4a6e2a',
    default: '#6b6252',
  },
  permitType: {
    unrestricted: '#4a6e2a',
    'shall-issue': '#7a9a4a',
    'may-issue': '#c4a23a',
    'no-issue': '#b85c3a',
  },
  compare: {
    stateA: '#5a8ab5',
    stateB: '#c05a4a',
  },
  map: {
    borderColor: '#8a7f6a',
    borderOpacity: 0.4,
    fallback: '#47423a',
  },
};

// ─── MultiCam Black ── #1d1d1a ─────────────────────
// Tactical near-black with warm undertone
export const multicamBlackTheme: Theme = {
  name: 'multicam-black',
  background: '#131310',
  surface: '#1d1d1a',
  surfaceLight: '#2a2a26',
  primary: '#9a9a90',
  primaryDark: '#6a6a60',
  accent: '#5a5a50',
  success: '#5a8a5a',
  warning: '#b0903a',
  error: '#a04040',
  text: '#d0d0c8',
  textSecondary: '#8a8a80',
  textMuted: '#5a5a52',
  border: '#353530',
  overlay: 'rgba(29, 29, 26, 0.95)',
  overlayStrong: 'rgba(29, 29, 26, 0.97)',
  reciprocity: {
    full: '#5a8a5a',
    partial: '#b0903a',
    none: '#a04040',
    home: '#4a7aaa',
    permitless: '#6a9a5a',
    unrestricted: '#3a6a3a',
    default: '#353530',
  },
  permitType: {
    unrestricted: '#3a6a3a',
    'shall-issue': '#5a8a5a',
    'may-issue': '#b0903a',
    'no-issue': '#a04040',
  },
  compare: {
    stateA: '#4a7aaa',
    stateB: '#a04a4a',
  },
  map: {
    borderColor: '#4a4a44',
    borderOpacity: 0.5,
    fallback: '#1d1d1a',
  },
};

// ─── MultiCam Arid ── #b3a08a ──────────────────────
// Desert sand and khaki, light warm tones
export const multicamAridTheme: Theme = {
  name: 'multicam-arid',
  background: '#c8b89e',
  surface: '#d8cbb2',
  surfaceLight: '#bfae94',
  primary: '#5e5040',
  primaryDark: '#4a3e30',
  accent: '#8a7460',
  success: '#6a8a3a',
  warning: '#c49030',
  error: '#a84a2a',
  text: '#2e2518',
  textSecondary: '#5e5040',
  textMuted: '#8a7c68',
  border: '#b3a08a',
  overlay: 'rgba(200, 184, 158, 0.93)',
  overlayStrong: 'rgba(200, 184, 158, 0.96)',
  reciprocity: {
    full: '#6a8a3a',
    partial: '#c49030',
    none: '#a84a2a',
    home: '#4a7aba',
    permitless: '#7a9a4a',
    unrestricted: '#4a6a2a',
    default: '#bfae94',
  },
  permitType: {
    unrestricted: '#4a6a2a',
    'shall-issue': '#6a8a3a',
    'may-issue': '#c49030',
    'no-issue': '#a84a2a',
  },
  compare: {
    stateA: '#3a7aca',
    stateB: '#b04a3a',
  },
  map: {
    borderColor: '#b3a08a',
    borderOpacity: 0.5,
    fallback: '#bfae94',
  },
};

// ─── MultiCam Tropic ── #696c50 ────────────────────
// Deep jungle olive and foliage green
export const multicamTropicTheme: Theme = {
  name: 'multicam-tropic',
  background: '#282a20',
  surface: '#363828',
  surfaceLight: '#484a38',
  primary: '#a0a488',
  primaryDark: '#696c50',
  accent: '#696c50',
  success: '#5aaa4a',
  warning: '#b8a030',
  error: '#b84a3a',
  text: '#dce0c8',
  textSecondary: '#a0a488',
  textMuted: '#6a6e54',
  border: '#525540',
  overlay: 'rgba(54, 56, 40, 0.94)',
  overlayStrong: 'rgba(54, 56, 40, 0.97)',
  reciprocity: {
    full: '#5aaa4a',
    partial: '#b8a030',
    none: '#b84a3a',
    home: '#4a8aba',
    permitless: '#7aba5a',
    unrestricted: '#3a8a2a',
    default: '#484a38',
  },
  permitType: {
    unrestricted: '#3a8a2a',
    'shall-issue': '#5aaa4a',
    'may-issue': '#b8a030',
    'no-issue': '#b84a3a',
  },
  compare: {
    stateA: '#4a8aba',
    stateB: '#c04a3a',
  },
  map: {
    borderColor: '#6a6e54',
    borderOpacity: 0.4,
    fallback: '#282a20',
  },
};

// ─── MultiCam Alpine ── #f0f1f3 ────────────────────
// Snow and ice — very pale, crisp whites and grays
export const multicamAlpineTheme: Theme = {
  name: 'multicam-alpine',
  background: '#e4e5e8',
  surface: '#f0f1f3',
  surfaceLight: '#d6d8dc',
  primary: '#555860',
  primaryDark: '#404348',
  accent: '#7a8090',
  success: '#5a9a6a',
  warning: '#b89a40',
  error: '#a05050',
  text: '#22252a',
  textSecondary: '#555860',
  textMuted: '#8a8c94',
  border: '#c4c6cc',
  overlay: 'rgba(228, 229, 232, 0.93)',
  overlayStrong: 'rgba(228, 229, 232, 0.96)',
  reciprocity: {
    full: '#5a9a6a',
    partial: '#b89a40',
    none: '#a05050',
    home: '#5a8ab5',
    permitless: '#6aaa6a',
    unrestricted: '#3a7a4a',
    default: '#c4c6cc',
  },
  permitType: {
    unrestricted: '#3a7a4a',
    'shall-issue': '#5a9a6a',
    'may-issue': '#b89a40',
    'no-issue': '#a05050',
  },
  compare: {
    stateA: '#5a8ab5',
    stateB: '#a05060',
  },
  map: {
    borderColor: '#b0b2b8',
    borderOpacity: 0.5,
    fallback: '#c4c6cc',
  },
};

export const themes: Record<ThemeName, Theme> = {
  light: lightTheme,
  dark: darkTheme,
  multicam: multicamTheme,
  'multicam-black': multicamBlackTheme,
  'multicam-arid': multicamAridTheme,
  'multicam-tropic': multicamTropicTheme,
  'multicam-alpine': multicamAlpineTheme,
};

// Legacy Colors export for backward compatibility during migration
export const Colors = lightTheme;
