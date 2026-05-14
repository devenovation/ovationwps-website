"use client";

import Link from "next/link";
import AdminShell from "../../../components/AdminShell";
import AuthGuard from "../../../components/AuthGuard";
import BlogForm from "../../BlogForm";

export default function NewBlogPage() {
  return (
    <AuthGuard>
      <AdminShell
        eyebrow="Admin · Blog"
        title="Write a new post"
        description="Draft now, publish when ready. Published posts appear on the public blog."
        actions={
          <Link
            href="/admin/dashboard/blogs"
            className="rounded-lg border border-ink-200 bg-white px-4 py-2 text-[0.85rem] font-semibold text-ink-700 transition-colors hover:bg-ink-100 dark:border-white/15 dark:bg-transparent dark:text-white/80 dark:hover:bg-white/5"
          >
            ← Back to posts
          </Link>
        }
      >
        <BlogForm />
      </AdminShell>
    </AuthGuard>
  );
}
