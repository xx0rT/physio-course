import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HeaderSectionProps {
  label?: string;
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  className?: string;
}

export function HeaderSection({
  label,
  title,
  subtitle,
  className,
}: HeaderSectionProps) {
  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      {label && (
        <span className="mb-4 inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-semibold text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
          {label}
        </span>
      )}
      <h2 className="text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 max-w-2xl text-base text-neutral-600 dark:text-neutral-400 sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
