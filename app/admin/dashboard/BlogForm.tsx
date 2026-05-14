"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Blog, BlogInput, slugify } from "@/lib/firebase/types";
import { createBlog, updateBlog } from "@/lib/firebase/blogs";
import { useToast } from "../../components/Toast";

interface Props {
  initial?: Blog | null;
}

const EMPTY: BlogInput = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  coverImage: "",
  author: "",
  tags: [],
  published: false,
};

const inputClass =
  "rounded-lg border-[1.5px] border-ink-200 bg-white px-3.5 py-2.5 text-[0.9rem] text-navy outline-none transition-all duration-300 focus:border-brand-red focus:shadow-[0_0_0_3px_rgba(179,9,32,0.1)] dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus:border-brand-red-soft";
const labelClass =
  "text-[0.82rem] font-semibold text-ink-700 dark:text-white/75";

const tagsToArray = (text: string) =>
  text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

export default function BlogForm({ initial }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [form, setForm] = useState<BlogInput>(EMPTY);
  const [tagsText, setTagsText] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setForm({
        slug: initial.slug,
        title: initial.title,
        excerpt: initial.excerpt,
        content: initial.content,
        coverImage: initial.coverImage,
        author: initial.author,
        tags: initial.tags,
        published: initial.published,
      });
      setTagsText(initial.tags.join(", "));
      setSlugTouched(true);
    }
  }, [initial]);

  const update = <K extends keyof BlogInput>(key: K, value: BlogInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const onTitleChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: slugTouched ? prev.slug : slugify(value),
    }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const payload: BlogInput = {
      ...form,
      title: form.title.trim(),
      slug: (form.slug || slugify(form.title)).trim(),
      excerpt: form.excerpt.trim(),
      content: form.content.trim(),
      coverImage: form.coverImage.trim(),
      author: form.author.trim(),
      tags: tagsToArray(tagsText),
    };
    if (!payload.slug) {
      setError("Slug is required.");
      setSubmitting(false);
      return;
    }
    try {
      if (initial) {
        await updateBlog(initial.id, payload, {
          wasPublished: initial.published,
        });
        toast.success("Blog updated", `"${payload.title}" was saved.`);
      } else {
        await createBlog(payload);
        toast.success(
          "Blog created",
          payload.published
            ? `"${payload.title}" is now live on the blog.`
            : `"${payload.title}" was saved as a draft.`,
        );
      }
      router.push("/admin/dashboard/blogs");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not save post.";
      setError(msg);
      toast.error(initial ? "Update failed" : "Create failed", msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-6 rounded-card-lg border border-ink-200 bg-white p-7 shadow-soft dark:border-white/10 dark:bg-white/5"
    >
      <section className="flex flex-col gap-4">
        <h2 className="text-[0.78rem] font-bold uppercase tracking-[0.13em] text-ink-500 dark:text-white/55">
          Post basics
        </h2>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className={labelClass}>
            Title
          </label>
          <input
            id="title"
            required
            value={form.title}
            onChange={(e) => onTitleChange(e.target.value)}
            className={inputClass}
            placeholder="How Ovation deploys 52,000 technicians in 44 countries"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="slug" className={labelClass}>
              URL slug
            </label>
            <input
              id="slug"
              required
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                update("slug", slugify(e.target.value));
              }}
              placeholder="how-ovation-deploys-technicians"
              className={inputClass}
            />
            <p className="text-[0.74rem] text-ink-500 dark:text-white/55">
              Used in the public URL: /blog/{form.slug || "your-slug"}
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="author" className={labelClass}>
              Author
            </label>
            <input
              id="author"
              required
              value={form.author}
              onChange={(e) => update("author", e.target.value)}
              className={inputClass}
              placeholder="Jane Smith"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="coverImage" className={labelClass}>
            Cover image URL
          </label>
          <input
            id="coverImage"
            type="url"
            value={form.coverImage}
            onChange={(e) => update("coverImage", e.target.value)}
            className={inputClass}
            placeholder="https://images.unsplash.com/..."
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="tags" className={labelClass}>
            Tags{" "}
            <span className="font-normal text-ink-500 dark:text-white/50">
              (comma-separated)
            </span>
          </label>
          <input
            id="tags"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            placeholder="Field Services, Operations, MSP"
            className={inputClass}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-[0.78rem] font-bold uppercase tracking-[0.13em] text-ink-500 dark:text-white/55">
          Content
        </h2>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="excerpt" className={labelClass}>
            Excerpt{" "}
            <span className="font-normal text-ink-500 dark:text-white/50">
              (shown on the blog list)
            </span>
          </label>
          <textarea
            id="excerpt"
            required
            value={form.excerpt}
            onChange={(e) => update("excerpt", e.target.value)}
            className={`${inputClass} min-h-[80px] resize-y`}
            placeholder="A one or two sentence summary that hooks the reader."
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="content" className={labelClass}>
            Body
          </label>
          <p className="-mt-0.5 text-[0.74rem] text-ink-500 dark:text-white/55">
            Markdown-lite: blank line = paragraph break, lines starting with{" "}
            <code>## </code> become headings, lines starting with <code>- </code>{" "}
            become bullets.
          </p>
          <textarea
            id="content"
            required
            value={form.content}
            onChange={(e) => update("content", e.target.value)}
            className={`${inputClass} min-h-[320px] resize-y font-mono text-[0.85rem]`}
            placeholder={`## The challenge\n\nWhen a Fortune 500 retailer needs 1,200 stores refreshed in 90 days, you can't hire your way out.\n\n## What we did\n\n- Stood up regional dispatch hubs\n- Pre-staged kit in 14 depots\n- Locked SLAs at the store level`}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-[0.78rem] font-bold uppercase tracking-[0.13em] text-ink-500 dark:text-white/55">
          Visibility
        </h2>
        <label className="flex items-center gap-2 text-[0.88rem] text-ink-700 dark:text-white/75">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => update("published", e.target.checked)}
            className="h-4 w-4 accent-brand-red"
          />
          Publish (visible on the public blog)
        </label>
      </section>

      {error && (
        <div className="rounded-md border border-brand-red/30 bg-brand-red/10 px-3 py-2 text-[0.82rem] text-brand-red dark:text-brand-red-soft">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-ink-200 pt-5 dark:border-white/10">
        <Link
          href="/admin/dashboard/blogs"
          className="rounded-lg border border-ink-200 bg-white px-5 py-2.5 text-[0.9rem] font-semibold text-ink-700 transition-colors hover:bg-ink-100 dark:border-white/15 dark:bg-transparent dark:text-white/80 dark:hover:bg-white/5"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-brand-red px-5 py-2.5 text-[0.9rem] font-semibold text-white transition-colors hover:bg-brand-red-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Saving…" : initial ? "Save changes" : "Create post"}
        </button>
      </div>
    </form>
  );
}
