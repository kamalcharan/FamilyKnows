// src/App_FamilyKnows.tsx
// Main FamilyKnows Landing Page

import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { getTheme, DEFAULT_THEME } from './config/theme/themeConfig';
import FamilyKnowsNavbar from './components/familyknows/FamilyKnowsNavbar';
import FamilyKnowsHero from './components/familyknows/FamilyKnowsHero';
import TrustSignals from './components/familyknows/TrustSignals';
import FamilyCentricSection from './components/familyknows/FamilyCentricSection';
import HowItWorks from './components/familyknows/HowItWorks';
import StorytellingSection from './components/familyknows/StorytellingSection';
import Testimonials from './components/familyknows/Testimonials';
import EarlyAdopterSection from './components/familyknows/EarlyAdopterSection';
import MobileAppShowcase from './components/familyknows/MobileAppShowcase';
import FAQ from './components/familyknows/FAQ';
import FamilyKnowsFooter from './components/familyknows/FamilyKnowsFooter';

function App_FamilyKnows() {
  // Load default theme (ModernFamily)
  const defaultTheme = getTheme(DEFAULT_THEME);

  return (
    <ThemeProvider initialTheme={defaultTheme}>
      <div className="familyknows-app">
        {/* Navbar */}
        <FamilyKnowsNavbar />

        {/* Hero Section with Scarcity & Dual CTA */}
        <FamilyKnowsHero />

        {/* Trust Signals Section */}
        <TrustSignals />

        {/* Family-Centric vs Fund-Centric Differentiation */}
        <FamilyCentricSection />

        {/* How It Works - 3 Steps */}
        <HowItWorks />

        {/* Storytelling - Why FamilyKnows? */}
        <StorytellingSection />

        {/* Testimonials from Beta Users */}
        <Testimonials />

        {/* Early Adopter Offer & Features */}
        <EarlyAdopterSection />

        {/* Mobile App Screenshots with 3D Carousel */}
        <MobileAppShowcase />

        {/* FAQ Section */}
        <FAQ />

        {/* Footer */}
        <FamilyKnowsFooter />
      </div>
    </ThemeProvider>
  );
}

export default App_FamilyKnows;
