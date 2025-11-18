import { QuotationPlan } from "@/lib/types/quotation";

type StyleVariant = "style1" | "style2" | "style3";

function escapeHtml(value?: string) {
  return (value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function translateDuration(value?: string) {
  if (!value) return value;
  return value
    .replace(/years/g, "años")
    .replace(/months/g, "meses")
    .replace(/year/g, "año")
    .replace(/month/g, "mes");
}

function calculatePricePerLicense(plan: QuotationPlan): string {
  const totalAmount = plan.totalAmountValue || 0;
  const currencySymbol = plan.currencySymbol || "€";

  // Intentar obtener los meses desde la duración (maneja inglés y español)
  const durationText = plan.duration || "";
  let months = 12;
  const monthsParensMatch = durationText.match(/\((\d+)\s*(?:months?|meses?)\)/i);
  const monthsInlineMatch = durationText.match(/(\d+)\s*(?:months?|meses?)/i);
  if (monthsParensMatch) {
    months = parseInt(monthsParensMatch[1], 10);
  } else if (monthsInlineMatch) {
    months = parseInt(monthsInlineMatch[1], 10);
  }

  // Intentar obtener cantidad de licencias
  let quantity = 1;
  if (plan.quantityText) {
    const quantityMatch = plan.quantityText.match(/(\d+(?:[.,]\d+)?)/);
    if (quantityMatch) {
      quantity = parseFloat(quantityMatch[1].replace(",", "."));
    }
  }

  months = Math.max(1, months);
  quantity = Math.max(1, quantity);

  const pricePerLicensePerMonth = totalAmount / months / quantity;
  return `${pricePerLicensePerMonth.toFixed(2)} ${currencySymbol}`;
}

function formatComments(comments?: string) {
  if (!comments) return "";
  return `<div style="margin-top:18px;padding:12px 14px;border-radius:10px;background:#fef9c3;color:#713f12;font-size:13px;">
    <strong>💡 A tener en cuenta:</strong><br/>${escapeHtml(comments).replace(/\n/g, "<br/>")}
  </div>`;
}

function disclaimer() {
  return `<div style="margin-top: 30px; border-top: 1px solid #e0e0e0; padding-top: 20px; font-size: 11px; color: #777; line-height: 1.5;">
  </div>`;
}

// Renderiza el total con el símbolo de moneda alineado de forma consistente
// Usa una pequeña tabla inline para máxima compatibilidad entre clientes de email.
function renderAlignedAmount(amountText?: string, textColor: string = "#ffffff") {
  if (!amountText) {
    return "";
  }
  const trimmed = amountText.trim();
  // Captura la parte numérica y el símbolo al final (p.e. "1.234,56 €")
  const match = trimmed.match(/^(.+?)\s*([^\d\s]+)$/);
  const numberPart = match ? match[1] : trimmed;
  const symbolPart = match ? match[2] : "€";

  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0 auto; display:inline-table;">
      <tbody>
        <tr>
          <td style="font-size:42px;font-weight:700;line-height:1;color:${textColor};padding-right:6px;white-space:nowrap;">
            ${escapeHtml(numberPart)}
          </td>
          <td style="font-size:28px;font-weight:700;line-height:1;color:${textColor};vertical-align:baseline;padding-top:6px;">
            ${escapeHtml(symbolPart)}
          </td>
        </tr>
      </tbody>
    </table>
  `;
}

// STYLE 1: Moderno - 3 columnas con colores vibrantes (inspirado en el email de Brandooers)
function buildStyle1Moderno(plans: QuotationPlan[], comments?: string) {
  const colors = ["#17a2b8", "#e74c3c", "#1abc9c"];
  
  const cards = plans
    .map((plan, idx) => {
      const color = colors[idx] || colors[0];
      const isBest = idx === 1 && plans.length > 1;
      
      return `<td style="width: ${100 / plans.length}%; vertical-align: top; padding: 0px 10px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: rgb(255, 255, 255); border-radius: 8px; overflow: hidden;">
          <tbody>
            ${isBest ? `<tr><td style="background-color: ${color}; padding: 10px 0px; text-align: center;"><span style="color: rgb(255, 255, 255); font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">⭐ MÁS ELEGIDO ⭐</span></td></tr>` : ''}
            
            <tr><td style="background-color: ${color}; height: 4px; line-height: 0; font-size: 0px;">&nbsp;</td></tr>
            
            <tr><td style="padding: 40px 30px;">
              <h2 style="margin: 0px 0px 25px; font-size: 32px; color: rgb(44, 62, 80); text-align: center; font-weight: bold;">${escapeHtml(plan.title || "Plan")}</h2>
              
              <div style="background-color: ${color}; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
                <p style="margin: 0px 0px 5px; font-size: 14px; color: rgb(255, 255, 255); text-transform: uppercase; font-weight: 600;">TOTAL CONTRATO</p>
                <div style="margin: 0px 0px 10px; line-height: 1; text-align: center;">
                  ${renderAlignedAmount(plan.totalAmountText || "", "#ffffff")}
                </div>
                ${plan.duration ? `<p style="margin: 0px 0px 8px; font-size: 13px; color: rgb(255, 255, 255);">${translateDuration(plan.duration)}</p>` : ''}
                <p style="margin: 0px; font-size: 12px; color: rgba(255, 255, 255, 0.85);">Precio por licencia: ${escapeHtml(calculatePricePerLicense(plan))}</p>
              </div>

              <div style="background-color: ${isBest ? 'rgb(255, 251, 245)' : 'rgb(254, 254, 254)'}; border: 1px solid ${isBest ? 'rgb(255, 232, 204)' : 'rgb(233, 236, 239)'}; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
                ${plan.paymentTerms ? `
                  <p style="margin: 0px 0px 5px; font-size: 12px; color: ${isBest ? 'rgb(133, 100, 4)' : 'rgb(108, 117, 125)'}; font-weight: 600; text-transform: uppercase; text-align: center;">💎 Condiciones de Pago</p>
                  <p style="margin: 0px 0px 18px; font-size: 13px; color: ${isBest ? 'rgb(133, 100, 4)' : 'rgb(73, 80, 87)'}; text-align: center;">${escapeHtml(plan.paymentTerms)}</p>
                  <div style="border-top: 1px solid ${isBest ? 'rgb(255, 232, 204)' : 'rgb(233, 236, 239)'}; margin: 0px 0px 18px;"></div>
                ` : ''}

                ${plan.totalSavingsText ? `
                  <p style="margin: 0px 0px 8px; font-size: 13px; color: ${isBest ? 'rgb(133, 100, 4)' : 'rgb(108, 117, 125)'}; font-weight: 600; text-align: center;">💰 Ahorro total</p>
                  <p style="margin: 0px; font-size: 28px; color: ${color}; font-weight: 700; text-align: center; line-height: 1;">${escapeHtml(plan.totalSavingsText)}</p>
                ` : ''}
              </div>
              
              ${plan.summaryLine ? `
                <div style="margin-bottom: 25px; text-align: center;">
                  <p style="margin: 0px 0px 8px; font-size: 14px; font-weight: 600; color: rgb(44, 62, 80);">Ideal para:</p>
                  <p style="margin: 0px; font-size: 13px; color: rgb(108, 117, 125); line-height: 1.6;">${escapeHtml(plan.summaryLine)}</p>
                </div>
              ` : ''}
              
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%;">
                <tbody>
                  <tr>
                    <td style="text-align: center;">
                      <a href="${plan.ctaUrl}" style="color: rgb(255, 255, 255); display: inline-block; padding: 16px 40px; background-color: ${color}; text-decoration-line: none; font-size: 16px; font-weight: 600; border-radius: 4px;" target="_blank">Comenzar ahora</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td></tr>
          </tbody>
        </table>
      </td>`;
    })
    .join("");

  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="color: rgb(0, 0, 0); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: medium; background-color: rgb(249, 250, 251);">
    <tbody>
      <tr>
        <td style="padding: 40px 20px; background-color: rgb(249, 250, 251);">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 1200px; margin: 0px auto;">
            <tbody>
              <tr>
                <td style="padding: 0px; text-align: center;">
                  <h1 style="font-size: 28px; font-weight: bold; color: #1f2937; margin: 0 0 10px 0;">Propuesta de Licenciamiento</h1>
                  <p style="color: #666; font-size: 14px; margin: 0 0 20px 0;">Comparación de opciones disponibles</p>
                  ${formatComments(comments)}
                </td>
              </tr>
              <tr>
                <td style="padding: 0px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 20px; table-layout: fixed;">
                    <tbody>
                      <tr style="vertical-align: top;">
                        ${cards}
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 0px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 1200px; margin: 30px auto 0px;">
                    <tbody>
                      <tr>
                        <td style="padding: 25px; background-color: rgb(255, 255, 255); border-radius: 8px; border-left: 4px solid rgb(40, 167, 69);">
                          <p style="margin: 0px 0px 15px; font-size: 14px; color: rgb(44, 62, 80); line-height: 1.7;"><strong style="color: rgb(0, 123, 255);">Descuentos aplicables:</strong> Los descuentos se aplican exclusivamente a licenciamientos. No aplican en servicios de hosting Odoo.sh. Las condiciones están sujetas a cambios en cada renovación.</p>
                          <p style="margin: 0px; font-size: 14px; color: rgb(44, 62, 80); line-height: 1.7;"><strong style="color: rgb(108, 91, 123);">Maximiza tu inversión:</strong> Contacta con tu Partner Manager para cualquier aclaración o negociación personalizada. Estamos aquí para ayudarte a conseguir las ofertas más ajustadas y rentables para tu empresa, adaptadas a tus necesidades específicas.</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>`;
}

// STYLE 2: Compacto - Lista vertical por plan
function buildStyle2Compacto(plans: QuotationPlan[], comments?: string) {
  const sections = plans
    .map((plan) => {
      return `<h2 style="font-size: 18px; font-weight: bold; color: #1f2937; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px; margin: 25px 0 15px 0;">
        ${escapeHtml(plan.title || "Plan")}
        ${plan.subtitle ? `<span style="font-weight: normal; font-size: 14px; color: #666;"> - ${escapeHtml(plan.subtitle)}</span>` : ''}
      </h2>
      <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-size: 14px; color: #333; line-height: 1.8;">
        <tr>
          <td style="width: 180px; font-weight: 600; padding: 8px 0;">Total Contrato:</td>
          <td style="padding: 8px 0; font-weight: 600; color: #1e40af;">${escapeHtml(plan.totalAmountText || "")}</td>
        </tr>
        ${plan.duration ? `<tr>
          <td style="width: 180px; font-weight: 600; padding: 8px 0;">Duración:</td>
          <td style="padding: 8px 0;">${translateDuration(plan.duration)}</td>
        </tr>` : ''}
        <tr>
          <td style="width: 180px; font-weight: 600; padding: 8px 0;">Precio por Licencia:</td>
          <td style="padding: 8px 0;">${escapeHtml(calculatePricePerLicense(plan))}</td>
        </tr>
        ${plan.paymentTerms ? `<tr>
          <td style="width: 180px; font-weight: 600; padding: 8px 0; vertical-align: top;">Condiciones de Pago:</td>
          <td style="padding: 8px 0;">${escapeHtml(plan.paymentTerms)}</td>
        </tr>` : ''}
        ${plan.totalSavingsText ? `<tr>
          <td style="width: 180px; font-weight: 600; padding: 8px 0;">Ahorro total:</td>
          <td style="padding: 8px 0; font-weight: 600; color: #047857;">${escapeHtml(plan.totalSavingsText)}</td>
        </tr>` : ''}
        ${plan.summaryLine ? `<tr>
          <td style="width: 180px; font-weight: 600; padding: 8px 0;">Ideal para:</td>
          <td style="padding: 8px 0; font-style: italic;">${escapeHtml(plan.summaryLine)}</td>
        </tr>` : ''}
        <tr>
          <td colspan="2" style="padding-top: 16px;">
            <a href="${plan.ctaUrl}" style="display: inline-block; background-color: #5a67d8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 13px;">Ver Cotización Detallada</a>
          </td>
        </tr>
      </table>
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0 30px 0;">`;
    })
    .join("");

  return `<div style="padding: 20px; font-family: Arial, sans-serif; background-color: #f9fafb;">
    <div style="max-width: 700px; margin: 0 auto; background-color: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 30px 40px;">
      <h1 style="font-size: 24px; font-weight: bold; color: #1f2937; margin: 0 0 20px 0;">Propuesta de Licenciamiento</h1>
      ${formatComments(comments)}
      ${sections}
      ${disclaimer()}
    </div>
  </div>`;
}

// STYLE 3: Minimalista - Tabla comparativa
function buildStyle3Minimalista(plans: QuotationPlan[], comments?: string) {
  const characteristics = [
    { label: "Total Contrato", key: "totalAmountText" },
    { label: "Duración", key: "duration", transform: translateDuration },
    { label: "Precio por Licencia", key: calculatePricePerLicense },
    { label: "Cond. de Pago", key: "paymentTerms" },
    { label: "Ahorro total", key: "totalSavingsText" },
    { label: "Ideal para", key: "summaryLine" },
  ];

  const rows = characteristics
    .map((char) => {
      const cellContent = plans
        .map((plan) => {
          let value = typeof char.key === "function" ? char.key(plan) : (plan as any)[char.key];
          if (char.transform && value) {
            value = char.transform(value);
          }
          return `<td style="padding: 10px 15px; border-bottom: 1px solid #e0e0e0;">${escapeHtml(value || "")}</td>`;
        })
        .join("");

      return `<tr>
        <td style="padding: 10px 15px; border-bottom: 1px solid #e0e0e0; font-weight: 600; color: #333; background-color: #f9fafb; width: 25%;">${char.label}</td>
        ${cellContent}
      </tr>`;
    })
    .join("");

  const actionRow = `<tr>
    <td style="padding: 10px 15px; border-bottom: 1px solid #e0e0e0; font-weight: 600; color: #333; background-color: #f9fafb; width: 25%;">Acción</td>
    ${plans
      .map(
        (plan) =>
          `<td style="padding: 10px 15px; border-bottom: 1px solid #e0e0e0;"><a href="${plan.ctaUrl}" style="color: #1e40af; text-decoration: none; font-weight: bold;">Ver Cotización</a></td>`
      )
      .join("")}
  </tr>`;

  return `<div style="padding: 20px; font-family: Arial, sans-serif; background-color: #f3f4f6;">
    <div style="max-width: 900px; margin: 0 auto; background-color: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 30px;">
      <h1 style="font-size: 24px; font-weight: bold; color: #1f2937; margin: 0 0 25px 0;">Comparativa de Propuestas</h1>
      ${formatComments(comments)}
      <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; font-size: 14px; color: #333; margin-top: 20px;">
        <thead>
          <tr>
            <th style="padding: 12px 15px; border-bottom: 2px solid #333; text-align: left; background-color: #f9fafb;">Característica</th>
            ${plans.map((plan) => `<th style="padding: 12px 15px; border-bottom: 2px solid #333; text-align: left; font-size: 15px; color: #1f2937;">${escapeHtml(plan.title || "Plan")}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${rows}
          ${actionRow}
        </tbody>
      </table>
      ${disclaimer()}
    </div>
  </div>`;
}

export function buildEmailBody(style: StyleVariant, plans: QuotationPlan[], comments?: string) {
  if (style === "style2") {
    return buildStyle2Compacto(plans, comments);
  }
  if (style === "style3") {
    return buildStyle3Minimalista(plans, comments);
  }
  return buildStyle1Moderno(plans, comments);
}

export function buildFullHtml(bodyHtml: string) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Propuesta Odoo</title>
</head>
<body style="margin:0;padding:16px;background:#f3f4f6;">
  ${bodyHtml}
</body>
</html>`;
}
