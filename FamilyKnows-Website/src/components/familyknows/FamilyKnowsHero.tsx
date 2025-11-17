// src/components/familyknows/FamilyKnowsHero.tsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import './FamilyKnowsHero.css';

const FamilyKnowsHero: React.FC = () => {
  const { theme } = useTheme();
  const [availableSpots, setAvailableSpots] = useState(100);

  // Simulate real-time spot counter (you can connect to real backend later)
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly decrease spots for demo (remove in production)
      if (Math.random() > 0.95 && availableSpots > 85) {
        setAvailableSpots(prev => prev - 1);
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [availableSpots]);

  return (
    <section
      className="family-knows-hero"
      style={{
        background: `linear-gradient(135deg, ${theme.colors.background.dark} 0%, ${theme.colors.primary.dark} 100%)`,
        color: theme.colors.common.white,
      }}
    >
      {/* Animated 3D Background Elements */}
      <div className="hero-3d-background">
        <div className="floating-shape shape-1" style={{ backgroundColor: theme.colors.primary.main }}></div>
        <div className="floating-shape shape-2" style={{ backgroundColor: theme.colors.secondary.main }}></div>
        <div className="floating-shape shape-3" style={{ backgroundColor: theme.colors.primary.light }}></div>
      </div>

      <div className="hero-content">
        {/* Trust Badge */}
        <div className="trust-badge-3d">
          <span className="badge-icon">🔒</span>
          <span className="badge-text">Trusted by 150+ Families</span>
        </div>

        {/* Main Headline */}
        <h1 className="hero-headline">
          Your Family Deserves a<br />
          <span className="gradient-text" style={{
            background: `linear-gradient(90deg, ${theme.colors.primary.main}, ${theme.colors.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Family Office
          </span>
        </h1>

        {/* Subheadline */}
        <p className="hero-subheadline">
          Manage wealth, assets, and legacy across generations.<br />
          Securely in one place. Available in Telugu, Hindi & more.
        </p>

        {/* Key Benefits - 3D Cards */}
        <div className="hero-benefits">
          <div className="benefit-card-3d" style={{ borderColor: theme.colors.primary.main }}>
            <div className="benefit-icon">🛡️</div>
            <div className="benefit-text">End-to-End Encrypted</div>
          </div>
          <div className="benefit-card-3d" style={{ borderColor: theme.colors.primary.main }}>
            <div className="benefit-icon">🤖</div>
            <div className="benefit-text">AI-Powered Insights</div>
          </div>
          <div className="benefit-card-3d" style={{ borderColor: theme.colors.primary.main }}>
            <div className="benefit-icon">👨‍👩‍👧‍👦</div>
            <div className="benefit-text">Family Collaboration</div>
          </div>
        </div>

        {/* Scarcity Alert */}
        <div className="scarcity-alert-3d" style={{
          background: `linear-gradient(135deg, ${theme.colors.secondary.main}15, ${theme.colors.primary.main}15)`,
          borderColor: theme.colors.primary.main,
        }}>
          <div className="scarcity-header">
            <span className="pulse-dot" style={{ backgroundColor: theme.colors.secondary.main }}></span>
            <span className="scarcity-title">Limited Early Bird Offer</span>
          </div>
          <div className="scarcity-body">
            <div className="scarcity-stat">
              <div className="stat-number" style={{ color: theme.colors.primary.main }}>{availableSpots}</div>
              <div className="stat-label">Lifetime Spots Left</div>
            </div>
            <div className="scarcity-divider"></div>
            <div className="scarcity-offer">
              <div className="offer-discount">
                <span className="original-price">₹2,400/year</span>
                <span className="discounted-price" style={{ color: theme.colors.primary.main }}>₹1,200/year</span>
              </div>
              <div className="offer-perks">
                ✓ 50% Off Lifetime &nbsp;&nbsp; ✓ 3 Family Members Included
              </div>
            </div>
          </div>
        </div>

        {/* Dual CTA Buttons */}
        <div className="hero-cta-group">
          <button
            className="cta-primary-3d"
            style={{
              background: `linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.secondary.main})`,
              boxShadow: `0 8px 24px ${theme.colors.primary.main}40`,
            }}
          >
            <span className="cta-icon">🚀</span>
            <span className="cta-text">
              <span className="cta-main">Claim Early Bird Spot</span>
              <span className="cta-sub">Join 150 families • {availableSpots} spots left</span>
            </span>
          </button>

          <button
            className="cta-secondary-3d"
            style={{
              borderColor: theme.colors.primary.main,
              color: theme.colors.common.white,
            }}
          >
            <span className="cta-icon">📅</span>
            <span className="cta-text">
              <span className="cta-main">Join Waitlist</span>
              <span className="cta-sub">Public launch: January 2026</span>
            </span>
          </button>
        </div>

        {/* Additional Trust Line */}
        <p className="hero-trust-line">
          <span className="trust-icon">✓</span> No credit card required &nbsp;•&nbsp;
          <span className="trust-icon">✓</span> DPDPA Compliant &nbsp;•&nbsp;
          <span className="trust-icon">✓</span> Cancel anytime
        </p>
      </div>

      {/* 3D Vault Visual (CSS-based) */}
      <div className="hero-visual">
        <div className="vault-3d-container">
          {/* Main Vault */}
          <div className="vault-3d" style={{
            background: `linear-gradient(145deg, ${theme.colors.primary.dark}, ${theme.colors.secondary.dark})`,
          }}>
            <div className="vault-door">
              <div className="vault-lock" style={{ borderColor: theme.colors.primary.main }}>
                <div className="lock-inner" style={{ backgroundColor: theme.colors.primary.main }}></div>
              </div>
              <div className="vault-handle" style={{ backgroundColor: theme.colors.primary.main }}></div>
            </div>
          </div>

          {/* Floating Document Icons */}
          <div className="floating-doc doc-1" style={{ backgroundColor: theme.colors.primary.light }}>
            📄
          </div>
          <div className="floating-doc doc-2" style={{ backgroundColor: theme.colors.secondary.light }}>
            🏠
          </div>
          <div className="floating-doc doc-3" style={{ backgroundColor: theme.colors.primary.main }}>
            💰
          </div>
          <div className="floating-doc doc-4" style={{ backgroundColor: theme.colors.secondary.main }}>
            👨‍👩‍👧
          </div>
        </div>
      </div>
    </section>
  );
};

export default FamilyKnowsHero;
