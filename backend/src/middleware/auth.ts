// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in .env file');
}

// Mở rộng Request để thêm user vào
interface AuthenticatedRequest extends Request {
  user?: { id: number; email: string };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Lấy token từ 'Bearer TOKEN'

  if (token == null) {
    return res.status(401).json({ message: 'Không có token xác thực.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Lỗi xác thực token:', err);
      return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
    // Gán thông tin người dùng vào request để các route sau có thể sử dụng
    req.user = user as { id: number; email: string };
    next(); // Chuyển sang middleware/route tiếp theo
  });
};
