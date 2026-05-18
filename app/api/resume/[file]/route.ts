import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import {
  resumeDir,
  RESUME_NAME_RE,
  RESUME_CONTENT_TYPE,
} from "@/lib/resume-storage";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;

  // Only ever serve files matching our generated "<uuid>.<ext>" pattern.
  if (!RESUME_NAME_RE.test(file)) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const dir = path.resolve(resumeDir());
  const full = path.resolve(dir, file);

  // Defense in depth: the resolved path must stay directly inside the dir.
  if (path.dirname(full) !== dir) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  let bytes: Buffer;
  try {
    bytes = await readFile(full);
  } catch {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const ext = file.split(".").pop()!.toLowerCase();
  return new NextResponse(new Uint8Array(bytes), {
    status: 200,
    headers: {
      "Content-Type": RESUME_CONTENT_TYPE[ext] ?? "application/octet-stream",
      "Content-Disposition": `inline; filename="${file}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
