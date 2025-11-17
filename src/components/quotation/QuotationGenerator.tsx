"use client";

import { Card } from "@/components/ui/Card";
import { StyleVariant } from "@/components/email-templates/EmailPreview";
import { QuotationForm } from "./QuotationForm";
import { OutputPanel } from "./OutputPanel";
import { useQuotationGenerator } from "@/hooks/useQuotationGenerator";


export function QuotationGenerator() {
    const {
      linkCount,
      setLinkCount,
      style,
      setStyle,
      urls,
      planNames,
      idealFor,
      updatePlanName,
      updateIdealFor,
      errors,
      comments,
      setComments,
      updateUrl,
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
      </header>

      <div className="grid gap-6 lg:grid-cols-[25%_75%]">
        <QuotationForm
          linkCount={linkCount}
          onLinkCountChange={handleLinkCountChange}
          urls={urls}
          planNames={planNames}
          idealFor={idealFor}
          errors={errors}
          onUrlChange={updateUrl}
          onPlanNameChange={updatePlanName}
          onIdealForChange={updateIdealFor}
          comments={comments}
          onCommentsChange={setComments}
          onGenerate={handleGenerate}
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
            onStyleChange={(value) => setStyle(value as StyleVariant)}
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

