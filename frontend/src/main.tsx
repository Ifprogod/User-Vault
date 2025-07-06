import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Import các Providers
import { ToastProvider } from './hooks/use-toast';
import { LanguageProvider } from './contexts/language-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Khởi tạo QueryClient với defaultOptions để cấu hình staleTime
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Dữ liệu được coi là "tươi" trong 5 phút (5 * 60 * 1000 ms)
      // Nếu mày muốn nó luôn dùng cache ngay lập tức khi có, và chỉ fetch lại ngầm sau đó
      // thì có thể thêm: refetchOnMount: false, refetchOnWindowFocus: false
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </LanguageProvider>
    </ToastProvider>
  </React.StrictMode>,
);
