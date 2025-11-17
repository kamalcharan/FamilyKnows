// src/components/familyknows/FamilyKnowsFooter.tsx
import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import './FamilyKnowsFooter.css';

const FamilyKnowsFooter: React.FC = () => {
  const { theme } = useTheme();

  return (
    <footer
      className="familyknows-footer"
      style={{
        backgroundColor: theme.colors.background.dark,
        color: theme.colors.common.white,
      }}
    >
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section brand-section">
            <div className="footer-logo">
              <span className="logo-icon">🏠</span>
              <span className="logo-text">FamilyKnows</span>
            </div>
            <p className="footer-tagline">
              Your Family Office App - Secure, Private, and Built for Families Worldwide
            </p>
            <div className="footer-badges">
              <span className="badge">🔐 End-to-End Encrypted</span>
              <span className="badge">🇮🇳 DPDPA Compliant</span>
              <span className="badge">🌐 Multi-Language</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-heading">Product</h4>
            <ul className="footer-links">
              <li><a href="#features">Features</a></li>
              <li><a href="#security">Security</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#languages">Languages</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer-section">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              <li><a href="#about">About Us</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#press">Press</a></li>
              <li><a href="#careers">Careers</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-section">
            <h4 className="footer-heading">Resources</h4>
            <ul className="footer-links">
              <li><a href="#help">Help Center</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          {/* Newsletter/CTA */}
          <div className="footer-section cta-section">
            <h4 className="footer-heading">Stay Updated</h4>
            <p className="footer-text">Get early access and updates</p>
            <div className="footer-cta">
              <input
                type="email"
                placeholder="Enter your email"
                className="footer-input"
                style={{
                  borderColor: theme.colors.primary.main,
                }}
              />
              <button
                className="footer-button"
                style={{
                  backgroundColor: theme.colors.primary.main,
                }}
              >
                Join Waitlist
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              © {new Date().getFullYear()} FamilyKnows. All rights reserved.
            </div>
            <div className="footer-social">
              <a href="#twitter" aria-label="Twitter">𝕏</a>
              <a href="#linkedin" aria-label="LinkedIn">in</a>
              <a href="#facebook" aria-label="Facebook">f</a>
              <a href="#instagram" aria-label="Instagram">📷</a>
            </div>
            <div className="footer-legal">
              <span>Made in India 🇮🇳</span>
              <span>•</span>
              <span>With ❤️ for Families</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FamilyKnowsFooter;
