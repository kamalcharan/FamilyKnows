// src/components/familyknows/StorytellingSection.tsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import './StorytellingSection.css';

const StorytellingSection: React.FC = () => {
  const { theme } = useTheme();
  const [activeStory, setActiveStory] = useState(0);

  // Auto-rotate stories every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStory((prev) => (prev + 1) % 3); // Cycle through 0, 1, 2
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const stories = [
    {
      id: 1,
      title: 'One App to Bring Family Together',
      subtitle: 'Stop juggling between 10 different apps',
      problem: {
        title: 'The Scattered Reality',
        description: 'WhatsApp for chat, Google Drive for docs, Excel for assets, Photos for memories...',
        items: [
          { icon: '💬', label: 'WhatsApp', color: '#25D366' },
          { icon: '📁', label: 'Drive', color: '#4285F4' },
          { icon: '📊', label: 'Excel', color: '#217346' },
          { icon: '📸', label: 'Photos', color: '#FBBC04' },
          { icon: '📝', label: 'Notes', color: '#FF9500' },
          { icon: '🔑', label: 'Passwords', color: '#0071E3' },
        ],
      },
      solution: {
        title: 'The FamilyKnows Way',
        description: 'Everything your family needs in one secure, integrated platform',
        icon: '🏠',
      },
    },
    {
      id: 2,
      title: 'From Chaos to Clarity',
      subtitle: 'The "In Case of Death" folder, reimagined',
      problem: {
        title: 'The Physical Folder Problem',
        description: 'Important documents scattered across lockers, emails, and memory. Family doesn\'t know where to find what.',
        items: [
          { icon: '📄', label: 'Papers', color: '#95a1ac' },
          { icon: '🗄️', label: 'Locker', color: '#656a85' },
          { icon: '📧', label: 'Email', color: '#EA4335' },
          { icon: '🧠', label: 'Memory', color: '#8860d0' },
        ],
      },
      solution: {
        title: 'Digital Vault for Peace of Mind',
        description: '5 organized categories: IDs, Legal Docs, Financial Assets, Property, Digital Assets - all encrypted and accessible to your family when needed',
        icon: '🔐',
      },
    },
    {
      id: 3,
      title: 'Breaking the Language Barrier',
      subtitle: 'Generational wealth transfer made simple',
      problem: {
        title: 'The Communication Gap',
        description: 'Parents comfortable in Telugu/Hindi, kids using English - leading to missed knowledge transfer',
        items: [
          { icon: '👴', label: 'తెలుగు', color: '#3d52a0' },
          { icon: '🤷', label: 'Lost', color: '#95a1ac' },
          { icon: '👦', label: 'English', color: '#5680e9' },
        ],
      },
      solution: {
        title: 'Everyone Speaks Their Language',
        description: 'Telugu, Hindi, English and more - family elders can document wisdom in their language, kids can understand in theirs',
        icon: '🌐',
      },
    },
  ];

  const currentStory = stories[activeStory];

  return (
    <section className="storytelling-section" style={{ backgroundColor: theme.colors.background.paper }}>
      <div className="story-container">
        {/* Section Header */}
        <div className="story-header">
          <h2 className="story-main-title" style={{ color: theme.colors.text.primary }}>
            Why FamilyKnows?
          </h2>
          <p className="story-main-subtitle" style={{ color: theme.colors.text.secondary }}>
            Real problems. Real solutions. For real families.
          </p>
        </div>

        {/* Story Navigation */}
        <div className="story-nav">
          {stories.map((story, index) => (
            <button
              key={story.id}
              className={`story-nav-item ${activeStory === index ? 'active' : ''}`}
              onClick={() => setActiveStory(index)}
              style={{
                borderColor: activeStory === index ? theme.colors.primary.main : theme.colors.text.disabled,
                backgroundColor: activeStory === index ? `${theme.colors.primary.main}10` : 'transparent',
                color: activeStory === index ? theme.colors.primary.main : theme.colors.text.secondary,
              }}
            >
              <span className="nav-number">{index + 1}</span>
              <span className="nav-title">{story.title}</span>
            </button>
          ))}
        </div>

        {/* Story Content */}
        <div className="story-content">
          <div className="story-title-section">
            <h3 className="story-title" style={{ color: theme.colors.text.primary }}>
              {currentStory.title}
            </h3>
            <p className="story-subtitle" style={{ color: theme.colors.text.secondary }}>
              {currentStory.subtitle}
            </p>
          </div>

          {/* Before/After Comparison */}
          <div className="comparison-container">
            {/* Problem Side */}
            <div className="comparison-side problem-side">
              <div className="side-header" style={{ color: theme.colors.error.main }}>
                <span className="header-icon">❌</span>
                <span className="header-title">{currentStory.problem.title}</span>
              </div>

              <p className="side-description" style={{ color: theme.colors.text.secondary }}>
                {currentStory.problem.description}
              </p>

              {/* Scattered Apps/Items Visualization */}
              <div className="scattered-items-3d">
                {currentStory.problem.items.map((item, index) => (
                  <div
                    key={index}
                    className="scattered-item"
                    style={{
                      backgroundColor: item.color,
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    <div className="item-icon">{item.icon}</div>
                    <div className="item-label">{item.label}</div>
                  </div>
                ))}
                <div className="chaos-overlay">
                  <span style={{ color: theme.colors.error.main }}>😰 Chaos</span>
                </div>
              </div>
            </div>

            {/* Arrow Divider */}
            <div className="arrow-divider" style={{ color: theme.colors.primary.main }}>
              <div className="arrow-circle" style={{ backgroundColor: theme.colors.primary.main }}>
                →
              </div>
              <div className="arrow-label">FamilyKnows</div>
            </div>

            {/* Solution Side */}
            <div className="comparison-side solution-side">
              <div className="side-header" style={{ color: theme.colors.success.main }}>
                <span className="header-icon">✓</span>
                <span className="header-title">{currentStory.solution.title}</span>
              </div>

              <p className="side-description" style={{ color: theme.colors.text.secondary }}>
                {currentStory.solution.description}
              </p>

              {/* Unified Solution Visualization */}
              <div
                className="unified-solution-3d"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.secondary.main})`,
                }}
              >
                <div className="solution-icon">{currentStory.solution.icon}</div>
                <div className="solution-label">FamilyKnows</div>
                <div className="solution-subtext">All in One Secure Platform</div>
                <div className="solution-glow"></div>
              </div>
            </div>
          </div>

          {/* Story Dots Indicator */}
          <div className="story-dots">
            {stories.map((_, index) => (
              <button
                key={index}
                className={`story-dot ${activeStory === index ? 'active' : ''}`}
                onClick={() => setActiveStory(index)}
                style={{
                  backgroundColor: activeStory === index ? theme.colors.primary.main : theme.colors.text.disabled,
                }}
                aria-label={`Go to story ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorytellingSection;
