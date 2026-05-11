"use client";

import Link from "next/link";
import AdminShell from "../../../components/AdminShell";
import AuthGuard from "../../../components/AuthGuard";
import JobForm from "../../JobForm";

export default function NewJobPage() {
  return (
    <AuthGuard>
      <AdminShell
        eyebrow="Admin · Job Postings"
        title="Create a new job"
        description="Fill in the role details. You can save it as a draft and publish later."
        actions={
          <Link
            href="/admin/dashboard"
            className="rounded-lg border border-ink-200 bg-white px-4 py-2 text-[0.85rem] font-semibold text-ink-700 transition-colors hover:bg-ink-100 dark:border-white/15 dark:bg-transparent dark:text-white/80 dark:hover:bg-white/5"
          >
            ← Back to jobs
          </Link>
        }
      >
        <JobForm />
      </AdminShell>
    </AuthGuard>
  );
}
