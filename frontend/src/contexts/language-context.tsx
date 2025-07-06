// src/contexts/language-context.tsx
import React, { createContext, useContext, ReactNode } from 'react';

interface LanguageContextType {
  t: (key: string) => string; // Hàm dịch (tạm thời chỉ trả về key)
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Hàm dịch đơn giản, chỉ trả về key. Mày có thể mở rộng sau.
  const t = (key: string) => {
    // Dữ liệu dịch tạm thời cho các key mà sidebar dùng
    const translations: { [key: string]: string } = {
      'sidebar.dashboard': 'Dashboard',
      'sidebar.userProfiles': 'Hồ sơ Người dùng',
      'sidebar.settings': 'Cài đặt',
      'sidebar.logout': 'Đăng xuất',
      'logout.toast.title': 'Đã đăng xuất',
      'logout.toast.description': 'Mày đã đăng xuất thành công.',
      // Thêm các bản dịch khác nếu mày cần cho DashboardPage hoặc các trang khác
      'dashboard.title': 'Dashboard của bạn',
      'dashboard.description': 'Quản lý các hồ sơ cá nhân.',
      'dashboard.addProfileButton': 'Thêm Hồ sơ',
      'dashboard.searchPlaceholder': 'Tìm kiếm hồ sơ...',
      'dashboard.noProfilesFound': 'Không tìm thấy hồ sơ nào.',
      'dashboard.noProfilesAdjustSearch': 'Điều chỉnh từ khóa tìm kiếm của mày.',
      'dashboard.noProfilesGetStarted': 'Bắt đầu bằng cách thêm một hồ sơ mới.',
      'dashboard.editDialogTitle': 'Chỉnh sửa hồ sơ',
      'dashboard.addDialogTitle': 'Thêm hồ sơ mới',
      'dashboard.toastUpdateTitle': 'Cập nhật thành công',
      'dashboard.toastUpdateDescription': 'Hồ sơ đã được cập nhật.',
      'dashboard.toastAddTitle': 'Thêm thành công',
      'dashboard.toastAddDescription': 'Hồ sơ mới đã được thêm.',
      'dashboard.toastDeleteTitle': 'Đã xóa',
      'dashboard.toastDeleteDescription': 'Hồ sơ đã được xóa thành công.',
      'dashboard.deleteDialogTitle': 'Mày có chắc chắn không?',
      'dashboard.deleteDialogDescription': 'Hành động này không thể hoàn tác. Việc này sẽ xóa vĩnh viễn hồ sơ này.',
      'dashboard.deleteDialogCancel': 'Hủy',
      'dashboard.deleteDialogConfirm': 'Xác nhận xóa',
    };
    return translations[key] || key; // Trả về bản dịch nếu có, không thì trả về key
  };

  return (
    <LanguageContext.Provider value={{ t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
