import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config/apiConfig';

const LightTheme = {
  dark: false,
  colors: {
    primary: '#0284c7',
    primaryLight: '#e0f2fe',
    primaryDark: '#0369a1',
    accent: '#0d9488',
    background: '#f1f5f9',
    surface: '#ffffff',
    surfaceHighlight: '#f8fafc',
    card: '#ffffff',
    cardBorder: '#e2e8f0',
    border: '#cbd5e1',
    headerBg: '#ffffff',
    text: '#0f172a',
    textSecondary: '#334155',
    textMuted: '#64748b',
    success: '#059669',
    successLight: '#dcfce7',
    warning: '#d97706',
    warningLight: '#fef3c7',
    danger: '#dc2626',
    dangerLight: '#fee2e2',
    info: '#2563eb',
    infoLight: '#dbeafe',
    badgeBg: '#e2e8f0',
    inputBg: '#ffffff',
    inputBorder: '#cbd5e1'
  }
};

const DarkTheme = {
  dark: true,
  colors: {
    primary: '#38bdf8',
    primaryLight: '#0f2d4a',
    primaryDark: '#0284c7',
    accent: '#2dd4bf',
    background: '#0a0f1d',
    surface: '#141d2f',
    surfaceHighlight: '#1c283f',
    card: '#141d2f',
    cardBorder: '#253552',
    border: '#253552',
    headerBg: '#0e1626',
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    success: '#34d399',
    successLight: '#064e3b',
    warning: '#fbbf24',
    warningLight: '#78350f',
    danger: '#f87171',
    dangerLight: '#7f1d1d',
    info: '#60a5fa',
    infoLight: '#1e3a8a',
    badgeBg: '#1c283f',
    inputBg: '#1c283f',
    inputBorder: '#2d4063'
  }
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE)
      .then((val) => {
        if (val === 'dark') setIsDark(true);
      })
      .catch(() => {});
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, next ? 'dark' : 'light').catch(() => {});
      return next;
    });
  };

  const theme = isDark ? DarkTheme : LightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
