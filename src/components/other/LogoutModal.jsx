import React, { useEffect, useRef } from 'react';
import { modalStyles } from './auth.styles';

const LogoutModal = ({ isOpen, onClose, onLogout }) => {
  const modalRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={modalStyles.overlay}>
      <div 
        ref={modalRef}
        className={`${modalStyles.container} ${modalStyles.containerOpen}`}
      >
        <div className={modalStyles.header}>
          <div className={modalStyles.icon}>
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </div>
          <h3 className={modalStyles.title}>Ready to Leave?</h3>
        </div>

        <div className={modalStyles.body}>
          <p className={modalStyles.message}>
            Are you sure you want to log out? You'll need to sign in again to access your account.
          </p>
        </div>

        <div className={modalStyles.footer}>
          <button
            onClick={onClose}
            className={modalStyles.cancelButton}
          >
            Cancel
          </button>
          <button
            onClick={onLogout}
            className={modalStyles.logoutButton}
          >
            Yes, Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;