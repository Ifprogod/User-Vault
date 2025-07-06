// src/components/Sidebar.tsx
import React from 'react';
import { LayoutDashboard, LogOut, Settings, X, Users } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useTranslation } from '../contexts/language-context';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: 'dashboard' | 'userProfiles' | 'accountManagement' | 'settings') => void; // <-- ĐÃ SỬA
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
    onClose();
  };

  const navItemClass = (page: string) =>
    `flex items-center gap-3 p-3 rounded-lg text-left w-full transition-colors duration-200 ` +
    (currentPage === page
      ? `bg-blue-700 text-white shadow-md`
      : `text-gray-300 hover:bg-gray-800 hover:text-white`);

  return (
    <div
      className={`w-64 bg-black text-white flex flex-col h-screen p-4 shadow-xl border-r border-gray-800
                          fixed inset-y-0 left-0 z-40 transform transition-transform duration-300
                          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                          md:relative md:translate-x-0`}
    >
      <div className="flex items-center justify-between gap-3 p-2 mb-8 border-b border-gray-700 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-blue-400 font-bold text-xl">UV</div>
          <h1 className="text-2xl font-bold text-white">UserVault</h1>
        </div>
        <button onClick={onClose} className="text-gray-300 hover:text-white md:hidden">
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="text-center mb-6 text-gray-400 text-sm">
        <p>Chào, <span className="font-semibold text-white">{username}</span>!</p>
      </div>

      <nav className="flex-1 space-y-2">
        <button
          className={navItemClass('dashboard')}
          onClick={() => onNavigate('dashboard')}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>{t('sidebar.dashboard')}</span>
        </button>
        <button
          className={navItemClass('userProfiles')}
          onClick={() => onNavigate('userProfiles')}
        >
          <Users className="h-5 w-5" />
          <span>{t('sidebar.individualProfiles')}</span>
        </button>
        <button
          className={navItemClass('accountManagement')} // <-- THÊM NÚT NÀY
          onClick={() => onNavigate('accountManagement')}
        >
          <Users className="h-5 w-5" />
          <span>{t('sidebar.accountManagement')}</span> {/* <-- Key dịch mới */}
        </button>
        <button
          className={navItemClass('settings')}
          onClick={() => onNavigate('settings')}
        >
          <Settings className="h-5 w-5" />
          <span>{t('sidebar.settings')}</span>
        </button>
      </nav>

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
