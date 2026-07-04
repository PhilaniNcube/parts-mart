import { Resend } from "resend";
import { env } from "@/lib/env";

export const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export async function sendAlertEmail(opts: {
  to: string;
  vendorName: string;
  searchName: string;
  matchCount: number;
  matchesUrl: string;
}) {
  if (!resend) {
    console.info("[resend:disabled] would send alert email to", opts.to);
    return { id: "disabled" };
  }
  const { error } = await resend.emails.send({
    from: env.ALERT_FROM_EMAIL,
    to: opts.to,
    subject: `PartsMart: ${opts.matchCount} new matching part(s) for "${opts.searchName}"`,
    html: AlertEmail(opts),
  });
  if (error) console.error("[resend] send failed", error);
  return { ok: !error };
}

function AlertEmail(p: { vendorName: string; searchName: string; matchCount: number; matchesUrl: string }) {
  return `<!DOCTYPE html>
<html><body style="font-family:-apple-system,Segoe UI,sans-serif;color:#111">
  <h2>Hi ${p.vendorName},</h2>
  <p>We found <strong>${p.matchCount}</strong> new part listing(s) matching your saved search <em>&ldquo;${p.searchName}&rdquo;</em>.</p>
  <p><a href="${p.matchesUrl}" style="background:#111;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none">View matches</a></p>
  <p style="color:#666;font-size:12px;margin-top:24px">You can manage your alert subscriptions in your PartsMart vendor dashboard.</p>
</body></html>`;
}

export const __testing = { AlertEmail };