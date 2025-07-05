// src/db/db.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { sql } from 'drizzle-orm'; // Import 'sql' cho các câu lệnh SQL trực tiếp

// Biến để lưu trữ instance của Drizzle DB, sẽ được khởi tạo một lần
let dbInstance: ReturnType<typeof drizzle> | null = null;
let dbInitialized = false;

// Hàm khởi tạo và trả về instance của Drizzle DB
export async function getDb() {
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

  // --- TẠO BẢNG TRỰC TIẾP BẰNG SQL KHI ỨNG DỤNG KHỞI ĐỘNG ---
  try {
    console.log('Đang kiểm tra và tạo schema database trực tiếp...');

    // Tạo bảng users nếu chưa tồn tại
    await dbInstance.execute(sql`
      CREATE TABLE IF NOT EXISTS "users" (
          "id" serial PRIMARY KEY NOT NULL,
          "username" text NOT NULL,
          "email" text NOT NULL,
          "password_hash" text NOT NULL,
          "created_at" timestamp DEFAULT now() NOT NULL,
          CONSTRAINT "users_email_unique" UNIQUE("email")
      );
    `);
    // Tạo index cho email (nếu chưa có)
    await dbInstance.execute(sql`
      CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "users" ("email");
    `);

    // Tạo bảng individuals nếu chưa tồn tại
    await dbInstance.execute(sql`
      CREATE TABLE IF NOT EXISTS "individuals" (
          "id" serial PRIMARY KEY NOT NULL,
          "user_id" integer NOT NULL,
          "name" text NOT NULL,
          "description" text,
          "created_at" timestamp DEFAULT now() NOT NULL,
          "updated_at" timestamp DEFAULT now() NOT NULL,
          CONSTRAINT "individuals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action
      );
    `);

    console.log('Schema database đã được tạo/kiểm tra thành công!');
    dbInitialized = true; // Đánh dấu đã khởi tạo thành công
  } catch (error) {
    console.error('Lỗi khi tạo/kiểm tra schema database:', error);
    // Ném lỗi để ngăn ứng dụng khởi động nếu DB không sẵn sàng
    throw error;
  }

  return dbInstance; // Trả về instance db đã sẵn sàng
}
