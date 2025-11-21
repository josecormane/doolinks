"use client";

import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 text-[var(--text)] shadow-sm transition-colors hover:shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

