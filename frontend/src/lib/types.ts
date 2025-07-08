// src/lib/types.ts
// Định nghĩa các kiểu dữ liệu cho UserProfile (dùng cho xác thực) - CHỈ CÓ THÔNG TIN CƠ BẢN
export interface UserProfile {
  id: number;
  name: string; // Tên hiển thị của tài khoản
  email: string;
  status: 'active' | 'pending' | 'inactive';
  createdAt: string;
  updatedAt: string | null;
}

// Kiểu dữ liệu để tạo người dùng mới (không có ID, createdAt, updatedAt)
export type InsertUserProfile = Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>;

// Kiểu dữ liệu để cập nhật người dùng (ID là bắt buộc, các trường khác là tùy chọn)
export type UpdateUserProfile = Partial<InsertUserProfile>;


// --- KIỂU DỮ LIỆU MỚI CHO INDIVIDUALS (HỒ SƠ CÁ NHÂN / KHÁCH HÀNG / BẠN BÈ) - CÓ NHIỀU THÔNG TIN CHI TIẾT ---
export interface IndividualProfile {
  id: number;
  name: string; // Tên của cá nhân
  contactInfo: string; // Thông tin liên hệ (số điện thoại, email khác, v.v.)
  profileImageUrl?: string; // URL ảnh đại diện
  age?: number;
  dateOfBirth?: string; // Định dạng YYYY-MM-DD
  relationshipStatus?: string;
  trustReputation?: string; // Mức độ tin cậy/uy tín
  status?: 'active' | 'pending' | 'inactive'; // Trạng thái của hồ sơ cá nhân
  address?: string; // Địa chỉ đầy đủ
  city?: string; // Thành phố
  country?: string; // Quốc gia
  phone?: string; // Số điện thoại
  occupation?: string; // Nghề nghiệp
  bio?: string; // Tiểu sử
  interests?: string; // Sở thích (có thể là chuỗi JSON hoặc chuỗi phân cách bằng dấu phẩy)
  socialMediaLinks?: string; // Link mạng xã hội (chuỗi JSON)
  emergencyContact?: string; // Liên hệ khẩn cấp
  notes?: string; // Ghi chú bổ sung
  userId?: number; // ID của tài khoản user liên quan (có thể null nếu không liên kết)
  createdAt: string;
  updatedAt: string | null;
}

// Kiểu dữ liệu để tạo individual mới
export type InsertIndividualProfile = Omit<IndividualProfile, 'id' | 'createdAt' | 'updatedAt'>;

// Kiểu dữ liệu để cập nhật individual
export type UpdateIndividualProfile = Partial<InsertIndividualProfile>;

