import { DELIVERY_CENTERS, HEADQUARTERS } from "../constants";

export default function Locations() {
  return (
    <section
      id="locations"
      className="relative overflow-hidden border-t border-ink-200 bg-white py-20 dark:border-white/10 dark:bg-navy"
    >
      <div className="bg-stripe-r pointer-events-none absolute -left-10 -top-10 h-60 w-60 rounded-full opacity-40" />
      <div className="relative z-[1] mx-auto max-w-[1160px] px-7">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block text-[0.72rem] font-bold uppercase tracking-[0.13em] text-brand-red dark:text-brand-red-soft">
            Global Footprint
          </span>
          <h2 className="text-[clamp(1.8rem,3.5vw,2.65rem)] font-extrabold leading-[1.2] tracking-[-0.02em] text-navy dark:text-white">
            Global Locations
          </h2>
        </div>

        <div className="mb-5 text-center text-[0.72rem] font-bold uppercase tracking-[0.13em] text-brand-red dark:text-brand-red-soft">
          Headquarters
        </div>
        <div className="mx-auto mb-14 max-w-[360px]">
          <div className="rounded-card-lg border border-ink-200 bg-white px-7 py-7 text-center dark:border-white/10 dark:bg-white/5">
            <h3 className="text-[1.05rem] font-extrabold tracking-[-0.01em] text-brand-red dark:text-brand-red-soft">
              {HEADQUARTERS.city}
            </h3>
            <div className="mt-2 space-y-0.5 text-[0.9rem] leading-[1.6] text-ink-700 dark:text-white/70">
              {HEADQUARTERS.address.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6 text-center text-[0.72rem] font-bold uppercase tracking-[0.13em] text-brand-red dark:text-brand-red-soft">
          Delivery Centers
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {DELIVERY_CENTERS.map((loc) => (
            <div
              key={loc.city}
              className="group relative flex flex-col gap-2 overflow-hidden rounded-card-lg border border-ink-200 bg-white px-6 py-7 transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-floating dark:border-white/10 dark:bg-white/5 dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]"
            >
              <div className="absolute inset-x-0 top-0 h-[3px] bg-brand-red opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <h3 className="text-[1rem] font-extrabold tracking-[-0.01em] text-brand-red dark:text-brand-red-soft">
                {loc.city}
              </h3>
              <div className="space-y-0.5 text-[0.85rem] leading-[1.6] text-ink-500 dark:text-white/60">
                {loc.address.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
