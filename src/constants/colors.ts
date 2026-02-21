export const Colors = {
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
  // Reciprocity map colors
  reciprocity: {
    full: '#4caf50',        // Green - full reciprocity
    partial: '#ff9800',     // Orange - partial/conditional
    none: '#f44336',        // Red - no reciprocity
    home: '#4a90d9',        // Blue - home state
    permitless: '#8bc34a',  // Light green - permitless carry
    unrestricted: '#2e7d32', // Dark green - unrestricted
    default: '#d0d0d0',     // Gray - unselected
  },
  permitType: {
    unrestricted: '#2e7d32',
    'shall-issue': '#4caf50',
    'may-issue': '#ff9800',
    'no-issue': '#f44336',
  },
} as const;
