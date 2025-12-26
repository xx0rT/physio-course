import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MaxWidthWrapperProps {
  className?: string;
  children: ReactNode;
}

export default function MaxWidthWrapper({
  className,
  children,
}: MaxWidthWrapperProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl px-5 md:px-10",
        className
      )}
    >
      {children}
    </div>
  );
}
