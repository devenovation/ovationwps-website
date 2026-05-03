import { CLIENT_LOGOS } from "../constants";

export default function TrustBar() {
  return (
    <section
      id="clients"
      className="overflow-hidden border-y border-ink-200 bg-ink-100 py-7 dark:border-white/10 dark:bg-navy-mid"
    >
      <div className="mx-auto max-w-[1160px] px-7">
        <div className="mb-[18px] text-center text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-500 dark:text-white/55">
          Trusted by leading global IT organisations
        </div>
        <div className="relative overflow-hidden before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-[2] before:w-20 before:bg-gradient-to-r before:from-ink-100 before:to-transparent before:content-[''] after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:z-[2] after:w-20 after:bg-gradient-to-l after:from-ink-100 after:to-transparent after:content-[''] dark:before:from-navy-mid dark:after:from-navy-mid">
          <div className="flex w-max animate-ticker items-center gap-16 hover:[animation-play-state:paused]">
            {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((name, i, arr) => (
              <span key={`${name}-${i}`} style={{ display: "contents" }}>
                <span className="whitespace-nowrap text-base font-extrabold uppercase tracking-[0.06em] text-ink-500 transition-colors duration-300 hover:text-navy dark:text-white/60 dark:hover:text-white">
                  {name}
                </span>
                {i < arr.length - 1 && (
                  <span className="text-[1.2rem] text-ink-200 dark:text-white/15">/</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
