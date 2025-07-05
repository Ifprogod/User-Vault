// src/components/Toast.tsx
import React, { useEffect, useState } from 'react';

interface ToastProps {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
  onDismiss: (id: string) => void;
  duration?: number; // Thời gian tự động biến mất
}

const Toast: React.FC<ToastProps> = ({ id, title, description, variant = 'default', onDismiss, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Chờ animation kết thúc trước khi thực sự gỡ bỏ
        setTimeout(() => onDismiss(id), 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onDismiss]);

  const backgroundColor = variant === 'destructive' ? 'bg-red-600' : 'bg-blue-600';

  if (!isVisible) return null;

  return (
    <div
      className={`p-4 rounded-lg shadow-lg text-white max-w-xs transition-opacity duration-300 ${backgroundColor}`}
      role="alert"
    >
      <div className="flex justify-between items-center">
        <h3 className="font-bold">{title}</h3>
        <button onClick={() => { setIsVisible(false); setTimeout(() => onDismiss(id), 300); }} className="ml-4 text-white opacity-70 hover:opacity-100">
          &times;
        </button>
      </div>
      {description && <p className="text-sm mt-1">{description}</p>}
    </div>
  );
};

export default Toast;
