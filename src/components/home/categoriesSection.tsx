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
      className="relative max-w-7xl mx-auto text-center px-5 md:px-10 py-24 flex flex-col items-center bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-neutral-900 dark:via-neutral-800/50 dark:to-neutral-900"
    >
      {/* Section divider top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.3 }}
        className="mb-4"
      >
        <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm font-semibold uppercase tracking-wide">
          Prozkoumat kategorie
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: true, amount: 0.3 }}
        className="text-neutral-800 dark:text-white text-3xl md:text-4xl font-bold mb-12"
      >
        {t("CategoriesSection.title")}
      </motion.h1>

      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.05 } },
        }}
        viewport={{ once: true, amount: 0.3 }}
        className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center"
      >
        {categories.map((category, index) => (
          <motion.div
            key={index}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 10px 30px rgba(0,0,0,0.15)",
            }}
            whileTap={{scale:0.98}}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0, transition:{duration:0.5}}}
            transition={{ duration: 0.3 }}
            viewport={{ once: true, amount: 0.3 }}
            className="w-full max-w-sm p-6 flex items-center gap-4 rounded-2xl cursor-pointer shadow-md border border-white dark:border-neutral-700"
            style={{ backgroundColor: category.bgColor }}
          >
            <Link
              to={category.url}
              className="flex items-center w-full h-full"
            >
              <div
                className="rounded-full border-2 border-dashed p-4 bg-white flex items-center justify-center w-16 h-16 text-2xl"
                style={{ borderColor: category.borderColor }}
              >
                {React.createElement(category.icon, {
                  size: 40,
                  style: { color: category.borderColor },
                })}
              </div>
              <h2 className="text-lg font-bold text-neutral-800">
                {t(`CategoriesSection.categories.${category.key}`)}
              </h2>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Section divider bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent"></div>
    </section>
  );
};

export default CategoriesSection;
