// src/components/familyknows/MobileAppShowcase.tsx
import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import './MobileAppShowcase.css';

const MobileAppShowcase: React.FC = () => {
  const { theme } = useTheme();
  const [activeScreen, setActiveScreen] = useState(1);

  // Placeholder screens - replace with actual app screenshots
  const screens = [
    {
      id: 0,
      title: 'Dashboard',
      description: 'Your family wealth at a glance',
      color: theme.colors.primary.main,
    },
    {
      id: 1,
      title: 'Asset Vault',
      description: 'Secure storage for all documents',
      color: theme.colors.secondary.main,
    },
    {
      id: 2,
      title: 'Family Timeline',
      description: 'Stay updated with family activities',
      color: theme.colors.success.main,
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
            Beautiful, Intuitive, Secure
          </h2>
          <p className="showcase-subtitle" style={{ color: theme.colors.text.secondary }}>
            Designed for families, built with love - available on iOS & Android
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
                    scale(${isActive ? 1 : 0.8})
                  `,
                  opacity: isActive ? 1 : 0.4,
                  zIndex: isActive ? 10 : 1,
                }}
                onClick={() => setActiveScreen(index)}
              >
                {/* Phone Frame */}
                <div
                  className="phone-frame"
                  style={{
                    background: `linear-gradient(145deg, ${theme.colors.background.dark}, ${theme.colors.primary.dark})`,
                  }}
                >
                  {/* Notch */}
                  <div className="phone-notch" style={{ backgroundColor: theme.colors.background.dark }} />

                  {/* Screen Content */}
                  <div
                    className="phone-screen"
                    style={{ backgroundColor: screen.color }}
                  >
                    {/* Placeholder Screen */}
                    <div className="screen-content">
                      <div className="screen-placeholder">
                        <div className="screen-icon">📱</div>
                        <div className="screen-text" style={{ color: theme.colors.common.white }}>
                          {screen.title}
                        </div>
                        <div className="screen-subtext" style={{ color: theme.colors.common.white }}>
                          {screen.description}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Home Indicator */}
                  <div className="home-indicator" style={{ backgroundColor: theme.colors.common.white }} />
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
                borderColor: activeScreen === index ? theme.colors.primary.main : theme.colors.text.disabled,
                color: activeScreen === index ? theme.colors.primary.main : theme.colors.text.secondary,
              }}
            >
              {screen.title}
            </button>
          ))}
        </div>

        {/* Download Buttons */}
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
