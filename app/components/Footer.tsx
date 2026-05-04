import {
  FOOTER_BRAND_TAGLINE,
  FOOTER_CERT_PILLS,
  FOOTER_COLUMNS,
  FOOTER_COPYRIGHT,
} from "../constants";
import BrandMark from "./BrandMark";

const COL_HEAD =
  "mb-4 text-[0.78rem] font-bold uppercase tracking-[0.1em] text-ink-700 dark:text-white/70";
const COL_LINK =
  "text-[0.875rem] text-ink-500 transition-colors duration-300 hover:text-brand-red dark:text-white/80 dark:hover:text-white";

export default function Footer() {
  return (
    <footer
      id="footer"
      className="relative overflow-hidden border-t border-ink-200 bg-ink-100 pb-7 pt-[60px] dark:border-transparent dark:bg-navy"
    >
      <div className="bg-stripe-r pointer-events-none absolute inset-0 opacity-25 dark:hidden" />
      <div className="bg-stripe-w pointer-events-none absolute inset-0 opacity-20 hidden dark:block" />
      <div className="relative z-[1] mx-auto max-w-[1160px] px-7">
        <div className="mb-12 grid gap-12 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <span className="mb-4 inline-flex items-center gap-2.5">
              <BrandMark />
            </span>
            <p className="max-w-[280px] text-[0.83rem] leading-[1.7] text-ink-500 dark:text-white/70">
              {FOOTER_BRAND_TAGLINE}
            </p>
          </div>
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h4 className={COL_HEAD}>{col.heading}</h4>
              <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                {col.links.map((link) => {
                  const external = link.href.startsWith("http");
                  return (
                    <li key={`${col.heading}-${link.label}`}>
                      <a
                        href={link.href}
                        className={COL_LINK}
                        {...(external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="relative z-[1] flex flex-wrap items-center justify-between gap-3 border-t border-ink-200 pt-6 text-[0.8rem] text-ink-500 dark:border-white/15 dark:text-white/65">
          <span>{FOOTER_COPYRIGHT}</span>
          <div className="flex items-center gap-3">
            {FOOTER_CERT_PILLS.map((p) => (
              <span
                key={p}
                className="rounded-md border border-ink-200 bg-white px-2.5 py-1 text-[0.72rem] font-semibold tracking-[0.04em] text-ink-700 dark:border-white/15 dark:bg-white/10 dark:text-white/80"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
