import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authProvider";
import { BarChartMixed } from "@/components/dashboard/bar-chart-mixed";
import { InteractiveBarChart as InteractiveBarChartCopy } from "@/components/dashboard/interactive-bar-chart copy";
import { RadialShapeChart } from "@/components/dashboard/radial-shape-chart";
import InfoCard from "@/components/dashboard/info-card copy";
import TransactionsList from "@/components/dashboard/transactions-list";
import { Activity, BarChart3, FileText, Home, Settings, BookOpen, ChevronRight, Sun, Moon } from "lucide-react";
import { SearchCommand } from "@/components/dashboard/search-command copy";
import { useTheme } from "next-themes";

type SidebarSection = "charts" | "dashboard" | "orders" | "settings" | "homepage" | "documentation";

export default function UpdateProfile() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { theme, setTheme } = useTheme();
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
    { id: "dashboard" as SidebarSection, label: "Admin Panel", icon: Home },
    { id: "dashboard" as SidebarSection, label: "Dashboard", icon: Activity },
    { id: "charts" as SidebarSection, label: "Charts", icon: BarChart3, badge: 2 },
    { id: "orders" as SidebarSection, label: "Orders", icon: FileText, badge: 2 },
  ];

  const optionItems = [
    { id: "settings" as SidebarSection, label: "Settings", icon: Settings },
    { id: "homepage" as SidebarSection, label: "Homepage", icon: Home },
    { id: "documentation" as SidebarSection, label: "Documentation", icon: BookOpen },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <aside className="w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 p-4 fixed h-full overflow-y-auto">
        <div className="flex items-center gap-2 px-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
            DF
          </div>
          <span className="font-semibold text-neutral-800 dark:text-white text-sm">
            project-number-7
          </span>
        </div>

        <nav className="space-y-1 mb-4">
          <p className="px-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
            MENU
          </p>
          {sidebarItems.map((item) => (
            <button
              key={item.id + item.label}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                activeSection === item.id && item.label === "Charts"
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
          {optionItems.map((item) => (
            <button
              key={item.id + item.label}
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

        <div className="mt-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <p className="text-sm font-semibold mb-1">Upgrade to Pro</p>
          <p className="text-xs opacity-90 mb-3">
            Unlock all features and get unlimited access to our support team.
          </p>
          <button className="w-full bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-neutral-100 transition-colors">
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
              <SearchCommand links={[
                {
                  title: "Kurzy",
                  items: [
                    { title: "Moje kurzy", href: "/my-learning", icon: "book" },
                    { title: "Všechny kurzy", href: "/courses", icon: "book" },
                  ]
                },
                {
                  title: "Dashboard",
                  items: [
                    { title: "Přehled", href: "/dashboard", icon: "chart" },
                  ]
                }
              ]} />
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <RadialShapeChart />
            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <BarChartMixed />
            </div>
            <RadialShapeChart />
            <RadialShapeChart />
          </div>

          <div className="mb-6">
            <InteractiveBarChartCopy />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <RadialShapeChart />
            <RadialShapeChart />
            <RadialShapeChart />
          </div>

          <div className="mb-6">
            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <BarChartMixed />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <RadialShapeChart />
            <RadialShapeChart />
          </div>

          <div className="mb-6">
            <TransactionsList />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <InfoCard />
            <InfoCard />
            <InfoCard />
            <InfoCard />
          </div>
        </div>
      </main>
    </div>
  );
}
