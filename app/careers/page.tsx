import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  ArrowRightIcon,
  CAREER_OPENINGS,
  CAREER_VALUES,
  CAREER_TESTIMONIAL,
} from "../constants";

export const metadata: Metadata = {
  title: "Careers — Ovation Workplace Services",
  description:
    "Join Ovation Workplace Services. We're a globally distributed team of field engineers, dispatchers, and IT operators delivering enterprise-grade services across 44+ countries.",
};

export default function CareersPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white dark:bg-navy-deep">
        <CareersHero />
        <LifeAtOvation />
        <TeamGallery />
        <WhyWorkWithUs />
        <CurrentOpenings />
      </main>
      <Footer />
    </>
  );
}

function CareersHero() {
  return (
    <section className="relative overflow-hidden bg-white pt-16 dark:bg-navy-deep">
      <div className="bg-stripe-r pointer-events-none absolute inset-0 opacity-30 dark:hidden" />
      <div className="bg-stripe-w pointer-events-none absolute inset-0 opacity-35 hidden dark:block" />
      <div className="absolute bottom-0 left-0 right-0 z-[2] h-[3px] bg-gradient-to-r from-brand-red to-transparent" />
      <div className="relative z-[1] mx-auto max-w-[1160px] px-7 py-[88px] max-md:py-[56px]">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1fr] max-lg:gap-10">
          <div>
            <h1 className="mb-6 text-[clamp(2.4rem,5vw,3.6rem)] font-black leading-[1.08] tracking-[-0.03em] text-navy dark:text-white">
              Join the <span className="text-brand-red">Ovation</span>
              <br />
              team
            </h1>
            <p className="mb-8 max-w-[480px] text-[1.05rem] leading-[1.75] text-ink-500 dark:text-white/70">
              We&rsquo;re a globally distributed team of field engineers, dispatchers, and IT
              operators across 44+ countries. We&rsquo;re looking for driven, hands-on people to
              do the best work of their career with us.
            </p>
            <a
              href="#openings"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-red px-6 py-3 text-[0.92rem] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-red-dark hover:shadow-[0_8px_24px_rgba(179,9,32,0.35)]"
            >
              See open roles
              {ArrowRightIcon}
            </a>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <PhotoTile tone="red" label="Field operations" tall />
            <PhotoTile tone="navy" label="Dispatch hub" />
            <PhotoTile tone="ink" label="Depot services" />
            <PhotoTile tone="red-soft" label="Global delivery" tall />
          </div>
        </div>
      </div>
    </section>
  );
}

function PhotoTile({
  tone,
  label,
  tall = false,
}: {
  tone: "red" | "navy" | "ink" | "red-soft";
  label: string;
  tall?: boolean;
}) {
  const toneMap: Record<string, string> = {
    red: "bg-gradient-to-br from-brand-red to-brand-red-dark",
    navy: "bg-gradient-to-br from-navy to-navy-deep",
    ink: "bg-gradient-to-br from-ink-700 to-navy",
    "red-soft": "bg-gradient-to-br from-brand-red-dark to-navy",
  };
  return (
    <div
      className={`relative overflow-hidden rounded-card ${toneMap[tone]} ${
        tall ? "aspect-[3/4]" : "aspect-[4/3]"
      } shadow-soft`}
    >
      <div className="bg-stripe-w pointer-events-none absolute inset-0 opacity-25" />
      <div className="absolute inset-0 flex items-end p-4">
        <span className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-white/85">
          {label}
        </span>
      </div>
    </div>
  );
}

