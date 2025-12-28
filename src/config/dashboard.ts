import { DashboardConfig } from "@/types";

export const dashboardConfig: DashboardConfig = {
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Dashboard",
          href: "/dashboard",
          icon: "arrowRight",
        },
        {
          title: "My Learning",
          href: "/dashboard/my-learning",
          icon: "bookOpen",
        },
        {
          title: "Browse Courses",
          href: "/courses",
          icon: "bookOpen",
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          title: "Profile Settings",
          href: "/dashboard/settings",
          icon: "users",
        },
        {
          title: "Statistics",
          href: "/dashboard/stats",
          icon: "star",
        },
        {
          title: "Certificates",
          href: "/dashboard/stats#certificates",
          icon: "award",
        },
      ],
    },
  ],
};
