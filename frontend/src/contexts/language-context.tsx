// src/contexts/language-context.tsx
import React, { createContext, useContext, ReactNode } from 'react';

interface LanguageContextType {
  t: (key: string, options?: { [key: string]: any }) => string; // Hàm dịch (tạm thời chỉ trả về key)
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const t = (key: string, options?: { [key: string]: any }) => {
    const translations: { [key: string]: string } = {
      'sidebar.dashboard': 'Dashboard',
      'sidebar.individualProfiles': 'Quản lý Hồ sơ',
      'sidebar.accountManagement': 'Quản lý Tài khoản', // <-- THÊM DÒNG NÀY
      'sidebar.settings': 'Cài đặt',
      'sidebar.logout': 'Đăng xuất',
      'logout.toast.title': 'Đã đăng xuất',
      'logout.toast.description': 'Mày đã đăng xuất thành công.',
      
      'individualManagement.loading': 'Đang tải hồ sơ...',
      'individualManagement.createSuccessTitle': 'Thành công',
      'individualManagement.createSuccessDescription': 'Hồ sơ đã được tạo thành công',
      'individualManagement.createErrorTitle': 'Lỗi',
      'individualManagement.createErrorDescription': 'Không thể tạo hồ sơ',
      'individualManagement.updateSuccessTitle': 'Thành công',
      'individualManagement.updateSuccessDescription': 'Hồ sơ đã được cập nhật thành công',
      'individualManagement.updateErrorTitle': 'Lỗi',
      'individualManagement.updateErrorDescription': 'Không thể cập nhật hồ sơ',
      'individualManagement.deleteSuccessTitle': 'Thành công',
      'individualManagement.deleteSuccessDescription': 'Hồ sơ đã được xóa thành công',
      'individualManagement.deleteErrorTitle': 'Lỗi',
      'individualManagement.deleteErrorDescription': 'Không thể xóa hồ sơ',
      'individualManagement.exportSuccessTitle': 'Xuất dữ liệu thành công',
      'individualManagement.exportErrorTitle': 'Lỗi',
      'individualManagement.exportErrorDescription': 'Không thể xuất dữ liệu',
      'individualManagement.confirmDelete': 'Mày có chắc chắn muốn xóa hồ sơ của {{name}}?',
      'individualManagement.nameHeader': 'Tên',
      'individualManagement.contactInfoHeader': 'Thông tin liên hệ',
      'individualManagement.addressHeader': 'Địa chỉ',
      'individualManagement.notesHeader': 'Ghi chú',
      'individualManagement.lastUpdated': 'Cập nhật lần cuối',
      'individualManagement.actions': 'Hành động',
      'individualManagement.noIndividualsFound': 'Không tìm thấy hồ sơ nào.',
      'individualManagement.adjustSearch': 'Hãy thử điều chỉnh tìm kiếm của mày.',
      'individualManagement.getStarted': 'Tạo hồ sơ đầu tiên của mày để bắt đầu.',
      'individualManagement.exportButton': 'Xuất',
      'individualManagement.exportingButton': 'Đang xuất...',
      'individualManagement.filtersButton': 'Lọc',
      'individualManagement.searchPlaceholder': 'Tìm kiếm hồ sơ...',
      'individualManagement.addIndividualButton': 'Thêm Hồ sơ',
      'individualManagement.editIndividualTitle': 'Chỉnh sửa Hồ sơ',
      'individualManagement.addIndividualTitle': 'Thêm Hồ sơ Mới',
      'individualManagement.cancelButton': 'Hủy',
      'individualManagement.saveButton': 'Lưu thay đổi',
      'individualManagement.addButton': 'Thêm Hồ sơ',
      'individualManagement.updatingButton': 'Đang cập nhật...',
      'individualManagement.creatingButton': 'Đang thêm...',
      'individualManagement.lastUpdatedNever': 'Không bao giờ',
      'individualManagement.hoursAgo': 'h trước',
      'individualManagement.daysAgo': 'd trước',
      'individualManagement.showingResults': 'Hiển thị {{count}} kết quả',

      // Bản dịch cho tính năng AI
      'individualManagement.summarizeNotesButton': 'Tóm tắt Ghi chú',
      'individualManagement.draftMessageButton': 'Soạn Tin nhắn',
      'individualManagement.summarizeNotesTitle': 'Tóm tắt Ghi chú về {{name}}',
      'individualManagement.draftMessageTitle': 'Soạn Tin nhắn cho {{name}}',
      'individualManagement.llmOutputDescription': 'Đây là kết quả được tạo bởi Gemini AI.',
      'individualManagement.llmLoadingMessage': 'Gemini AI đang suy nghĩ...',
      'individualManagement.llmErrorTitle': 'Lỗi AI',
      'individualManagement.llmErrorMessage': 'Không thể tạo nội dung',
      'individualManagement.llmErrorFallback': 'Đã xảy ra lỗi khi tạo nội dung AI. Vui lòng thử lại.',
      'individualManagement.llmNoResponse': 'Gemini AI không trả về nội dung.',
      'individualManagement.copyButton': 'Sao chép',
      'individualManagement.closeButton': 'Đóng',
      'individualManagement.copySuccessTitle': 'Đã sao chép!',
      'individualManagement.copySuccessDescription': 'Nội dung đã được sao chép vào clipboard.',
      'individualManagement.noSpecificNotes': 'Không có ghi chú cụ thể nào.',
      'individualManagement.summarizeNotesPrompt': 'Tóm tắt ngắn gọn các ghi chú sau về {{name}}: {{notes}}',
      'individualManagement.draftMessagePrompt': 'Soạn một tin nhắn/email ngắn gọn, thân thiện gửi cho {{name}} dựa trên thông tin sau: {{notes}}. Bắt đầu bằng "Xin chào {{name}}," và kết thúc bằng "Trân trọng,".',

      // Bản dịch cho AccountManagement
      'accountManagement.loading': 'Đang tải tài khoản...',
      'accountManagement.deleteSuccessTitle': 'Thành công',
      'accountManagement.deleteSuccessDescription': 'Tài khoản đã được xóa thành công',
      'accountManagement.deleteErrorTitle': 'Lỗi',
      'accountManagement.deleteErrorDescription': 'Không thể xóa tài khoản',
      'accountManagement.confirmDelete': 'Mày có chắc chắn muốn xóa tài khoản {{email}}?',
      'accountManagement.lastUpdated': 'Cập nhật lần cuối',
      'accountManagement.actions': 'Hành động',
      'accountManagement.noAccountsFound': 'Không tìm thấy tài khoản nào.',
      'accountManagement.adjustSearch': 'Hãy thử điều chỉnh tìm kiếm của mày.',
      'accountManagement.getStarted': 'Đăng ký tài khoản đầu tiên của mày để bắt đầu.',
      'accountManagement.filtersButton': 'Lọc',
      'accountManagement.searchPlaceholder': 'Tìm kiếm tài khoản...',
      'accountManagement.hoursAgo': 'h trước',
      'accountManagement.daysAgo': 'd trước',
      'accountManagement.lastUpdatedNever': 'Không bao giờ',
      'accountManagement.showingResults': 'Hiển thị {{count}} kết quả',
    };

    let translatedText = translations[key] || key;

    if (options) {
      for (const optionKey in options) {
        if (options.hasOwnProperty(optionKey)) {
          translatedText = translatedText.replace(new RegExp(`\\{\\{${optionKey}\\}\\}`, 'g'), options[optionKey]);
        }
      }
    }
    return translatedText;
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
