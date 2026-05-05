import { ABOUT_DELIVERY_LIST, ABOUT_FEATURES, ABOUT_PILLS } from "../constants";

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-ink-100 py-[100px] dark:bg-navy">
      <div className="bg-stripe-r pointer-events-none absolute inset-0 opacity-30 dark:hidden" />
      <div className="bg-stripe-w pointer-events-none absolute inset-0 opacity-35 hidden dark:block" />
      <div className="relative z-[1] mx-auto max-w-[1160px] px-7">
        <div className="mx-auto mb-14 max-w-[600px] text-center">
          <span className="mb-3 inline-block text-[0.72rem] font-bold uppercase tracking-[0.13em] text-brand-red dark:text-brand-red-soft">
            Who We Are
          </span>
          <h2 className="text-[clamp(1.8rem,3.5vw,2.65rem)] font-extrabold leading-[1.2] tracking-[-0.02em] text-navy dark:text-white">
            A Minority-Owned Enterprise
            <br />
            with Global Scale
          </h2>
          <p className="mx-auto mt-3.5 max-w-[560px] text-[1.05rem] leading-[1.75] text-ink-500 dark:text-white/60">
            Founded by technology industry veterans, Ovation has grown from a focused staffing
            firm into a true global IT services partner — serving Fortune 500 enterprises, tier-1
            SIs, and public sector organisations across six continents.
          </p>
        </div>
        <div className="grid items-center gap-20 lg:grid-cols-2 max-lg:gap-12">
          <div>
            <div className="flex flex-col gap-5">
              {ABOUT_FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="flex items-start gap-4 rounded-card border border-ink-200 bg-white p-5 transition-colors duration-300 hover:border-transparent hover:shadow-soft dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:shadow-none"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-brand-red-light [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-brand-red dark:bg-brand-red/20 dark:[&>svg]:text-brand-red-soft">
                    {f.icon}
                  </div>
                  <div>
                    <h4 className="mb-1 text-[0.9rem] font-bold text-navy dark:text-white">{f.title}</h4>
                    <p className="text-[0.82rem] leading-[1.6] text-ink-500 dark:text-white/50">{f.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="relative overflow-hidden rounded-card-lg border border-ink-200 bg-white p-8 shadow-soft dark:border-white/10 dark:bg-white/5 dark:shadow-none dark:backdrop-blur-md before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-brand-red before:content-['']">
              <div className="bg-stripe-r pointer-events-none absolute inset-0 opacity-40 dark:hidden" />
              <div className="bg-stripe-w pointer-events-none absolute inset-0 opacity-50 hidden dark:block" />
              <div className="relative z-[1]">
                <div className="mb-5 text-[1.1rem] font-bold text-navy dark:text-white">
                  Our Service Delivery Model
                </div>
                <ul className="m-0 flex list-none flex-col gap-3 p-0">
                  {ABOUT_DELIVERY_LIST.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-[0.875rem] text-ink-700 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-brand-red before:content-[''] dark:text-white/70"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex flex-wrap gap-2.5">
                  {ABOUT_PILLS.map((pill) => (
                    <div
                      key={pill}
                      className="rounded-lg border border-ink-200 bg-ink-100 px-3.5 py-1.5 text-[0.75rem] font-bold uppercase tracking-[0.04em] text-ink-700 dark:border-white/15 dark:bg-white/10 dark:text-white/60"
                    >
                      {pill}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
