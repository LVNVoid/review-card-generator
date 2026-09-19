import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", disabled, children, ...props }, ref) => {
    const variantStyles = {
      primary: "bg-accent text-primary hover:bg-accent-hover active:scale-98 shadow-sm",
      secondary: "bg-surface-muted text-primary hover:bg-border active:scale-98 border border-border",
      outline: "bg-transparent border border-border text-primary hover:bg-surface-muted hover:border-secondary active:scale-98",
      ghost: "bg-transparent text-secondary hover:text-primary hover:bg-surface-muted active:scale-98",
    };

    const sizeStyles = {
      sm: "h-9 px-3 text-xs rounded-xl",
      md: "h-11 px-4 text-sm font-medium rounded-xl",
      lg: "h-12 px-6 text-base font-medium rounded-2xl",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-sans transition-all cursor-pointer select-none",
          "disabled:opacity-50 disabled:pointer-events-none",
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
