import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

import { IoIosPerson } from "react-icons/io";
import { FaRegHandshake } from "react-icons/fa";
import { MdOutlineGroups } from "react-icons/md";
import { FaAddressBook } from "react-icons/fa";

const SkillsSection = () => {
  const { t } = useTranslation();

  const skills = [
    { key: "successfullyTrained", icon: IoIosPerson, color: "#14b8a6" },
    { key: "classesCompleted", icon: FaRegHandshake, color: "#8b5cf6" },
    { key: "satisfactionRate", icon: MdOutlineGroups, color: "#f59e0b" },
    { key: "studentsCommunity", icon: FaAddressBook, color: "#ef4444" },
  ];

  return (
    <section
      className="max-w-7xl mx-auto px-5 md:px-10 md:py-20 pt-32 bg-cover bg-center rounded-2xl flex justify-center items-center relative overflow-hidden shadow-2xl"
      style={{ backgroundImage: "url('/home/skill background.png')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 to-teal-700/80 backdrop-blur-sm" />

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 items-center text-center justify-center relative z-10 py-10">
        {skills.map((item, key) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.6,
              delay: key * 0.15,
              type: "spring",
              stiffness: 100
            }}
            viewport={{ once: true, amount: 0.3 }}
            whileHover={{
              scale: 1.1,
              y: -10,
              transition: { duration: 0.3 }
            }}
            className="flex flex-col items-center px-6 py-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl hover:bg-white/20 transition-all cursor-pointer group"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="mb-4 relative"
            >
              <div
                className="absolute inset-0 rounded-full blur-lg opacity-50"
                style={{ backgroundColor: item.color }}
              />
              {React.createElement(item.icon, {
                size: 48,
                className: "text-white relative z-10",
              })}
            </motion.div>

            <motion.h6
              className="text-white font-bold text-4xl mb-2 group-hover:scale-110 transition-transform"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 + key * 0.15 }}
              viewport={{ once: true }}
            >
              {t(`SkillsSection.skills.${item.key}.number`)}
            </motion.h6>

            <motion.p
              className="text-white/90 text-sm font-medium"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 + key * 0.15 }}
              viewport={{ once: true }}
            >
              {t(`SkillsSection.skills.${item.key}.text`)}
            </motion.p>

            <motion.div
              className="absolute inset-0 border-2 border-white/0 group-hover:border-white/30 rounded-2xl transition-all duration-300"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;
