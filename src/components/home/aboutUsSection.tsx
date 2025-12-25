import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const AboutUsSection = () => {
  const { t } = useTranslation();
  const ref = useRef(null);


  return (
    <section
      ref={ref}
      className="relative max-w-7xl mx-auto px-5 md:px-10 md:py-20 pt-32 mt-3 flex flex-col lg:flex-row justify-center items-center gap-20 min-h-screen"
    >
      {/* Decorative dots pattern */}
      <div className="absolute top-10 right-20 w-32 h-32 opacity-20">
        <div className="grid grid-cols-8 gap-2">
          {[...Array(64)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-purple-500 rounded-full"></div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.3 }}
        className="w-fit m-auto lg:w-2/4 select-none relative"
      >
        <div className="relative">
          <img
            src="/home/about.png"
            alt="about"
            className="rounded-2xl w-full h-auto shadow-2xl border-4 border-white dark:border-neutral-800"
            draggable={false}
          />
          {/* Decorative element behind image */}
          <div className="absolute -bottom-4 -right-4 w-full h-full bg-purple-200 dark:bg-purple-900/30 rounded-2xl -z-10"></div>
        </div>
      </motion.div>


      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: true, amount: 0.3 }}
        className=" w-full lg:w-2/4 flex flex-col gap-10 items-center text-center cursor-default"
      >
        <p className="text-gray-50 bg-purple-500 w-fit px-4 py-2 rounded-md font-medium inline-block">
          {t("AboutUsSection.sectionTitle")}
        </p>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-4 text-neutral-900 dark:text-white">
          {t("AboutUsSection.headline")}{" "}
          <span className="relative inline-block">{t("AboutUsSection.highlight")}</span>
          <br />
          {t("AboutUsSection.subheadline")}
        </h1>

        <p className="  text-neutral-500 dark:text-neutral-400 text-sm sm:text-base">
          {t("AboutUsSection.description")}
        </p>


        <div className="flex flex-row gap-y-7 gap-x-6 mt-6 items-start justify-center w-full">
          {["feature1", "feature2"].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              className="w-full max-w-xs bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-purple-500 rounded"></div>
              </div>
              <h6 className="font-bold text-lg text-neutral-900 dark:text-white mb-2">
                {t(`AboutUsSection.features.${feature}Title`)}
              </h6>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                {t(`AboutUsSection.features.${feature}Description`)}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default AboutUsSection;
