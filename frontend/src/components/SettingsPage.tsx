// src/components/SettingsPage.tsx
import React from 'react';

const SettingsPage: React.FC = () => {
  return (
    <div className="w-full p-8 bg-gray-900 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-bold text-blue-500 mb-6 text-center">Cài đặt</h2>
      <p className="text-gray-400 text-center">
        Đây là trang Cài đặt. Mày có thể thêm các tùy chọn cài đặt ứng dụng ở đây.
      </p>
    </div>
  );
};

export default SettingsPage;
