"use client";

import { useEffect, useState } from "react";
import BrandMark from "./BrandMark";
import ThemeToggle from "./ThemeToggle";
import { NAV_LINKS } from "../constants";

export default function Navbar() {
  const [elevated, setElevated] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const close = () => setMobileOpen(false);

  return (
    <>
      <nav
        id="navbar"
        className={`fixed inset-x-0 top-0 z-[1000] bg-white transition-[background-color,box-shadow,border-color,color] duration-300 dark:bg-navy-deep ${
          elevated
            ? "shadow-[0_2px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_20px_rgba(0,0,0,0.6)]"
            : "shadow-[0_1px_0_var(--color-ink-200)] dark:shadow-[0_1px_0_rgba(255,255,255,0.08)]"
        }`}
      >
        <div className="mx-auto max-w-[1160px] px-7">
          <div className="flex h-16 items-center justify-between">
            <a
              href="#"
              className="flex items-center"
              aria-label="Ovation Workplace Services home"
            >
              <BrandMark />
            </a>
            <ul className="hidden items-center gap-7 md:flex">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-[0.85rem] font-medium text-ink-700 transition-colors duration-300 hover:text-brand-red dark:text-white/80 dark:hover:text-brand-red-soft"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#contact"
                  className="rounded-md bg-brand-red px-[18px] py-2 text-[0.85rem] font-medium text-white transition-colors duration-300 hover:bg-brand-red-dark"
                >
                  Get in Touch
                </a>
              </li>
              <li>
                <ThemeToggle />
              </li>
            </ul>
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <button
                type="button"
                className="flex flex-col gap-[5px] border-none bg-transparent p-1.5"
                aria-label="Open menu"
                onClick={() => setMobileOpen(true)}
              >
                <span className="block h-0.5 w-[22px] rounded-sm bg-navy dark:bg-white" />
                <span className="block h-0.5 w-[22px] rounded-sm bg-navy dark:bg-white" />
                <span className="block h-0.5 w-[22px] rounded-sm bg-navy dark:bg-white" />
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div
        className={`fixed inset-0 z-[999] flex-col items-center justify-center gap-7 bg-white dark:bg-navy-deep ${
          mobileOpen ? "flex" : "hidden"
        }`}
      >
        <button
          type="button"
          className="absolute right-6 top-5 border-none bg-transparent text-2xl text-navy dark:text-white"
          aria-label="Close menu"
          onClick={close}
        >
          ×
        </button>
        {NAV_LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={close}
            className="text-2xl font-bold text-navy hover:text-brand-red dark:text-white dark:hover:text-brand-red-soft"
          >
            {l.label}
          </a>
        ))}
        <a
          href="#contact"
          onClick={close}
          className="text-2xl font-bold text-navy hover:text-brand-red dark:text-white dark:hover:text-brand-red-soft"
        >
          Contact
        </a>
      </div>
    </>
  );
}
