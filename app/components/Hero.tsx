"use client";

import { useEffect, useRef } from "react";
import { ArrowRightIcon, HERO_PROOF_CARDS, HERO_TRUST_ITEMS } from "../constants";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    const NODE_COUNT = 65;
    const CONNECTION_DIST = 160;

    type Node = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      pulse: number;
      isRed: boolean;
    };
    const nodes: Node[] = [];

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.8,
        pulse: Math.random() * Math.PI * 2,
        isRed: Math.random() < 0.12,
      });
    }

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const isDark = document.documentElement.classList.contains("dark");

      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.018;
        if (n.x < 0) n.x = W;
        if (n.x > W) n.x = 0;
        if (n.y < 0) n.y = H;
        if (n.y > H) n.y = 0;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.18;
            const isRed = a.isRed || b.isRed;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = isRed
              ? `rgba(179,9,32,${alpha * 1.6})`
              : isDark
                ? `rgba(100,140,200,${alpha})`
                : `rgba(30,55,110,${alpha * 1.4})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      nodes.forEach((n) => {
        const pulseFactor = 0.5 + 0.5 * Math.sin(n.pulse);
        const r = n.r * (1 + pulseFactor * 0.4);
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = n.isRed
          ? `rgba(179,9,32,${0.6 + pulseFactor * 0.4})`
          : isDark
            ? `rgba(120,170,255,${0.35 + pulseFactor * 0.25})`
            : `rgba(30,60,120,${0.35 + pulseFactor * 0.25})`;
        ctx.fill();
        if (n.isRed && pulseFactor > 0.7) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, r * 2.5, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(179,9,32,${(pulseFactor - 0.7) * 0.15})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden pt-16"
    >
      <div className="absolute inset-0 z-0 bg-white dark:bg-[#070c1a]">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      </div>
      <div className="bg-stripe-r absolute inset-0 z-[1] opacity-40 dark:hidden" />
      <div className="bg-stripe-w absolute inset-0 z-[1] opacity-55 hidden dark:block" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-br from-white/85 via-white/60 to-white/30 dark:from-[rgba(7,12,26,0.78)] dark:via-[rgba(7,12,26,0.55)] dark:to-[rgba(7,12,26,0.38)]" />
      <div className="absolute bottom-0 left-0 right-0 z-[2] h-[3px] bg-gradient-to-r from-brand-red to-transparent" />
      <div className="relative z-[3] mx-auto w-full max-w-[1160px] px-7">
        <div className="grid items-center gap-[60px] py-[100px] pb-[84px] lg:grid-cols-[1.15fr_0.85fr] max-lg:gap-10 max-md:py-[60px] max-md:pb-12">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-brand-red/35 bg-brand-red/15 py-1.5 pl-2.5 pr-3.5 dark:bg-brand-red/20">
              <div className="h-2 w-2 animate-pulse-dot rounded-full bg-brand-red dark:bg-brand-red-soft" />
              <span className="text-[0.73rem] font-bold uppercase tracking-[0.08em] text-brand-red dark:text-brand-red-pale">
                Global IT Workforce Partner
              </span>
            </div>
            <h1 className="mb-6 text-[clamp(2.4rem,5.5vw,4rem)] font-black leading-[1.08] tracking-[-0.03em] text-navy dark:text-white">
              Powering the
              <br />
              <span className="text-brand-red">World&rsquo;s Most</span>
              <br />
              Demanding IT
              <br />
              Operations
            </h1>
            <p className="mb-10 max-w-[520px] text-[1.08rem] leading-[1.8] text-ink-500 dark:text-white/70">
              From break/fix field services to enterprise dispatch management, Ovation delivers
              skilled technicians, seamless logistics, and proven SLA compliance — across every
              timezone, at every scale.
            </p>
            <div className="flex flex-wrap gap-3.5">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-red px-7 py-3.5 text-[0.95rem] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-red-dark hover:shadow-[0_8px_24px_rgba(179,9,32,0.35)]"
              >
                Start a Conversation
                {ArrowRightIcon}
              </a>
              <a
                href="#services"
                className="inline-flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-7 py-3.5 text-[0.95rem] font-semibold text-navy shadow-[0_10px_28px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:border-ink-200 hover:bg-ink-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/30 dark:bg-white/10 dark:text-white dark:shadow-[0_10px_28px_rgba(0,0,0,0.22)] dark:backdrop-blur dark:hover:border-white/55 dark:hover:bg-white/20 dark:focus-visible:ring-white/60 dark:focus-visible:ring-offset-[rgba(7,12,26,0.9)]"
              >
                Explore Services
              </a>
            </div>
            <div className="mt-11 flex flex-wrap items-center gap-6">
              {HERO_TRUST_ITEMS.map((label) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-[0.78rem] font-medium text-ink-500 dark:text-white/55"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-brand-red" />
                  {label}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4 max-lg:grid max-lg:grid-cols-2">
            {HERO_PROOF_CARDS.map((c, i) => (
              <div
                key={c.title}
                className="group relative overflow-hidden rounded-card-lg border border-ink-200 bg-white px-6 py-5 shadow-soft transition-all duration-300 hover:translate-x-1 hover:shadow-floating dark:border-white/10 dark:bg-white/5 dark:shadow-none dark:backdrop-blur-md dark:hover:bg-white/10"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <span className="pointer-events-none absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r from-brand-red to-transparent" />
                <div className="mb-2.5 flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-brand-red-light [&>svg]:h-[18px] [&>svg]:w-[18px] [&>svg]:text-brand-red dark:bg-brand-red/25 dark:[&>svg]:text-brand-red-soft">
                    {c.icon}
                  </div>
                  <h4 className="text-[0.88rem] font-bold text-navy dark:text-white">{c.title}</h4>
                </div>
                <p className="text-[0.8rem] leading-[1.55] text-ink-500 dark:text-white/55">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
