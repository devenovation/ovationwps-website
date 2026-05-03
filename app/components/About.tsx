import { ABOUT_DELIVERY_LIST, ABOUT_FEATURES, ABOUT_PILLS } from "../constants";

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-navy py-[100px]">
      <div className="bg-stripe-w pointer-events-none absolute inset-0 opacity-35" />
      <div className="relative z-[1] mx-auto max-w-[1160px] px-7">
        <div className="grid items-center gap-20 lg:grid-cols-2 max-lg:gap-12">
          <div>
            <span className="mb-3 inline-block text-[0.72rem] font-bold uppercase tracking-[0.13em] text-brand-red-soft">
              Who We Are
            </span>
            <h2 className="text-[clamp(1.8rem,3.5vw,2.65rem)] font-extrabold leading-[1.2] tracking-[-0.02em] text-white">
              A Minority-Owned Enterprise
              <br />
              with Global Scale
            </h2>
            <p className="mt-3.5 max-w-[480px] text-[1.05rem] leading-[1.75] text-white/60">
              Founded by technology industry veterans, Ovation has grown from a focused staffing
              firm into a true global IT services partner — serving Fortune 500 enterprises, tier-1
              SIs, and public sector organisations across six continents.
            </p>
            <div className="mt-9 flex flex-col gap-5">
              {ABOUT_FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="flex items-start gap-4 rounded-card border border-white/10 bg-white/5 p-5 transition-colors duration-300 hover:bg-white/10"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-brand-red/20 [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-brand-red-soft">
                    {f.icon}
                  </div>
                  <div>
                    <h4 className="mb-1 text-[0.9rem] font-bold text-white">{f.title}</h4>
                    <p className="text-[0.82rem] leading-[1.6] text-white/50">{f.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="relative overflow-hidden rounded-card-lg border border-white/10 bg-white/5 p-8 backdrop-blur-md before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-brand-red before:content-['']">
              <div className="bg-stripe-w pointer-events-none absolute inset-0 opacity-50" />
              <div className="relative z-[1]">
                <div className="mb-5 text-[1.1rem] font-bold text-white">
                  Our Service Delivery Model
                </div>
                <ul className="m-0 flex list-none flex-col gap-3 p-0">
                  {ABOUT_DELIVERY_LIST.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-[0.875rem] text-white/70 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-brand-red before:content-['']"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex flex-wrap gap-2.5">
                  {ABOUT_PILLS.map((pill) => (
                    <div
                      key={pill}
                      className="rounded-lg border border-white/15 bg-white/10 px-3.5 py-1.5 text-[0.75rem] font-bold uppercase tracking-[0.04em] text-white/60"
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
