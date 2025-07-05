// src/components/DashboardPage.tsx
import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div className="w-full p-8 bg-gray-900 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-bold text-blue-500 mb-6 text-center">Dashboard của bạn</h2>
      <p className="text-gray-400 text-center">
        Đây là trang Dashboard. Mày có thể thêm các biểu đồ, thống kê, hoặc thông tin tổng quan ở đây.
      </p>
    </div>
  );
};

export default DashboardPage;
