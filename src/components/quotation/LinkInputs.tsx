"use client";

import { Input } from "@/components/ui/Input";

interface LinkInputsProps {
  linkCount: number;
  urls: string[];
  errors: string[];
  onUrlChange(index: number, value: string): void;
}

const PLAN_LABELS = ["Plan esencial", "Plan equilibrado", "Plan premium"];

export function LinkInputs({ linkCount, urls, errors, onUrlChange }: LinkInputsProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, idx) => {
        const visible = idx < linkCount;
        if (!visible) {
          return (
            <div
              key={`link-${idx}`}
              className="hidden"
            />
          );
        }

        return (
          <div key={`link-${idx}`} className="rounded-lg border border-white/10 bg-white/5 p-3">
            <div className="mb-2 flex items-center justify-between text-xs text-white/60">
              <span>Enlace {idx + 1}</span>
              <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px]">
                {PLAN_LABELS[idx] || `Plan ${idx + 1}`}
              </span>
            </div>
            <Input
              placeholder="https://www.odoo.com/my/orders/..."
              value={urls[idx] || ""}
              onChange={(event) => onUrlChange(idx, event.target.value)}
              error={errors[idx]}
            />
          </div>
        );
      })}
    </div>
  );
}

