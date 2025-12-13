// src/components/familyknows/TrustSignals.tsx
import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import './TrustSignals.css';

const TrustSignals: React.FC = () => {
  const { theme } = useTheme();

  const badges = [
    {
      icon: '🔐',
      title: 'End-to-End Encrypted',
      subtitle: 'Bank-grade AES-256 encryption',
      verified: true,
    },
    {
      icon: '🇮🇳',
      title: 'DPDPA Compliant',
      subtitle: 'Your data, your rights',
      verified: true,
      placeholder: true, // Mark as placeholder until certification
    },
    {
      icon: '🌐',
      title: 'Multi-Language',
      subtitle: 'Telugu, Hindi & more',
      verified: true,
    },
    {
      icon: '📱',
      title: 'Mobile-First',
      subtitle: 'Android ready',
      verified: true,
    },
  ];

  const stats = [
    {
      number: '150+',
      label: 'Families Trust Us',
      icon: '👨‍👩‍👧‍👦',
    },
    {
      number: '100%',
      label: 'Data Ownership',
      icon: '🔒',
    },
    {
      number: '24/7',
      label: 'Offline Access',
      icon: '📲',
    },
    {
      number: '5+',
      label: 'Languages',
      icon: '🗣️',
    },
  ];

  return (
    <section className="trust-signals" style={{ backgroundColor: theme.colors.background.default }}>
      <div className="trust-container">
        {/* Section Header */}
        <div className="trust-header">
          <div className="trust-badge" style={{ backgroundColor: theme.colors.primary.main }}>
            <span className="badge-icon">✓</span>
            <span>Why 150+ Families Trust FamilyKnows</span>
          </div>
          <h2 className="trust-title" style={{ color: theme.colors.text.primary }}>
            Security & Privacy First
          </h2>
          <p className="trust-subtitle" style={{ color: theme.colors.text.secondary }}>
            Your family's sensitive data deserves the highest level of protection
          </p>
        </div>

        {/* Certification Badges */}
        <div className="certification-badges">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="cert-badge-3d"
              style={{
                backgroundColor: theme.colors.background.paper,
                borderColor: badge.placeholder ? theme.colors.warning.light : theme.colors.primary.light,
              }}
            >
              {badge.verified && (
                <div
                  className="verified-checkmark"
                  style={{ backgroundColor: theme.colors.success.main }}
                >
                  ✓
                </div>
              )}
              {badge.placeholder && (
                <div className="placeholder-badge" style={{ backgroundColor: theme.colors.warning.main }}>
                  In Progress
                </div>
              )}
              <div className="cert-icon">{badge.icon}</div>
              <div className="cert-title" style={{ color: theme.colors.text.primary }}>
                {badge.title}
              </div>
              <div className="cert-subtitle" style={{ color: theme.colors.text.secondary }}>
                {badge.subtitle}
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="trust-stats">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-card-3d"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.primary.main}10, ${theme.colors.secondary.main}10)`,
              }}
            >
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-number" style={{ color: theme.colors.primary.main }}>
                {stat.number}
              </div>
              <div className="stat-label" style={{ color: theme.colors.text.secondary }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Security Features Grid */}
        <div className="security-features">
          <div className="feature-row">
            <div
              className="feature-item-3d"
              style={{
                backgroundColor: theme.colors.background.paper,
                borderColor: theme.colors.primary.light,
              }}
            >
              <div className="feature-icon-3d" style={{ backgroundColor: theme.colors.primary.main }}>
                🔐
              </div>
              <div className="feature-content">
                <h4 style={{ color: theme.colors.text.primary }}>Your Data Never Leaves Your Control</h4>
                <p style={{ color: theme.colors.text.secondary }}>
                  End-to-end encryption ensures only you and your family can access your data.
                  Even we can't see your sensitive information.
                </p>
              </div>
            </div>

            <div
              className="feature-item-3d"
              style={{
                backgroundColor: theme.colors.background.paper,
                borderColor: theme.colors.primary.light,
              }}
            >
              <div className="feature-icon-3d" style={{ backgroundColor: theme.colors.secondary.main }}>
                📴
              </div>
              <div className="feature-content">
                <h4 style={{ color: theme.colors.text.primary }}>Offline-First Architecture</h4>
                <p style={{ color: theme.colors.text.secondary }}>
                  Access your family vault anytime, anywhere - even without internet.
                  Secure sync when you're back online.
                </p>
              </div>
            </div>
          </div>

          <div className="feature-row">
            <div
              className="feature-item-3d"
              style={{
                backgroundColor: theme.colors.background.paper,
                borderColor: theme.colors.primary.light,
              }}
            >
              <div className="feature-icon-3d" style={{ backgroundColor: theme.colors.success.main }}>
                🔢
              </div>
              <div className="feature-content">
                <h4 style={{ color: theme.colors.text.primary }}>PIN-Based App Access</h4>
                <p style={{ color: theme.colors.text.secondary }}>
                  Additional layer of security with biometric authentication and PIN protection
                  for accessing your family's sensitive data.
                </p>
              </div>
            </div>

            <div
              className="feature-item-3d"
              style={{
                backgroundColor: theme.colors.background.paper,
                borderColor: theme.colors.primary.light,
              }}
            >
              <div className="feature-icon-3d" style={{ backgroundColor: theme.colors.info.main }}>
                🌐
              </div>
              <div className="feature-content">
                <h4 style={{ color: theme.colors.text.primary }}>Local Language Support</h4>
                <p style={{ color: theme.colors.text.secondary }}>
                  Family elders can use the app in Telugu, Hindi, or their preferred language.
                  Breaking the language barrier for generational wealth transfer.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Statement */}
        <div
          className="trust-statement-3d"
          style={{
            background: `linear-gradient(135deg, ${theme.colors.background.dark}, ${theme.colors.primary.dark})`,
          }}
        >
          <div className="statement-icon">🌍</div>
          <h3 style={{ color: theme.colors.common.white }}>
            Family Office for Everyone - Proudly Made in India 🇮🇳
          </h3>
          <p style={{ color: theme.colors.common.white, opacity: 0.9 }}>
            We understand multi-generational wealth, joint families, and local language needs -
            because we're builders who've lived it. Whether you're in Mumbai, Toronto, or Dubai -
            if your family manages wealth across generations and languages, FamilyKnows is for you.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrustSignals;
