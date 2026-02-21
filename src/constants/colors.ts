export const Colors = {
  background: '#0f0f1a',
  surface: '#1a1a2e',
  surfaceLight: '#252545',
  primary: '#4a90d9',
  primaryDark: '#2d6cb5',
  accent: '#e94560',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  text: '#e0e0e0',
  textSecondary: '#9e9e9e',
  textMuted: '#666680',
  border: '#333355',
  // Reciprocity map colors
  reciprocity: {
    full: '#4caf50',        // Green - full reciprocity
    partial: '#ff9800',     // Orange - partial/conditional
    none: '#f44336',        // Red - no reciprocity
    home: '#4a90d9',        // Blue - home state
    permitless: '#8bc34a',  // Light green - permitless carry
    unrestricted: '#2e7d32', // Dark green - unrestricted
    default: '#333355',     // Gray - unselected
  },
  permitType: {
    unrestricted: '#2e7d32',
    'shall-issue': '#4caf50',
    'may-issue': '#ff9800',
    'no-issue': '#f44336',
  },
} as const;
