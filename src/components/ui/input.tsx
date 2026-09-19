import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        <input
          ref={ref}
          className={cn(
            "w-full h-11 px-3.5 rounded-xl bg-surface border border-border text-primary placeholder:text-secondary/60 text-sm font-sans transition-all",
            "focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent",
            error && "border-google-red focus:border-google-red focus:ring-google-red",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-google-red">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
