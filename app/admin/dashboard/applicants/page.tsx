"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import AdminShell from "../../components/AdminShell";
import AuthGuard from "../../components/AuthGuard";
import {
  Application,
  subscribeToAllApplications,
} from "@/lib/firebase/applications";
import { Job } from "@/lib/firebase/types";
import { subscribeToAllJobs } from "@/lib/firebase/jobs";
import {
  TaxonomyItem,
  subscribeToAllTaxonomies,
} from "@/lib/firebase/taxonomies";

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

export default function AllApplicantsPage() {
  return (
    <AuthGuard>
      <Inner />
    </AuthGuard>
  );
}

function Inner() {
  const router = useRouter();
  const [apps, setApps] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobFilter, setJobFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [taxonomies, setTaxonomies] = useState<TaxonomyItem[]>([]);

  useEffect(() => {
    const unsub = subscribeToAllApplications((next) => {
      setApps(next);
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = subscribeToAllJobs(setJobs);
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = subscribeToAllTaxonomies(setTaxonomies);
    return unsub;
  }, []);

  const jobsById = useMemo(() => {
    const map = new Map<string, Job>();
    for (const j of jobs) map.set(j.id, j);
    return map;
  }, [jobs]);

  const taxonomyOptions = (kind: TaxonomyItem["kind"]) =>
    taxonomies.filter((t) => t.kind === kind && t.active).map((t) => t.name);

  const unionSorted = (...lists: string[][]) =>
    Array.from(new Set(lists.flat().filter(Boolean))).sort((a, b) =>
      a.localeCompare(b),
    );

  const departmentOptions = useMemo(
    () =>
      unionSorted(
        taxonomyOptions("department"),
        jobs.map((j) => j.department),
      ),
    [jobs, taxonomies],
  );
  const locationOptions = useMemo(
    () =>
      unionSorted(
        taxonomyOptions("location"),
        jobs.map((j) => j.location),
      ),
    [jobs, taxonomies],
  );
  const typeOptions = useMemo(
    () =>
      unionSorted(
        taxonomyOptions("employmentType"),
        jobs.map((j) => j.type),
      ),
    [jobs, taxonomies],
  );

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return apps.filter((a) => {
      if (jobFilter !== "all" && a.jobId !== jobFilter) return false;
      const job = jobsById.get(a.jobId);
      const dept = a.jobDepartment || job?.department || "";
      const loc = job?.location ?? "";
      const type = job?.type ?? "";
      if (departmentFilter !== "all" && dept !== departmentFilter) return false;
      if (locationFilter !== "all" && loc !== locationFilter) return false;
      if (typeFilter !== "all" && type !== typeFilter) return false;
      if (!q) return true;
      return [
        a.fullName,
        a.email,
        a.jobTitle,
        a.currentCompany,
        a.currentTitle,
        dept,
        loc,
        a.city,
        a.country,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [
    apps,
    jobFilter,
    departmentFilter,
    locationFilter,
    typeFilter,
    search,
    jobsById,
  ]);

  const filtersActive =
    jobFilter !== "all" ||
    departmentFilter !== "all" ||
    locationFilter !== "all" ||
    typeFilter !== "all" ||
    search.trim() !== "";

  const resetFilters = () => {
    setJobFilter("all");
    setDepartmentFilter("all");
    setLocationFilter("all");
    setTypeFilter("all");
    setSearch("");
  };

  return (
    <AdminShell
      eyebrow="Admin · Applicants"
      title="All applicants"
      description={`${apps.length} application${apps.length === 1 ? "" : "s"} across ${jobs.length} role${jobs.length === 1 ? "" : "s"}.`}
    >
      <div className="mb-5 flex flex-wrap items-end gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, role…"
          className="w-full max-w-[360px] flex-1 rounded-lg border-[1.5px] border-ink-200 bg-white px-3.5 py-2.5 text-[0.9rem] text-navy outline-none transition-all duration-300 focus:border-brand-red focus:shadow-[0_0_0_3px_rgba(179,9,32,0.1)] dark:border-white/15 dark:bg-white/5 dark:text-white dark:focus:border-brand-red-soft"
        />
        <select
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
          aria-label="Filter by role"
          className="rounded-lg border-[1.5px] border-ink-200 bg-white px-3.5 py-2.5 text-[0.9rem] font-medium text-navy outline-none transition-all duration-300 focus:border-brand-red focus:shadow-[0_0_0_3px_rgba(179,9,32,0.1)] dark:border-white/15 dark:bg-white/5 dark:text-white dark:focus:border-brand-red-soft"
        >
          <option value="all">All roles</option>
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>
              {j.title}
            </option>
          ))}
        </select>
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          aria-label="Filter by department"
          className="rounded-lg border-[1.5px] border-ink-200 bg-white px-3.5 py-2.5 text-[0.9rem] font-medium text-navy outline-none transition-all duration-300 focus:border-brand-red focus:shadow-[0_0_0_3px_rgba(179,9,32,0.1)] dark:border-white/15 dark:bg-white/5 dark:text-white dark:focus:border-brand-red-soft"
        >
          <option value="all">All departments</option>
          {departmentOptions.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          aria-label="Filter by location"
          className="rounded-lg border-[1.5px] border-ink-200 bg-white px-3.5 py-2.5 text-[0.9rem] font-medium text-navy outline-none transition-all duration-300 focus:border-brand-red focus:shadow-[0_0_0_3px_rgba(179,9,32,0.1)] dark:border-white/15 dark:bg-white/5 dark:text-white dark:focus:border-brand-red-soft"
        >
          <option value="all">All locations</option>
          {locationOptions.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          aria-label="Filter by employment type"
          className="rounded-lg border-[1.5px] border-ink-200 bg-white px-3.5 py-2.5 text-[0.9rem] font-medium text-navy outline-none transition-all duration-300 focus:border-brand-red focus:shadow-[0_0_0_3px_rgba(179,9,32,0.1)] dark:border-white/15 dark:bg-white/5 dark:text-white dark:focus:border-brand-red-soft"
        >
          <option value="all">All types</option>
          {typeOptions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {filtersActive && (
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-[0.82rem] font-semibold text-ink-700 transition-colors hover:bg-ink-100 dark:border-white/15 dark:bg-transparent dark:text-white/80 dark:hover:bg-white/5"
          >
            Reset
          </button>
        )}
        <span className="ml-auto text-[0.82rem] text-ink-500 dark:text-white/55">
          {visible.length} of {apps.length}
        </span>
      </div>

      <div className="overflow-hidden rounded-card-lg border border-ink-200 bg-white shadow-soft dark:border-white/10 dark:bg-white/5">
        {loading ? (
          <div className="px-6 py-10 text-center text-sm text-ink-500 dark:text-white/60">
            Loading applicants…
          </div>
        ) : visible.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="mb-1 text-base font-bold text-navy dark:text-white">
              {apps.length === 0 ? "No applicants yet" : "No matches"}
            </p>
            <p className="text-sm text-ink-500 dark:text-white/60">
              {apps.length === 0
                ? "Submitted applications will appear here in real time."
                : "Try a different search or role filter."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[0.9rem]">
              <thead className="bg-ink-100 text-[0.72rem] uppercase tracking-wider text-ink-700 dark:bg-white/5 dark:text-white/60">
                <tr>
                  <th className="px-5 py-3 font-semibold">Candidate</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3 font-semibold">Email</th>
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
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/dashboard/jobs/${a.jobId}/applicants`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-medium text-brand-red hover:underline dark:text-brand-red-soft"
                      >
                        {a.jobTitle}
                      </Link>
                      <div className="text-[0.78rem] text-ink-500 dark:text-white/55">
                        {a.jobDepartment}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <a
                        href={`mailto:${a.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:underline"
                      >
                        {a.email}
                      </a>
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
