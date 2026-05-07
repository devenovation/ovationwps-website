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
import { Job, JobInput } from "./types";

const JOBS = "jobs";
const jobsCol = () => collection(db, JOBS);
const jobDoc = (id: string) => doc(db, JOBS, id);

function toJob(id: string, data: Record<string, unknown>): Job {
  return {
    id,
    title: (data.title as string) ?? "",
    department: (data.department as string) ?? "",
    location: (data.location as string) ?? "",
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

export async function createJob(input: JobInput) {
  return addDoc(jobsCol(), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateJob(id: string, input: Partial<JobInput>) {
  return updateDoc(jobDoc(id), { ...input, updatedAt: serverTimestamp() });
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
