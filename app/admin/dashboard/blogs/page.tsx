"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AdminShell from "../../components/AdminShell";
import AuthGuard from "../../components/AuthGuard";
import {
  deleteBlog,
  formatBlogDate,
  subscribeToAllBlogs,
  updateBlog,
} from "@/lib/firebase/blogs";
import { Blog } from "@/lib/firebase/types";
import { useToast } from "../../../components/Toast";

export default function BlogsPage() {
  return (
    <AuthGuard>
      <BlogsInner />
    </AuthGuard>
  );
}

function BlogsInner() {
  const toast = useToast();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToAllBlogs((next) => {
      setBlogs(next);
      setLoading(false);
    });
    return unsub;
  }, []);

  const summary = useMemo(() => {
    const published = blogs.filter((b) => b.published).length;
    return {
      total: blogs.length,
      published,
      draft: blogs.length - published,
    };
  }, [blogs]);

  const onTogglePublished = async (blog: Blog) => {
    const next = !blog.published;
    try {
      await updateBlog(
        blog.id,
        { published: next },
        { wasPublished: blog.published },
      );
      toast.success(
        next ? "Post published" : "Post unpublished",
        next
          ? `"${blog.title}" is now visible on the blog.`
          : `"${blog.title}" is now hidden as a draft.`,
      );
    } catch (err) {
      toast.error(
        "Could not update status",
        err instanceof Error ? err.message : "Unknown error.",
      );
    }
  };

  const onDelete = async (blog: Blog) => {
    if (!confirm(`Delete "${blog.title}"? This cannot be undone.`)) return;
    try {
      await deleteBlog(blog.id);
      toast.success("Post deleted", `"${blog.title}" was removed.`);
    } catch (err) {
      toast.error(
        "Delete failed",
        err instanceof Error ? err.message : "Unknown error.",
      );
    }
  };

  return (
    <AdminShell
      eyebrow="Admin · Blog"
      title="Blog posts"
      description="Write, edit, and publish posts that appear on the public blog."
      actions={
        <Link
          href="/admin/dashboard/blogs/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-red px-5 py-2.5 text-[0.9rem] font-semibold text-white transition-colors hover:bg-brand-red-dark"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          New post
        </Link>
      }
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Total posts" value={summary.total} />
        <Stat label="Published" value={summary.published} />
        <Stat label="Draft" value={summary.draft} />
      </div>

      <div className="overflow-hidden rounded-card-lg border border-ink-200 bg-white shadow-soft dark:border-white/10 dark:bg-white/5">
        {loading ? (
          <div className="px-6 py-10 text-center text-sm text-ink-500 dark:text-white/60">
            Loading posts…
          </div>
        ) : blogs.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="mb-2 text-base font-bold text-navy dark:text-white">
              No posts yet
            </p>
            <p className="mb-5 text-sm text-ink-500 dark:text-white/60">
              Write your first post to start building the Ovation blog.
            </p>
            <Link
              href="/admin/dashboard/blogs/new"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-red px-5 py-2.5 text-[0.9rem] font-semibold text-white transition-colors hover:bg-brand-red-dark"
            >
              + New post
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[0.9rem]">
              <thead className="bg-ink-100 text-[0.72rem] uppercase tracking-wider text-ink-700 dark:bg-white/5 dark:text-white/60">
                <tr>
                  <th className="px-5 py-3 font-semibold">Title</th>
                  <th className="px-5 py-3 font-semibold">Author</th>
                  <th className="px-5 py-3 font-semibold">Published</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200 dark:divide-white/10">
                {blogs.map((blog) => (
                  <tr key={blog.id} className="text-navy dark:text-white/90">
                    <td className="px-5 py-3">
                      <div className="font-semibold">{blog.title}</div>
                      <div className="text-[0.78rem] text-ink-500 dark:text-white/55">
                        /blog/{blog.slug}
                      </div>
                    </td>
                    <td className="px-5 py-3">{blog.author}</td>
                    <td className="px-5 py-3 text-[0.85rem] text-ink-500 dark:text-white/60">
                      {formatBlogDate(blog.publishedAt) || "—"}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        type="button"
                        onClick={() => onTogglePublished(blog)}
                        className={`rounded-full px-2.5 py-1 text-[0.72rem] font-semibold ${
                          blog.published
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                            : "bg-ink-200 text-ink-700 dark:bg-white/10 dark:text-white/70"
                        }`}
                      >
                        {blog.published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex gap-2">
                        {blog.published && (
                          <Link
                            href={`/blog/${blog.slug}`}
                            target="_blank"
                            className="rounded-md border border-ink-200 px-3 py-1.5 text-[0.78rem] font-semibold text-ink-700 transition-colors hover:bg-ink-100 dark:border-white/15 dark:text-white/80 dark:hover:bg-white/5"
                          >
                            View
                          </Link>
                        )}
                        <Link
                          href={`/admin/dashboard/blogs/${blog.id}/edit`}
                          className="rounded-md border border-ink-200 px-3 py-1.5 text-[0.78rem] font-semibold text-ink-700 transition-colors hover:bg-ink-100 dark:border-white/15 dark:text-white/80 dark:hover:bg-white/5"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => onDelete(blog)}
                          className="rounded-md border border-brand-red/40 px-3 py-1.5 text-[0.78rem] font-semibold text-brand-red transition-colors hover:bg-brand-red hover:text-white dark:text-brand-red-soft"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-card-lg border border-ink-200 bg-white px-5 py-4 shadow-soft dark:border-white/10 dark:bg-white/5">
      <div className="text-[0.72rem] font-bold uppercase tracking-[0.13em] text-ink-500 dark:text-white/55">
        {label}
      </div>
      <div className="mt-1 text-2xl font-extrabold text-navy dark:text-white">
        {value}
      </div>
    </div>
  );
}
