"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import ThemeToggle from "../../components/ThemeToggle";
import { useAuth } from "../../components/AuthProvider";
import { logout } from "@/lib/firebase/auth";
import { useToast } from "../../components/Toast";

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  match: (path: string) => boolean;
}

const NAV: NavItem[] = [
  {
    href: "/admin/dashboard",
    label: "Jobs",
    match: (p) =>
      p === "/admin/dashboard" ||
      (p.startsWith("/admin/dashboard/jobs") && !p.endsWith("/applicants")),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
        <rect x="3" y="6" width="18" height="14" rx="2" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M3 12h18" />
      </svg>
    ),
  },
  {
    href: "/admin/dashboard/applicants",
    label: "Applicants",
    match: (p) => p.includes("/applicants"),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: "/admin/dashboard/blogs",
    label: "Blogs",
    match: (p) => p.startsWith("/admin/dashboard/blogs"),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
        <path d="M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4z" />
        <path d="M8 8h8" />
        <path d="M8 12h8" />
        <path d="M8 16h5" />
      </svg>
    ),
  },
  {
    href: "/admin/dashboard/master-data",
    label: "Master Data",
    match: (p) => p.startsWith("/admin/dashboard/master-data"),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
        <path d="M4 6h16" />
        <path d="M4 12h16" />
        <path d="M4 18h10" />
        <circle cx="19" cy="18" r="2" />
      </svg>
    ),
  },
];

export default function AdminShell({
  children,
  title,
  eyebrow,
  description,
  actions,
}: {
  children: ReactNode;
  title: string;
  eyebrow?: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const { user } = useAuth();
  const toast = useToast();

  const onLogout = async () => {
    await logout();
    toast.info("Signed out", "You have been signed out of the admin portal.");
    router.replace("/admin");
  };

  return (
    <div className="flex min-h-screen flex-col bg-ink-100 dark:bg-navy-deep">
      <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/95 backdrop-blur dark:border-white/10 dark:bg-navy/90">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3"
              aria-label="Ovation Admin Console"
            >
              <Image
                src="/Ovation%20Workplace%20Services.png"
                alt="Ovation Workplace Services"
                width={150}
                height={30}
                priority
                style={{ height: "30px", width: "auto" }}
                className="select-none"
              />
              <span className="hidden h-6 w-px bg-ink-200 dark:bg-white/15 sm:block" />
              <span className="hidden rounded-md bg-brand-red/10 px-2 py-0.5 text-[0.7rem] font-bold uppercase tracking-[0.13em] text-brand-red dark:bg-brand-red/20 dark:text-brand-red-soft sm:inline">
                Admin Console
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {user?.email && (
              <span className="hidden text-[0.82rem] text-ink-500 dark:text-white/60 md:inline">
                {user.email}
              </span>
            )}
            <ThemeToggle />
            <button
              type="button"
              onClick={onLogout}
              className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-[0.82rem] font-semibold text-ink-700 transition-colors hover:bg-ink-100 dark:border-white/15 dark:bg-transparent dark:text-white/80 dark:hover:bg-white/5 sm:px-4"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1280px] flex-1 gap-6 px-4 py-6 sm:px-6 lg:gap-8">
        <aside className="hidden w-[220px] shrink-0 lg:block">
          <nav className="sticky top-[88px] flex flex-col gap-1 rounded-card-lg border border-ink-200 bg-white p-2 shadow-soft dark:border-white/10 dark:bg-white/5">
            {NAV.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[0.88rem] font-semibold transition-colors ${
                    active
                      ? "bg-brand-red/10 text-brand-red dark:bg-brand-red/20 dark:text-brand-red-soft"
                      : "text-ink-700 hover:bg-ink-100 dark:text-white/75 dark:hover:bg-white/5"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4 lg:mb-8">
            <div className="min-w-0">
              {eyebrow && (
                <span className="mb-2 inline-block text-[0.72rem] font-bold uppercase tracking-[0.13em] text-brand-red dark:text-brand-red-soft">
                  {eyebrow}
                </span>
              )}
              <h1 className="text-[clamp(1.5rem,2.4vw,2rem)] font-extrabold tracking-[-0.02em] text-navy dark:text-white">
                {title}
              </h1>
              {description && (
                <p className="mt-1 text-[0.88rem] text-ink-500 dark:text-white/60">
                  {description}
                </p>
              )}
            </div>
            {actions && (
              <div className="flex flex-wrap items-center gap-2">{actions}</div>
            )}
          </div>

          <nav className="mb-5 flex gap-1 overflow-x-auto rounded-lg border border-ink-200 bg-white p-1 shadow-soft dark:border-white/10 dark:bg-white/5 lg:hidden">
            {NAV.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap rounded-md px-3 py-2 text-[0.82rem] font-semibold transition-colors ${
                    active
                      ? "bg-brand-red/10 text-brand-red dark:bg-brand-red/20 dark:text-brand-red-soft"
                      : "text-ink-700 hover:bg-ink-100 dark:text-white/75 dark:hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {children}
        </main>
      </div>
    </div>
  );
}
