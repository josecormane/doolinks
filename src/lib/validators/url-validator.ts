const ODOO_URL_REGEX =
  /^https:\/\/(?:www\.)?odoo\.com(?:\/[a-z]{2}_[A-Z]{2})?\/my\/orders\/\d+(?:\?.*)?$/i;

export function isValidQuotationUrl(value: string): boolean {
  return ODOO_URL_REGEX.test((value || "").trim());
}

export function assertQuotationUrl(value: string): string {
  const sanitized = (value || "").trim();
  if (!isValidQuotationUrl(sanitized)) {
    throw new Error("La URL no coincide con el patrón esperado de Odoo.");
  }
  return sanitized;
}

