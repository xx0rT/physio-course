import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const AboutUsSection = () => {
  const { t } = useTranslation();
  const ref = useRef(null);

  return (
    <section
      ref={ref}
      className="max-w-7xl mx-auto px-5 md:px-10 md:py-20 pt-32 mt-3 flex flex-col lg:flex-row justify-center items-center gap-20 min-h-screen relative"
    >
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-10 left-10 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl -z-10"
      />

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
        className="w-fit m-auto lg:w-2/4 select-none relative"
      >
        <div className="relative">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="absolute -top-4 -right-4 w-20 h-20 bg-teal-500/20 rounded-full blur-xl"
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="absolute -bottom-4 -left-4 w-32 h-32 bg-yellow-500/20 rounded-full blur-xl"
          />
          <img
            src="/home/about.png"
            alt="about"
            className="rounded-lg w-full h-auto relative z-10 shadow-2xl"
            draggable={false}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true, amount: 0.3 }}
        className="w-full lg:w-2/4 flex flex-col gap-8 items-center lg:items-start text-center lg:text-left cursor-default"
      >
        <div className="relative inline-block">
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-white bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-3 rounded-full font-semibold text-sm tracking-wider shadow-lg"
          >
            {t("AboutUsSection.sectionTitle")}
          </motion.p>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -inset-2 bg-teal-500/20 rounded-full blur-md -z-10"
          />
        </div>

        <div className="relative">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white leading-tight"
          >
            {t("AboutUsSection.headline")}{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-teal-600 dark:text-teal-400">
                {t("AboutUsSection.highlight")}
              </span>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
                className="absolute bottom-1 left-0 w-full h-3 bg-teal-500/20 origin-left -z-0"
              />
            </span>
            <br />
            {t("AboutUsSection.subheadline")}
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500 to-teal-300 rounded-full hidden lg:block" />
          <p className="text-neutral-600 dark:text-neutral-400 text-base sm:text-lg leading-relaxed lg:pl-6">
            {t("AboutUsSection.description")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4 w-full">
          {["feature1", "feature2"].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-teal-50 to-white dark:from-teal-900/10 dark:to-neutral-800 p-6 rounded-xl shadow-lg border border-teal-100 dark:border-teal-800 cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h6 className="font-bold text-lg text-neutral-900 dark:text-white mb-2">
                    {t(`AboutUsSection.features.${feature}Title`)}
                  </h6>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                    {t(`AboutUsSection.features.${feature}Description`)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default AboutUsSection;
