"use client";

import { Card } from "@/components/ui/Card";
import { StyleVariant } from "@/components/email-templates/EmailPreview";
import { QuotationForm } from "./QuotationForm";
import { OutputPanel } from "./OutputPanel";
import { useQuotationGenerator } from "@/hooks/useQuotationGenerator";

const BADGES = ["Validación de patrón de URL", "3 diseños de email", "Modos código y vista previa"];

export function QuotationGenerator() {
  const {
    linkCount,
    setLinkCount,
    style,
    setStyle,
    urls,
    errors,
    comments,
    setComments,
    updateUrl,
    fillSampleData,
    handleGenerate,
    loading,
    plans,
    htmlOutput,
    setHtmlOutput,
    viewMode,
    setViewMode,
    statusMessage,
    statusVariant,
    statusRight,
  } = useQuotationGenerator();

  const handleLinkCountChange = (value: number) => {
    const next = Math.min(3, Math.max(1, value));
    setLinkCount(next);
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2 rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-lg font-semibold">Generador de propuestas Odoo</h1>
          <span className="rounded-full border border-[#32d0ff]/50 px-3 py-1 text-xs text-[#32d0ff]">
            beta
          </span>
        </div>
        <p className="text-sm text-white/70">
          Pega de 1 a 3 URLs de cotización, elige un diseño y exporta HTML listo para email de ventas.
        </p>
        <div className="flex flex-wrap gap-2">
          {BADGES.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-white/70"
            >
              {badge}
            </span>
          ))}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.2fr)]">
        <QuotationForm
          linkCount={linkCount}
          onLinkCountChange={handleLinkCountChange}
          style={style}
          onStyleChange={(value) => setStyle(value as StyleVariant)}
          urls={urls}
          errors={errors}
          onUrlChange={updateUrl}
          comments={comments}
          onCommentsChange={setComments}
          onGenerate={handleGenerate}
          onFillSample={fillSampleData}
          loading={loading}
        />

        <Card className="flex flex-col">
          <OutputPanel
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            htmlOutput={htmlOutput}
            onHtmlChange={setHtmlOutput}
            plans={plans}
            style={style}
            comments={comments}
            statusMessage={statusMessage}
            statusVariant={statusVariant}
            statusRight={statusRight}
          />
        </Card>
      </div>
    </div>
  );
}

