"use client";

import { Input } from "@/components/ui/Input";

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
         <div className="mb-2 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3">
            <label className="mb-1.5 block text-[11px] font-medium text-yellow-200/80">
              🏷️ Texto etiqueta "Más elegido"
            </label>
            <Input 
               value={bestChoiceLabel} 
               onChange={(e) => onBestChoiceLabelChange(e.target.value)} 
               className="text-sm border-yellow-500/30 bg-black/20 text-yellow-100 placeholder:text-yellow-500/30 focus:border-yellow-500/50"
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

        return (
          <div key={`link-${idx}`} className={`rounded-lg border p-4 transition-colors ${bestChoiceIndex === idx && linkCount > 1 ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-white/10 bg-white/5'}`}>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-[#ff7a7a]/30 to-[#ffb347]/30 text-xs font-bold text-white">
                  {idx + 1}
                </span>
                <span className="text-xs font-medium text-white/60">Propuesta {idx + 1}</span>
              </div>
              
              {linkCount > 1 && (
                <label className="flex items-center gap-2 cursor-pointer select-none group">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${bestChoiceIndex === idx ? 'border-yellow-400 bg-yellow-400/20' : 'border-white/20 group-hover:border-white/40'}`}>
                      {bestChoiceIndex === idx && <div className="w-2 h-2 rounded-full bg-yellow-400" />}
                    </div>
                    <input 
                        type="radio" 
                        name="bestChoice" 
                        checked={bestChoiceIndex === idx} 
                        onChange={() => onBestChoiceIndexChange(idx)}
                        className="hidden"
                    />
                    <span className={`text-[10px] uppercase font-bold tracking-wider transition-colors ${bestChoiceIndex === idx ? 'text-yellow-400' : 'text-white/30 group-hover:text-white/50'}`}>
                        Más elegido
                    </span>
                </label>
              )}
            </div>

            <div className="space-y-3">
              {/* Nombre del plan e Ideal para en la misma fila */}
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[11px] font-medium text-white/60">
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
                  <label className="mb-1.5 block text-[11px] font-medium text-white/60">
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
                <label className="mb-1.5 block text-[11px] font-medium text-white/60">
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

