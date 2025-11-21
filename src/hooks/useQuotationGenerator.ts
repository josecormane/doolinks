"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

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
  const [bestChoiceIndex, setBestChoiceIndex] = useState<number | null>(1);
  const [bestChoiceLabel, setBestChoiceLabel] = useState("⭐ MÁS ELEGIDO ⭐");
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

  // Calcular los planes efectivos combinando los datos base con los inputs actuales
  const effectivePlans = useMemo(() => {
    return plans.map((plan, idx) => ({
      ...plan,
      // Si hay un nombre personalizado en el input, usarlo. Si no, mantener el que viene del plan (o fetch)
      title: planNames[idx] || plan.title,
      summaryLine: idealFor[idx] || plan.summaryLine,
    }));
  }, [plans, planNames, idealFor]);

  // Regenerar HTML automáticamente cuando cambian los datos o configuraciones
  useEffect(() => {
    if (effectivePlans.length === 0) return;

    try {
      const generatedHtml = generateEmailHtml(style, effectivePlans, comments, bestChoiceIndex, bestChoiceLabel);
      setHtmlOutput(generatedHtml);
      
      // Actualizar mensaje de estado discretamente si no estamos cargando
      if (!loading) {
         setStatusRight(`${effectivePlans.length} plan(es) | ${STYLE_LABELS[style]}`);
      }
    } catch (error) {
      console.error("Error generando HTML:", error);
    }
  }, [effectivePlans, style, comments, bestChoiceIndex, bestChoiceLabel, loading]);


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
      const payload = {
        urls: urlsToUse.map((url) => {
          const trimmed = url.trim();
          // Ensure protocol exists
          if (!/^https?:\/\//i.test(trimmed)) {
            return `https://${trimmed}`;
          }
          return trimmed;
        }),
      };
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
      
      // Guardamos los planes tal cual vienen del server (o con un primer pase de nombres)
      // El useMemo 'effectivePlans' se encargará de mantenerlos sincronizados con los inputs
      const plansWithCustomFields = data.plans.map((plan, idx) => ({
        ...plan,
        title: planNames[idx] || plan.title,
        summaryLine: idealFor[idx] || plan.summaryLine,
      }));
      
      setPlans(plansWithCustomFields);
      // Nota: No necesitamos llamar a setHtmlOutput aquí porque el useEffect lo hará al cambiar 'plans'
      
      setStatusMessage("Datos obtenidos exitosamente.");
      setStatusVariant("success");
    } catch (error) {
      setStatusMessage(
        (error as Error)?.message || "Algo salió mal al obtener los datos. Revisa la consola."
      );
      setStatusVariant("error");
    } finally {
      setLoading(false);
    }
  }, [urlsToUse, validateUrls, planNames, idealFor]);

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
    plans: effectivePlans, // Devolvemos los planes efectivos para que la UI los muestre si es necesario
    htmlOutput,
    setHtmlOutput,
    viewMode,
    setViewMode,
    statusMessage,
    statusVariant,
    statusRight,
  };
}
