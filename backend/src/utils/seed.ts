// src/utils/seed.ts
import { getDb } from '../db/db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// Thông tin tài khoản admin test mặc định
const ADMIN_USERNAME = 'AdminTest';
const ADMIN_EMAIL = 'admin@test.com';
const ADMIN_PASSWORD = 'admin123'; // Đảm bảo mật khẩu này khớp với mật khẩu mày dùng để test

export async function seedAdminUser() {
  try {
    console.log('Đang kiểm tra và gieo hạt tài khoản admin test...');

    const db = await getDb();

    // Kiểm tra xem tài khoản admin đã tồn tại chưa
    const existingAdmin = await db.select().from(users).where(eq(users.email, ADMIN_EMAIL)).limit(1);

    if (existingAdmin.length === 0) {
      // Nếu chưa có, tạo tài khoản admin mới
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, salt);

      await db.insert(users).values({
        username: ADMIN_USERNAME,
        email: ADMIN_EMAIL,
        passwordHash,
      });
      console.log(`Tài khoản admin test "${ADMIN_EMAIL}" đã được tạo thành công!`);
    } else {
      console.log(`Tài khoản admin test "${ADMIN_EMAIL}" đã tồn tại.`);
    }
  } catch (error) {
    console.error('Lỗi khi gieo hạt tài khoản admin:', error);
  }
}
