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

function calculateCostPerUserMonth(plan: QuotationPlan): string {
  // Usar el subtotal de licencias si está disponible (excluye servicios hosting)
  // Si no, usar el importe sin impuestos, y finalmente el total
  const baseAmount = plan.licensingSubtotal || plan.untaxedAmountValue || plan.totalAmountValue || 0;
  const currencySymbol = plan.currencySymbol || "€";
  const users = plan.totalUsers || 1;

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

  months = Math.max(1, months);

  // Calcular coste por usuario por mes
  const costPerUserMonth = baseAmount / (months * users);
  return `${costPerUserMonth.toFixed(2)} ${currencySymbol}`;
}

function formatComments(comments?: string) {
  if (!comments) return "";
  return `<div style="margin-top:18px;padding:12px 14px;border-radius:10px;background:#F3EEFF;border-left:4px solid #714B67;color:#4A2C42;font-size:13px;">
    <strong>💡 A tener en cuenta:</strong><br/>${escapeHtml(comments).replace(/\n/g, "<br/>")}
  </div>`;
}

function disclaimer() {
  return `<div style="margin-top: 30px; border-top: 1px solid #e0e0e0; padding-top: 20px; font-size: 11px; color: #777; line-height: 1.5;">
  </div>`;
}

function renderAlignedAmount(amountText?: string, textColor: string = "#ffffff", showIVASuffix: boolean = false) {
  if (!amountText) {
    return "";
  }
  const trimmed = amountText.trim();
  
  // Capturar símbolo al principio (US$, $, etc.) o al final (€, etc.)
  let numberPart = "";
  let symbolPart = "";
  
  // Intentar capturar símbolo al inicio primero (ej: US$ 3.010,68)
  const prefixMatch = trimmed.match(/^([A-Z]{2,3}\$?|\$)\s*(.+)$/);
  if (prefixMatch) {
    symbolPart = prefixMatch[1];
    numberPart = prefixMatch[2];
  } else {
    // Si no, intentar capturar símbolo al final (ej: 1.234,56 €)
    const suffixMatch = trimmed.match(/^(.+?)\s*([^\d\s,.-]+)$/);
    if (suffixMatch) {
      numberPart = suffixMatch[1];
      symbolPart = suffixMatch[2];
    } else {
      // Si no hay coincidencia, usar todo como número y € como símbolo por defecto
      numberPart = trimmed;
      symbolPart = "€";
    }
  }

  return `
    <div style="font-size:42px;font-weight:700;line-height:1.2;color:${textColor};text-align:center;word-break:break-word;overflow-wrap:break-word;">
      ${escapeHtml(symbolPart)} ${escapeHtml(numberPart)}
    </div>
    ${showIVASuffix ? `<div style="font-size:14px;font-weight:normal;color:${textColor};text-align:center;padding-top:8px;">+ IVA</div>` : ''}
  `;
}

