// src/routes/users.ts
import { Router } from 'express';
import { db } from '../db';
import { users as usersTable } from '../db/schema';
import { eq, like, or } from 'drizzle-orm'; // Thêm 'or' cho tìm kiếm
import { authenticateToken } from '../middleware/auth'; // Import middleware xác thực token

const router = Router();

// Middleware để kiểm tra và xác thực token cho tất cả các route dưới đây
router.use(authenticateToken); // Áp dụng middleware xác thực

// GET /api/users - Lấy danh sách tất cả người dùng (có thể tìm kiếm)
router.get('/users', async (req, res) => {
  try {
    const { search } = req.query;
    let users;

    if (search && typeof search === 'string') {
      // Tìm kiếm theo tên hoặc email
      users = await db.select().from(usersTable).where(
        or(
          like(usersTable.name, `%${search}%`),
          like(usersTable.email, `%${search}%`)
        )
      );
    } else {
      // Lấy tất cả người dùng
      users = await db.select().from(usersTable);
    }
    res.json(users);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách người dùng:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách người dùng.' });
  }
});

// GET /api/users/:id - Lấy thông tin một người dùng cụ thể
router.get('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'ID người dùng không hợp lệ.' });
    }

    const user = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);

    if (user.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }
    res.json(user[0]);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy thông tin người dùng.' });
  }
});

// POST /api/users - Tạo người dùng mới
router.post('/users', async (req, res) => {
  try {
    const { name, email, age, dateOfBirth, status, relationshipStatus, city, country, profileImageUrl } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!name || !email) {
      return res.status(400).json({ message: 'Tên và Email là các trường bắt buộc.' });
    }

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'Email đã tồn tại.' });
    }

    // Mật khẩu không cần thiết khi tạo user qua API này, vì nó không phải là route đăng ký
    // Nếu mày muốn tạo user với mật khẩu từ đây, mày phải hash nó.
    // Tạm thời, ta sẽ không yêu cầu password ở đây.
    const newUser = {
      name,
      email,
      passwordHash: 'dummy_password_hash', // Đặt một hash giả hoặc null nếu schema cho phép
      age: age || null,
      dateOfBirth: dateOfBirth || null,
      status: status || 'active', // Mặc định là 'active'
      relationshipStatus: relationshipStatus || null,
      city: city || null,
      country: country || null,
      profileImageUrl: profileImageUrl || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await db.insert(usersTable).values(newUser).returning();
    res.status(201).json({ message: 'Người dùng đã được tạo thành công!', user: result[0] });
  } catch (error) {
    console.error('Lỗi khi tạo người dùng:', error);
    res.status(500).json({ message: 'Lỗi server khi tạo người dùng.' });
  }
});

// PUT /api/users/:id - Cập nhật thông tin người dùng
router.put('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'ID người dùng không hợp lệ.' });
    }

    const { name, email, age, dateOfBirth, status, relationshipStatus, city, country, profileImageUrl } = req.body;

    const updatedUser = {
      name: name || undefined,
      email: email || undefined,
      age: age || undefined,
      dateOfBirth: dateOfBirth || undefined,
      status: status || undefined,
      relationshipStatus: relationshipStatus || undefined,
      city: city || undefined,
      country: country || undefined,
      profileImageUrl: profileImageUrl || undefined,
      updatedAt: new Date().toISOString(),
    };

    const result = await db.update(usersTable).set(updatedUser).where(eq(usersTable.id, userId)).returning();

    if (result.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng để cập nhật.' });
    }
    res.json({ message: 'Người dùng đã được cập nhật thành công!', user: result[0] });
  } catch (error) {
    console.error('Lỗi khi cập nhật người dùng:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật người dùng.' });
  }
});

// DELETE /api/users/:id - Xóa người dùng
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'ID người dùng không hợp lệ.' });
    }

    const result = await db.delete(usersTable).where(eq(usersTable.id, userId)).returning();

    if (result.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng để xóa.' });
    }
    res.json({ message: 'Người dùng đã được xóa thành công!' });
  } catch (error) {
    console.error('Lỗi khi xóa người dùng:', error);
    res.status(500).json({ message: 'Lỗi server khi xóa người dùng.' });
  }
});

export default router;
