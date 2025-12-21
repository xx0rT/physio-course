import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authProvider";
import { supabase } from "@/lib/supabase";
import { FaStar, FaRegStar, FaUsers, FaClock, FaLanguage, FaCheckCircle, FaPlay, FaCrown } from "react-icons/fa";
import { MdSignalCellularAlt } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SubscriptionPrompt from "@/components/courses/SubscriptionPrompt";

interface CourseSection {
  id: string;
  title: string;
  description: string;
  duration: number;
  order_index: number;
}

export default function CourseDetails() {
  const { id } = useParams<{ id: string }>();
  const { selectedCourse, fetchCourseById, user } = useAuth();
  const navigate = useNavigate();
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCourseById(id);
      loadCourseSections();
      if (user) {
        checkSubscription();
      }
    }
  }, [id, user]);

  const loadCourseSections = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('course_sections')
        .select('*')
        .eq('course_id', id)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      console.error('Failed to load course sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user._id)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        if (data.plan_type === 'lifetime') {
          setHasSubscription(true);
        } else if (data.end_date && new Date(data.end_date) > new Date()) {
          setHasSubscription(true);
        }
      }
    } catch (error) {
      console.error('Failed to check subscription:', error);
    }
  };

  const handleStartLearning = () => {
    if (!user) {
      toast.error("Please login to start learning");
      navigate('/login');
      return;
    }

    if (!hasSubscription) {
      toast.info("Subscribe to access this course");
      return;
    }

    navigate(`/course-player/${id}`);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-500" />
        ) : (
          <FaRegStar key={i} className="text-gray-300" />
        )
      );
    }
    return stars;
  };

  if (loading || !selectedCourse) {
    return (
      <div className="container mx-auto px-5 py-20 mt-20">
        <div className="text-center">
          <p className="text-neutral-600 dark:text-neutral-400">Loading course details...</p>
        </div>
      </div>
    );
  }

  const totalDuration = sections.reduce((sum, section) => sum + section.duration, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-neutral-900 dark:to-neutral-800">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 text-white py-24 mt-16">
        <div className="container mx-auto px-5 lg:px-10">
          <div className="grid lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2 space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">{selectedCourse.title}</h1>
              <p className="text-lg text-teal-50 leading-relaxed">{selectedCourse.description}</p>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl w-fit">
                <div className="flex">{renderStars(Math.round(selectedCourse.averageRating))}</div>
                <span className="font-bold text-xl">{selectedCourse.averageRating.toFixed(1)}</span>
                <span className="text-teal-100">({selectedCourse.totalReviews} reviews)</span>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2.5 rounded-xl hover:bg-white/20 transition-all">
                  <FaUsers className="text-xl" />
                  <span className="font-medium">{selectedCourse.totalStudents} students</span>
                </div>
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2.5 rounded-xl hover:bg-white/20 transition-all">
                  <FaClock className="text-xl" />
                  <span className="font-medium">{totalDuration} min</span>
                </div>
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2.5 rounded-xl hover:bg-white/20 transition-all">
                  <MdSignalCellularAlt className="text-xl" />
                  <span className="font-medium">{selectedCourse.level}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2.5 rounded-xl hover:bg-white/20 transition-all">
                  <FaLanguage className="text-xl" />
                  <span className="font-medium">{selectedCourse.language.join(', ')}</span>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-teal-50">Created by <span className="font-bold text-white">{selectedCourse.instructor.fullName}</span></p>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-2xl transform transition-all hover:scale-[1.02] sticky top-24">
                <div className="relative">
                  <img
                    src={selectedCourse.thumbnail}
                    alt={selectedCourse.title}
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <div className="p-6 space-y-4">
                  {hasSubscription ? (
                    <>
                      <div className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl border-2 border-green-200 dark:border-green-800">
                        <FaCheckCircle className="text-green-600 dark:text-green-400 text-xl" />
                        <span className="text-green-700 dark:text-green-300 font-bold">
                          You have access
                        </span>
                      </div>
                      <button
                        onClick={handleStartLearning}
                        className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                      >
                        <FaPlay className="text-lg" /> Start Learning
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-xl border-2 border-teal-200 dark:border-teal-800">
                        <FaCrown className="text-teal-600 dark:text-teal-400 text-xl" />
                        <span className="text-teal-700 dark:text-teal-300 font-bold">
                          Subscription Required
                        </span>
                      </div>
                      <p className="text-center text-neutral-600 dark:text-neutral-400">
                        Get unlimited access to this and all courses
                      </p>
                      <button
                        onClick={() => {
                          const element = document.getElementById('subscription-section');
                          element?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                      >
                        View Subscription Plans
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-5 lg:px-10 py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {selectedCourse.whatYouWillLearn.length > 0 && (
              <div className="bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-700">
                <h2 className="text-3xl font-bold mb-6 text-neutral-800 dark:text-white">What you'll learn</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedCourse.whatYouWillLearn.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 group">
                      <FaCheckCircle className="text-teal-500 mt-1 flex-shrink-0 text-lg group-hover:scale-110 transition-transform" />
                      <span className="text-neutral-700 dark:text-neutral-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sections.length > 0 && (
              <div className="bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-700">
                <h2 className="text-3xl font-bold mb-4 text-neutral-800 dark:text-white">Course Content</h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6 text-lg">
                  {sections.length} sections • {totalDuration} min total length
                </p>
                <div className="space-y-3">
                  {sections.map((section) => (
                    <div
                      key={section.id}
                      className="border-2 dark:border-neutral-700 rounded-xl p-5 hover:border-teal-500 hover:shadow-md dark:hover:bg-neutral-700/50 transition-all cursor-pointer"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-neutral-800 dark:text-white text-lg">{section.title}</h3>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">{section.description}</p>
                        </div>
                        <span className="text-sm text-teal-600 dark:text-teal-400 font-semibold whitespace-nowrap">{section.duration} min</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedCourse.requirements.length > 0 && (
              <div className="bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-700">
                <h2 className="text-3xl font-bold mb-6 text-neutral-800 dark:text-white">Requirements</h2>
                <ul className="space-y-3">
                  {selectedCourse.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-teal-500 font-bold mt-0.5">•</span>
                      <span className="text-neutral-700 dark:text-neutral-300">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-700">
              <h2 className="text-3xl font-bold mb-6 text-neutral-800 dark:text-white">Description</h2>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-lg">
                {selectedCourse.description}
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-700 sticky top-24">
              <h3 className="text-2xl font-bold mb-6 text-neutral-800 dark:text-white">Instructor</h3>
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={selectedCourse.instructor.profilePic || '/home/person1.png'}
                  alt={selectedCourse.instructor.fullName}
                  className="w-20 h-20 rounded-full border-4 border-teal-500 shadow-lg"
                />
                <div>
                  <h4 className="font-bold text-lg text-neutral-800 dark:text-white">
                    {selectedCourse.instructor.fullName}
                  </h4>
                  <p className="text-sm text-teal-600 dark:text-teal-400 font-medium">Instructor</p>
                </div>
              </div>
              <button
                onClick={() => navigate(`/instructors/${selectedCourse.instructor._id}`)}
                className="w-full border-2 border-teal-600 text-teal-600 dark:text-teal-400 font-bold py-3 rounded-xl hover:bg-teal-50 dark:hover:bg-neutral-700 transition-all transform hover:scale-105"
              >
                View Profile
              </button>
            </div>

            {selectedCourse.tags.length > 0 && (
              <div className="bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-700 mt-6">
                <h3 className="text-2xl font-bold mb-6 text-neutral-800 dark:text-white">Tags</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedCourse.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900 dark:to-cyan-900 text-teal-800 dark:text-teal-200 px-4 py-2 rounded-full text-sm font-semibold hover:scale-110 transition-transform cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {!hasSubscription && (
          <div id="subscription-section" className="mt-12">
            <SubscriptionPrompt courseTitle={selectedCourse.title} />
          </div>
        )}
      </div>
    </div>
  );
}
