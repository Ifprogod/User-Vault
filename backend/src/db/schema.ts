// src/db/schema.ts
import { pgTable, serial, text, timestamp, uniqueIndex, pgEnum, integer } from 'drizzle-orm/pg-core';
// ... (giữ nguyên các import hiện có) ...

// Định nghĩa bảng 'users'
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (users) => {
  return {
    emailIdx: uniqueIndex('email_idx').on(users.email),
  };
});

// Định nghĩa bảng 'individuals'
export const individuals = pgTable('individuals', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
