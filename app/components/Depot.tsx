import { DEPOT_CAPABILITIES, DEPOT_ITEMS } from "../constants";

export default function Depot() {
  return (
    <section
      id="depot"
      className="relative overflow-hidden bg-gradient-to-br from-white to-ink-100 py-[100px] dark:from-navy dark:to-[#1a2540]"
    >
      <div className="bg-stripe-r pointer-events-none absolute inset-0 opacity-30 dark:hidden" />
      <div className="bg-stripe-w pointer-events-none absolute inset-0 opacity-30 hidden dark:block" />
      <div className="relative z-[1] mx-auto max-w-[1160px] px-7">
        <div className="mx-auto mb-14 max-w-[600px] text-center">
          <span className="mb-3 inline-block text-[0.72rem] font-bold uppercase tracking-[0.13em] text-brand-red dark:text-brand-red-soft">
            Depot Services
          </span>
          <h2 className="text-[clamp(1.8rem,3.5vw,2.65rem)] font-extrabold leading-[1.2] tracking-[-0.02em] text-navy dark:text-white">
            End-to-End Hardware
            <br />
            Lifecycle Management
          </h2>
          <p className="mx-auto mt-3.5 max-w-[560px] text-[1.05rem] leading-[1.75] text-ink-500 dark:text-white/60">
            Our dedicated depot facility provides comprehensive hardware staging, repair, and
            recovery services — a single accountable partner from asset intake to final
            deployment.
          </p>
        </div>
        <div className="grid items-start gap-[72px] lg:grid-cols-2 max-lg:gap-12">
          <div>
            <div className="flex flex-col gap-3.5">
              {DEPOT_ITEMS.map((it) => (
                <div
                  key={it.title}
                  className="flex items-start gap-3.5 rounded-card border border-ink-200 bg-white px-5 py-4 transition-all duration-300 hover:translate-x-1 hover:border-transparent hover:shadow-soft dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:shadow-none"
                >
                  <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[9px] bg-brand-red-light [&>svg]:h-[18px] [&>svg]:w-[18px] [&>svg]:text-brand-red dark:bg-brand-red/20 dark:[&>svg]:text-brand-red-soft">
                    {it.icon}
                  </div>
                  <div>
                    <h4 className="mb-1 text-[0.88rem] font-bold text-navy dark:text-white">{it.title}</h4>
                    <p className="text-[0.8rem] leading-[1.55] text-ink-500 dark:text-white/50">{it.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="relative overflow-hidden rounded-card-lg border border-ink-200 bg-white p-8 shadow-soft dark:border-white/10 dark:bg-white/5 dark:shadow-none before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-brand-red before:content-['']">
              <div className="bg-stripe-r pointer-events-none absolute inset-0 opacity-30 dark:hidden" />
              <div className="bg-stripe-w pointer-events-none absolute inset-0 opacity-45 hidden dark:block" />
              <div className="relative z-[1]">
                <div className="mb-[22px] text-base font-bold text-navy dark:text-white">
                  Depot Capabilities at a Glance
                </div>
                {DEPOT_CAPABILITIES.map((c, i) => (
                  <div
                    key={c.strong}
                    className={`flex items-center gap-3 py-3.5 ${
                      i < DEPOT_CAPABILITIES.length - 1 ? "border-b border-ink-200 dark:border-white/10" : ""
                    }`}
                  >
                    <div className="h-2 w-2 shrink-0 rounded-full bg-brand-red" />
                    <span className="text-[0.875rem] text-ink-700 dark:text-white/70">
                      <strong className="text-navy dark:text-white">{c.strong}</strong> — {c.rest}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
