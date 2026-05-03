import { FOUNDERS } from "../constants";

export default function Leadership() {
  return (
    <section id="founders" className="relative overflow-hidden bg-ink-100 py-[100px] dark:bg-navy-mid">
      <div className="bg-stripe-r pointer-events-none absolute -bottom-[60px] -left-[60px] h-[280px] w-[280px] rounded-full opacity-50" />
      <div className="relative z-[1] mx-auto max-w-[1160px] px-7">
        <div className="mx-auto mb-14 max-w-[600px] text-center">
          <span className="mb-3 inline-block text-[0.72rem] font-bold uppercase tracking-[0.13em] text-brand-red dark:text-brand-red-soft">
            Leadership
          </span>
          <h2 className="text-[clamp(1.8rem,3.5vw,2.65rem)] font-extrabold leading-[1.2] tracking-[-0.02em] text-navy dark:text-white">
            Built by Industry Veterans
          </h2>
          <p className="mx-auto mt-3.5 max-w-[560px] text-[1.05rem] leading-[1.75] text-ink-500 dark:text-white/60">
            Our founders bring decades of combined experience leading and scaling global IT
            services organisations.
          </p>
        </div>
        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {FOUNDERS.map((f) => (
            <div
              key={f.name}
              className="group overflow-hidden rounded-card-lg border border-ink-200 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-transparent hover:shadow-floating dark:border-white/10 dark:bg-white/5 dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]"
            >
              <div className="relative flex h-[230px] items-center justify-center overflow-hidden bg-navy">
                <div className="bg-stripe-w pointer-events-none absolute inset-0 opacity-60" />
                <div className="relative z-[1] flex h-[84px] w-[84px] items-center justify-center rounded-full border-[3px] border-brand-red/50 bg-brand-red/30 text-[1.7rem] font-black text-white">
                  {f.initials}
                </div>
                <div className="absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-[rgba(10,14,30,0.92)] to-transparent px-5 pb-3.5 pt-7">
                  <h3 className="text-base font-extrabold text-white">{f.name}</h3>
                  <span className="text-[0.75rem] font-semibold uppercase tracking-[0.04em] text-brand-red-soft">
                    {f.title}
                  </span>
                </div>
              </div>
              <div className="px-6 pb-7 pt-5">
                <p className="mb-4 text-[0.875rem] leading-[1.7] text-ink-500 dark:text-white/60">{f.bio}</p>
                <div className="flex flex-wrap gap-1.5">
                  {f.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-ink-200 bg-ink-100 px-2.5 py-1 text-[0.7rem] font-semibold text-ink-700 dark:border-white/15 dark:bg-white/10 dark:text-white/75"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
