// src/components/common/DeleteConfirmationModal.js
import React from 'react';
import Button from './Button';

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-30" onClick={onClose}></div>

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto overflow-hidden border border-gray-200"
          onClick={(e) => e.stopPropagation()}>
          
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-6 py-4">
            <p className="text-gray-700 mb-6">{message}</p>
            
            <div className="flex justify-end space-x-3 border-t border-gray-200 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="px-4 py-2"
              >
                {cancelText}
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={onConfirm}
                className="px-4 py-2"
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;