// src/components/familyknows/Modal.tsx
import React, { useEffect, useCallback } from 'react';
import { useTheme } from '../../hooks/useTheme';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  size?: 'small' | 'medium' | 'large';
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  subtitle,
  size = 'medium',
  showCloseButton = true,
}) => {
  const { theme } = useTheme();

  // Handle ESC key
  const handleEscKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  // Handle click outside
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscKey]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div
        className={`modal-container modal-${size}`}
        style={{
          backgroundColor: theme.colors.background.paper,
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {/* Close Button */}
        {showCloseButton && (
          <button
            className="modal-close-button"
            onClick={onClose}
            aria-label="Close modal"
            style={{ color: theme.colors.text.secondary }}
          >
            ✕
          </button>
        )}

        {/* Header */}
        {(title || subtitle) && (
          <div className="modal-header">
            {title && (
              <h2
                id="modal-title"
                className="modal-title"
                style={{ color: theme.colors.text.primary }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="modal-subtitle" style={{ color: theme.colors.text.secondary }}>
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
