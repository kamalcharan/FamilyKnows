// src/components/familyknows/FAQ.tsx
import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import ContactModal from './ContactModal';
import './FAQ.css';

const FAQ: React.FC = () => {
  const { theme } = useTheme();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const faqs = [
    {
      question: 'Is my family data really secure?',
      answer: 'Absolutely. We use bank-grade AES-256 end-to-end encryption. Your data is encrypted on your device before it ever leaves. We cannot see your information - only you and family members you authorize can access it. Plus, the app works offline-first, so your data stays on your device.',
    },
    {
      question: 'What languages does FamilyKnows support?',
      answer: 'Currently, we support Telugu, Hindi, and English with more Indian languages coming soon. You can switch languages anytime in settings, and different family members can use different languages - perfect for multi-generational families.',
    },
    {
      question: 'How is this different from using Google Drive or other apps?',
      answer: 'Unlike generic storage apps, FamilyKnows is purpose-built for family wealth management. We provide AI-powered insights, document expiry reminders, permission controls for family sharing, and specialized categories for Indian families (property, insurance, investments). Plus, everything is in one place - no more juggling 8 different apps.',
    },
    {
      question: 'Can I invite family members who aren\'t tech-savvy?',
      answer: 'Yes! FamilyKnows is designed for everyone, including family elders. Simple interface, local language support, voice input, and large buttons make it accessible. Plus, you can set up their accounts and manage permissions for them.',
    },
    {
      question: 'What happens to my data if something happens to me?',
      answer: 'This is exactly what FamilyKnows solves! You can set up legacy access for trusted family members. They\'ll be able to access specific information when needed. Think of it as a digital "In Case of Death" folder that your family can actually find and access.',
    },
    {
      question: 'How much does it cost after the early bird offer?',
      answer: 'Regular pricing will be ₹2,400/year for up to 2 family members. Early bird lifetime members get 50% off forever (₹1,200/year) plus 3 family members included. This offer is limited to the first 100 spots.',
    },
    {
      question: 'What if I need to cancel?',
      answer: 'You can cancel anytime. No contracts, no penalties. Your data remains accessible - you can export everything in standard formats (PDF, CSV) before canceling. We believe in earning your trust every month.',
    },
    {
      question: 'Is this only for wealthy families?',
      answer: 'Not at all! Every family has assets worth protecting - whether it\'s property documents, insurance policies, bank accounts, or digital assets. If you have things that matter to your family, FamilyKnows is for you. We call it "Family Office for Everyone" because every family deserves this level of organization.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <section className="faq" style={{ backgroundColor: theme.colors.background.default }}>
        <div className="faq-container">
          {/* Header */}
          <div className="faq-header">
            <h2 className="faq-title" style={{ color: theme.colors.text.primary }}>
              Frequently Asked Questions
            </h2>
            <p className="faq-subtitle" style={{ color: theme.colors.text.secondary }}>
              Everything you need to know about FamilyKnows
            </p>
          </div>

          {/* FAQ List */}
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`faq-item ${openIndex === index ? 'open' : ''}`}
                style={{
                  backgroundColor: theme.colors.background.paper,
                  borderColor: openIndex === index ? theme.colors.primary.main : 'transparent',
                }}
              >
                <button
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                  style={{ color: theme.colors.text.primary }}
                >
                  <span className="question-text">{faq.question}</span>
                  <span
                    className="question-icon"
                    style={{
                      color: openIndex === index ? theme.colors.primary.main : theme.colors.text.disabled,
                    }}
                  >
                    {openIndex === index ? '−' : '+'}
                  </span>
                </button>

                <div className={`faq-answer ${openIndex === index ? 'open' : ''}`}>
                  <p style={{ color: theme.colors.text.secondary }}>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="faq-cta">
            <p style={{ color: theme.colors.text.secondary }}>
              Still have questions?
            </p>
            <button
              className="faq-cta-button"
              onClick={() => setIsContactOpen(true)}
              style={{
                backgroundColor: theme.colors.primary.main,
              }}
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </>
  );
};

export default FAQ;
