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
  const { courses ,loading } = useAuth();

  return (
    <section className="relative max-w-7xl mx-auto px-5 md:px-10 py-24">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />

      {/* Decorative background blob */}
      <div className="absolute top-20 left-0 w-96 h-96 bg-teal-100/20 dark:bg-teal-900/10 rounded-full blur-3xl -z-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.3 }}
        className="mb-4"
      >
        <span className="px-4 py-2 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full text-sm font-semibold uppercase tracking-wide">
          {t("CoursesSection.sectionTitle")}
        </span>
      </motion.div>

      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-6 mb-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true, amount: 0.3 }}
          className="capitalize text-neutral-800 dark:text-white text-3xl md:text-4xl font-bold text-left"
        >
          {t("CoursesSection.headline")} <span className="circle">{t("CoursesSection.highlight")}</span>{" "}
          {t("CoursesSection.subheadline")}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <CustomButton
            title={t("CoursesSection.button")}
            href="/courses"
            bg={true}
            width={true}
          />
        </motion.div>
      </div>

      {/* Courses Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start justify-center select-none gap-6">
        {loading
          ? [1, 2, 3].map((i) => (
              <motion.div
                key={i}
                 initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, amount: 0.5 }}
                className="w-[300px] h-[300px] rounded-xl m-1 bg-neutral-400 dark:bg-neutral-700 animate-pulse"
              />
            ))
          : courses.slice(0, 3).map((course , i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, amount: 0.5 }}
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
