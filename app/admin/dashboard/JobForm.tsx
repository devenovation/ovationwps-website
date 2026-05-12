"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Job,
  JobInput,
  JobLocation,
  EMPTY_JOB_LOCATION,
  EMPLOYMENT_TYPES,
  formatJobLocation,
} from "@/lib/firebase/types";
import { createJob, updateJob } from "@/lib/firebase/jobs";
import { useToast } from "../../components/Toast";
import {
  TaxonomyItem,
  subscribeToAllTaxonomies,
} from "@/lib/firebase/taxonomies";

interface Props {
  initial?: Job | null;
}

const EMPTY: JobInput = {
  title: "",
  department: "",
  location: { ...EMPTY_JOB_LOCATION },
  type: "Full-Time",
  description: "",
  requirements: [],
  responsibilities: [],
  applyEmail: "",
  active: true,
};

const inputClass =
  "rounded-lg border-[1.5px] border-ink-200 bg-white px-3.5 py-2.5 text-[0.9rem] text-navy outline-none transition-all duration-300 focus:border-brand-red focus:shadow-[0_0_0_3px_rgba(179,9,32,0.1)] dark:border-white/15 dark:bg-white/5 dark:text-white dark:focus:border-brand-red-soft";
const labelClass =
  "text-[0.82rem] font-semibold text-ink-700 dark:text-white/75";

const linesToArray = (text: string) =>
  text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

const trimLocation = (loc: JobLocation): JobLocation => ({
  address1: loc.address1.trim(),
  address2: loc.address2.trim(),
  area: loc.area.trim(),
  city: loc.city.trim(),
  state: loc.state.trim(),
  country: loc.country.trim(),
  pincode: loc.pincode.trim(),
});

const LOCATION_FIELDS: {
  key: keyof JobLocation;
  label: string;
  placeholder: string;
  required?: boolean;
  list?: string;
}[] = [
  { key: "address1", label: "Address line 1", placeholder: "Building, street" },
  { key: "address2", label: "Address line 2", placeholder: "Suite, floor (optional)" },
  { key: "area", label: "Area / locality", placeholder: "Neighbourhood" },
  { key: "city", label: "City", placeholder: "e.g. Hyderabad", required: true, list: "job-city-options" },
  { key: "state", label: "State / region", placeholder: "e.g. Telangana" },
  { key: "country", label: "Country", placeholder: "e.g. India", required: true, list: "job-country-options" },
  { key: "pincode", label: "PIN / ZIP code", placeholder: "e.g. 500081" },
];

const hashtagify = (s: string) =>
  "#" + s.replace(/[^a-zA-Z0-9]+/g, "");

