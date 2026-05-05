import { CERTS } from "../constants";

export default function Certifications() {
  return (
    <section
      id="certifications"
      className="relative overflow-hidden border-t border-ink-200 bg-ink-100 py-20 dark:border-white/10 dark:bg-navy-mid"
    >
      <div className="bg-stripe-r pointer-events-none absolute -right-10 -top-10 h-60 w-60 rounded-full opacity-40" />
      <div className="relative z-[1] mx-auto max-w-[1160px] px-7">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block text-[0.72rem] font-bold uppercase tracking-[0.13em] text-brand-red dark:text-brand-red-soft">
            Standards &amp; Recognition
          </span>
          <h2 className="text-[clamp(1.8rem,3.5vw,2.65rem)] font-extrabold leading-[1.2] tracking-[-0.02em] text-navy dark:text-white">
            Certified. Compliant. Trusted.
          </h2>
          <p className="mx-auto mt-3.5 max-w-[520px] text-center text-[1.05rem] leading-[1.75] text-ink-500 dark:text-white/60">
            Our certifications reflect our commitment to quality, security, and inclusive business
            practices at every level of service delivery.
          </p>
        </div>
        <div className="mx-auto grid max-w-[980px] gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CERTS.map((c) => (
            <div
              key={c.title}
              className="group relative flex flex-col items-center gap-4 overflow-hidden rounded-card-lg border border-ink-200 bg-white px-7 pb-7 pt-9 text-center transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-floating dark:border-white/10 dark:bg-white/5 dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]"
            >
              <div className="absolute inset-x-0 top-0 h-[3px] bg-brand-red opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div
                className={`flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-full ring-8 transition-transform duration-300 group-hover:scale-105 ${c.iconBg} ${c.ringColor} [&>svg]:h-8 [&>svg]:w-8 ${c.iconColor}`}
              >
                {c.icon}
              </div>
              <span className="rounded-full border border-ink-200 bg-ink-100 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.13em] text-ink-700 dark:border-white/15 dark:bg-white/10 dark:text-white/70">
                {c.label}
              </span>
              <h4 className="text-[1rem] font-extrabold tracking-[-0.01em] text-navy dark:text-white">
                {c.title}
              </h4>
              <p className="text-[0.82rem] leading-[1.6] text-ink-500 dark:text-white/60">
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
