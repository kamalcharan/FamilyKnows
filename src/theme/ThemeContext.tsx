// src/theme/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeConfig } from '../types/theme';

// Import all 10 themes
import { PurpleToneTheme } from './themes/purpleToneTheme';
import { BharathaVarshaTheme } from './themes/bharathavarshaTheme';
import { ClassicElegantTheme } from './themes/classicElegantTheme';
import { TechySimpleTheme } from './themes/techySimpleTheme';
import { TechFutureTheme } from './themes/techFutureTheme';
import { TechAITheme } from './themes/techAITheme';
import { SleekCoolTheme } from './themes/sleekCoolTheme';
import { ProfessionalRedefinedTheme } from './themes/professionalRedefinedTheme';
import { ModernBusinessTheme } from './themes/modernBusinessTheme';
import { ModernBoldTheme } from './themes/modernBoldTheme';

interface ThemeContextType {
  theme: ThemeConfig;
  isDarkMode: boolean;
  currentThemeId: string;
  setTheme: (themeId: string) => void;
  toggleDarkMode: () => void;
  availableThemes: ThemeConfig[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@FamilyKnows:theme';
const DARK_MODE_STORAGE_KEY = '@FamilyKnows:darkMode';

// All 10 themes mapped by ID
const themes: Record<string, ThemeConfig> = {
  'purple-tone': PurpleToneTheme,
  'bharathavarsha': BharathaVarshaTheme,
  'classic-elegant': ClassicElegantTheme,
  'techy-simple': TechySimpleTheme,
  'tech-future': TechFutureTheme,
  'tech-ai': TechAITheme,
  'sleek-cool': SleekCoolTheme,
  'professional-redefined': ProfessionalRedefinedTheme,
  'modern-business': ModernBusinessTheme,
  'modern-bold': ModernBoldTheme,
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [currentThemeId, setCurrentThemeId] = useState('purple-tone');
  const [isDarkMode, setIsDarkMode] = useState(false); // Changed to false for light mode default

  useEffect(() => {
    // Load saved preferences
    loadThemePreferences();
  }, []);

  const loadThemePreferences = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      const savedDarkMode = await AsyncStorage.getItem(DARK_MODE_STORAGE_KEY);
      
      if (savedTheme && themes[savedTheme]) {
        setCurrentThemeId(savedTheme);
      }
      
      if (savedDarkMode !== null) {
        setIsDarkMode(savedDarkMode === 'true');
      }
    } catch (error) {
      console.error('Error loading theme preferences:', error);
    }
  };

  const setTheme = async (themeId: string) => {
    if (themes[themeId]) {
      setCurrentThemeId(themeId);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, themeId);
    }
  };

  const toggleDarkMode = async () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    await AsyncStorage.setItem(DARK_MODE_STORAGE_KEY, String(newDarkMode));
  };

  const getCurrentTheme = (): ThemeConfig => {
    const baseTheme = themes[currentThemeId] || PurpleToneTheme;
    
    if (isDarkMode && baseTheme.darkMode) {
      return {
        ...baseTheme,
        colors: baseTheme.darkMode.colors,
      };
    }
    
    return baseTheme;
  };

  const value: ThemeContextType = {
    theme: getCurrentTheme(),
    isDarkMode,
    currentThemeId,
    setTheme,
    toggleDarkMode,
    availableThemes: Object.values(themes),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};