function buildLinkedInCaption(job: JobInput, applyUrl: string): string {
  const fullAddress = formatJobLocation(job.location);
  const tags = ["#hiring", "#careers", hashtagify(job.department), hashtagify(job.type)]
    .filter((t) => t.length > 1)
    .join(" ");
  const lines: string[] = [];
  lines.push(`🚀 We're hiring: ${job.title}`);
  lines.push("");
  lines.push(`📌 Role: ${job.title}`);
  lines.push(`🏢 Department: ${job.department}`);
  lines.push(`💼 Type: ${job.type}`);
  if (fullAddress) lines.push(`📍 Location: ${fullAddress}`);
  lines.push("");
  if (job.description.trim()) {
    lines.push(job.description.trim());
    lines.push("");
  }
  if (job.responsibilities.length > 0) {
    lines.push("✅ What you'll do:");
    job.responsibilities.forEach((r) => lines.push(`• ${r}`));
    lines.push("");
  }
  if (job.requirements.length > 0) {
    lines.push("🎯 What we're looking for:");
    job.requirements.forEach((r) => lines.push(`• ${r}`));
    lines.push("");
  }
  lines.push(`👉 Apply here: ${applyUrl}`);
  lines.push("");
  lines.push(tags);
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

interface ShareState {
  job: JobInput;
  applyUrl: string;
  caption: string;
  mode: "created" | "updated";
}

export default function JobForm({ initial }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [form, setForm] = useState<JobInput>(EMPTY);
  const [requirementsText, setRequirementsText] = useState("");
  const [responsibilitiesText, setResponsibilitiesText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [taxonomies, setTaxonomies] = useState<TaxonomyItem[]>([]);
  const [share, setShare] = useState<ShareState | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsub = subscribeToAllTaxonomies(setTaxonomies);
    return unsub;
  }, []);

  const departmentOptions = useMemo(
    () =>
      taxonomies
        .filter((t) => t.kind === "department" && t.active)
        .map((t) => t.name),
    [taxonomies],
  );
  const cityOptions = useMemo(
    () =>
      taxonomies
        .filter((t) => t.kind === "city" && t.active)
        .map((t) => t.name),
    [taxonomies],
  );
  const countryOptions = useMemo(
    () =>
      taxonomies
        .filter((t) => t.kind === "country" && t.active)
        .map((t) => t.name),
    [taxonomies],
  );
  const employmentOptions = useMemo(() => {
    const custom = taxonomies
      .filter((t) => t.kind === "employmentType" && t.active)
      .map((t) => t.name);
    return custom.length > 0 ? custom : (EMPLOYMENT_TYPES as readonly string[]);
  }, [taxonomies]);

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title,
        department: initial.department,
        location: { ...EMPTY_JOB_LOCATION, ...initial.location },
        type: initial.type,
        description: initial.description,
        requirements: initial.requirements,
        responsibilities: initial.responsibilities,
        applyEmail: initial.applyEmail,
        active: initial.active,
      });
      setRequirementsText(initial.requirements.join("\n"));
      setResponsibilitiesText(initial.responsibilities.join("\n"));
    } else {
      setForm(EMPTY);
      setRequirementsText("");
      setResponsibilitiesText("");
    }
  }, [initial]);

  const update = <K extends keyof JobInput>(key: K, value: JobInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const updateLocation = (key: keyof JobLocation, value: string) =>
    setForm((prev) => ({ ...prev, location: { ...prev.location, [key]: value } }));

  const onCancel = () => router.push("/admin/dashboard");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const payload: JobInput = {
      ...form,
      title: form.title.trim(),
      department: form.department.trim(),
      location: trimLocation(form.location),
      applyEmail: form.applyEmail.trim(),
      requirements: linesToArray(requirementsText),
      responsibilities: linesToArray(responsibilitiesText),
    };
    try {
      let jobId: string;
      if (initial) {
        await updateJob(initial.id, payload);
        jobId = initial.id;
        toast.success("Job updated", `"${payload.title}" was saved.`);
      } else {
        const ref = await createJob(payload);
        jobId = ref.id;
        toast.success(
          "Job created",
          payload.active
            ? `"${payload.title}" is now live on the careers page.`
            : `"${payload.title}" was saved as a draft.`,
        );
      }
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const applyUrl = `${origin}/careers/apply/${jobId}`;
      setCopied(false);
      setShare({
        job: payload,
        applyUrl,
        caption: buildLinkedInCaption(payload, applyUrl),
        mode: initial ? "updated" : "created",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not save job.";
      setError(msg);
      toast.error(initial ? "Update failed" : "Create failed", msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (share) {
    const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      share.applyUrl,
    )}`;
    const copyCaption = async () => {
      try {
        await navigator.clipboard.writeText(share.caption);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
        return true;
      } catch {
        return false;
      }
    };
    const onCopyCaption = async () => {
      if (await copyCaption())
        toast.success("Caption copied", "Paste it into your LinkedIn post.");
      else
        toast.error("Could not copy", "Select the text and copy it manually.");
    };
    const onShareLinkedIn = async () => {
      const ok = await copyCaption();
      toast.info(
        "Opening LinkedIn…",
        ok
          ? "Caption copied — paste it (Ctrl/Cmd+V) into the post box."
          : "Copy the caption below and paste it into the post box.",
      );
      window.open(linkedInShareUrl, "_blank", "noopener,noreferrer");
    };
    return (
      <div className="flex flex-col gap-6 rounded-card-lg border border-ink-200 bg-white p-7 shadow-soft dark:border-white/10 dark:bg-white/5">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <div>
            <h2 className="text-[1.05rem] font-extrabold text-navy dark:text-white">
              Job {share.mode} — &ldquo;{share.job.title}&rdquo;
            </h2>
            <p className="mt-1 text-[0.88rem] text-ink-500 dark:text-white/60">
              {share.job.active
                ? "It's live on the careers page. Share it on LinkedIn to reach more candidates."
                : "Saved as a draft. Publish it first if you want the apply link to work for candidates."}
            </p>
          </div>
        </div>

        <div className="rounded-card-lg border border-ink-200 bg-ink-100/50 p-5 dark:border-white/10 dark:bg-white/[0.03]">
          <h3 className="mb-1 text-[0.82rem] font-bold uppercase tracking-[0.13em] text-ink-500 dark:text-white/55">
            Share on LinkedIn
          </h3>
          <p className="mb-3 text-[0.84rem] text-ink-500 dark:text-white/60">
            LinkedIn doesn&rsquo;t allow pre-filling the post text from a link,
            so clicking <strong>Share on LinkedIn</strong> copies the full caption
            to your clipboard and opens the post composer for the apply link below
            — just paste (Ctrl/Cmd&nbsp;+&nbsp;V) into the post box.
          </p>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onShareLinkedIn}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0a66c2] px-4 py-2.5 text-[0.88rem] font-semibold text-white transition-colors hover:bg-[#004182]"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path d="M19 0H5a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5V5a5 5 0 00-5-5zM8 19H5V8h3v11zM6.5 6.7a1.8 1.8 0 110-3.6 1.8 1.8 0 010 3.6zM20 19h-3v-5.6c0-1.4-.5-2.3-1.7-2.3-1 0-1.5.6-1.8 1.2-.1.2-.1.5-.1.9V19h-3V8h3v1.5c.4-.6 1.1-1.5 2.8-1.5 2 0 3.6 1.3 3.6 4.2V19z" />
              </svg>
              Share on LinkedIn (copies caption)
            </button>
            <button
              type="button"
              onClick={onCopyCaption}
              className="inline-flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-4 py-2.5 text-[0.88rem] font-semibold text-ink-700 transition-colors hover:bg-ink-100 dark:border-white/15 dark:bg-transparent dark:text-white/80 dark:hover:bg-white/5"
            >
              {copied ? "Copied!" : "Copy caption only"}
            </button>
          </div>
          <textarea
            readOnly
            value={share.caption}
            onFocus={(e) => e.currentTarget.select()}
            className={`${inputClass} min-h-[200px] w-full resize-y font-mono text-[0.82rem]`}
          />
          <p className="mt-2 text-[0.78rem] text-ink-500 dark:text-white/55">
            Apply link:{" "}
            <a
              href={share.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-red hover:underline dark:text-brand-red-soft"
            >
              {share.applyUrl}
            </a>
          </p>
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t border-ink-200 pt-5 dark:border-white/10">
          {!initial && (
            <button
              type="button"
              onClick={() => {
                setShare(null);
                setForm(EMPTY);
                setRequirementsText("");
                setResponsibilitiesText("");
              }}
              className="rounded-lg border border-ink-200 bg-white px-5 py-2.5 text-[0.9rem] font-semibold text-ink-700 transition-colors hover:bg-ink-100 dark:border-white/15 dark:bg-transparent dark:text-white/80 dark:hover:bg-white/5"
            >
              Create another
            </button>
          )}
          <button
            type="button"
            onClick={() => router.push("/admin/dashboard")}
            className="rounded-lg bg-brand-red px-5 py-2.5 text-[0.9rem] font-semibold text-white transition-colors hover:bg-brand-red-dark"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-6 rounded-card-lg border border-ink-200 bg-white p-7 shadow-soft dark:border-white/10 dark:bg-white/5"
    >
      <datalist id="job-city-options">
        {cityOptions.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
      <datalist id="job-country-options">
        {countryOptions.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>

      <section className="flex flex-col gap-4">
        <h2 className="text-[0.78rem] font-bold uppercase tracking-[0.13em] text-ink-500 dark:text-white/55">
          Role basics
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className={labelClass}>
              Job title
            </label>
            <input
              id="title"
              required
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="department" className={labelClass}>
              Department
            </label>
            <select
              id="department"
              required
              value={form.department}
              onChange={(e) => update("department", e.target.value)}
              disabled={departmentOptions.length === 0}
              className={inputClass}
            >
              <option value="" disabled>
                {departmentOptions.length === 0
                  ? "Add departments under Master Data"
                  : "Select a department"}
              </option>
              {form.department &&
                !departmentOptions.includes(form.department) && (
                  <option value={form.department}>
                    {form.department} (inactive)
                  </option>
                )}
              {departmentOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <MasterDataHint kind="departments" empty={departmentOptions.length === 0} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="type" className={labelClass}>
              Employment type
            </label>
            <select
              id="type"
              value={form.type}
              onChange={(e) =>
                update("type", e.target.value as JobInput["type"])
              }
              className={inputClass}
            >
              {employmentOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="applyEmail" className={labelClass}>
              Apply email
            </label>
            <input
              id="applyEmail"
              type="email"
              required
              value={form.applyEmail}
              onChange={(e) => update("applyEmail", e.target.value)}
              placeholder="careers@ovationwps.com"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-[0.78rem] font-bold uppercase tracking-[0.13em] text-ink-500 dark:text-white/55">
          Location
        </h2>
        <p className="-mt-1 text-[0.78rem] text-ink-500 dark:text-white/55">
          Enter the full address — area, city, state, country, PIN code, etc.
          City and country are required and are added to{" "}
          <Link
            href="/admin/dashboard/master-data"
            className="font-semibold text-brand-red hover:underline dark:text-brand-red-soft"
          >
            Master Data
          </Link>{" "}
          automatically when you save.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {LOCATION_FIELDS.map((f) => (
            <div key={f.key} className="flex flex-col gap-1.5">
              <label htmlFor={`loc-${f.key}`} className={labelClass}>
                {f.label}
                {f.required && (
                  <span className="ml-0.5 text-brand-red dark:text-brand-red-soft">
                    *
                  </span>
                )}
              </label>
              <input
                id={`loc-${f.key}`}
                required={f.required}
                list={f.list}
                value={form.location[f.key]}
                onChange={(e) => updateLocation(f.key, e.target.value)}
                placeholder={f.placeholder}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-[0.78rem] font-bold uppercase tracking-[0.13em] text-ink-500 dark:text-white/55">
          Job details
        </h2>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className={labelClass}>
            Description
          </label>
          <textarea
            id="description"
            required
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className={`${inputClass} min-h-[120px] resize-y`}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="responsibilities" className={labelClass}>
            Responsibilities{" "}
            <span className="font-normal text-ink-500 dark:text-white/50">
              (one per line)
            </span>
          </label>
          <textarea
            id="responsibilities"
            value={responsibilitiesText}
            onChange={(e) => setResponsibilitiesText(e.target.value)}
            className={`${inputClass} min-h-[120px] resize-y`}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="requirements" className={labelClass}>
            Requirements{" "}
            <span className="font-normal text-ink-500 dark:text-white/50">
              (one per line)
            </span>
          </label>
          <textarea
            id="requirements"
            value={requirementsText}
            onChange={(e) => setRequirementsText(e.target.value)}
            className={`${inputClass} min-h-[120px] resize-y`}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-[0.78rem] font-bold uppercase tracking-[0.13em] text-ink-500 dark:text-white/55">
          Visibility
        </h2>
        <label className="flex items-center gap-2 text-[0.88rem] text-ink-700 dark:text-white/75">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => update("active", e.target.checked)}
            className="h-4 w-4 accent-brand-red"
          />
          Publish (visible on Careers page)
        </label>
      </section>

      {error && (
        <div className="rounded-md border border-brand-red/30 bg-brand-red/10 px-3 py-2 text-[0.82rem] text-brand-red dark:text-brand-red-soft">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-200 pt-5 dark:border-white/10">
        <Link
          href="/admin/dashboard/master-data"
          className="text-[0.78rem] font-semibold text-brand-red hover:underline dark:text-brand-red-soft"
        >
          Manage master data →
        </Link>
        <div className="flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-ink-200 bg-white px-5 py-2.5 text-[0.9rem] font-semibold text-ink-700 transition-colors hover:bg-ink-100 dark:border-white/15 dark:bg-transparent dark:text-white/80 dark:hover:bg-white/5"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-brand-red px-5 py-2.5 text-[0.9rem] font-semibold text-white transition-colors hover:bg-brand-red-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Saving…" : initial ? "Save changes" : "Create job"}
        </button>
        </div>
      </div>
    </form>
  );
}

function MasterDataHint({
  kind,
  empty,
}: {
  kind: "departments";
  empty: boolean;
}) {
  if (!empty) return null;
  return (
    <p className="text-[0.74rem] text-ink-500 dark:text-white/55">
      No saved {kind} yet — they’ll auto-suggest once you add some in{" "}
      <Link
        href="/admin/dashboard/master-data"
        className="font-semibold text-brand-red hover:underline dark:text-brand-red-soft"
      >
        Master Data
      </Link>
      .
    </p>
  );
}
