"use client";

import { useMemo } from "react";

import { QuotationPlan } from "@/lib/types/quotation";

import { buildEmailBody, buildFullHtml } from "./templates";

export type StyleVariant = "style1" | "style2" | "style3";

interface EmailPreviewProps {
  style: StyleVariant;
  plans: QuotationPlan[];
  comments?: string;
  bestChoiceIndex?: number | null;
  bestChoiceLabel?: string;
}

export function EmailPreview({ style, plans, comments, bestChoiceIndex, bestChoiceLabel }: EmailPreviewProps) {
  const html = useMemo(
    () => buildEmailBody(style, plans, comments, bestChoiceIndex, bestChoiceLabel),
    [style, plans, comments, bestChoiceIndex, bestChoiceLabel]
  );

  return (
    <div
      className="h-full overflow-auto rounded-xl bg-white text-sm text-gray-900"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function generateEmailHtml(
  style: StyleVariant,
  plans: QuotationPlan[],
  comments?: string,
  bestChoiceIndex: number | null = 1,
  bestChoiceLabel: string = "⭐ MÁS ELEGIDO ⭐"
) {
  const body = buildEmailBody(style, plans, comments, bestChoiceIndex, bestChoiceLabel);
  return buildFullHtml(body);
}
