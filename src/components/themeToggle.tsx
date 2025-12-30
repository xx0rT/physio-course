import React from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="p-3 rounded-xl bg-purple-500 mt-6 text-white cursor-pointer"
      onClick={toggleTheme}
    >
      {theme === "dark" ? "Light" : "Dark"} Mode
    </motion.button>
  );
}
