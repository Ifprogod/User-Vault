// src/routes/users.ts
import { Router } from 'express';
import { getDb } from '../db/db';
import { users as usersTable } from '../db/schema';
import { eq, like, or } from 'drizzle-orm';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken); // Áp dụng middleware xác thực cho tất cả các route dưới đây

// GET /api/users - Lấy danh sách tất cả người dùng (có thể tìm kiếm)
router.get('/users', async (req, res) => {
  try {
    const db = await getDb();
    const { search } = req.query;

    let users;
    if (search && typeof search === 'string') {
      users = await db.select().from(usersTable).where(
        or(
          like(usersTable.name, `%${search}%`),
          like(usersTable.email, `%${search}%`)
        )
      );
    } else {
      users = await db.select().from(usersTable);
    }
    // Chỉ trả về các trường cần thiết, KHÔNG BAO GỒM passwordHash
    const sanitizedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
    res.json(sanitizedUsers);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách người dùng:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách người dùng.' });
  }
});

// GET /api/users/:id - Lấy thông tin một người dùng cụ thể
router.get('/users/:id', async (req, res) => {
  try {
    const db = await getDb();
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'ID người dùng không hợp lệ.' });
    }

    const user = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);

    if (user.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }
    // Chỉ trả về các trường cần thiết, KHÔNG BAO GỒM passwordHash
    const sanitizedUser = {
      id: user[0].id,
      name: user[0].name,
      email: user[0].email,
      status: user[0].status,
      createdAt: user[0].createdAt,
      updatedAt: user[0].updatedAt,
    };
    res.json(sanitizedUser);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy thông tin người dùng.' });
  }
});

// PUT /api/users/:id - Cập nhật thông tin người dùng (chỉ cho phép cập nhật các trường cơ bản)
router.put('/users/:id', async (req, res) => {
  try {
    const db = await getDb();
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'ID người dùng không hợp lệ.' });
    }

    const { name, email, status } = req.body; // Chỉ cho phép cập nhật các trường này

    const updatedUser: Partial<typeof usersTable.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updatedUser.name = name;
    if (email !== undefined) updatedUser.email = email;
    if (status !== undefined) updatedUser.status = status;

    const result = await db.update(usersTable).set(updatedUser).where(eq(usersTable.id, userId)).returning();

    if (result.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng để cập nhật.' });
    }
    // Chỉ trả về các trường cần thiết, KHÔNG BAO GỒM passwordHash
    const sanitizedUser = {
      id: result[0].id,
      name: result[0].name,
      email: result[0].email,
      status: result[0].status,
      createdAt: result[0].createdAt,
      updatedAt: result[0].updatedAt,
    };
    res.json({ message: 'Người dùng đã được cập nhật thành công!', user: sanitizedUser });
  } catch (error) {
    console.error('Lỗi khi cập nhật người dùng:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật người dùng.' });
  }
});

// DELETE /api/users/:id - Xóa người dùng
router.delete('/users/:id', async (req, res) => {
  try {
    const db = await getDb();
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
