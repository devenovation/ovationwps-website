import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    qualities: [75, 95],
  },
  // Resumes are read/written to an absolute path *outside* the project
  // (RESUME_UPLOAD_DIR). The dynamic fs paths in these routes make Next.js's
  // file tracer glob the whole project (~24k files) into the bundle. These
  // routes have no real project-file deps, so exclude them from tracing.
  outputFileTracingExcludes: {
    "/api/upload-resume": ["**/*"],
    "/api/resume/[file]": ["**/*"],
  },
};

export default nextConfig;
