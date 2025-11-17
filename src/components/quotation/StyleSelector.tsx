"use client";

import { Select } from "@/components/ui/Select";
import { StyleVariant } from "@/components/email-templates/EmailPreview";

interface StyleSelectorProps {
  value: StyleVariant;
  onChange(value: StyleVariant): void;
}

const OPTIONS = [
  { value: "style1", label: "Estilo 1 - tarjetas vibrantes" },
  { value: "style2", label: "Estilo 2 - comparación compacta" },
  { value: "style3", label: "Estilo 3 - diseño minimalista" },
];

export function StyleSelector({ value, onChange }: StyleSelectorProps) {
  return (
    <Select value={value} onChange={(event) => onChange(event.target.value as StyleVariant)}>
      {OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
}

