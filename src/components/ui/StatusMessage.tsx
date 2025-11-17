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
    neutral: "text-white/70",
    success: "text-emerald-300",
    error: "text-red-300",
  };

  return (
    <div
      className={cn("flex items-center justify-between text-xs", variantClasses[variant], className)}
      {...props}
    >
      <span>{children}</span>
      {rightSlot && <span className="text-white/60">{rightSlot}</span>}
    </div>
  );
}

