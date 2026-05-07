"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { FirebaseError } from "firebase/app";
import { useAuth } from "../components/AuthProvider";
import { login } from "@/lib/firebase/auth";

const AUTH_ERRORS: Record<string, string> = {
  "auth/invalid-email": "That email address looks invalid.",
  "auth/invalid-credential": "Email or password is incorrect.",
  "auth/user-not-found": "No account exists for that email.",
  "auth/wrong-password": "Email or password is incorrect.",
  "auth/too-many-requests": "Too many attempts. Try again in a few minutes.",
};

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) router.replace("/admin/dashboard");
  }, [loading, user, router]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      router.replace("/admin/dashboard");
    } catch (err) {
      const code = err instanceof FirebaseError ? err.code : "";
      setError(AUTH_ERRORS[code] ?? "Sign-in failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-ink-500 dark:text-white/60">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-[420px] rounded-card-lg border border-ink-200 bg-white p-9 shadow-soft dark:border-white/10 dark:bg-white/5">
        <div className="mb-7">
          <span className="mb-2 inline-block text-[0.72rem] font-bold uppercase tracking-[0.13em] text-brand-red dark:text-brand-red-soft">
            Admin Portal
          </span>
          <h1 className="text-2xl font-extrabold tracking-[-0.01em] text-navy dark:text-white">
            Sign in
          </h1>
          <p className="mt-1 text-[0.85rem] text-ink-500 dark:text-white/60">
            HR &amp; recruiting team access only.
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-[0.82rem] font-semibold text-ink-700 dark:text-white/75"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border-[1.5px] border-ink-200 bg-white px-3.5 py-2.5 text-[0.9rem] text-navy outline-none transition-all duration-300 focus:border-brand-red focus:shadow-[0_0_0_3px_rgba(179,9,32,0.1)] dark:border-white/15 dark:bg-white/5 dark:text-white dark:focus:border-brand-red-soft dark:focus:shadow-[0_0_0_3px_rgba(232,74,95,0.18)]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-[0.82rem] font-semibold text-ink-700 dark:text-white/75"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border-[1.5px] border-ink-200 bg-white px-3.5 py-2.5 text-[0.9rem] text-navy outline-none transition-all duration-300 focus:border-brand-red focus:shadow-[0_0_0_3px_rgba(179,9,32,0.1)] dark:border-white/15 dark:bg-white/5 dark:text-white dark:focus:border-brand-red-soft dark:focus:shadow-[0_0_0_3px_rgba(232,74,95,0.18)]"
            />
          </div>

          {error && (
            <div className="rounded-md border border-brand-red/30 bg-brand-red/10 px-3 py-2 text-[0.82rem] text-brand-red dark:text-brand-red-soft">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 inline-flex items-center justify-center rounded-lg bg-brand-red px-7 py-3 text-[0.95rem] font-semibold text-white transition-all duration-300 hover:bg-brand-red-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
