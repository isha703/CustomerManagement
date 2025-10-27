import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 flex items-center justify-center z-50 md:w-1/2 w-full bg-gradient-to-r from-transparent to-blue-300">
      {/* Overlay only for closing when clicked outside (optional) */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal card positioned on right half */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6 m-6 z-50">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