// STYLE 1: Moderno - 3 columnas con branding Odoo
function buildStyle1Moderno(plans: QuotationPlan[], comments?: string, bestChoiceIndex: number | null = 1, bestChoiceLabel: string = "⭐ MÁS ELEGIDO ⭐") {
  // Colores oficiales del branding de Odoo
  const baseColors = ["#714B67", "#875A7B"];
  const highlightColor = "#A084CA"; // Púrpura claro para "Más elegido"
  
  const cards = plans
    .map((plan, idx) => {
      const isBest = bestChoiceIndex === idx && plans.length > 1;
      // Si es el "Más elegido", usar el color destacado (púrpura claro)
      // Si no, usar colores base alternados
      const color = isBest ? highlightColor : (baseColors[idx % baseColors.length] || baseColors[0]);
      const amountText = plan.untaxedAmountText || plan.totalAmountText || "";
      
      return `<td style="width: ${100 / plans.length}%; max-width: ${100 / plans.length}%; vertical-align: top; padding: 0px 10px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: rgb(255, 255, 255); border-radius: 8px; overflow: hidden; table-layout: fixed;">
          <tbody>
            ${isBest ? `<tr><td style="background-color: ${color}; padding: 10px 0px; text-align: center;"><span style="color: rgb(255, 255, 255); font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">${escapeHtml(bestChoiceLabel)}</span></td></tr>` : ''}
            
            <tr><td style="background-color: ${color}; height: 4px; line-height: 0; font-size: 0px;">&nbsp;</td></tr>
            
            <tr><td style="padding: 40px 30px; overflow: hidden;">
              <h2 style="margin: 0px 0px 25px; font-size: 32px; color: #714B67; text-align: center; font-weight: bold;">${escapeHtml(plan.title || "Plan")}</h2>
              
              <div style="background-color: ${color}; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center; overflow: hidden;">
                <p style="margin: 0px 0px 5px; font-size: 14px; color: rgb(255, 255, 255); text-transform: uppercase; font-weight: 600;">TOTAL CONTRATO</p>
                <div style="margin: 0px 0px 10px; line-height: 1; text-align: center; overflow: hidden;">
                  ${renderAlignedAmount(amountText, "#ffffff", true)}
                </div>
                ${plan.duration ? `<p style="margin: 0px 0px 8px; font-size: 13px; color: rgb(255, 255, 255);">${translateDuration(plan.duration)}</p>` : ''}
                <p style="margin: 0px; font-size: 12px; color: rgba(255, 255, 255, 0.85);">Coste medio usuario/mes: ${escapeHtml(calculateCostPerUserMonth(plan))}</p>
              </div>

              <div style="background-color: ${isBest ? 'rgb(255, 251, 245)' : 'rgb(254, 254, 254)'}; border: 1px solid ${isBest ? 'rgb(255, 232, 204)' : 'rgb(233, 236, 239)'}; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
                ${plan.paymentTerms ? `
                  <p style="margin: 0px 0px 5px; font-size: 12px; color: ${isBest ? 'rgb(133, 100, 4)' : 'rgb(108, 117, 125)'}; font-weight: 600; text-transform: uppercase; text-align: center;">💎 Condiciones de Pago</p>
                  <p style="margin: 0px 0px 18px; font-size: 13px; color: ${isBest ? 'rgb(133, 100, 4)' : 'rgb(73, 80, 87)'}; text-align: center; white-space: pre-line;">${escapeHtml(plan.paymentTerms)}</p>
                  <div style="border-top: 1px solid ${isBest ? 'rgb(255, 232, 204)' : 'rgb(233, 236, 239)'}; margin: 0px 0px 18px;"></div>
                ` : ''}

                ${plan.totalSavingsText ? `
                  <p style="margin: 0px 0px 8px; font-size: 13px; color: ${isBest ? 'rgb(133, 100, 4)' : 'rgb(108, 117, 125)'}; font-weight: 600; text-align: center;">💰 Ahorro total</p>
                  <p style="margin: 0px; font-size: 28px; color: ${color}; font-weight: 700; text-align: center; line-height: 1;">${escapeHtml(plan.totalSavingsText)}</p>
                ` : ''}
              </div>
              
              ${plan.summaryLine ? `
                <div style="margin-bottom: 25px; text-align: center;">
                  <p style="margin: 0px 0px 8px; font-size: 14px; font-weight: 600; color: #714B67;">Ideal para:</p>
                  <p style="margin: 0px; font-size: 13px; color: #875A7B; line-height: 1.6;">${escapeHtml(plan.summaryLine)}</p>
                </div>
              ` : ''}
              
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%;">
                <tbody>
                  <tr>
                    <td style="text-align: center;">
                      <a href="${plan.ctaUrl}" style="color: rgb(255, 255, 255); display: inline-block; padding: 16px 40px; background-color: ${color}; text-decoration-line: none; font-size: 16px; font-weight: 600; border-radius: 4px;" target="_blank">Ver detalles</a>
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

  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="color: rgb(0, 0, 0); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: medium; background-color: #F5F5F5;">
    <tbody>
      <tr>
        <td style="padding: 40px 20px; background-color: #F5F5F5;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 1200px; margin: 0px auto;">
            <tbody>
              <tr>
                <td style="padding: 0px; text-align: center;">
                  <h1 style="font-size: 28px; font-weight: bold; color: #714B67; margin: 0 0 10px 0;">Propuesta de Licenciamiento Odoo</h1>
                  <p style="color: #875A7B; font-size: 14px; margin: 0 0 20px 0;">Comparación de opciones disponibles</p>
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
                        <td style="padding: 25px; background-color: rgb(255, 255, 255); border-radius: 8px; border-left: 4px solid #00A09D;">
                          <p style="margin: 0px 0px 15px; font-size: 14px; color: rgb(44, 62, 80); line-height: 1.7;"><strong style="color: #714B67;">Descuentos aplicables:</strong> Los descuentos se aplican exclusivamente a licenciamientos. No aplican en servicios de hosting Odoo.sh. Las condiciones están sujetas a cambios en cada renovación.</p>
                          <p style="margin: 0px 0px 15px; font-size: 14px; color: rgb(44, 62, 80); line-height: 1.7;"><strong style="color: #875A7B;">Maximiza tu inversión:</strong> Contacta con tu Partner Manager para cualquier aclaración o negociación personalizada. Estamos aquí para ayudarte a conseguir las ofertas más ajustadas y rentables para tu empresa, adaptadas a tus necesidades específicas.</p>
                          <p style="margin: 0px; font-size: 14px; color: rgb(44, 62, 80); line-height: 1.7;"><strong style="color: #00A09D;">Protección Contra Subidas:</strong> En contratos multianuales disfruta de una protección contra subidas a la hora de la renovación de hasta un +7%. Evita subidas de IPC anuales y asegurate un coste todavía por debajo del mercado en tu renovación.</p>
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

// STYLE 2: Compacto - Lista vertical por plan con branding Odoo
function buildStyle2Compacto(plans: QuotationPlan[], comments?: string) {
  const sections = plans
    .map((plan) => {
      const amountText = plan.untaxedAmountText || plan.totalAmountText || "";
      return `<h2 style="font-size: 18px; font-weight: bold; color: #714B67; border-bottom: 2px solid #E8E1E6; padding-bottom: 10px; margin: 25px 0 15px 0;">
        ${escapeHtml(plan.title || "Plan")}
        ${plan.subtitle ? `<span style="font-weight: normal; font-size: 14px; color: #875A7B;"> - ${escapeHtml(plan.subtitle)}</span>` : ''}
      </h2>
      <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-size: 14px; color: #333; line-height: 1.8;">
        <tr>
          <td style="width: 180px; font-weight: 600; padding: 8px 0;">Total Contrato:</td>
          <td style="padding: 8px 0; font-weight: 600; color: #714B67;">
            ${escapeHtml(amountText)}
            <span style="font-size: 0.8em; font-weight: normal; color: #666;"> + IVA</span>
          </td>
        </tr>
        ${plan.duration ? `<tr>
          <td style="width: 180px; font-weight: 600; padding: 8px 0;">Duración:</td>
          <td style="padding: 8px 0;">${translateDuration(plan.duration)}</td>
        </tr>` : ''}
        <tr>
          <td style="width: 180px; font-weight: 600; padding: 8px 0;">Coste medio usuario/mes:</td>
          <td style="padding: 8px 0;">${escapeHtml(calculateCostPerUserMonth(plan))}</td>
        </tr>
        ${plan.paymentTerms ? `<tr>
          <td style="width: 180px; font-weight: 600; padding: 8px 0; vertical-align: top;">Condiciones de Pago:</td>
          <td style="padding: 8px 0; white-space: pre-line;">${escapeHtml(plan.paymentTerms)}</td>
        </tr>` : ''}
        ${plan.totalSavingsText ? `<tr>
          <td style="width: 180px; font-weight: 600; padding: 8px 0;">Ahorro total:</td>
          <td style="padding: 8px 0; font-weight: 600; color: #00A09D;">${escapeHtml(plan.totalSavingsText)}</td>
        </tr>` : ''}
        ${plan.summaryLine ? `<tr>
          <td style="width: 180px; font-weight: 600; padding: 8px 0;">Ideal para:</td>
          <td style="padding: 8px 0; font-style: italic;">${escapeHtml(plan.summaryLine)}</td>
        </tr>` : ''}
        <tr>
          <td colspan="2" style="padding-top: 16px;">
            <a href="${plan.ctaUrl}" style="display: inline-block; background-color: #714B67; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 13px;">Ver detalles</a>
          </td>
        </tr>
      </table>
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0 30px 0;">`;
    })
    .join("");

  return `<div style="padding: 20px; font-family: Arial, sans-serif; background-color: #F5F5F5;">
    <div style="max-width: 700px; margin: 0 auto; background-color: white; border: 1px solid #E8E1E6; border-radius: 8px; padding: 30px 40px;">
      <h1 style="font-size: 24px; font-weight: bold; color: #714B67; margin: 0 0 20px 0;">Propuesta de Licenciamiento Odoo</h1>
      ${formatComments(comments)}
      ${sections}
      ${disclaimer()}
    </div>
  </div>`;
}

