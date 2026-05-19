"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { getJob } from "@/lib/firebase/jobs";
import { Job, formatJobLocation, jobCityCountry } from "@/lib/firebase/types";
import {
  ApplicationInput,
  HEAR_ABOUT_OPTIONS,
  WORK_AUTH_OPTIONS,
  createApplication,
} from "@/lib/firebase/applications";
import { useToast } from "../../../components/Toast";
import { ArrowRightIcon } from "../../../constants";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URL_RE = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;
const PHONE_RE = /^\+?[0-9 ()\-.]{7,}$/;
const LINKEDIN_RE = /linkedin\.com\/(in|pub)\//i;

const RESUME_MAX_BYTES = 4 * 1024 * 1024; // 4 MB
const RESUME_ACCEPT =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const inputClass =
  "w-full rounded-lg border-[1.5px] border-ink-200 bg-white px-3.5 py-2.5 text-[0.92rem] text-navy outline-none transition-all duration-300 focus:border-brand-red focus:shadow-[0_0_0_3px_rgba(179,9,32,0.1)] dark:border-white/15 dark:bg-white/5 dark:text-white dark:focus:border-brand-red-soft dark:focus:shadow-[0_0_0_3px_rgba(232,74,95,0.18)]";
const inputErrClass =
  "w-full rounded-lg border-[1.5px] border-brand-red/60 bg-white px-3.5 py-2.5 text-[0.92rem] text-navy outline-none transition-all duration-300 focus:border-brand-red focus:shadow-[0_0_0_3px_rgba(179,9,32,0.1)] dark:bg-white/5 dark:text-white";
const labelClass =
  "text-[0.82rem] font-semibold text-ink-700 dark:text-white/80";
const errorMsgClass =
  "text-[0.78rem] font-medium text-brand-red dark:text-brand-red-soft";

type ExperienceLevel = "fresher" | "experienced";

type FormState = Omit<
  ApplicationInput,
  "jobId" | "jobTitle" | "jobDepartment" | "yearsExperience" | "noticePeriodDays"
> & {
  experienceLevel: ExperienceLevel;
  yearsExperience: string;
  noticePeriodDays: string;
};

const EMPTY: FormState = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  country: "",
  linkedinUrl: "",
  resumeUrl: "",
  portfolioUrl: "",
  experienceLevel: "experienced",
  currentCompany: "",
  currentTitle: "",
  yearsExperience: "",
  noticePeriodDays: "",
  expectedSalary: "",
  willingToRelocate: false,
  workAuthorization: "US Citizen",
  coverLetter: "",
  hearAbout: "Company Website",
  referralName: "",
  consent: false,
};

type Errors = Partial<Record<keyof FormState, string>>;

function validate(state: FormState): Errors {
  const e: Errors = {};
  if (!state.fullName.trim() || state.fullName.trim().length < 2)
    e.fullName = "Please enter your full name.";
  if (!state.email.trim()) e.email = "Email is required.";
  else if (!EMAIL_RE.test(state.email.trim()))
    e.email = "Enter a valid email address.";
  if (!state.phone.trim()) e.phone = "Phone is required.";
  else if (!PHONE_RE.test(state.phone.trim()))
    e.phone = "Enter a valid phone number (digits, spaces, +, -, () allowed).";
  if (!state.city.trim()) e.city = "City is required.";
  if (!state.country.trim()) e.country = "Country is required.";
  if (!state.linkedinUrl.trim()) e.linkedinUrl = "LinkedIn URL is required.";
  else if (!URL_RE.test(state.linkedinUrl.trim()))
    e.linkedinUrl = "Enter a valid URL starting with https://";
  else if (!LINKEDIN_RE.test(state.linkedinUrl.trim()))
    e.linkedinUrl = "Must be a linkedin.com/in/ profile URL.";
  if (state.portfolioUrl.trim() && !URL_RE.test(state.portfolioUrl.trim()))
    e.portfolioUrl = "Enter a valid URL or leave it empty.";
  if (state.experienceLevel === "experienced") {
    if (!state.yearsExperience.trim())
      e.yearsExperience = "Years of experience is required.";
    else {
      const n = Number(state.yearsExperience);
      if (!Number.isFinite(n) || n <= 0 || n > 60)
        e.yearsExperience = "Enter a number between 0.5 and 60.";
    }
  }
  if (!state.noticePeriodDays.trim())
    e.noticePeriodDays = "Notice period is required.";
  else {
    const n = Number(state.noticePeriodDays);
    if (!Number.isFinite(n) || n < 0 || n > 365)
      e.noticePeriodDays = "Enter days between 0 and 365.";
  }
  if (!state.expectedSalary.trim())
    e.expectedSalary = "Expected compensation is required.";
  if (!state.coverLetter.trim() || state.coverLetter.trim().length < 40)
    e.coverLetter = "Tell us a bit more (at least 40 characters).";
  if (state.hearAbout === "Referral" && !state.referralName.trim())
    e.referralName = "Please tell us who referred you.";
  if (!state.consent) e.consent = "Please acknowledge to continue.";
  return e;
}

