// src/App.tsx
import React, { useState, useEffect } from 'react';
import './index.css'; // Import global CSS (bao gồm Tailwind CSS)
import LoginForm from './components/LoginForm'; // Import component LoginForm
import IndividualList from './components/IndividualList'; // <-- THÊM DÒNG NÀY: Import IndividualList

function App() {
  // State để lưu trữ token và thông tin người dùng đã đăng nhập
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: number; username: string; email: string } | null>(null);
  const [message, setMessage] = useState(''); // State cho thông báo chung (ví dụ: đăng xuất)

  // Kiểm tra token trong localStorage khi ứng dụng khởi động
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // Để đơn giản, giả sử user info cũng được lưu hoặc lấy lại từ token
      // Trong ứng dụng thực tế, bạn sẽ cần một API để xác thực token và trả về user info
      // Tạm thời, mình sẽ đặt một user dummy nếu có token, sau này sẽ lấy từ backend
      // Khi đăng nhập thành công, user object đã có đủ thông tin
      // Để xử lý trường hợp refresh trang, bạn cần một API backend để xác thực token và trả về user info
      // Hiện tại, mình sẽ giả định user id là 1 nếu có token nhưng không có user info
      setUser({ id: 1, username: 'Người dùng', email: 'user@example.com' }); // Giá trị tạm thời
    }
  }, []);

  // Hàm xử lý khi đăng nhập thành công từ LoginForm
  const handleLoginSuccess = (newToken: string, newUser: { id: number; username: string; email: string }) => {
    setToken(newToken);
    setUser(newUser);
    setMessage('Đăng nhập thành công!');
    console.log('Đăng nhập thành công, token:', newToken, 'User:', newUser);
  };

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token'); // Xóa token khỏi localStorage
    setToken(null);
    setUser(null);
    setMessage('Bạn đã đăng xuất.');
  };

  // Giữ lại phần kiểm tra kết nối backend chung
  const [backendMessage, setBackendMessage] = useState('Đang kết nối backend...');
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchBackendMessage = async () => {
      if (!BACKEND_URL) {
        setBackendMessage('Lỗi: VITE_BACKEND_URL chưa được cấu hình trong .env của frontend.');
        return;
      }
      try {
        const response = await fetch(BACKEND_URL);
        const text = await response.text();
        setBackendMessage(text);
      } catch (error) {
        console.error('Lỗi khi kết nối backend:', error);
        setBackendMessage('Lỗi: Không thể kết nối đến backend. Đảm bảo backend đang chạy và IP đúng.');
      }
    };

    fetchBackendMessage();
  }, [BACKEND_URL]);


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4 rounded-lg">
      {message && (
        <p className={`mb-4 text-center ${message.includes('thành công') || message.includes('đăng xuất') ? 'text-green-500' : 'text-red-500'}`}>
          {message}
        </p>
      )}

      {!token || !user ? ( // Nếu chưa có token hoặc user info, hiển thị LoginForm
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      ) : ( // Nếu đã có token và user info, hiển thị IndividualList
        <div className="w-full max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">Chào mừng, {user.username}!</h2>
          <p className="text-muted-foreground mb-4">Email: {user.email}</p>
          <button
            className="px-6 py-3 bg-destructive text-destructive-foreground rounded-lg shadow-lg hover:bg-destructive/80 transition-colors mb-8"
            onClick={handleLogout}
          >
            Đăng xuất
          </button>

          {/* Hiển thị component quản lý cá thể */}
          <IndividualList token={token} userId={user.id} />

          <p className="text-xl font-medium text-center mt-8 p-4 bg-muted text-muted-foreground rounded-lg shadow-md">
            Thông điệp từ Backend: <span className="font-bold">{backendMessage}</span>
          </p>
          <p className="text-sm text-accent-foreground mt-8">
            Mở trình duyệt trên thiết bị khác và truy cập:
            <br />
            <span className="font-mono bg-muted p-1 rounded">http://192.168.1.3:5173</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
