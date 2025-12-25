import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import CustomButton from "../ui/CustomButton";

const HeroSection = () => {
  const { t } = useTranslation();

  const highlightVariants = {
    hidden: { width: 0 },
    visible: {
      width: "100%",
      transition: {
        duration: 0.8,
        delay: 0.6,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  return (
    <section className="max-w-7xl mx-auto w-full min-h-screen bg-cover bg-center flex items-center px-5 md:px-10 pt-32 md:py-20">
      <div className="flex m-auto flex-col md:flex-row items-center justify-between gap-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col gap-6 flex-1"
        >
          <div className="relative inline-block">
            <motion.p
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              className="uppercase text-teal-500 font-semibold tracking-wider text-sm md:text-base"
            >
              {t("HeroSection.welcome")}
            </motion.p>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={highlightVariants}
              className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-teal-500 to-transparent"
            />
          </div>

          <div className="relative">
            <motion.h1
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-800 dark:text-white leading-tight"
            >
              <div className="relative inline-block">
                <span className="relative z-10">
                  {t("HeroSection.title").split(" ").map((word, i) => (
                    <motion.span
                      key={i}
                      variants={letterVariants}
                      className="inline-block mr-3"
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  viewport={{ once: true }}
                  className="absolute bottom-2 left-0 w-full h-3 bg-teal-500/20 origin-left -z-0"
                />
              </div>
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true, amount: 0.2 }}
            className="relative"
          >
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500 to-teal-300 rounded-full" />
            <p className="text-neutral-600 dark:text-neutral-400 text-lg md:text-xl leading-relaxed pl-6">
              {t("HeroSection.description")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mt-4"
          >
            <CustomButton title={t("HeroSection.button")} href="/courses" bg={true} />

            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7, type: "spring", stiffness: 200 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 bg-teal-50 dark:bg-teal-900/20 px-4 py-2 rounded-full border border-teal-200 dark:border-teal-800"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 border-2 border-white dark:border-neutral-800 flex items-center justify-center text-white text-xs font-bold"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                +2k studenti
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            viewport={{ once: true }}
            className="flex gap-8 mt-4"
          >
            {[
              { label: "Kurzy", value: "50+" },
              { label: "Lektoři", value: "200+" },
              { label: "Hodnocení", value: "4.9★" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.9 + i * 0.1, type: "spring", stiffness: 150 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl font-bold text-teal-600 dark:text-teal-400">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true, amount: 0.2 }}
          className="relative flex justify-end select-none flex-1"
        >
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-6 -right-6 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -bottom-6 -left-6 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl"
            />

            <img
              src="/home/hero.png"
              alt="Students in library"
              className="w-full h-auto relative z-10"
              draggable={false}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true, amount: 0.2 }}
            className="instructor-card sticky -ml-20"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <p className="text-lg font-medium text-black mb-2">
                <span className="text-xl font-bold text-teal-500">
                  {t("HeroSection.instructorCount")}
                </span>{" "}
                {t("HeroSection.instructor")}
              </p>
              <img
                src="/home/heros.png"
                alt="Instructors"
                draggable={false}
                className="w-[170px] h-auto"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
