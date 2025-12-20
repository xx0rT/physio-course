import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authProvider";
import { supabase } from "@/lib/supabase";
import {
  FaTrophy,
  FaFire,
  FaGraduationCap,
  FaChartLine,
  FaClock,
  FaLock,
  FaCheckCircle,
  FaPlay,
  FaCrown,
  FaStar
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface UserStats {
  level: number;
  xp: number;
  total_courses_completed: number;
  total_lessons_completed: number;
  current_streak: number;
  longest_streak: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlocked_at?: string;
}

interface EnrolledCourse {
  id: string;
  title: string;
  thumbnail: string;
  progress_percentage: number;
  last_accessed: string;
  instructor_info: any;
}

interface NextCourse {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  isLocked: boolean;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [nextCourses, setNextCourses] = useState<NextCourse[]>([]);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      await Promise.all([
        loadUserStats(),
        loadAchievements(),
        loadEnrolledCourses(),
        loadNextCourses(),
        checkSubscription()
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user._id)
      .maybeSingle();

    if (error) throw error;
    setStats(data || {
      level: 1,
      xp: 0,
      total_courses_completed: 0,
      total_lessons_completed: 0,
      current_streak: 0,
      longest_streak: 0
    });
  };

  const loadAchievements = async () => {
    if (!user) return;

    const { data: allAchievements } = await supabase
      .from('achievements')
      .select('*')
      .order('requirement_value', { ascending: true });

    const { data: userAchievements } = await supabase
      .from('user_achievements')
      .select('achievement_id, unlocked_at')
      .eq('user_id', user._id);

    const achievementsMap = (allAchievements || []).map(achievement => ({
      ...achievement,
      unlocked: userAchievements?.some(ua => ua.achievement_id === achievement.id) || false,
      unlocked_at: userAchievements?.find(ua => ua.achievement_id === achievement.id)?.unlocked_at
    }));

    setAchievements(achievementsMap);
  };

  const loadEnrolledCourses = async () => {
    if (!user) return;

    const { data: enrollments } = await supabase
      .from('enrollments')
      .select(`
        *,
        courses:course_id (
          id,
          title,
          thumbnail,
          instructor_info
        )
      `)
      .eq('user_id', user._id)
      .order('last_accessed', { ascending: false })
      .limit(3);

    const coursesData = (enrollments || []).map(enrollment => ({
      id: enrollment.courses.id,
      title: enrollment.courses.title,
      thumbnail: enrollment.courses.thumbnail,
      progress_percentage: enrollment.progress_percentage || 0,
      last_accessed: enrollment.last_accessed,
      instructor_info: enrollment.courses.instructor_info
    }));

    setEnrolledCourses(coursesData);
  };

  const loadNextCourses = async () => {
    if (!user) return;

    const { data: allCourses } = await supabase
      .from('courses')
      .select('id, title, thumbnail, description')
      .eq('is_published', true)
      .eq('approval_status', 'approved')
      .limit(3);

    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('course_id')
      .eq('user_id', user._id);

    const enrolledIds = new Set(enrollments?.map(e => e.course_id) || []);

    const nextCoursesData = (allCourses || [])
      .filter(course => !enrolledIds.has(course.id))
      .map(course => ({
        ...course,
        isLocked: false
      }));

    setNextCourses(nextCoursesData.slice(0, 3));
  };

  const checkSubscription = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user._id)
      .eq('status', 'active')
      .maybeSingle();

    setHasSubscription(!!data);
  };

  const getLevelProgress = () => {
    if (!stats) return 0;
    const xpForNextLevel = stats.level * 100;
    const xpInCurrentLevel = stats.xp % xpForNextLevel;
    return (xpInCurrentLevel / xpForNextLevel) * 100;
  };

  const getNextLevelXP = () => {
    if (!stats) return 100;
    return stats.level * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 pt-16">
      <ToastContainer position="top-right" autoClose={3000} />

      <div style={{ background: 'linear-gradient(135deg, #704FE6 0%, #1e2a47 100%)' }} className="text-white py-12">
        <div className="container mx-auto px-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div>
                <h1 className="text-3xl font-bold">Welcome back, {user?.firstName}!</h1>
                <p className="opacity-90">Continue your learning journey</p>
              </div>
            </div>

            {hasSubscription ? (
              <div className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-full">
                <FaCrown className="text-yellow-400" />
                <span className="font-semibold">Premium Member</span>
              </div>
            ) : (
              <button
                onClick={() => navigate('/courses')}
                className="button1 px-6 py-3 rounded-full font-semibold"
              >
                Get Premium Access
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-5 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <FaTrophy className="text-2xl text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {stats?.level || 1}
              </span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-2">Current Level</p>
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 mb-1">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all"
                style={{ width: `${getLevelProgress()}%` }}
              />
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {stats?.xp || 0} / {getNextLevelXP()} XP
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                <FaFire className="text-2xl text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {stats?.current_streak || 0}
              </span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">Day Streak</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Longest: {stats?.longest_streak || 0} days
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <FaGraduationCap className="text-2xl text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {stats?.total_courses_completed || 0}
              </span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">Courses Completed</p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <FaChartLine className="text-2xl text-green-600 dark:text-green-400" />
              </div>
              <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                {stats?.total_lessons_completed || 0}
              </span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">Lessons Completed</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">
                  Continue Learning
                </h2>
                <button
                  onClick={() => navigate('/my-learning')}
                  className="text-purple-600 dark:text-purple-400 hover:underline text-sm"
                >
                  View All
                </button>
              </div>

              {enrolledCourses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                    You haven't started any courses yet
                  </p>
                  <button
                    onClick={() => navigate('/courses')}
                    className="button1 px-6 py-2 rounded-lg"
                  >
                    Browse Courses
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrolledCourses.map((course) => (
                    <div
                      key={course.id}
                      onClick={() => navigate(`/course-player/${course.id}`)}
                      className="flex items-center gap-4 p-4 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 cursor-pointer transition-all group"
                    >
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-24 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-neutral-800 dark:text-white mb-1 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400">
                          {course.title}
                        </h3>
                        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 mb-1">
                          <div
                            className="bg-purple-500 h-2 rounded-full transition-all"
                            style={{ width: `${course.progress_percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {course.progress_percentage}% complete
                        </p>
                      </div>
                      <FaPlay className="text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow">
              <h2 className="text-2xl font-bold text-neutral-800 dark:text-white mb-6">
                Recommended Next
              </h2>

              {nextCourses.length === 0 ? (
                <p className="text-center text-neutral-600 dark:text-neutral-400 py-8">
                  No recommendations available
                </p>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {nextCourses.map((course) => (
                    <div
                      key={course.id}
                      onClick={() => !course.isLocked && navigate(`/course-details/${course.id}`)}
                      className={`rounded-lg overflow-hidden shadow hover:shadow-lg transition-all ${
                        course.isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-32 object-cover"
                        />
                        {course.isLocked && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <FaLock className="text-white text-2xl" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-neutral-800 dark:text-white mb-2 line-clamp-2">
                          {course.title}
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                          {course.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow">
              <h2 className="text-xl font-bold text-neutral-800 dark:text-white mb-4">
                Achievements
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {achievements.slice(0, 8).map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      achievement.unlocked
                        ? 'bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500'
                        : 'bg-neutral-50 dark:bg-neutral-700/50 opacity-60'
                    }`}
                  >
                    <div className="text-2xl">
                      {achievement.unlocked ? achievement.icon : '🔒'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-neutral-800 dark:text-white truncate">
                        {achievement.name}
                      </h4>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.unlocked && (
                      <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-6 shadow text-white">
              <div className="flex items-center gap-2 mb-3">
                <FaCrown className="text-2xl text-yellow-300" />
                <h3 className="text-xl font-bold">Level {stats?.level || 1}</h3>
              </div>
              <p className="text-sm opacity-90 mb-4">
                Keep learning to reach the next level and unlock more features!
              </p>
              <div className="bg-white/20 rounded-lg p-3 text-sm">
                <div className="flex justify-between mb-1">
                  <span>XP Progress</span>
                  <span className="font-semibold">{stats?.xp || 0} / {getNextLevelXP()}</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-3">
                  <div
                    className="bg-white h-3 rounded-full transition-all"
                    style={{ width: `${getLevelProgress()}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
