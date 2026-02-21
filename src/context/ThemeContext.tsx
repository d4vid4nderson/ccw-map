import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Theme, ThemeName, themes, lightTheme } from '../constants/colors';

interface ThemeContextValue {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (name: ThemeName) => void;
  toggleTheme: () => void;
  homeState: string | null;
  setHomeState: (code: string | null) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: lightTheme,
  themeName: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
  homeState: null,
  setHomeState: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>('light');
  const [homeState, setHomeState] = useState<string | null>(null);

  const setTheme = useCallback((name: ThemeName) => {
    setThemeName(name);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeName((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const value = useMemo(
    () => ({
      theme: themes[themeName],
      themeName,
      setTheme,
      toggleTheme,
      homeState,
      setHomeState,
    }),
    [themeName, setTheme, toggleTheme, homeState]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
