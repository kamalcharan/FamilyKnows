// src/components/familyknows/EarlyAdopterSection.tsx
import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import WaitlistModal from './WaitlistModal';
import { WaitlistPlanType } from '../../lib/supabase';
import './EarlyAdopterSection.css';

const EarlyAdopterSection: React.FC = () => {
  const { theme } = useTheme();
  const [spotsLeft] = useState(100);
  const [selectedPlan, setSelectedPlan] = useState<'earlybird' | 'waitlist'>('earlybird');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPlanType, setModalPlanType] = useState<WaitlistPlanType>('earlybird');
  const [modalSource, setModalSource] = useState('earlybird-card');

  const openModal = (planType: WaitlistPlanType, source: string) => {
    setModalPlanType(planType);
    setModalSource(source);
    setIsModalOpen(true);
  };

  const features = [
    {
      category: 'Security & Privacy',
      icon: '🔐',
      items: [
        { icon: '✓', text: 'End-to-end encryption (AES-256)' },
        { icon: '✓', text: 'Offline-first architecture' },
        { icon: '✓', text: 'PIN + Biometric protection' },
        { icon: '✓', text: 'Your data never leaves your control' },
      ],
    },
    {
      category: 'Family Collaboration',
      icon: '👨‍👩‍👧‍👦',
      items: [
        { icon: '✓', text: 'Share with up to 3 family members' },
        { icon: '✓', text: 'Granular permission controls' },
        { icon: '✓', text: 'Secure document sharing' },
        { icon: '✓', text: 'Family timeline & updates' },
      ],
    },
    {
      category: 'AI-Powered Insights',
      icon: '🤖',
      items: [
        { icon: '✓', text: 'Asset value tracking & alerts' },
        { icon: '✓', text: 'Smart expense categorization' },
        { icon: '✓', text: 'Document expiry reminders' },
        { icon: '✓', text: 'Wealth growth recommendations' },
      ],
    },
    {
      category: 'Multi-Language Support',
      icon: '🌐',
      items: [
        { icon: '✓', text: 'Telugu, Hindi, English & more' },
        { icon: '✓', text: 'Voice input in local languages' },
        { icon: '✓', text: 'Transliteration support' },
        { icon: '✓', text: 'Cultural date formats' },
      ],
    },
  ];

  return (
    <>
      <section
        className="early-adopter-section"
        style={{
          background: `linear-gradient(180deg, ${theme.colors.background.default} 0%, ${theme.colors.background.paper} 100%)`,
        }}
      >
        <div className="early-adopter-container">
          {/* Section Header */}
          <div className="section-header">
            <div className="urgency-badge" style={{ backgroundColor: theme.colors.error.main }}>
              <span className="pulse-dot"></span>
              <span>Limited Time Offer</span>
            </div>
            <h2 className="section-title" style={{ color: theme.colors.text.primary }}>
              Become a Founding Member
            </h2>
            <p className="section-subtitle" style={{ color: theme.colors.text.secondary }}>
              Join 150 families who are already securing their legacy with FamilyKnows
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="pricing-container">
            {/* Early Bird Plan */}
            <div
              className={`pricing-card-3d ${selectedPlan === 'earlybird' ? 'selected' : ''}`}
              onClick={() => setSelectedPlan('earlybird')}
              style={{
                backgroundColor: theme.colors.background.paper,
                borderColor: selectedPlan === 'earlybird' ? theme.colors.primary.main : theme.colors.text.disabled,
              }}
            >
              <div className="card-badge" style={{ backgroundColor: theme.colors.secondary.main }}>
                🔥 Best Value
              </div>

              <div className="card-header">
                <div className="card-icon" style={{ color: theme.colors.primary.main }}>
                  🚀
                </div>
                <h3 className="card-title" style={{ color: theme.colors.text.primary }}>
                  Early Bird Lifetime
                </h3>
                <p className="card-subtitle" style={{ color: theme.colors.text.secondary }}>
                  Only {spotsLeft} spots remaining
                </p>
              </div>

              <div className="card-pricing">
                <div className="price-original" style={{ color: theme.colors.text.disabled }}>
                  ₹2,400/year
                </div>
                <div className="price-current" style={{ color: theme.colors.primary.main }}>
                  ₹1,200
                  <span className="price-period">/year</span>
                </div>
                <div className="price-savings" style={{ color: theme.colors.success.main }}>
                  Save 50% forever
                </div>
              </div>

              <div className="card-perks">
                <div className="perk-item" style={{ color: theme.colors.text.primary }}>
                  <span className="perk-icon" style={{ color: theme.colors.success.main }}>✓</span>
                  <span>50% off lifetime</span>
                </div>
                <div className="perk-item" style={{ color: theme.colors.text.primary }}>
                  <span className="perk-icon" style={{ color: theme.colors.success.main }}>✓</span>
                  <span>3 family members included</span>
                </div>
                <div className="perk-item" style={{ color: theme.colors.text.primary }}>
                  <span className="perk-icon" style={{ color: theme.colors.success.main }}>✓</span>
                  <span>Priority support</span>
                </div>
                <div className="perk-item" style={{ color: theme.colors.text.primary }}>
                  <span className="perk-icon" style={{ color: theme.colors.success.main }}>✓</span>
                  <span>Early access to new features</span>
                </div>
                <div className="perk-item" style={{ color: theme.colors.text.primary }}>
                  <span className="perk-icon" style={{ color: theme.colors.success.main }}>✓</span>
                  <span>Founder's badge</span>
                </div>
              </div>

              <button
                className="card-cta"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal('earlybird', 'earlybird-card');
                }}
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.secondary.main})`,
                  boxShadow: `0 8px 24px ${theme.colors.primary.main}40`,
                }}
              >
                Claim Early Bird Spot
              </button>
            </div>

            {/* Waitlist Plan */}
            <div
              className={`pricing-card-3d ${selectedPlan === 'waitlist' ? 'selected' : ''}`}
              onClick={() => setSelectedPlan('waitlist')}
              style={{
                backgroundColor: theme.colors.background.paper,
                borderColor: selectedPlan === 'waitlist' ? theme.colors.primary.main : theme.colors.text.disabled,
              }}
            >
              <div className="card-header">
                <div className="card-icon" style={{ color: theme.colors.primary.main }}>
                  📅
                </div>
                <h3 className="card-title" style={{ color: theme.colors.text.primary }}>
                  Join Waitlist
                </h3>
                <p className="card-subtitle" style={{ color: theme.colors.text.secondary }}>
                  Public launch: January 2026
                </p>
              </div>

              <div className="card-pricing">
                <div className="price-current" style={{ color: theme.colors.text.primary }}>
                  ₹2,400
                  <span className="price-period">/year</span>
                </div>
                <div className="price-note" style={{ color: theme.colors.text.secondary }}>
                  Regular pricing at launch
                </div>
              </div>

              <div className="card-perks">
                <div className="perk-item" style={{ color: theme.colors.text.primary }}>
                  <span className="perk-icon" style={{ color: theme.colors.success.main }}>✓</span>
                  <span>2 family members included</span>
                </div>
                <div className="perk-item" style={{ color: theme.colors.text.primary }}>
                  <span className="perk-icon" style={{ color: theme.colors.success.main }}>✓</span>
                  <span>Standard support</span>
                </div>
                <div className="perk-item" style={{ color: theme.colors.text.primary }}>
                  <span className="perk-icon" style={{ color: theme.colors.success.main }}>✓</span>
                  <span>Launch notification</span>
                </div>
                <div className="perk-item" style={{ color: theme.colors.text.primary }}>
                  <span className="perk-icon" style={{ color: theme.colors.success.main }}>✓</span>
                  <span>All core features</span>
                </div>
              </div>

              <button
                className="card-cta card-cta-secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal('waitlist', 'waitlist-card');
                }}
                style={{
                  backgroundColor: 'transparent',
                  color: theme.colors.primary.main,
                  border: `2px solid ${theme.colors.primary.main}`,
                }}
              >
                Join Waitlist
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="features-showcase">
            <h3 className="features-title" style={{ color: theme.colors.text.primary }}>
              Everything You Need in One App
            </h3>
            <p className="features-subtitle" style={{ color: theme.colors.text.secondary }}>
              Built for Indian families, by Indian founders who understand your needs
            </p>

            <div className="features-grid">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="feature-card-3d"
                  style={{
                    backgroundColor: theme.colors.background.paper,
                    borderColor: theme.colors.primary.light,
                  }}
                >
                  <div className="feature-header">
                    <div className="feature-icon-large" style={{ color: theme.colors.primary.main }}>
                      {feature.icon}
                    </div>
                    <h4 className="feature-category" style={{ color: theme.colors.text.primary }}>
                      {feature.category}
                    </h4>
                  </div>
                  <ul className="feature-list">
                    {feature.items.map((item, idx) => (
                      <li key={idx} className="feature-list-item" style={{ color: theme.colors.text.secondary }}>
                        <span className="list-icon" style={{ color: theme.colors.success.main }}>
                          {item.icon}
                        </span>
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="final-cta-section">
            <div
              className="final-cta-card"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.background.dark}, ${theme.colors.primary.dark})`,
              }}
            >
              <h3 style={{ color: theme.colors.common.white }}>
                Secure Your Family's Future Today
              </h3>
              <p style={{ color: theme.colors.common.white, opacity: 0.95 }}>
                {spotsLeft} early bird spots remaining • Offer expires when spots are filled
              </p>
              <button
                className="final-cta-button"
                onClick={() => openModal('earlybird', 'final-cta')}
                style={{
                  backgroundColor: theme.colors.common.white,
                  color: theme.colors.primary.main,
                }}
              >
                <span className="cta-icon">🚀</span>
                <span>Get Started - 50% Off Lifetime</span>
              </button>
              <p className="cta-note" style={{ color: theme.colors.common.white, opacity: 0.8 }}>
                No credit card required • Cancel anytime • DPDPA Compliant
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Modal */}
      <WaitlistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        planType={modalPlanType}
        source={modalSource}
      />
    </>
  );
};

export default EarlyAdopterSection;
