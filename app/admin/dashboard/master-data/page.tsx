"use client";

import { FormEvent, useEffect, useState } from "react";
import AdminShell from "../../components/AdminShell";
import AuthGuard from "../../components/AuthGuard";
import {
  TaxonomyItem,
  TaxonomyKind,
  TAXONOMY_KINDS,
  TAXONOMY_LABELS,
  createTaxonomyItem,
  deleteTaxonomyItem,
  subscribeToTaxonomy,
  updateTaxonomyItem,
} from "@/lib/firebase/taxonomies";
import { useToast } from "../../../components/Toast";

export default function MasterDataPage() {
  return (
    <AuthGuard>
      <Inner />
    </AuthGuard>
  );
}

function Inner() {
  const [active, setActive] = useState<TaxonomyKind>("department");
  return (
    <AdminShell
      eyebrow="Admin · Master Data"
      title="Master data"
      description="Manage the lists shown when creating or editing job postings."
    >
      <div className="mb-5 inline-flex rounded-lg border border-ink-200 bg-white p-1 shadow-soft dark:border-white/10 dark:bg-white/5">
        {TAXONOMY_KINDS.map((kind) => {
          const isActive = kind === active;
          return (
            <button
              key={kind}
              type="button"
              onClick={() => setActive(kind)}
              className={`rounded-md px-4 py-2 text-[0.85rem] font-semibold transition-colors ${
                isActive
                  ? "bg-brand-red text-white"
                  : "text-ink-700 hover:bg-ink-100 dark:text-white/75 dark:hover:bg-white/5"
              }`}
            >
              {TAXONOMY_LABELS[kind].plural}
            </button>
          );
        })}
      </div>

      <TaxonomyManager kind={active} />
    </AdminShell>
  );
}

const PLACEHOLDERS: Record<TaxonomyKind, string> = {
  department: "Engineering",
  city: "Hyderabad",
  country: "India",
  employmentType: "Full-Time",
};

