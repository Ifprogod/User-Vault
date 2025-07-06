// src/lib/types.ts
// Định nghĩa các kiểu dữ liệu cho UserProfile, dùng cho UserManagement component
export interface UserProfile {
  id: number;
  name: string;
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

