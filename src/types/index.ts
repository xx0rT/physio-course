export interface SidebarNavItem {
  title: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof import("@/components/shared/icons").Icons;
  href?: string;
  items?: SidebarNavItem[];
}

export interface DashboardConfig {
  sidebarNav: SidebarNavItem[];
}
