// src/db/schema.ts
import { pgTable, serial, text, timestamp, integer, varchar } from 'drizzle-orm/pg-core';

// Bảng Users (Tài khoản người dùng) - CHỈ CÓ THÔNG TIN CƠ BẢN
export const users = pgTable('users', {
  id: serial('id').primaryKey().notNull(),
  name: text('name').notNull(), // Tên hiển thị của tài khoản
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  status: varchar('status', { length: 20 }).notNull().default('active'), // Trạng thái tài khoản
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Bảng Individuals (Hồ sơ cá nhân / Khách hàng / Bạn bè) - CÓ NHIỀU THÔNG TIN CHI TIẾT
export const individuals = pgTable('individuals', {
  id: serial('id').primaryKey().notNull(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'set null', onUpdate: 'cascade' }), // Có thể NULL nếu không liên kết với user nào
  name: text('name').notNull(), // Tên của cá nhân
  contactInfo: text('contact_info').notNull(), // Thông tin liên hệ (email, phone, etc.)
  profileImageUrl: text('profile_image_url'), // URL ảnh đại diện
  age: integer('age'), // Tuổi
  dateOfBirth: varchar('date_of_birth', { length: 10 }), // Định dạng YYYY-MM-DD
  relationshipStatus: varchar('relationship_status', { length: 50 }), // Tình trạng quan hệ
  trustReputation: varchar('trust_reputation', { length: 50 }), // Mức độ tin cậy/uy tín
  status: varchar('status', { length: 20 }).notNull().default('active'), // Trạng thái của hồ sơ cá nhân (active/inactive/etc.)
  address: text('address'), // Địa chỉ đầy đủ
  city: varchar('city', { length: 100 }), // Thành phố
  country: varchar('country', { length: 100 }), // Quốc gia
  phone: varchar('phone', { length: 20 }), // Số điện thoại
  occupation: text('occupation'), // Nghề nghiệp
  bio: text('bio'), // Tiểu sử
  interests: text('interests'), // Sở thích (có thể là chuỗi JSON hoặc chuỗi phân cách bằng dấu phẩy)
  socialMediaLinks: text('social_media_links'), // Link mạng xã hội (chuỗi JSON)
  emergencyContact: text('emergency_contact'), // Liên hệ khẩn cấp
  notes: text('notes'), // Ghi chú bổ sung
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

