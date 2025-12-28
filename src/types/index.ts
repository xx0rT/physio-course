export interface SidebarNavItem {
  title: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof import("@/components/shared/icons").Icons;
  href?: string;
  items?: SidebarNavItem[];
  badge?: number;
}

export interface DashboardConfig {
  sidebarNav: SidebarNavItem[];
}

export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
}
