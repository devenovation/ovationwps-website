"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ArrowRightIcon } from "../constants";
import { formatBlogDate, listPublishedBlogs } from "@/lib/firebase/blogs";
import { Blog } from "@/lib/firebase/types";

export default function BlogIndexPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await listPublishedBlogs();
        if (!cancelled) setBlogs(data);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Could not load posts.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const [featured, ...rest] = blogs;

  return (
    <>
      <Navbar />
      <main className="bg-white dark:bg-navy-deep">
        <section className="relative overflow-hidden bg-white pt-[140px] pb-12 max-md:pt-[112px] max-md:pb-8 dark:bg-navy-deep">
          <div className="mx-auto max-w-[1200px] px-7">
            <span className="mb-5 inline-block text-[0.72rem] font-bold uppercase tracking-[0.18em] text-brand-red dark:text-brand-red-soft">
              Ovation Blog
            </span>
            <h1 className="max-w-[820px] text-[clamp(2.2rem,5vw,3.8rem)] font-black leading-[1.05] tracking-[-0.035em] text-navy dark:text-white">
              Field notes from the
              <br />
              global delivery floor.
            </h1>
            <p className="mt-6 max-w-[620px] text-[1.05rem] leading-[1.7] text-ink-500 dark:text-white/65">
              Operational playbooks, customer stories, and what we&rsquo;re
              learning while running break/fix, depot, and dispatch in 44+
              countries.
            </p>
          </div>
        </section>

        <section className="relative overflow-hidden bg-white pb-[110px] max-md:pb-20 dark:bg-navy-deep">
          <div className="mx-auto max-w-[1200px] px-7">
            {loading ? (
              <div className="rounded-[20px] border border-ink-200 bg-ink-100/60 px-6 py-16 text-center text-sm text-ink-500 dark:border-white/10 dark:bg-white/5 dark:text-white/60">
                Loading posts…
              </div>
            ) : error ? (
              <div className="rounded-[20px] border border-brand-red/30 bg-brand-red/10 px-5 py-6 text-center text-[0.9rem] text-brand-red dark:text-brand-red-soft">
                {error}
              </div>
            ) : blogs.length === 0 ? (
              <div className="rounded-[20px] border border-ink-200 bg-ink-100/60 px-6 py-16 text-center dark:border-white/10 dark:bg-white/5">
                <h3 className="mb-2 text-xl font-extrabold text-navy dark:text-white">
                  No posts yet
                </h3>
                <p className="text-[0.9rem] text-ink-500 dark:text-white/60">
                  Check back soon — new field notes are on the way.
                </p>
              </div>
            ) : (
              <>
                {featured && <FeaturedCard blog={featured} />}
                {rest.length > 0 && (
                  <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {rest.map((b) => (
                      <BlogCard key={b.id} blog={b} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function FeaturedCard({ blog }: { blog: Blog }) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group grid items-stretch overflow-hidden rounded-[24px] border border-ink-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-red/40 hover:shadow-[0_18px_40px_rgba(15,30,60,0.08)] lg:grid-cols-[1.1fr_1fr] dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-brand-red-soft/40 dark:hover:shadow-[0_18px_40px_rgba(0,0,0,0.5)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-100 lg:aspect-auto dark:bg-white/[0.04]">
        {blog.coverImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="eager"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-navy via-[#1a1840] to-[#3b1d6e] text-white">
            <span className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-white/70">
              Ovation Blog
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center gap-4 p-8 lg:p-12">
        <span className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-brand-red dark:text-brand-red-soft">
          Featured
        </span>
        <h2 className="text-[clamp(1.5rem,2.4vw,2rem)] font-extrabold leading-[1.2] tracking-[-0.02em] text-navy transition-colors group-hover:text-brand-red dark:text-white dark:group-hover:text-brand-red-soft">
          {blog.title}
        </h2>
        <p className="text-[1rem] leading-[1.7] text-ink-500 dark:text-white/65">
          {blog.excerpt}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.85rem]">
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
        <span className="mt-3 inline-flex items-center gap-2 text-[0.9rem] font-semibold text-brand-red dark:text-brand-red-soft">
          Read the post
          {ArrowRightIcon}
        </span>
      </div>
    </Link>
  );
}

function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group flex flex-col overflow-hidden rounded-[20px] border border-ink-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-red/40 hover:shadow-[0_18px_40px_rgba(15,30,60,0.08)] dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-brand-red-soft/40 dark:hover:shadow-[0_18px_40px_rgba(0,0,0,0.5)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-100 dark:bg-white/[0.04]">
        {blog.coverImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-navy via-[#1a1840] to-[#3b1d6e] text-white">
            <span className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-white/70">
              Ovation Blog
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        {blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {blog.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-full bg-brand-red-light px-2.5 py-1 text-[0.7rem] font-semibold tracking-[0.04em] text-brand-red dark:bg-brand-red/25 dark:text-brand-red-soft"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        <h3 className="text-[1.15rem] font-extrabold leading-[1.3] tracking-[-0.01em] text-navy transition-colors group-hover:text-brand-red dark:text-white dark:group-hover:text-brand-red-soft">
          {blog.title}
        </h3>
        <p className="text-[0.92rem] leading-[1.65] text-ink-500 dark:text-white/65">
          {blog.excerpt}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-[0.82rem]">
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
    </Link>
  );
}
