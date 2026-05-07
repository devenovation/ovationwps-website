"use client";

import { FormEvent, useEffect, useState } from "react";
import { Job, JobInput, EMPLOYMENT_TYPES } from "@/lib/firebase/types";
import { createJob, updateJob } from "@/lib/firebase/jobs";
import { useToast } from "../../components/Toast";

interface Props {
  initial?: Job | null;
  onClose: () => void;
}

const EMPTY: JobInput = {
  title: "",
  department: "",
  location: "",
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

export default function JobForm({ initial, onClose }: Props) {
  const toast = useToast();
  const [form, setForm] = useState<JobInput>(EMPTY);
  const [requirementsText, setRequirementsText] = useState("");
  const [responsibilitiesText, setResponsibilitiesText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title,
        department: initial.department,
        location: initial.location,
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

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const payload: JobInput = {
      ...form,
      title: form.title.trim(),
      department: form.department.trim(),
      location: form.location.trim(),
      applyEmail: form.applyEmail.trim(),
      requirements: linesToArray(requirementsText),
      responsibilities: linesToArray(responsibilitiesText),
    };
    try {
      if (initial) {
        await updateJob(initial.id, payload);
        toast.success("Job updated", `"${payload.title}" was saved.`);
      } else {
        await createJob(payload);
        toast.success(
          "Job created",
          payload.active
            ? `"${payload.title}" is now live on the careers page.`
            : `"${payload.title}" was saved as a draft.`,
        );
      }
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not save job.";
      setError(msg);
      toast.error(initial ? "Update failed" : "Create failed", msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-10">
      <div className="w-full max-w-[680px] rounded-card-lg border border-ink-200 bg-white p-7 shadow-soft dark:border-white/10 dark:bg-navy-deep">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-extrabold tracking-[-0.01em] text-navy dark:text-white">
            {initial ? "Edit job" : "New job"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-ink-500 hover:text-navy dark:text-white/60 dark:hover:text-white"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
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
              <input
                id="department"
                required
                value={form.department}
                onChange={(e) => update("department", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="location" className={labelClass}>
                Location
              </label>
              <input
                id="location"
                required
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
                placeholder="Remote · New York · Hybrid"
                className={inputClass}
              />
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
                {EMPLOYMENT_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
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

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className={labelClass}>
              Description
            </label>
            <textarea
              id="description"
              required
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className={`${inputClass} min-h-[110px] resize-y`}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="responsibilities" className={labelClass}>
              Responsibilities <span className="font-normal text-ink-500 dark:text-white/50">(one per line)</span>
            </label>
            <textarea
              id="responsibilities"
              value={responsibilitiesText}
              onChange={(e) => setResponsibilitiesText(e.target.value)}
              className={`${inputClass} min-h-[110px] resize-y`}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="requirements" className={labelClass}>
              Requirements <span className="font-normal text-ink-500 dark:text-white/50">(one per line)</span>
            </label>
            <textarea
              id="requirements"
              value={requirementsText}
              onChange={(e) => setRequirementsText(e.target.value)}
              className={`${inputClass} min-h-[110px] resize-y`}
            />
          </div>

          <label className="flex items-center gap-2 text-[0.85rem] text-ink-700 dark:text-white/75">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => update("active", e.target.checked)}
              className="h-4 w-4 accent-brand-red"
            />
            Publish (visible on Careers page)
          </label>

          {error && (
            <div className="rounded-md border border-brand-red/30 bg-brand-red/10 px-3 py-2 text-[0.82rem] text-brand-red dark:text-brand-red-soft">
              {error}
            </div>
          )}

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
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
        </form>
      </div>
    </div>
  );
}
