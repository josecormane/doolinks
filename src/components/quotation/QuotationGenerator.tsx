"use client";

import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
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
      bestChoiceIndex,
      setBestChoiceIndex,
      bestChoiceLabel,
      setBestChoiceLabel,
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
      <header className="space-y-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-6">
            <Image
              src="/odoo_spain_logo-i-e.png"
              alt="Odoo Logo"
              width={120}
              height={48}
              className="h-auto w-[120px] object-contain"
              style={{ height: "auto", width: "120px" }}
              priority
            />
            <h1 className="text-2xl font-semibold text-[var(--accent)]">Generador de propuestas</h1>
            <span className="rounded-full border border-[var(--accent-soft)] bg-[var(--surface-highlight)] px-3 py-1 text-xs font-medium text-[var(--accent-soft)]">
              beta
            </span>
          </div>
          <ThemeToggle />
        </div>
        <p className="text-sm text-[var(--muted)]">
          Pega de 1 a 3 URLs de cotización, elige un diseño y copia el contenido listo para pegar en tu correo.
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
          bestChoiceIndex={bestChoiceIndex}
          onBestChoiceIndexChange={setBestChoiceIndex}
          bestChoiceLabel={bestChoiceLabel}
          onBestChoiceLabelChange={setBestChoiceLabel}
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
            bestChoiceIndex={bestChoiceIndex}
            bestChoiceLabel={bestChoiceLabel}
            statusMessage={statusMessage}
            statusVariant={statusVariant}
            statusRight={statusRight}
          />
        </Card>
      </div>
    </div>
  );
}

