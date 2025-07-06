// src/lib/queryClient.ts
// Hàm để gửi yêu cầu API, có kèm theo token từ localStorage
export const apiRequest = async (method: string, url: string, data?: any) => {
  const token = localStorage.getItem('token'); // Lấy token từ localStorage
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'; // Đảm bảo có BACKEND_URL

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`; // Thêm token vào header
  }

  const response = await fetch(`${BACKEND_URL}${url}`, { // Sử dụng BACKEND_URL
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'API request failed');
  }

  return response;
};
