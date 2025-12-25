import { FaCheckCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const WhyChooseUsSection = () => {
  const { t } = useTranslation();

  const features = [
    { key: "worldClassTrainers" },
    { key: "easyLearning" },
    { key: "flexible" },
    { key: "affordablePrice" },
  ];

  return (
    <section className="relative max-w-7xl mx-auto px-5 md:px-10 py-24 flex flex-col lg:flex-row justify-between items-center gap-16 cursor-default overflow-x-hidden bg-gradient-to-br from-white via-teal-50/20 to-purple-50/20 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800 rounded-3xl my-20">
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-32 h-32 opacity-20">
        <div className="grid grid-cols-8 gap-2">
          {[...Array(64)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-teal-500 rounded-full"></div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.3 }}
        className="w-full lg:w-4/6 flex flex-col items-center lg:items-start gap-8 relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <span className="px-4 py-2 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full text-sm font-semibold uppercase tracking-wide">
            {t("WhyChooseUs.title")}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h1 className="mb-4 text-neutral-800 dark:text-white text-3xl sm:text-4xl text-center sm:text-start font-bold leading-tight">
            {t("WhyChooseUs.heading")}
          </h1>

          <p className="text-neutral-600 dark:text-neutral-400 text-base sm:text-lg text-center lg:text-start leading-relaxed">
            {t("WhyChooseUs.description")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          {features.map(({ key }, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl flex-shrink-0">
                  <FaCheckCircle className="text-purple-600 dark:text-purple-400 text-2xl" />
                </div>
                <div>
                  <h6 className="text-neutral-900 dark:text-white font-bold text-lg mb-2">
                    {t(`WhyChooseUs.features.${key}.title`)}
                  </h6>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                    {t(`WhyChooseUs.features.${key}.desc`)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true, amount: 0.3 }}
        className="w-fit m-auto lg:w-2/6 select-none"
      >
        <img
          src="/home/group.png"
          alt="group of students"
          className="w-full h-auto"
          draggable={false}
        />
      </motion.div>
    </section>
  );
};

export default WhyChooseUsSection;
