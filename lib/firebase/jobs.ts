import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./config";
import { Job, JobInput, toJobLocation } from "./types";
import { ensureTaxonomyItem } from "./taxonomies";

const JOBS = "jobs";
const jobsCol = () => collection(db, JOBS);
const jobDoc = (id: string) => doc(db, JOBS, id);

function toJob(id: string, data: Record<string, unknown>): Job {
  return {
    id,
    title: (data.title as string) ?? "",
    department: (data.department as string) ?? "",
    location: toJobLocation(data.location),
    type: (data.type as Job["type"]) ?? "Full-Time",
    description: (data.description as string) ?? "",
    requirements: (data.requirements as string[]) ?? [],
    responsibilities: (data.responsibilities as string[]) ?? [],
    applyEmail: (data.applyEmail as string) ?? "",
    active: (data.active as boolean) ?? false,
    createdAt: (data.createdAt as Job["createdAt"]) ?? null,
    updatedAt: (data.updatedAt as Job["updatedAt"]) ?? null,
  };
}

/** Adds the job's city / country to master data if they aren't there yet. */
async function syncLocationTaxonomies(location: JobInput["location"] | undefined) {
  if (!location) return;
  try {
    await Promise.all([
      ensureTaxonomyItem("city", location.city ?? ""),
      ensureTaxonomyItem("country", location.country ?? ""),
    ]);
  } catch {
    // Non-fatal: the job itself was saved; master-data sync is best-effort.
  }
}

export async function createJob(input: JobInput) {
  const ref = await addDoc(jobsCol(), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await syncLocationTaxonomies(input.location);
  return ref;
}

export async function updateJob(id: string, input: Partial<JobInput>) {
  const res = await updateDoc(jobDoc(id), {
    ...input,
    updatedAt: serverTimestamp(),
  });
  await syncLocationTaxonomies(input.location);
  return res;
}

export async function deleteJob(id: string) {
  return deleteDoc(jobDoc(id));
}

export async function getJob(id: string): Promise<Job | null> {
  const snap = await getDoc(jobDoc(id));
  if (!snap.exists()) return null;
  return toJob(snap.id, snap.data());
}

export async function listActiveJobs(): Promise<Job[]> {
  const q = query(
    jobsCol(),
    where("active", "==", true),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toJob(d.id, d.data()));
}

export function subscribeToAllJobs(cb: (jobs: Job[]) => void) {
  const q = query(jobsCol(), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => toJob(d.id, d.data())));
  });
}
