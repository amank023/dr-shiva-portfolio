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
    background: '#f8fafc',
    card: '#ffffff',
    cardBorder: '#e2e8f0',
    headerBg: '#ffffff',
    text: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    success: '#10b981',
    successLight: '#dcfce7',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    danger: '#ef4444',
    dangerLight: '#fee2e2',
    info: '#3b82f6',
    infoLight: '#dbeafe',
    badgeBg: '#f1f5f9',
    inputBg: '#f8fafc',
    inputBorder: '#cbd5e1'
  }
};

const DarkTheme = {
  dark: true,
  colors: {
    primary: '#38bdf8',
    primaryLight: '#082f49',
    primaryDark: '#0284c7',
    accent: '#14b8a6',
    background: '#090d16',
    card: '#111827',
    cardBorder: 'rgba(255, 255, 255, 0.08)',
    headerBg: '#0f172a',
    text: '#f8fafc',
    textSecondary: '#cbd5e1',
    textMuted: '#64748b',
    success: '#34d399',
    successLight: 'rgba(16, 185, 129, 0.15)',
    warning: '#fbbf24',
    warningLight: 'rgba(245, 158, 11, 0.15)',
    danger: '#f87171',
    dangerLight: 'rgba(239, 68, 68, 0.15)',
    info: '#60a5fa',
    infoLight: 'rgba(59, 130, 246, 0.15)',
    badgeBg: 'rgba(255, 255, 255, 0.06)',
    inputBg: 'rgba(255, 255, 255, 0.05)',
    inputBorder: 'rgba(255, 255, 255, 0.12)'
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
