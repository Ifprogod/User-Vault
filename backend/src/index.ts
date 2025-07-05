// src/index.ts
import express from 'express';
import 'dotenv/config'; // Đảm bảo dotenv được load sớm nhất để đọc biến môi trường
import { getDb } from './db/db'; // <-- THAY ĐỔI: Import hàm getDb
import { users, individuals } from './db/schema'; // Import schema bảng users và individuals
import cors from 'cors'; // Import middleware CORS
import bcrypt from 'bcryptjs'; // Import bcrypt để mã hóa mật khẩu
import jwt from 'jsonwebtoken'; // Import jsonwebtoken để tạo và xác minh JWT
import { eq } from 'drizzle-orm'; // Import 'eq' cho các truy vấn Drizzle ORM
import { seedAdminUser } from './utils/seed'; // Import hàm gieo hạt admin

const app = express(); // Khởi tạo ứng dụng Express

// Cấu hình CORS để cho phép frontend truy cập backend
app.use(cors());

// Middleware để parse JSON body từ request
app.use(express.json());

// --- Authentication Routes ---

// Route để đăng ký người dùng mới
app.post('/api/register', async (req, res) => {
  try {
    const db = await getDb(); // Lấy db instance
    const { username, email, password } = req.body;

    // Kiểm tra xem người dùng đã tồn tại chưa
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email đã được đăng ký.' });
    }

    // Hash mật khẩu trước khi lưu vào database
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Lưu người dùng mới vào database
    const newUser = await db.insert(users).values({
      username,
      email,
      passwordHash,
    }).returning();

    res.status(201).json({ message: 'Đăng ký thành công!', user: newUser[0] });

  } catch (error) {
    console.error('Lỗi khi đăng ký:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi server khi đăng ký.' });
  }
});

// Route để đăng nhập người dùng
app.post('/api/login', async (req, res) => {
  try {
    const db = await getDb(); // Lấy db instance
    const { email, password } = req.body;

    // Tìm người dùng bằng email
    const userArray = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = userArray[0];

    if (!user) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng.' });
    }

    // So sánh mật khẩu đã hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng.' });
    }

    // Tạo JSON Web Token (JWT)
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('JWT_SECRET chưa được cấu hình trong .env file');
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, { expiresIn: '1h' });

    res.status(200).json({ message: 'Đăng nhập thành công!', token, user: { id: user.id, username: user.username, email: user.email } });

  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi server khi đăng nhập.' });
  }
});

// --- Authentication Middleware ---
// Định nghĩa interface cho Request để thêm userId
interface AuthRequest extends express.Request {
    userId?: number;
}

// Middleware xác thực JWT (để bảo vệ các route cần đăng nhập)
const authenticateToken = (req: AuthRequest, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Lấy token từ header "Bearer <token>"

    if (token == null) return res.status(401).json({ message: 'Không có token xác thực.' });

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        console.error('Lỗi: JWT_SECRET chưa được cấu hình.');
        return res.status(500).json({ message: 'Lỗi cấu hình server.' });
    }

    jwt.verify(token, jwtSecret, (err: any, user: any) => {
        if (err) return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
        req.userId = user.userId; // Gán userId vào request để sử dụng ở các route sau
        next();
    });
};

// --- API Quản lý Cá thể (Individuals) ---

// Route để Lấy TẤT CẢ cá thể của người dùng hiện tại
app.get('/api/individuals', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const db = await getDb(); // Lấy db instance
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ message: 'Không tìm thấy ID người dùng.' });
    }
    const userIndividuals = await db.select().from(individuals).where(eq(individuals.userId, userId));
    res.status(200).json(userIndividuals);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách cá thể:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi server khi lấy danh sách cá thể.' });
  }
});

// Route để Thêm một cá thể mới
app.post('/api/individuals', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const db = await getDb(); // Lấy db instance
    const userId = req.userId;
    const { name, description } = req.body;

    if (!userId || !name) {
        return res.status(400).json({ message: 'Tên cá thể và ID người dùng là bắt buộc.' });
    }

    const newIndividual = await db.insert(individuals).values({
      userId: userId,
      name: name,
      description: description,
    }).returning();

    res.status(201).json({ message: 'Cá thể đã được thêm thành công!', individual: newIndividual[0] });

  } catch (error) {
    console.error('Lỗi khi thêm cá thể:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi server khi thêm cá thể.' });
  }
});

// Route để Cập nhật một cá thể theo ID
app.put('/api/individuals/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const db = await getDb(); // Lấy db instance
    const userId = req.userId;
    const individualId = parseInt(req.params.id); // Lấy ID cá thể từ URL
    const { name, description } = req.body;

    if (!userId || !individualId || !name) {
        return res.status(400).json({ message: 'ID cá thể và tên là bắt buộc.' });
    }

    // Đảm bảo người dùng chỉ có thể cập nhật cá thể của chính họ
    const updatedIndividual = await db.update(individuals)
      .set({ name, description, updatedAt: new Date() })
      .where(eq(individuals.id, individualId))
      .where(eq(individuals.userId, userId)) // Rất quan trọng: Chỉ cho phép cập nhật của user sở hữu
      .returning();

    if (updatedIndividual.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy cá thể hoặc bạn không có quyền.' });
    }

    res.status(200).json({ message: 'Cá thể đã được cập nhật thành công!', individual: updatedIndividual[0] });

  } catch (error) {
    console.error('Lỗi khi cập nhật cá thể:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi server khi cập nhật cá thể.' });
  }
});

// Route để Xóa một cá thể theo ID
app.delete('/api/individuals/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const db = await getDb(); // Lấy db instance
    const userId = req.userId;
    const individualId = parseInt(req.params.id); // Lấy ID cá thể từ URL

    if (!userId || !individualId) {
        return res.status(400).json({ message: 'ID cá thể là bắt buộc.' });
    }

    // Đảm bảo người dùng chỉ có thể xóa cá thể của chính họ
    const deletedIndividual = await db.delete(individuals)
      .where(eq(individuals.id, individualId))
      .where(eq(individuals.userId, userId)) // Rất quan trọng: Chỉ cho phép xóa của user sở hữu
      .returning();

    if (deletedIndividual.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy cá thể hoặc bạn không có quyền.' });
    }

    res.status(200).json({ message: 'Cá thể đã được xóa thành công!' });

  } catch (error) {
    console.error('Lỗi khi xóa cá thể:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi server khi xóa cá thể.' });
  }
});

// --- End API Quản lý Cá thể ---

// Hàm khởi tạo ứng dụng và các tác vụ ban đầu
async function initApp() {
    // Lấy instance của DB. Hàm này sẽ đảm bảo schema được tạo trước khi trả về db.
    const db = await getDb();

    // Kiểm tra kết nối database sau khi đã khởi tạo schema
    try {
        await db.select().from(users).limit(1);
        console.log('Database connected successfully!');
    } catch (error) {
        console.error('Failed to connect to database:', error);
        // Nếu không kết nối được, có thể thoát ứng dụng
        process.exit(1);
    }

    // Gieo hạt tài khoản admin test sau khi database đã sẵn sàng
    await seedAdminUser();

    const PORT = process.env.PORT || 5000;

    // Định nghĩa một route API cơ bản để frontend có thể gọi và nhận phản hồi
    app.get('/', (req, res) => {
      res.send('Backend UserVault đang chạy ngon lành!');
    });

    // Khởi động server Express và lắng nghe trên cổng đã định nghĩa
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Backend UserVault đang lắng nghe tại http://localhost:${PORT}`);
    });
}

initApp(); // Gọi hàm khởi tạo ứng dụng
