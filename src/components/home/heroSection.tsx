import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import CustomButton from "../ui/CustomButton";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative w-full min-h-screen flex items-center px-5 md:px-10 pt-32 pb-32 md:py-20 md:pb-40 bg-gradient-to-br from-teal-50/30 via-white to-purple-50/20 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800 transition-all duration-700 ease-in-out">
      {/* Animated decorative background elements */}
      <motion.div
        className="absolute top-20 right-10 w-72 h-72 bg-teal-100/30 dark:bg-teal-900/10 rounded-full blur-3xl"
        initial={{ opacity: 0, scale: 0, x: 100 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <motion.div
        className="absolute -bottom-40 left-10 w-96 h-96 bg-purple-100/30 dark:bg-purple-900/10 rounded-full blur-3xl"
        initial={{ opacity: 0, scale: 0, x: -100 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
      />
      {/* Extended background gradient */}
      <div className="absolute inset-x-0 -bottom-32 h-64 bg-gradient-to-b from-transparent via-teal-50/20 to-purple-50/10 dark:via-neutral-900/50 dark:to-neutral-800/30 pointer-events-none" />

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
            className="mt-6 flex flex-col sm:flex-row gap-4"
          >
            <CustomButton title={t("HeroSection.button")} href="/courses" bg={true} />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-lg border-2 border-teal-500 text-teal-600 dark:text-teal-400 font-semibold hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
              onClick={() => window.location.href = '/instructors'}
            >
              Naši odborníci
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
            className="mt-8 flex flex-wrap items-center gap-6"
          >
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-teal-600 dark:text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-800 dark:text-white">Certifikovaní fyzioterapeuti</p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">S licencí ČR</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-800 dark:text-white">3500+ spokojených klientů</p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Za poslední rok</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-800 dark:text-white">98% úspěšnost</p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Hodnocení 4.9/5</p>
              </div>
            </div>
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
