"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { LinkInputs } from "./LinkInputs";

  interface QuotationFormProps {
  linkCount: number;
  onLinkCountChange(value: number): void;
  urls: string[];
  planNames: string[];
  idealFor: string[];
  errors: string[];
  onUrlChange(index: number, value: string): void;
  onPlanNameChange(index: number, value: string): void;
  onIdealForChange(index: number, value: string): void;
  bestChoiceIndex: number | null;
  onBestChoiceIndexChange(value: number | null): void;
  bestChoiceLabel: string;
  onBestChoiceLabelChange(value: string): void;
  comments: string;
  onCommentsChange(value: string): void;
  onGenerate(): void;
  loading: boolean;
}

export function QuotationForm({
  linkCount,
  onLinkCountChange,
  urls,
  planNames,
  idealFor,
  errors,
  onUrlChange,
  onPlanNameChange,
  onIdealForChange,
  bestChoiceIndex,
  onBestChoiceIndexChange,
  bestChoiceLabel,
  onBestChoiceLabelChange,
  comments,
  onCommentsChange,
  onGenerate,
  loading,
}: QuotationFormProps) {
  return (
    <Card className="space-y-6">
      <div className="border-b border-[var(--card-border)] pb-4">
        <h2 className="mb-1 text-base font-semibold text-[var(--accent)]">Configuración de Propuesta</h2>
        <p className="text-xs text-[var(--muted)]">
          Personaliza tus propuestas de licenciamiento
        </p>
      </div>

      <div className="space-y-6">

        {/* Número de cotizaciones */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[var(--accent)]">📊 Número de propuestas</span>
            <span className="rounded bg-[var(--pill-bg)] px-2 py-1 text-[11px] text-[var(--muted)]">{linkCount} seleccionada{linkCount !== 1 ? 's' : ''}</span>
          </div>
          <Select
            value={String(linkCount)}
            onChange={(event) => onLinkCountChange(Number(event.target.value))}
          >
            <option value="1">1 propuesta</option>
            <option value="2">2 propuestas</option>
            <option value="3">3 propuestas</option>
          </Select>
        </div>

        {/* Nombres y URLs de cotización */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[var(--accent)]">🔗 Propuestas</span>
            <span className="rounded bg-[var(--pill-bg)] px-2 py-1 text-[11px] text-[var(--muted)]">Nombres editables</span>
          </div>
          <LinkInputs 
            linkCount={linkCount} 
            urls={urls} 
            planNames={planNames} 
            idealFor={idealFor} 
            errors={errors} 
            onUrlChange={onUrlChange} 
            onPlanNameChange={onPlanNameChange} 
            onIdealForChange={onIdealForChange}
            bestChoiceIndex={bestChoiceIndex}
            onBestChoiceIndexChange={onBestChoiceIndexChange}
            bestChoiceLabel={bestChoiceLabel}
            onBestChoiceLabelChange={onBestChoiceLabelChange}
          />
          <p className="text-xs text-[var(--muted)]">
            * URLs de Odoo: <code className="rounded bg-[var(--code-bg)] px-1 py-0.5 text-[11px]">https://odoo.com/my/orders/...</code>
          </p>
        </div>

        {/* Comentarios adicionales */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[var(--accent)]">💡 A tener en cuenta</span>
            <span className="rounded bg-[var(--pill-bg)] px-2 py-1 text-[11px] text-[var(--muted)]">Opcional</span>
          </div>
          <Textarea
            placeholder="Agrega información que consideres importante para tus clientes..."
            value={comments}
            onChange={(event) => onCommentsChange(event.target.value)}
          />
        </div>
      </div>

      <div className="border-t border-[var(--card-border)] pt-6">
        <Button onClick={onGenerate} loading={loading} className="w-full">
          ⚡ Generar Correo
        </Button>
      </div>
    </Card>
  );
}

