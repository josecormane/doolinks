"use client";

import { useRef } from "react";
import { Tabs } from "@/components/ui/Tabs";
import { Textarea } from "@/components/ui/Textarea";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { Button } from "@/components/ui/Button";
import { StyleSelector } from "./StyleSelector";
import { EmailPreview, StyleVariant } from "@/components/email-templates/EmailPreview";
import { QuotationPlan } from "@/lib/types/quotation";

interface OutputPanelProps {
  viewMode: "code" | "preview";
  onViewModeChange(value: "code" | "preview"): void;
  htmlOutput: string;
  plans: QuotationPlan[];
  style: StyleVariant;
  onStyleChange(value: StyleVariant): void;
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
  onStyleChange,
  comments,
  statusMessage,
  statusVariant,
  statusRight,
}: OutputPanelProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  const handleCopyHtml = async () => {
    // Si estamos en modo preview, copiar el contenido renderizado
    if (viewMode === "preview" && previewRef.current) {
      try {
        // Crear un rango de selección del contenido
        const range = document.createRange();
        range.selectNodeContents(previewRef.current);
        
        // Limpiar cualquier selección existente
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
          
          // Copiar la selección al portapapeles
          document.execCommand('copy');
          
          // Limpiar la selección
          selection.removeAllRanges();
          
          console.log("HTML renderizado copiado exitosamente");
        }
      } catch (error) {
        console.error("Error al copiar HTML renderizado:", error);
        // Fallback: copiar el texto HTML
        if (htmlOutput) {
          await navigator.clipboard.writeText(htmlOutput);
        }
      }
    } else {
      // En modo código, copiar el texto HTML
      if (htmlOutput) {
        await navigator.clipboard.writeText(htmlOutput);
      }
    }
  };


  return (
    <div className="flex h-full flex-col">
      {/* Selector de estilos */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-white/80">🎨 Estilo de email</span>
        </div>
        <StyleSelector value={style} onChange={onStyleChange} />
      </div>

      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-white">Salida de email</h2>
        <div className="flex items-center gap-2">
          <Tabs
            options={[
              { label: "Código HTML", value: "code", icon: "🧾" },
              { label: "Vista previa", value: "preview", icon: "👀" },
            ]}
            value={viewMode}
            onChange={(value) => onViewModeChange(value as "code" | "preview")}
          />
            {htmlOutput && (
                <Button
                  onClick={handleCopyHtml}
                  title="Copiar propuesta al portapapeles"
                  className="bg-gradient-to-r from-[#ff7a7a] to-[#ffb347] text-black font-medium hover:from-[#ff6666] hover:to-[#ff9933]"
                >
                  📋 Copiar Propuesta
                </Button>
            )}
        </div>
      </div>

      <div className="relative flex-1">
        {viewMode === "code" ? (
          <Textarea
            className="h-full min-h-[320px] font-mono text-[12px] leading-relaxed"
            value={htmlOutput}
            onChange={(event) => onHtmlChange(event.target.value)}
          />
        ) : plans.length ? (
          <div ref={previewRef} className="h-full rounded-xl bg-white overflow-auto">
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

