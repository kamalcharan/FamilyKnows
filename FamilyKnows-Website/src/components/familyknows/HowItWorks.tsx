// src/components/familyknows/HowItWorks.tsx
import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import './HowItWorks.css';

const HowItWorks: React.FC = () => {
  const { theme } = useTheme();

  const steps = [
    {
      number: 1,
      title: 'Download & Setup',
      description: 'Install FamilyKnows on Android. Set up your secure vault with PIN protection and end-to-end encryption.',
      icon: '📱',
      features: ['5-minute setup', 'Biometric security', 'Offline access'],
    },
    {
      number: 2,
      title: 'Add Your Family Assets',
      description: 'Organize property, investments, documents, insurance, and digital assets in one secure place. Add photos, notes, and reminders.',
      icon: '📊',
      features: ['Smart categorization', 'Document scanner', 'AI tagging'],
    },
    {
      number: 3,
      title: 'Invite & Collaborate',
      description: 'Share with family members with granular permissions. Everyone stays updated, informed, and aligned on family wealth.',
      icon: '👨‍👩‍👧‍👦',
      features: ['Permission controls', 'Activity timeline', 'Secure messaging'],
    },
  ];

  return (
    <section className="how-it-works" style={{ backgroundColor: theme.colors.background.paper }}>
      <div className="how-it-works-container">
        {/* Header */}
        <div className="how-header">
          <h2 className="how-title" style={{ color: theme.colors.text.primary }}>
            Get Started in 3 Simple Steps
          </h2>
          <p className="how-subtitle" style={{ color: theme.colors.text.secondary }}>
            From setup to family collaboration in under 15 minutes
          </p>
        </div>

        {/* Steps */}
        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={step.number} className="step-card-3d">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div
                  className="step-connector"
                  style={{ backgroundColor: theme.colors.primary.main }}
                />
              )}

              {/* Step Number */}
              <div
                className="step-number-circle"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.secondary.main})`,
                }}
              >
                <span className="step-number">{step.number}</span>
              </div>

              {/* Step Icon */}
              <div className="step-icon-large">{step.icon}</div>

              {/* Step Content */}
              <h3 className="step-title" style={{ color: theme.colors.text.primary }}>
                {step.title}
              </h3>
              <p className="step-description" style={{ color: theme.colors.text.secondary }}>
                {step.description}
              </p>

              {/* Features */}
              <ul className="step-features">
                {step.features.map((feature, idx) => (
                  <li key={idx} style={{ color: theme.colors.text.secondary }}>
                    <span className="feature-check" style={{ color: theme.colors.success.main }}>
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="how-cta">
          <button
            className="how-cta-button"
            style={{
              background: `linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.secondary.main})`,
            }}
          >
            <span>Start Your Family Office Journey</span>
            <span className="cta-arrow">→</span>
          </button>
          <p className="how-cta-note" style={{ color: theme.colors.text.secondary }}>
            Join 150 families already using FamilyKnows
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
