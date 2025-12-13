// src/components/familyknows/FamilyKnowsNavbar.tsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import WaitlistModal from './WaitlistModal';
import './FamilyKnowsNavbar.css';

const FamilyKnowsNavbar: React.FC = () => {
  const { theme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEarlyAccessClick = () => {
    setIsWaitlistOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`familyknows-navbar ${scrolled ? 'scrolled' : ''}`}
        style={{
          backgroundColor: scrolled ? theme.colors.background.paper : 'transparent',
          borderBottom: scrolled ? `1px solid ${theme.colors.text.disabled}20` : 'none',
        }}
      >
        <div className="navbar-container">
          {/* Left: Logo */}
          <div className="navbar-logo">
            <span className="logo-icon">🏠</span>
            <span className="logo-text" style={{ color: theme.colors.text.primary }}>
              FamilyKnows
            </span>
          </div>

          {/* Center: Launch Message */}
          <div className="navbar-center">
            <div
              className="launch-badge"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.primary.main}15, ${theme.colors.secondary.main}15)`,
                borderColor: theme.colors.primary.main,
              }}
            >
              <span className="badge-icon">🚀</span>
              <span className="badge-text">
                <span className="badge-label">Launching January 2026</span>
                <span className="badge-sublabel">• Join 150 families in beta</span>
              </span>
            </div>
          </div>

          {/* Right: Language Selector + CTA */}
          <div className="navbar-right">
            {/* Language Selector */}
            <div className="language-selector">
              <button
                className="lang-button active"
                style={{ color: theme.colors.primary.main }}
              >
                EN
              </button>
              <span className="lang-divider">|</span>
              <button className="lang-button" style={{ color: theme.colors.text.secondary }}>
                తెలుగు
              </button>
              <span className="lang-divider">|</span>
              <button className="lang-button" style={{ color: theme.colors.text.secondary }}>
                हिंदी
              </button>
            </div>

            {/* CTA Button */}
            <button
              className="navbar-cta"
              onClick={handleEarlyAccessClick}
              style={{
                background: `linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.secondary.main})`,
              }}
            >
              Get Early Access
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ color: theme.colors.text.primary }}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="mobile-menu"
            style={{ backgroundColor: theme.colors.background.paper }}
          >
            <div className="mobile-menu-content">
              <div className="mobile-launch-info">
                <span style={{ color: theme.colors.primary.main }}>🚀 Launching January 2026</span>
              </div>
              <div className="mobile-languages">
                <button className="mobile-lang active" style={{ color: theme.colors.primary.main }}>
                  English
                </button>
                <button className="mobile-lang" style={{ color: theme.colors.text.secondary }}>
                  తెలుగు (Telugu)
                </button>
                <button className="mobile-lang" style={{ color: theme.colors.text.secondary }}>
                  हिंदी (Hindi)
                </button>
              </div>
              <button
                className="mobile-cta"
                onClick={handleEarlyAccessClick}
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.secondary.main})`,
                }}
              >
                Get Early Access - 50% Off
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Waitlist Modal */}
      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
        planType="earlybird"
        source="navbar"
      />
    </>
  );
};

export default FamilyKnowsNavbar;
