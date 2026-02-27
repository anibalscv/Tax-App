import type { Context } from "@netlify/functions";
import { Resend } from "resend";

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = Netlify.env.get("RESEND_API_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "RESEND_API_KEY not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: {
    email: string;
    name: string;
    taxType: string;
    period: string;
    amount: number;
    transactionId: string;
  };

  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { email, name, taxType, period, amount, transactionId } = body;

  if (!email || !name || !taxType || !period || !amount || !transactionId) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const resend = new Resend(apiKey);

  const formattedAmount = new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
  }).format(amount);

  const formattedDate = new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  const htmlBody = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirmación de Pago – TaxFlow</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);padding:40px 40px 32px;text-align:center;">
              <div style="width:56px;height:56px;background:rgba(255,255,255,0.2);border-radius:14px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
                <span style="font-size:28px;">✅</span>
              </div>
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.5px;">¡Pago Confirmado!</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:15px;">Tu obligación tributaria ha sido procesada exitosamente</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:32px 40px 0;">
              <p style="margin:0;color:#334155;font-size:16px;">Hola, <strong>${name}</strong> 👋</p>
              <p style="margin:12px 0 0;color:#64748b;font-size:15px;line-height:1.6;">
                Te confirmamos que tu pago ha sido procesado con éxito. A continuación encontrarás el resumen de tu transacción.
              </p>
            </td>
          </tr>

          <!-- Payment Summary Card -->
          <tr>
            <td style="padding:24px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="padding:20px 24px;border-bottom:1px solid #e2e8f0;">
                    <p style="margin:0;font-size:12px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Total pagado</p>
                    <p style="margin:6px 0 0;font-size:36px;font-weight:800;color:#1e293b;letter-spacing:-1px;">${formattedAmount}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:14px 24px;border-bottom:1px solid #e2e8f0;">
                          <span style="color:#64748b;font-size:14px;">Impuesto</span>
                        </td>
                        <td style="padding:14px 24px;border-bottom:1px solid #e2e8f0;text-align:right;">
                          <strong style="color:#1e293b;font-size:14px;">${taxType}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:14px 24px;border-bottom:1px solid #e2e8f0;">
                          <span style="color:#64748b;font-size:14px;">Período</span>
                        </td>
                        <td style="padding:14px 24px;border-bottom:1px solid #e2e8f0;text-align:right;">
                          <strong style="color:#1e293b;font-size:14px;">${period}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:14px 24px;border-bottom:1px solid #e2e8f0;">
                          <span style="color:#64748b;font-size:14px;">N° de Transacción</span>
                        </td>
                        <td style="padding:14px 24px;border-bottom:1px solid #e2e8f0;text-align:right;">
                          <code style="color:#4f46e5;font-size:13px;background:#ede9fe;padding:2px 8px;border-radius:6px;">${transactionId}</code>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:14px 24px;">
                          <span style="color:#64748b;font-size:14px;">Fecha y hora</span>
                        </td>
                        <td style="padding:14px 24px;text-align:right;">
                          <strong style="color:#1e293b;font-size:14px;">${formattedDate}</strong>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:0 40px 32px;text-align:center;">
              <a href="https://taxflow-demo.netlify.app" style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 32px;border-radius:10px;">
                Ir a TaxFlow →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:24px 40px;text-align:center;">
              <p style="margin:0;color:#94a3b8;font-size:13px;line-height:1.5;">
                Este es un correo automático generado por <strong style="color:#64748b;">TaxFlow</strong>.<br />
                Si no reconoces este pago, contáctanos de inmediato.
              </p>
              <p style="margin:12px 0 0;color:#cbd5e1;font-size:12px;">
                © ${new Date().getFullYear()} TaxFlow. Todos los derechos reservados.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  try {
    const { data, error } = await resend.emails.send({
      from: "TaxFlow <onboarding@resend.dev>",
      to: [email],
      subject: `✅ Pago Confirmado – ${taxType} (${period})`,
      html: htmlBody,
    });

    if (error) {
      console.error("Resend error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, id: data?.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config = {
  path: "/api/send-payment-email",
};
