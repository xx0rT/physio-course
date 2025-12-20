import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaUsers, FaGraduationCap, FaStar, FaSearch } from "react-icons/fa";
import ShareButton from "@/components/shareButton";
import { useAuth } from "@/context/authProvider";
import { motion } from "framer-motion";

const InstructorsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { courses } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const instructors = useMemo(() => {
    const instructorMap = new Map();
    courses.forEach((course) => {
      const inst = course.instructor;
      if (inst && !instructorMap.has(inst._id)) {
        const instructorCourses = courses.filter(c => c.instructor._id === inst._id);
        const totalStudents = instructorCourses.reduce((sum, c) => sum + (c.totalStudents || 0), 0);
        const avgRating = instructorCourses.reduce((sum, c) => sum + (c.averageRating || 0), 0) / instructorCourses.length;

        instructorMap.set(inst._id, {
          id: inst._id,
          name: inst.fullName,
          position: "Professional Instructor",
          image: inst.profilePic || '/home/instructor1.png',
          courseCount: instructorCourses.length,
          studentCount: totalStudents,
          rating: avgRating.toFixed(1),
        });
      }
    });
    return Array.from(instructorMap.values());
  }, [courses]);

  const filteredInstructors = instructors.filter(instructor =>
    instructor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNavigate = (id: string) => {
    navigate(`/instructors/${id}`);
  };

  const totalInstructors = instructors.length;
  const totalCourses = instructors.reduce((sum, inst) => sum + inst.courseCount, 0);
  const totalStudents = instructors.reduce((sum, inst) => sum + inst.studentCount, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800">
      <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-700 dark:to-cyan-600 py-20 px-5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t("instructorsPage.title")}
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
              Learn from world-class professionals with years of experience in their fields
            </p>

            <div className="max-w-xl mx-auto relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search instructors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-full border-none bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-10 -mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
              <FaUsers className="text-3xl text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-3xl font-bold text-neutral-800 dark:text-white mb-2">
              {totalInstructors}+
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">Expert Instructors</p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 rounded-full mb-4">
              <FaGraduationCap className="text-3xl text-cyan-600 dark:text-cyan-400" />
            </div>
            <h3 className="text-3xl font-bold text-neutral-800 dark:text-white mb-2">
              {totalCourses}+
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">Courses Available</p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
              <FaStar className="text-3xl text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-3xl font-bold text-neutral-800 dark:text-white mb-2">
              {totalStudents}+
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">Happy Students</p>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20"
        >
          {filteredInstructors.length > 0 ? (
            filteredInstructors.map((instructor, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={instructor.image}
                    alt={instructor.name}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute top-4 right-4">
                    <ShareButton />
                  </div>

                  <div className="absolute top-4 left-4">
                    <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                      <FaStar className="text-yellow-500 text-sm" />
                      <span className="text-sm font-semibold text-neutral-800 dark:text-white">
                        {instructor.rating}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-2">
                    {instructor.name}
                  </h3>
                  <p className="text-cyan-600 dark:text-cyan-400 text-sm font-medium mb-4">
                    {instructor.position}
                  </p>

                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-200 dark:border-neutral-700">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-neutral-800 dark:text-white">
                        {instructor.courseCount}
                      </p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">Courses</p>
                    </div>
                    <div className="w-px h-10 bg-neutral-200 dark:bg-neutral-700" />
                    <div className="text-center">
                      <p className="text-2xl font-bold text-neutral-800 dark:text-white">
                        {instructor.studentCount}
                      </p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">Students</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleNavigate(instructor.id)}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 group"
                  >
                    View Profile
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                No instructors found matching your search.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default InstructorsPage;
