import { Cheerio, CheerioAPI, load } from "cheerio";
import type { Element } from "domhandler";

import { QuotationParseResult } from "../types/quotation";
import { cleanText, parseLocalizedNumber, formatCurrencyValue } from "./currency-utils";

const DEFAULT_PAYMENT_TERMS = "1 Pago por adelantado a la firma";
const PAYMENT_DISCLAIMER_PATTERNS = [
  /I hereby agree that I will be invoiced upon order acceptation and I will pay(?: the invoice within [^.\n]+)?\.?/gi,
];

function findTableValue($: CheerioAPI, table: Cheerio<Element>, label: string): string | undefined {
  if (!table || !table.length) return undefined;
  const rows = table.find("tr").toArray();
  const target = label.toLowerCase();

  for (const row of rows) {
    const header = cleanText($(row).find("th").first().text());
    if (header.toLowerCase().startsWith(target)) {
      const value =
        $(row).find("td span").first().text() ||
        $(row).find("td em").first().text() ||
        $(row).find("td").first().text();
      return cleanText(value);
    }
  }

  return undefined;
}

function detectCurrencySymbol(text: string): string | undefined {
  const match = cleanText(text).match(/[^\d.,\s-]+/g);
  return match ? match.pop() : undefined;
}

function getSectionText($: CheerioAPI, titleFragment: string): string | undefined {
  const sections = $("section").toArray();
  const target = titleFragment.toLowerCase();

  for (const section of sections) {
    const title = cleanText($(section).find("h4").first().text()).toLowerCase();
    if (title.includes(target)) {
      const paragraphs = $(section)
        .find("p")
        .toArray()
        .map((p) => cleanText($(p).text()))
        .filter(Boolean);

      return paragraphs.join(" ") || cleanText($(section).text());
    }
  }
  return undefined;
}

function normalizeParagraphText(element: Cheerio<Element>): string {
  const html = element.html() || "";
  const withLineBreaks = html.replace(/<br\s*\/?>/gi, "\n");
  return withLineBreaks
    .split("\n")
    .map((line) => cleanText(line))
    .filter(Boolean)
    .join("\n");
}

function extractPaymentTerms($: CheerioAPI): string | undefined {
  // Buscar específicamente la sección con h4 "Payment terms" o "Condiciones de pago"
  const headers = $("h4").toArray();
  
  for (const header of headers) {
    const headerText = cleanText($(header).text()).toLowerCase();
    
    // Verificar si es exactamente la sección de condiciones de pago
    if (
      headerText === "payment terms" || 
      headerText === "condiciones de pago" ||
      headerText === "términos de pago"
    ) {
      // Buscar el contenido justo después del hr siguiente
      const nextHr = $(header).next("hr");
      if (nextHr.length) {
        // El contenido está después del <hr>
        const paragraphs: string[] = [];
        let current = nextHr.next();
        
        // Capturar párrafos hasta encontrar el siguiente <hr>, <h4>, <section> o botón
        while (current.length) {
          if (current.is("hr") || current.is("h4") || current.is("section") || 
              current.is("a") || current.is("button") || current.hasClass("modal")) {
            break;
          }
          
          if (current.is("p")) {
            const text = normalizeParagraphText(current);
            if (text && !text.toLowerCase().includes("firmar") && 
                !text.toLowerCase().includes("sign") &&
                !text.toLowerCase().includes("opinión") &&
                !text.toLowerCase().includes("rechazar")) {
              paragraphs.push(text);
            }
          }
          
          current = current.next();
        }
        
        if (paragraphs.length > 0) {
          // Unir párrafos: si termina en punto, agregar salto de línea; si no, agregar espacio
          let result = '';
          for (let i = 0; i < paragraphs.length; i++) {
            const p = paragraphs[i];
            result += p;
            if (i < paragraphs.length - 1) {
              // Si el párrafo actual termina en punto, agregar salto de línea
              // Si no, agregar espacio
              result += p.endsWith('.') ? '\n' : ' ';
            }
          }
          return result;
        }
      }
    }
  }
  
  // Fallback: buscar en section con id o class específico
  const paymentSection = $("section").filter(function() {
    const title = $(this).find("h4").first().text().toLowerCase();
    return title.includes("payment") || title.includes("condiciones de pago");
  });
  
  if (paymentSection.length) {
    const paragraphs = paymentSection.find("p")
      .toArray()
      .map((p) => normalizeParagraphText($(p)))
      .filter(text => text && 
        !text.toLowerCase().includes("firmar") && 
        !text.toLowerCase().includes("sign") &&
        !text.toLowerCase().includes("opinión") &&
        !text.toLowerCase().includes("rechazar"));
    
    if (paragraphs.length > 0) {
      // Unir párrafos: si termina en punto, agregar salto de línea; si no, agregar espacio
      let result = '';
      for (let i = 0; i < paragraphs.length; i++) {
        const p = paragraphs[i];
        result += p;
        if (i < paragraphs.length - 1) {
          // Si el párrafo actual termina en punto, agregar salto de línea
          // Si no, agregar espacio
          result += p.endsWith('.') ? '\n' : ' ';
        }
      }
      return result;
    }
  }
  
  return undefined;
}

