import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./config";
import { Blog, BlogInput } from "./types";

const BLOGS = "blogs";
const blogsCol = () => collection(db, BLOGS);
const blogDoc = (id: string) => doc(db, BLOGS, id);

function toBlog(id: string, data: Record<string, unknown>): Blog {
  return {
    id,
    slug: (data.slug as string) ?? "",
    title: (data.title as string) ?? "",
    excerpt: (data.excerpt as string) ?? "",
    content: (data.content as string) ?? "",
    coverImage: (data.coverImage as string) ?? "",
    author: (data.author as string) ?? "",
    tags: (data.tags as string[]) ?? [],
    published: (data.published as boolean) ?? false,
    publishedAt: (data.publishedAt as Blog["publishedAt"]) ?? null,
    createdAt: (data.createdAt as Blog["createdAt"]) ?? null,
    updatedAt: (data.updatedAt as Blog["updatedAt"]) ?? null,
  };
}

export async function createBlog(input: BlogInput) {
  return addDoc(blogsCol(), {
    ...input,
    publishedAt: input.published ? serverTimestamp() : null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateBlog(
  id: string,
  input: Partial<BlogInput>,
  opts: { wasPublished?: boolean } = {},
) {
  const patch: Record<string, unknown> = {
    ...input,
    updatedAt: serverTimestamp(),
  };
  if (typeof input.published === "boolean") {
    if (input.published && !opts.wasPublished) {
      patch.publishedAt = serverTimestamp();
    }
    if (!input.published) {
      patch.publishedAt = null;
    }
  }
  return updateDoc(blogDoc(id), patch);
}

export async function deleteBlog(id: string) {
  return deleteDoc(blogDoc(id));
}

export async function getBlog(id: string): Promise<Blog | null> {
  const snap = await getDoc(blogDoc(id));
  if (!snap.exists()) return null;
  return toBlog(snap.id, snap.data());
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const q = query(
    blogsCol(),
    where("slug", "==", slug),
    where("published", "==", true),
    limit(1),
  );
  const snap = await getDocs(q);
  const d = snap.docs[0];
  return d ? toBlog(d.id, d.data()) : null;
}

export async function listPublishedBlogs(): Promise<Blog[]> {
  const q = query(
    blogsCol(),
    where("published", "==", true),
    orderBy("publishedAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toBlog(d.id, d.data()));
}

export function subscribeToAllBlogs(cb: (blogs: Blog[]) => void) {
  const q = query(blogsCol(), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => toBlog(d.id, d.data())));
  });
}

export function formatBlogDate(t: Timestamp | null): string {
  if (!t) return "";
  return t.toDate().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
