import { FaArrowRight } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import ShareButton from "@/components/shareButton";
import { motion } from "framer-motion";
import CustomButton from "../ui/CustomButton";

const instructors = [
  {
    name: "Esther Howard",
    position: "Junior Instructor",
    image: "/home/inst1.png",
  },
  {
    name: "Beverly Hathcock",
    position: "Junior Instructor",
    image: "/home/inst2.png",
  },
  {
    name: "Donald Gonzales",
    position: "Junior Instructor",
    image: "/home/inst3.png",
  },
  {
    name: "Eddie Lenz",
    position: "Junior Instructor",
    image: "/home/inst4.png",
  },
];

const InstructorsSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative max-w-7xl mx-auto px-5 md:px-10 py-24 overflow-x-hidden bg-gradient-to-br from-purple-50/30 via-white to-teal-50/20 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800 rounded-3xl my-20">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-purple-100/30 dark:bg-purple-900/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-100/30 dark:bg-teal-900/10 rounded-full blur-3xl"></div>

      <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 items-center relative z-10"
      >
        <div className="p-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm font-semibold uppercase tracking-wide">
              {t("InstructorsSection.title")}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-neutral-800 dark:text-white text-3xl md:text-4xl font-bold"
          >
            {t("InstructorsSection.headline")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-neutral-600 dark:text-slate-300 leading-relaxed text-lg"
          >
            {t("InstructorsSection.description")}
          </motion.p>
          <div className="flex gap-[7px] m-[5px] mt-6 ">
            <CustomButton title={t("InstructorsSection.contactUs")} href="/support"/>
            <CustomButton title={t("InstructorsSection.findInstructor")} href="/instructors" bg={true}/>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-14 w-full h-full relative max-[600px]:grid-cols-1">
          {instructors.map((instructor, index) => (
            <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true, amount: 0.3 }}
              className="relative"
            >
              <img
                src={instructor.image}
                alt={instructor.name}
                className="w-full rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
              />
              <div className="absolute top-5 right-5">
                <ShareButton />
              </div>

              <div className="absolute -bottom-3 left-2/4 transform -translate-x-2/4 bg-white dark:bg-neutral-800 rounded-xl px-4 py-3 z-20 text-left shadow-2xl cursor-pointer border border-neutral-200 dark:border-neutral-700 hover:scale-105 transition-transform duration-300 w-[85%]">
                <h2 className="text-base font-bold dark:text-white">{instructor.name}</h2>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">{instructor.position}</p>
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                    <FaArrowRight className="text-purple-600 dark:text-purple-400 text-xs" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default InstructorsSection;
