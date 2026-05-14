"use client";

import { FormEvent, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  ArrowRightIcon,
  CONTACT_INFO,
  PARTNER_HERO_STATS,
} from "../constants";

export default function PartnerPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white dark:bg-navy-deep">
        <PartnerHero />
        <PartnerContact />
      </main>
      <Footer />
    </>
  );
}

function PartnerHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0a0f24] via-navy-deep to-[#1a0a18] pt-[160px] pb-[120px] max-md:pt-[120px] max-md:pb-20">
      <div className="bg-stripe-w pointer-events-none absolute inset-0 opacity-20" />
      <div className="pointer-events-none absolute -left-32 top-1/4 h-[440px] w-[440px] rounded-full bg-brand-red/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[380px] w-[380px] rounded-full bg-violet-600/15 blur-[120px]" />

      <div className="relative z-[1] mx-auto max-w-[1160px] px-7">
        <div className="mx-auto max-w-[820px] text-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-brand-red-soft backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-red-soft" />
            Partner with Us
          </span>
          <h1 className="text-[clamp(2.6rem,6vw,5rem)] font-black leading-[1.02] tracking-[-0.04em] text-white">
            Your customers.
            <br />
            <span className="bg-gradient-to-r from-brand-red-soft via-white to-white bg-clip-text text-transparent">
              Our delivery muscle.
            </span>
          </h1>
          <p className="mx-auto mt-7 max-w-[640px] text-[1.1rem] leading-[1.7] text-white/70">
            MSPs, OEMs, integrators, and software companies plug into Ovation to
            extend field, depot, and dispatch coverage — without standing up new
            geographies or rebuilding SLAs from scratch.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#partner-contact"
              className="inline-flex items-center gap-2 rounded-full bg-brand-red px-7 py-3.5 text-[0.95rem] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-red-dark hover:shadow-[0_10px_28px_rgba(179,9,32,0.4)]"
            >
              Partner with Us
              {ArrowRightIcon}
            </a>
          </div>
        </div>

        <div className="relative mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-[24px] border border-white/10 bg-white/5 backdrop-blur sm:grid-cols-4">
          {PARTNER_HERO_STATS.map((s) => (
            <div
              key={s.label}
              className="bg-gradient-to-b from-white/[0.04] to-transparent p-7 text-center"
            >
              <div className="text-[clamp(2rem,3.5vw,2.6rem)] font-black leading-none tracking-[-0.03em] text-white">
                {s.value}
              </div>
              <div className="mt-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.13em] text-white/55">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const inputClass =
  "rounded-lg border-[1.5px] border-ink-200 bg-white px-3.5 py-2.5 text-[0.9rem] text-navy outline-none transition-all duration-300 focus:border-brand-red focus:shadow-[0_0_0_3px_rgba(179,9,32,0.1)] dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus:border-brand-red-soft dark:focus:shadow-[0_0_0_3px_rgba(232,74,95,0.18)]";

const labelClass = "text-[0.82rem] font-semibold text-ink-700 dark:text-white/75";
const fieldClass = "mb-4 flex flex-col gap-1.5";

function PartnerContact() {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="partner-contact"
      className="relative overflow-hidden bg-gradient-to-br from-white from-60% to-ink-100 py-[100px] max-md:py-20 dark:from-navy-deep dark:to-navy-mid"
    >
      <div className="bg-stripe-r pointer-events-none absolute -top-[60px] right-[5%] h-[280px] w-[280px] rounded-full opacity-40 dark:hidden" />
      <div className="relative z-[1] mx-auto max-w-[1160px] px-7">
        <div className="grid items-start gap-[72px] lg:grid-cols-2 max-lg:gap-12">
          <div>
            <span className="mb-3 inline-block text-[0.72rem] font-bold uppercase tracking-[0.13em] text-brand-red dark:text-brand-red-soft">
              Let&rsquo;s build together
            </span>
            <h2 className="mb-4 text-[clamp(1.8rem,3vw,2.6rem)] font-extrabold leading-[1.2] tracking-[-0.02em] text-navy dark:text-white">
              Ready to add Ovation to your delivery stack?
            </h2>
            <p className="mb-8 text-base leading-[1.75] text-ink-500 dark:text-white/65">
              Tell us a little about your business and where you need coverage. A
              channel director will reach out within one business day to map the
              fit and the next step.
            </p>
            <div className="flex flex-col gap-3.5">
              {CONTACT_INFO.map((row) => (
                <div
                  key={row.text}
                  className="flex items-center gap-3 text-[0.9rem] text-ink-700 dark:text-white/80"
                >
                  <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[9px] bg-brand-red-light [&>svg]:h-[18px] [&>svg]:w-[18px] [&>svg]:text-brand-red dark:bg-brand-red/20 dark:[&>svg]:text-brand-red-soft">
                    {row.icon}
                  </div>
                  <span>{row.text}</span>
                </div>
              ))}
            </div>
          </div>
          <form
            onSubmit={onSubmit}
            className="rounded-card-lg border border-ink-200 bg-white p-9 shadow-soft dark:border-white/10 dark:bg-white/5 dark:shadow-[0_16px_48px_rgba(0,0,0,0.4)]"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className={fieldClass}>
                <label htmlFor="p-firstName" className={labelClass}>
                  First Name
                </label>
                <input
                  id="p-firstName"
                  type="text"
                  placeholder="Jane"
                  required
                  className={inputClass}
                />
              </div>
              <div className={fieldClass}>
                <label htmlFor="p-lastName" className={labelClass}>
                  Last Name
                </label>
                <input
                  id="p-lastName"
                  type="text"
                  placeholder="Smith"
                  required
                  className={inputClass}
                />
              </div>
            </div>
            <div className={fieldClass}>
              <label htmlFor="p-email" className={labelClass}>
                Work Email
              </label>
              <input
                id="p-email"
                type="email"
                placeholder="jane@company.com"
                required
                className={inputClass}
              />
            </div>
            <div className={fieldClass}>
              <label htmlFor="p-company" className={labelClass}>
                Company
              </label>
              <input
                id="p-company"
                type="text"
                placeholder="Your organisation"
                required
                className={inputClass}
              />
            </div>
            <div className={fieldClass}>
              <label htmlFor="p-type" className={labelClass}>
                Partnership Type
              </label>
              <select id="p-type" defaultValue="" className={inputClass}>
                <option value="" disabled>
                  Select a partnership type...
                </option>
                <option>Referral Partner</option>
                <option>Reseller Partner</option>
                <option>Strategic Alliance</option>
                <option>Not sure yet — exploring</option>
              </select>
            </div>
            <div className={fieldClass}>
              <label htmlFor="p-regions" className={labelClass}>
                Regions of Interest
              </label>
              <input
                id="p-regions"
                type="text"
                placeholder="e.g. North America, EMEA, APAC"
                className={inputClass}
              />
            </div>
            <div className={fieldClass}>
              <label htmlFor="p-message" className={labelClass}>
                Tell us about your pipeline
              </label>
              <textarea
                id="p-message"
                placeholder="What customer problems are you trying to solve, and where does Ovation fit?"
                className={`${inputClass} min-h-[110px] resize-y`}
              />
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-red px-7 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-red-dark hover:shadow-[0_8px_24px_rgba(179,9,32,0.35)]"
            >
              {submitted ? (
                "Thanks — a channel director will be in touch"
              ) : (
                <>
                  {ArrowRightIcon}
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
