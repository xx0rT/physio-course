import React from "react";
import { useTheme } from "next-themes";
import { useTranslation } from 'react-i18next';

const TogglesMobile = () => {
    const { theme, setTheme } = useTheme();
    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
      };

   const { t, i18n } = useTranslation();

   const toggleLanguage = () => {
     const newLang = i18n.language === "en" ? "ar" : "en";
     i18n.changeLanguage(newLang);
   };

  return (
    <div className="flex gap-2 items-center">
      <button
        className=" border border-purple-500 text-purple-500 rounded-2xl p-3 px-5"
        onClick={toggleTheme}
      >
          {theme === "dark" ? "Light" : "Dark"} Mode
      </button>
      <button onClick={toggleLanguage} className='  bg-purple-500  text-white rounded-2xl p-3 px-5'>
     {t('LocaleSwitcher.switchLocale')}
    </button>
    </div>
  );
};

export default TogglesMobile;
