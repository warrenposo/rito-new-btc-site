// ══════════════════════════════════════════════════════════════════
//  BtcNminingBase — Welcome Email Edge Function
//  Supabase Edge Function: send-welcome-email
//
//  HOW IT WORKS:
//  A Database Webhook fires this function every time a new row is
//  inserted into the `profiles` table. It sends a branded welcome
//  email via Resend (free tier: 3,000 emails/month).
//
//  REQUIRED ENV VARIABLE (set in Supabase dashboard):
//    RESEND_API_KEY  —  your Resend API key (re_xxxxxxxx)
//    SITE_URL        —  your website URL e.g. https://yourdomain.com
//    FROM_EMAIL      —  e.g. support@yourdomain.com
// ══════════════════════════════════════════════════════════════════

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// ── Helpers ────────────────────────────────────────────────────────
function getFirstName(fullName: string | null | undefined, email: string): string {
  if (fullName && fullName.trim().length > 0) {
    return fullName.trim().split(" ")[0];
  }
  // Fallback: use the part before @ in email, capitalize first letter
  const raw = email.split("@")[0].replace(/[._\-]/g, " ");
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

// ── Email HTML builder ─────────────────────────────────────────────
function buildWelcomeHtml(firstName: string, email: string, siteUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to BtcNminingBase</title>
</head>
<body style="margin:0;padding:0;background-color:#040a0f;font-family:'Segoe UI',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#040a0f;padding:32px 16px;">
    <tr><td align="center">

      <table width="600" cellpadding="0" cellspacing="0" border="0"
             style="max-width:600px;width:100%;background-color:#060d13;border-radius:16px;
                    overflow:hidden;border:1px solid rgba(0,229,255,0.12);">

        <!-- ═══ TOP ACCENT LINE ═══ -->
        <tr>
          <td style="padding:0;">
            <div style="height:3px;background:linear-gradient(90deg,#00e5ff,#00c853,#00e5ff);"></div>
          </td>
        </tr>

        <!-- ═══ HEADER ═══ -->
        <tr>
          <td style="background:linear-gradient(160deg,#040a0f 0%,#071218 100%);padding:36px 40px 28px;">

            <!-- Logo -->
            <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
              <tr>
                <td>
                  <div style="display:inline-block;width:44px;height:44px;
                               background:linear-gradient(135deg,#00e5ff,#00c853);
                               border-radius:10px;text-align:center;line-height:44px;
                               font-size:22px;font-weight:900;color:#040a0f;">&#8383;</div>
                </td>
                <td style="padding-left:12px;vertical-align:middle;">
                  <span style="font-size:22px;font-weight:900;color:#ffffff;">Btc</span>
                  <span style="font-size:22px;font-weight:900;color:#00e5ff;">NminingBase</span>
                </td>
              </tr>
            </table>

            <!-- Headline -->
            <h1 style="margin:0 0 10px;font-size:34px;font-weight:900;color:#ffffff;
                        line-height:1.15;letter-spacing:-0.5px;">
              Welcome aboard,<br/>
              <span style="color:#00e5ff;">${firstName}!</span>
            </h1>
            <p style="margin:0;font-size:16px;color:rgba(255,255,255,0.5);line-height:1.6;">
              Your BtcNminingBase account has been successfully created.
            </p>

          </td>
        </tr>

        <!-- ═══ STATS BAR ═══ -->
        <tr>
          <td style="padding:0 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0"
                   style="background:rgba(0,229,255,0.05);border:1px solid rgba(0,229,255,0.1);
                          border-radius:12px;margin:4px 0;">
              <tr>
                <td style="padding:16px 20px;text-align:center;border-right:1px solid rgba(255,255,255,0.06);">
                  <div style="font-size:18px;font-weight:900;color:#00e5ff;">50,000+</div>
                  <div style="font-size:11px;color:rgba(255,255,255,0.35);margin-top:2px;">Active Miners</div>
                </td>
                <td style="padding:16px 20px;text-align:center;border-right:1px solid rgba(255,255,255,0.06);">
                  <div style="font-size:18px;font-weight:900;color:#00c853;">$2.4M+</div>
                  <div style="font-size:11px;color:rgba(255,255,255,0.35);margin-top:2px;">Total Paid Out</div>
                </td>
                <td style="padding:16px 20px;text-align:center;">
                  <div style="font-size:18px;font-weight:900;color:#00e5ff;">99.9%</div>
                  <div style="font-size:11px;color:rgba(255,255,255,0.35);margin-top:2px;">Platform Uptime</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ═══ BODY ═══ -->
        <tr>
          <td style="padding:32px 40px;">

            <p style="margin:0 0 24px;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.7;">
              Hi <strong style="color:#ffffff;">${firstName}</strong>, we&#39;re thrilled to have you join our
              mining community. Your account is ready and you can start earning Bitcoin right away
              &mdash; no hardware required.
            </p>

            <!-- What to do next -->
            <p style="margin:0 0 16px;font-size:12px;font-weight:700;
                       color:rgba(255,255,255,0.3);letter-spacing:0.1em;text-transform:uppercase;">
              What to do next
            </p>

            <!-- Step 1 -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;">
              <tr>
                <td style="width:36px;vertical-align:top;padding-top:2px;">
                  <div style="width:28px;height:28px;border-radius:50%;
                               background:linear-gradient(135deg,#00e5ff,#00c853);
                               text-align:center;line-height:28px;
                               font-size:13px;font-weight:800;color:#040a0f;">1</div>
                </td>
                <td style="padding-left:12px;vertical-align:top;">
                  <p style="margin:0;font-size:14px;font-weight:700;color:#ffffff;">Complete Your Profile</p>
                  <p style="margin:2px 0 0;font-size:13px;color:rgba(255,255,255,0.4);">Add your details, country, and wallet address.</p>
                </td>
              </tr>
            </table>

            <!-- Step 2 -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;">
              <tr>
                <td style="width:36px;vertical-align:top;padding-top:2px;">
                  <div style="width:28px;height:28px;border-radius:50%;
                               background:linear-gradient(135deg,#00e5ff,#00c853);
                               text-align:center;line-height:28px;
                               font-size:13px;font-weight:800;color:#040a0f;">2</div>
                </td>
                <td style="padding-left:12px;vertical-align:top;">
                  <p style="margin:0;font-size:14px;font-weight:700;color:#ffffff;">Make Your First Deposit</p>
                  <p style="margin:2px 0 0;font-size:13px;color:rgba(255,255,255,0.4);">Fund your account via BTC, USDT, ETH, or Solana.</p>
                </td>
              </tr>
            </table>

            <!-- Step 3 -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;">
              <tr>
                <td style="width:36px;vertical-align:top;padding-top:2px;">
                  <div style="width:28px;height:28px;border-radius:50%;
                               background:linear-gradient(135deg,#00e5ff,#00c853);
                               text-align:center;line-height:28px;
                               font-size:13px;font-weight:800;color:#040a0f;">3</div>
                </td>
                <td style="padding-left:12px;vertical-align:top;">
                  <p style="margin:0;font-size:14px;font-weight:700;color:#ffffff;">Choose a Mining Plan</p>
                  <p style="margin:2px 0 0;font-size:13px;color:rgba(255,255,255,0.4);">Pick from Beginner to VIP &mdash; daily payouts start immediately.</p>
                </td>
              </tr>
            </table>

            <!-- Step 4 -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
              <tr>
                <td style="width:36px;vertical-align:top;padding-top:2px;">
                  <div style="width:28px;height:28px;border-radius:50%;
                               background:linear-gradient(135deg,#00e5ff,#00c853);
                               text-align:center;line-height:28px;
                               font-size:13px;font-weight:800;color:#040a0f;">4</div>
                </td>
                <td style="padding-left:12px;vertical-align:top;">
                  <p style="margin:0;font-size:14px;font-weight:700;color:#ffffff;">Watch Your Earnings Grow</p>
                  <p style="margin:2px 0 0;font-size:13px;color:rgba(255,255,255,0.4);">Track your hash rate, balance &amp; payouts live in the dashboard.</p>
                </td>
              </tr>
            </table>

            <!-- CTA Button -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
              <tr>
                <td align="center">
                  <a href="${siteUrl}/dashboard"
                     style="display:inline-block;padding:16px 48px;
                            background:linear-gradient(135deg,#00e5ff,#00c853);
                            color:#040a0f;font-size:15px;font-weight:800;
                            text-decoration:none;border-radius:12px;">
                    Go to Dashboard &rarr;
                  </a>
                </td>
              </tr>
            </table>

            <!-- Divider -->
            <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(0,229,255,0.15),transparent);margin-bottom:24px;"></div>

            <!-- Referral tip -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0"
                   style="background:rgba(0,229,255,0.04);border:1px solid rgba(0,229,255,0.1);
                          border-radius:10px;margin-bottom:24px;">
              <tr>
                <td style="padding:16px 20px;">
                  <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#00e5ff;">&#128176; Refer &amp; Earn</p>
                  <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.45);line-height:1.6;">
                    Share your unique referral link from your dashboard and earn commissions
                    on every plan your friends purchase.
                  </p>
                </td>
              </tr>
            </table>

            <!-- Support -->
            <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.35);line-height:1.7;text-align:center;">
              Questions? Our support team is available 24/7.<br/>
              <a href="mailto:support@btcnminingbase.com" style="color:#00e5ff;text-decoration:none;">
                support@btcnminingbase.com
              </a>
            </p>

          </td>
        </tr>

        <!-- ═══ FOOTER ═══ -->
        <tr>
          <td style="background:#040a0f;padding:20px 40px;border-top:1px solid rgba(0,229,255,0.07);">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td>
                  <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.2);">
                    Best regards,<br/>
                    <strong style="color:rgba(255,255,255,0.35);">The BtcNminingBase Team</strong>
                  </p>
                </td>
                <td style="text-align:right;">
                  <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.15);">
                    &copy; 2026 BtcNminingBase.<br/>All rights reserved.
                  </p>
                </td>
              </tr>
              <tr>
                <td colspan="2" style="padding-top:12px;">
                  <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.15);text-align:center;">
                    This email was sent to ${email} &middot; 57 Kingfisher Grove, Willenhall, England, WV12 5HG
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;
}

// ── Main handler ───────────────────────────────────────────────────
serve(async (req: Request) => {
  try {
    // Supabase Database Webhooks send a POST with the row data
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const body = await req.json();

    // The webhook payload has { type, table, record, old_record }
    const record = body?.record;
    if (!record?.email) {
      console.log("No email in record — skipping.");
      return new Response(JSON.stringify({ skipped: true }), { status: 200 });
    }

    const email: string = record.email;
    const fullName: string | null = record.full_name ?? null;
    const firstName = getFirstName(fullName, email);

    // Read env vars
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const FROM_EMAIL = Deno.env.get("FROM_EMAIL") ?? "support@btcnminingbase.com";
    const SITE_URL = Deno.env.get("SITE_URL") ?? "https://btcnminingbase.com";

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY env variable is not set.");
      return new Response(JSON.stringify({ error: "RESEND_API_KEY not set" }), { status: 500 });
    }

    // Build and send the email
    const html = buildWelcomeHtml(firstName, email, SITE_URL);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `BtcNminingBase <${FROM_EMAIL}>`,
        to: [email],
        subject: `Welcome to BtcNminingBase, ${firstName}! 🎉`,
        html,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Resend API error:", result);
      return new Response(JSON.stringify({ error: result }), { status: 500 });
    }

    console.log(`Welcome email sent to ${email} (id: ${result.id})`);
    return new Response(JSON.stringify({ success: true, id: result.id }), { status: 200 });

  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
