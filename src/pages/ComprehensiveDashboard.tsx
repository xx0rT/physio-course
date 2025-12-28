import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authProvider";
import { supabase } from "@/lib/supabase";
import { DashboardHeader } from "@/components/dashboard/header copy";
import { SearchCommandFixed } from "@/components/dashboard/search-command-fixed";
import { InfoCard } from "@/components/dashboard/info-cards";
import { InteractiveBarChart } from "@/components/dashboard/interactive-bar-chart copy copy";
import { RadialShapeChart } from "@/components/dashboard/radial-shape-chart copy";
import { TransactionsListFixed } from "@/components/dashboard/transactions-list-fixed";
import { UpgradeCard } from "@/components/dashboard/upgrade-card copy copy";
import { dashboardConfig } from "@/config/dashboard";
import { toast } from "react-toastify";

interface UserStats {
  total_courses: number;
  completed_courses: number;
  total_lessons: number;
  completed_lessons: number;
  current_streak: number;
}

export default function ComprehensiveDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStats>({
    total_courses: 0,
    completed_courses: 0,
    total_lessons: 0,
    completed_lessons: 0,
    current_streak: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth/login");
      return;
    }

    if (user) {
      loadDashboardData();
    }
  }, [user, authLoading, navigate]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data: userStats, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user._id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading stats:', error);
        toast.error('Failed to load dashboard data');
        return;
      }

      if (userStats) {
        setStats({
          total_courses: 12,
          completed_courses: userStats.total_courses_completed || 0,
          total_lessons: 145,
          completed_lessons: userStats.total_lessons_completed || 0,
          current_streak: userStats.current_streak || 0,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto" />
          <p className="text-neutral-600 dark:text-neutral-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const completionRate = stats.total_courses > 0
    ? Math.round((stats.completed_courses / stats.total_courses) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <DashboardHeader
            heading="Dashboard Overview"
            text="Welcome back! Here's what's happening with your learning journey."
          />
          <SearchCommandFixed links={dashboardConfig.sidebarNav} />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <InfoCard
            title="Total Courses"
            value={`${stats.total_courses}`}
            change="+12% from last month"
            icon="book"
          />
          <InfoCard
            title="Completed"
            value={`${stats.completed_courses}`}
            change={`${completionRate}% completion rate`}
            icon="trending"
          />
          <InfoCard
            title="Active Learners"
            value="+2,350"
            change="+180.1% from last month"
            icon="users"
          />
          <InfoCard
            title="Current Streak"
            value={`${stats.current_streak} days`}
            change="Keep it up!"
            icon="activity"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-full lg:col-span-4">
            <InteractiveBarChart />
          </div>
          <div className="col-span-full lg:col-span-3">
            <RadialShapeChart />
          </div>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          <TransactionsListFixed />
          <UpgradeCard />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-md col-span-full lg:col-span-2">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {[
                {
                  title: "Completed Course: Advanced React Patterns",
                  time: "2 hours ago",
                  type: "success",
                },
                {
                  title: "Started: TypeScript Masterclass",
                  time: "5 hours ago",
                  type: "info",
                },
                {
                  title: "Achievement Unlocked: Quick Learner",
                  time: "1 day ago",
                  type: "warning",
                },
                {
                  title: "New Certificate Earned",
                  time: "2 days ago",
                  type: "success",
                },
                {
                  title: "Joined Study Group: Web Development",
                  time: "3 days ago",
                  type: "info",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.type === "success"
                        ? "bg-green-500"
                        : activity.type === "info"
                        ? "bg-blue-500"
                        : "bg-yellow-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {activity.title}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              {[
                { label: "Continue Learning", path: "/dashboard/my-learning" },
                { label: "Browse Courses", path: "/courses" },
                { label: "View Certificates", path: "/dashboard/stats#certificates" },
                { label: "Update Profile", path: "/auth/update-profile" },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className="w-full text-left px-4 py-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors text-sm font-medium text-neutral-900 dark:text-white"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
