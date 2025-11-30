/**
 * Modal/Dialog component with backdrop and animations
 * 
 * @example
 * <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
 *   <ModalHeader>Title</ModalHeader>
 *   <ModalBody>Content</ModalBody>
 *   <ModalFooter>
 *     <Button onClick={() => setShowModal(false)}>Close</Button>
 *   </ModalFooter>
 * </Modal>
 */

import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = '',
}) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  // Handle escape key
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape' && closeOnEscape) {
      onClose();
    }
  }, [closeOnEscape, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div 
        className={`
          relative bg-white rounded-2xl shadow-2xl 
          w-full ${sizes[size]} 
          max-h-[90vh] overflow-y-auto
          animate-slide-up
          ${className}
        `}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        
        {children}
      </div>
    </div>
  );
};

export const ModalHeader = ({ children, className = '' }) => (
  <div className={`p-6 pb-0 ${className}`}>
    <h2 className="text-2xl font-bold text-gray-900 pr-8">{children}</h2>
  </div>
);

export const ModalBody = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

export const ModalFooter = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 flex justify-end gap-3 ${className}`}>
    {children}
  </div>
);

export default Modal;
