// src/routes/individuals.ts
import { Router } from 'express';
import { getDb } from '../db/db';
import { individuals as individualsTable } from '../db/schema'; // Import bảng individuals
import { eq, like, or } from 'drizzle-orm';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Middleware để kiểm tra và xác thực token cho tất cả các route dưới đây
router.use(authenticateToken);

// GET /api/individuals - Lấy danh sách tất cả individuals (có thể tìm kiếm)
router.get('/individuals', async (req, res) => {
  try {
    const db = await getDb();
    const { search } = req.query; // Ví dụ tìm kiếm theo name hoặc contactInfo

    let individuals;
    if (search && typeof search === 'string') {
      individuals = await db.select().from(individualsTable).where(
        or(
          like(individualsTable.name, `%${search}%`),
          like(individualsTable.contactInfo, `%${search}%`)
        )
      );
    } else {
      individuals = await db.select().from(individualsTable);
    }
    res.json(individuals);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách individuals:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách individuals.' });
  }
});

// GET /api/individuals/:id - Lấy thông tin một individual cụ thể
router.get('/individuals/:id', async (req, res) => {
  try {
    const db = await getDb();
    const individualId = parseInt(req.params.id);
    if (isNaN(individualId)) {
      return res.status(400).json({ message: 'ID individual không hợp lệ.' });
    }

    const individual = await db.select().from(individualsTable).where(eq(individualsTable.id, individualId)).limit(1);

    if (individual.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy individual.' });
    }
    res.json(individual[0]);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin individual:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy thông tin individual.' });
  }
});

// POST /api/individuals - Tạo individual mới (hồ sơ khách hàng/bạn bè)
router.post('/individuals', async (req, res) => {
  try {
    const db = await getDb();
    const { name, contactInfo, address, notes, userId } = req.body; // userId là để liên kết với tài khoản user nếu cần

    if (!name || !contactInfo) {
      return res.status(400).json({ message: 'Tên và thông tin liên hệ là bắt buộc.' });
    }

    // Tùy chọn: Kiểm tra xem userId có hợp lệ không nếu bạn muốn liên kết individuals với users
    // const userExists = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    // if (userId && userExists.length === 0) {
    //   return res.status(400).json({ message: 'UserId không hợp lệ.' });
    // }

    const newIndividual = {
      name,
      contactInfo,
      address: address || null,
      notes: notes || null,
      userId: userId || null, // Liên kết với userId nếu có
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.insert(individualsTable).values(newIndividual).returning();
    res.status(201).json({ message: 'Individual đã được tạo thành công!', individual: result[0] });
  } catch (error) {
    console.error('Lỗi khi tạo individual:', error);
    res.status(500).json({ message: 'Lỗi server khi tạo individual.' });
  }
});

// PUT /api/individuals/:id - Cập nhật thông tin individual
router.put('/individuals/:id', async (req, res) => {
  try {
    const db = await getDb();
    const individualId = parseInt(req.params.id);
    if (isNaN(individualId)) {
      return res.status(400).json({ message: 'ID individual không hợp lệ.' });
    }

    const { name, contactInfo, address, notes, userId } = req.body;

    const updatedIndividual = {
      name: name || undefined,
      contactInfo: contactInfo || undefined,
      address: address || undefined,
      notes: notes || undefined,
      userId: userId || undefined,
      updatedAt: new Date(),
    };

    const result = await db.update(individualsTable).set(updatedIndividual).where(eq(individualsTable.id, individualId)).returning();

    if (result.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy individual để cập nhật.' });
    }
    res.json({ message: 'Individual đã được cập nhật thành công!', individual: result[0] });
  } catch (error) {
    console.error('Lỗi khi cập nhật individual:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật individual.' });
  }
});

// DELETE /api/individuals/:id - Xóa individual
router.delete('/individuals/:id', async (req, res) => {
  try {
    const db = await getDb();
    const individualId = parseInt(req.params.id);
    if (isNaN(individualId)) {
      return res.status(400).json({ message: 'ID individual không hợp lệ.' });
    }

    const result = await db.delete(individualsTable).where(eq(individualsTable.id, individualId)).returning();

    if (result.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy individual để xóa.' });
    }
    res.json({ message: 'Individual đã được xóa thành công!' });
  } catch (error) {
    console.error('Lỗi khi xóa individual:', error);
    res.status(500).json({ message: 'Lỗi server khi xóa individual.' });
  }
});

export default router;
