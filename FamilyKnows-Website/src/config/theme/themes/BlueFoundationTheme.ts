// src/config/theme/themes/BlueFoundationTheme.ts
// Blue Foundation Theme - Combination 1
// Colors: Professional blue palette for trust and authority
// Traditional family office aesthetic

import { Theme } from '../types';

const blueFoundationTheme: Theme = {
  name: 'blue-foundation',
  colors: {
    primary: {
      main: '#3d52a0', // Deep blue - authority, trust
      light: '#7091e6', // Sky blue for accents
      dark: '#2a3a70', // Darker blue for depth
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#8697c4', // Periwinkle - softer professional blue
      light: '#adbbda', // Light lavender blue
      dark: '#6577a3', // Medium blue
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#ede8f5', // Very light lavender - professional, clean
      paper: '#FFFFFF', // Pure white for cards
      dark: '#2a3a70', // Dark blue for dark sections
    },
    text: {
      primary: '#2a3a70', // Dark blue for main text
      secondary: '#6577a3', // Medium blue for secondary text
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
      main: '#7091e6', // Sky blue for info
      light: '#8697c4',
      dark: '#3d52a0',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#28945e', // Green for success (wealth growth)
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
    small: '6px',
    medium: '10px',
    large: '14px',
    round: '50%',
  },
  shadows: {
    none: 'none',
    small: '0 2px 8px rgba(61, 82, 160, 0.1)',
    medium: '0 4px 12px rgba(61, 82, 160, 0.15), 0 2px 6px rgba(42, 58, 112, 0.08)',
    large: '0 12px 24px rgba(61, 82, 160, 0.2), 0 4px 8px rgba(42, 58, 112, 0.12)',
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

export default blueFoundationTheme;
