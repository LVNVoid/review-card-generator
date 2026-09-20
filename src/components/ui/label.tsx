import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({ className, required, children, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "block text-[10.5px] sm:text-xs font-semibold text-secondary uppercase tracking-wider font-google-sans",
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-google-red ml-1">*</span>}
    </label>
  );
}
