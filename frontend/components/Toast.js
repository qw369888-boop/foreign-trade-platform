import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiAlertCircle, FiInfo } from 'react-icons/fi';

const Toast = ({ show, message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose && onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheck className="w-5 h-5" />;
      case 'error':
        return <FiX className="w-5 h-5" />;
      case 'warning':
        return <FiAlertCircle className="w-5 h-5" />;
      case 'info':
        return <FiInfo className="w-5 h-5" />;
      default:
        return <FiCheck className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500/90 text-white border-green-400';
      case 'error':
        return 'bg-red-500/90 text-white border-red-400';
      case 'warning':
        return 'bg-yellow-500/90 text-white border-yellow-400';
      case 'info':
        return 'bg-blue-500/90 text-white border-blue-400';
      default:
        return 'bg-green-500/90 text-white border-green-400';
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-4 right-4 z-50"
        >
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl border backdrop-blur-sm shadow-2xl ${getStyles()}`}>
            <div className="flex-shrink-0">
              {getIcon()}
            </div>
            <div className="flex-1">
              <p className="font-medium">{message}</p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="flex-shrink-0 ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;