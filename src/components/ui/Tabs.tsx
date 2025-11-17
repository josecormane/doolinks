"use client";

import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export interface TabOption {
  label: string;
  value: string;
  icon?: string;
}

interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: TabOption[];
  value: string;
  onChange(value: string): void;
}

export function Tabs({ options, value, onChange, className, ...props }: TabsProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 text-sm",
        className
      )}
      {...props}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition",
              isActive ? "bg-white/15 text-white" : "text-white/60 hover:text-white/80"
            )}
          >
            {option.icon && <span>{option.icon}</span>}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

