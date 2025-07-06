# UserVault - Ứng dụng Quản lý Hồ sơ Người dùng Thông minh

**UserVault** là một ứng dụng web mạnh mẽ được xây dựng để quản lý thông tin người dùng và hồ sơ cá nhân (khách hàng, bạn bè, v.v.) một cách hiệu quả, tích hợp trí tuệ nhân tạo (AI) để nâng cao khả năng tương tác.

---

## 📚 Mục lục

- [Mô tả Dự án](#mô-tả-dự-án)
- [Tính năng Chính](#tính-năng-chính)
- [Công nghệ Sử dụng](#công-nghệ-sử-dụng)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Database](#database)
- [Bắt đầu Nhanh](#bắt-đầu-nhanh)
  - [Yêu cầu](#yêu-cầu)
  - [Thiết lập Backend](#thiết-lập-backend)
  - [Thiết lập Frontend](#thiết-lập-frontend)
- [Sử dụng Ứng dụng](#sử-dụng-ứng-dụng)
  - [Đăng ký và Đăng nhập](#đăng-ký-và-đăng-nhập)
  - [Quản lý Hồ sơ](#quản-lý-hồ-sơ)
  - [Tính năng AI](#tính-năng-ai)
- [Cấu trúc Database](#cấu-trúc-database)
  - [Bảng `users`](#bảng-users)
  - [Bảng `individuals`](#bảng-individuals)
- [Đóng góp](#đóng-góp)
- [Giấy phép](#giấy-phép)

---

## 🧠 Mô tả Dự án

UserVault cung cấp một nền tảng an toàn và trực quan để quản lý các tài khoản người dùng và hồ sơ cá nhân. Ứng dụng được chia thành hai phần chính:

- **Backend**: Xử lý xác thực người dùng, quản lý dữ liệu và cung cấp API CRUD.
- **Frontend**: Giao diện tương tác, quản lý hồ sơ và sử dụng AI.

---

## 🚀 Tính năng Chính

- **Xác thực Người dùng**: JWT-based đăng ký/đăng nhập an toàn.
- **Quản lý Hồ sơ Cá nhân**:
  - Xem, thêm, sửa, xóa hồ sơ.
  - Tìm kiếm theo tên/thông tin liên hệ.
- **Tích hợp Gemini AI**:
  - ✨ Tóm tắt ghi chú.
  - 💬 Soạn tin nhắn/email thân thiện.
- **Giao diện Thân thiện**: Hiện đại, dễ dùng, responsive.
- **Thông báo**: Toast thông báo thành công/thất bại rõ ràng.

---

## 🛠️ Công nghệ Sử dụng

### Frontend

- `React`, `Vite`, `TypeScript`
- `Tailwind CSS`, `shadcn/ui`
- `TanStack Query`, `Lucide React`

### Backend

- `Node.js`, `Express`, `TypeScript`
- `Drizzle ORM`, `pg`, `dotenv`, `cors`
- `bcryptjs`, `jsonwebtoken`
- `Gemini API` (Google AI)

### Database

- `PostgreSQL` (host trên [Neon](https://neon.tech))

---

## 🚀 Hướng dẫn Triển khai Dự án
### Yêu cầu
- Node.js v18+
- Termux (nếu dùng Android)
- Neon Database + DATABASE_URL

---
### Thiết lập Backend

```bash
git clone https://github.com/Ifprogod/User-Vault.git
cd User-Vault/backend
npm install
```

Tạo file .env:
```bash
PORT=5000
DATABASE_URL="<CHUỖI_KẾT_NỐI_DATABASE_CỦA_BẠN_TỪ_NEON>"
JWT_SECRET="<CHUỖI_BÍ_MẬT_MẠNH>"
```

Chạy server:
```bash
npm run dev
```

---
### Thiết lập Frontend

```bash
cd ../frontend
npm install
```

Tạo file `.env`
Tạo file `.env` trong thư mục `frontend` với nội dung sau:

```env
VITE_BACKEND_URL="http://localhost:5000"
```

Chạy ứng dụng frontend
```bash
npm run dev
```

Ứng dụng sẽ chạy tại địa chỉ: [http://localhost:5173](http://localhost:5173)

---
## 🧪 Sử dụng Ứng dụng
### Đăng ký tài khoản
Bạn có thể đăng ký bằng giao diện người dùng hoặc sử dụng lệnh `curl`:
```bash
curl -X POST -H "Content-Type: application/json" \
-d '{"name": "Tên", "email": "email@example.com", "password": "mậtkhẩu"}' \
http://localhost:5000/api/register
```

### Các chức năng chính
- **Đăng nhập / Đăng ký**
- **Quản lý hồ sơ**: Thêm, chỉnh sửa, xóa hồ sơ
- **Tìm kiếm hồ sơ**
- **Xem Dashboard** cá nhân sau khi đăng nhập

---
## 🤝 Đóng góp Dự án
Mọi sự đóng góp đều được hoan nghênh!  
👉 Vui lòng:
- Mở một **issue** nếu bạn tìm thấy lỗi
- Gửi **pull request** nếu bạn muốn cải tiến hoặc thêm tính năng mới

---
## 📄 Giấy phép
Dự án này được cấp phép theo **MIT License**.

