// src/components/familyknows/MobileAppShowcase.tsx
import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import './MobileAppShowcase.css';
import { DashboardMockup, OrbitMockup, StoryMockup } from './AppScreenMockups';

const MobileAppShowcase: React.FC = () => {
  const { theme } = useTheme();
  const [activeScreen, setActiveScreen] = useState(1);

  // REAL APP SCREENS - Award-Winning UI
  const screens = [
    {
      id: 0,
      title: 'Story Onboarding',
      description: 'Build your legacy visually',
      component: <StoryMockup />,
      color: '#0F172A',
    },
    {
      id: 1,
      title: 'Fluid Dashboard',
      description: 'AI Command Center',
      component: <DashboardMockup />,
      color: '#F1F5F9',
    },
    {
      id: 2,
      title: 'Circle of Trust',
      description: 'Visualize your network',
      component: <OrbitMockup />,
      color: '#0F172A',
    },
  ];

  return (
    <section
      className="mobile-app-showcase"
      style={{
        background: `linear-gradient(180deg, ${theme.colors.background.paper} 0%, ${theme.colors.background.default} 100%)`,
      }}
    >
      <div className="showcase-container">
        {/* Header */}
        <div className="showcase-header">
          <h2 className="showcase-title" style={{ color: theme.colors.text.primary }}>
            Experience the "Vault"
          </h2>
          <p className="showcase-subtitle" style={{ color: theme.colors.text.secondary }}>
            Fluid animations, holographic widgets, and secure by design.
          </p>
        </div>

        {/* 3D Phone Carousel */}
        <div className="phone-carousel-3d">
          {screens.map((screen, index) => {
            const position = index - activeScreen;
            const isActive = index === activeScreen;

            return (
              <div
                key={screen.id}
                className={`phone-3d ${isActive ? 'active' : ''}`}
                style={{
                  transform: `
                    translateX(${position * 350}px)
                    translateZ(${isActive ? '0' : '-200px'})
                    rotateY(${position * 45}deg)
                    scale(${isActive ? 1 : 0.85})
                  `,
                  opacity: isActive ? 1 : 0.5,
                  zIndex: isActive ? 10 : 1,
                  cursor: 'pointer',
                }}
                onClick={() => setActiveScreen(index)}
              >
                {/* Phone Frame */}
                <div
                  className="phone-frame"
                  style={{
                    background: `linear-gradient(145deg, #1e293b, #0f172a)`,
                    borderColor: '#334155',
                    boxShadow: isActive
                      ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                      : '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  {/* Notch */}
                  <div className="phone-notch" style={{ backgroundColor: '#0f172a' }} />

                  {/* Screen Content - Render the Mockup Component */}
                  <div className="phone-screen" style={{ backgroundColor: screen.color }}>
                    {screen.component}
                  </div>

                  {/* Home Indicator */}
                  <div
                    className="home-indicator"
                    style={{ backgroundColor: isActive ? '#fff' : '#666' }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Screen Navigation */}
        <div className="screen-nav">
          {screens.map((screen, index) => (
            <button
              key={screen.id}
              className={`screen-nav-item ${activeScreen === index ? 'active' : ''}`}
              onClick={() => setActiveScreen(index)}
              style={{
                borderColor: activeScreen === index ? theme.colors.primary.main : 'transparent',
                color: activeScreen === index ? theme.colors.primary.main : theme.colors.text.secondary,
                backgroundColor: activeScreen === index ? `${theme.colors.primary.main}10` : 'transparent',
              }}
            >
              {screen.title}
            </button>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="feature-highlights" style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
          }}>
            {[
              { icon: '🎭', text: 'Fluid Morph Transitions' },
              { icon: '🔮', text: 'Holographic Widgets' },
              { icon: '🌳', text: 'Story-Driven Onboarding' },
              { icon: '🔒', text: 'Bank-Grade Security' },
            ].map((feature, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: `${theme.colors.background.dark}08`,
                  borderRadius: '100px',
                  border: `1px solid ${theme.colors.text.disabled}30`,
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>{feature.icon}</span>
                <span style={{ fontSize: '0.875rem', color: theme.colors.text.secondary }}>
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Download Section */}
        <div className="download-section">
          <h3 className="download-title" style={{ color: theme.colors.text.primary }}>
            Coming Soon to Your Device
          </h3>
          <div className="download-buttons">
            <button
              className="store-button"
              style={{
                backgroundColor: theme.colors.background.dark,
                color: theme.colors.common.white,
              }}
            >
              <span className="store-icon">🍎</span>
              <div className="store-text">
                <div className="store-label">Download on the</div>
                <div className="store-name">App Store</div>
              </div>
            </button>
            <button
              className="store-button"
              style={{
                backgroundColor: theme.colors.background.dark,
                color: theme.colors.common.white,
              }}
            >
              <span className="store-icon">🤖</span>
              <div className="store-text">
                <div className="store-label">Get it on</div>
                <div className="store-name">Google Play</div>
              </div>
            </button>
          </div>
          <p className="download-note" style={{ color: theme.colors.text.secondary }}>
            Join the waitlist for early access • Launching January 2026
          </p>
        </div>
      </div>
    </section>
  );
};

export default MobileAppShowcase;
