import { SERVICES } from "../constants";

export default function Services() {
  return (
    <section id="services" className="relative overflow-hidden bg-white py-[100px] dark:bg-navy-deep">
      <div className="bg-stripe-r pointer-events-none absolute -bottom-[60px] -right-[60px] h-[300px] w-[300px] rounded-full opacity-55" />
      <div className="relative mx-auto max-w-[1160px] px-7">
        <div className="mb-[52px] flex flex-wrap items-end justify-between gap-5">
          <div>
            <span className="mb-3 inline-block text-[0.72rem] font-bold uppercase tracking-[0.13em] text-brand-red dark:text-brand-red-soft">
              What We Do
            </span>
            <h2 className="text-[clamp(1.8rem,3.5vw,2.65rem)] font-extrabold leading-[1.2] tracking-[-0.02em] text-navy dark:text-white">
              Enterprise IT Services
              <br />
              Built for Scale
            </h2>
          </div>
          <p className="max-w-[340px] text-[1.05rem] leading-[1.75] text-ink-500 dark:text-white/60">
            End-to-end workforce and managed service solutions deployed across your most critical
            environments.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-[repeat(auto-fill,minmax(310px,1fr))]">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="group relative overflow-hidden rounded-card-lg border border-ink-200 bg-ink-100 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:bg-white hover:shadow-floating before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:origin-left before:scale-x-0 before:bg-brand-red before:transition-transform before:duration-300 hover:before:scale-x-100 before:content-[''] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]"
            >
              <div className="bg-stripe-r pointer-events-none absolute -bottom-5 -right-5 h-[90px] w-[90px] rounded-full opacity-50" />
              <div className="relative">
                <div className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-brand-red-light transition-colors duration-300 group-hover:bg-brand-red [&>svg]:h-[26px] [&>svg]:w-[26px] [&>svg]:text-brand-red [&>svg]:transition-colors [&>svg]:duration-300 group-hover:[&>svg]:text-white dark:bg-brand-red/20 dark:[&>svg]:text-brand-red-soft">
                  {s.icon}
                </div>
                <h3 className="mb-2.5 text-[1.05rem] font-bold text-navy dark:text-white">{s.title}</h3>
                <p className="text-[0.875rem] leading-[1.7] text-ink-500 dark:text-white/60">{s.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-ink-200 px-2.5 py-1 text-[0.7rem] font-semibold tracking-[0.04em] text-ink-700 transition-all duration-300 group-hover:bg-brand-red-light group-hover:text-brand-red dark:bg-white/10 dark:text-white/70 dark:group-hover:bg-brand-red/25 dark:group-hover:text-brand-red-soft"
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
