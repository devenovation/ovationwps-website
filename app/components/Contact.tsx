"use client";

import { FormEvent, useState } from "react";
import {
  ArrowRightIcon,
  CONTACT_INFO,
  CONTACT_SERVICE_OPTIONS,
} from "../constants";

const inputClass =
  "rounded-lg border-[1.5px] border-ink-200 bg-white px-3.5 py-2.5 text-[0.9rem] text-navy outline-none transition-all duration-300 focus:border-brand-red focus:shadow-[0_0_0_3px_rgba(179,9,32,0.1)] dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus:border-brand-red-soft dark:focus:shadow-[0_0_0_3px_rgba(232,74,95,0.18)]";

const labelClass = "text-[0.82rem] font-semibold text-ink-700 dark:text-white/75";
const fieldClass = "mb-4 flex flex-col gap-1.5";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-gradient-to-br from-white from-60% to-ink-100 py-[100px] dark:from-navy-deep dark:to-navy-mid"
    >
      <div className="bg-stripe-r pointer-events-none absolute -top-[60px] right-[5%] h-[280px] w-[280px] rounded-full opacity-40" />
      <div className="relative z-[1] mx-auto max-w-[1160px] px-7">
        <div className="grid items-start gap-[72px] lg:grid-cols-2 max-lg:gap-12">
          <div>
            <span className="mb-3 inline-block text-[0.72rem] font-bold uppercase tracking-[0.13em] text-brand-red dark:text-brand-red-soft">
              Let&rsquo;s Work Together
            </span>
            <h2 className="mb-4 text-[clamp(1.8rem,3vw,2.6rem)] font-extrabold leading-[1.2] tracking-[-0.02em] text-navy dark:text-white">
              Ready to Elevate Your IT Operations?
            </h2>
            <p className="mb-8 text-base leading-[1.75] text-ink-500 dark:text-white/65">
              Whether you need field technicians deployed by tomorrow or a strategic outsourcing
              partner for the next three years, Ovation delivers. Let&rsquo;s start with a
              conversation.
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
                <label htmlFor="firstName" className={labelClass}>
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="Jane"
                  required
                  className={inputClass}
                />
              </div>
              <div className={fieldClass}>
                <label htmlFor="lastName" className={labelClass}>
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Smith"
                  required
                  className={inputClass}
                />
              </div>
            </div>
            <div className={fieldClass}>
              <label htmlFor="email" className={labelClass}>
                Work Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="jane@company.com"
                required
                className={inputClass}
              />
            </div>
            <div className={fieldClass}>
              <label htmlFor="company" className={labelClass}>
                Company
              </label>
              <input
                id="company"
                type="text"
                placeholder="Your organisation"
                className={inputClass}
              />
            </div>
            <div className={fieldClass}>
              <label htmlFor="service" className={labelClass}>
                Service of Interest
              </label>
              <select id="service" defaultValue="" className={inputClass}>
                <option value="" disabled>
                  Select a service...
                </option>
                {CONTACT_SERVICE_OPTIONS.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className={fieldClass}>
              <label htmlFor="message" className={labelClass}>
                Message
              </label>
              <textarea
                id="message"
                placeholder="Tell us about your IT environment and what you're looking to solve..."
                className={`${inputClass} min-h-[110px] resize-y`}
              />
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-red px-7 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-red-dark hover:shadow-[0_8px_24px_rgba(179,9,32,0.35)]"
            >
              {submitted ? (
                "Message Sent — We'll be in touch"
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
