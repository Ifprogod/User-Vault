-- src/db/migrations/0001_black_omega_red.sql (ĐÃ SỬA ĐỔI)
CREATE TABLE "individuals" (
    "id" serial PRIMARY KEY NOT NULL,
    "user_id" integer NOT NULL,
    "name" text NOT NULL,
    "description" text,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
-- Mày đã có một unique index cho email trong bảng users rồi. 
-- Nếu dòng này tự động thêm vào, mày có thể bỏ qua nó nếu index đã tồn tại.
-- CREATE UNIQUE INDEX "email_idx" ON "users" USING btree ("email"); 
--> statement-breakpoint
ALTER TABLE "individuals" ADD CONSTRAINT "individuals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
