// src/components/Sidebar.tsx
import React from 'react';
import { LayoutDashboard, LogOut, Settings, X, Users } from 'lucide-react'; // <-- Thêm icon X (dấu đóng)
import { useToast } from '../hooks/use-toast';
import { useTranslation } from '../contexts/language-context';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: 'dashboard' | 'userProfiles' | 'settings') => void;
  onLogout: () => void;
  username: string;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, onLogout, username, isOpen, onClose }) => {
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleLogoutClick = () => {
    onLogout();
    toast({
      title: t('logout.toast.title'),
      description: t('logout.toast.description'),
    });
    onClose(); // Đóng sidebar sau khi đăng xuất
  };

  const navItemClass = (page: string) =>
    `flex items-center gap-3 p-3 rounded-lg text-left w-full transition-colors duration-200 ` +
    (currentPage === page
      ? `bg-blue-700 text-white shadow-md`
      : `text-gray-300 hover:bg-gray-800 hover:text-white`);

  return (
    // Sidebar chính:
    // - w-64: chiều rộng cố định trên desktop
    // - absolute inset-y-0 left-0 z-40: vị trí tuyệt đối trên mobile
    // - transform transition-transform duration-300: hiệu ứng trượt
    // - -translate-x-full: ẩn sidebar về bên trái màn hình
    // - data-[state=open]:translate-x-0: khi state là open thì hiện ra
    // - md:relative md:translate-x-0: trên màn hình md trở lên thì chuyển về relative và luôn hiện
    <div
      className={`w-64 bg-black text-white flex flex-col h-screen p-4 shadow-xl border-r border-gray-800
                  fixed inset-y-0 left-0 z-40 transform transition-transform duration-300
                  ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                  md:relative md:translate-x-0`} // <-- THAY ĐỔI LỚN Ở ĐÂY
    >
      {/* Header của Sidebar (bao gồm nút đóng trên mobile) */}
      <div className="flex items-center justify-between gap-3 p-2 mb-8 border-b border-gray-700 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-blue-400 font-bold text-xl">UV</div>
          <h1 className="text-2xl font-bold text-white">UserVault</h1>
        </div>
        <button onClick={onClose} className="text-gray-300 hover:text-white md:hidden"> {/* Nút đóng chỉ hiện trên mobile */}
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Tên người dùng */}
      <div className="text-center mb-6 text-gray-400 text-sm">
        <p>Chào, <span className="font-semibold text-white">{username}</span>!</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        <button
          className={navItemClass('dashboard')}
          onClick={() => onNavigate('dashboard')}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>{t('sidebar.dashboard')}</span>
        </button>
        <button
          className={navItemClass('userProfiles')} // <-- Class cho userProfiles
          onClick={() => onNavigate('userProfiles')} // <-- Khi click thì điều hướng đến userProfiles
        >
          <Users className="h-5 w-5" /> {/* Icon Users */}
          <span>{t('sidebar.userProfiles')}</span> {/* Text từ bản dịch */}
        </button>
        <button
          className={navItemClass('settings')}
          onClick={() => onNavigate('settings')}
        >
          <Settings className="h-5 w-5" />
          <span>{t('sidebar.settings')}</span>
        </button>
      </nav>

      {/* Footer Sidebar (Đăng xuất) */}
      <div className="mt-auto pt-4 border-t border-gray-700">
        <button
          className="flex items-center gap-3 p-3 rounded-lg text-left w-full bg-red-700 text-white hover:bg-red-800 transition-colors duration-200 shadow-md"
          onClick={handleLogoutClick}
        >
          <LogOut className="h-5 w-5" />
          <span>{t('sidebar.logout')}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
