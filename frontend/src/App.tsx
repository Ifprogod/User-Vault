// src/App.tsx
import React, { useState, useEffect } from 'react';
import './index.css'; // Import global CSS (bao gồm Tailwind CSS)
import LoginForm from './components/LoginForm';
import Sidebar from './components/Sidebar';
import DashboardPage from './components/DashboardPage';
import SettingsPage from './components/SettingsPage'; // <-- Đảm bảo đường dẫn này đúng
import { ToastProvider } from './hooks/use-toast'; // <-- THÊM DÒNG NÀY
import { LanguageProvider } from './contexts/language-context'; // <-- THÊM DÒNG NÀY

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: number; username: string; email: string } | null>(null);
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'settings'>('dashboard'); // Trang mặc định là Dashboard

  // Kiểm tra token và user info trong localStorage khi ứng dụng khởi động
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  // Hàm xử lý khi đăng nhập thành công từ LoginForm
  const handleLoginSuccess = (newToken: string, newUser: { id: number; username: string; email: string }) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setMessage('Đăng nhập thành công!');
    setCurrentPage('dashboard'); // Sau khi đăng nhập, chuyển đến trang Dashboard
  };

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setMessage('Bạn đã đăng xuất.');
    // setCurrentPage('dashboard'); // Sau khi logout, có thể về trang dashboard hoặc login, tùy mày
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

  // Đảm bảo dark mode luôn bật cho toàn bộ ứng dụng (nền đen tuyền)
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.style.backgroundColor = '#000000'; // Nền đen tuyền cho toàn bộ body
  }, []);

  return (
    <ToastProvider> {/* Bọc toàn bộ ứng dụng bằng ToastProvider */}
      <LanguageProvider> {/* Bọc toàn bộ ứng dụng bằng LanguageProvider */}
        <div className="min-h-screen flex flex-col bg-black text-white"> {/* Nền đen tuyền cho toàn bộ app */}
          {message && (
            <p className={`mb-4 text-center p-2 ${message.includes('thành công') || message.includes('đăng xuất') ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
              {message}
            </p>
          )}

          {!token || !user ? (
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          ) : (
            <div className="flex flex-1"> {/* Sử dụng flex để sidebar và content nằm cạnh nhau */}
              {/* Sidebar */}
              <Sidebar
                currentPage={currentPage}
                onNavigate={setCurrentPage}
                onLogout={handleLogout}
                username={user.username}
              />

              {/* Main Content Area */}
              <main className="flex-1 p-4 overflow-y-auto"> {/* Thêm overflow-y-auto để cuộn nếu nội dung dài */}
                <div className="w-full max-w-4xl mx-auto"> {/* Giới hạn chiều rộng nội dung */}
                  {/* Render trang hiện tại */}
                  {currentPage === 'dashboard' && <DashboardPage />}
                  {currentPage === 'settings' && <SettingsPage />}
                </div>

                {/* Phần thông điệp backend và IP ở cuối trang */}
                <div className="w-full max-w-4xl mx-auto text-center mt-8 p-4 bg-gray-800 text-gray-400 rounded-lg shadow-md">
                  <p className="text-lg font-medium">
                    Thông điệp từ Backend: <span className="font-bold">{backendMessage}</span>
                  </p>
                  <p className="text-sm mt-2">
                    Mở trình duyệt trên thiết bị khác và truy cập:
                    <br />
                    <span className="font-mono bg-gray-700 p-1 rounded">http://192.168.1.3:5173</span>
                  </p>
                </div>
              </main>
            </div>
          )}
        </div>
      </LanguageProvider>
    </ToastProvider>
  );
}

export default App;
