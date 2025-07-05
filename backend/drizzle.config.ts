import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts', // Nơi định nghĩa cấu trúc database
  out: './src/db/migrations',   // Nơi lưu trữ các file migration đã tạo
  dialect: 'postgresql',       // <-- THAY ĐỔI DÒNG NÀY: Drizzle Kit cần 'dialect'
  dbCredentials: {
    url: process.env.DATABASE_URL!, // <-- THAY ĐỔI DÒNG NÀY: Drizzle Kit CLI cần 'url'
  },
} satisfies Config;
