"use client";

import { useCallback, useMemo, useState } from "react";

import { generateEmailHtml, StyleVariant } from "@/components/email-templates/EmailPreview";
import { QuotationPlan } from "@/lib/types/quotation";
import { useFormValidation } from "./useFormValidation";

const STYLE_LABELS: Record<StyleVariant, string> = {
  style1: "Estilo 1",
  style2: "Estilo 2",
  style3: "Estilo 3",
};

const SAMPLE_URL = "https://www.odoo.com/my/orders/6970352?access_token=55c22618-2c2b-4ac5-a510-4c8adfa4abce";

type StatusVariant = "neutral" | "success" | "error";

export function useQuotationGenerator() {
  const [linkCount, setLinkCount] = useState(3);
  const [style, setStyle] = useState<StyleVariant>("style1");
  const [urls, setUrls] = useState(["", "", ""]);
  const [comments, setComments] = useState("");
  const [plans, setPlans] = useState<QuotationPlan[]>([]);
  const [htmlOutput, setHtmlOutput] = useState("");
  const [viewMode, setViewMode] = useState<"code" | "preview">("code");
  const [statusMessage, setStatusMessage] = useState("Listo para generar.");
  const [statusVariant, setStatusVariant] = useState<StatusVariant>("neutral");
  const [statusRight, setStatusRight] = useState("");
  const [loading, setLoading] = useState(false);

  const urlsToUse = useMemo(() => urls.slice(0, linkCount), [urls, linkCount]);
  const { errors, validateUrls } = useFormValidation();

  const updateUrl = useCallback((index: number, value: string) => {
    setUrls((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const fillSampleData = useCallback(() => {
    setUrls((prev) => prev.map(() => SAMPLE_URL));
    setStatusMessage("Enlaces de ejemplo agregados. Reemplázalos con tus cotizaciones reales antes de enviar.");
    setStatusVariant("neutral");
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!validateUrls(urlsToUse)) {
      setStatusMessage("Algunos enlaces contienen errores. Por favor corrígelos antes de continuar.");
      setStatusVariant("error");
      return;
    }

    setLoading(true);
    setStatusVariant("neutral");
    setStatusMessage("Leyendo datos de cotización...");
    setStatusRight("");

    try {
      const payload = { urls: urlsToUse.map((url) => url.trim()) };
      const response = await fetch("/api/fetch-quotation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "El servidor devolvió un error inesperado.");
      }

      const data = (await response.json()) as { plans: QuotationPlan[] };
      setPlans(data.plans);

      const generatedHtml = generateEmailHtml(style, data.plans, comments);
      setHtmlOutput(generatedHtml);
      setStatusMessage("HTML generado exitosamente.");
      setStatusVariant("success");
      setStatusRight(`${data.plans.length} plan(es) | ${STYLE_LABELS[style]}`);
    } catch (error) {
      setStatusMessage(
        (error as Error)?.message || "Algo salió mal al generar el HTML. Revisa la consola del navegador."
      );
      setStatusVariant("error");
    } finally {
      setLoading(false);
    }
  }, [urlsToUse, style, comments, validateUrls]);

  return {
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
  };
}

