export interface SavingsBreakdown {
  label: string;
  amountText: string;
}

export interface QuotationPlan {
  title: string;
  subtitle?: string;
  duration?: string;
  orderName?: string;
  orderDate?: string;
  expirationDate?: string;
  totalAmountText?: string;
  totalAmountValue?: number;
  currencySymbol?: string;
  pricePerLicenseText?: string;
  quantityText?: string;
  mainProduct?: string;
  paymentTerms?: string;
  totalSavingsText?: string;
  totalSavingsValue?: number;
  savingsBreakdown: SavingsBreakdown[];
  summaryLine?: string;
  ctaUrl: string;
}

export type QuotationParseResult = QuotationPlan;

export interface FetchQuotationPayload {
  url: string;
  index: number;
}

export interface ApiErrorShape {
  message: string;
  details?: string;
}

