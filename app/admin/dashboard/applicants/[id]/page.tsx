"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import AdminShell from "../../../components/AdminShell";
import AuthGuard from "../../../components/AuthGuard";
import {
  Application,
  subscribeToApplication,
  updateApplicationStatus,
} from "@/lib/firebase/applications";
import { useToast } from "../../../../components/Toast";

const STATUS_OPTIONS: Application["status"][] = [
  "new",
  "reviewing",
  "interviewing",
  "offer",
  "rejected",
];

const STATUS_LABEL: Record<Application["status"], string> = {
  new: "New",
  reviewing: "Reviewing",
  interviewing: "Interviewing",
  offer: "Offer",
  rejected: "Rejected",
};

const STATUS_CLASS: Record<Application["status"], string> = {
  new: "bg-brand-red/10 text-brand-red dark:bg-brand-red/20 dark:text-brand-red-soft",
  reviewing:
    "bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  interviewing:
    "bg-sky-500/15 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300",
  offer:
    "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  rejected: "bg-ink-200 text-ink-700 dark:bg-white/10 dark:text-white/65",
};

export default function ApplicantDetailPage() {
  return (
    <AuthGuard>
      <Inner />
    </AuthGuard>
  );
}

function Inner() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const id = params?.id ?? "";
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);

  useEffect(() => {
    if (!id) return;
    const unsub = subscribeToApplication(id, (next) => {
      if (!next) {
        setNotFound(true);
      } else {
        setApp(next);
        setNotFound(false);
      }
      setLoading(false);
    });
    return unsub;
  }, [id]);

  const onChangeStatus = async (next: Application["status"]) => {
    if (!app || next === app.status) return;
    setSavingStatus(true);
    try {
      await updateApplicationStatus(app.id, next);
      toast.success("Status updated", `${app.fullName} → ${STATUS_LABEL[next]}`);
    } catch (err) {
      toast.error(
        "Could not update status",
        err instanceof Error ? err.message : "Unknown error.",
      );
    } finally {
      setSavingStatus(false);
    }
  };

  if (loading) {
    return (
      <AdminShell
        eyebrow="Admin · Applicant"
        title="Loading applicant…"
      >
        <div className="rounded-card-lg border border-ink-200 bg-white px-6 py-10 text-center text-sm text-ink-500 shadow-soft dark:border-white/10 dark:bg-white/5 dark:text-white/60">
          Loading…
        </div>
      </AdminShell>
    );
  }

  if (notFound || !app) {
    return (
      <AdminShell
        eyebrow="Admin · Applicant"
        title="Applicant not found"
        actions={
          <button
            type="button"
            onClick={() => router.push("/admin/dashboard/applicants")}
            className="rounded-lg border border-ink-200 bg-white px-4 py-2 text-[0.85rem] font-semibold text-ink-700 transition-colors hover:bg-ink-100 dark:border-white/15 dark:bg-transparent dark:text-white/80 dark:hover:bg-white/5"
          >
            ← Back to applicants
          </button>
        }
      >
        <div className="rounded-card-lg border border-brand-red/30 bg-brand-red/10 px-5 py-4 text-[0.9rem] text-brand-red dark:text-brand-red-soft">
          This application no longer exists.
        </div>
      </AdminShell>
    );
  }

  const appliedOn = app.createdAt
    ? app.createdAt.toDate().toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "—";

  return (
    <AdminShell
      eyebrow="Admin · Applicant"
      title={app.fullName}
      description={
        <>
          Applied for{" "}
          <Link
            href={`/admin/dashboard/jobs/${app.jobId}/applicants`}
            className="font-semibold text-brand-red hover:underline dark:text-brand-red-soft"
          >
            {app.jobTitle}
          </Link>
          {app.jobDepartment ? ` · ${app.jobDepartment}` : ""} · {appliedOn}
        </>
      }
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-[0.72rem] font-semibold ${STATUS_CLASS[app.status]}`}
          >
            {STATUS_LABEL[app.status]}
          </span>
          <select
            value={app.status}
            onChange={(e) =>
              onChangeStatus(e.target.value as Application["status"])
            }
            disabled={savingStatus}
            aria-label="Update status"
            className="rounded-lg border-[1.5px] border-ink-200 bg-white px-3 py-2 text-[0.82rem] font-semibold text-navy outline-none transition-all duration-300 focus:border-brand-red focus:shadow-[0_0_0_3px_rgba(179,9,32,0.1)] disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:bg-white/5 dark:text-white dark:focus:border-brand-red-soft"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-ink-200 bg-white px-4 py-2 text-[0.85rem] font-semibold text-ink-700 transition-colors hover:bg-ink-100 dark:border-white/15 dark:bg-transparent dark:text-white/80 dark:hover:bg-white/5"
          >
            ← Back
          </button>
        </div>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-5">
          <Card title="Contact">
            <Grid>
              <Field label="Email">
                <a
                  href={`mailto:${app.email}`}
                  className="font-medium text-brand-red hover:underline dark:text-brand-red-soft"
                >
                  {app.email}
                </a>
              </Field>
              <Field label="Phone">
                {app.phone ? (
                  <a
                    href={`tel:${app.phone}`}
                    className="hover:underline"
                  >
                    {app.phone}
                  </a>
                ) : (
                  "—"
                )}
              </Field>
              <Field label="City">{app.city || "—"}</Field>
              <Field label="Country">{app.country || "—"}</Field>
            </Grid>
            {(app.resumeUrl || app.linkedinUrl || app.portfolioUrl) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {app.resumeUrl && (
                  <ExternalLink href={app.resumeUrl} label="Resume" />
                )}
                {app.linkedinUrl && (
                  <ExternalLink href={app.linkedinUrl} label="LinkedIn" />
                )}
                {app.portfolioUrl && (
                  <ExternalLink href={app.portfolioUrl} label="Portfolio" />
                )}
              </div>
            )}
          </Card>

          <Card title="Experience">
            <Grid>
              <Field label="Current title">{app.currentTitle || "—"}</Field>
              <Field label="Current company">
                {app.currentCompany || "—"}
              </Field>
              <Field label="Years of experience">
                {app.yearsExperience} yr
              </Field>
              <Field label="Notice period">
                {app.noticePeriodDays
                  ? `${app.noticePeriodDays} days`
                  : "—"}
              </Field>
              <Field label="Expected salary">
                {app.expectedSalary || "—"}
              </Field>
              <Field label="Open to relocation">
                {app.willingToRelocate ? "Yes" : "No"}
              </Field>
              <Field label="Work authorization">
                {app.workAuthorization}
              </Field>
            </Grid>
          </Card>

          <Card title="Cover letter">
            {app.coverLetter ? (
              <p className="whitespace-pre-wrap text-[0.9rem] leading-relaxed text-ink-700 dark:text-white/80">
                {app.coverLetter}
              </p>
            ) : (
              <p className="text-[0.88rem] text-ink-500 dark:text-white/55">
                No cover letter provided.
              </p>
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card title="Application">
            <Grid cols={1}>
              <Field label="Role">
                <Link
                  href={`/admin/dashboard/jobs/${app.jobId}/applicants`}
                  className="font-semibold text-brand-red hover:underline dark:text-brand-red-soft"
                >
                  {app.jobTitle}
                </Link>
              </Field>
              <Field label="Department">{app.jobDepartment || "—"}</Field>
              <Field label="Applied">{appliedOn}</Field>
              <Field label="Status">
                <span
                  className={`inline-block rounded-full px-2.5 py-1 text-[0.72rem] font-semibold ${STATUS_CLASS[app.status]}`}
                >
                  {STATUS_LABEL[app.status]}
                </span>
              </Field>
            </Grid>
          </Card>

          <Card title="Source">
            <Grid cols={1}>
              <Field label="Heard about us">{app.hearAbout}</Field>
              {app.referralName && (
                <Field label="Referral name">{app.referralName}</Field>
              )}
              <Field label="Consent to contact">
                {app.consent ? "Yes" : "No"}
              </Field>
            </Grid>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-card-lg border border-ink-200 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-white/5">
      <h2 className="mb-4 text-[0.78rem] font-bold uppercase tracking-[0.13em] text-ink-500 dark:text-white/55">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Grid({
  children,
  cols = 2,
}: {
  children: ReactNode;
  cols?: 1 | 2;
}) {
  return (
    <div
      className={`grid gap-4 ${cols === 2 ? "sm:grid-cols-2" : "grid-cols-1"}`}
    >
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-ink-500 dark:text-white/50">
        {label}
      </span>
      <span className="text-[0.92rem] text-navy dark:text-white/90">
        {children}
      </span>
    </div>
  );
}

function ExternalLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="rounded-md border border-ink-200 px-2.5 py-1 text-[0.78rem] font-semibold text-ink-700 transition-colors hover:bg-ink-100 dark:border-white/15 dark:text-white/75 dark:hover:bg-white/5"
    >
      {label} ↗
    </a>
  );
}
