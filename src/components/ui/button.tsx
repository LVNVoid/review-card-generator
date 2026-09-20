import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "google" | "tonal";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", disabled, children, ...props }, ref) => {
    const variantStyles = {
      primary:
        "bg-m3-primary text-m3-on-primary hover:opacity-95 active:scale-[0.99] border border-transparent font-semibold shadow-xs",
      tonal:
        "bg-m3-tonal text-m3-on-tonal hover:opacity-90 active:scale-[0.99] border border-transparent font-medium shadow-xs",
      google:
        "bg-google-blue text-white hover:opacity-90 active:scale-[0.99] border border-transparent font-semibold shadow-xs",
      secondary:
        "bg-surface-muted text-primary hover:bg-surface border border-border hover:border-border-hover active:scale-[0.99]",
      outline:
        "bg-transparent border border-border text-primary hover:bg-surface-muted hover:border-border-hover active:scale-[0.99]",
      ghost:
        "bg-transparent text-secondary hover:text-primary hover:bg-surface-muted active:scale-[0.99]",
    };

    const sizeStyles = {
      sm: "h-9 px-3.5 text-xs rounded-full",
      md: "h-10.5 px-5 text-sm font-medium rounded-full",
      lg: "h-12 px-6 text-sm font-medium rounded-full",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-google-sans transition-all cursor-pointer select-none",
          "disabled:opacity-40 disabled:pointer-events-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
