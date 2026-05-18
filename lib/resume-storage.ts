import path from "path";

/**
 * Absolute path to the folder where uploaded resumes are stored on the server.
 * Override with the RESUME_UPLOAD_DIR env var (recommended in production so the
 * files live on a persistent path outside the deploy directory).
 */
export function resumeDir(): string {
  return (
    process.env.RESUME_UPLOAD_DIR ||
    path.join(process.cwd(), "uploads", "resumes")
  );
}

// Stored files are always "<uuid>.<ext>" — used to reject path traversal and
// any request that is not for a file we created.
export const RESUME_NAME_RE = /^[0-9a-f-]{36}\.(pdf|doc|docx)$/i;

export const RESUME_CONTENT_TYPE: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};
