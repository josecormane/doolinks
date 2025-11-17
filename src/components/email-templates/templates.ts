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

function formatComments(comments?: string) {
  if (!comments) return "";
  return `<div style="margin-top:18px;padding:12px 14px;border-radius:10px;background:#fef9c3;color:#713f12;font-size:13px;">
    <strong>Nota adicional:</strong><br/>${escapeHtml(comments).replace(/\n/g, "<br/>")}
  </div>`;
}

function savingsList(plan: QuotationPlan) {
  if (!plan.savingsBreakdown?.length) return "";
  return `<ul style="padding-left:16px;margin:4px 0 0;color:#4b5563;">
    ${plan.savingsBreakdown
      .map((item) => `<li style="margin:0;padding:0;line-height:1.4;">${escapeHtml(item.label)}: ${escapeHtml(item.amountText)}</li>`)
      .join("")}
  </ul>`;
}

function disclaimer() {
  return `<p style="font-size:12px;color:#4b5563;margin-top:16px;">
    <strong>Fuente:</strong> Los montos se importan directamente de las cotizaciones vinculadas en Odoo. Siempre verifica la información original antes de enviar el correo.<br/><br/>
    <strong>Detección de ahorros:</strong> Las líneas con totales negativos se tratan como descuentos y se listan para cada plan.
  </p>`;
}

function buildStyle2(plans: QuotationPlan[], comments?: string) {
  const rows = plans
    .map((plan, idx) => {
      const isBest = idx === 1 && plans.length > 1;
      return `<tr>
        <td style="padding:12px 10px;border-bottom:1px solid #e5e7eb;">
          <div style="font-size:13px;font-weight:600;color:#111827;margin-bottom:2px;">
            ${escapeHtml(plan.title || "Plan sin nombre")}
            ${
              isBest
                ? '<span style="font-size:11px;padding:2px 6px;margin-left:6px;border-radius:999px;background:#f97316;color:#fff;">Más elegido</span>'
                : ""
            }
          </div>
          ${
            plan.subtitle
              ? `<div style="font-size:11px;color:#6b7280;margin-bottom:4px;">${escapeHtml(plan.subtitle)}</div>`
              : ""
          }
          <div style="font-size:18px;font-weight:700;color:#111827;">${escapeHtml(
            plan.totalAmountText || "Monto no disponible"
          )}</div>
          ${
            plan.duration
              ? `<div style="font-size:12px;color:#4b5563;margin-top:2px;">${escapeHtml(plan.duration)}</div>`
              : ""
          }
        </td>
        <td style="padding:12px 10px;border-bottom:1px solid #e5e7eb;font-size:12px;color:#4b5563;">
          ${
            plan.summaryLine ? `<div><strong>Oferta principal:</strong> ${escapeHtml(plan.summaryLine)}</div>` : ""
          }
          ${
            plan.pricePerLicenseText
              ? `<div><strong>Precio por licencia:</strong> ${escapeHtml(plan.pricePerLicenseText)}${
                  plan.quantityText ? ` | ${escapeHtml(plan.quantityText)}` : ""
                }</div>`
              : ""
          }
          ${
            plan.paymentTerms
              ? `<div><strong>Términos de pago:</strong> ${escapeHtml(plan.paymentTerms)}</div>`
              : ""
          }
          ${
            plan.totalSavingsText
              ? `<div><strong>Ahorros detectados:</strong> ${escapeHtml(plan.totalSavingsText)}</div>`
              : ""
          }
          ${savingsList(plan)}
        </td>
        <td style="padding:12px 10px;border-bottom:1px solid #e5e7eb;font-size:12px;color:#4b5563;">
          ${
            plan.expirationDate
              ? `<div><strong>Validez:</strong> Hasta ${escapeHtml(plan.expirationDate)}</div>`
              : ""
          }
          <div style="margin-top:6px;">
            <a href="${plan.ctaUrl}" style="display:inline-block;padding:7px 14px;border-radius:999px;background:#111827;color:#f9fafb;font-size:12px;text-decoration:none;font-weight:600;">Comenzar ahora</a>
          </div>
        </td>
      </tr>`;
    })
    .join("");

  return `<table width="100%" cellpadding="0" cellspacing="0" style="max-width:780px;margin:0 auto;background:#f9fafb;border-radius:18px;border:1px solid #e5e7eb;">
    <tr>
      <td style="padding:18px 18px 14px;">
        <div style="font-size:16px;font-weight:600;color:#111827;">Comparación de opciones de suscripción</div>
        <div style="font-size:13px;color:#4b5563;margin-top:4px;">
          Los totales provienen directamente de tus cotizaciones de Odoo para que puedas compartirlos con tus clientes de manera clara.
        </div>
        ${formatComments(comments)}
      </td>
    </tr>
    <tr>
      <td>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          ${rows}
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:0 18px 16px;">
        ${disclaimer()}
      </td>
    </tr>
  </table>`;
}

