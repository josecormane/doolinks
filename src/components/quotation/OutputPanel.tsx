"use client";

import { Tabs } from "@/components/ui/Tabs";
import { Textarea } from "@/components/ui/Textarea";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { EmailPreview, StyleVariant } from "@/components/email-templates/EmailPreview";
import { QuotationPlan } from "@/lib/types/quotation";

interface OutputPanelProps {
  viewMode: "code" | "preview";
  onViewModeChange(value: "code" | "preview"): void;
  htmlOutput: string;
  plans: QuotationPlan[];
  style: StyleVariant;
  comments: string;
  statusMessage: string;
  statusRight?: string;
  statusVariant: "neutral" | "success" | "error";
  onHtmlChange(value: string): void;
}

export function OutputPanel({
  viewMode,
  onViewModeChange,
  htmlOutput,
  onHtmlChange,
  plans,
  style,
  comments,
  statusMessage,
  statusVariant,
  statusRight,
}: OutputPanelProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Salida de email</h2>
        <Tabs
          options={[
            { label: "Código HTML", value: "code", icon: "🧾" },
            { label: "Vista previa", value: "preview", icon: "👀" },
          ]}
          value={viewMode}
          onChange={(value) => onViewModeChange(value as "code" | "preview")}
        />
      </div>

      <div className="relative flex-1">
        {viewMode === "code" ? (
          <Textarea
            className="h-full min-h-[320px] font-mono text-[12px] leading-relaxed"
            value={htmlOutput}
            onChange={(event) => onHtmlChange(event.target.value)}
          />
        ) : plans.length ? (
          <div className="h-full rounded-xl bg-white">
            <EmailPreview style={style} plans={plans} comments={comments} />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-white/20 text-sm text-white/60">
            Genera el HTML primero para habilitar la vista previa.
          </div>
        )}
      </div>

      <StatusMessage variant={statusVariant} rightSlot={statusRight} className="mt-3">
        {statusMessage}
      </StatusMessage>
    </div>
  );
}

