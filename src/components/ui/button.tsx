import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "google";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", disabled, children, ...props }, ref) => {
    const variantStyles = {
      primary:
        "bg-accent text-canvas hover:bg-accent-hover active:scale-[0.99] border border-transparent font-semibold shadow-sm",
      google:
        "bg-google-blue text-white hover:opacity-90 active:scale-[0.99] border border-transparent font-semibold shadow-sm",
      secondary:
        "bg-surface-muted text-primary hover:bg-surface border border-border hover:border-border-hover active:scale-[0.99]",
      outline:
        "bg-transparent border border-border text-primary hover:bg-surface-muted hover:border-border-hover active:scale-[0.99]",
      ghost:
        "bg-transparent text-secondary hover:text-primary hover:bg-surface-muted active:scale-[0.99]",
    };

    const sizeStyles = {
      sm: "h-9 px-3 text-xs rounded-lg",
      md: "h-11 px-4 text-sm font-medium rounded-xl",
      lg: "h-12 px-6 text-sm font-medium rounded-xl",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-sans transition-all cursor-pointer select-none",
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
