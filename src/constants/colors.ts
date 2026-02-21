export type ThemeName = 'light' | 'dark';

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
  map: {
    borderColor: string;
    borderOpacity: number;
    fallback: string;
  };
}

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
  map: {
    borderColor: '#555555',
    borderOpacity: 0.5,
    fallback: '#333333',
  },
};

export const themes: Record<ThemeName, Theme> = {
  light: lightTheme,
  dark: darkTheme,
};

// Legacy Colors export for backward compatibility during migration
export const Colors = lightTheme;
