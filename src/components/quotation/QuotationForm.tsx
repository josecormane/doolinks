"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { StyleVariant } from "@/components/email-templates/EmailPreview";
import { LinkInputs } from "./LinkInputs";
import { StyleSelector } from "./StyleSelector";

interface QuotationFormProps {
  linkCount: number;
  onLinkCountChange(value: number): void;
  style: StyleVariant;
  onStyleChange(value: StyleVariant): void;
  urls: string[];
  errors: string[];
  onUrlChange(index: number, value: string): void;
  comments: string;
  onCommentsChange(value: string): void;
  onGenerate(): void;
  onFillSample(): void;
  loading: boolean;
}

export function QuotationForm({
  linkCount,
  onLinkCountChange,
  style,
  onStyleChange,
  urls,
  errors,
  onUrlChange,
  comments,
  onCommentsChange,
  onGenerate,
  onFillSample,
  loading,
}: QuotationFormProps) {
  return (
    <Card className="space-y-6">
      <div>
        <h2 className="mb-1 text-sm font-semibold text-white">Configuración de propuesta</h2>
        <p className="text-xs text-white/60">
          Pega hasta tres URLs de cotización, elige un diseño y genera un email listo para ventas.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="flex items-center justify-between text-xs text-white/60">
            <span className="text-white">Número de cotizaciones</span>
            <span>1-3 enlaces</span>
          </label>
          <Select
            value={String(linkCount)}
            onChange={(event) => onLinkCountChange(Number(event.target.value))}
          >
            <option value="1">1 enlace</option>
            <option value="2">2 enlaces</option>
            <option value="3">3 enlaces</option>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center justify-between text-xs text-white/60">
            <span className="text-white">Estilo de diseño</span>
            <span>3 diseños</span>
          </label>
          <StyleSelector value={style} onChange={(value) => onStyleChange(value as StyleVariant)} />
        </div>

        <div className="space-y-2">
          <label className="flex items-center justify-between text-xs text-white/60">
            <span className="text-white">URLs de cotización</span>
            <span>Validados antes de generar</span>
          </label>
          <LinkInputs linkCount={linkCount} urls={urls} errors={errors} onUrlChange={onUrlChange} />
          <p className="text-xs text-white/50">
            * El patrón se valida contra <code>https://odoo.com/my/orders/...</code>.
          </p>
        </div>

        <div className="space-y-2">
          <label className="flex items-center justify-between text-xs text-white/60">
            <span className="text-white">Comentarios adicionales</span>
            <span>Opcional</span>
          </label>
          <Textarea
            placeholder="Ejemplo: Esta propuesta incluye soporte prioritario e incorporación..."
            value={comments}
            onChange={(event) => onCommentsChange(event.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={onGenerate} loading={loading}>
          ⚡ Generar HTML
        </Button>
        <Button type="button" variant="ghost" onClick={onFillSample} disabled={loading}>
          Rellenar datos de ejemplo
        </Button>
      </div>
    </Card>
  );
}

