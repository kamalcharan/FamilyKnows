// src/config/theme/themes/ModernFamilyTheme.ts
// Modern Family Office Theme - Combination 8
// Colors: Teal/Green for trust, growth, and prosperity
// Default theme for FamilyKnows website

import { Theme } from '../types';

const modernFamilyTheme: Theme = {
  name: 'modern-family',
  colors: {
    primary: {
      main: '#65ccb8', // Teal - modern, trustworthy, calming
      light: '#89dac9', // Lighter teal for hover states
      dark: '#57ba98', // Mint green for depth
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#28945e', // Forest green - security, stability, wealth growth
      light: '#3db070', // Lighter green
      dark: '#1f7549', // Darker green
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#f2f2f2', // Light gray - clean, professional
      paper: '#FFFFFF', // Pure white for cards
      dark: '#182628', // Deep charcoal - trust, sophistication
    },
    text: {
      primary: '#182628', // Deep charcoal for main text
      secondary: '#4a5557', // Medium gray for secondary text
      disabled: '#9ca3af',
      hint: '#d1d5db',
    },
    common: {
      black: '#000000',
      white: '#FFFFFF',
    },
    error: {
      main: '#dc2626',
      light: '#ef4444',
      dark: '#b91c1c',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
      contrastText: '#000000',
    },
    info: {
      main: '#65ccb8', // Teal for info
      light: '#89dac9',
      dark: '#57ba98',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#28945e', // Forest green for success
      light: '#3db070',
      dark: '#1f7549',
      contrastText: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    fontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.6,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.75,
      textTransform: 'none',
    },
  },
  spacing: (factor: number) => `${factor * 8}px`,
  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '16px',
    round: '50%',
  },
  shadows: {
    none: 'none',
    small: '0 2px 8px rgba(101, 204, 184, 0.1)',
    medium: '0 4px 12px rgba(101, 204, 184, 0.15), 0 2px 6px rgba(24, 38, 40, 0.08)',
    large: '0 12px 24px rgba(101, 204, 184, 0.2), 0 4px 8px rgba(24, 38, 40, 0.12)',
  },
  transitions: {
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
};

export default modernFamilyTheme;
