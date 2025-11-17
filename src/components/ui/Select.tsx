"use client";

import { SelectHTMLAttributes, forwardRef } from "react";

import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => (
    <div className="space-y-1.5">
      <select
        ref={ref}
        className={cn(
          "w-full appearance-none rounded-lg border border-white/10 bg-[#040818]/90 px-3 py-2 text-sm text-white outline-none transition focus:border-[#32d0ff]/70 focus:shadow-[0_0_0_1px_rgba(50,208,255,0.4)]",
          error && "border-red-400/70 focus:border-red-400/80 focus:shadow-[0_0_0_1px_rgba(248,113,113,0.4)]",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
);

Select.displayName = "Select";

