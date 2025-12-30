import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function LocaleSwitcher() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const currentLang = i18n.language;
    const newLang = currentLang === "en" ? "cs" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="cursor-pointer p-3 bg-purple-500 rounded-xl w-fit text-white"
      onClick={toggleLanguage}
    >
      {t("LocaleSwitcher.switchLocale")}
    </motion.button>
  );
}
