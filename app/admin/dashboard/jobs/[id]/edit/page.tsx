"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AdminShell from "../../../../components/AdminShell";
import AuthGuard from "../../../../components/AuthGuard";
import JobForm from "../../../JobForm";
import { getJob } from "@/lib/firebase/jobs";
import { Job } from "@/lib/firebase/types";

export default function EditJobPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const j = await getJob(id);
        if (!cancelled) {
          if (!j) setError("This job no longer exists.");
          else setJob(j);
        }
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Could not load job.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <AuthGuard>
      <AdminShell
        eyebrow="Admin · Job Postings"
        title={job ? `Edit · ${job.title}` : "Edit job"}
        description={
          job ? `${job.department} · ${job.location}` : "Update role details."
        }
        actions={
          <div className="flex flex-wrap gap-2">
            {job && (
              <Link
                href={`/admin/dashboard/jobs/${job.id}/applicants`}
                className="rounded-lg border border-ink-200 bg-white px-4 py-2 text-[0.85rem] font-semibold text-ink-700 transition-colors hover:bg-ink-100 dark:border-white/15 dark:bg-transparent dark:text-white/80 dark:hover:bg-white/5"
              >
                View applicants
              </Link>
            )}
            <Link
              href="/admin/dashboard"
              className="rounded-lg border border-ink-200 bg-white px-4 py-2 text-[0.85rem] font-semibold text-ink-700 transition-colors hover:bg-ink-100 dark:border-white/15 dark:bg-transparent dark:text-white/80 dark:hover:bg-white/5"
            >
              ← Back to jobs
            </Link>
          </div>
        }
      >
        {loading ? (
          <div className="rounded-card-lg border border-ink-200 bg-white px-6 py-10 text-center text-sm text-ink-500 shadow-soft dark:border-white/10 dark:bg-white/5 dark:text-white/60">
            Loading job…
          </div>
        ) : error ? (
          <div className="rounded-card-lg border border-brand-red/30 bg-brand-red/10 px-5 py-6 text-center text-[0.9rem] text-brand-red dark:text-brand-red-soft">
            {error}
          </div>
        ) : (
          <JobForm initial={job} />
        )}
      </AdminShell>
    </AuthGuard>
  );
}
