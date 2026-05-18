import { NextResponse } from "next/server";
import { Resend } from "resend";
import type { ApplicationInput } from "@/lib/firebase/applications";

export const runtime = "nodejs";

const REQUIRED_STRING_FIELDS: (keyof ApplicationInput)[] = [
  "jobId",
  "jobTitle",
  "jobDepartment",
  "fullName",
  "email",
  "phone",
  "city",
  "country",
  "linkedinUrl",
  "resumeUrl",
  "expectedSalary",
  "workAuthorization",
  "coverLetter",
  "hearAbout",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function validate(
  body: unknown,
): { ok: true; data: ApplicationInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object")
    return { ok: false, error: "Invalid payload." };
  const b = body as Record<string, unknown>;
  for (const k of REQUIRED_STRING_FIELDS) {
    if (typeof b[k] !== "string" || !(b[k] as string).trim()) {
      return { ok: false, error: `Missing required field: ${k}` };
    }
  }
  if (!EMAIL_RE.test((b.email as string).trim())) {
    return { ok: false, error: "Invalid email." };
  }
  if (
    typeof b.yearsExperience !== "number" ||
    !Number.isFinite(b.yearsExperience)
  ) {
    return { ok: false, error: "yearsExperience must be a number." };
  }
  if (
    typeof b.noticePeriodDays !== "number" ||
    !Number.isFinite(b.noticePeriodDays)
  ) {
    return { ok: false, error: "noticePeriodDays must be a number." };
  }
  if (typeof b.consent !== "boolean" || !b.consent) {
    return { ok: false, error: "Consent is required." };
  }
  return { ok: true, data: b as unknown as ApplicationInput };
}

function hrEmailHtml(a: ApplicationInput, resumeUrl: string): string {
  const e = escapeHtml;
  const row = (label: string, value: string) =>
    `<tr><td style="padding:8px 14px;border-bottom:1px solid #eef0f4;color:#5b6478;font-size:13px;width:170px;">${e(label)}</td>` +
    `<td style="padding:8px 14px;border-bottom:1px solid #eef0f4;color:#0f1626;font-size:14px;">${value}</td></tr>`;
  const linkRow = (label: string, url: string) =>
    row(
      label,
      `<a href="${e(url)}" style="color:#B30920;text-decoration:none;">${e(url)}</a>`,
    );

  return `<!doctype html>
<html><body style="margin:0;background:#f5f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:640px;margin:24px auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
    <div style="padding:20px 26px;background:linear-gradient(135deg,#0f1626 0%,#1a2540 100%);color:#fff;">
      <div style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#E84A5F;font-weight:700;">New Application</div>
      <h1 style="margin:6px 0 0;font-size:22px;letter-spacing:-0.01em;">${e(a.jobTitle)}</h1>
      <div style="margin-top:4px;font-size:13px;color:rgba(255,255,255,0.7);">${e(a.jobDepartment)} · ${e(a.fullName)}</div>
    </div>
    <table style="width:100%;border-collapse:collapse;">
      ${row("Name", e(a.fullName))}
      ${row("Email", `<a href="mailto:${e(a.email)}" style="color:#B30920;text-decoration:none;">${e(a.email)}</a>`)}
      ${row("Phone", e(a.phone))}
      ${row("Location", `${e(a.city)}, ${e(a.country)}`)}
      ${linkRow("LinkedIn", a.linkedinUrl)}
      ${linkRow("Resume", resumeUrl)}
      ${a.portfolioUrl ? linkRow("Portfolio", a.portfolioUrl) : ""}
      ${row("Current company", e(a.currentCompany || "—"))}
      ${row("Current title", e(a.currentTitle || "—"))}
      ${row("Years of experience", String(a.yearsExperience))}
      ${row("Notice period", `${a.noticePeriodDays} day${a.noticePeriodDays === 1 ? "" : "s"}`)}
      ${row("Expected comp", e(a.expectedSalary))}
      ${row("Work authorization", e(a.workAuthorization))}
      ${row("Open to relocation", a.willingToRelocate ? "Yes" : "No")}
      ${row("Heard about us via", e(a.hearAbout) + (a.referralName ? ` (${e(a.referralName)})` : ""))}
    </table>
    <div style="padding:18px 26px;border-top:1px solid #eef0f4;">
      <div style="font-size:11px;letter-spacing:0.13em;text-transform:uppercase;color:#B30920;font-weight:700;">Why this role</div>
      <p style="margin:6px 0 0;font-size:14px;line-height:1.65;color:#0f1626;white-space:pre-wrap;">${e(a.coverLetter)}</p>
    </div>
    <div style="padding:14px 26px;background:#f9fafb;color:#5b6478;font-size:12px;">
      Reply directly to this email to reach <strong style="color:#0f1626;">${e(a.fullName)}</strong>.
    </div>
  </div>
</body></html>`;
}

function candidateEmailHtml(a: ApplicationInput): string {
  const e = escapeHtml;
  return `<!doctype html>
<html><body style="margin:0;background:#f5f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:24px auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
    <div style="padding:24px 28px;background:linear-gradient(135deg,#0f1626 0%,#1a2540 100%);color:#fff;">
      <div style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#E84A5F;font-weight:700;">Application received</div>
      <h1 style="margin:8px 0 0;font-size:24px;letter-spacing:-0.01em;">Thanks, ${e(a.fullName.split(" ")[0])}!</h1>
    </div>
    <div style="padding:24px 28px;color:#0f1626;font-size:15px;line-height:1.7;">
      <p style="margin:0 0 14px;">We&rsquo;ve received your application for <strong>${e(a.jobTitle)}</strong> on the ${e(a.jobDepartment)} team. Our recruiting team will review your details and get back to you within <strong>3 business days</strong>.</p>
      <p style="margin:0 0 14px;">In the meantime, feel free to reply to this email if you have any questions.</p>
      <p style="margin:24px 0 0;color:#5b6478;font-size:13px;">— The Ovation Workplace Services team</p>
    </div>
    <div style="padding:14px 28px;background:#f9fafb;color:#5b6478;font-size:12px;text-align:center;">
      Ovation Workplace Services · careers@ovationwps.com
    </div>
  </div>
</body></html>`;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const v = validate(body);
  if (!v.ok) {
    return NextResponse.json({ error: v.error }, { status: 400 });
  }
  const a = v.data;

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  const to = process.env.MAIL_TO_HR;

  if (!apiKey || !from || !to) {
    console.error(
      "[applications] Missing RESEND_API_KEY, MAIL_FROM, or MAIL_TO_HR env var.",
    );
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 500 },
    );
  }

  // Resume is stored as a relative "/api/resume/<file>" path; make it
  // absolute so HR can open it straight from the email.
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin
  ).replace(/\/$/, "");
  const resumeUrl = /^https?:\/\//i.test(a.resumeUrl)
    ? a.resumeUrl
    : `${base}${a.resumeUrl.startsWith("/") ? "" : "/"}${a.resumeUrl}`;

  const resend = new Resend(apiKey);

  try {
    const [hrResult, candidateResult] = await Promise.all([
      resend.emails.send({
        from,
        to,
        replyTo: a.email,
        subject: `New application — ${a.jobTitle} — ${a.fullName}`,
        html: hrEmailHtml(a, resumeUrl),
      }),
      resend.emails.send({
        from,
        to: a.email,
        subject: `We received your application for ${a.jobTitle}`,
        html: candidateEmailHtml(a),
      }),
    ]);

    if (hrResult.error) {
      console.error("[applications] HR email failed:", hrResult.error);
      return NextResponse.json(
        { error: "Could not send notification email." },
        { status: 502 },
      );
    }
    if (candidateResult.error) {
      console.error(
        "[applications] Candidate email failed:",
        candidateResult.error,
      );
    }

    return NextResponse.json({
      ok: true,
      hrId: hrResult.data?.id ?? null,
      candidateId: candidateResult.data?.id ?? null,
      candidateEmailSent: !candidateResult.error,
    });
  } catch (err) {
    console.error("[applications] Resend error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Email send failed." },
      { status: 502 },
    );
  }
}
