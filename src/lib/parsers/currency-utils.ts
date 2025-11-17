export function cleanText(value?: string | null): string {
  return (value || "")
    .replace(/\uFEFF/g, "")
    .replace(/\u00a0|\u202f/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseLocalizedNumber(value?: string | null): number | null {
  const text = cleanText(value);
  if (!text) return null;
  const sanitized = text.replace(/[^\d.,-]/g, "");
  if (!sanitized) return null;

  const lastComma = sanitized.lastIndexOf(",");
  const lastDot = sanitized.lastIndexOf(".");

  let normalized = sanitized;
  if (lastComma > lastDot) {
    normalized = sanitized.replace(/\./g, "").replace(/,/g, ".");
  } else {
    normalized = sanitized.replace(/,/g, "");
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function formatCurrencyValue(value?: number | null, symbol?: string): string {
  if (typeof value !== "number" || Number.isNaN(value)) return "";
  const formatted = value.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return symbol ? `${formatted} ${symbol}` : formatted;
}

