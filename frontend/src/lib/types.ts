// src/lib/types.ts
// Định nghĩa các kiểu dữ liệu cho UserProfile (dùng cho xác thực)
export interface UserProfile {
  id: number;
  name: string; // Tên hiển thị của tài khoản
  email: string;
  age?: number;
  dateOfBirth?: string; // Định dạng YYYY-MM-DD
  status: 'active' | 'pending' | 'inactive';
  relationshipStatus?: string;
  city?: string;
  country?: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string | null;
}

// Kiểu dữ liệu để tạo người dùng mới (không có ID, createdAt, updatedAt)
export type InsertUserProfile = Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>;

// Kiểu dữ liệu để cập nhật người dùng (ID là bắt buộc, các trường khác là tùy chọn)
export type UpdateUserProfile = Partial<InsertUserProfile>;


// --- KIỂU DỮ LIỆU MỚI CHO INDIVIDUALS (HỒ SƠ KHÁCH HÀNG/BẠN BÈ) ---
export interface IndividualProfile {
  id: number;
  name: string; // Tên của cá nhân
  contactInfo: string; // Thông tin liên hệ (số điện thoại, email khác, v.v.)
  address?: string; // Địa chỉ
  notes?: string; // Ghi chú
  userId?: number; // ID của tài khoản user liên quan (có thể null nếu không liên kết)
  createdAt: string;
  updatedAt: string | null;
}

// Kiểu dữ liệu để tạo individual mới
export type InsertIndividualProfile = Omit<IndividualProfile, 'id' | 'createdAt' | 'updatedAt'>;

// Kiểu dữ liệu để cập nhật individual
export type UpdateIndividualProfile = Partial<InsertIndividualProfile>;