export default function ApplyClient({ jobId }: { jobId: string }) {
  const toast = useToast();
  const [job, setJob] = useState<Job | null>(null);
  const [jobLoading, setJobLoading] = useState(true);
  const [jobError, setJobError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const pickResume = (file: File | null) => {
    setResumeFile(file);
    if (errors.resumeUrl) setErrors((prev) => ({ ...prev, resumeUrl: undefined }));
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const j = await getJob(jobId);
        if (cancelled) return;
        if (!j || !j.active) {
          setJobError("This role is no longer accepting applications.");
        } else {
          setJob(j);
        }
      } catch (err) {
        if (!cancelled)
          setJobError(
            err instanceof Error ? err.message : "Could not load this role.",
          );
      } finally {
        if (!cancelled) setJobLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [jobId]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!job) return;
    const v = validate(form);
    if (!resumeFile) {
      v.resumeUrl = "Please attach your resume (PDF or Word).";
    } else if (!RESUME_TYPES.includes(resumeFile.type)) {
      v.resumeUrl = "Resume must be a PDF, DOC, or DOCX file.";
    } else if (resumeFile.size > RESUME_MAX_BYTES) {
      v.resumeUrl = "Resume must be 4 MB or smaller.";
    }
    setErrors(v);
    if (Object.keys(v).length > 0) {
      const count = Object.keys(v).length;
      toast.error(
        "Please fix the highlighted fields",
        `${count} field${count > 1 ? "s" : ""} need attention.`,
      );
      const firstKey = Object.keys(v)[0];
      const el = document.getElementById(firstKey);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus({ preventScroll: true });
      return;
    }

    setSubmitting(true);
    try {
      const payload: ApplicationInput = {
        jobId: job.id,
        jobTitle: job.title,
        jobDepartment: job.department,
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        country: form.country.trim(),
        linkedinUrl: form.linkedinUrl.trim(),
        // The resume is emailed as an attachment, not stored, so there is
        // no URL to record on the application.
        resumeUrl: "",
        portfolioUrl: form.portfolioUrl.trim(),
        currentCompany:
          form.experienceLevel === "fresher"
            ? ""
            : form.currentCompany.trim(),
        currentTitle:
          form.experienceLevel === "fresher" ? "" : form.currentTitle.trim(),
        yearsExperience:
          form.experienceLevel === "fresher"
            ? 0
            : Number(form.yearsExperience),
        noticePeriodDays: Number(form.noticePeriodDays),
        expectedSalary: form.expectedSalary.trim(),
        willingToRelocate: form.willingToRelocate,
        workAuthorization: form.workAuthorization,
        coverLetter: form.coverLetter.trim(),
        hearAbout: form.hearAbout,
        referralName:
          form.hearAbout === "Referral" ? form.referralName.trim() : "",
        consent: form.consent,
      };
      await createApplication(payload);
      let emailWarning: string | null = null;
      try {
        const fd = new FormData();
        fd.append("payload", JSON.stringify(payload));
        fd.append("resume", resumeFile as File);
        const res = await fetch("/api/applications", {
          method: "POST",
          body: fd,
        });
        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as {
            error?: string;
          };
          emailWarning =
            data.error ||
            "Saved your application, but the confirmation email could not be sent.";
        }
      } catch {
        emailWarning =
          "Saved your application, but we could not send the confirmation email right now.";
      }
      if (emailWarning) {
        toast.info("Application saved", emailWarning);
      } else {
        toast.success(
          "Application submitted",
          "Our team will review your details and reach out within 3 business days. Check your inbox for a confirmation.",
        );
      }
      setSubmitted(true);
    } catch (err) {
      toast.error(
        "Submission failed",
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (jobLoading) {
    return (
      <section className="mx-auto max-w-[780px] px-7 pt-[140px] pb-24">
        <div className="rounded-[20px] border border-ink-200 bg-white px-6 py-16 text-center text-sm text-ink-500 dark:border-white/10 dark:bg-white/5 dark:text-white/65">
          Loading role…
        </div>
      </section>
    );
  }

  if (jobError || !job) {
    return (
      <section className="mx-auto max-w-[780px] px-7 pt-[140px] pb-24">
        <div className="rounded-[20px] border border-brand-red/30 bg-brand-red/10 px-6 py-12 text-center">
          <h1 className="text-[1.4rem] font-extrabold text-navy dark:text-white">
            Role unavailable
          </h1>
          <p className="mt-2 text-[0.95rem] text-ink-700 dark:text-white/70">
            {jobError ?? "This role is no longer accepting applications."}
          </p>
          <Link
            href="/careers"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-red px-6 py-3 text-[0.9rem] font-semibold text-white transition-colors hover:bg-brand-red-dark"
          >
            Back to all roles
            {ArrowRightIcon}
          </Link>
        </div>
      </section>
    );
  }

  if (submitted) {
    return (
      <section className="mx-auto max-w-[720px] px-7 pt-[140px] pb-24">
        <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 px-7 py-12 text-center dark:border-emerald-500/30 dark:bg-emerald-500/10">
          <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h1 className="text-[1.7rem] font-extrabold tracking-[-0.015em] text-navy dark:text-white">
            Thanks, {form.fullName.split(" ")[0]}!
          </h1>
          <p className="mx-auto mt-3 max-w-[480px] text-[0.98rem] leading-[1.7] text-ink-700 dark:text-white/70">
            Your application for <strong>{job.title}</strong> has been received.
            Our team will review and follow up within 3 business days at{" "}
            <span className="font-semibold">{form.email}</span>.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 rounded-full bg-brand-red px-6 py-3 text-[0.9rem] font-semibold text-white transition-colors hover:bg-brand-red-dark"
            >
              Browse more roles
              {ArrowRightIcon}
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-6 py-3 text-[0.9rem] font-semibold text-navy transition-colors hover:bg-ink-100 dark:border-white/15 dark:bg-transparent dark:text-white dark:hover:bg-white/5"
            >
              Back to home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[860px] px-7 pt-[120px] pb-24 max-md:pt-[104px] max-md:pb-16">
      <Link
        href="/careers#openings"
        className="mb-6 inline-flex items-center gap-1 text-[0.85rem] font-semibold text-ink-500 transition-colors hover:text-brand-red dark:text-white/60 dark:hover:text-brand-red-soft"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        All roles
      </Link>

      <header className="mb-10 border-b border-ink-200 pb-8 dark:border-white/10">
        <span className="mb-3 inline-block text-[0.72rem] font-bold uppercase tracking-[0.18em] text-brand-red dark:text-brand-red-soft">
          Apply for this role
        </span>
        <h1 className="text-[clamp(1.7rem,3.4vw,2.4rem)] font-extrabold leading-[1.15] tracking-[-0.025em] text-navy dark:text-white">
          {job.title}
        </h1>
        {formatJobLocation(job.location) && (
          <div className="mt-3 flex items-start gap-2 text-[0.92rem] font-medium text-navy dark:text-white">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 h-[18px] w-[18px] shrink-0 text-brand-red dark:text-brand-red-soft"
              aria-hidden="true"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{formatJobLocation(job.location)}</span>
          </div>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-brand-red-light px-2.5 py-1 text-[0.7rem] font-semibold tracking-[0.04em] text-brand-red dark:bg-brand-red/25 dark:text-brand-red-soft">
            {job.department}
          </span>
          <span className="rounded-full bg-ink-100 px-2.5 py-1 text-[0.7rem] font-semibold tracking-[0.04em] text-ink-700 dark:bg-white/10 dark:text-white/70">
            {jobCityCountry(job.location)}
          </span>
          <span className="rounded-full bg-ink-100 px-2.5 py-1 text-[0.7rem] font-semibold tracking-[0.04em] text-ink-700 dark:bg-white/10 dark:text-white/70">
            {job.type}
          </span>
        </div>
      </header>

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-9">
        <Section title="Personal Information">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Full name" id="fullName" error={errors.fullName} required>
              <input
                id="fullName"
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                className={errors.fullName ? inputErrClass : inputClass}
                autoComplete="name"
              />
            </Field>
            <Field label="Email" id="email" error={errors.email} required>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className={errors.email ? inputErrClass : inputClass}
                autoComplete="email"
              />
            </Field>
            <Field label="Phone" id="phone" error={errors.phone} required>
              <input
                id="phone"
                type="tel"
                placeholder="+1 555 123 4567"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className={errors.phone ? inputErrClass : inputClass}
                autoComplete="tel"
              />
            </Field>
            <Field label="City" id="city" error={errors.city} required>
              <input
                id="city"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                className={errors.city ? inputErrClass : inputClass}
                autoComplete="address-level2"
              />
            </Field>
            <Field label="Country" id="country" error={errors.country} required>
              <input
                id="country"
                value={form.country}
                onChange={(e) => update("country", e.target.value)}
                className={errors.country ? inputErrClass : inputClass}
                autoComplete="country-name"
              />
            </Field>
          </div>
        </Section>

        <Section title="Profile & Resume">
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="LinkedIn profile"
              id="linkedinUrl"
              error={errors.linkedinUrl}
              required
            >
              <input
                id="linkedinUrl"
                type="url"
                placeholder="https://linkedin.com/in/your-handle"
                value={form.linkedinUrl}
                onChange={(e) => update("linkedinUrl", e.target.value)}
                className={errors.linkedinUrl ? inputErrClass : inputClass}
              />
            </Field>
            <Field
              label="Resume"
              id="resumeUrl"
              error={errors.resumeUrl}
              hint={
                resumeFile
                  ? `${resumeFile.name} · ${(resumeFile.size / 1024 / 1024).toFixed(2)} MB`
                  : "PDF, DOC, or DOCX — up to 4 MB."
              }
              required
            >
              <input
                id="resumeUrl"
                type="file"
                accept={RESUME_ACCEPT}
                onChange={(e) => pickResume(e.target.files?.[0] ?? null)}
                className={`${errors.resumeUrl ? inputErrClass : inputClass} cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-brand-red file:px-3 file:py-1.5 file:text-[0.82rem] file:font-semibold file:text-white hover:file:bg-brand-red-dark`}
              />
            </Field>
            <Field
              label="Portfolio / GitHub"
              id="portfolioUrl"
              error={errors.portfolioUrl}
              hint="Optional — leave blank if not applicable."
            >
              <input
                id="portfolioUrl"
                type="url"
                placeholder="https://github.com/you"
                value={form.portfolioUrl}
                onChange={(e) => update("portfolioUrl", e.target.value)}
                className={errors.portfolioUrl ? inputErrClass : inputClass}
              />
            </Field>
          </div>
        </Section>

        <Section title="Experience">
          <div className="mb-5">
            <span className={labelClass}>I&apos;m applying as a…</span>
            <div
              role="radiogroup"
              aria-label="Experience level"
              className="mt-2 inline-flex rounded-lg border border-ink-200 bg-white p-1 shadow-soft dark:border-white/10 dark:bg-white/5"
            >
              {(
                [
                  { value: "experienced", label: "Experienced professional" },
                  { value: "fresher", label: "Fresher / new grad" },
                ] as { value: ExperienceLevel; label: string }[]
              ).map((opt) => {
                const active = form.experienceLevel === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => update("experienceLevel", opt.value)}
                    className={`rounded-md px-4 py-2 text-[0.85rem] font-semibold transition-colors ${
                      active
                        ? "bg-brand-red text-white"
                        : "text-ink-700 hover:bg-ink-100 dark:text-white/75 dark:hover:bg-white/5"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[0.78rem] text-ink-500 dark:text-white/55">
              {form.experienceLevel === "fresher"
                ? "We'll skip the company / title / years questions for you."
                : "Use a decimal for partial years (e.g. 2.5)."}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {form.experienceLevel === "experienced" && (
              <>
                <Field label="Current company" id="currentCompany">
                  <input
                    id="currentCompany"
                    value={form.currentCompany}
                    onChange={(e) => update("currentCompany", e.target.value)}
                    className={inputClass}
                    placeholder="Optional"
                  />
                </Field>
                <Field label="Current title" id="currentTitle">
                  <input
                    id="currentTitle"
                    value={form.currentTitle}
                    onChange={(e) => update("currentTitle", e.target.value)}
                    className={inputClass}
                    placeholder="Optional"
                  />
                </Field>
                <Field
                  label="Years of experience"
                  id="yearsExperience"
                  error={errors.yearsExperience}
                  hint="Use a decimal for partial years (e.g. 2.5)."
                  required
                >
                  <input
                    id="yearsExperience"
                    type="number"
                    min="0.5"
                    max="60"
                    step="0.5"
                    inputMode="decimal"
                    value={form.yearsExperience}
                    onChange={(e) => update("yearsExperience", e.target.value)}
                    className={
                      errors.yearsExperience ? inputErrClass : inputClass
                    }
                  />
                </Field>
              </>
            )}
            <Field
              label="Notice period (days)"
              id="noticePeriodDays"
              error={errors.noticePeriodDays}
              hint={
                form.experienceLevel === "fresher"
                  ? "0 if you can start immediately."
                  : "0 if you can start immediately."
              }
              required
            >
              <input
                id="noticePeriodDays"
                type="number"
                min="0"
                max="365"
                step="1"
                value={form.noticePeriodDays}
                onChange={(e) => update("noticePeriodDays", e.target.value)}
                className={errors.noticePeriodDays ? inputErrClass : inputClass}
              />
            </Field>
            <Field
              label="Expected compensation"
              id="expectedSalary"
              error={errors.expectedSalary}
              hint="Annual or hourly — include currency."
              required
            >
              <input
                id="expectedSalary"
                value={form.expectedSalary}
                onChange={(e) => update("expectedSalary", e.target.value)}
                className={errors.expectedSalary ? inputErrClass : inputClass}
                placeholder="$120,000 / yr"
              />
            </Field>
            <Field
              label="Work authorization"
              id="workAuthorization"
              required
            >
              <select
                id="workAuthorization"
                value={form.workAuthorization}
                onChange={(e) =>
                  update(
                    "workAuthorization",
                    e.target.value as FormState["workAuthorization"],
                  )
                }
                className={inputClass}
              >
                {WORK_AUTH_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </Field>
          </div>
          <label className="mt-4 inline-flex items-center gap-2 text-[0.88rem] text-ink-700 dark:text-white/75">
            <input
              type="checkbox"
              checked={form.willingToRelocate}
              onChange={(e) => update("willingToRelocate", e.target.checked)}
              className="h-4 w-4 accent-brand-red"
            />
            I&rsquo;m open to relocation for this role.
          </label>
        </Section>

        <Section title="A bit more about you">
          <Field
            label="Why this role?"
            id="coverLetter"
            error={errors.coverLetter}
            hint="A short note (40+ characters) — what excites you and what you&rsquo;d bring."
            required
          >
            <textarea
              id="coverLetter"
              rows={6}
              value={form.coverLetter}
              onChange={(e) => update("coverLetter", e.target.value)}
              className={`${errors.coverLetter ? inputErrClass : inputClass} resize-y`}
            />
          </Field>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Field label="How did you hear about us?" id="hearAbout" required>
              <select
                id="hearAbout"
                value={form.hearAbout}
                onChange={(e) =>
                  update("hearAbout", e.target.value as FormState["hearAbout"])
                }
                className={inputClass}
              >
                {HEAR_ABOUT_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </Field>
            {form.hearAbout === "Referral" && (
              <Field
                label="Referrer's name"
                id="referralName"
                error={errors.referralName}
                required
              >
                <input
                  id="referralName"
                  value={form.referralName}
                  onChange={(e) => update("referralName", e.target.value)}
                  className={errors.referralName ? inputErrClass : inputClass}
                />
              </Field>
            )}
          </div>
        </Section>

        <div className="rounded-[14px] border border-ink-200 bg-ink-100/50 p-5 dark:border-white/10 dark:bg-white/[0.03]">
          <label className="flex items-start gap-3 text-[0.88rem] leading-[1.6] text-ink-700 dark:text-white/75">
            <input
              id="consent"
              type="checkbox"
              checked={form.consent}
              onChange={(e) => update("consent", e.target.checked)}
              className={`mt-0.5 h-4 w-4 shrink-0 accent-brand-red ${
                errors.consent ? "outline outline-2 outline-brand-red/60" : ""
              }`}
            />
            <span>
              I confirm the information above is accurate and consent to Ovation
              Workplace Services processing it for recruitment purposes.
            </span>
          </label>
          {errors.consent && (
            <p className={`mt-2 ${errorMsgClass}`}>{errors.consent}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-[0.8rem] text-ink-500 dark:text-white/55">
            Required fields are marked with&nbsp;
            <span className="text-brand-red dark:text-brand-red-soft">*</span>
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-full bg-brand-red px-7 py-3.5 text-[0.95rem] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-red-dark hover:shadow-[0_10px_28px_rgba(179,9,32,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Submit application"}
            {!submitting && ArrowRightIcon}
          </button>
        </div>
      </form>
    </section>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-[20px] border border-ink-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03] md:p-7">
      <legend className="px-2 text-[0.78rem] font-bold uppercase tracking-[0.13em] text-brand-red dark:text-brand-red-soft">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function Field({
  label,
  id,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
        {required && (
          <span className="ml-0.5 text-brand-red dark:text-brand-red-soft">
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p className={errorMsgClass}>{error}</p>
      ) : hint ? (
        <p className="text-[0.78rem] text-ink-500 dark:text-white/55">{hint}</p>
      ) : null}
    </div>
  );
}
