// src/App_FamilyKnows.tsx
// Main FamilyKnows Landing Page

import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { getTheme, DEFAULT_THEME } from './config/theme/themeConfig';
import FamilyKnowsHero from './components/familyknows/FamilyKnowsHero';
import TrustSignals from './components/familyknows/TrustSignals';
import StorytellingSection from './components/familyknows/StorytellingSection';
import EarlyAdopterSection from './components/familyknows/EarlyAdopterSection';
import FamilyKnowsFooter from './components/familyknows/FamilyKnowsFooter';

function App_FamilyKnows() {
  // Load default theme (ModernFamily)
  const defaultTheme = getTheme(DEFAULT_THEME);

  return (
    <ThemeProvider initialTheme={defaultTheme}>
      <div className="familyknows-app">
        {/* Hero Section with Scarcity & Dual CTA */}
        <FamilyKnowsHero />

        {/* Trust Signals Section */}
        <TrustSignals />

        {/* Storytelling - Why FamilyKnows? */}
        <StorytellingSection />

        {/* Early Adopter Offer & Features */}
        <EarlyAdopterSection />

        {/* Footer */}
        <FamilyKnowsFooter />
      </div>
    </ThemeProvider>
  );
}

export default App_FamilyKnows;
