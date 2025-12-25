import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CourseCard from "../ui/CourseCard";
import CustomButton from "../ui/CustomButton";
import { useAuth } from "@/context/authProvider";

const CoursesSection = () => {
  const { t } = useTranslation();
  const { courses, loading } = useAuth();

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-10 md:py-20 pt-32 relative">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />

      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -z-10"
      />

      <div className="relative inline-block mb-6">
        <motion.p
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.3 }}
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold inline-block shadow-lg"
        >
          {t("CoursesSection.sectionTitle")}
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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-6 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true, amount: 0.3 }}
          className="flex-1"
        >
          <h1 className="text-neutral-800 dark:text-white text-4xl md:text-5xl font-bold leading-tight">
            {t("CoursesSection.headline")}{" "}
            <span className="relative inline-block">
              <span className="circle relative z-10 text-teal-600 dark:text-teal-400">
                {t("CoursesSection.highlight")}
              </span>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
                className="absolute bottom-1 left-0 w-full h-3 bg-teal-500/20 origin-left -z-0"
              />
            </span>{" "}
            {t("CoursesSection.subheadline")}
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-neutral-600 dark:text-neutral-400 text-lg mt-4 max-w-2xl"
          >
            Objevte naše pečlivě vybrané kurzy, které vám pomohou rozvíjet dovednosti a dosáhnout vašich cílů
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
          className="mt-4 md:mt-0"
        >
          <CustomButton
            title={t("CoursesSection.button")}
            href="/courses"
            bg={true}
            width={true}
          />
        </motion.div>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-12 items-center justify-center select-none gap-8">
        {loading
          ? [1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                className="w-full h-[400px] rounded-2xl bg-neutral-200 dark:bg-neutral-700 animate-pulse"
              />
            ))
          : courses.slice(0, 3).map((course, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.15,
                  type: "spring",
                  stiffness: 100,
                }}
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ y: -10 }}
                className="w-full"
              >
                <CourseCard
                  id={course._id}
                  image={course.thumbnail}
                  title={course.title}
                  category={course.category}
                  price={course.price}
                  rating={String(course.averageRating)}
                  description={course.description}
                  instructor={{
                    name: course.instructor.fullName,
                    avatar: course.instructor.profilePic,
                  }}
                />
              </motion.div>
            ))}
      </div>
    </section>
  );
};

export default CoursesSection;
