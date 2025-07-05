// src/components/LoginForm.tsx
import React, { useState, useEffect } from 'react';

// Định nghĩa props cho LoginForm
interface LoginFormProps {
  onLoginSuccess: (token: string, user: { id: number; username: string; email: string }) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({}); // Rõ ràng hơn về kiểu lỗi
  const [message, setMessage] = useState<string | null>(null); // Để hiển thị thông báo API
  const [isLoading, setIsLoading] = useState(false); // Để quản lý trạng thái loading của nút

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // Kiểm tra chế độ dark mode theo hệ thống hoặc trạng thái trước đó
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedMode || prefersDark);
  }, []);

  // Áp dụng chế độ tối vào body và lưu trạng thái
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(isDarkMode)); // Lưu boolean thành string
  }, [isDarkMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { // Thêm kiểu cho event
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined })); // Xóa lỗi khi người dùng gõ
    setMessage(null); // Xóa thông báo API khi người dùng gõ
  };

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!formData.email.trim()) newErrors.email = 'Email không được để trống';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email không hợp lệ';

    if (!formData.password) newErrors.password = 'Mật khẩu không được để trống';
    else if (formData.password.length < 6)
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => { // Thêm async và kiểu cho event
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setMessage(null); // Reset thông báo

    if (!BACKEND_URL) {
      setMessage('Lỗi: VITE_BACKEND_URL chưa được cấu hình.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        onLoginSuccess(data.token, data.user); // Gọi hàm từ App.tsx để lưu token và user
      } else {
        setMessage(data.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      setMessage('Lỗi kết nối server. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Toggle Dark Mode Button */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-4 right-4 p-2 rounded-full focus:outline-none"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      {/* Login Card */}
      <div className={`max-w-md w-full mx-auto p-8 rounded-xl shadow-lg transition-all duration-300 ${isDarkMode ? 'bg-gray-900 shadow-gray-800' : 'bg-white shadow-gray-300'}`}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Chào mừng trở lại</h1>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Đăng nhập vào tài khoản của mày</p>
        </div>

        {message && ( // Hiển thị thông báo API hoặc lỗi validation
          <div className={`p-4 rounded-md text-center mb-4 ${message.includes('thành công') ? (isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800') : (isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800')}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Địa chỉ Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="mày@ví_dụ.com"
              className={`w-full px-4 py-2 rounded-lg border focus:ring-2 outline-none transition duration-200 ${
                errors.email
                  ? 'border-red-500 focus:ring-red-200'
                  : isDarkMode
                  ? 'bg-gray-800 border-gray-600 focus:ring-blue-900'
                  : 'bg-white border-gray-300 focus:ring-blue-200'
              }`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Mật khẩu</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-4 py-2 rounded-lg border focus:ring-2 outline-none transition duration-200 ${
                errors.password
                  ? 'border-red-500 focus:ring-red-200'
                  : isDarkMode
                  ? 'bg-gray-800 border-gray-600 focus:ring-blue-900'
                  : 'bg-white border-gray-300 focus:ring-blue-200'
              }`}
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500" />
              <span className="ml-2 text-sm">Nhớ tao</span>
            </label>
            <a href="#forgot" className="text-sm text-blue-500 hover:underline">Quên mật khẩu?</a>
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isDarkMode
                ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-400'
            } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={isLoading} // Vô hiệu hóa nút khi đang loading
          >
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Chưa có tài khoản à?{' '}
            <a href="#signup" className="text-blue-500 hover:underline font-medium">Đăng ký</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
