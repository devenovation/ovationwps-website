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

export interface JobLocation {
  address1: string;
  address2: string;
  area: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export const EMPTY_JOB_LOCATION: JobLocation = {
  address1: "",
  address2: "",
  area: "",
  city: "",
  state: "",
  country: "",
  pincode: "",
};

export interface Job {
  id: string;
  title: string;
  department: string;
  location: JobLocation;
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

/** Normalises a location value (legacy string or structured object) to a JobLocation. */
export function toJobLocation(value: unknown): JobLocation {
  if (typeof value === "string") {
    // Legacy records stored a single "City, Country" string.
    const [city = "", country = ""] = value.split(",").map((s) => s.trim());
    return { ...EMPTY_JOB_LOCATION, city, country };
  }
  if (value && typeof value === "object") {
    const v = value as Partial<JobLocation>;
    return {
      address1: v.address1 ?? "",
      address2: v.address2 ?? "",
      area: v.area ?? "",
      city: v.city ?? "",
      state: v.state ?? "",
      country: v.country ?? "",
      pincode: v.pincode ?? "",
    };
  }
  return { ...EMPTY_JOB_LOCATION };
}

/** Full, human-readable address line, e.g. "12 MG Rd, Indiranagar, Bengaluru, Karnataka, India, 560038". */
export function formatJobLocation(value: unknown): string {
  const loc = toJobLocation(value);
  return [
    loc.address1,
    loc.address2,
    loc.area,
    loc.city,
    loc.state,
    loc.country,
    loc.pincode,
  ]
    .map((s) => s.trim())
    .filter(Boolean)
    .join(", ");
}

/** Short "City, Country" label used for tags and filters. Falls back to the full address. */
export function jobCityCountry(value: unknown): string {
  const loc = toJobLocation(value);
  const short = [loc.city, loc.country].map((s) => s.trim()).filter(Boolean);
  return short.length > 0 ? short.join(", ") : formatJobLocation(value);
}
