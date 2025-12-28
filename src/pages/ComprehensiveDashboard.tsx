import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authProvider";
import { supabase } from "@/lib/supabase";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { SearchCommandFixed } from "@/components/dashboard/search-command-fixed";
import { InfoCard } from "@/components/dashboard/info-cards";
import { InteractiveBarChart } from "@/components/dashboard/interactive-bar-chart copy copy";
import { RadialShapeChart } from "@/components/dashboard/radial-shape-chart copy";
import { TransactionsListFixed } from "@/components/dashboard/transactions-list-fixed";
import { UpgradeCard } from "@/components/dashboard/upgrade-card copy copy";
import { dashboardConfig } from "@/config/dashboard";
import { toast } from "react-toastify";
import { Home, BookOpen, ShoppingCart, Heart, BarChart3, User, Settings, LogOut } from "lucide-react";

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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth/login");
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to logout');
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

  const mainNavItems = [
    { title: "Dashboard", href: "/dashboard", icon: Home },
    { title: "My Learning", href: "/dashboard/my-learning", icon: BookOpen },
    { title: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
    { title: "Cart", href: "/dashboard/cart", icon: ShoppingCart },
    { title: "Statistics", href: "/dashboard/stats", icon: BarChart3 },
  ];

  const accountNavItems = [
    { title: "Profile", href: "/dashboard/profile", icon: User },
    { title: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
        <Sidebar>
          <SidebarHeader className="border-b border-sidebar-border pb-4">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
                DF
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-sidebar-foreground">
                  Dires Fyzio
                </span>
                <span className="text-xs text-sidebar-foreground/70">Learning Platform</span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mainNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        onClick={() => navigate(item.href)}
                        isActive={window.location.pathname === item.href}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Account</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {accountNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        onClick={() => navigate(item.href)}
                        isActive={window.location.pathname === item.href}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border pt-4">
            <div className="flex items-center gap-3 px-2 mb-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profile} />
                <AvatarFallback className="bg-teal-500 text-white text-xs">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="text-xs text-sidebar-foreground/70 truncate">{user?.email}</span>
              </div>
            </div>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <div className="mt-4 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-4 text-white">
              <p className="text-sm font-semibold mb-1">Upgrade to Pro</p>
              <p className="text-xs opacity-90 mb-3">
                Unlock all features and get unlimited access.
              </p>
              <button className="w-full bg-white text-teal-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-neutral-100 transition-colors">
                Upgrade
              </button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-6" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Dashboard Overview</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back! Here's what's happening with your learning journey.
              </p>
            </div>
            <SearchCommandFixed links={dashboardConfig.sidebarNav} />
          </header>

          <div className="flex-1 p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
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
                      { label: "Update Profile", path: "/dashboard/settings" },
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
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
