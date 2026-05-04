"use client";

import { useEffect, useRef, useState } from "react";
import { STATS } from "../constants";

function formatVal(v: number, decimals: number, suffix: string) {
  return (decimals > 0 ? v.toFixed(decimals) : Math.floor(v).toLocaleString()) + suffix;
}

export default function Stats() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [values, setValues] = useState<string[]>(
    STATS.map((s) => formatVal(s.target, s.decimals, s.suffix))
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            STATS.forEach((stat, i) => {
              const dur = 2200;
              const t0 = performance.now();
              const start = i * 100;
              setTimeout(() => {
                const tick = (now: number) => {
                  const p = Math.min((now - t0 - start) / dur, 1);
                  const ease = 1 - Math.pow(1 - p, 4);
                  const v = stat.target * ease;
                  setValues((prev) => {
                    const next = [...prev];
                    next[i] = formatVal(v, stat.decimals, stat.suffix);
                    return next;
                  });
                  if (p < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
              }, start);
            });
          }
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="stats"
      ref={sectionRef}
      className="relative overflow-hidden border-b border-ink-200 bg-white dark:border-white/5 dark:bg-navy"
    >
      <div className="bg-stripe-r pointer-events-none absolute inset-0 opacity-30 dark:hidden" />
      <div className="bg-stripe-w pointer-events-none absolute inset-0 opacity-40 hidden dark:block" />
      <div className="relative z-[1] mx-auto max-w-[1160px] px-7">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`group relative px-5 py-9 text-center transition-colors duration-300 hover:bg-ink-100 dark:hover:bg-white/5 ${
                i < STATS.length - 1 ? "border-r border-ink-200 dark:border-white/5" : ""
              } after:absolute after:bottom-0 after:left-[20%] after:right-[20%] after:h-0.5 after:scale-x-0 after:bg-brand-red after:transition-transform after:duration-500 hover:after:scale-x-100 after:content-['']`}
            >
              <div className="mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-brand-red-light [&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-brand-red dark:bg-brand-red/20 dark:[&>svg]:text-brand-red-soft">
                {stat.icon}
              </div>
              <div className="text-[2.1rem] font-black leading-none tracking-[-0.03em] text-navy dark:text-white">
                {values[i]}
              </div>
              <div className="mt-1.5 text-[0.72rem] font-medium uppercase tracking-[0.06em] text-ink-500 dark:text-white/50">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
