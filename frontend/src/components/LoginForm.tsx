// src/components/LoginForm.tsx
import React, { useState } from 'react';

interface LoginFormProps {
  onLoginSuccess: (token: string, user: { id: number; username: string; email: string }) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@test.com'); // Đặt email admin mặc định để tiện test
  const [password, setPassword] = useState('admin'); // Đặt mật khẩu admin mặc định để tiện test
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    if (!BACKEND_URL) {
      setMessage('Lỗi: VITE_BACKEND_URL chưa được cấu hình trong .env của frontend.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Đăng nhập thành công!');
        // Lưu token vào Local Storage (hoặc Context API sau này)
        localStorage.setItem('token', data.token);
        onLoginSuccess(data.token, data.user); // Gọi callback khi đăng nhập thành công
      } else {
        setMessage(data.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu đăng nhập:', error);
      setMessage('Lỗi kết nối server. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 rounded-lg">
      <div className="w-full max-w-md bg-card p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-primary mb-6">Đăng nhập UserVault</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-input rounded-md bg-muted text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-input rounded-md bg-muted text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        {message && (
          <p className={`mt-4 text-center ${message.includes('thành công') ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}
        <p className="mt-6 text-center text-muted-foreground text-sm">
          Chưa có tài khoản? (Chức năng đăng ký sẽ được thêm sau)
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
