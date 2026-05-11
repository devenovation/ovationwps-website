import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./config";

export type TaxonomyKind = "department" | "location" | "employmentType";

export const TAXONOMY_KINDS: TaxonomyKind[] = [
  "department",
  "location",
  "employmentType",
];

export const TAXONOMY_LABELS: Record<TaxonomyKind, { singular: string; plural: string }> = {
  department: { singular: "Department", plural: "Departments" },
  location: { singular: "Location", plural: "Locations" },
  employmentType: { singular: "Employment type", plural: "Employment types" },
};

export interface TaxonomyItem {
  id: string;
  kind: TaxonomyKind;
  name: string;
  active: boolean;
  order: number;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export type TaxonomyInput = {
  name: string;
  active?: boolean;
  order?: number;
};

const COL = "taxonomies";
const colRef = () => collection(db, COL);
const itemDoc = (id: string) => doc(db, COL, id);

function toItem(id: string, data: Record<string, unknown>): TaxonomyItem {
  return {
    id,
    kind: (data.kind as TaxonomyKind) ?? "department",
    name: (data.name as string) ?? "",
    active: (data.active as boolean) ?? true,
    order: (data.order as number) ?? 0,
    createdAt: (data.createdAt as TaxonomyItem["createdAt"]) ?? null,
    updatedAt: (data.updatedAt as TaxonomyItem["updatedAt"]) ?? null,
  };
}

export async function createTaxonomyItem(
  kind: TaxonomyKind,
  input: TaxonomyInput,
) {
  return addDoc(colRef(), {
    kind,
    name: input.name.trim(),
    active: input.active ?? true,
    order: input.order ?? Date.now(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateTaxonomyItem(
  id: string,
  input: Partial<TaxonomyInput>,
) {
  const patch: Record<string, unknown> = { updatedAt: serverTimestamp() };
  if (input.name !== undefined) patch.name = input.name.trim();
  if (input.active !== undefined) patch.active = input.active;
  if (input.order !== undefined) patch.order = input.order;
  return updateDoc(itemDoc(id), patch);
}

export async function deleteTaxonomyItem(id: string) {
  return deleteDoc(itemDoc(id));
}

export function subscribeToTaxonomy(
  kind: TaxonomyKind,
  cb: (items: TaxonomyItem[]) => void,
) {
  const q = query(colRef(), where("kind", "==", kind));
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => toItem(d.id, d.data()));
    items.sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return a.name.localeCompare(b.name);
    });
    cb(items);
  });
}

export function subscribeToAllTaxonomies(
  cb: (items: TaxonomyItem[]) => void,
) {
  const q = query(colRef(), orderBy("kind"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => toItem(d.id, d.data())));
  });
}
