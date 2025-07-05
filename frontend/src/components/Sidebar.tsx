// src/components/Sidebar.tsx
import React from 'react';
import { LayoutDashboard, LogOut, Settings } from 'lucide-react'; // <-- Import icon từ lucide-react
import { useToast } from '../hooks/use-toast'; // <-- Import useToast
import { useTranslation } from '../contexts/language-context'; // <-- Import useTranslation

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: 'dashboard' | 'settings') => void;
  onLogout: () => void;
  username: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, onLogout, username }) => {
  const { toast } = useToast(); // Dùng hook toast
  const { t } = useTranslation(); // Dùng hook dịch

  const handleLogoutClick = () => {
    onLogout();
    toast({
      title: t('logout.toast.title'),
      description: t('logout.toast.description'),
    });
  };

  const navItemClass = (page: string) =>
    `flex items-center gap-3 p-3 rounded-lg text-left w-full transition-colors duration-200 ` +
    (currentPage === page
      ? `bg-blue-700 text-white shadow-md` // Màu active (hơi xanh đậm)
      : `text-gray-300 hover:bg-gray-800 hover:text-white`); // Màu inactive (nền xám đậm khi hover)

  return (
    // Sidebar chính, với nền đen tuyền và border phải mờ
    <div className="w-64 bg-black text-white flex flex-col h-screen p-4 shadow-xl border-r border-gray-800">
      {/* Header của Sidebar */}
      <div className="flex items-center gap-3 p-2 mb-8 border-b border-gray-700 pb-4">
        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-blue-400 font-bold text-xl">UV</div> {/* Placeholder logo */}
        <h1 className="text-2xl font-bold text-white">UserVault</h1>
      </div>

      {/* Tên người dùng */}
      <div className="text-center mb-6 text-gray-400 text-sm">
        <p>Chào, <span className="font-semibold text-white">{username}</span>!</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2"> {/* Giảm khoảng cách giữa các item */}
        <button
          className={navItemClass('dashboard')}
          onClick={() => onNavigate('dashboard')}
        >
          <LayoutDashboard className="h-5 w-5" /> {/* Icon Dashboard */}
          <span>{t('sidebar.dashboard')}</span>
        </button>
        <button
          className={navItemClass('settings')}
          onClick={() => onNavigate('settings')}
        >
          <Settings className="h-5 w-5" /> {/* Icon Settings */}
          <span>{t('sidebar.settings')}</span>
        </button>
      </nav>

      {/* Footer Sidebar (Đăng xuất) */}
      <div className="mt-auto pt-4 border-t border-gray-700">
        <button
          className="flex items-center gap-3 p-3 rounded-lg text-left w-full bg-red-700 text-white hover:bg-red-800 transition-colors duration-200 shadow-md"
          onClick={handleLogoutClick} // Gọi hàm logout có toast
        >
          <LogOut className="h-5 w-5" /> {/* Icon Logout */}
          <span>{t('sidebar.logout')}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
