// src/components/familyknows/Testimonials.tsx
import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import './Testimonials.css';

const Testimonials: React.FC = () => {
  const { theme } = useTheme();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Placeholder testimonials - replace with real ones when available
  const testimonials = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      role: 'Family Head, Hyderabad',
      avatar: '👨‍💼',
      quote: 'Finally, one place for all our family assets! My parents can use it in Telugu, I use English, and everyone stays updated. Game changer for our joint family.',
      rating: 5,
      benefit: 'Multi-generational coordination',
    },
    {
      id: 2,
      name: 'Priya Sharma',
      role: 'Working Professional, Bangalore',
      avatar: '👩‍💼',
      quote: 'I was managing 8 different apps for family finances. FamilyKnows brought everything together - property docs, insurance, investments. Peace of mind!',
      rating: 5,
      benefit: 'Simplified asset management',
    },
    {
      id: 3,
      name: 'Venkat Reddy',
      role: 'Entrepreneur, Mumbai',
      avatar: '👨‍🦱',
      quote: 'The "In Case of Death" folder inspired me to get organized. Now my family knows exactly where everything is. The encryption gives me confidence.',
      rating: 5,
      benefit: 'Estate planning clarity',
    },
  ];

  const currentTestimonial = testimonials[activeTestimonial];

  return (
    <section
      className="testimonials"
      style={{
        background: `linear-gradient(135deg, ${theme.colors.background.default}, ${theme.colors.background.paper})`,
      }}
    >
      <div className="testimonials-container">
        {/* Header */}
        <div className="testimonials-header">
          <div
            className="testimonials-badge"
            style={{ backgroundColor: theme.colors.primary.main }}
          >
            <span>⭐ What Beta Users Say</span>
          </div>
          <h2 className="testimonials-title" style={{ color: theme.colors.text.primary }}>
            Trusted by 150+ Families
          </h2>
          <p className="testimonials-subtitle" style={{ color: theme.colors.text.secondary }}>
            Real stories from families securing their legacy with FamilyKnows
          </p>
        </div>

        {/* Main Testimonial Card */}
        <div
          className="main-testimonial-card"
          style={{
            backgroundColor: theme.colors.background.paper,
            borderColor: theme.colors.primary.main,
          }}
        >
          {/* Quote Icon */}
          <div className="quote-icon" style={{ color: theme.colors.primary.main }}>
            "
          </div>

          {/* Rating */}
          <div className="testimonial-rating">
            {[...Array(currentTestimonial.rating)].map((_, i) => (
              <span key={i} className="star">⭐</span>
            ))}
          </div>

          {/* Quote */}
          <p className="testimonial-quote" style={{ color: theme.colors.text.primary }}>
            {currentTestimonial.quote}
          </p>

          {/* Benefit Tag */}
          <div
            className="benefit-tag"
            style={{
              backgroundColor: `${theme.colors.success.main}15`,
              color: theme.colors.success.main,
            }}
          >
            ✓ {currentTestimonial.benefit}
          </div>

          {/* Author */}
          <div className="testimonial-author">
            <div className="author-avatar">{currentTestimonial.avatar}</div>
            <div className="author-info">
              <div className="author-name" style={{ color: theme.colors.text.primary }}>
                {currentTestimonial.name}
              </div>
              <div className="author-role" style={{ color: theme.colors.text.secondary }}>
                {currentTestimonial.role}
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Navigation */}
        <div className="testimonial-nav">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.id}
              className={`nav-dot ${activeTestimonial === index ? 'active' : ''}`}
              onClick={() => setActiveTestimonial(index)}
              style={{
                backgroundColor:
                  activeTestimonial === index
                    ? theme.colors.primary.main
                    : theme.colors.text.disabled,
              }}
              aria-label={`View testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="testimonial-stats">
          <div className="stat-item">
            <div className="stat-number" style={{ color: theme.colors.primary.main }}>
              150+
            </div>
            <div className="stat-label" style={{ color: theme.colors.text.secondary }}>
              Beta Families
            </div>
          </div>
          <div className="stat-divider" style={{ backgroundColor: theme.colors.text.disabled }} />
          <div className="stat-item">
            <div className="stat-number" style={{ color: theme.colors.primary.main }}>
              4.9/5
            </div>
            <div className="stat-label" style={{ color: theme.colors.text.secondary }}>
              Average Rating
            </div>
          </div>
          <div className="stat-divider" style={{ backgroundColor: theme.colors.text.disabled }} />
          <div className="stat-item">
            <div className="stat-number" style={{ color: theme.colors.primary.main }}>
              100%
            </div>
            <div className="stat-label" style={{ color: theme.colors.text.secondary }}>
              Would Recommend
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
