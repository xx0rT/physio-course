import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBook, FaChartLine, FaCalendarAlt, FaCertificate } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type NavItem = {
  title: string;
  href: string;
  icon?: string;
};

type SidebarNavItem = {
  title: string;
  items: NavItem[];
};

const defaultLinks: SidebarNavItem[] = [
  {
    title: "Kurzy",
    items: [
      { title: "Moje kurzy", href: "/my-learning", icon: "book" },
      { title: "Všechny kurzy", href: "/courses", icon: "book" },
      { title: "Oblíbené", href: "/wishlist", icon: "heart" },
    ],
  },
  {
    title: "Dashboard",
    items: [
      { title: "Přehled", href: "/dashboard", icon: "chart" },
      { title: "Pokrok", href: "/dashboard", icon: "chart" },
      { title: "Certifikáty", href: "/dashboard", icon: "certificate" },
    ],
  },
];

const iconMap: Record<string, React.ElementType> = {
  book: FaBook,
  chart: FaChartLine,
  calendar: FaCalendarAlt,
  certificate: FaCertificate,
};

export function SearchCommand({ links = defaultLinks }: { links?: SidebarNavItem[] }) {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative h-9 w-full justify-start rounded-md bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-72",
        )}
        onClick={() => setOpen(true)}
      >
        <span className="inline-flex">
          Hledat
          <span className="hidden sm:inline-flex">&nbsp;kurzy a funkce</span>...
        </span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.45rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Zadejte příkaz nebo hledejte..." />
        <CommandList>
          <CommandEmpty>Žádné výsledky nenalezeny.</CommandEmpty>
          {links.map((section) => (
            <CommandGroup key={section.title} heading={section.title}>
              {section.items.map((item) => {
                const Icon = iconMap[item.icon || "book"] || FaBook;
                return (
                  <CommandItem
                    key={item.title}
                    onSelect={() => {
                      runCommand(() => navigate(item.href));
                    }}
                  >
                    <Icon className="mr-2 size-5" />
                    {item.title}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
