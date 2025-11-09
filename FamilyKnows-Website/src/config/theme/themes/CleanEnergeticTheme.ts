// src/config/theme/themes/CleanEnergeticTheme.ts
// Clean & Energetic Theme - Combination 6
// Colors: Blue-purple palette for modern, energetic feel
// Appeals to younger, tech-savvy families

import { Theme } from '../types';

const cleanEnergeticTheme: Theme = {
  name: 'clean-energetic',
  colors: {
    primary: {
      main: '#5680e9', // Vibrant blue - energy, trust, innovation
      light: '#84ceeb', // Sky blue for accents
      dark: '#4568c5', // Darker blue for depth
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#8860d0', // Purple - sophistication, innovation
      light: '#a380e0', // Light purple
      dark: '#6d4db0', // Dark purple
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#f8f9fc', // Very light blue-gray - clean, airy
      paper: '#FFFFFF', // Pure white for cards
      dark: '#2d3561', // Dark blue-purple for dark sections
    },
    text: {
      primary: '#2d3561', // Dark blue-purple for main text
      secondary: '#5a6b9f', // Medium blue for secondary text
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
      main: '#5ab9ea', // Cyan-blue for info
      light: '#84ceeb',
      dark: '#4598c7',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#28945e', // Green for success
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
    small: '0 2px 8px rgba(86, 128, 233, 0.1)',
    medium: '0 4px 12px rgba(86, 128, 233, 0.15), 0 2px 6px rgba(136, 96, 208, 0.08)',
    large: '0 12px 24px rgba(86, 128, 233, 0.2), 0 4px 8px rgba(136, 96, 208, 0.12)',
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

export default cleanEnergeticTheme;
