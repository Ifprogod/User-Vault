// src/db/db.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { sql } from 'drizzle-orm'; // Import 'sql' cho các câu lệnh SQL trực tiếp
import dotenv from 'dotenv';

dotenv.config(); // Load biến môi trường

// Biến để lưu trữ instance của Drizzle DB, sẽ được khởi tạo một lần
let dbInstance: ReturnType<typeof drizzle> | null = null;
let dbInitialized = false;

// Hàm khởi tạo và trả về instance của Drizzle DB
export async function getDb() { // <-- Đảm bảo hàm này vẫn export
  if (dbInstance && dbInitialized) {
    return dbInstance; // Trả về instance nếu đã khởi tạo
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not set in .env file');
  }

  const pool = new Pool({
    connectionString: connectionString,
    ssl: {
       rejectUnauthorized: false // Chỉ dùng trong môi trường dev nếu gặp lỗi SSL
    }
  });

  dbInstance = drizzle(pool, { schema });
  dbInitialized = true; // Đánh dấu đã khởi tạo thành công

  return dbInstance; // Trả về instance db đã sẵn sàng
}

// Hàm mới để kiểm tra và tạo schema database
export async function createSchema() { // <-- ĐÃ THÊM: Export hàm này
  const db = await getDb(); // Lấy instance db đã được khởi tạo

  try {
    console.log('Đang kiểm tra và tạo schema database trực tiếp...');

    // Tạo bảng users nếu chưa tồn tại
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "users" (
          "id" serial PRIMARY KEY NOT NULL,
          "name" text NOT NULL, -- Đã sửa từ username thành name để khớp với frontend
          "email" text NOT NULL UNIQUE,
          "password_hash" text NOT NULL,
          "age" integer,
          "date_of_birth" varchar(10),
          "status" varchar(20) DEFAULT 'active' NOT NULL,
          "relationship_status" varchar(50),
          "city" varchar(100),
          "country" varchar(100),
          "profile_image_url" text,
          "created_at" timestamp DEFAULT now() NOT NULL,
          "updated_at" timestamp DEFAULT now()
      );
    `);
    // Tạo index cho email (nếu chưa có)
    await db.execute(sql`
      CREATE UNIQUE INDEX IF NOT EXISTS "users_email_unique" ON "users" ("email");
    `);

    // Tạo bảng individuals nếu chưa tồn tại
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "individuals" (
          "id" serial PRIMARY KEY NOT NULL,
          "user_id" integer, -- Có thể NULL nếu không liên kết với user nào
          "name" text NOT NULL,
          "contact_info" text NOT NULL,
          "address" text,
          "notes" text,
          "created_at" timestamp DEFAULT now() NOT NULL,
          "updated_at" timestamp DEFAULT now(),
          CONSTRAINT "individuals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE
      );
    `);

    console.log('Schema database đã được tạo/kiểm tra thành công!');
  } catch (error) {
    console.error('Lỗi khi tạo/kiểm tra schema database:', error);
    // Ném lỗi để ngăn ứng dụng khởi động nếu DB không sẵn sàng
    throw error;
  }
}
