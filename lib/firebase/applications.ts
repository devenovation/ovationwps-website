import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
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
