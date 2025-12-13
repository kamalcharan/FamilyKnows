// src/components/familyknows/WaitlistModal.tsx
import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import Modal from './Modal';
import { submitWaitlist, WaitlistPlanType } from '../../lib/supabase';
import './WaitlistModal.css';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  planType: WaitlistPlanType;
  source: string;
}

type FormState = 'idle' | 'submitting' | 'success' | 'error';

const WaitlistModal: React.FC<WaitlistModalProps> = ({
  isOpen,
  onClose,
  planType,
  source,
}) => {
  const { theme } = useTheme();
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isExisting, setIsExisting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const isEarlyBird = planType === 'earlybird';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.email) {
      setErrorMessage('Please enter your email address');
      setFormState('error');
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrorMessage('Please enter a valid email address');
      setFormState('error');
      return;
    }

    setFormState('submitting');
    setErrorMessage('');

    const result = await submitWaitlist({
      email: formData.email,
      name: formData.name || undefined,
      phone: formData.phone || undefined,
      plan_type: planType,
      source: source,
    });

    if (result.success) {
      setIsExisting(result.isExisting || false);
      setFormState('success');
    } else {
      setErrorMessage(result.error || 'Something went wrong. Please try again.');
      setFormState('error');
    }
  };

  const handleClose = () => {
    // Reset form state when closing
    setFormState('idle');
    setFormData({ name: '', email: '', phone: '' });
    setErrorMessage('');
    setIsExisting(false);
    onClose();
  };

  // Success view
  if (formState === 'success') {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} size="medium">
        <div className="waitlist-success">
          <div className="success-icon">🎉</div>
          <h2 style={{ color: theme.colors.text.primary }}>
            {isExisting ? "You're Already on the List!" : "You're In!"}
          </h2>
          <p style={{ color: theme.colors.text.secondary }}>
            {isExisting
              ? "We already have your email on our waitlist. We'll notify you as soon as we launch!"
              : isEarlyBird
              ? "Welcome to the FamilyKnows founding member family! You've secured your early bird spot with 50% off lifetime."
              : "You've been added to our waitlist. We'll notify you when we launch in January 2026!"}
          </p>
          <div className="success-details" style={{ backgroundColor: theme.colors.background.default }}>
            <div className="detail-item">
              <span className="detail-icon">📧</span>
              <span style={{ color: theme.colors.text.secondary }}>Check your inbox for confirmation</span>
            </div>
            {isEarlyBird && !isExisting && (
              <div className="detail-item">
                <span className="detail-icon">🏷️</span>
                <span style={{ color: theme.colors.text.secondary }}>50% lifetime discount locked in</span>
              </div>
            )}
            <div className="detail-item">
              <span className="detail-icon">🚀</span>
              <span style={{ color: theme.colors.text.secondary }}>Launch: January 2026</span>
            </div>
          </div>
          <button
            className="waitlist-button"
            onClick={handleClose}
            style={{
              background: `linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.secondary.main})`,
            }}
          >
            Done
          </button>
        </div>
      </Modal>
    );
  }

  // Form view
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="medium"
      title={isEarlyBird ? '🚀 Claim Your Early Bird Spot' : '📅 Join the Waitlist'}
      subtitle={
        isEarlyBird
          ? 'Lock in 50% off lifetime + 3 family members included'
          : 'Be the first to know when FamilyKnows launches'
      }
    >
      <form onSubmit={handleSubmit} className="waitlist-form">
        {/* Early Bird Benefits */}
        {isEarlyBird && (
          <div
            className="earlybird-benefits"
            style={{
              background: `linear-gradient(135deg, ${theme.colors.primary.main}10, ${theme.colors.secondary.main}10)`,
              borderColor: theme.colors.primary.main,
            }}
          >
            <div className="benefit-item">
              <span className="benefit-icon" style={{ color: theme.colors.success.main }}>✓</span>
              <span style={{ color: theme.colors.text.primary }}>50% off forever (₹1,200/year instead of ₹2,400)</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon" style={{ color: theme.colors.success.main }}>✓</span>
              <span style={{ color: theme.colors.text.primary }}>3 family members included (vs 2)</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon" style={{ color: theme.colors.success.main }}>✓</span>
              <span style={{ color: theme.colors.text.primary }}>Priority support + Founder's badge</span>
            </div>
          </div>
        )}

        {/* Form Fields */}
        <div className="form-group">
          <label htmlFor="name" style={{ color: theme.colors.text.secondary }}>
            Name <span className="optional">(optional)</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Your name"
            className="form-input"
            style={{
              backgroundColor: theme.colors.background.default,
              borderColor: theme.colors.text.disabled,
              color: theme.colors.text.primary,
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" style={{ color: theme.colors.text.secondary }}>
            Email <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your.email@example.com"
            required
            className="form-input"
            style={{
              backgroundColor: theme.colors.background.default,
              borderColor: formState === 'error' ? theme.colors.error.main : theme.colors.text.disabled,
              color: theme.colors.text.primary,
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone" style={{ color: theme.colors.text.secondary }}>
            Phone <span className="optional">(optional)</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+91 98765 43210"
            className="form-input"
            style={{
              backgroundColor: theme.colors.background.default,
              borderColor: theme.colors.text.disabled,
              color: theme.colors.text.primary,
            }}
          />
        </div>

        {/* Error Message */}
        {formState === 'error' && (
          <div className="form-error" style={{ color: theme.colors.error.main }}>
            {errorMessage}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="waitlist-button"
          disabled={formState === 'submitting'}
          style={{
            background:
              formState === 'submitting'
                ? theme.colors.text.disabled
                : `linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.secondary.main})`,
            cursor: formState === 'submitting' ? 'not-allowed' : 'pointer',
          }}
        >
          {formState === 'submitting' ? (
            <span className="button-loading">
              <span className="spinner"></span>
              Processing...
            </span>
          ) : isEarlyBird ? (
            'Claim My Spot'
          ) : (
            'Join Waitlist'
          )}
        </button>

        {/* Privacy Note */}
        <p className="privacy-note" style={{ color: theme.colors.text.disabled }}>
          🔒 We respect your privacy. No spam, ever. Unsubscribe anytime.
        </p>
      </form>
    </Modal>
  );
};

export default WaitlistModal;
