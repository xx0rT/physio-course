import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import CustomButton from "../ui/CustomButton";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative w-full min-h-screen flex items-center px-5 md:px-10 pt-32 md:py-20 bg-gradient-to-br from-teal-50/30 via-white to-purple-50/20 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800 overflow-hidden">
      {/* Animated decorative background elements */}
      <motion.div
        className="absolute top-20 right-10 w-72 h-72 bg-teal-100/30 dark:bg-teal-900/10 rounded-full blur-3xl"
        initial={{ opacity: 0, scale: 0, x: 100 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-96 h-96 bg-purple-100/30 dark:bg-purple-900/10 rounded-full blur-3xl"
        initial={{ opacity: 0, scale: 0, x: -100 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
      />

      <div className="max-w-7xl mx-auto w-full flex m-auto flex-col md:flex-row items-center justify-between gap-10 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-2"
        >
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <motion.p
              className="uppercase text-teal-500 font-semibold tracking-wider inline-block"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {t("HeroSection.welcome")}
            </motion.p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-800 dark:text-white leading-tight"
          >
            {t("HeroSection.title")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="text-neutral-600 dark:text-neutral-400 mt-4 text-lg leading-relaxed max-w-xl"
          >
            {t("HeroSection.description")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            className="mt-4"
          >
            <CustomButton title={t("HeroSection.button")} href="/courses" bg={true} />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 100 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="relative flex justify-end select-none"
        >
          <img
            src="/home/hero.png"
            alt="Students in library"
            className="w-full h-auto"
            draggable={false}
          />

          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
            className="instructor-card sticky -ml-20"
          >
            <p className="text-lg font-medium text-black mb-2">
              <motion.span
                className="text-xl font-bold text-teal-500"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2, type: "spring", stiffness: 200 }}
              >
                {t("HeroSection.instructorCount")}
              </motion.span>
              {t("HeroSection.instructor")}
            </p>
            <motion.img
              src="/home/heros.png"
              alt="Instructors"
              draggable={false}
              className="w-[170px] h-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.3 }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
