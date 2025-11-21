"use client";

import { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
}

export function Button({
  variant = "primary",
  className,
  loading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-[var(--accent)] text-white shadow-md transition-colors hover:bg-[var(--accent-hover)] hover:shadow-lg focus-visible:outline-[var(--accent)]",
    ghost:
      "border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--accent)] hover:bg-[var(--surface-muted)] focus-visible:outline-[var(--accent)]",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/60 border-t-transparent" />
      )}
      {children}
    </button>
  );
}