function sanitizePaymentTerms(rawText?: string): string | undefined {
  if (!rawText) return undefined;

  let withoutDisclaimer = rawText;
  for (const pattern of PAYMENT_DISCLAIMER_PATTERNS) {
    withoutDisclaimer = withoutDisclaimer.replace(pattern, "\n");
  }

  withoutDisclaimer = withoutDisclaimer
    .replace(/\n{2,}/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .trim();

  if (!withoutDisclaimer) return undefined;

  const normalized = withoutDisclaimer
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");

  return normalized || undefined;
}

function deriveDurationText(planLabel?: string, expirationDate?: string): string | undefined {
  const plan = cleanText(planLabel);
  if (plan) {
    const match = plan.match(/(\d+)\s*(año|años|year|years|mes|meses|month|months)/i);
    if (match) {
      const value = parseInt(match[1], 10);
      const unit = match[2].toLowerCase();
      if (Number.isFinite(value) && value > 0) {
        if (unit.startsWith("año") || unit.startsWith("year")) {
          const months = value * 12;
          return `${value} ${value === 1 ? "year" : "years"} (${months} months)`;
        }
        return `${value} ${value === 1 ? "month" : "months"}`;
      }
    }
  }
  if (expirationDate) {
    return `Valid until ${expirationDate}`;
  }
  return plan || undefined;
}

interface MonetaryParts {
  text?: string;
  value?: number | null;
  symbol?: string;
}

function extractMonetaryParts(element?: Cheerio<Element>): MonetaryParts {
  if (!element || !element.length) return {};

  const rawText = cleanText(element.text());
  const parent = cleanText(element.parent().text());
  const text = parent || rawText;
  const symbol = detectCurrencySymbol(text);
  const value = parseLocalizedNumber(rawText || text);

  return { text, value, symbol };
}

function buildSavingsBreakdown(
  discountLines: LineItem[],
  fallbackSymbol?: string
): { label: string; amountText: string }[] {
  return discountLines
    .map((line) => {
      const amountAbs = Math.abs(line.amountValue || 0);
      const formatted =
        formatCurrencyValue(amountAbs, line.currencySymbol || fallbackSymbol) ||
        line.amountText;
      return {
        label: line.name,
        amountText: formatted || "",
      };
    })
    .filter((item) => item.label && item.amountText);
}

interface LineItem {
  name: string;
  quantityDisplay?: string;
  quantityValue?: number | null;
  unitPriceText?: string;
  unitPriceValue?: number | null;
  amountText?: string;
  amountValue?: number | null;
  currencySymbol?: string;
}

function parseLineItems($: CheerioAPI): LineItem[] {
  return $('#sales_order_table tbody tr[name="tr_product"]')
    .toArray()
    .map((row) => {
      const $row = $(row);
      const name = cleanText($row.find('[name="td_product_name"]').text());

      const quantitySpans = $row.find('[name="td_product_quantity"] span');
      const quantityValue = parseLocalizedNumber(quantitySpans.eq(0).text());
      const quantityUnit = cleanText(quantitySpans.eq(1).text());
      const quantityDisplay = quantitySpans.length
        ? [cleanText(quantitySpans.eq(0).text()), quantityUnit].filter(Boolean).join(" ")
        : undefined;

      const unitPriceInfo = extractMonetaryParts(
        $row.find('[name="td_product_priceunit"] .oe_currency_value').first()
      );
      const amountInfo = extractMonetaryParts(
        $row.find('[name="td_product_subtotal"] .oe_currency_value').first()
      );

      const currencySymbol = amountInfo.symbol || unitPriceInfo.symbol;

      return {
        name,
        quantityValue,
        quantityDisplay,
        unitPriceText: unitPriceInfo.text,
        unitPriceValue: unitPriceInfo.value,
        amountText: amountInfo.text,
        amountValue: amountInfo.value,
        currencySymbol,
      };
    })
    .filter((line) => !!line.name);
}

export function parseQuotationHtml(
  html: string,
  url: string,
  index: number
): QuotationParseResult {
  console.log(`[Parser] Iniciando parseo de cotización ${index}`);
  const $ = load(html);

  const subscriptionTable = $("#sale_info_title").closest("div").find("table").first();
  console.log(`[Parser] Tabla de suscripción encontrada:`, subscriptionTable.length > 0);

  const planLabel = findTableValue($, subscriptionTable, "Plan");
  console.log(`[Parser] Plan encontrado:`, planLabel);
  
  const orderName = findTableValue($, subscriptionTable, "Order");
  console.log(`[Parser] Nombre de orden encontrado:`, orderName);
  
  const orderDate = findTableValue($, subscriptionTable, "Date");
  console.log(`[Parser] Fecha de orden encontrada:`, orderDate);
  
  const expirationDate = findTableValue($, subscriptionTable, "Expiration");
  console.log(`[Parser] Fecha de expiración encontrada:`, expirationDate);
  
  const reference = findTableValue($, subscriptionTable, "Reference");
  console.log(`[Parser] Referencia encontrada:`, reference);

  const totalSpan = $(
    'table[name="sale_order_totals_table"] tr.o_total span.oe_currency_value'
  ).first();
  console.log(`[Parser] Total span encontrado:`, totalSpan.length > 0);
  
  const totalInfo = extractMonetaryParts(totalSpan);
  console.log(`[Parser] Información monetaria total:`, {
    text: totalInfo.text,
    value: totalInfo.value,
    symbol: totalInfo.symbol
  });
  
  const fallbackCurrency = totalInfo.symbol || "€";
  console.log(`[Parser] Símbolo de moneda a usar:`, fallbackCurrency);

  const lineItems = parseLineItems($);
  console.log(`[Parser] Líneas de producto encontradas:`, lineItems.length);
  
  if (!lineItems.length) {
    console.error(`[Parser] Error: No se encontraron líneas de producto`);
    throw new Error("No se encontraron líneas de productos para esta cotización.");
  }
  
  lineItems.forEach((item, idx) => {
    console.log(`[Parser] Línea ${idx + 1}:`, {
      nombre: item.name,
      cantidad: item.quantityDisplay,
      precioUnitario: item.unitPriceText,
      monto: item.amountText,
      moneda: item.currencySymbol
    });
  });

  const positiveLines = lineItems.filter((line) => (line.amountValue || 0) > 0);
  const discountLines = lineItems.filter((line) => (line.amountValue || 0) < 0);
  console.log(`[Parser] Líneas positivas: ${positiveLines.length}, Líneas de descuento: ${discountLines.length}`);
  
  const mainLine = positiveLines[0] || lineItems[0];
  console.log(`[Parser] Línea principal seleccionada:`, mainLine?.name);

  const totalSavingsValue = discountLines.reduce((acc, line) => {
    const value = Math.abs(line.amountValue || 0);
    return acc + value;
  }, 0);
  console.log(`[Parser] Ahorros totales calculados:`, totalSavingsValue);

  const totalSavingsText =
    totalSavingsValue > 0
      ? formatCurrencyValue(totalSavingsValue, fallbackCurrency)
      : undefined;
  console.log(`[Parser] Texto de ahorros totales:`, totalSavingsText);

  const rawPaymentTerms = extractPaymentTerms($);
  const sanitizedPaymentTerms = sanitizePaymentTerms(rawPaymentTerms);
  const paymentTerms = sanitizedPaymentTerms || DEFAULT_PAYMENT_TERMS;
  console.log(`[Parser] Términos de pago encontrados:`, paymentTerms);
  
  const duration = deriveDurationText(planLabel, expirationDate);
  console.log(`[Parser] Duración derivada:`, duration);

  const result = {
    title: planLabel || orderName || `Plan ${index}`,
    subtitle: reference || orderName,
    duration,
    orderName,
    orderDate,
    expirationDate,
    totalAmountText: totalInfo.text,
    totalAmountValue: totalInfo.value ?? undefined,
    currencySymbol: fallbackCurrency,
    pricePerLicenseText: mainLine?.unitPriceText,
    quantityText: mainLine?.quantityDisplay,
    mainProduct: mainLine?.name,
    paymentTerms,
    totalSavingsText,
    totalSavingsValue: totalSavingsValue || undefined,
    savingsBreakdown: buildSavingsBreakdown(discountLines, fallbackCurrency),
    summaryLine: mainLine
      ? [mainLine.name, mainLine.quantityDisplay].filter(Boolean).join(" | ")
      : undefined,
    ctaUrl: url,
  };
  
  console.log(`[Parser] Resultado final de parseo para cotización ${index}:`, {
    titulo: result.title,
    subtitulo: result.subtitle,
    montoTotal: result.totalAmountText,
    producto: result.mainProduct,
    cantidadLineas: lineItems.length
  });

  return result;
}

