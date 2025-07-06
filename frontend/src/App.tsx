// src/App.tsx
import React, { useState, useEffect } from 'react';
import './index.css';
import LoginForm from './components/LoginForm';
import Sidebar from './components/Sidebar';
import DashboardPage from './components/DashboardPage';
import SettingsPage from './components/SettingsPage';
import { UserManagement } from './components/UserManagement'; // <-- Import UserManagement
import { ToastProvider } from './hooks/use-toast';
import { LanguageProvider } from './contexts/language-context';
import { Menu } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Khởi tạo QueryClient bên ngoài component để nó không bị tạo lại mỗi lần render
const queryClient = new QueryClient();

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: number; username: string; email: string } | null>(null);
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'userProfiles' | 'settings'>('dashboard'); // Đặt trang mặc định là Dashboard
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

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

  const handleLoginSuccess = (newToken: string, newUser: { id: number; username: string; email: string }) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setMessage('Đăng nhập thành công!');
    setCurrentPage('dashboard');
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setMessage('Bạn đã đăng xuất.');
  };

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

  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.style.backgroundColor = '#000000';
  }, []);

  return (
    <ToastProvider>
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <div className="min-h-screen flex flex-col bg-black text-white">
            {message && (
              <p className={`mb-4 text-center p-2 ${message.includes('thành công') || message.includes('đăng xuất') ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                {message}
              </p>
            )}

            {!token || !user ? (
              <LoginForm onLoginSuccess={handleLoginSuccess} />
            ) : (
              <div className="flex flex-1 relative">
                <Sidebar
                  currentPage={currentPage}
                  onNavigate={(page) => {
                    setCurrentPage(page);
                    closeSidebar();
                  }}
                  onLogout={handleLogout}
                  username={user.username}
                  isOpen={isSidebarOpen}
                  onClose={closeSidebar}
                />

                {isSidebarOpen && (
                  <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={closeSidebar}
                  ></div>
                )}

                <main className="flex-1 p-4 overflow-y-auto">
                  <header className="flex items-center p-4 border-b border-gray-800 bg-black md:hidden sticky top-0 z-20">
                    <button onClick={toggleSidebar} className="text-gray-300 hover:text-white mr-4">
                      <Menu className="h-6 w-6" />
                    </button>
                    <h2 className="text-xl font-bold text-white">UserVault</h2>
                  </header>

                  <div className="w-full max-w-4xl mx-auto">
                    {currentPage === 'dashboard' && <DashboardPage />}
                    {currentPage === 'userProfiles' && <UserManagement />} {/* <-- Render UserManagement */}
                    {currentPage === 'settings' && <SettingsPage />}
                  </div>

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
        </QueryClientProvider>
      </LanguageProvider>
    </ToastProvider>
  );
}

export default App;
