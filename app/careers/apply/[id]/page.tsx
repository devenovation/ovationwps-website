import type { Metadata } from "next";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import ApplyClient from "./ApplyClient";
import { getJob } from "@/lib/firebase/jobs";
import { formatJobLocation, jobCityCountry } from "@/lib/firebase/types";
import { CAREERS_HERO_IMAGE } from "../../../constants";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ovationwps-website.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  let job = null;
  try {
    job = await getJob(id);
  } catch {
    job = null;
  }

  if (!job || !job.active) {
    return {
      metadataBase: new URL(SITE_URL),
      title: "Apply · Ovation Workplace Services",
      description: "Explore open roles and join the Ovation team.",
    };
  }

  const place = jobCityCountry(job.location) || formatJobLocation(job.location);
  const title = `${job.title}${place ? ` — ${place}` : ""} | Careers at Ovation`;
  const rawDesc = job.description.replace(/\s+/g, " ").trim();
  const description =
    (place ? `${job.department} · ${job.type} · ${place}. ` : `${job.department} · ${job.type}. `) +
    (rawDesc.length > 200 ? `${rawDesc.slice(0, 200).trimEnd()}…` : rawDesc);
  const url = `${SITE_URL}/careers/apply/${id}`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: "Ovation Workplace Services",
      title,
      description,
      images: [{ url: CAREERS_HERO_IMAGE, width: 1200, height: 630, alt: job.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [CAREERS_HERO_IMAGE],
    },
  };
}

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <Navbar />
      <main className="bg-white dark:bg-navy-deep">
        <ApplyClient jobId={id} />
      </main>
      <Footer />
    </>
  );
}