function TaxonomyManager({ kind }: { kind: TaxonomyKind }) {
  const toast = useToast();
  const [items, setItems] = useState<TaxonomyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeToTaxonomy(kind, (next) => {
      setItems(next);
      setLoading(false);
    });
    return unsub;
  }, [kind]);

  useEffect(() => {
    setEditingId(null);
    setEditingName("");
    setNewName("");
  }, [kind]);

  const label = TAXONOMY_LABELS[kind];

  const submitDisabled = submitting || !newName.trim();

  const onCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    if (
      items.some((i) => i.name.toLowerCase() === name.toLowerCase())
    ) {
      toast.error("Already exists", `"${name}" is already in this list.`);
      return;
    }
    setSubmitting(true);
    try {
      await createTaxonomyItem(kind, { name });
      setNewName("");
      toast.success(`${label.singular} added`, `"${name}" was created.`);
    } catch (err) {
      toast.error(
        "Could not add",
        err instanceof Error ? err.message : "Unknown error.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const onSaveEdit = async (item: TaxonomyItem) => {
    const name = editingName.trim();
    if (!name) return;
    if (name === item.name) {
      setEditingId(null);
      return;
    }
    if (
      items.some(
        (i) =>
          i.id !== item.id &&
          i.name.toLowerCase() === name.toLowerCase(),
      )
    ) {
      toast.error("Already exists", `"${name}" is already in this list.`);
      return;
    }
    try {
      await updateTaxonomyItem(item.id, { name });
      toast.success(`${label.singular} updated`, `Renamed to "${name}".`);
      setEditingId(null);
    } catch (err) {
      toast.error(
        "Update failed",
        err instanceof Error ? err.message : "Unknown error.",
      );
    }
  };

  const onToggle = async (item: TaxonomyItem) => {
    try {
      await updateTaxonomyItem(item.id, { active: !item.active });
    } catch (err) {
      toast.error(
        "Could not update",
        err instanceof Error ? err.message : "Unknown error.",
      );
    }
  };

  const onDelete = async (item: TaxonomyItem) => {
    if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    try {
      await deleteTaxonomyItem(item.id);
      toast.success(`${label.singular} deleted`, `"${item.name}" was removed.`);
    } catch (err) {
      toast.error(
        "Delete failed",
        err instanceof Error ? err.message : "Unknown error.",
      );
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="rounded-card-lg border border-ink-200 bg-white shadow-soft dark:border-white/10 dark:bg-white/5">
        <header className="flex items-center justify-between border-b border-ink-200 px-5 py-3.5 dark:border-white/10">
          <h2 className="text-[0.95rem] font-bold text-navy dark:text-white">
            {label.plural}
          </h2>
          <span className="text-[0.78rem] text-ink-500 dark:text-white/55">
            {items.length} item{items.length === 1 ? "" : "s"}
          </span>
        </header>
        {loading ? (
          <div className="px-5 py-10 text-center text-sm text-ink-500 dark:text-white/60">
            Loading…
          </div>
        ) : items.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-ink-500 dark:text-white/60">
            No {label.plural.toLowerCase()} yet. Add the first one →
          </div>
        ) : (
          <ul className="divide-y divide-ink-200 dark:divide-white/10">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-3"
              >
                {editingId === item.id ? (
                  <div className="flex flex-1 flex-wrap items-center gap-2">
                    <input
                      autoFocus
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") onSaveEdit(item);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      className="flex-1 min-w-[180px] rounded-md border-[1.5px] border-ink-200 bg-white px-3 py-1.5 text-[0.9rem] text-navy outline-none focus:border-brand-red dark:border-white/15 dark:bg-white/5 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => onSaveEdit(item)}
                      className="rounded-md bg-brand-red px-3 py-1.5 text-[0.78rem] font-semibold text-white hover:bg-brand-red-dark"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="rounded-md border border-ink-200 px-3 py-1.5 text-[0.78rem] font-semibold text-ink-700 hover:bg-ink-100 dark:border-white/15 dark:text-white/80 dark:hover:bg-white/5"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span
                        className={`text-[0.92rem] font-semibold ${
                          item.active
                            ? "text-navy dark:text-white"
                            : "text-ink-500 line-through dark:text-white/45"
                        }`}
                      >
                        {item.name}
                      </span>
                      {!item.active && (
                        <span className="rounded-full bg-ink-200 px-2 py-0.5 text-[0.68rem] font-semibold text-ink-700 dark:bg-white/10 dark:text-white/60">
                          Hidden
                        </span>
                      )}
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(item.id);
                          setEditingName(item.name);
                        }}
                        className="rounded-md border border-ink-200 px-3 py-1.5 text-[0.76rem] font-semibold text-ink-700 hover:bg-ink-100 dark:border-white/15 dark:text-white/80 dark:hover:bg-white/5"
                      >
                        Rename
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggle(item)}
                        className={`rounded-md border px-3 py-1.5 text-[0.76rem] font-semibold transition-colors ${
                          item.active
                            ? "border-ink-200 text-ink-700 hover:bg-ink-100 dark:border-white/15 dark:text-white/80 dark:hover:bg-white/5"
                            : "border-emerald-500/40 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300"
                        }`}
                      >
                        {item.active ? "Hide" : "Show"}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        className="rounded-md border border-brand-red/40 px-3 py-1.5 text-[0.76rem] font-semibold text-brand-red hover:bg-brand-red hover:text-white dark:text-brand-red-soft"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <aside className="h-fit rounded-card-lg border border-ink-200 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-white/5">
        <h3 className="mb-1 text-[0.95rem] font-bold text-navy dark:text-white">
          Add {label.singular.toLowerCase()}
        </h3>
        <p className="mb-4 text-[0.82rem] text-ink-500 dark:text-white/60">
          {kind === "city" || kind === "country"
            ? `New entries appear as ${label.singular.toLowerCase()} suggestions when creating a job — and any ${label.singular.toLowerCase()} typed on a job is added here automatically.`
            : `New entries appear in the ${label.singular.toLowerCase()} dropdown when creating a job.`}
        </p>
        <form onSubmit={onCreate} className="flex flex-col gap-3">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={`e.g. ${PLACEHOLDERS[kind]}`}
            className="rounded-lg border-[1.5px] border-ink-200 bg-white px-3.5 py-2.5 text-[0.9rem] text-navy outline-none transition-all duration-300 focus:border-brand-red focus:shadow-[0_0_0_3px_rgba(179,9,32,0.1)] dark:border-white/15 dark:bg-white/5 dark:text-white dark:focus:border-brand-red-soft"
          />
          <button
            type="submit"
            disabled={submitDisabled}
            className="rounded-lg bg-brand-red px-5 py-2.5 text-[0.88rem] font-semibold text-white transition-colors hover:bg-brand-red-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Adding…" : `Add ${label.singular.toLowerCase()}`}
          </button>
        </form>
      </aside>
    </div>
  );
}
