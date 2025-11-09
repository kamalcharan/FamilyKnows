// src/components/familyknows/FamilyCentricSection.tsx
import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import './FamilyCentricSection.css';

const FamilyCentricSection: React.FC = () => {
  const { theme } = useTheme();

  return (
    <section
      className="family-centric-section"
      style={{
        background: `linear-gradient(135deg, ${theme.colors.primary.main}10, ${theme.colors.secondary.main}10)`,
      }}
    >
      <div className="family-centric-container">
        {/* Header */}
        <div className="family-centric-header">
          <h2 className="section-title" style={{ color: theme.colors.text.primary }}>
            Not Just Another Family Office
          </h2>
          <p className="section-subtitle" style={{ color: theme.colors.text.secondary }}>
            Traditional family offices focus on funds. We focus on families.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="comparison-grid">
          {/* Traditional Family Offices */}
          <div
            className="comparison-card traditional"
            style={{
              backgroundColor: theme.colors.background.paper,
              borderColor: theme.colors.error.light,
            }}
          >
            <div className="card-icon" style={{ color: theme.colors.error.main }}>
              💼
            </div>
            <h3 style={{ color: theme.colors.text.primary }}>
              Traditional Family Offices
            </h3>
            <p className="card-label" style={{ color: theme.colors.error.main }}>
              Fund-Centric
            </p>
            <ul className="feature-list">
              <li style={{ color: theme.colors.text.secondary }}>
                <span className="icon">❌</span>
                <span>Only for ultra-wealthy (₹100Cr+ assets)</span>
              </li>
              <li style={{ color: theme.colors.text.secondary }}>
                <span className="icon">❌</span>
                <span>Focus on investment portfolios</span>
              </li>
              <li style={{ color: theme.colors.text.secondary }}>
                <span className="icon">❌</span>
                <span>Expensive (₹50L-1Cr annually)</span>
              </li>
              <li style={{ color: theme.colors.text.secondary }}>
                <span className="icon">❌</span>
                <span>Complex legal structures</span>
              </li>
              <li style={{ color: theme.colors.text.secondary }}>
                <span className="icon">❌</span>
                <span>English-only communication</span>
              </li>
            </ul>
          </div>

          {/* Arrow */}
          <div className="vs-divider">
            <div
              className="vs-circle"
              style={{
                backgroundColor: theme.colors.primary.main,
                color: theme.colors.common.white,
              }}
            >
              VS
            </div>
          </div>

          {/* FamilyKnows */}
          <div
            className="comparison-card familyknows"
            style={{
              backgroundColor: theme.colors.background.paper,
              borderColor: theme.colors.success.main,
              boxShadow: `0 8px 24px ${theme.colors.primary.main}20`,
            }}
          >
            <div className="card-icon" style={{ color: theme.colors.success.main }}>
              👨‍👩‍👧‍👦
            </div>
            <h3 style={{ color: theme.colors.text.primary }}>
              FamilyKnows
            </h3>
            <p className="card-label" style={{ color: theme.colors.success.main }}>
              Family-Centric
            </p>
            <ul className="feature-list">
              <li style={{ color: theme.colors.text.secondary }}>
                <span className="icon" style={{ color: theme.colors.success.main }}>✓</span>
                <span>For every family (any asset size)</span>
              </li>
              <li style={{ color: theme.colors.text.secondary }}>
                <span className="icon" style={{ color: theme.colors.success.main }}>✓</span>
                <span>Focus on family coordination & legacy</span>
              </li>
              <li style={{ color: theme.colors.text.secondary }}>
                <span className="icon" style={{ color: theme.colors.success.main }}>✓</span>
                <span>Affordable (₹1,200/year)</span>
              </li>
              <li style={{ color: theme.colors.text.secondary }}>
                <span className="icon" style={{ color: theme.colors.success.main }}>✓</span>
                <span>Simple, intuitive app</span>
              </li>
              <li style={{ color: theme.colors.text.secondary }}>
                <span className="icon" style={{ color: theme.colors.success.main }}>✓</span>
                <span>Telugu, Hindi, English support</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Key Differentiators */}
        <div className="key-differentiators">
          <div
            className="differentiator-card"
            style={{
              backgroundColor: theme.colors.background.paper,
              borderColor: theme.colors.primary.main,
            }}
          >
            <div className="diff-icon" style={{ color: theme.colors.primary.main }}>
              📋
            </div>
            <h4 style={{ color: theme.colors.text.primary }}>
              Legacy Planning Made Simple
            </h4>
            <p style={{ color: theme.colors.text.secondary }}>
              Unlike fund management, we help you organize everything digitally - the "In Case of Death"
              folder, asset documents, insurance policies - so your family knows exactly where everything
              is when they need it most.
            </p>
          </div>

          <div
            className="differentiator-card"
            style={{
              backgroundColor: theme.colors.background.paper,
              borderColor: theme.colors.secondary.main,
            }}
          >
            <div className="diff-icon" style={{ color: theme.colors.secondary.main }}>
              🤝
            </div>
            <h4 style={{ color: theme.colors.text.primary }}>
              Family Collaboration First
            </h4>
            <p style={{ color: theme.colors.text.secondary }}>
              Not just asset tracking - we enable real family collaboration. Parents, kids, siblings
              all stay aligned on property, documents, insurance, and shared responsibilities.
            </p>
          </div>

          <div
            className="differentiator-card"
            style={{
              backgroundColor: theme.colors.background.paper,
              borderColor: theme.colors.success.main,
            }}
          >
            <div className="diff-icon" style={{ color: theme.colors.success.main }}>
              🌱
            </div>
            <h4 style={{ color: theme.colors.text.primary }}>
              Generational Wealth Transfer
            </h4>
            <p style={{ color: theme.colors.text.secondary }}>
              Beyond investments - we help transfer knowledge, values, and responsibilities across
              generations. Elders document in their language, kids access in theirs.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="family-centric-cta">
          <p style={{ color: theme.colors.text.primary, fontSize: '1.25rem', fontWeight: 600 }}>
            Every family deserves a family office - not just the wealthy
          </p>
          <button
            className="cta-button"
            style={{
              background: `linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.secondary.main})`,
            }}
          >
            Start Your Family's Journey
          </button>
        </div>
      </div>
    </section>
  );
};

export default FamilyCentricSection;
