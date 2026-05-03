import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function isProcessRunning(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function readPidFromFile(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8").trim();
    const pid = Number.parseInt(raw, 10);
    return Number.isFinite(pid) ? pid : null;
  } catch {
    return null;
  }
}

function readPidFromDevLog(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    // Next prints e.g. "- PID:          18611"
    const m = raw.match(/^\s*-\s*PID:\s*(\d+)\s*$/m);
    if (!m) return null;
    const pid = Number.parseInt(m[1], 10);
    return Number.isFinite(pid) ? pid : null;
  } catch {
    return null;
  }
}

async function stopPid(pid) {
  if (!isProcessRunning(pid)) return;

  try {
    process.kill(pid, "SIGTERM");
  } catch {
    // Ignore (no permission / already gone)
    return;
  }

  const deadlineMs = Date.now() + 3500;
  while (Date.now() < deadlineMs) {
    if (!isProcessRunning(pid)) return;
    // eslint-disable-next-line no-await-in-loop
    await sleep(150);
  }

  try {
    process.kill(pid, "SIGKILL");
  } catch {
    // ignore
  }
}

async function ensureNoPreviousNextDev() {
  const projectRoot = process.cwd();

  // Known locations that may exist depending on Next version.
  const candidates = [
    path.join(projectRoot, ".next", "dev-server.pid"),
    path.join(projectRoot, ".next", "dev", "dev-server.pid"),
    path.join(projectRoot, ".next", "dev", "next-dev-server.pid"),
    path.join(projectRoot, ".next", "dev", "next-dev.pid"),
    path.join(projectRoot, ".next", "dev", "logs", "next-development.log"),
  ];

  let pid = null;
  for (const p of candidates) {
    if (!fs.existsSync(p)) continue;
    pid =
      p.endsWith(".log") ? readPidFromDevLog(p) : readPidFromFile(p);
    if (pid) break;
  }

  if (pid) {
    await stopPid(pid);
  }

  // If a stale lock folder exists, clear it so `next dev` doesn't trip.
  // This is safe after stopping the process (or if it was already gone).
  try {
    fs.rmSync(path.join(projectRoot, ".next", "dev"), {
      recursive: true,
      force: true,
    });
  } catch {
    // ignore
  }
}

await ensureNoPreviousNextDev();

const child = spawn("next", ["dev", ...process.argv.slice(2)], {
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 0);
});
