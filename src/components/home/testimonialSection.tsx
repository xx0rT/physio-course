import { useTranslation } from "react-i18next";
import { FaQuoteRight, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import { useRef } from "react";

const TestimonialSection = () => {
  const { t } = useTranslation();
  const ref = useRef(null);

  const testimonials = [
    { key: "testimonial1" },
    { key: "testimonial2" },
    { key: "testimonial3" }
  ];

  return (
    <section
      ref={ref}
      className="max-w-7xl mx-auto flex flex-col gap-20 items-center justify-center text-center px-5 md:px-10 md:py-20 pt-32 relative"
    >
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10"
      />

      <div className="w-full max-w-5xl flex flex-col gap-10 items-center justify-center">
        <div className="relative inline-block">
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-white bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-3 rounded-full font-semibold text-sm tracking-wider shadow-lg uppercase"
          >
            {t("TestimonialSection.title")}
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
            className="absolute -inset-2 bg-purple-500/20 rounded-full blur-md -z-10"
          />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-center text-neutral-800 dark:text-white text-4xl md:text-5xl font-bold"
        >
          {t("TestimonialSection.headline")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-neutral-600 dark:text-neutral-400 text-lg max-w-2xl"
        >
          Zjistěte, co říkají naši studenti o svých zkušenostech s našimi kurzy
        </motion.p>

        <div className="flex flex-col justify-center items-center gap-8 w-full mt-6">
          {testimonials.map(({ key }, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                type: "spring",
                stiffness: 100
              }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-br from-white to-teal-50 dark:from-neutral-800 dark:to-neutral-900 shadow-2xl border border-teal-100 dark:border-teal-800 rounded-2xl relative p-8 flex flex-col gap-4 w-full max-w-4xl overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />

              <div className="absolute -top-4 -left-4 w-20 h-20 bg-teal-500/10 rounded-full blur-2xl" />

              <motion.span
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
                viewport={{ once: true }}
                className="absolute -top-6 -left-2 z-10 bg-gradient-to-br from-teal-500 to-teal-600 text-white p-3 rounded-full shadow-lg"
              >
                <FaQuoteRight size={32} />
              </motion.span>

              <div className="flex gap-1 mt-8 relative z-10">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.div
                    key={star}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + star * 0.05 + index * 0.15 }}
                    viewport={{ once: true }}
                  >
                    <FaStar className="text-yellow-500" size={20} />
                  </motion.div>
                ))}
              </div>

              <p className="text-neutral-700 dark:text-neutral-300 text-lg leading-relaxed relative z-10">
                {t(`TestimonialSection.testimonials.${key}.text`)}
              </p>

              <div className="flex items-center gap-4 mt-4 relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {t(`TestimonialSection.testimonials.${key}.name`).charAt(0)}
                </div>
                <div className="text-left">
                  <h2 className="text-neutral-800 dark:text-white font-bold text-lg">
                    {t(`TestimonialSection.testimonials.${key}.name`)}
                  </h2>
                  <p className="text-teal-600 dark:text-teal-400 text-sm font-semibold">
                    {t(`TestimonialSection.testimonials.${key}.position`)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