function LifeAtOvation() {
  const items = CAREER_VALUES.slice(0, 4);
  return (
    <section
      id="life-at-ovation"
      className="relative overflow-hidden bg-white py-[88px] dark:bg-navy-deep"
    >
      <div className="relative z-[1] mx-auto max-w-[1160px] px-7">
        <div className="mb-10">
          <span className="mb-3 inline-block text-[0.72rem] font-bold uppercase tracking-[0.13em] text-brand-red dark:text-brand-red-soft">
            Life at Ovation
          </span>
          <h2 className="text-[clamp(1.8rem,3.5vw,2.5rem)] font-extrabold leading-[1.2] tracking-[-0.02em] text-navy dark:text-white">
            What we&rsquo;re about
          </h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-card-lg bg-gradient-to-br from-brand-red to-brand-red-dark p-10 text-white shadow-floating min-h-[320px] flex items-center">
            <div className="bg-stripe-w pointer-events-none absolute inset-0 opacity-25" />
            <div className="relative">
              <h3 className="text-[clamp(2rem,3.5vw,2.6rem)] font-black leading-[1.05] tracking-[-0.02em]">
                We live
                <br />
                our values
              </h3>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {items.map((v) => (
              <div
                key={v.number}
                className="rounded-card border border-ink-200 bg-white p-6 transition-colors duration-300 hover:border-brand-red/40 dark:border-white/10 dark:bg-white/5"
              >
                <div className="mb-3 text-[1rem] font-bold text-brand-red dark:text-brand-red-soft">
                  {v.number}
                </div>
                <h4 className="mb-2 text-[1rem] font-bold text-navy dark:text-white">
                  {v.title}
                </h4>
                <p className="text-[0.85rem] leading-[1.65] text-ink-500 dark:text-white/60">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TeamGallery() {
  return (
    <section className="relative overflow-hidden bg-white py-[40px] dark:bg-navy-deep">
      <div className="relative mx-auto max-w-[1160px] px-7">
        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <PhotoTile tone="navy" label="On-site engineers" />
          <PhotoTile tone="red" label="Depot floor" />
        </div>
      </div>
    </section>
  );
}

function WhyWorkWithUs() {
  const t = CAREER_TESTIMONIAL;
  return (
    <section className="relative overflow-hidden bg-white py-[88px] dark:bg-navy-deep">
      <div className="relative mx-auto max-w-[1160px] px-7">
        <div className="mb-10">
          <span className="mb-3 inline-block text-[0.72rem] font-bold uppercase tracking-[0.13em] text-brand-red dark:text-brand-red-soft">
            Why you should work with us
          </span>
        </div>
        <div className="grid gap-10 lg:grid-cols-[0.35fr_1fr]">
          <div className="flex items-start">
            <div className="text-[1.4rem] font-black tracking-[-0.02em] text-navy dark:text-white">
              <span className="text-brand-red">Ovation</span>
            </div>
          </div>
          <div>
            <p className="text-[1.05rem] leading-[1.85] text-ink-700 dark:text-white/75">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="mt-6 text-[0.85rem] text-ink-500 dark:text-white/55">
              <span className="font-bold text-navy dark:text-white">{t.name}</span>
              <span className="mx-2 text-ink-200 dark:text-white/20">·</span>
              {t.title}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CurrentOpenings() {
  const grouped = CAREER_OPENINGS.reduce<Record<string, typeof CAREER_OPENINGS>>((acc, job) => {
    (acc[job.team] ||= []).push(job);
    return acc;
  }, {});
  const groups = Object.entries(grouped);

  return (
    <section
      id="openings"
      className="relative overflow-hidden bg-white py-[88px] dark:bg-navy-deep"
    >
      <div className="relative mx-auto max-w-[1160px] px-7">
        <div className="mb-3">
          <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold leading-[1.2] tracking-[-0.02em] text-navy dark:text-white">
            Current openings at Ovation
          </h2>
        </div>
        <div className="mb-10 h-[3px] w-[120px] bg-brand-red" />
        <div className="mb-8 text-[0.95rem] font-semibold text-ink-500 dark:text-white/60">
          {CAREER_OPENINGS.length} jobs
        </div>
        <div className="flex flex-col gap-10">
          {groups.map(([team, jobs]) => (
            <div key={team}>
              <h3 className="mb-4 text-[1rem] font-bold text-navy dark:text-white">{team}</h3>
              <ul className="m-0 flex list-none flex-col p-0">
                {jobs.map((job) => (
                  <li
                    key={job.title}
                    className="border-t border-ink-200 dark:border-white/10 last:border-b"
                  >
                    <a
                      href="#contact"
                      className="group flex flex-wrap items-center justify-between gap-4 py-4 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-[0.95rem] font-semibold text-navy transition-colors group-hover:text-brand-red dark:text-white dark:group-hover:text-brand-red-soft">
                          {job.title}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8rem] text-ink-500 dark:text-white/55">
                          <span>{job.location}</span>
                          <span className="text-ink-200 dark:text-white/20">·</span>
                          <span>{job.type}</span>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[0.82rem] font-semibold text-brand-red opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:text-brand-red-soft">
                        Apply
                        {ArrowRightIcon}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
