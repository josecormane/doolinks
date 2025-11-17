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
              ? "border-[#ff7a7a] bg-gradient-to-r from-[#ff7a7a]/20 to-[#ffb347]/20 text-white shadow-[0_0_12px_rgba(255,122,122,0.3)]"
              : "border-white/20 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/10 hover:text-white/90"
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

