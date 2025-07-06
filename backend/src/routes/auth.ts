// src/routes/auth.ts
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../db/db'; // <-- Đã đổi thành getDb
import { users as usersTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in .env file');
}

// Route đăng ký người dùng
router.post('/register', async (req, res) => {
  try {
    const db = await getDb(); // <-- Gọi hàm getDb
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Tên, email và mật khẩu là bắt buộc.' });
    }

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'Email đã tồn tại.' });
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10); // 10 là salt rounds

    // Tạo người dùng mới
    const newUser = {
     username: name,
     email,
     passwordHash: hashedPassword,
     createdAt: new Date(),
     updatedAt: new Date(),
    };

    const result = await db.insert(usersTable).values(newUser).returning();
    const user = result[0];

    // Tạo JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      message: 'Đăng ký thành công!',
      token,
      user: { id: user.id, username: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Lỗi đăng ký người dùng:', error);
    res.status(500).json({ message: 'Lỗi server khi đăng ký.' });
  }
});

// Route đăng nhập người dùng
router.post('/login', async (req, res) => {
  try {
    const db = await getDb(); // <-- Gọi hàm getDb
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email và mật khẩu là bắt buộc.' });
    }

    // Tìm người dùng theo email
    const users = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    const user = users[0];

    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
    }

    // So sánh mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
    }

    // Tạo JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: 'Đăng nhập thành công!',
      token,
      user: { id: user.id, username: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Lỗi đăng nhập người dùng:', error);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập.' });
  }
});

export default router;
