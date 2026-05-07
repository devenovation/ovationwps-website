"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  ArrowRightIcon,
  CAREERS_GALLERY,
  CAREERS_HERO_IMAGE,
  CAREERS_HERO_LOCATIONS,
  CAREERS_LIFE,
  CAREERS_TESTIMONIAL,
} from "../constants";
import { listActiveJobs } from "@/lib/firebase/jobs";
import { Job } from "@/lib/firebase/types";

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState<string>("All");
  const [office, setOffice] = useState<string>("All");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await listActiveJobs();
        if (!cancelled) setJobs(data);
      } catch (err) {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Could not load openings.",
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const departments = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => j.department && set.add(j.department));
    return ["All", ...Array.from(set).sort()];
  }, [jobs]);

  const offices = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => j.location && set.add(j.location));
    return ["All", ...Array.from(set).sort()];
  }, [jobs]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return jobs.filter((j) => {
      if (department !== "All" && j.department !== department) return false;
      if (office !== "All" && j.location !== office) return false;
      if (!q) return true;
      const haystack = [
        j.title,
        j.department,
        j.location,
        j.type,
        j.description,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [jobs, search, department, office]);

  return (
    <>
      <Navbar />
      <main className="bg-white dark:bg-navy-deep">
        <CareersHero />
        <CareersSectionNav />
        <CareersOpenings
          loading={loading}
          error={error}
          jobs={jobs}
          visible={visible}
          departments={departments}
          offices={offices}
          search={search}
          setSearch={setSearch}
          department={department}
          setDepartment={setDepartment}
          office={office}
          setOffice={setOffice}
        />
        <CareersLife />
        <CareersGallery />
        <CareersTestimonial />
        <CareersCTA />
      </main>
      <Footer />
    </>
  );
}

function CareersHero() {
  return (
    <section className="relative overflow-hidden bg-white pt-[140px] pb-24 max-md:pt-[112px] max-md:pb-16 dark:bg-navy-deep">
      <div className="mx-auto w-full max-w-[1200px] px-7">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div>
            <span className="mb-5 inline-block text-[0.72rem] font-bold uppercase tracking-[0.18em] text-brand-red dark:text-brand-red-soft">
              Careers at Ovation
            </span>
            <h1 className="text-[clamp(2.4rem,5.5vw,4.4rem)] font-black leading-[1.04] tracking-[-0.035em] text-navy dark:text-white">
              Join the
              <br />
              Ovation team
            </h1>
            <p className="mt-7 max-w-[520px] text-[1.1rem] leading-[1.7] text-ink-500 dark:text-white/65">
              We are a globally distributed team of engineers, recruiters,
              dispatchers, and operators — mobilising 52,000+ technicians across
              44 countries from offices in Hyderabad, Plano, and everywhere in
              between.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
              {CAREERS_HERO_LOCATIONS.map((loc) => (
                <div
                  key={loc}
                  className="flex items-center gap-2 text-[0.85rem] font-medium text-ink-700 dark:text-white/70"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
                  {loc}
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href="#openings"
                className="inline-flex items-center gap-2 rounded-full bg-brand-red px-7 py-3.5 text-[0.95rem] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-red-dark hover:shadow-[0_10px_28px_rgba(179,9,32,0.35)]"
              >
                Browse open roles
                {ArrowRightIcon}
              </a>
              <a
                href="#life"
                className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-6 py-3.5 text-[0.95rem] font-semibold text-navy transition-colors hover:bg-ink-100 dark:border-white/15 dark:bg-transparent dark:text-white dark:hover:bg-white/5"
              >
                Life at Ovation
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-brand-red/15 blur-2xl dark:bg-brand-red/25" />
            <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-navy/10 blur-2xl dark:bg-white/10" />
            <div className="relative overflow-hidden rounded-[28px] shadow-[0_30px_80px_rgba(15,30,60,0.18)] ring-1 ring-black/5 dark:shadow-[0_30px_80px_rgba(0,0,0,0.55)] dark:ring-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={CAREERS_HERO_IMAGE}
                alt="Ovation team collaborating"
                className="h-full w-full object-cover"
                loading="eager"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-navy/35 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CareersSectionNav() {
  const tabs = [
    { id: "openings", label: "Open positions" },
    { id: "life", label: "Life at Ovation" },
    { id: "gallery", label: "Moments" },
    { id: "testimonial", label: "Testimonials" },
  ];
  const [active, setActive] = useState<string>("openings");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    tabs.forEach((t) => {
      const el = document.getElementById(t.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="sticky top-[64px] z-30 border-y border-ink-200 bg-white/85 backdrop-blur-md dark:border-white/10 dark:bg-navy-deep/85">
      <nav className="mx-auto flex max-w-[1200px] gap-1 overflow-x-auto px-7 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((t) => (
          <a
            key={t.id}
            href={`#${t.id}`}
            className={`relative whitespace-nowrap px-4 py-4 text-[0.85rem] font-semibold transition-colors ${
              active === t.id
                ? "text-navy dark:text-white"
                : "text-ink-500 hover:text-navy dark:text-white/55 dark:hover:text-white"
            }`}
          >
            {t.label}
            <span
              className={`absolute inset-x-3 bottom-0 h-[2px] origin-center bg-brand-red transition-transform duration-300 ${
                active === t.id ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </a>
        ))}
      </nav>
    </div>
  );
}

function CareersLife() {
  return (
    <section
      id="life"
      className="relative overflow-hidden bg-white py-[110px] max-md:py-16 dark:bg-navy-deep"
    >
      <div className="mx-auto max-w-[1240px] px-7">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
          <div className="lg:sticky lg:top-[140px] lg:h-fit">
            <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#3b1d6e] via-[#1f1452] to-[#0a0a23] p-10 min-h-[420px] lg:min-h-[520px] shadow-[0_30px_80px_rgba(15,15,40,0.35)]">
              <div className="absolute -right-20 -top-20 h-[260px] w-[260px] rounded-full bg-brand-red/30 blur-3xl" />
              <div className="absolute -bottom-24 -left-12 h-[260px] w-[260px] rounded-full bg-violet-500/30 blur-3xl" />
              <div className="relative flex h-full flex-col justify-between gap-12">
                <span className="inline-block text-[0.72rem] font-bold uppercase tracking-[0.22em] text-white/60">
                  Life at Ovation
                </span>
                <h2 className="text-[clamp(2.5rem,5vw,4.2rem)] font-black leading-[0.98] tracking-[-0.035em] text-white">
                  We live
                  <br />
                  our values
                </h2>
                <p className="max-w-[360px] text-[0.98rem] leading-[1.7] text-white/70">
                  The rituals, programs, and commitments that show up in every
                  Ovation teammate&rsquo;s year — from volunteer hours to global
                  meetups.
                </p>
              </div>
            </div>
          </div>
          <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {CAREERS_LIFE.map((item) => (
              <div key={item.step} className="flex flex-col gap-3">
                <span className="text-[1rem] font-bold tracking-[0.04em] text-brand-red dark:text-brand-red-soft">
                  {item.step}
                </span>
                <h3 className="text-[1.4rem] font-extrabold leading-[1.25] tracking-[-0.015em] text-navy dark:text-white">
                  {item.title}
                </h3>
                <p className="text-[0.95rem] leading-[1.7] text-ink-500 dark:text-white/65">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CareersGallery() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const slides = CAREERS_GALLERY;

  const scrollTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(slides.length - 1, i));
    const slide = track.children[clamped] as HTMLElement | undefined;
    if (slide) {
      track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: "smooth" });
    }
    setIndex(clamped);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const children = Array.from(track.children) as HTMLElement[];
        const center = track.scrollLeft + track.clientWidth / 2;
        let nearest = 0;
        let best = Infinity;
        children.forEach((c, i) => {
          const mid = c.offsetLeft + c.offsetWidth / 2;
          const d = Math.abs(mid - center);
          if (d < best) {
            best = d;
            nearest = i;
          }
        });
        setIndex(nearest);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      const next = (index + 1) % slides.length;
      scrollTo(next);
    }, 5000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, slides.length]);

  return (
    <section
      id="gallery"
      className="relative overflow-hidden bg-ink-100 py-[110px] max-md:py-20 dark:bg-navy"
    >
      <div className="mx-auto mb-12 flex max-w-[1240px] flex-wrap items-end justify-between gap-6 px-7">
        <div>
          <span className="mb-3 inline-block text-[0.72rem] font-bold uppercase tracking-[0.18em] text-brand-red dark:text-brand-red-soft">
            Moments
          </span>
          <h2 className="text-[clamp(1.8rem,3.5vw,2.6rem)] font-extrabold leading-[1.18] tracking-[-0.025em] text-navy dark:text-white">
            A look inside the team
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => scrollTo(index - 1)}
            disabled={index === 0}
            className="grid h-11 w-11 place-items-center rounded-full border border-ink-200 bg-white text-navy transition-colors hover:bg-ink-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => scrollTo(index + 1)}
            disabled={index === slides.length - 1}
            className="grid h-11 w-11 place-items-center rounded-full border border-ink-200 bg-white text-navy transition-colors hover:bg-ink-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 md:gap-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((img, i) => (
          <div
            key={img.src}
            className={`group relative h-[460px] w-[88%] flex-none snap-center overflow-hidden rounded-[24px] ring-1 ring-black/5 sm:h-[560px] sm:w-[78%] md:h-[640px] md:w-[72%] lg:h-[700px] lg:w-[68%] dark:ring-white/10 ${
              i === 0 ? "ml-7 md:ml-12" : ""
            } ${i === slides.length - 1 ? "mr-7 md:mr-12" : ""}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent p-6">
              <p className="text-[0.95rem] font-medium text-white/90">{img.alt}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => scrollTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === i
                ? "w-8 bg-brand-red"
                : "w-1.5 bg-ink-300 hover:bg-ink-500 dark:bg-white/20 dark:hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

function CareersTestimonial() {
  const t = CAREERS_TESTIMONIAL;
  return (
    <section
      id="testimonial"
      className="relative overflow-hidden bg-navy py-[110px] max-md:py-20 dark:bg-navy"
    >
      <div className="bg-stripe-w pointer-events-none absolute inset-0 opacity-25" />
      <div className="absolute -left-40 top-1/2 h-[380px] w-[380px] -translate-y-1/2 rounded-full bg-brand-red/15 blur-3xl" />
      <div className="relative z-[1] mx-auto max-w-[1100px] px-7">
        <div className="grid items-center gap-12 md:grid-cols-[260px_1fr] md:gap-16">
          <div className="relative mx-auto md:mx-0">
            <div className="absolute -inset-3 rounded-[28px] bg-gradient-to-br from-brand-red/40 to-transparent blur-md" />
            <div className="relative h-[240px] w-[240px] overflow-hidden rounded-[24px] ring-1 ring-white/15">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={t.photo}
                alt={t.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
          <div>
            <svg
              aria-hidden="true"
              viewBox="0 0 48 36"
              className="mb-6 h-9 w-12 text-brand-red"
              fill="currentColor"
            >
              <path d="M14 0C6.3 0 0 6.3 0 14v22h18V18H8c0-3.3 2.7-6 6-6V0zm26 0c-7.7 0-14 6.3-14 14v22h18V18H34c0-3.3 2.7-6 6-6V0z" />
            </svg>
            <p className="text-[clamp(1.3rem,2.4vw,1.85rem)] font-semibold leading-[1.4] tracking-[-0.015em] text-white">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="mt-8 flex items-center gap-3">
              <div className="h-10 w-px bg-brand-red" />
              <div>
                <div className="text-[0.95rem] font-bold text-white">{t.name}</div>
                <div className="text-[0.82rem] text-white/60">{t.role}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CareersOpenings({
  loading,
  error,
  jobs,
  visible,
  departments,
  offices,
  search,
  setSearch,
  department,
  setDepartment,
  office,
  setOffice,
}: {
  loading: boolean;
  error: string | null;
  jobs: Job[];
  visible: Job[];
  departments: string[];
  offices: string[];
  search: string;
  setSearch: (v: string) => void;
  department: string;
  setDepartment: (v: string) => void;
  office: string;
  setOffice: (v: string) => void;
}) {
  const hasFilters =
    search.trim().length > 0 || department !== "All" || office !== "All";
  const reset = () => {
    setSearch("");
    setDepartment("All");
    setOffice("All");
  };

  return (
    <section
      id="openings"
      className="relative overflow-hidden bg-white py-[110px] max-md:py-20 dark:bg-navy-deep"
    >
      <div className="relative mx-auto max-w-[1100px] px-7">
        <div className="mx-auto mb-12 max-w-[640px] text-center">
          <span className="mb-3 inline-block text-[0.72rem] font-bold uppercase tracking-[0.18em] text-brand-red dark:text-brand-red-soft">
            Open Roles
          </span>
          <h2 className="text-[clamp(1.9rem,3.8vw,2.8rem)] font-extrabold leading-[1.15] tracking-[-0.025em] text-navy dark:text-white">
            Find your seat at the table
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-[1.02rem] leading-[1.75] text-ink-500 dark:text-white/65">
            Search by keyword, or filter by department and office to find the
            right team.
          </p>
        </div>

        {loading ? (
          <div className="rounded-[20px] border border-ink-200 bg-ink-100/60 px-6 py-16 text-center text-sm text-ink-500 dark:border-white/10 dark:bg-white/5 dark:text-white/60">
            Loading openings…
          </div>
        ) : error ? (
          <div className="rounded-[20px] border border-brand-red/30 bg-brand-red/10 px-5 py-6 text-center text-[0.9rem] text-brand-red dark:text-brand-red-soft">
            {error}
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-[20px] border border-ink-200 bg-ink-100/60 px-6 py-16 text-center dark:border-white/10 dark:bg-white/5">
            <h3 className="mb-2 text-xl font-extrabold text-navy dark:text-white">
              No open roles right now
            </h3>
            <p className="text-[0.9rem] text-ink-500 dark:text-white/60">
              Check back soon — or send your resume to{" "}
              <a
                href="mailto:careers@ovationwps.com"
                className="font-semibold text-brand-red hover:underline dark:text-brand-red-soft"
              >
                careers@ovationwps.com
              </a>
              .
            </p>
          </div>
        ) : (
          <>
            <div className="mb-7 grid gap-3 md:grid-cols-[2fr_1fr_1fr]">
              <div className="relative">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-500 dark:text-white/55"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title, keyword, or skill"
                  aria-label="Search open roles"
                  className="w-full rounded-full border-[1.5px] border-ink-200 bg-white py-3 pl-11 pr-10 text-[0.92rem] text-navy outline-none transition-all duration-300 focus:border-brand-red focus:shadow-[0_0_0_3px_rgba(179,9,32,0.1)] dark:border-white/15 dark:bg-white/5 dark:text-white dark:focus:border-brand-red-soft dark:focus:shadow-[0_0_0_3px_rgba(232,74,95,0.18)]"
                />
                {search && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-ink-500 transition-colors hover:bg-ink-100 dark:text-white/55 dark:hover:bg-white/10"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <FilterSelect
                value={department}
                onChange={setDepartment}
                options={departments}
                label="Department"
              />
              <FilterSelect
                value={office}
                onChange={setOffice}
                options={offices}
                label="Office"
              />
            </div>

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[0.85rem] text-ink-500 dark:text-white/60">
                {visible.length === 0
                  ? "No matching roles"
                  : `Showing ${visible.length} of ${jobs.length} role${jobs.length === 1 ? "" : "s"}`}
              </p>
              {hasFilters && (
                <button
                  type="button"
                  onClick={reset}
                  className="text-[0.82rem] font-semibold text-brand-red transition-colors hover:underline dark:text-brand-red-soft"
                >
                  Clear filters
                </button>
              )}
            </div>

            {visible.length === 0 ? (
              <div className="rounded-[20px] border border-ink-200 bg-ink-100/60 px-6 py-12 text-center dark:border-white/10 dark:bg-white/5">
                <h3 className="mb-2 text-lg font-extrabold text-navy dark:text-white">
                  Nothing matches those filters
                </h3>
                <p className="text-[0.88rem] text-ink-500 dark:text-white/60">
                  Try a different keyword or{" "}
                  <button
                    type="button"
                    onClick={reset}
                    className="font-semibold text-brand-red hover:underline dark:text-brand-red-soft"
                  >
                    clear filters
                  </button>
                  .
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-[20px] border border-ink-200 bg-white dark:border-white/10 dark:bg-white/[0.03]">
                {visible.map((job, i) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    divider={i < visible.length - 1}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  label: string;
}) {
  return (
    <div className="relative">
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-full border-[1.5px] border-ink-200 bg-white py-3 pl-4 pr-10 text-[0.92rem] font-medium text-navy outline-none transition-all duration-300 focus:border-brand-red focus:shadow-[0_0_0_3px_rgba(179,9,32,0.1)] dark:border-white/15 dark:bg-white/5 dark:text-white dark:focus:border-brand-red-soft dark:focus:shadow-[0_0_0_3px_rgba(232,74,95,0.18)]"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o === "All" ? `All ${label.toLowerCase()}s` : o}
          </option>
        ))}
      </select>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500 dark:text-white/55"
        aria-hidden="true"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  );
}

function CareersCTA() {
  return (
    <section className="relative overflow-hidden bg-ink-100 py-[110px] max-md:py-20 dark:bg-navy">
      <div className="bg-stripe-r pointer-events-none absolute inset-0 opacity-25 dark:hidden" />
      <div className="relative z-[1] mx-auto max-w-[820px] px-7 text-center">
        <span className="mb-3 inline-block text-[0.72rem] font-bold uppercase tracking-[0.18em] text-brand-red dark:text-brand-red-soft">
          Don&rsquo;t see a fit?
        </span>
        <h2 className="mb-4 text-[clamp(1.9rem,3.5vw,2.7rem)] font-extrabold leading-[1.18] tracking-[-0.025em] text-navy dark:text-white">
          We&rsquo;re always meeting great people
        </h2>
        <p className="mx-auto mb-9 max-w-[560px] text-[1.02rem] leading-[1.75] text-ink-500 dark:text-white/65">
          Send your resume and a short note about what you&rsquo;re looking for.
          We&rsquo;ll keep you in mind as new roles open up.
        </p>
        <a
          href="mailto:careers@ovationwps.com?subject=General%20Interest"
          className="inline-flex items-center gap-2 rounded-full bg-brand-red px-7 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-red-dark hover:shadow-[0_10px_28px_rgba(179,9,32,0.35)]"
        >
          Email careers@ovationwps.com
          {ArrowRightIcon}
        </a>
      </div>
    </section>
  );
}

function JobCard({ job, divider }: { job: Job; divider: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <article
      className={`group relative px-6 py-6 transition-colors hover:bg-ink-100/60 dark:hover:bg-white/[0.04] ${
        divider ? "border-b border-ink-200 dark:border-white/10" : ""
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg font-extrabold tracking-[-0.01em] text-navy dark:text-white">
            {job.title}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-brand-red-light px-2.5 py-1 text-[0.7rem] font-semibold tracking-[0.04em] text-brand-red dark:bg-brand-red/25 dark:text-brand-red-soft">
              {job.department}
            </span>
            <span className="rounded-full bg-ink-100 px-2.5 py-1 text-[0.7rem] font-semibold tracking-[0.04em] text-ink-700 dark:bg-white/10 dark:text-white/70">
              {job.location}
            </span>
            <span className="rounded-full bg-ink-100 px-2.5 py-1 text-[0.7rem] font-semibold tracking-[0.04em] text-ink-700 dark:bg-white/10 dark:text-white/70">
              {job.type}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-full border border-ink-200 bg-white px-4 py-2 text-[0.82rem] font-semibold text-ink-700 transition-colors hover:bg-ink-100 dark:border-white/15 dark:bg-transparent dark:text-white/80 dark:hover:bg-white/5"
          >
            {open ? "Hide" : "Details"}
          </button>
          <Link
            href={`/careers/apply/${job.id}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-red px-4 py-2 text-[0.82rem] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-red-dark hover:shadow-[0_8px_24px_rgba(179,9,32,0.35)]"
          >
            Apply
            {ArrowRightIcon}
          </Link>
        </div>
      </div>

      {open && (
        <div className="mt-5 border-t border-ink-200 pt-5 dark:border-white/10">
          <p className="text-[0.92rem] leading-[1.7] text-ink-700 dark:text-white/75">
            {job.description}
          </p>
          {job.responsibilities.length > 0 && (
            <DetailSection title="What you’ll do" items={job.responsibilities} />
          )}
          {job.requirements.length > 0 && (
            <DetailSection title="What we’re looking for" items={job.requirements} />
          )}
        </div>
      )}
    </article>
  );
}

function DetailSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-5">
      <h4 className="mb-2 text-[0.78rem] font-bold uppercase tracking-[0.13em] text-brand-red dark:text-brand-red-soft">
        {title}
      </h4>
      <ul className="list-disc space-y-1 pl-5 text-[0.9rem] leading-[1.7] text-ink-700 dark:text-white/75">
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </div>
  );
}
