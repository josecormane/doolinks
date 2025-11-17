"use client";

import { useCallback, useMemo, useState } from "react";

import { generateEmailHtml, StyleVariant } from "@/components/email-templates/EmailPreview";
import { QuotationPlan } from "@/lib/types/quotation";
import { useFormValidation } from "./useFormValidation";

const STYLE_LABELS: Record<StyleVariant, string> = {
  style1: "Moderno",
  style2: "Compacto",
  style3: "Minimalista",
};


type StatusVariant = "neutral" | "success" | "error";

export function useQuotationGenerator() {
  const [linkCount, setLinkCount] = useState(3);
  const [style, setStyle] = useState<StyleVariant>("style1");
  const [urls, setUrls] = useState(["", "", ""]);
  const [planNames, setPlanNames] = useState(["Plan Esencial", "Plan Equilibrado", "Plan Premium"]);
  const [idealFor, setIdealFor] = useState([
    "Validar roadmap con menor compromiso",
    "La inversión más equilibrada",
    "Más ahorro, retorno más rápido"
  ]);
  const [comments, setComments] = useState("");
  const [plans, setPlans] = useState<QuotationPlan[]>([]);
  const [htmlOutput, setHtmlOutput] = useState("");
  const [viewMode, setViewMode] = useState<"code" | "preview">("preview");
  const [statusMessage, setStatusMessage] = useState("Listo para generar.");
  const [statusVariant, setStatusVariant] = useState<StatusVariant>("neutral");
  const [statusRight, setStatusRight] = useState("");
  const [loading, setLoading] = useState(false);

  const urlsToUse = useMemo(() => urls.slice(0, linkCount), [urls, linkCount]);
  const { errors, validateUrls, clearError } = useFormValidation();

  const updateUrl = useCallback((index: number, value: string) => {
    setUrls((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    // Clear error for this field when user starts typing
    clearError(index);
  }, [clearError]);

  const updatePlanName = useCallback((index: number, value: string) => {
    setPlanNames((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const updateIdealFor = useCallback((index: number, value: string) => {
    setIdealFor((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
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
      
      // Apply custom plan names and idealFor
      const plansWithCustomFields = data.plans.map((plan, idx) => ({
        ...plan,
        title: planNames[idx] || plan.title,
        summaryLine: idealFor[idx] || plan.summaryLine,
      }));
      
      setPlans(plansWithCustomFields);

      const generatedHtml = generateEmailHtml(style, plansWithCustomFields, comments);
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
  };
}

