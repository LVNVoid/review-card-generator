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
            "w-full h-9.5 sm:h-10 px-3 rounded-lg bg-surface border border-border text-primary placeholder:text-secondary/50 text-sm font-sans transition-all",
            "focus:outline-none focus:border-google-blue focus:ring-1 focus:ring-google-blue/30",
            error && "border-google-red focus:border-google-red focus:ring-google-red/30",
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
