import { Timestamp } from "firebase/firestore";

export type EmploymentType =
  | "Full-Time"
  | "Part-Time"
  | "Contract"
  | "Internship";

export const EMPLOYMENT_TYPES: EmploymentType[] = [
  "Full-Time",
  "Part-Time",
  "Contract",
  "Internship",
];

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: EmploymentType;
  description: string;
  requirements: string[];
  responsibilities: string[];
  applyEmail: string;
  active: boolean;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export type JobInput = Omit<Job, "id" | "createdAt" | "updatedAt">;
