import React from "react";
import { cn } from "@bitebase/ui";

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
        as === "h1" && "text-4xl md:text-5xl lg:text-6xl",
        as === "h2" && "text-3xl md:text-4xl lg:text-5xl",
        as === "h3" && "text-2xl md:text-3xl",
        as === "h4" && "text-xl md:text-2xl",
        as === "h5" && "text-lg md:text-xl",
        as === "h6" && "text-base md:text-lg",
        className
      )}
    >
      {children}
    </Component>
  );
}
