import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, ThemeName, themes, lightTheme } from '../constants/colors';
export type WeaponName =
  | 'Beretta APX'
  | 'Beretta M9'
  | 'Beretta PX4'
  | 'Glock 19'
  | 'Glock 43x'
  | 'Sig Sauer P320'
  | 'Sig Sauer P365x'
  | 'Staccato CS'
  | 'Staccato HD P4.5';

const WEAPON_NAMES: WeaponName[] = [
  'Beretta APX',
  'Beretta M9',
  'Beretta PX4',
  'Glock 19',
  'Glock 43x',
  'Sig Sauer P320',
  'Sig Sauer P365x',
  'Staccato CS',
  'Staccato HD P4.5',
];

interface ThemeContextValue {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (name: ThemeName) => void;
  toggleTheme: () => void;
  homeState: string | null;
  setHomeState: (code: string | null) => void;
  weaponName: WeaponName;
  setWeaponName: (weapon: WeaponName) => void;
}

const SETTINGS_STORAGE_KEY = 'ccw-map:settings:v1';

const ThemeContext = createContext<ThemeContextValue>({
  theme: lightTheme,
  themeName: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
  homeState: null,
  setHomeState: () => {},
  weaponName: 'Glock 19',
  setWeaponName: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>('light');
  const [homeState, setHomeState] = useState<string | null>(null);
  const [weaponName, setWeaponName] = useState<WeaponName>('Glock 19');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;

    const loadSettings = async () => {
      try {
        const raw = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
        if (!raw || !active) return;
        const parsed = JSON.parse(raw) as {
          themeName?: string;
          homeState?: string | null;
          weaponName?: string;
        };

        if (parsed.themeName && parsed.themeName in themes) {
          setThemeName(parsed.themeName as ThemeName);
        }
        if (typeof parsed.homeState === 'string' || parsed.homeState === null) {
          setHomeState(parsed.homeState);
        }
        if (parsed.weaponName && WEAPON_NAMES.includes(parsed.weaponName as WeaponName)) {
          setWeaponName(parsed.weaponName as WeaponName);
        }
      } catch (error) {
        console.warn('Failed to load settings:', error);
      } finally {
        if (active) setHydrated(true);
      }
    };

    loadSettings();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({ themeName, homeState, weaponName })
    ).catch((error) => {
      console.warn('Failed to persist settings:', error);
    });
  }, [themeName, homeState, weaponName, hydrated]);

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
      weaponName,
      setWeaponName,
    }),
    [themeName, setTheme, toggleTheme, homeState, weaponName]
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
