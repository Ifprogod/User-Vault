// src/contexts/language-context.tsx
'use client';

import * as React from 'react';
import en from '@/lib/locales/en.json'; // Import tiếng Anh
import vi from '@/lib/locales/vi.json'; // Import tiếng Việt

type Language = 'en' | 'vi';

type LanguageContextType = {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: string, options?: { [key: string]: any }) => string; // Thêm options cho bản dịch có biến
};

const translations: Record<Language, any> = { en, vi };

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    // Mặc định ngôn ngữ là tiếng Việt
    const [language, setLanguage] = React.useState<Language>('vi');

    const t = React.useCallback((key: string, options?: { [key: string]: any }) => {
        const keys = key.split('.');
        let result: any = translations[language];
        
        // Tìm kiếm bản dịch trong ngôn ngữ hiện tại
        for (const k of keys) {
            result = result?.[k];
            if (result === undefined) {
                // Nếu không tìm thấy, fallback về tiếng Anh
                let fallbackResult: any = translations.en;
                for (const fk of keys) {
                    fallbackResult = fallbackResult?.[fk];
                }
                // Nếu vẫn không tìm thấy, trả về key gốc
                let finalResult = fallbackResult || key;

                // Thay thế biến trong bản dịch
                if (options) {
                    for (const optionKey in options) {
                        if (options.hasOwnProperty(optionKey)) {
                            finalResult = finalResult.replace(new RegExp(`\\{\\{${optionKey}\\}\\}`, 'g'), options[optionKey]);
                        }
                    }
                }
                return finalResult;
            }
        }
        
        // Nếu tìm thấy trong ngôn ngữ hiện tại, thay thế biến và trả về
        let finalResult = result || key;
        if (options) {
            for (const optionKey in options) {
                if (options.hasOwnProperty(optionKey)) {
                    finalResult = finalResult.replace(new RegExp(`\\{\\{${optionKey}\\}\\}`, 'g'), options[optionKey]);
                }
            }
        }
        return finalResult;
    }, [language]);

    // Load ngôn ngữ đã lưu từ localStorage khi khởi động
    React.useEffect(() => {
        const savedLang = localStorage.getItem('language') as Language | null;
        if (savedLang && ['en', 'vi'].includes(savedLang)) {
            setLanguage(savedLang);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const value = { language, setLanguage: handleSetLanguage, t };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useTranslation() {
    const context = React.useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
}

