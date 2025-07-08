// src/db/db.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { sql } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

let dbInstance: ReturnType<typeof drizzle> | null = null;
let dbInitialized = false;

export async function getDb() {
  if (dbInstance && dbInitialized) {
    return dbInstance;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not set in .env file');
  }

  const pool = new Pool({
    connectionString: connectionString,
    ssl: {
       rejectUnauthorized: false
    }
  });

  dbInstance = drizzle(pool, { schema });
  dbInitialized = true;

  return dbInstance;
}

export async function createSchema() {
  const db = await getDb();

  try {
    console.log('Đang kiểm tra và tạo schema database trực tiếp...');

    // Tạo bảng users nếu chưa tồn tại (CHỈ CÓ THÔNG TIN CƠ BẢN)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "users" (
          "id" serial PRIMARY KEY NOT NULL,
          "name" text NOT NULL,
          "email" text NOT NULL UNIQUE,
          "password_hash" text NOT NULL,
          "status" varchar(20) DEFAULT 'active' NOT NULL,
          "created_at" timestamp DEFAULT now() NOT NULL,
          "updated_at" timestamp DEFAULT now()
      );
    `);
    // Tạo index cho email (nếu chưa có)
    await db.execute(sql`
      CREATE UNIQUE INDEX IF NOT EXISTS "users_email_unique" ON "users" ("email");
    `);

    // Tạo bảng individuals nếu chưa tồn tại (CÓ NHIỀU THÔNG TIN CHI TIẾT)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "individuals" (
          "id" serial PRIMARY KEY NOT NULL,
          "user_id" integer,
          "name" text NOT NULL,
          "contact_info" text NOT NULL,
          "profile_image_url" text,
          "age" integer,
          "date_of_birth" varchar(10),
          "relationship_status" varchar(50),
          "trust_reputation" varchar(50),
          "status" varchar(20) DEFAULT 'active' NOT NULL,
          "address" text,
          "city" varchar(100),
          "country" varchar(100),
          "phone" varchar(20),
          "occupation" text,
          "bio" text,
          "interests" text,
          "social_media_links" text,
          "emergency_contact" text,
          "notes" text,
          "created_at" timestamp DEFAULT now() NOT NULL,
          "updated_at" timestamp DEFAULT now(),
          CONSTRAINT "individuals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE
      );
    `);

    console.log('Schema database đã được tạo/kiểm tra thành công!');
  } catch (error) {
    console.error('Lỗi khi tạo/kiểm tra schema database:', error);
    throw error;
  }
}

