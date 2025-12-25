import React, { useRef } from "react";
import { motion } from "framer-motion";
import {
  MdBusiness,
  MdPalette,
  MdSelfImprovement,
  MdDesignServices,
  MdPhoto,
  MdCampaign,
  MdStar,
  MdDevices,
  MdMovie,
} from "react-icons/md";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const CategoriesSection: React.FC = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);

  const categories = [
    {
      key: "business",
      url: "/search?q=Business",
      icon: MdBusiness,
      bgColor: "#F7F3FF",
      borderColor: "#1B75E8",
    },
    {
      key: "arts",
      url: "/search?q=Arts & Design",
      icon: MdPalette,
      bgColor: "#DCF5FF",
      borderColor: "#FF6881",
    },
    {
      key: "personalDevelopment",
      url: "/search?q=Personal Development",
      icon: MdSelfImprovement,
      bgColor: "#D1F5E4",
      borderColor: "#00BC65",
    },
    {
      key: "uiux",
      url: "/search?q=Ui/Ux",
      icon: MdDesignServices,
      bgColor: "#FFF3D9",
      borderColor: "#F2A700",
    },
    {
      key: "graphic",
      url: "/search?q=Graphic Design",
      icon: MdPhoto,
      bgColor: "#F7F3FF",
      borderColor: "#4500D0",
    },
    {
      key: "marketing",
      url: "/search?q=Marketing",
      icon: MdCampaign,
      bgColor: "#FFDAF0",
      borderColor: "#BB0064",
    },
    {
      key: "exclusive",
      url: "/search?q=Exclusive Man",
      icon: MdStar,
      bgColor: "#F3F4FE",
      borderColor: "#0011BB",
    },
    {
      key: "productDesign",
      url: "/search?q=Product Design",
      icon: MdDevices,
      bgColor: "#FFECD9",
      borderColor: "#D16900",
    },
    {
      key: "video",
      url: "/search?q=Video and Photography",
      icon: MdMovie,
      bgColor: "#DCF5FF",
      borderColor: "#00A9ED",
    },
  ];

  return (
    <section
      id="service"
      ref={sectionRef}
      className="max-w-7xl mx-auto text-center px-5 md:px-10 md:py-20 py-16 flex flex-col items-center relative"
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl -z-10"
      />

      <div className="relative inline-block mb-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full font-semibold text-sm tracking-wider shadow-lg"
        >
          {t("CategoriesSection.sectionBadge")}
        </motion.div>
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
        viewport={{ once: true, amount: 0.3 }}
        className="text-neutral-800 dark:text-white text-4xl md:text-5xl font-bold mb-4"
      >
        {t("CategoriesSection.title")}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="text-neutral-600 dark:text-neutral-400 text-lg max-w-2xl mb-12"
      >
        Prozkoumejte různé kategorie kurzů a najděte dokonalé vzdělávací cesty pro své dovednosti
      </motion.p>

      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
        }}
        viewport={{ once: true, amount: 0.2 }}
        className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 justify-items-center"
      >
        {categories.map((category, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.9 },
              visible: { opacity: 1, y: 0, scale: 1 },
            }}
            whileHover={{
              scale: 1.05,
              y: -8,
              boxShadow: "0px 20px 40px rgba(0,0,0,0.15)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            className="w-full sm:w-72 p-6 flex items-center gap-4 rounded-2xl cursor-pointer relative overflow-hidden group"
            style={{ backgroundColor: category.bgColor }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <Link
              to={category.url}
              className="flex items-center w-full h-full relative z-10"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="rounded-full border-2 border-dashed p-4 bg-white flex items-center justify-center w-16 h-16 text-2xl shadow-md flex-shrink-0"
                style={{ borderColor: category.borderColor }}
              >
                {React.createElement(category.icon, {
                  size: 32,
                  style: { color: category.borderColor },
                })}
              </motion.div>
              <h2 className="ml-4 text-lg font-bold text-neutral-800 group-hover:text-neutral-900 transition-colors">
                {t(`CategoriesSection.categories.${category.key}`)}
              </h2>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default CategoriesSection;
