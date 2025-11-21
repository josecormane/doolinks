"use client";

import { StyleVariant } from "@/components/email-templates/EmailPreview";

interface StyleSelectorProps {
  value: StyleVariant;
  onChange(value: StyleVariant): void;
}

const OPTIONS = [
  { value: "style1" as StyleVariant, label: "Moderno", icon: "✨" },
  { value: "style2" as StyleVariant, label: "Compacto", icon: "📋" },
  { value: "style3" as StyleVariant, label: "Minimalista", icon: "🎯" },
];

export function StyleSelector({ value, onChange }: StyleSelectorProps) {
  return (
    <div className="flex gap-2">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
            value === option.value
              ? "border-[var(--accent)] bg-[var(--accent)] text-white shadow-md"
              : "border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--surface-muted)]"
          }`}
          title={option.label}
        >
          <span className="mr-1">{option.icon}</span>
          {option.label}
        </button>
      ))}
    </div>
  );
}

