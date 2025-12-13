// src/components/familyknows/MobileAppShowcase.tsx
import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import './MobileAppShowcase.css';

const MobileAppShowcase: React.FC = () => {
  const { theme } = useTheme();
  const [activeScreen, setActiveScreen] = useState(1);

  const screens = [
    { id: 0, title: 'Dashboard', description: 'Your family wealth at a glance' },
    { id: 1, title: 'Family Vault', description: 'All assets in one place' },
    { id: 2, title: 'Family Hub', description: 'Stay connected with family' },
  ];

  // Dashboard Screen Mockup
  const DashboardMockup = () => (
    <div className="mockup-screen dashboard-mockup">
      <div className="status-bar">
        <span>9:41</span>
        <div className="status-icons">📶 🔋</div>
      </div>
      <div className="mock-header">
        <div className="greeting">
          <span className="greeting-label">Good Morning,</span>
          <span className="user-name">Kamal Charan</span>
        </div>
        <div className="avatar-circle">KC</div>
      </div>
      <div className="assistant-card">
        <div className="assistant-icon">🤖</div>
        <div className="assistant-text">
          <span className="assistant-title">Hi! How can I help?</span>
          <span className="assistant-hint">Tap to ask anything...</span>
        </div>
      </div>
      <div className="section-label">Quick Actions</div>
      <div className="quick-actions">
        <div className="action-btn primary"><span>➕</span> Add</div>
        <div className="action-btn"><span>📤</span> Upload</div>
        <div className="action-btn"><span>📷</span> Scan</div>
      </div>
      <div className="section-label">Overview</div>
      <div className="overview-grid">
        <div className="overview-card">
          <div className="card-top">
            <div className="card-icon purple">📋</div>
            <div className="badge warning">2 Due</div>
          </div>
          <span className="card-label">Tasks</span>
        </div>
        <div className="overview-card">
          <div className="card-top">
            <div className="card-icon green">📦</div>
            <div className="badge error">1 Alert</div>
          </div>
          <span className="card-label">Assets</span>
        </div>
        <div className="overview-card">
          <div className="card-top">
            <div className="card-icon red">❤️</div>
          </div>
          <span className="card-label">Health</span>
        </div>
        <div className="overview-card">
          <div className="card-top">
            <div className="card-icon orange">💰</div>
            <div className="badge success">+12%</div>
          </div>
          <span className="card-label">Finance</span>
        </div>
      </div>
    </div>
  );

  // Asset Vault Screen Mockup
  const AssetVaultMockup = () => (
    <div className="mockup-screen vault-mockup">
      <div className="status-bar light">
        <span>9:41</span>
        <div className="status-icons">📶 🔋</div>
      </div>
      <div className="vault-header">
        <button className="back-btn">←</button>
        <div className="vault-title">
          <span className="title">Family Vault</span>
          <span className="subtitle">Everything in one place</span>
        </div>
        <button className="add-btn">➕</button>
      </div>
      <div className="alert-row">
        <div className="alert-chip error">⚠️ 1 Overdue</div>
        <div className="alert-chip warning">⏰ 3 Due Soon</div>
      </div>
      <div className="person-filter">
        <div className="person-chip active">👨‍👩‍👧 Everyone</div>
        <div className="person-chip">👨 Dad</div>
        <div className="person-chip">👩 Mom</div>
      </div>
      <div className="category-pills">
        <div className="cat-pill active">All</div>
        <div className="cat-pill">🛡️ Insurance</div>
        <div className="cat-pill">🚗 Vehicles</div>
      </div>
      <div className="asset-list">
        <div className="asset-card">
          <div className="asset-img purple">🛡️</div>
          <div className="asset-info">
            <span className="asset-title">HDFC Health Optima</span>
            <span className="asset-meta">Cover: ₹50L • Family</span>
            <div className="asset-status good">✓ Premium: Dec 2025</div>
          </div>
          <span className="chevron">›</span>
        </div>
        <div className="asset-card">
          <div className="asset-img orange">⚡</div>
          <div className="asset-info">
            <span className="asset-title">Luminous Inverter</span>
            <span className="asset-meta">AMC Active • Utility</span>
            <div className="asset-status critical">⚠️ Water Overdue</div>
          </div>
          <span className="chevron">›</span>
        </div>
        <div className="asset-card">
          <div className="asset-img green">🚗</div>
          <div className="asset-info">
            <span className="asset-title">Tata Safari</span>
            <span className="asset-meta">KA-01-MJ-1234</span>
            <div className="asset-status warning">⏰ Service Due</div>
          </div>
          <span className="chevron">›</span>
        </div>
      </div>
    </div>
  );

  // Family Hub Screen Mockup
  const FamilyHubMockup = () => (
    <div className="mockup-screen family-mockup">
      <div className="status-bar">
        <span>9:41</span>
        <div className="status-icons">📶 🔋</div>
      </div>
      <div className="mock-header simple">
        <span className="page-title">Family Hub</span>
      </div>
      <div className="section-label">Members (4)</div>
      <div className="family-members">
        <div className="member-card">
          <div className="member-avatar blue">KC</div>
          <div className="member-info">
            <span className="member-name">Kamal Charan</span>
            <span className="member-role">You • Admin</span>
          </div>
          <div className="member-badge owner">Owner</div>
        </div>
        <div className="member-card">
          <div className="member-avatar pink">SP</div>
          <div className="member-info">
            <span className="member-name">Sravanthi</span>
            <span className="member-role">Spouse</span>
          </div>
          <div className="member-badge">Editor</div>
        </div>
        <div className="member-card">
          <div className="member-avatar green">RK</div>
          <div className="member-info">
            <span className="member-name">Ramakrishna</span>
            <span className="member-role">Father</span>
          </div>
          <div className="member-badge">Viewer</div>
        </div>
      </div>
      <div className="section-label">Recent Activity</div>
      <div className="activity-feed">
        <div className="activity-item">
          <div className="activity-dot green"></div>
          <div className="activity-content">
            <span className="activity-text">Car insurance renewed</span>
            <span className="activity-time">2 hours ago</span>
          </div>
        </div>
        <div className="activity-item">
          <div className="activity-dot purple"></div>
          <div className="activity-content">
            <span className="activity-text">Passport uploaded</span>
            <span className="activity-time">Yesterday</span>
          </div>
        </div>
        <div className="activity-item">
          <div className="activity-dot blue"></div>
          <div className="activity-content">
            <span className="activity-text">Mom joined the vault</span>
            <span className="activity-time">2 days ago</span>
          </div>
        </div>
      </div>
      <div className="add-member-btn">➕ Invite Family Member</div>
    </div>
  );

  const renderMockup = (screenId: number) => {
    switch (screenId) {
      case 0: return <DashboardMockup />;
      case 1: return <AssetVaultMockup />;
      case 2: return <FamilyHubMockup />;
      default: return <DashboardMockup />;
    }
  };

  return (
    <section
      className="mobile-app-showcase"
      style={{
        background: `linear-gradient(180deg, ${theme.colors.background.paper} 0%, ${theme.colors.background.default} 100%)`,
      }}
    >
      <div className="showcase-container">
        <div className="showcase-header">
          <h2 className="showcase-title" style={{ color: theme.colors.text.primary }}>
            Beautiful, Intuitive, Secure
          </h2>
          <p className="showcase-subtitle" style={{ color: theme.colors.text.secondary }}>
            Designed for families, built with love - available on Android
          </p>
        </div>

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
                <div className="phone-frame">
                  <div className="phone-notch" />
                  <div className="phone-screen">
                    {renderMockup(screen.id)}
                  </div>
                  <div className="home-indicator" />
                </div>
              </div>
            );
          })}
        </div>

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
