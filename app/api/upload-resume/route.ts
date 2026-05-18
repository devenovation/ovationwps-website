import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { resumeDir } from "@/lib/resume-storage";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

// Map of accepted MIME types to the extension we store the file under.
const ALLOWED: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
};

export async function POST(req: Request) {
  // Reject obviously oversized uploads before buffering them.
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared && declared > MAX_BYTES + 1024) {
    return NextResponse.json(
      { error: "File exceeds the 5 MB limit." },
      { status: 413 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "The file is empty." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File exceeds the 5 MB limit." },
      { status: 413 },
    );
  }

  const ext = ALLOWED[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Only PDF, DOC, or DOCX files are accepted." },
      { status: 400 },
    );
  }

  const filename = `${randomUUID()}.${ext}`;
  const dir = resumeDir();

  try {
    await mkdir(dir, { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, filename), bytes);
  } catch (err) {
    console.error("[upload-resume] failed to store file:", err);
    return NextResponse.json(
      { error: "Could not store the file. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, url: `/api/resume/${filename}` });
}
