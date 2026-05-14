"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AdminShell from "../../../../components/AdminShell";
import AuthGuard from "../../../../components/AuthGuard";
import BlogForm from "../../../BlogForm";
import { getBlog } from "@/lib/firebase/blogs";
import { Blog } from "@/lib/firebase/types";

export default function EditBlogPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const b = await getBlog(id);
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
  }, [id]);

  return (
    <AuthGuard>
      <AdminShell
        eyebrow="Admin · Blog"
        title={blog ? `Edit · ${blog.title}` : "Edit post"}
        description={blog ? `By ${blog.author}` : "Update post details."}
        actions={
          <div className="flex flex-wrap gap-2">
            {blog?.published && (
              <Link
                href={`/blog/${blog.slug}`}
                target="_blank"
                className="rounded-lg border border-ink-200 bg-white px-4 py-2 text-[0.85rem] font-semibold text-ink-700 transition-colors hover:bg-ink-100 dark:border-white/15 dark:bg-transparent dark:text-white/80 dark:hover:bg-white/5"
              >
                View live
              </Link>
            )}
            <Link
              href="/admin/dashboard/blogs"
              className="rounded-lg border border-ink-200 bg-white px-4 py-2 text-[0.85rem] font-semibold text-ink-700 transition-colors hover:bg-ink-100 dark:border-white/15 dark:bg-transparent dark:text-white/80 dark:hover:bg-white/5"
            >
              ← Back to posts
            </Link>
          </div>
        }
      >
        {loading ? (
          <div className="rounded-card-lg border border-ink-200 bg-white px-6 py-10 text-center text-sm text-ink-500 shadow-soft dark:border-white/10 dark:bg-white/5 dark:text-white/60">
            Loading post…
          </div>
        ) : error ? (
          <div className="rounded-card-lg border border-brand-red/30 bg-brand-red/10 px-5 py-6 text-center text-[0.9rem] text-brand-red dark:text-brand-red-soft">
            {error}
          </div>
        ) : (
          <BlogForm initial={blog} />
        )}
      </AdminShell>
    </AuthGuard>
  );
}
