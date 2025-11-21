"use client";

import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type StatusVariant = "neutral" | "success" | "error";

interface StatusMessageProps extends HTMLAttributes<HTMLDivElement> {
  variant?: StatusVariant;
  rightSlot?: string;
}

export function StatusMessage({
  variant = "neutral",
  rightSlot,
  className,
  children,
  ...props
}: StatusMessageProps) {
  const variantClasses: Record<StatusVariant, string> = {
    neutral: "text-[var(--muted)]",
    success: "text-[var(--accent-soft)]",
    error: "text-red-500",
  };

  return (
    <div
      className={cn("flex items-center justify-between text-xs", variantClasses[variant], className)}
      {...props}
    >
      <span>{children}</span>
      {rightSlot && <span className="text-[var(--muted)]">{rightSlot}</span>}
    </div>
  );
}

