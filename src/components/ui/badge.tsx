import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent" | "outline" | "success";
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-surface-muted text-secondary border border-border",
    accent: "bg-accent-subtle text-accent border border-accent/30",
    outline: "bg-transparent text-secondary border border-border",
    success: "bg-google-green/10 text-google-green border border-google-green/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
