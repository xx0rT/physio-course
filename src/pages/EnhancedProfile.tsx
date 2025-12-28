import { useState, useEffect, lazy, Suspense, memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/authProvider";
import { supabase } from "@/lib/supabase";
import {
  Trophy,
  BookOpen,
  Target,
  Award,
  TrendingUp,
  Clock,
  Users,
  Star
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Lazy load components for better performance
const ProfileHeader = lazy(() => import("@/components/profile/ProfileHeader"));
const AnimatedStatsCard = lazy(() => import("@/components/profile/AnimatedStatsCard"));
const ProfileCustomization = lazy(() => import("@/components/profile/ProfileCustomization"));

// Loading skeleton component
const LoadingSkeleton = memo(() => (
  <div className="animate-pulse space-y-6">
    <div className="bg-neutral-200 dark:bg-neutral-800 h-64 rounded-2xl" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-neutral-200 dark:bg-neutral-800 h-48 rounded-2xl" />
      ))}
    </div>
  </div>
));

LoadingSkeleton.displayName = 'LoadingSkeleton';

// Activity Card Component (memoized)
const ActivityCard = memo(({ title, description, time, icon: Icon, color }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02, y: -4 }}
    className="bg-white dark:bg-neutral-900 rounded-xl p-4 shadow-md hover:shadow-lg transition-all"
  >
    <div className="flex items-start gap-4">
      <div
        className="p-3 rounded-lg"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-neutral-900 dark:text-white mb-1">
          {title}
        </h4>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
          {description}
        </p>
        <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-500">
          <Clock className="w-3 h-3" />
          <span>{time}</span>
        </div>
      </div>
    </div>
  </motion.div>
));

ActivityCard.displayName = 'ActivityCard';

export default function EnhancedProfile() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth/login");
      return;
    }

    if (user) {
      loadProfileData();
    }
  }, [user, authLoading, navigate]);

  const loadProfileData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load extended profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles_extended')
        .select('*')
        .eq('user_id', user._id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      // If profile doesn't exist, create it
      if (!profileData) {
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles_extended')
          .insert({ user_id: user._id })
          .select()
          .single();

        if (createError) throw createError;
        setProfile(newProfile);
      } else {
        setProfile(profileData);
      }

      // Load user stats
      const { data: statsData, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user._id)
        .maybeSingle();

      if (statsError && statsError.code !== 'PGRST116') {
        throw statsError;
      }

      setStats(statsData || {
        level: 1,
        xp: 0,
        total_courses_completed: 0,
        total_lessons_completed: 0,
        current_streak: 0,
        longest_streak: 0
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 pt-20 px-4">
        <div className="container mx-auto max-w-7xl py-8">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const recentActivities = [
    {
      title: "Completed Advanced React Course",
      description: "Finished all modules with a 95% score",
      time: "2 hours ago",
      icon: BookOpen,
      color: "#10b981"
    },
    {
      title: "Earned Achievement: Fast Learner",
      description: "Completed 5 courses this month",
      time: "1 day ago",
      icon: Trophy,
      color: "#f59e0b"
    },
    {
      title: "Reached Level 15",
      description: "Accumulated 15,000 XP points",
      time: "3 days ago",
      icon: Star,
      color: "#8b5cf6"
    },
    {
      title: "Joined Study Group",
      description: "Connected with 12 new learners",
      time: "5 days ago",
      icon: Users,
      color: "#06b6d4"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-purple-50/30 to-blue-50/30 dark:from-neutral-950 dark:via-purple-950/10 dark:to-blue-950/10 pt-20">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Profile Header */}
          <Suspense fallback={<LoadingSkeleton />}>
            <ProfileHeader
              user={user}
              profile={profile}
              onProfileUpdate={loadProfileData}
            />
          </Suspense>

          {/* Stats Cards */}
          <Suspense fallback={<div className="h-48 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatedStatsCard
                icon={Trophy}
                label="Level"
                value={stats?.level || 1}
                color="#f59e0b"
                delay={0}
              />
              <AnimatedStatsCard
                icon={BookOpen}
                label="Courses Completed"
                value={stats?.total_courses_completed || 0}
                color="#10b981"
                delay={0.1}
              />
              <AnimatedStatsCard
                icon={Target}
                label="Total Lessons"
                value={stats?.total_lessons_completed || 0}
                color="#3b82f6"
                delay={0.2}
              />
              <AnimatedStatsCard
                icon={Award}
                label="Current Streak"
                value={stats?.current_streak || 0}
                suffix=" days"
                color="#8b5cf6"
                delay={0.3}
              />
            </div>
          </Suspense>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  Recent Activity
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/dashboard')}
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-sm flex items-center gap-1"
                >
                  View All
                  <TrendingUp className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <ActivityCard {...activity} />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Stats & Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {/* Progress Card */}
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
                <h3 className="text-xl font-bold mb-4">Your Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>To Next Level</span>
                      <span className="font-semibold">{stats?.xp || 0} / {(stats?.level || 1) * 100} XP</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((stats?.xp || 0) % ((stats?.level || 1) * 100)) / ((stats?.level || 1) * 100) * 100}%` }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="h-full bg-white rounded-full"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/20">
                    <p className="text-sm opacity-90 mb-2">Keep up the great work!</p>
                    <p className="text-xs opacity-75">
                      You're {Math.floor(((stats?.xp || 0) % ((stats?.level || 1) * 100)) / ((stats?.level || 1) * 100) * 100)}% towards Level {(stats?.level || 1) + 1}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Browse Courses", path: "/courses" },
                    { label: "My Learning", path: "/my-learning" },
                    { label: "Dashboard", path: "/dashboard" },
                    { label: "Settings", path: "/auth/update-profile" }
                  ].map((action, index) => (
                    <motion.button
                      key={action.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(action.path)}
                      className="w-full text-left px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-medium transition-colors"
                    >
                      {action.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Profile Customization FAB */}
      <Suspense fallback={null}>
        <ProfileCustomization
          userId={user._id}
          currentTheme={profile.theme_preference}
          currentColorScheme={profile.color_scheme}
          currentLayout={profile.layout_preference}
          onUpdate={loadProfileData}
        />
      </Suspense>
    </div>
  );
}
