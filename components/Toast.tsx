
import React from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
}

export const Toast: React.FC<ToastProps> = ({ toasts }) => {
  return (
    <div className="fixed top-5 right-5 z-[100] space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`
            flex items-center justify-between w-full max-w-xs p-4 text-gray-500 bg-gray-800 rounded-lg shadow-lg border
            ${toast.type === 'success' ? 'border-green-500/50 text-green-300' : 'border-red-500/50 text-red-300'}
            animate-fade-in
          `}
          role="alert"
        >
          <div className="text-sm font-normal">{toast.message}</div>
        </div>
      ))}
    </div>
  );
};
