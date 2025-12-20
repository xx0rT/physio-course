import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authProvider";
import { supabase } from "@/lib/supabase";
import {
  FaTrophy,
  FaFire,
  FaGraduationCap,
  FaChartLine,
  FaUser,
  FaCog,
  FaLock,
  FaCreditCard,
  FaCrown,
  FaSignOutAlt,
  FaCheckCircle,
  FaPlay,
  FaStar,
  FaBars,
  FaEnvelope,
  FaUsers,
  FaCalendar,
  FaCertificate,
  FaBell,
  FaHeadset,
  FaStickyNote,
  FaBook
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileOverview from "@/components/dashboard/ProfileOverview";
import CertificatesSection from "@/components/dashboard/CertificatesSection";
import MessagesSection from "@/components/dashboard/MessagesSection";
import CommunitySection from "@/components/dashboard/CommunitySection";
import PersonalNotesSection from "@/components/dashboard/PersonalNotesSection";

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
}

type SidebarTab = 'dashboard' | 'my-courses' | 'progress' | 'certificates' | 'schedule' | 'messages' | 'community' | 'notes' | 'settings' | 'support';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SidebarTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
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
        checkSubscription()
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error("Nepodařilo se načíst data");
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
          thumbnail
        )
      `)
      .eq('user_id', user._id)
      .order('last_accessed', { ascending: false })
      .limit(5);

    const coursesData = (enrollments || []).map(enrollment => ({
      id: enrollment.courses.id,
      title: enrollment.courses.title,
      thumbnail: enrollment.courses.thumbnail,
      progress_percentage: enrollment.progress_percentage || 0,
      last_accessed: enrollment.last_accessed
    }));

    setEnrolledCourses(coursesData);
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

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      toast.error("Odhlášení se nezdařilo");
    }
  };

  const renderDashboardContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <ProfileOverview />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <FaTrophy className="text-2xl text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {stats?.level || 1}
                  </span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-2">Aktuální úroveň</p>
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
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">Denní série</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Nejdelší: {stats?.longest_streak || 0} dní
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
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">Dokončené kurzy</p>
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
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">Dokončené lekce</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">
                      Pokračovat v učení
                    </h2>
                    <button
                      onClick={() => navigate('/my-learning')}
                      className="text-purple-600 dark:text-purple-400 hover:underline text-sm"
                    >
                      Zobrazit vše
                    </button>
                  </div>

                  {enrolledCourses.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                        Ještě jste nezačali žádný kurz
                      </p>
                      <button
                        onClick={() => navigate('/courses')}
                        className="button1 px-6 py-2 rounded-lg"
                      >
                        Procházet kurzy
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
                              {course.progress_percentage}% dokončeno
                            </p>
                          </div>
                          <FaPlay className="text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow">
                  <h2 className="text-xl font-bold text-neutral-800 dark:text-white mb-4">
                    Úspěchy
                  </h2>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {achievements.slice(0, 6).map((achievement) => (
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
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-6 shadow text-white">
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FaCrown className="text-2xl text-yellow-300" />
                    <h3 className="text-2xl font-bold">Úroveň {stats?.level || 1}</h3>
                  </div>
                  <p className="text-sm opacity-90 mb-4">
                    Pokračujte v učení a dosáhněte další úrovně!
                  </p>
                  <div className="bg-white/20 rounded-lg p-3 text-sm">
                    <div className="flex justify-between mb-1">
                      <span>Pokrok XP</span>
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
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-bold mb-3">Vaše statistiky</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Celkové XP:</span>
                      <span className="font-semibold">{stats?.xp || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Kurzy:</span>
                      <span className="font-semibold">{stats?.total_courses_completed || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lekce:</span>
                      <span className="font-semibold">{stats?.total_lessons_completed || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Série:</span>
                      <span className="font-semibold">{stats?.current_streak || 0} dní</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'my-courses':
        return (
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow">
            <h2 className="text-2xl font-bold text-neutral-800 dark:text-white mb-6">
              Moje kurzy
            </h2>
            <div className="space-y-4">
              {enrolledCourses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                    Ještě jste nezačali žádný kurz
                  </p>
                  <button
                    onClick={() => navigate('/courses')}
                    className="button1 px-6 py-2 rounded-lg"
                  >
                    Procházet kurzy
                  </button>
                </div>
              ) : (
                enrolledCourses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => navigate(`/course-player/${course.id}`)}
                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 cursor-pointer transition-all group border border-neutral-200 dark:border-neutral-700"
                  >
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-32 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-neutral-800 dark:text-white mb-2 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {course.title}
                      </h3>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3 mb-1">
                        <div
                          className="bg-blue-500 h-3 rounded-full transition-all"
                          style={{ width: `${course.progress_percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {course.progress_percentage}% dokončeno
                      </p>
                    </div>
                    <FaPlay className="text-blue-600 dark:text-blue-400 text-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case 'progress':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow">
              <h2 className="text-2xl font-bold text-neutral-800 dark:text-white mb-6">
                Pokrok a statistiky
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between mb-4">
                    <FaTrophy className="text-3xl text-blue-600 dark:text-blue-400" />
                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {stats?.level || 1}
                    </span>
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 font-semibold">Úroveň</p>
                  <div className="w-full bg-blue-200 dark:bg-blue-900 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all"
                      style={{ width: `${getLevelProgress()}%` }}
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center justify-between mb-4">
                    <FaFire className="text-3xl text-orange-600 dark:text-orange-400" />
                    <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                      {stats?.current_streak || 0}
                    </span>
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 font-semibold">Denní série</p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                    Nejdelší: {stats?.longest_streak || 0} dní
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between mb-4">
                    <FaGraduationCap className="text-3xl text-green-600 dark:text-green-400" />
                    <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {stats?.total_courses_completed || 0}
                    </span>
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 font-semibold">Kurzy dokončeny</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center justify-between mb-4">
                    <FaChartLine className="text-3xl text-purple-600 dark:text-purple-400" />
                    <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {stats?.total_lessons_completed || 0}
                    </span>
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 font-semibold">Lekce dokončeny</p>
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
                <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-4">
                  Úspěchy
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-xl text-center transition-all ${
                        achievement.unlocked
                          ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-400 dark:border-yellow-600'
                          : 'bg-neutral-50 dark:bg-neutral-700/50 opacity-50'
                      }`}
                    >
                      <div className="text-4xl mb-2">
                        {achievement.unlocked ? achievement.icon : '🔒'}
                      </div>
                      <h4 className="font-semibold text-sm text-neutral-800 dark:text-white">
                        {achievement.name}
                      </h4>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                        {achievement.description}
                      </p>
                      {achievement.unlocked && achievement.unlocked_at && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                          ✓ Odemčeno
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'certificates':
        return (
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow">
            <CertificatesSection />
          </div>
        );

      case 'schedule':
        return (
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow">
            <div className="flex items-center gap-3 mb-6">
              <FaCalendar className="text-3xl text-blue-600 dark:text-blue-400" />
              <div>
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">
                  Plán lekcí
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Naplánujte si konzultace a živá sezení
                </p>
              </div>
            </div>
            <div className="text-center py-12 text-neutral-600 dark:text-neutral-400">
              <FaCalendar className="text-6xl mx-auto mb-4 opacity-50" />
              <p>Žádné naplánované lekce</p>
              <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                Naplánovat konzultaci
              </button>
            </div>
          </div>
        );

      case 'messages':
        return <MessagesSection />;

      case 'community':
        return (
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow">
            <CommunitySection />
          </div>
        );

      case 'notes':
        return (
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow">
            <PersonalNotesSection />
          </div>
        );

      case 'settings':
        return (
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow">
            <h2 className="text-2xl font-bold text-neutral-800 dark:text-white mb-6">
              Nastavení účtu
            </h2>

            <div className="space-y-6">
              <div className="pb-6 border-b border-neutral-200 dark:border-neutral-700">
                <h3 className="font-semibold text-neutral-800 dark:text-white mb-4 flex items-center gap-2">
                  <FaUser />
                  Informace o profilu
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                      Jméno
                    </label>
                    <p className="text-neutral-800 dark:text-white">{user?.firstName || 'Nenastaveno'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                      Příjmení
                    </label>
                    <p className="text-neutral-800 dark:text-white">{user?.lastName || 'Nenastaveno'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                      Email
                    </label>
                    <p className="text-neutral-800 dark:text-white">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => navigate('/auth/update-profile')}
                    className="button1 px-6 py-2 rounded-lg"
                  >
                    Upravit profil
                  </button>
                </div>
              </div>

              <div className="pb-6 border-b border-neutral-200 dark:border-neutral-700">
                <h3 className="font-semibold text-neutral-800 dark:text-white mb-4 flex items-center gap-2">
                  <FaBell />
                  Notifikace
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="w-5 h-5" defaultChecked />
                    <span className="text-neutral-700 dark:text-neutral-300">Emailové notifikace o nových kurzech</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="w-5 h-5" defaultChecked />
                    <span className="text-neutral-700 dark:text-neutral-300">Připomínky pro dokončení kurzů</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="w-5 h-5" />
                    <span className="text-neutral-700 dark:text-neutral-300">Notifikace o nových zprávách</span>
                  </label>
                </div>
              </div>

              <div className="pb-6 border-b border-neutral-200 dark:border-neutral-700">
                <h3 className="font-semibold text-neutral-800 dark:text-white mb-4 flex items-center gap-2">
                  <FaLock />
                  Soukromí a bezpečnost
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                      Viditelnost profilu
                    </label>
                    <select className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700">
                      <option>Veřejný</option>
                      <option>Soukromý</option>
                    </select>
                  </div>
                  <div>
                    <button className="button1 px-6 py-2 rounded-lg">
                      Změnit heslo
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-neutral-800 dark:text-white mb-4 flex items-center gap-2">
                  <FaCrown />
                  Předplatné
                </h3>
                {hasSubscription ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <FaCrown className="text-3xl text-yellow-500" />
                      <div>
                        <h3 className="font-bold text-neutral-800 dark:text-white">Prémiový člen</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          Máte neomezený přístup ke všem kurzům
                        </p>
                      </div>
                    </div>
                    <button className="text-red-600 hover:underline">
                      Zrušit předplatné
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                      Momentálně nemáte aktivní předplatné
                    </p>
                    <button
                      onClick={() => navigate('/courses')}
                      className="button1 px-6 py-2 rounded-lg"
                    >
                      Získat prémiový přístup
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'support':
        return (
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow">
            <div className="flex items-center gap-3 mb-6">
              <FaHeadset className="text-3xl text-blue-600 dark:text-blue-400" />
              <div>
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">
                  Podpora
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Potřebujete pomoc? Jsme tu pro vás
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <h3 className="font-bold text-neutral-800 dark:text-white mb-2">
                  Často kladené otázky
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  Najděte odpovědi na běžné otázky
                </p>
                <button
                  onClick={() => navigate('/faq')}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  Zobrazit FAQ →
                </button>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                <h3 className="font-bold text-neutral-800 dark:text-white mb-2">
                  Kontaktujte podporu
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  Pošlete nám zprávu a my vám pomůžeme
                </p>
                <button
                  onClick={() => navigate('/support')}
                  className="text-green-600 dark:text-green-400 hover:underline font-semibold"
                >
                  Kontaktovat podporu →
                </button>
              </div>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-700/50 rounded-xl p-6">
              <h3 className="font-bold text-neutral-800 dark:text-white mb-4">
                Rychlé odkazy
              </h3>
              <div className="space-y-2">
                <a href="#" className="block text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400">
                  • Technická podpora
                </a>
                <a href="#" className="block text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400">
                  • Podmínky použití
                </a>
                <a href="#" className="block text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400">
                  • Zásady ochrany osobních údajů
                </a>
                <a href="#" className="block text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400">
                  • Návod k použití platformy
                </a>
              </div>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Načítání vašeho dashboardu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 pt-16">
      <ToastContainer position="top-right" autoClose={3000} />

      <div style={{ background: 'linear-gradient(135deg, #704FE6 0%, #1e2a47 100%)' }} className="text-white py-8">
        <div className="container mx-auto px-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-white p-2"
              >
                <FaBars className="text-2xl" />
              </button>
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Vítejte zpět, {user?.firstName}!</h1>
                <p className="opacity-90 text-sm md:text-base">Pokračujte ve své cestě vzdělávání</p>
              </div>
            </div>
            {hasSubscription && (
              <div className="hidden md:flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <FaCrown className="text-yellow-400" />
                <span className="font-semibold">Premium</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-5 py-8">
        <div className="flex gap-6">
          <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block fixed lg:relative inset-0 lg:inset-auto z-40 lg:z-auto`}>
            <div
              className="absolute inset-0 bg-black/50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative bg-white dark:bg-neutral-800 rounded-xl p-6 shadow h-fit lg:w-64 m-4 lg:m-0">
              <nav className="space-y-2">
                <button
                  onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  <FaChartLine />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => { setActiveTab('my-courses'); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'my-courses' ? 'bg-blue-600 text-white' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  <FaGraduationCap />
                  <span>Moje kurzy</span>
                </button>

                <button
                  onClick={() => { setActiveTab('progress'); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'progress' ? 'bg-blue-600 text-white' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  <FaTrophy />
                  <span>Pokrok a statistiky</span>
                </button>

                <button
                  onClick={() => { setActiveTab('certificates'); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'certificates' ? 'bg-blue-600 text-white' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  <FaCertificate />
                  <span>Přehled certifikátů</span>
                </button>

                <button
                  onClick={() => { setActiveTab('schedule'); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'schedule' ? 'bg-blue-600 text-white' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  <FaCalendar />
                  <span>Plán lekcí</span>
                </button>

                <button
                  onClick={() => { setActiveTab('messages'); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'messages' ? 'bg-blue-600 text-white' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  <FaEnvelope />
                  <span>Moje zprávy</span>
                </button>

                <button
                  onClick={() => { setActiveTab('community'); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'community' ? 'bg-blue-600 text-white' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  <FaUsers />
                  <span>Komunita</span>
                </button>

                <button
                  onClick={() => { setActiveTab('notes'); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'notes' ? 'bg-blue-600 text-white' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  <FaStickyNote />
                  <span>Poznámky a cíle</span>
                </button>

                <div className="border-t border-neutral-200 dark:border-neutral-700 my-4"></div>

                <button
                  onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'settings' ? 'bg-blue-600 text-white' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  <FaCog />
                  <span>Nastavení účtu</span>
                </button>

                <button
                  onClick={() => { setActiveTab('support'); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'support' ? 'bg-blue-600 text-white' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  <FaHeadset />
                  <span>Podpora</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all mt-4"
                >
                  <FaSignOutAlt />
                  <span>Odhlásit se</span>
                </button>
              </nav>
            </div>
          </div>

          <div className="flex-1">
            {renderDashboardContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
