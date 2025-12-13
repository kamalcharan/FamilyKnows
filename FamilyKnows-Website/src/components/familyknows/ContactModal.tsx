// src/components/familyknows/ContactModal.tsx
import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import Modal from './Modal';
import { submitContact } from '../../lib/supabase';
import './ContactModal.css';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormState = 'idle' | 'submitting' | 'success' | 'error';

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      setErrorMessage('Please enter your name');
      setFormState('error');
      return;
    }

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

    if (!formData.message.trim()) {
      setErrorMessage('Please enter your message');
      setFormState('error');
      return;
    }

    setFormState('submitting');
    setErrorMessage('');

    const result = await submitContact({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      subject: formData.subject || undefined,
      message: formData.message,
    });

    if (result.success) {
      setFormState('success');
    } else {
      setErrorMessage(result.error || 'Something went wrong. Please try again.');
      setFormState('error');
    }
  };

  const handleClose = () => {
    setFormState('idle');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setErrorMessage('');
    onClose();
  };

  // Success view
  if (formState === 'success') {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} size="medium">
        <div className="contact-success">
          <div className="success-icon">✉️</div>
          <h2 style={{ color: theme.colors.text.primary }}>Message Sent!</h2>
          <p style={{ color: theme.colors.text.secondary }}>
            Thank you for reaching out. We've received your message and will get back to you within
            24-48 hours.
          </p>
          <div
            className="success-info"
            style={{ backgroundColor: theme.colors.background.default }}
          >
            <p style={{ color: theme.colors.text.secondary }}>
              📧 A confirmation has been sent to <strong>{formData.email}</strong>
            </p>
          </div>
          <button
            className="contact-button"
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
      title="📬 Contact Us"
      subtitle="Have questions? We'd love to hear from you!"
    >
      <form onSubmit={handleSubmit} className="contact-form">
        {/* Contact Info */}
        <div
          className="contact-info"
          style={{
            backgroundColor: theme.colors.background.default,
            borderColor: theme.colors.primary.light,
          }}
        >
          <div className="info-item">
            <span className="info-icon">📧</span>
            <span style={{ color: theme.colors.text.secondary }}>support@familyknows.com</span>
          </div>
          <div className="info-item">
            <span className="info-icon">⏰</span>
            <span style={{ color: theme.colors.text.secondary }}>Response within 24-48 hours</span>
          </div>
        </div>

        {/* Form Fields */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="contact-name" style={{ color: theme.colors.text.secondary }}>
              Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="contact-name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your name"
              required
              className="form-input"
              style={{
                backgroundColor: theme.colors.background.default,
                borderColor: theme.colors.text.disabled,
                color: theme.colors.text.primary,
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact-email" style={{ color: theme.colors.text.secondary }}>
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              id="contact-email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              required
              className="form-input"
              style={{
                backgroundColor: theme.colors.background.default,
                borderColor: formState === 'error' && !formData.email ? theme.colors.error.main : theme.colors.text.disabled,
                color: theme.colors.text.primary,
              }}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="contact-phone" style={{ color: theme.colors.text.secondary }}>
              Phone <span className="optional">(optional)</span>
            </label>
            <input
              type="tel"
              id="contact-phone"
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

          <div className="form-group">
            <label htmlFor="contact-subject" style={{ color: theme.colors.text.secondary }}>
              Subject <span className="optional">(optional)</span>
            </label>
            <select
              id="contact-subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="form-input form-select"
              style={{
                backgroundColor: theme.colors.background.default,
                borderColor: theme.colors.text.disabled,
                color: formData.subject ? theme.colors.text.primary : theme.colors.text.disabled,
              }}
            >
              <option value="">Select a topic</option>
              <option value="general">General Inquiry</option>
              <option value="pricing">Pricing & Plans</option>
              <option value="features">Feature Request</option>
              <option value="security">Security & Privacy</option>
              <option value="partnership">Partnership</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="contact-message" style={{ color: theme.colors.text.secondary }}>
            Message <span className="required">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="How can we help you?"
            required
            rows={4}
            className="form-input form-textarea"
            style={{
              backgroundColor: theme.colors.background.default,
              borderColor: formState === 'error' && !formData.message ? theme.colors.error.main : theme.colors.text.disabled,
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
          className="contact-button"
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
              Sending...
            </span>
          ) : (
            'Send Message'
          )}
        </button>
      </form>
    </Modal>
  );
};

export default ContactModal;
