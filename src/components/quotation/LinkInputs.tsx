"use client";

import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

interface LinkInputsProps {
  linkCount: number;
  urls: string[];
  errors: string[];
  planNames: string[];
  idealFor: string[];
  onUrlChange(index: number, value: string): void;
  onPlanNameChange(index: number, value: string): void;
  onIdealForChange(index: number, value: string): void;
  bestChoiceIndex: number | null;
  onBestChoiceIndexChange(value: number | null): void;
  bestChoiceLabel: string;
  onBestChoiceLabelChange(value: string): void;
}

const DEFAULT_PLAN_LABELS = ["Plan Esencial", "Plan Equilibrado", "Plan Premium"];
const DEFAULT_IDEAL_FOR = [
  "Validar roadmap con menor compromiso",
  "La inversión más equilibrada",
  "Más ahorro, retorno más rápido"
];

export function LinkInputs({ 
  linkCount, 
  urls, 
  errors, 
  planNames, 
  idealFor, 
  onUrlChange, 
  onPlanNameChange, 
  onIdealForChange,
  bestChoiceIndex,
  onBestChoiceIndexChange,
  bestChoiceLabel,
  onBestChoiceLabelChange
}: LinkInputsProps) {
  return (
    <div className="space-y-3">
      {linkCount > 1 && (
         <div className="mb-2 rounded-lg border border-[var(--card-border)] bg-[var(--surface-highlight)] p-3">
            <label className="mb-1.5 block text-[11px] font-medium text-[var(--accent-soft)]">
              🏷️ Texto etiqueta &quot;Más elegido&quot;
            </label>
            <Input 
               value={bestChoiceLabel} 
               onChange={(e) => onBestChoiceLabelChange(e.target.value)} 
               className="text-sm focus:border-[var(--accent-soft)] focus:ring-[color:rgba(1,126,132,0.35)]"
            />
         </div>
      )}

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

        const isBestChoice = bestChoiceIndex === idx && linkCount > 1;

        return (
          <div
            key={`link-${idx}`}
            className={cn(
              "rounded-lg border p-4 transition-colors",
              isBestChoice
                ? "border-[var(--accent-soft)] bg-[var(--surface-highlight)]"
                : "border-[var(--card-border)] bg-[var(--card-bg)]"
            )}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-white">
                  {idx + 1}
                </span>
                <span className="text-xs font-medium text-[var(--muted)]">Propuesta {idx + 1}</span>
              </div>
              
              {linkCount > 1 && (
                <label className="group flex cursor-pointer select-none items-center gap-2">
                  <div
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-full border transition-colors",
                      bestChoiceIndex === idx
                        ? "border-[var(--accent-soft)] bg-[color:rgba(1,126,132,0.18)]"
                        : "border-[var(--card-border)] group-hover:border-[var(--accent)]"
                    )}
                  >
                    {bestChoiceIndex === idx && <div className="h-2 w-2 rounded-full bg-[var(--accent-soft)]" />}
                  </div>
                  <input
                    type="radio"
                    name="bestChoice"
                    checked={bestChoiceIndex === idx}
                    onChange={() => onBestChoiceIndexChange(idx)}
                    className="hidden"
                  />
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wider transition-colors",
                      bestChoiceIndex === idx
                        ? "text-[var(--accent-soft)]"
                        : "text-[var(--muted)] group-hover:text-[var(--accent)]"
                    )}
                  >
                    Más elegido
                  </span>
                </label>
              )}
            </div>

            <div className="space-y-3">
              {/* Nombre del plan e Ideal para en la misma fila */}
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[11px] font-medium text-[var(--accent)]">
                    📝 Nombre del plan
                  </label>
                  <Input
                    placeholder={DEFAULT_PLAN_LABELS[idx] || `Plan ${idx + 1}`}
                    value={planNames[idx] || ""}
                    onChange={(event) => onPlanNameChange(idx, event.target.value)}
                    className="text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-medium text-[var(--accent)]">
                    💡 Ideal para
                  </label>
                  <Input
                    placeholder={DEFAULT_IDEAL_FOR[idx] || "Describe para qué es ideal este plan"}
                    value={idealFor[idx] || ""}
                    onChange={(event) => onIdealForChange(idx, event.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>

              {/* URL de cotización Odoo en la fila siguiente */}
              <div>
                <label className="mb-1.5 block text-[11px] font-medium text-[var(--accent)]">
                  🔗 URL de cotización Odoo
                </label>
                <Input
                  placeholder="https://www.odoo.com/my/orders/... o /mail/view?..."
                  value={urls[idx] || ""}
                  onChange={(event) => onUrlChange(idx, event.target.value)}
                  error={errors[idx]}
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

