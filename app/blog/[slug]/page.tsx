"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { ArrowRightIcon } from "../../constants";
import { formatBlogDate, getBlogBySlug } from "@/lib/firebase/blogs";
import { Blog } from "@/lib/firebase/types";

type Block =
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "p"; text: string };

function parseContent(raw: string): Block[] {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let buf: string[] = [];
  let listBuf: string[] = [];

  const flushPara = () => {
    if (buf.length === 0) return;
    blocks.push({ kind: "p", text: buf.join(" ").trim() });
    buf = [];
  };
  const flushList = () => {
    if (listBuf.length === 0) return;
    blocks.push({ kind: "ul", items: listBuf });
    listBuf = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (line.trim() === "") {
      flushPara();
      flushList();
      continue;
    }
    if (line.startsWith("## ")) {
      flushPara();
      flushList();
      blocks.push({ kind: "h2", text: line.slice(3).trim() });
      continue;
    }
    if (line.startsWith("### ")) {
      flushPara();
      flushList();
      blocks.push({ kind: "h3", text: line.slice(4).trim() });
      continue;
    }
    if (line.startsWith("- ")) {
      flushPara();
      listBuf.push(line.slice(2).trim());
      continue;
    }
    flushList();
    buf.push(line.trim());
  }
  flushPara();
  flushList();
  return blocks;
}

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      try {
        const b = await getBlogBySlug(slug);
        if (!cancelled) {
          if (!b) setError("This post no longer exists.");
          else setBlog(b);
        }
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Could not load post.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const blocks = useMemo(
    () => (blog ? parseContent(blog.content) : []),
    [blog],
  );

  return (
    <>
      <Navbar />
      <main className="bg-white dark:bg-navy-deep">
        {loading ? (
          <div className="mx-auto max-w-[720px] px-7 pt-[180px] pb-24 text-center text-sm text-ink-500 dark:text-white/60">
            Loading post…
          </div>
        ) : error || !blog ? (
          <div className="mx-auto max-w-[720px] px-7 pt-[180px] pb-24 text-center">
            <h1 className="mb-3 text-[clamp(1.8rem,3vw,2.4rem)] font-extrabold tracking-[-0.02em] text-navy dark:text-white">
              Post not found
            </h1>
            <p className="mb-6 text-[0.95rem] text-ink-500 dark:text-white/60">
              {error || "The post you're looking for may have moved."}
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full bg-brand-red px-6 py-3 text-[0.9rem] font-semibold text-white transition-colors hover:bg-brand-red-dark"
            >
              ← Back to the blog
            </Link>
          </div>
        ) : (
          <article>
            <section className="relative overflow-hidden bg-white pt-[140px] pb-12 max-md:pt-[112px] max-md:pb-8 dark:bg-navy-deep">
              <div className="mx-auto max-w-[820px] px-7">
                <Link
                  href="/blog"
                  className="mb-7 inline-flex items-center gap-1.5 text-[0.85rem] font-semibold text-brand-red transition-colors hover:underline dark:text-brand-red-soft"
                >
                  ← All posts
                </Link>
                {blog.tags.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {blog.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-brand-red-light px-2.5 py-1 text-[0.7rem] font-semibold tracking-[0.04em] text-brand-red dark:bg-brand-red/25 dark:text-brand-red-soft"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <h1 className="text-[clamp(2rem,4.5vw,3.4rem)] font-black leading-[1.08] tracking-[-0.03em] text-navy dark:text-white">
                  {blog.title}
                </h1>
                <p className="mt-5 text-[1.1rem] leading-[1.7] text-ink-500 dark:text-white/65">
                  {blog.excerpt}
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.9rem]">
                  <span className="font-semibold text-navy dark:text-white">
                    {blog.author}
                  </span>
                  {blog.publishedAt && (
                    <>
                      <span className="text-ink-300 dark:text-white/30">·</span>
                      <span className="text-ink-500 dark:text-white/55">
                        {formatBlogDate(blog.publishedAt)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </section>

            {blog.coverImage && (
              <section className="bg-white pb-12 dark:bg-navy-deep">
                <div className="mx-auto max-w-[1100px] px-7">
                  <div className="overflow-hidden rounded-[24px] ring-1 ring-black/5 dark:ring-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="h-full w-full object-cover"
                      loading="eager"
                    />
                  </div>
                </div>
              </section>
            )}

            <section className="relative overflow-hidden bg-white pb-[100px] max-md:pb-16 dark:bg-navy-deep">
              <div className="mx-auto max-w-[760px] px-7">
                <div className="flex flex-col gap-5 text-[1.05rem] leading-[1.8] text-ink-700 dark:text-white/80">
                  {blocks.map((b, i) => {
                    if (b.kind === "h2") {
                      return (
                        <h2
                          key={i}
                          className="mt-6 text-[clamp(1.4rem,2.2vw,1.8rem)] font-extrabold leading-[1.25] tracking-[-0.015em] text-navy dark:text-white"
                        >
                          {b.text}
                        </h2>
                      );
                    }
                    if (b.kind === "h3") {
                      return (
                        <h3
                          key={i}
                          className="mt-4 text-[1.2rem] font-bold leading-[1.3] tracking-[-0.01em] text-navy dark:text-white"
                        >
                          {b.text}
                        </h3>
                      );
                    }
                    if (b.kind === "ul") {
                      return (
                        <ul key={i} className="list-disc space-y-2 pl-6">
                          {b.items.map((it, j) => (
                            <li key={j}>{it}</li>
                          ))}
                        </ul>
                      );
                    }
                    return <p key={i}>{b.text}</p>;
                  })}
                </div>
              </div>
            </section>

            <section className="border-t border-ink-200 bg-ink-100 py-[80px] max-md:py-16 dark:border-white/10 dark:bg-navy">
              <div className="mx-auto max-w-[720px] px-7 text-center">
                <span className="mb-3 inline-block text-[0.72rem] font-bold uppercase tracking-[0.18em] text-brand-red dark:text-brand-red-soft">
                  Keep reading
                </span>
                <h2 className="mb-6 text-[clamp(1.5rem,3vw,2.2rem)] font-extrabold leading-[1.2] tracking-[-0.02em] text-navy dark:text-white">
                  More field notes from Ovation
                </h2>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-red px-7 py-3.5 text-[0.95rem] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-red-dark hover:shadow-[0_10px_28px_rgba(179,9,32,0.35)]"
                >
                  Back to the blog
                  {ArrowRightIcon}
                </Link>
              </div>
            </section>
          </article>
        )}
      </main>
      <Footer />
    </>
  );
}
