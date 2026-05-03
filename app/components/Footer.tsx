import {
  COMPANY,
  FOOTER_BRAND_TAGLINE,
  FOOTER_CERT_PILLS,
  FOOTER_COLUMNS,
  FOOTER_COPYRIGHT,
} from "../constants";
import BrandMark from "./BrandMark";

const COL_HEAD = "mb-4 text-[0.78rem] font-bold uppercase tracking-[0.1em] text-white/70";
const COL_LINK =
  "text-[0.875rem] text-white/80 transition-colors duration-300 hover:text-white";

export default function Footer() {
  return (
    <footer id="footer" className="relative overflow-hidden bg-navy pb-7 pt-[60px]">
      <div className="bg-stripe-w pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative z-[1] mx-auto max-w-[1160px] px-7">
        <div className="mb-12 grid gap-12 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <span className="mb-4 inline-flex items-center gap-2.5">
              <BrandMark />
            </span>
            <p className="max-w-[280px] text-[0.83rem] leading-[1.7] text-white/70">
              {FOOTER_BRAND_TAGLINE}
            </p>
          </div>
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h4 className={COL_HEAD}>{col.heading}</h4>
              <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-white">
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
        <div className="relative z-[1] flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-6 text-[0.8rem] text-white/65">
          <span>{FOOTER_COPYRIGHT}</span>
          <div className="flex items-center gap-3">
            {FOOTER_CERT_PILLS.map((p) => (
              <span
                key={p}
                className="rounded-md border border-white/15 bg-white/10 px-2.5 py-1 text-[0.72rem] font-semibold tracking-[0.04em] text-white/80"
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