function buildCard(plan: QuotationPlan, idx: number, style: StyleVariant, total: number) {
  const isBest = idx === 1 && total > 1;
  const palette =
    style === "style1"
      ? ["#06b6d4", "#f97316", "#16a34a"]
      : ["#0f172a", "#111827", "#020617"];
  const bg = palette[idx] || palette[0];
  const fg = style === "style1" ? "#0b1220" : "#f9fafb";
  const pillBg = style === "style1" ? "rgba(255,255,255,0.2)" : "rgba(15,23,42,1)";
  const cardBg = style === "style1" ? "#f9fafb" : idx === 1 ? "#020617" : "#0b1120";
  const bodyBg = style === "style1" ? "#ffffff" : "#0b1120";
  const bodyColor = style === "style1" ? "#111827" : "#e5e7eb";
  const subColor = style === "style1" ? "#6b7280" : "#9ca3af";
  const buttonBg = style === "style1" ? "#4f46e5" : "#111827";

  return `<td style="padding:0 8px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:18px;overflow:hidden;background:${cardBg};border:1px solid #e5e7eb;">
      <tr>
        <td style="padding:14px 16px;background:${bg};color:${fg};text-align:center;">
          ${
            isBest
              ? `<div style="font-size:11px;text-transform:uppercase;letter-spacing:.08em;padding:2px 10px;border-radius:999px;background:${pillBg};display:inline-block;margin-bottom:4px;">⭐ Más elegido</div>`
              : ""
          }
          <div style="font-size:14px;font-weight:600;margin-bottom:2px;">${escapeHtml(plan.title || "Plan sin nombre")}</div>
          ${
            plan.subtitle
              ? `<div style="font-size:11px;opacity:.65;margin-bottom:4px;">${escapeHtml(plan.subtitle)}</div>`
              : ""
          }
          <div style="font-size:11px;opacity:.9;">TOTAL DEL CONTRATO</div>
          <div style="font-size:20px;font-weight:700;margin-top:2px;">${escapeHtml(
            plan.totalAmountText || "Monto no disponible"
          )}</div>
          ${
            plan.duration
              ? `<div style="font-size:12px;margin-top:4px;opacity:.9;">${escapeHtml(plan.duration)}</div>`
              : ""
          }
          ${
            plan.pricePerLicenseText
              ? `<div style="font-size:11px;margin-top:2px;opacity:.9;">Precio por licencia: ${escapeHtml(plan.pricePerLicenseText)}${
                  plan.quantityText ? ` | ${escapeHtml(plan.quantityText)}` : ""
                }</div>`
              : ""
          }
        </td>
      </tr>
      <tr>
        <td style="padding:12px 14px;font-size:12px;color:${bodyColor};background:${bodyBg};">
          ${
            plan.summaryLine
              ? `<div style="margin-bottom:6px;">
            <span style="font-weight:600;">📦 Oferta incluida</span><br/>
            ${escapeHtml(plan.summaryLine)}
          </div>`
              : ""
          }
          ${
            plan.paymentTerms
              ? `<div style="margin-bottom:6px;">
            <span style="font-weight:600;">💎 Términos de pago</span><br/>
            ${escapeHtml(plan.paymentTerms)}
          </div>`
              : ""
          }
          ${
            plan.totalSavingsText
              ? `<div style="margin-bottom:6px;">
            <span style="font-weight:600;">💰 Ahorros detectados</span><br/>
            ${escapeHtml(plan.totalSavingsText)}
            ${
              plan.savingsBreakdown?.length
                ? `<div style="margin-top:4px;"><ul style="padding-left:16px;margin:0;color:${subColor};">${plan.savingsBreakdown
                    .map(
                      (item) =>
                        `<li style="margin:0;padding:0;line-height:1.4;">${escapeHtml(item.label)}: ${escapeHtml(item.amountText)}</li>`
                    )
                    .join("")}</ul></div>`
                : ""
            }
          </div>`
              : ""
          }
          ${
            plan.expirationDate
              ? `<div style="margin-bottom:10px;">
            <span style="font-weight:600;">🗓 Validez</span><br/>
            Hasta ${escapeHtml(plan.expirationDate)}
          </div>`
              : ""
          }
          <div style="text-align:center;">
            <a href="${plan.ctaUrl}" style="display:inline-block;padding:8px 16px;border-radius:999px;background:${buttonBg};color:#f9fafb;font-weight:600;font-size:12px;text-decoration:none;">
              Comenzar ahora
            </a>
          </div>
        </td>
      </tr>
    </table>
  </td>`;
}

function buildStyle1or3(plans: QuotationPlan[], comments: string | undefined, style: StyleVariant) {
  const cards = plans.map((plan, idx) => buildCard(plan, idx, style, plans.length)).join("");
  const bgOuter = style === "style1" ? "#e5e7eb" : "#020617";
  const bgInner = style === "style1" ? "#f9fafb" : "#020617";
  const mainText = style === "style1" ? "#111827" : "#e5e7eb";
  const subText = style === "style1" ? "#4b5563" : "#9ca3af";

  return `<table width="100%" cellpadding="0" cellspacing="0" style="max-width:820px;margin:0 auto;background:${bgOuter};padding:18px;border-radius:20px;">
    <tr>
      <td>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:${bgInner};border-radius:16px;padding:18px;">
          <tr>
            <td style="text-align:left;padding-bottom:12px;">
              <div style="font-size:16px;font-weight:600;color:${mainText};">Resumen de propuesta Odoo</div>
              <div style="font-size:13px;color:${subText};margin-top:4px;">
                A continuación está la comparación construida a partir de las cotizaciones importadas directamente de Odoo para que puedas agilizar tu comunicación con los clientes.
              </div>
              ${formatComments(comments)}
            </td>
          </tr>
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>${cards}</tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding-top:8px;">
              ${disclaimer()}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}

export function buildEmailBody(style: StyleVariant, plans: QuotationPlan[], comments?: string) {
  if (style === "style2") {
    return buildStyle2(plans, comments);
  }
  return buildStyle1or3(plans, comments, style);
}

export function buildFullHtml(bodyHtml: string) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Propuesta Odoo</title>
</head>
<body style="margin:0;padding:16px;background:#e5e7eb;">
  ${bodyHtml}
</body>
</html>`;
}

