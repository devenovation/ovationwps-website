"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AdminShell from "../components/AdminShell";
import AuthGuard from "../components/AuthGuard";
import {
  deleteJob,
  subscribeToAllJobs,
  updateJob,
} from "@/lib/firebase/jobs";
import { Job, jobCityCountry } from "@/lib/firebase/types";
import { useToast } from "../../components/Toast";
import {
  Application,
  subscribeToAllApplications,
} from "@/lib/firebase/applications";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardInner />
    </AuthGuard>
  );
}

function DashboardInner() {
  const toast = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const unsub = subscribeToAllJobs((next) => {
      setJobs(next);
      setJobsLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = subscribeToAllApplications((next) => setApplications(next));
    return unsub;
  }, []);

  const summary = useMemo(() => {
    const active = jobs.filter((j) => j.active).length;
    return {
      total: jobs.length,
      active,
      draft: jobs.length - active,
      applicants: applications.length,
    };
  }, [jobs, applications]);

  const applicantCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of applications) {
      map.set(a.jobId, (map.get(a.jobId) ?? 0) + 1);
    }
    return map;
  }, [applications]);

  const onToggleActive = async (job: Job) => {
    const next = !job.active;
    try {
      await updateJob(job.id, { active: next });
      toast.success(
        next ? "Job published" : "Job unpublished",
        next
          ? `"${job.title}" is now visible on the careers page.`
          : `"${job.title}" is now hidden as a draft.`,
      );
    } catch (err) {
      toast.error(
        "Could not update status",
        err instanceof Error ? err.message : "Unknown error.",
      );
    }
  };

  const onDelete = async (job: Job) => {
    if (!confirm(`Delete "${job.title}"? This cannot be undone.`)) return;
    try {
      await deleteJob(job.id);
      toast.success("Job deleted", `"${job.title}" was removed.`);
    } catch (err) {
      toast.error(
        "Delete failed",
        err instanceof Error ? err.message : "Unknown error.",
      );
    }
  };

  return (
    <AdminShell
      eyebrow="Admin · Job Postings"
      title="HR Dashboard"
      description="Manage open roles and review incoming applications."
      actions={
        <Link
          href="/admin/dashboard/jobs/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-red px-5 py-2.5 text-[0.9rem] font-semibold text-white transition-colors hover:bg-brand-red-dark"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          New job
        </Link>
      }
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total jobs" value={summary.total} />
        <Stat label="Published" value={summary.active} />
        <Stat label="Draft" value={summary.draft} />
        <Stat label="Applicants" value={summary.applicants} />
      </div>

      <div className="overflow-hidden rounded-card-lg border border-ink-200 bg-white shadow-soft dark:border-white/10 dark:bg-white/5">
        {jobsLoading ? (
          <div className="px-6 py-10 text-center text-sm text-ink-500 dark:text-white/60">
            Loading jobs…
          </div>
        ) : jobs.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="mb-2 text-base font-bold text-navy dark:text-white">
              No jobs yet
            </p>
            <p className="mb-5 text-sm text-ink-500 dark:text-white/60">
              Create your first role to start collecting applications.
            </p>
            <Link
              href="/admin/dashboard/jobs/new"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-red px-5 py-2.5 text-[0.9rem] font-semibold text-white transition-colors hover:bg-brand-red-dark"
            >
              + New job
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[0.9rem]">
              <thead className="bg-ink-100 text-[0.72rem] uppercase tracking-wider text-ink-700 dark:bg-white/5 dark:text-white/60">
                <tr>
                  <th className="px-5 py-3 font-semibold">Title</th>
                  <th className="px-5 py-3 font-semibold">Department</th>
                  <th className="px-5 py-3 font-semibold">Location</th>
                  <th className="px-5 py-3 font-semibold">Type</th>
                  <th className="px-5 py-3 font-semibold">Applicants</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200 dark:divide-white/10">
                {jobs.map((job) => {
                  const count = applicantCounts.get(job.id) ?? 0;
                  return (
                    <tr key={job.id} className="text-navy dark:text-white/90">
                      <td className="px-5 py-3 font-semibold">{job.title}</td>
                      <td className="px-5 py-3">{job.department}</td>
                      <td className="px-5 py-3">{jobCityCountry(job.location)}</td>
                      <td className="px-5 py-3">{job.type}</td>
                      <td className="px-5 py-3">
                        <Link
                          href={`/admin/dashboard/jobs/${job.id}/applicants`}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.78rem] font-semibold transition-colors ${
                            count > 0
                              ? "bg-brand-red/10 text-brand-red hover:bg-brand-red/15 dark:bg-brand-red/20 dark:text-brand-red-soft"
                              : "bg-ink-100 text-ink-700 hover:bg-ink-200 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/15"
                          }`}
                        >
                          {count}
                          <span className="text-[0.7rem] font-medium opacity-80">
                            view
                          </span>
                        </Link>
                      </td>
                      <td className="px-5 py-3">
                        <button
                          type="button"
                          onClick={() => onToggleActive(job)}
                          className={`rounded-full px-2.5 py-1 text-[0.72rem] font-semibold ${
                            job.active
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                              : "bg-ink-200 text-ink-700 dark:bg-white/10 dark:text-white/70"
                          }`}
                        >
                          {job.active ? "Published" : "Draft"}
                        </button>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="inline-flex gap-2">
                          <Link
                            href={`/admin/dashboard/jobs/${job.id}/edit`}
                            className="rounded-md border border-ink-200 px-3 py-1.5 text-[0.78rem] font-semibold text-ink-700 transition-colors hover:bg-ink-100 dark:border-white/15 dark:text-white/80 dark:hover:bg-white/5"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => onDelete(job)}
                            className="rounded-md border border-brand-red/40 px-3 py-1.5 text-[0.78rem] font-semibold text-brand-red transition-colors hover:bg-brand-red hover:text-white dark:text-brand-red-soft"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-card-lg border border-ink-200 bg-white px-5 py-4 shadow-soft dark:border-white/10 dark:bg-white/5">
      <div className="text-[0.72rem] font-bold uppercase tracking-[0.13em] text-ink-500 dark:text-white/55">
        {label}
      </div>
      <div className="mt-1 text-2xl font-extrabold text-navy dark:text-white">
        {value}
      </div>
    </div>
  );
}
