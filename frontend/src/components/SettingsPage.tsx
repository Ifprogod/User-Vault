"use client";

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/contexts/language-context';
import { Save } from 'lucide-react'; // Import icon Save

export default function SettingsPage({}: {}) {
  const { toast } = useToast();
  const { t, language, setLanguage } = useTranslation();

  // Các state cho cài đặt (trong ứng dụng thực tế sẽ được quản lý bằng Context/Zustand hoặc backend)
  const [darkMode, setDarkMode] = React.useState(true); // Giả định chế độ tối là mặc định
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [pushNotifications, setPushNotifications] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  // Hàm giả lập lưu cài đặt
  const handleSaveSettings = async () => {
    setIsSaving(true);
    // Trong ứng dụng thực tế, mày sẽ gửi các giá trị này lên backend
    console.log("Lưu cài đặt:", {
      darkMode,
      emailNotifications,
      pushNotifications,
      language
    });
    // Giả lập thời gian lưu
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({
      title: t('settings.saveSettings'),
      description: "Cài đặt của mày đã được lưu thành công!",
      variant: "default",
    });
    setIsSaving(false);
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 md:px-8 border-b border-gray-800 bg-black">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('settings.title')}</h1>
          <p className="text-gray-400">{t('settings.description')}</p>
        </div>
      </div>

      <main className="flex-1 p-4 md:p-8 space-y-8">
        {/* Cài đặt Ngôn ngữ */}
        <Card className="bg-gray-900 border-gray-700 text-white">
          <CardHeader>
            <CardTitle>{t('settings.languageTitle')}</CardTitle>
            <CardDescription className="text-gray-400">{t('settings.languageDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Button 
              variant={language === 'en' ? 'default' : 'outline'} 
              onClick={() => setLanguage('en')}
              className={language === 'en' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white'}
            >
              {t('settings.languageEnglish')}
            </Button>
            <Button 
              variant={language === 'vi' ? 'default' : 'outline'} 
              onClick={() => setLanguage('vi')}
              className={language === 'vi' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white'}
            >
              {t('settings.languageVietnamese')}
            </Button>
          </CardContent>
        </Card>

        {/* Cài đặt Giao diện */}
        <Card className="bg-gray-900 border-gray-700 text-white">
          <CardHeader>
            <CardTitle>{t('settings.appearanceTitle')}</CardTitle>
            <CardDescription className="text-gray-400">{t('settings.appearanceDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                <span className="text-white">{t('settings.darkModeLabel')}</span>
                <span className="font-normal leading-snug text-gray-400">
                  {t('settings.darkModeDescription')}
                </span>
              </Label>
              <Switch 
                id="dark-mode" 
                checked={darkMode} 
                onCheckedChange={(checked) => {
                  setDarkMode(checked);
                  // Thêm logic chuyển đổi dark mode ở đây (ví dụ: thêm/bỏ class 'dark' trên document.documentElement)
                  if (checked) {
                    document.documentElement.classList.add('dark');
                    document.body.style.backgroundColor = '#000000';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.body.style.backgroundColor = '#ffffff'; // Hoặc màu nền sáng mặc định
                  }
                }}
                className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-600"
              />
            </div>
          </CardContent>
        </Card>

        {/* Cài đặt Thông báo */}
        <Card className="bg-gray-900 border-gray-700 text-white">
          <CardHeader>
            <CardTitle>{t('settings.notificationsTitle')}</CardTitle>
            <CardDescription className="text-gray-400">{t('settings.notificationsDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                <span className="text-white">{t('settings.emailNotificationsLabel')}</span>
                <span className="font-normal leading-snug text-gray-400">
                  {t('settings.emailNotificationsDescription')}
                </span>
              </Label>
              <Switch 
                id="email-notifications" 
                checked={emailNotifications} 
                onCheckedChange={setEmailNotifications}
                className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-600"
              />
            </div>
            <Separator className="bg-gray-700" />
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
                <span className="text-white">{t('settings.pushNotificationsLabel')}</span>
                <span className="font-normal leading-snug text-gray-400">
                 {t('settings.pushNotificationsDescription')}
                </span>
              </Label>
              <Switch 
                id="push-notifications" 
                checked={pushNotifications} 
                onCheckedChange={setPushNotifications}
                disabled // Vẫn để disabled vì chức năng này chưa có
                className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-600"
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Cài đặt Chung (Mới) */}
        <Card className="bg-gray-900 border-gray-700 text-white">
          <CardHeader>
            <CardTitle>{t('settings.generalTitle')}</CardTitle>
            <CardDescription className="text-gray-400">{t('settings.generalDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Thêm các cài đặt chung khác ở đây nếu cần */}
            <p className="text-gray-500">
              {/* Ví dụ: "Chưa có cài đặt chung nào để hiển thị." */}
            </p>
          </CardContent>
        </Card>

        {/* Cài đặt Tài khoản */}
        <Card className="bg-gray-900 border-gray-700 text-white">
          <CardHeader>
            <CardTitle>{t('settings.accountTitle')}</CardTitle>
            <CardDescription className="text-gray-400">{t('settings.accountDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
               <Button variant="outline" className="bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white">
                 {t('settings.accountButton')}
               </Button>
          </CardContent>
        </Card>

        {/* Nút Lưu Cài đặt */}
        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSaveSettings} 
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSaving ? (
              <>
                <Save className="mr-2 h-4 w-4 animate-spin" />
                {t('settings.savingSettings')}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {t('settings.saveSettings')}
              </>
            )}
          </Button>
        </div>
      </main>
    </>
  );
}

