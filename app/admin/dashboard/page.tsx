"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../components/AuthProvider";
import { logout } from "@/lib/firebase/auth";
import {
  deleteJob,
  subscribeToAllJobs,
  updateJob,
} from "@/lib/firebase/jobs";
import { Job } from "@/lib/firebase/types";
import JobForm from "./JobForm";
import { useToast } from "../../components/Toast";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const toast = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [editing, setEditing] = useState<Job | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/admin");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToAllJobs((next) => {
      setJobs(next);
      setJobsLoading(false);
    });
    return unsub;
  }, [user]);

  const summary = useMemo(() => {
    const active = jobs.filter((j) => j.active).length;
    return { total: jobs.length, active, draft: jobs.length - active };
  }, [jobs]);

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

  const onLogout = async () => {
    await logout();
    toast.info("Signed out", "You have been signed out of the admin portal.");
    router.replace("/admin");
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-ink-500 dark:text-white/60">
        Loading…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1160px] px-7 py-12">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="mb-2 inline-block text-[0.72rem] font-bold uppercase tracking-[0.13em] text-brand-red dark:text-brand-red-soft">
            Admin · Job Postings
          </span>
          <h1 className="text-[clamp(1.6rem,2.6vw,2.2rem)] font-extrabold tracking-[-0.02em] text-navy dark:text-white">
            HR Dashboard
          </h1>
          <p className="mt-1 text-[0.88rem] text-ink-500 dark:text-white/60">
            Signed in as {user.email}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="rounded-lg bg-brand-red px-5 py-2.5 text-[0.9rem] font-semibold text-white transition-colors hover:bg-brand-red-dark"
          >
            + New job
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg border border-ink-200 bg-white px-5 py-2.5 text-[0.9rem] font-semibold text-ink-700 transition-colors hover:bg-ink-100 dark:border-white/15 dark:bg-transparent dark:text-white/80 dark:hover:bg-white/5"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Total" value={summary.total} />
        <Stat label="Published" value={summary.active} />
        <Stat label="Draft" value={summary.draft} />
      </div>

      <div className="overflow-hidden rounded-card-lg border border-ink-200 bg-white shadow-soft dark:border-white/10 dark:bg-white/5">
        {jobsLoading ? (
          <div className="px-6 py-10 text-center text-sm text-ink-500 dark:text-white/60">
            Loading jobs…
          </div>
        ) : jobs.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-ink-500 dark:text-white/60">
            No jobs yet. Click <span className="font-semibold">New job</span> to create one.
          </div>
        ) : (
          <table className="w-full text-left text-[0.9rem]">
            <thead className="bg-ink-100 text-[0.75rem] uppercase tracking-wider text-ink-700 dark:bg-white/5 dark:text-white/60">
              <tr>
                <th className="px-5 py-3 font-semibold">Title</th>
                <th className="px-5 py-3 font-semibold">Department</th>
                <th className="px-5 py-3 font-semibold">Location</th>
                <th className="px-5 py-3 font-semibold">Type</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-200 dark:divide-white/10">
              {jobs.map((job) => (
                <tr key={job.id} className="text-navy dark:text-white/90">
                  <td className="px-5 py-3 font-semibold">{job.title}</td>
                  <td className="px-5 py-3">{job.department}</td>
                  <td className="px-5 py-3">{job.location}</td>
                  <td className="px-5 py-3">{job.type}</td>
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
                      <button
                        type="button"
                        onClick={() => setEditing(job)}
                        className="rounded-md border border-ink-200 px-3 py-1.5 text-[0.78rem] font-semibold text-ink-700 transition-colors hover:bg-ink-100 dark:border-white/15 dark:text-white/80 dark:hover:bg-white/5"
                      >
                        Edit
                      </button>
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
              ))}
            </tbody>
          </table>
        )}
      </div>

      {(creating || editing) && (
        <JobForm
          initial={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
        />
      )}
    </div>
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
