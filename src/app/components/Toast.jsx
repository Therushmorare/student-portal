"use client"

import { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? COLORS.success : type === 'error' ? COLORS.danger : COLORS.info;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="rounded-lg shadow-lg p-4 flex items-center gap-3" style={{ backgroundColor: bgColor }}>
        <CheckCircle className="w-5 h-5 text-white" />
        <p className="text-white font-medium">{message}</p>
        <button onClick={onClose} className="text-white hover:opacity-80">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;