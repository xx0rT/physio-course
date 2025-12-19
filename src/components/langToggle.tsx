import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { fadeUp , animation , hoverScale } from "@/animation";

export default function LocaleSwitcher() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const languages = ["cs", "en", "ar"];
    const currentIndex = languages.indexOf(i18n.language);
    const nextIndex = (currentIndex + 1) % languages.length;
    i18n.changeLanguage(languages[nextIndex]);
  };

  return (
    <motion.button
      {...animation}
      {...fadeUp}
      {...hoverScale}
      onClick={toggleLanguage}
      className="cursor-pointer p-3 bg-purple-500 rounded-xl w-fit text-white"
    >
      {t("LocaleSwitcher.switchLocale")}
    </motion.button>
  );
}
