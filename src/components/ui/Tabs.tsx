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
        "inline-flex items-center gap-1 rounded-lg border border-[var(--card-border)] bg-[var(--surface-muted)] p-1 text-sm transition-colors",
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
              "flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              isActive
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "text-[var(--accent)] hover:bg-[var(--card-bg)]"
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

