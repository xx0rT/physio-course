import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import CustomButton from "../ui/CustomButton";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="max-w-7xl mx-auto w-full min-h-screen bg-cover bg-center flex items-center px-5 md:px-10 pt-32 md:py-20">
      <div className="flex m-auto flex-col md:flex-row items-center justify-between gap-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col gap-2"
        >
          <motion.p
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true, amount: 0.3 }}
            className="uppercase text-teal-500"
          >
            {t("HeroSection.welcome")}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-4xl font-bold text-neutral-800 dark:text-white"
          >
            {t("HeroSection.title")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true, amount: 0.2 }}
            className="capitalize  text-neutral-500 dark:text-neutral-400 mt-4"
          >
            {t("HeroSection.description")}
          </motion.p>


            <CustomButton title={t("HeroSection.button")} href="/courses" bg={true} />

          
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true, amount: 0.2 }}
          className="relative flex justify-end select-none"
        >
          <img
            src="/home/hero.png"
            alt="Students in library"
            className="w-full h-auto"
            draggable={false}
          />

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true, amount: 0.2 }}
            className="instructor-card sticky -ml-20 "
          >
            <p className="text-lg font-medium text-black mb-2 ">
              <span className="text-xl font-bold text-teal-500">
                {t("HeroSection.instructorCount")}
              </span>
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
      </div>
    </section>
  );
};

export default HeroSection;
