// src/index.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { getDb, createSchema } from './db/db'; 
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import individualsRoute from './routes/individuals'; 

dotenv.config(); // Load biến môi trường

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Cấu hình CORS
// Để cho phép frontend truy cập từ bất kỳ miền nào trong môi trường dev
const corsOptions = {
  origin: '*', // Cho phép tất cả các nguồn (chỉ dùng trong dev)
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

app.use(express.json()); // Cho phép đọc JSON từ request body

// Test route
app.get('/', (req, res) => {
  res.send('Backend UserVault đang chạy ngon lành!');
});

// Sử dụng các routes
app.use('/api', authRoutes); // Các route xác thực sẽ bắt đầu với /api
app.use('/api', userRoutes); // Các route quản lý người dùng sẽ bắt đầu với /api
app.use('/api', individualsRoute); 

// Khởi động server
app.listen(PORT, async () => {
  console.log(`Server backend đang chạy trên cổng ${PORT}`);
  // Lấy instance db và kiểm tra kết nối database
  try {
    // Đảm bảo schema database được tạo/kiểm tra trước khi kết nối
    console.log('Đang kiểm tra và tạo schema database trực tiếp...');
    await createSchema(); // <-- ĐÃ THÊM: Gọi hàm createSchema để đảm bảo bảng được tạo
    console.log('Schema database đã được tạo/kiểm tra thành công!');

    const db = await getDb();

    // Import usersTable ở đây để tránh lỗi circular dependency nếu schema.ts cũng import db
    const { users: usersTable } = await import('./db/schema');

    // Thực hiện một truy vấn nhỏ để kiểm tra kết nối
    await db.execute(db.select().from(usersTable).limit(1));
    console.log('Kết nối database thành công!');
  } catch (error) {
    console.error('Lỗi kết nối database:', error);
    console.error('Đảm bảo DATABASE_URL trong .env của mày là đúng và database đang hoạt động.');
    process.exit(1); // Thoát ứng dụng nếu không kết nối được DB
  }
});

