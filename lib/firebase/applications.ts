import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./config";

export type WorkAuth =
  | "US Citizen"
  | "Green Card / Permanent Resident"
  | "H1B"
  | "OPT / CPT"
  | "Other"
  | "Need Sponsorship";

export const WORK_AUTH_OPTIONS: WorkAuth[] = [
  "US Citizen",
  "Green Card / Permanent Resident",
  "H1B",
  "OPT / CPT",
  "Other",
  "Need Sponsorship",
];

export type HearAboutSource =
  | "LinkedIn"
  | "Referral"
  | "Company Website"
  | "Job Board"
  | "Recruiter"
  | "Event"
  | "Other";

export const HEAR_ABOUT_OPTIONS: HearAboutSource[] = [
  "LinkedIn",
  "Referral",
  "Company Website",
  "Job Board",
  "Recruiter",
  "Event",
  "Other",
];

export interface ApplicationInput {
  jobId: string;
  jobTitle: string;
  jobDepartment: string;

  fullName: string;
  email: string;
  phone: string;
  city: string;
  country: string;

  linkedinUrl: string;
  resumeUrl: string;
  portfolioUrl: string;

  currentCompany: string;
  currentTitle: string;
  yearsExperience: number;
  noticePeriodDays: number;
  expectedSalary: string;
  willingToRelocate: boolean;
  workAuthorization: WorkAuth;

  coverLetter: string;
  hearAbout: HearAboutSource;
  referralName: string;

  consent: boolean;
}

export interface Application extends ApplicationInput {
  id: string;
  status: "new" | "reviewing" | "interviewing" | "offer" | "rejected";
  createdAt: Timestamp | null;
}

const COL = "applications";
const colRef = () => collection(db, COL);

export async function createApplication(input: ApplicationInput) {
  return addDoc(colRef(), {
    ...input,
    status: "new" as Application["status"],
    createdAt: serverTimestamp(),
  });
}

function toApplication(id: string, data: Record<string, unknown>): Application {
  return {
    id,
    jobId: (data.jobId as string) ?? "",
    jobTitle: (data.jobTitle as string) ?? "",
    jobDepartment: (data.jobDepartment as string) ?? "",
    fullName: (data.fullName as string) ?? "",
    email: (data.email as string) ?? "",
    phone: (data.phone as string) ?? "",
    city: (data.city as string) ?? "",
    country: (data.country as string) ?? "",
    linkedinUrl: (data.linkedinUrl as string) ?? "",
    resumeUrl: (data.resumeUrl as string) ?? "",
    portfolioUrl: (data.portfolioUrl as string) ?? "",
    currentCompany: (data.currentCompany as string) ?? "",
    currentTitle: (data.currentTitle as string) ?? "",
    yearsExperience: (data.yearsExperience as number) ?? 0,
    noticePeriodDays: (data.noticePeriodDays as number) ?? 0,
    expectedSalary: (data.expectedSalary as string) ?? "",
    willingToRelocate: (data.willingToRelocate as boolean) ?? false,
    workAuthorization:
      (data.workAuthorization as WorkAuth) ?? "Need Sponsorship",
    coverLetter: (data.coverLetter as string) ?? "",
    hearAbout: (data.hearAbout as HearAboutSource) ?? "Other",
    referralName: (data.referralName as string) ?? "",
    consent: (data.consent as boolean) ?? false,
    status: (data.status as Application["status"]) ?? "new",
    createdAt: (data.createdAt as Application["createdAt"]) ?? null,
  };
}

export function subscribeToAllApplications(
  cb: (apps: Application[]) => void,
) {
  const q = query(colRef(), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => toApplication(d.id, d.data())));
  });
}

export function subscribeToApplicationsForJob(
  jobId: string,
  cb: (apps: Application[]) => void,
) {
  const q = query(colRef(), where("jobId", "==", jobId));
  return onSnapshot(q, (snap) => {
    const apps = snap.docs.map((d) => toApplication(d.id, d.data()));
    apps.sort((a, b) => {
      const ta = a.createdAt?.toMillis?.() ?? 0;
      const tb = b.createdAt?.toMillis?.() ?? 0;
      return tb - ta;
    });
    cb(apps);
  });
}

const itemDoc = (id: string) => doc(db, COL, id);

export async function getApplication(id: string): Promise<Application | null> {
  const snap = await getDoc(itemDoc(id));
  if (!snap.exists()) return null;
  return toApplication(snap.id, snap.data());
}

export function subscribeToApplication(
  id: string,
  cb: (app: Application | null) => void,
) {
  return onSnapshot(itemDoc(id), (snap) => {
    cb(snap.exists() ? toApplication(snap.id, snap.data()) : null);
  });
}

export async function updateApplicationStatus(
  id: string,
  status: Application["status"],
) {
  return updateDoc(itemDoc(id), { status });
}
