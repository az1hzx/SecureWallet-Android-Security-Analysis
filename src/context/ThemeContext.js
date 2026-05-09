import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const light = {
  bg: '#f8f9fb',
  card: '#ffffff',
  cardAlt: '#f3f4f6',
  text: '#191c1e',
  textSecondary: '#444651',
  textMuted: '#757682',
  primary: '#00236f',
  primaryContainer: '#1e3a8a',
  accent: '#27c38a',
  border: 'rgba(197,197,211,0.1)',
  navBg: 'rgba(255,255,255,0.92)',
  overlay: 'rgba(0,0,0,0.5)',
};

export const dark = {
  bg: '#111318',
  card: '#1e2028',
  cardAlt: '#272932',
  text: '#e4e5e9',
  textSecondary: '#a0a1a9',
  textMuted: '#6e7079',
  primary: '#90a8ff',
  primaryContainer: '#2a4ab0',
  accent: '#4edea3',
  border: 'rgba(255,255,255,0.08)',
  navBg: 'rgba(30,32,40,0.95)',
  overlay: 'rgba(0,0,0,0.7)',
};

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? dark : light;
  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