// STYLE 3: Minimalista - Tabla comparativa con branding Odoo
function buildStyle3Minimalista(plans: QuotationPlan[], comments?: string) {
  const characteristics = [
    { 
      label: "Total Contrato", 
      key: (plan: QuotationPlan) => {
        const val = plan.untaxedAmountText || plan.totalAmountText || "";
        return val ? `${val} + IVA` : "";
      }
    },
    { label: "Duración", key: "duration", transform: translateDuration },
    { label: "Coste medio usuario/mes", key: calculateCostPerUserMonth },
    { label: "Cond. de Pago", key: "paymentTerms" },
    { label: "Ahorro total", key: "totalSavingsText" },
    { label: "Ideal para", key: "summaryLine" },
  ];

  const rows = characteristics
    .map((char) => {
      const cellContent = plans
        .map((plan) => {
          let value = typeof char.key === "function" ? char.key(plan) : (plan as any)[char.key];
          // @ts-ignore
          if (char.transform && value) {
             // @ts-ignore
            value = char.transform(value);
          }
          // Agregar white-space: pre-line para condiciones de pago
          // @ts-ignore
          const extraStyle = char.key === "paymentTerms" ? " white-space: pre-line;" : "";
          return `<td style="padding: 10px 15px; border-bottom: 1px solid #E8E1E6;${extraStyle}">${escapeHtml(value || "")}</td>`;
        })
        .join("");

      return `<tr>
        <td style="padding: 10px 15px; border-bottom: 1px solid #E8E1E6; font-weight: 600; color: #333; background-color: #FAF9FB; width: 25%;">${char.label}</td>
        ${cellContent}
      </tr>`;
    })
    .join("");

  const actionRow = `<tr>
    <td style="padding: 10px 15px; border-bottom: 1px solid #E8E1E6; font-weight: 600; color: #333; background-color: #FAF9FB; width: 25%;">Acción</td>
    ${plans
      .map(
        (plan) =>
          `<td style="padding: 10px 15px; border-bottom: 1px solid #E8E1E6;"><a href="${plan.ctaUrl}" style="color: #714B67; text-decoration: none; font-weight: bold;">Ver detalles</a></td>`
      )
      .join("")}
  </tr>`;

  return `<div style="padding: 20px; font-family: Arial, sans-serif; background-color: #F5F5F5;">
    <div style="max-width: 900px; margin: 0 auto; background-color: white; border: 1px solid #E8E1E6; border-radius: 8px; padding: 30px;">
      <h1 style="font-size: 24px; font-weight: bold; color: #714B67; margin: 0 0 25px 0;">Comparativa de Propuestas Odoo</h1>
      ${formatComments(comments)}
      <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; font-size: 14px; color: #333; margin-top: 20px;">
        <thead>
          <tr>
            <th style="padding: 12px 15px; border-bottom: 2px solid #714B67; text-align: left; background-color: #FAF9FB;">Característica</th>
            ${plans.map((plan) => `<th style="padding: 12px 15px; border-bottom: 2px solid #714B67; text-align: left; font-size: 15px; color: #714B67;">${escapeHtml(plan.title || "Plan")}</th>`).join("")}
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

export function buildEmailBody(style: StyleVariant, plans: QuotationPlan[], comments?: string, bestChoiceIndex: number | null = 1, bestChoiceLabel: string = "⭐ MÁS ELEGIDO ⭐") {
  if (style === "style2") {
    return buildStyle2Compacto(plans, comments);
  }
  if (style === "style3") {
    return buildStyle3Minimalista(plans, comments);
  }
  return buildStyle1Moderno(plans, comments, bestChoiceIndex, bestChoiceLabel);
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
