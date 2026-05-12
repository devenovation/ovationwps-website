"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import AdminShell from "../../../../components/AdminShell";
import AuthGuard from "../../../../components/AuthGuard";
import { getJob } from "@/lib/firebase/jobs";
import { Job, jobCityCountry } from "@/lib/firebase/types";
import {
  Application,
  subscribeToApplicationsForJob,
} from "@/lib/firebase/applications";

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
  rejected:
    "bg-ink-200 text-ink-700 dark:bg-white/10 dark:text-white/65",
};

export default function JobApplicantsPage() {
  return (
    <AuthGuard>
      <Inner />
    </AuthGuard>
  );
}

function Inner() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id ?? "";
  const [job, setJob] = useState<Job | null>(null);
  const [jobError, setJobError] = useState<string | null>(null);
  const [apps, setApps] = useState<Application[]>([]);
  const [appsLoading, setAppsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const j = await getJob(id);
        if (!cancelled) {
          if (!j) setJobError("This job no longer exists.");
          else setJob(j);
        }
      } catch (err) {
        if (!cancelled)
          setJobError(
            err instanceof Error ? err.message : "Could not load job.",
          );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const unsub = subscribeToApplicationsForJob(id, (next) => {
      setApps(next);
      setAppsLoading(false);
    });
    return unsub;
  }, [id]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return apps;
    return apps.filter((a) =>
      [a.fullName, a.email, a.currentCompany, a.currentTitle, a.city, a.country]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [apps, search]);

  return (
    <AdminShell
      eyebrow="Admin · Applicants"
      title={job ? `${job.title}` : "Applicants"}
      description={
        job
          ? `${apps.length} application${apps.length === 1 ? "" : "s"} · ${job.department} · ${jobCityCountry(job.location)}`
          : "Applicants for this role"
      }
      actions={
        <div className="flex flex-wrap gap-2">
          {job && (
            <Link
              href={`/admin/dashboard/jobs/${job.id}/edit`}
              className="rounded-lg border border-ink-200 bg-white px-4 py-2 text-[0.85rem] font-semibold text-ink-700 transition-colors hover:bg-ink-100 dark:border-white/15 dark:bg-transparent dark:text-white/80 dark:hover:bg-white/5"
            >
              Edit job
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
      {jobError && (
        <div className="mb-5 rounded-card-lg border border-brand-red/30 bg-brand-red/10 px-5 py-4 text-[0.9rem] text-brand-red dark:text-brand-red-soft">
          {jobError}
        </div>
      )}

      <div className="mb-5">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, company…"
          className="w-full max-w-[420px] rounded-lg border-[1.5px] border-ink-200 bg-white px-3.5 py-2.5 text-[0.9rem] text-navy outline-none transition-all duration-300 focus:border-brand-red focus:shadow-[0_0_0_3px_rgba(179,9,32,0.1)] dark:border-white/15 dark:bg-white/5 dark:text-white dark:focus:border-brand-red-soft"
        />
      </div>

      <div className="overflow-hidden rounded-card-lg border border-ink-200 bg-white shadow-soft dark:border-white/10 dark:bg-white/5">
        {appsLoading ? (
          <div className="px-6 py-10 text-center text-sm text-ink-500 dark:text-white/60">
            Loading applicants…
          </div>
        ) : apps.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="mb-1 text-base font-bold text-navy dark:text-white">
              No applicants yet
            </p>
            <p className="text-sm text-ink-500 dark:text-white/60">
              When candidates apply for this role, they’ll show up here.
            </p>
          </div>
        ) : visible.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-ink-500 dark:text-white/60">
            No applicants match your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[0.9rem]">
              <thead className="bg-ink-100 text-[0.72rem] uppercase tracking-wider text-ink-700 dark:bg-white/5 dark:text-white/60">
                <tr>
                  <th className="px-5 py-3 font-semibold">Candidate</th>
                  <th className="px-5 py-3 font-semibold">Contact</th>
                  <th className="px-5 py-3 font-semibold">Experience</th>
                  <th className="px-5 py-3 font-semibold">Location</th>
                  <th className="px-5 py-3 font-semibold">Applied</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200 dark:divide-white/10">
                {visible.map((a) => (
                  <tr
                    key={a.id}
                    onClick={() =>
                      router.push(`/admin/dashboard/applicants/${a.id}`)
                    }
                    className="cursor-pointer text-navy transition-colors hover:bg-ink-100/60 dark:text-white/90 dark:hover:bg-white/5"
                  >
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/dashboard/applicants/${a.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-semibold text-navy hover:text-brand-red hover:underline dark:text-white dark:hover:text-brand-red-soft"
                      >
                        {a.fullName}
                      </Link>
                      <div className="text-[0.78rem] text-ink-500 dark:text-white/55">
                        {a.currentTitle || "—"}
                        {a.currentCompany && a.currentTitle ? " · " : ""}
                        {a.currentCompany}
                      </div>
                      {(a.linkedinUrl || a.resumeUrl || a.portfolioUrl) && (
                        <div
                          className="mt-1 flex flex-wrap gap-2 text-[0.75rem]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {a.resumeUrl && (
                            <ExternalLink href={a.resumeUrl} label="Resume" />
                          )}
                          {a.linkedinUrl && (
                            <ExternalLink
                              href={a.linkedinUrl}
                              label="LinkedIn"
                            />
                          )}
                          {a.portfolioUrl && (
                            <ExternalLink
                              href={a.portfolioUrl}
                              label="Portfolio"
                            />
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <a
                        href={`mailto:${a.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-medium text-brand-red hover:underline dark:text-brand-red-soft"
                      >
                        {a.email}
                      </a>
                      <div className="text-[0.78rem] text-ink-500 dark:text-white/55">
                        {a.phone || "—"}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div>{a.yearsExperience} yr</div>
                      <div className="text-[0.78rem] text-ink-500 dark:text-white/55">
                        {a.workAuthorization}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div>{a.city || "—"}</div>
                      <div className="text-[0.78rem] text-ink-500 dark:text-white/55">
                        {a.country}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[0.82rem] text-ink-500 dark:text-white/55">
                      {a.createdAt
                        ? a.createdAt.toDate().toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[0.72rem] font-semibold ${STATUS_CLASS[a.status]}`}
                      >
                        {STATUS_LABEL[a.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}

function ExternalLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="rounded-md border border-ink-200 px-2 py-0.5 font-semibold text-ink-700 transition-colors hover:bg-ink-100 dark:border-white/15 dark:text-white/75 dark:hover:bg-white/5"
    >
      {label} ↗
    </a>
  );
}
