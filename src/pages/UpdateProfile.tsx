import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authProvider";
import { BarChartMixed } from "@/components/dashboard/bar-chart-mixed";
import { InteractiveBarChart } from "@/components/dashboard/interactive-bar-chart";
import { RadialShapeChart } from "@/components/dashboard/radial-shape-chart";
import { SearchCommand } from "@/components/dashboard/search-command";
import { Activity, BarChart3, FileText, Home, Settings, BookOpen, ChevronRight } from "lucide-react";

type SidebarSection = "charts" | "dashboard" | "orders" | "settings" | "homepage" | "documentation";

export default function UpdateProfile() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [activeSection, setActiveSection] = useState<SidebarSection>("charts");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth/login");
      return;
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const sidebarItems = [
    { id: "dashboard" as SidebarSection, label: "Dashboard", icon: Activity },
    { id: "charts" as SidebarSection, label: "Charts", icon: BarChart3, badge: 2 },
    { id: "orders" as SidebarSection, label: "Orders", icon: FileText },
    { id: "settings" as SidebarSection, label: "Settings", icon: Settings },
    { id: "homepage" as SidebarSection, label: "Homepage", icon: Home },
    { id: "documentation" as SidebarSection, label: "Documentation", icon: BookOpen },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <aside className="w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 p-4 fixed h-full">
        <div className="flex items-center gap-2 px-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold">
            D
          </div>
          <span className="font-semibold text-neutral-800 dark:text-white">
            Dires Fyzio
          </span>
        </div>

        <nav className="space-y-1">
          <p className="px-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
            MENU
          </p>
          {sidebarItems.slice(0, 2).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                activeSection === item.id
                  ? "bg-neutral-900 dark:bg-neutral-800 text-white"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <p className="px-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mt-6 mb-2">
            OPTIONS
          </p>
          {sidebarItems.slice(2).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                activeSection === item.id
                  ? "bg-neutral-900 dark:bg-neutral-800 text-white"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-4 text-white">
          <p className="text-sm font-semibold mb-1">Upgrade to Pro</p>
          <p className="text-xs opacity-90 mb-3">
            Unlock all features and get unlimited access to our support team.
          </p>
          <button className="w-full bg-white text-teal-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-neutral-100 transition-colors">
            Upgrade
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
              <span>project-number-7</span>
              <ChevronRight className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-4">
              <SearchCommand />
              <button className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                <span className="text-sm font-semibold">{user.firstName?.[0]}{user.lastName?.[0]}</span>
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
              Charts
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              List of charts by shadcn-ui.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RadialShapeChart />
            <div className="space-y-6">
              <div className="h-[200px]">
                <BarChartMixed />
              </div>
            </div>

            <RadialShapeChart />
            <RadialShapeChart />
          </div>

          <div className="mt-6">
            <InteractiveBarChart />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <RadialShapeChart />
            <RadialShapeChart />
            <RadialShapeChart />
          </div>
        </div>
      </main>
    </div>
  );
}
