// src/routes/individuals.ts
import { Router } from 'express';
import { getDb } from '../db/db';
import { individuals as individualsTable } from '../db/schema';
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
          like(individualsTable.contactInfo, `%${search}%`),
          like(individualsTable.address, `%${search}%`),
          like(individualsTable.notes, `%${search}%`),
          like(individualsTable.city, `%${search}%`),
          like(individualsTable.country, `%${search}%`),
          like(individualsTable.occupation, `%${search}%`),
          like(individualsTable.interests, `%${search}%`),
          like(individualsTable.socialMediaLinks, `%${search}%`),
          like(individualsTable.emergencyContact, `%${search}%`)
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
    // Lấy tất cả các trường từ body để khớp với schema mới
    const { 
      name, contactInfo, profileImageUrl, age, dateOfBirth, relationshipStatus, 
      trustReputation, status, address, city, country, phone, occupation, bio, 
      interests, socialMediaLinks, emergencyContact, notes, userId 
    } = req.body;

    if (!name || !contactInfo) {
      return res.status(400).json({ message: 'Tên và thông tin liên hệ là bắt buộc.' });
    }

    const newIndividual = {
      name,
      contactInfo,
      profileImageUrl: profileImageUrl || null,
      age: age || null,
      dateOfBirth: dateOfBirth || null,
      relationshipStatus: relationshipStatus || null,
      trustReputation: trustReputation || null,
      status: status || 'active', // Mặc định là 'active' nếu không có
      address: address || null,
      city: city || null,
      country: country || null,
      phone: phone || null,
      occupation: occupation || null,
      bio: bio || null,
      interests: interests || null,
      socialMediaLinks: socialMediaLinks || null,
      emergencyContact: emergencyContact || null,
      notes: notes || null,
      userId: userId || null,
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

    // Lấy tất cả các trường từ body để khớp với schema mới
    const { 
      name, contactInfo, profileImageUrl, age, dateOfBirth, relationshipStatus, 
      trustReputation, status, address, city, country, phone, occupation, bio, 
      interests, socialMediaLinks, emergencyContact, notes, userId 
    } = req.body;

    const updatedIndividual: Partial<typeof individualsTable.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updatedIndividual.name = name;
    if (contactInfo !== undefined) updatedIndividual.contactInfo = contactInfo;
    if (profileImageUrl !== undefined) updatedIndividual.profileImageUrl = profileImageUrl;
    if (age !== undefined) updatedIndividual.age = age;
    if (dateOfBirth !== undefined) updatedIndividual.dateOfBirth = dateOfBirth;
    if (relationshipStatus !== undefined) updatedIndividual.relationshipStatus = relationshipStatus;
    if (trustReputation !== undefined) updatedIndividual.trustReputation = trustReputation;
    if (status !== undefined) updatedIndividual.status = status;
    if (address !== undefined) updatedIndividual.address = address;
    if (city !== undefined) updatedIndividual.city = city;
    if (country !== undefined) updatedIndividual.country = country;
    if (phone !== undefined) updatedIndividual.phone = phone;
    if (occupation !== undefined) updatedIndividual.occupation = occupation;
    if (bio !== undefined) updatedIndividual.bio = bio;
    if (interests !== undefined) updatedIndividual.interests = interests;
    if (socialMediaLinks !== undefined) updatedIndividual.socialMediaLinks = socialMediaLinks;
    if (emergencyContact !== undefined) updatedIndividual.emergencyContact = emergencyContact;
    if (notes !== undefined) updatedIndividual.notes = notes;
    if (userId !== undefined) updatedIndividual.userId = userId;


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

