import React from "react";
import { cn } from "../../lib/utils";

interface GradientHeadingProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function GradientHeading({
  children,
  className,
  as = "h2",
}: GradientHeadingProps) {
  const Component = as;

  return (
    <Component
      className={cn(
        "bg-gradient-to-r from-primary to-primary-400 bg-clip-text text-transparent font-bold",
        as === "h1" && "text-base md:text-base lg:text-base",
        as === "h2" && "text-base md:text-base lg:text-base",
        as === "h3" && "text-base md:text-base",
        as === "h4" && "text-base md:text-base",
        as === "h5" && "text-base md:text-base",
        as === "h6" && "text-base md:text-base",
        className
      )}
    >
      {children}
    </Component>
  );
}
