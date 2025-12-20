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
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      <ToastContainer position="top-right" autoClose={3000} />

      <div style={{ background: 'linear-gradient(135deg, #704FE6 0%, #1e2a47 100%)' }} className="text-white py-20 mt-16">
        <div className="container mx-auto px-5">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h1 className="text-4xl font-bold mb-4">{selectedCourse.title}</h1>
              <p className="text-lg mb-6 opacity-90">{selectedCourse.description}</p>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex">{renderStars(Math.round(selectedCourse.averageRating))}</div>
                <span className="font-semibold">{selectedCourse.averageRating.toFixed(1)}</span>
                <span className="opacity-90">({selectedCourse.totalReviews} reviews)</span>
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                  <FaUsers />
                  <span>{selectedCourse.totalStudents} students</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                  <FaClock />
                  <span>{totalDuration} min</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                  <MdSignalCellularAlt />
                  <span>{selectedCourse.level}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                  <FaLanguage />
                  <span>{selectedCourse.language.join(', ')}</span>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm opacity-90">Created by <span className="font-semibold">{selectedCourse.instructor.fullName}</span></p>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="bg-white dark:bg-neutral-800 rounded-lg overflow-hidden shadow-xl">
                <img
                  src={selectedCourse.thumbnail}
                  alt={selectedCourse.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  {hasSubscription ? (
                    <>
                      <div className="flex items-center justify-center gap-2 mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <FaCheckCircle className="text-green-600 dark:text-green-400" />
                        <span className="text-green-700 dark:text-green-300 font-semibold">
                          You have access
                        </span>
                      </div>
                      <button
                        onClick={handleStartLearning}
                        className="w-full button1 font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
                      >
                        <FaPlay /> Start Learning
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-center gap-2 mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <FaCrown className="text-purple-600 dark:text-purple-400" />
                        <span className="text-purple-700 dark:text-purple-300 font-semibold text-sm">
                          Subscription Required
                        </span>
                      </div>
                      <p className="text-center text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                        Get unlimited access to this and all courses
                      </p>
                      <button
                        onClick={() => {
                          const element = document.getElementById('subscription-section');
                          element?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="w-full button1 font-semibold py-3 rounded-lg"
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

      <div className="container mx-auto px-5 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {selectedCourse.whatYouWillLearn.length > 0 && (
              <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4 text-neutral-800 dark:text-white">What you'll learn</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {selectedCourse.whatYouWillLearn.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-neutral-700 dark:text-neutral-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sections.length > 0 && (
              <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4 text-neutral-800 dark:text-white">Course Content</h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  {sections.length} sections • {totalDuration} min total length
                </p>
                <div className="space-y-2">
                  {sections.map((section) => (
                    <div
                      key={section.id}
                      className="border dark:border-neutral-700 rounded p-4 hover:bg-gray-50 dark:hover:bg-neutral-700"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-neutral-800 dark:text-white">{section.title}</h3>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{section.description}</p>
                        </div>
                        <span className="text-sm text-neutral-500 ml-4">{section.duration} min</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedCourse.requirements.length > 0 && (
              <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4 text-neutral-800 dark:text-white">Requirements</h2>
                <ul className="list-disc list-inside space-y-2">
                  {selectedCourse.requirements.map((req, index) => (
                    <li key={index} className="text-neutral-700 dark:text-neutral-300">{req}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4 text-neutral-800 dark:text-white">Description</h2>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {selectedCourse.description}
              </p>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow sticky top-24">
              <h3 className="text-xl font-bold mb-4 text-neutral-800 dark:text-white">Instructor</h3>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={selectedCourse.instructor.profilePic || '/home/person1.png'}
                  alt={selectedCourse.instructor.fullName}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-neutral-800 dark:text-white">
                    {selectedCourse.instructor.fullName}
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Instructor</p>
                </div>
              </div>
              <button
                onClick={() => navigate(`/instructors/${selectedCourse.instructor._id}`)}
                className="w-full border-2 border-purple-600 text-purple-600 dark:text-purple-400 font-semibold py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-neutral-700"
              >
                View Profile
              </button>
            </div>

            {selectedCourse.tags.length > 0 && (
              <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow mt-6">
                <h3 className="text-xl font-bold mb-4 text-neutral-800 dark:text-white">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCourse.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm"
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
