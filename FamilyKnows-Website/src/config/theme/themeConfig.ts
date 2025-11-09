// src/config/theme/themeConfig.ts
// Central theme configuration for FamilyKnows website
// Allows easy theme switching across the application

import modernFamilyTheme from './themes/ModernFamilyTheme';
import blueFoundationTheme from './themes/BlueFoundationTheme';
import cleanEnergeticTheme from './themes/CleanEnergeticTheme';
import { Theme } from './types';

// Available themes
export const themes = {
  modernFamily: modernFamilyTheme,
  blueFoundation: blueFoundationTheme,
  cleanEnergetic: cleanEnergeticTheme,
} as const;

// Theme metadata for display/selection
export const themeMetadata = {
  modernFamily: {
    id: 'modernFamily',
    name: 'Modern Family',
    description: 'Teal & Green - Trust, growth, and prosperity',
    preview: {
      primary: '#65ccb8',
      secondary: '#28945e',
      background: '#f2f2f2',
    },
    recommended: true, // Default theme
  },
  blueFoundation: {
    id: 'blueFoundation',
    name: 'Blue Foundation',
    description: 'Professional blue - Authority and trust',
    preview: {
      primary: '#3d52a0',
      secondary: '#8697c4',
      background: '#ede8f5',
    },
    recommended: false,
  },
  cleanEnergetic: {
    id: 'cleanEnergetic',
    name: 'Clean & Energetic',
    description: 'Blue-purple - Modern and innovative',
    preview: {
      primary: '#5680e9',
      secondary: '#8860d0',
      background: '#f8f9fc',
    },
    recommended: false,
  },
} as const;

// Type for theme keys
export type ThemeKey = keyof typeof themes;

// Default theme
export const DEFAULT_THEME: ThemeKey = 'modernFamily';

// Get theme by key
export const getTheme = (themeKey: ThemeKey): Theme => {
  return themes[themeKey] || themes[DEFAULT_THEME];
};

// Get all available themes
export const getAllThemes = () => {
  return Object.entries(themes).map(([key, theme]) => ({
    key: key as ThemeKey,
    theme,
    metadata: themeMetadata[key as ThemeKey],
  }));
};

// Theme storage key for localStorage
export const THEME_STORAGE_KEY = 'familyknows-theme-preference';

// Save theme preference
export const saveThemePreference = (themeKey: ThemeKey): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(THEME_STORAGE_KEY, themeKey);
  }
};

// Load theme preference
export const loadThemePreference = (): ThemeKey => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved && saved in themes) {
      return saved as ThemeKey;
    }
  }
  return DEFAULT_THEME;
};
