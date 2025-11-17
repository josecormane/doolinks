import { NextResponse } from "next/server";
import { z } from "zod";

import { parseQuotationHtml } from "@/lib/parsers/odoo-parser";
import { assertQuotationUrl } from "@/lib/validators/url-validator";
import { ApiErrorShape, QuotationPlan } from "@/lib/types/quotation";

const requestSchema = z.object({
  urls: z.array(z.string().url()).min(1).max(3),
});

async function fetchQuotation(url: string, index: number): Promise<QuotationPlan> {
  const sanitized = assertQuotationUrl(url);
  console.log(`[fetchQuotation] Iniciando fetch para URL ${index}:`, sanitized);
  
  const response = await fetch(sanitized, {
    cache: "no-store",
    headers: {
      "User-Agent": "3links-proposals/1.0",
    },
  });

  if (!response.ok) {
    console.error(`[fetchQuotation] Error en respuesta para URL ${index}. Status:`, response.status);
    throw new Error(`La solicitud a Odoo devolvió el estado ${response.status}.`);
  }

  const html = await response.text();
  console.log(`[fetchQuotation] HTML recibido para URL ${index}. Longitud:`, html.length);
  
  const result = parseQuotationHtml(html, sanitized, index);
  console.log(`[fetchQuotation] Cotización parseada para URL ${index}:`, JSON.stringify(result, null, 2));
  
  return result;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("[API] Solicitud recibida con URLs:", body.urls);
    
    const { urls } = requestSchema.parse(body);
    console.log("[API] URLs validadas:", urls);

    const results = await Promise.all(
      urls.map((url, idx) => fetchQuotation(url, idx + 1))
    );

    console.log("[API] Todas las cotizaciones procesadas exitosamente. Total:", results.length);
    return NextResponse.json({ plans: results });
  } catch (error) {
    console.error("[API] Error al procesar cotizaciones:", error);
    const shape: ApiErrorShape = {
      message:
        (error as Error)?.message ||
        "Hubo un problema al procesar las cotizaciones en el servidor.",
    };
    return NextResponse.json(shape, { status: 400 });
  }
}

